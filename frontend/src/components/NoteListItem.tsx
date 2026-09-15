import type { Note } from "../types/note.ts";

interface NoteListItemProps {
  note: Note;
}

const NoteListItem = ({ note }: NoteListItemProps) => {
  return <li>{note.title}</li>;
};

export default NoteListItem;
