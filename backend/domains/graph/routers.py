from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.database import get_db
from domains.graph.schemas import Graph

router = APIRouter(prefix="/graph", tags=["graph"])

@router.get("", response_model=Graph)
def get_graph(db: Session = Depends(get_db)):
    vertices = []
    edges = []
    return {"vertices": vertices, "edges": edges}