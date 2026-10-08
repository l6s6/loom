from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import urllib.request
from fastapi import BackgroundTasks

from core.config import settings
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


@app.post("/reset-demo")
def reset_demo(background_tasks: BackgroundTasks):
    if not settings.render_deploy_hook:
        return {"error": "Reset-URL not configured"}

    def trigger_render_hook():
        req = urllib.request.Request(settings.render_deploy_hook, method="POST")
        urllib.request.urlopen(req)

    background_tasks.add_task(trigger_render_hook)

    return {"message": "Reset successful."}