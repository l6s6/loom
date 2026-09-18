import type { Note } from "../types/note.ts";
import { useLocation } from "react-router-dom";

interface NoteListItemProps {
  note: Note;
}

const NoteListItem = ({ note }: NoteListItemProps) => {
  const location = useLocation();

  // Get the last part of the path (e.g., "profile" from "/user/profile")
  const noteId = location.pathname.split("/").filter(Boolean).pop();
  const isActiveNote = noteId === note.id.toString();

  const limit = 30;
  const contentPreview =
    note.content.length > limit
      ? note.content.substring(0, limit) + "..."
      : note.content;
  const titlePreview =
    note.title.length > limit
      ? note.title.substring(0, limit) + "..."
      : note.title;
  return (
    <div
      className={`flex flex-col hover:bg-bg-sidebar-hover border border-transparent transition-all rounded-md px-4 py-2 my-1 ${isActiveNote && `bg-bg-sidebar-hover`}`}
    >
      <span className="font-bold">{titlePreview}</span>
      <span className="text-content-muted">{contentPreview}</span>
    </div>
  );
};

export default NoteListItem;
