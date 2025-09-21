from __future__ import annotations

from typing import List, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlmodel import select

from .config import DEFAULT_GROUP_SIZE
from .database import get_session, init_db
from .matcher import run_matching
from .models import (
    ConversationPreference,
    Group,
    GroupMember,
    Interest,
    Session,
    SessionRegistration,
    SpeakingStyle,
    User,
    UserInterest,
)


app = FastAPI(title="Dinner Meetup Matcher")


@app.on_event("startup")
def on_startup() -> None:
    init_db()


class InterestCreate(BaseModel):
    name: str


class UserCreate(BaseModel):
    name: str
    speaking_style: SpeakingStyle
    conversation_preference: ConversationPreference
    primary_interest_id: Optional[int] = None
    secondary_interest_ids: Optional[List[int]] = None


class SessionCreate(BaseModel):
    name: str
    group_size: Optional[int] = DEFAULT_GROUP_SIZE
    randomness: Optional[float] = 0.15
    weighting_enabled: Optional[bool] = True
    random_seed: Optional[int] = None


class RegisterRequest(BaseModel):
    user_id: int


class MatchResponseGroup(BaseModel):
    group_id: int
    user_ids: List[int]
    primary_interest_id: Optional[int]
    secondary_interest_ids: List[int]
    speaking_style_distribution: dict


@app.get("/interests", response_model=List[Interest])
def list_interests() -> List[Interest]:
    with get_session() as db:
        return db.exec(select(Interest)).all()


@app.post("/interests", response_model=Interest)
def create_interest(payload: InterestCreate) -> Interest:
    with get_session() as db:
        existing = db.exec(select(Interest).where(Interest.name == payload.name)).first()
        if existing:
            return existing
        i = Interest(name=payload.name)
        db.add(i)
        db.commit()
        db.refresh(i)
        return i


@app.post("/users", response_model=User)
def create_user(payload: UserCreate) -> User:
    with get_session() as db:
        u = User(name=payload.name, speaking_style=payload.speaking_style, conversation_preference=payload.conversation_preference)
        db.add(u)
        db.commit()
        db.refresh(u)
        # interests
        if payload.primary_interest_id:
            db.add(UserInterest(user_id=u.id, interest_id=payload.primary_interest_id, is_primary=True))
        for iid in payload.secondary_interest_ids or []:
            if payload.primary_interest_id and iid == payload.primary_interest_id:
                continue
            db.add(UserInterest(user_id=u.id, interest_id=iid, is_primary=False))
        db.commit()
        return u


@app.post("/sessions", response_model=Session)
def create_session(payload: SessionCreate) -> Session:
    with get_session() as db:
        s = Session(
            name=payload.name,
            group_size=payload.group_size or DEFAULT_GROUP_SIZE,
            randomness=payload.randomness if payload.randomness is not None else 0.15,
            weighting_enabled=payload.weighting_enabled if payload.weighting_enabled is not None else True,
            random_seed=payload.random_seed,
        )
        db.add(s)
        db.commit()
        db.refresh(s)
        return s


@app.post("/sessions/{session_id}/register")
def register_user(session_id: int, payload: RegisterRequest) -> dict:
    with get_session() as db:
        s = db.get(Session, session_id)
        u = db.get(User, payload.user_id)
        if not s or not u:
            raise HTTPException(404, detail="Session or user not found")
        existing = db.get(SessionRegistration, (session_id, payload.user_id))
        if existing:
            return {"status": "already_registered"}
        db.add(SessionRegistration(session_id=session_id, user_id=payload.user_id))
        db.commit()
        return {"status": "registered"}


@app.post("/sessions/{session_id}/match")
def run_match(session_id: int) -> dict:
    try:
        groups = run_matching(session_id)
    except ValueError as e:
        raise HTTPException(404, detail=str(e)) from e
    return {"groups_created": len(groups)}


@app.get("/sessions/{session_id}/groups", response_model=List[MatchResponseGroup])
def get_groups(session_id: int) -> List[MatchResponseGroup]:
    with get_session() as db:
        groups = db.exec(select(Group).where(Group.session_id == session_id)).all()
        results: List[MatchResponseGroup] = []
        for g in groups:
            members = db.exec(select(GroupMember).where(GroupMember.group_id == g.id)).all()
            user_ids = [m.user_id for m in members]
            users = db.exec(select(User).where(User.id.in_(user_ids))).all()
            style_counts = {}
            for u in users:
                key = u.speaking_style.value
                style_counts[key] = style_counts.get(key, 0) + 1
            secondary = [int(i) for i in g.secondary_interest_ids_csv.split(",")] if g.secondary_interest_ids_csv else []
            results.append(
                MatchResponseGroup(
                    group_id=g.id,
                    user_ids=user_ids,
                    primary_interest_id=g.primary_interest_id,
                    secondary_interest_ids=secondary,
                    speaking_style_distribution=style_counts,
                )
            )
        return results
