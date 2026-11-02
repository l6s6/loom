"""FastAPI application entry point for the backend service.

This module initializes the API, configures cross-origin access for the frontend,
registers domain routers, and exposes a small demo reset endpoint that triggers
an external deployment webhook when configured.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import urllib.request
from fastapi import BackgroundTasks

from core.config import settings
from domains.notes.routers import router as notes_router
from domains.graph.routers import router as graph_router
from domains.links.routers import router as links_router


app = FastAPI()
"""The main FastAPI application instance used to serve all API routes."""

origins = [
    "http://localhost:5173",
    "https://loom-nu-three.vercel.app",
    "https://loom-loom19.vercel.app",
    "https://loom-git-main-loom19.vercel.app",
]
"""Allowed frontend origins for CORS requests.

These URLs represent local development and deployed frontend environments
that are permitted to access the backend API.
"""

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""Enable CORS for the frontend.

This allows browser clients from the configured origins to access API endpoints
with credentials and standard headers.
"""

app.include_router(graph_router)
"""Register the graph-related API routes."""

app.include_router(links_router)
"""Register the link-related API routes."""

app.include_router(notes_router)
"""Register the note-related API routes."""


@app.get("/")
def read_root():
    """Return a simple health-check style response for the API root.

    Returns:
        dict: A JSON object with a welcome message.
    """
    return {"message": "Hello World"}


@app.post("/reset-demo")
def reset_demo(background_tasks: BackgroundTasks):
    """Trigger a deployment reset webhook for the demo environment.

    If the Render deploy hook is not configured, the endpoint returns an error
    instead of attempting the external request.

    Args:
        background_tasks (BackgroundTasks): FastAPI utility for scheduling
            asynchronous work after the response is sent.

    Returns:
        dict: Success or configuration error message.
    """
    if not settings.render_deploy_hook:
        return {"error": "Reset-URL not configured"}

    def trigger_render_hook():
        """Send a POST request to the configured Render deploy hook."""
        req = urllib.request.Request(settings.render_deploy_hook, method="POST")
        urllib.request.urlopen(req)

    background_tasks.add_task(trigger_render_hook)

    return {"message": "Reset successful."}