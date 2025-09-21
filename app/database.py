from contextlib import contextmanager
from sqlmodel import SQLModel, create_engine, Session
from .config import DEFAULT_DB_URL


engine = create_engine(DEFAULT_DB_URL, echo=False)


def init_db() -> None:
    from . import models  # noqa: F401 - ensure models are imported for table creation
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Session:
    with Session(engine) as session:
        yield session
