from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class SpeakingStyle(str, Enum):
    speaker = "Speaker"
    listener = "Listener"
    balanced = "Balanced"


class ConversationPreference(str, Enum):
    deep = "Deep"
    light = "Light"
    balanced = "Balanced"


class Interest(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    speaking_style: SpeakingStyle = Field(index=True)
    conversation_preference: ConversationPreference = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserInterest(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    interest_id: int = Field(foreign_key="interest.id", primary_key=True)
    is_primary: bool = Field(default=False, index=True)


class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    group_size: int = Field(default=4, index=True)
    randomness: float = Field(default=0.15)
    weighting_enabled: bool = Field(default=True)
    random_seed: Optional[int] = Field(default=None)


class SessionRegistration(SQLModel, table=True):
    session_id: int = Field(foreign_key="session.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    registered_at: datetime = Field(default_factory=datetime.utcnow)


class Group(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="session.id", index=True)
    primary_interest_id: Optional[int] = Field(foreign_key="interest.id", index=True)
    secondary_interest_ids_csv: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class GroupMember(SQLModel, table=True):
    group_id: int = Field(foreign_key="group.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)


class PairHistory(SQLModel, table=True):
    user_a_id: int = Field(foreign_key="user.id", primary_key=True)
    user_b_id: int = Field(foreign_key="user.id", primary_key=True)
    times_grouped: int = Field(default=0)
    last_session_id: Optional[int] = Field(default=None, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


def normalize_pair(user_id_1: int, user_id_2: int) -> tuple[int, int]:
    return (user_id_1, user_id_2) if user_id_1 < user_id_2 else (user_id_2, user_id_1)
