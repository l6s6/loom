from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from domains.notes.routers import router as notes_router
from domains.links.routers import router as links_router


app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://loom-nu-three.vercel.app",
    "https://loom-loom19.vercel.app",
    "https://loom-git-main-loom19.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(links_router)
app.include_router(notes_router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}