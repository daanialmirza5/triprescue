import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Make `app` importable regardless of the working directory alembic is
# invoked from (it's a sibling of this alembic/ directory under backend/).
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app import models  # noqa: E402,F401  (register every model on Base.metadata)
from app.config import get_settings  # noqa: E402
from app.database.base import Base  # noqa: E402

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Real target: the app's own SQLAlchemy models, not a static alembic.ini
# URL - so `alembic revision --autogenerate` compares against what the ORM
# actually defines today.
target_metadata = Base.metadata

# DATABASE_URL (via app.config.Settings, normalized for the psycopg3 driver)
# is the single source of truth for which database migrations run against -
# alembic.ini intentionally has no sqlalchemy.url of its own, so there's no
# stale/duplicate connection string to fall out of sync.
config.set_main_option("sqlalchemy.url", get_settings().resolved_database_url)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
