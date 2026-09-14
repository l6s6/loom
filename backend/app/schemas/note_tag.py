from pydantic import BaseModel


class NoteTagResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True