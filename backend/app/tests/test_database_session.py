import pytest
from app.config import Settings
from app.database.session import engine_kwargs_for, get_db


def test_engine_kwargs_sqlite():
    settings = Settings(environment="test")
    kwargs = engine_kwargs_for("sqlite:///./test.db", settings)
    assert kwargs == {"connect_args": {"check_same_thread": False}}


def test_engine_kwargs_postgres():
    settings = Settings(
        environment="production",
        db_pool_size=15,
        db_max_overflow=25,
        db_pool_recycle_seconds=1800,
    )
    kwargs = engine_kwargs_for("postgresql+psycopg://user:pass@localhost/db", settings)
    assert kwargs["pool_pre_ping"] is True
    assert kwargs["pool_size"] == 15
    assert kwargs["max_overflow"] == 25
    assert kwargs["pool_recycle"] == 1800


def test_get_db_yields_session_and_handles_cleanup():
    gen = get_db()
    session = next(gen)
    assert session is not None
    # complete the generator normally
    try:
        next(gen)
    except StopIteration:
        pass
