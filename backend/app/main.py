from fastapi import FastAPI

from app.db.database import engine, Base

#from routers import notes

app = FastAPI()

#app.include_router(notes.router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}