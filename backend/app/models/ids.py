import uuid


def generate_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:10]}"
