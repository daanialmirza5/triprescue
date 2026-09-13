import warnings

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from pydantic.warnings import UnsupportedFieldAttributeWarning

# pydantic 2.12+ added a heuristic warning intended to catch alias metadata
# misapplied via an `Annotated` type alias or a union member (see
# https://github.com/pydantic/pydantic/pull/12028). It is a false positive for
# aliases produced by `alias_generator` below (confirmed: pydantic's own
# maintainers closed https://github.com/pydantic/pydantic/issues/12362 - a
# report of this exact warning firing incorrectly - as "not planned"). Verified
# here that request/response camelCase aliasing works correctly regardless
# (existing tests assert real camelCase keys like `tripId`/`primaryNodeId` in
# response bodies); the warning only ever fires the first time a model built
# with `alias_generator` is validated/serialized through FastAPI's
# request/response pipeline specifically - never on direct model
# instantiation or `model_json_schema()` - and reproduces identically on
# Python 3.12 and 3.14 with pydantic 2.13.5, ruling out a Python-version
# cause. Suppressed narrowly (this one pydantic warning class only, not
# warnings broadly) rather than pinning a different pydantic/FastAPI version
# without evidence that doing so is necessary or safe.
warnings.filterwarnings("ignore", category=UnsupportedFieldAttributeWarning)


class CamelModel(BaseModel):
    """Base for response schemas: Python fields stay snake_case, JSON keys are
    camelCase to match the existing frontend types in src/types/index.ts exactly."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, from_attributes=True)
