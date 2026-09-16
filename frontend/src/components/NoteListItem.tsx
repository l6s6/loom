import type { Note } from "../types/note.ts";

interface NoteListItemProps {
  note: Note;
}

const NoteListItem = ({ note }: NoteListItemProps) => {
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
    <div className="flex flex-col hover:bg-gray-100 rounded-md px-6 py-2">
      <span className="font-bold">{titlePreview}</span>
      <span className="text-gray-500">{contentPreview}</span>
    </div>
  );
};

export default NoteListItem;
