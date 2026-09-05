from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import get_settings

settings = get_settings()

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}

engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    except Exception:
        # A route/service raised mid-request (e.g. partway through mutating
        # nodes/edges in apply_recovery, before its own db.commit()). Roll
        # back explicitly rather than relying on close()-without-commit to
        # discard the pending changes - this is what actually guarantees "no
        # half-applied recovery" rather than leaving it as an accident of
        # SQLAlchemy defaults.
        db.rollback()
        raise
    finally:
        db.close()
