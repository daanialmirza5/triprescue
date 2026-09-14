from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import Settings, get_settings


def engine_kwargs_for(resolved_url: str, settings: Settings) -> dict:
    """Splits out the connect_args/pool tuning `create_engine` needs, kept as
    its own pure function (rather than inline at import time) so it can be
    unit-tested directly against both a sqlite:// and a postgresql+psycopg://
    URL without constructing a real engine or a real database.

    Pool sizing only makes sense for a real server-side database (SQLite's
    default pool classes - SingletonThreadPool for :memory:, NullPool for a
    file - don't accept pool_size/max_overflow at all, so passing them would
    raise). pool_pre_ping matters specifically for a hosted Postgres like
    Supabase, whose connection pooler can silently drop idle connections;
    without it, the first query on a stale connection fails outright instead
    of transparently reconnecting.
    """
    if resolved_url.startswith("sqlite"):
        return {"connect_args": {"check_same_thread": False}}
    return {
        "connect_args": {},
        "pool_pre_ping": True,
        "pool_size": settings.db_pool_size,
        "max_overflow": settings.db_max_overflow,
        "pool_recycle": settings.db_pool_recycle_seconds,
    }


settings = get_settings()
resolved_url = settings.resolved_database_url

engine = create_engine(resolved_url, **engine_kwargs_for(resolved_url, settings))
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
