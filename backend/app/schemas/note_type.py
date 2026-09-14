from pydantic import BaseModel

class NoteTypeResponse(BaseModel):
    id: int
    name: str
    class Config:
        from_attributes = True

class NoteTypeUpdate(BaseModel):
    name: str