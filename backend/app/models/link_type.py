from typing import TYPE_CHECKING
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.note_link import NoteLink


class LinkType(Base):
    __tablename__ = "link_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    links: Mapped[list["NoteLink"]] = relationship(back_populates="link_type")