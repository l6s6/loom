from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import notes, note_links, note_types, note_tags

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)
app.include_router(note_types.router)
app.include_router(note_tags.router)
#app.include_router(note_links.router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}