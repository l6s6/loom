from pydantic import BaseModel, ConfigDict


class NoteTypeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str

class NoteTypeUpdate(BaseModel):
    name: str