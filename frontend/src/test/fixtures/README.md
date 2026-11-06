Test fixtures captured from the real FastAPI backend (seeded Ladakh trip, live
weather and Mastodon signals off, no LLM keys), so page tests exercise the
actual API contract. Regenerate after changing a response schema:

    cd backend && python scripts/make_frontend_fixtures.py ../frontend/src/test/fixtures/ladakh.json
