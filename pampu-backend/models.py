from pydantic import BaseModel


class Lime(BaseModel):
    content: str
    expires: bool
