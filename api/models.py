from pydantic import BaseModel
from enum import Enum


class ContentType(Enum):
    TEXT = "text"
    IMAGE = "image"  # only png atm
    FILE = "file"


class Bookmark(BaseModel):
    snippet: str
    content_type: str
    metadata: dict = {}
    key: str = None
