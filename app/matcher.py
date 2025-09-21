from __future__ import annotations

import math
import random
from collections import defaultdict, Counter
from dataclasses import dataclass
from typing import Dict, List, Optional, Set, Tuple

from sqlmodel import select

from .database import get_session
from .models import (
    Group,
    GroupMember,
    Interest,
    PairHistory,
    Session,
    SessionRegistration,
    SpeakingStyle,
    User,
    UserInterest,
    normalize_pair,
)


@dataclass
class RegisteredUser:
    user: User
    primary_interest_id: Optional[int]
    secondary_interest_ids: Set[int]


def fetch_registered_users(session_id: int) -> List[RegisteredUser]:
    with get_session() as db:
        registrations = db.exec(
            select(SessionRegistration).where(SessionRegistration.session_id == session_id)
        ).all()
        user_ids = [r.user_id for r in registrations]
        if not user_ids:
            return []
        users = db.exec(select(User).where(User.id.in_(user_ids))).all()
        interests = db.exec(
            select(UserInterest).where(UserInterest.user_id.in_(user_ids))
        ).all()
        by_user: Dict[int, List[UserInterest]] = defaultdict(list)
        for ui in interests:
            by_user[ui.user_id].append(ui)
        out: List[RegisteredUser] = []
        for u in users:
            user_interests = by_user.get(u.id, [])
            prim = next((ui.interest_id for ui in user_interests if ui.is_primary), None)
            secs = {ui.interest_id for ui in user_interests if not ui.is_primary}
            out.append(RegisteredUser(user=u, primary_interest_id=prim, secondary_interest_ids=secs))
        return out


def _style_counts(users: List[User]) -> Counter:
    c: Counter = Counter()
    for u in users:
        c[u.speaking_style.value] += 1
    return c


def _score_candidate(
    candidate: RegisteredUser,
    current_group: List[RegisteredUser],
    weighting_enabled: bool,
    pair_penalties: Dict[Tuple[int, int], int],
    needed_styles: Set[SpeakingStyle],
) -> float:
    score = 0.0
    if weighting_enabled:
        # shared interests with existing group members
        for member in current_group:
            shared = len(candidate.secondary_interest_ids.intersection(member.secondary_interest_ids))
            if candidate.primary_interest_id is not None and member.primary_interest_id == candidate.primary_interest_id:
                shared += 1
            score += shared
    # penalize prior pairings
    for member in current_group:
        a, b = candidate.user.id, member.user.id
        key = (a, b) if a < b else (b, a)
        penalty = pair_penalties.get(key, 0)
        if penalty:
            score -= 2.0 * penalty
    # encourage needed styles
    if candidate.user.speaking_style in needed_styles:
        score += 1.0
    return score


def run_matching(session_id: int) -> List[Group]:
    with get_session() as db:
        session = db.get(Session, session_id)
        if not session:
            raise ValueError("Session not found")

        registered = fetch_registered_users(session_id)
        if not registered:
            return []

        # Build pair penalty map
        pair_penalties: Dict[Tuple[int, int], int] = {}
        history = db.exec(select(PairHistory)).all()
        for h in history:
            key = (h.user_a_id, h.user_b_id)
            pair_penalties[key] = h.times_grouped

        # Deterministic randomness per session if seed provided
        rnd = random.Random(session.random_seed) if session.random_seed is not None else random.Random()

        # Map users by primary interest (None bucket for missing)
        by_interest: Dict[Optional[int], List[RegisteredUser]] = defaultdict(list)
        for ru in registered:
            by_interest[ru.primary_interest_id].append(ru)

        # Shuffle within each interest
        for bucket in by_interest.values():
            rnd.shuffle(bucket)

        all_groups: List[List[RegisteredUser]] = []

        # Helper to consume users by speaking style
        def pop_by_style(pool: List[RegisteredUser], style: SpeakingStyle) -> Optional[RegisteredUser]:
            for i, ru in enumerate(pool):
                if ru.user.speaking_style == style:
                    return pool.pop(i)
            return None

        # Form groups within each primary interest bucket first
        for primary_interest_id, pool in by_interest.items():
            # Create style-specific queues
            speakers = [ru for ru in pool if ru.user.speaking_style == SpeakingStyle.speaker]
            listeners = [ru for ru in pool if ru.user.speaking_style == SpeakingStyle.listener]
            balanced = [ru for ru in pool if ru.user.speaking_style == SpeakingStyle.balanced]

            # Remove from pool since we split them
            pool.clear()

            def pop_any() -> Optional[RegisteredUser]:
                for q in (speakers, listeners, balanced):
                    if q:
                        return q.pop(0)
                return None

            while speakers or listeners or balanced:
                group: List[RegisteredUser] = []
                # Ensure at least one speaker and one listener when available
                sp = speakers.pop(0) if speakers else None
                if sp:
                    group.append(sp)
                li = listeners.pop(0) if listeners else None
                if li:
                    if not group or group[0].user.id != li.user.id:
                        group.append(li)
                # backfill missing role with balanced
                if not sp and balanced:
                    group.append(balanced.pop(0))
                if not li and balanced and len(group) < 2:
                    group.append(balanced.pop(0))

                # Fill remaining slots by score
                while len(group) < session.group_size:
                    # Build candidate pool
                    candidates: List[RegisteredUser] = speakers + listeners + balanced
                    if not candidates:
                        break
                    # Needed styles
                    current_styles = {m.user.speaking_style for m in group}
                    needed = set()
                    if SpeakingStyle.speaker not in current_styles and speakers:
                        needed.add(SpeakingStyle.speaker)
                    if SpeakingStyle.listener not in current_styles and listeners:
                        needed.add(SpeakingStyle.listener)
                    # Score candidates
                    best_score = -math.inf
                    best_idxs: List[Tuple[str, int]] = []  # (queue_name, index)
                    all_queues = {
                        "speakers": speakers,
                        "listeners": listeners,
                        "balanced": balanced,
                    }
                    for qname, q in all_queues.items():
                        for idx, cand in enumerate(q):
                            s = _score_candidate(cand, group, session.weighting_enabled, pair_penalties, needed)
                            # add slight randomness
                            if session.randomness:
                                s += rnd.uniform(-session.randomness, session.randomness)
                            if s > best_score:
                                best_score = s
                                best_idxs = [(qname, idx)]
                            elif s == best_score:
                                best_idxs.append((qname, idx))
                    if not best_idxs:
                        break
                    qname, idx = rnd.choice(best_idxs)
                    picked = all_queues[qname].pop(idx)
                    group.append(picked)

                all_groups.append(group)

        # Collect leftovers from None-bucket or incomplete groups and try to merge
        leftovers: List[RegisteredUser] = []
        # Pull groups smaller than 3 into leftovers for redistribution except if it's the only group
        retained_groups: List[List[RegisteredUser]] = []
        for g in all_groups:
            if len(g) >= max(3, session.group_size - 1):
                retained_groups.append(g)
            else:
                leftovers.extend(g)

        # Try to add leftovers to existing groups respecting group_size
        for ru in leftovers:
            # choose group with best score
            best_g_idx = None
            best_score = -math.inf
            for i, g in enumerate(retained_groups):
                if len(g) >= session.group_size:
                    continue
                current_styles = {m.user.speaking_style for m in g}
                needed = set()
                if SpeakingStyle.speaker not in current_styles:
                    needed.add(SpeakingStyle.speaker)
                if SpeakingStyle.listener not in current_styles:
                    needed.add(SpeakingStyle.listener)
                s = _score_candidate(ru, g, session.weighting_enabled, pair_penalties, needed)
                if session.randomness:
                    s += rnd.uniform(-session.randomness, session.randomness)
                if s > best_score:
                    best_score = s
                    best_g_idx = i
            if best_g_idx is not None:
                retained_groups[best_g_idx].append(ru)
            else:
                retained_groups.append([ru])

        # If any group still below 3 and we have >1 groups, rebalance by moving from the largest group
        if len(retained_groups) > 1:
            small_groups = [g for g in retained_groups if len(g) < 3]
            for sg in small_groups:
                largest = max(retained_groups, key=lambda x: len(x))
                if len(largest) - 1 >= max(3, session.group_size - 1):
                    sg.append(largest.pop())

        # Persist groups
        created_groups: List[Group] = []
        for members in retained_groups:
            if not members:
                continue
            # Choose primary interest as majority primary among group
            prim_counts: Counter = Counter(m.primary_interest_id for m in members if m.primary_interest_id)
            primary_interest_id = None
            if prim_counts:
                primary_interest_id = prim_counts.most_common(1)[0][0]

            # Secondary interests: intersection or top common tags
            secondary_counts: Counter = Counter()
            for m in members:
                secondary_counts.update(m.secondary_interest_ids)
            common_secondary = [iid for iid, cnt in secondary_counts.most_common(3) if cnt >= 2]
            secondary_csv = ",".join(str(i) for i in common_secondary) if common_secondary else None

            g = Group(session_id=session_id, primary_interest_id=primary_interest_id, secondary_interest_ids_csv=secondary_csv)
            db.add(g)
            db.commit()
            db.refresh(g)
            created_groups.append(g)

            for m in members:
                db.add(GroupMember(group_id=g.id, user_id=m.user.id))
            db.commit()

            # Update pair history for this group
            user_ids = [m.user.id for m in members]
            for i in range(len(user_ids)):
                for j in range(i + 1, len(user_ids)):
                    a, b = normalize_pair(user_ids[i], user_ids[j])
                    ph = db.get(PairHistory, (a, b))
                    if ph is None:
                        ph = PairHistory(user_a_id=a, user_b_id=b, times_grouped=1, last_session_id=session_id)
                        db.add(ph)
                    else:
                        ph.times_grouped += 1
                        ph.last_session_id = session_id
                    db.commit()

        return created_groups
