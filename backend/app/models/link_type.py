from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class NoteLink(Base):
    __tablename__ = "note_links"

    # Source -> Target
    source_id = Column(Integer, ForeignKey("notes.id"), primary_key=True)
    target_id = Column(Integer, ForeignKey("notes.id"), primary_key=True)
    source = relationship("Note", foreign_keys = [source_id],back_populates = "outgoing_links")
    target = relationship("Note", foreign_keys = [target_id], back_populates = "incoming_links")

    # Where does the link come from?
    # 'manual' / 'tag' / 'ai'
    origin = Column(String, default="manual")

    # What is the relation between the notes?
    # 'contradicts', 'answers', etc.
    link_type_id = Column(Integer, ForeignKey("link_types.id"))
    link_type = relationship("LinkType", back_populates="links")

class LinkType(Base):
    __tablename__ = "link_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    links = relationship("NoteLink", back_populates="link_type")
