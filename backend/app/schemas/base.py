from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base for response schemas: Python fields stay snake_case, JSON keys are
    camelCase to match the existing frontend types in src/types/index.ts exactly."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
