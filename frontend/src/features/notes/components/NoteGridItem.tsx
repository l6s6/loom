import { Link } from "react-router-dom";
import { isToday, isYesterday, format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { capitalizeFirstLetter, getStringPreview } from "@/lib/utils.ts";
import { type Note, NOTE_STATUS_CONFIG } from "@/features/notes/types.ts";

interface NoteListItemProps {
  note: Note;
}

const NoteGridItem = ({ note }: NoteListItemProps) => {
  const contentPreview = getStringPreview(
    35,
    note.content,
    "No content yet...",
  );
  const titlePreview = getStringPreview(25, note.title, "Untitled");
  const modifiedAt: Date = new Date(note.modified_at);
  let formattedModifiedAt: string;
  if (isToday(modifiedAt)) {
    formattedModifiedAt = `Today at ${format(modifiedAt, "HH:mm")}`;
  } else if (isYesterday(modifiedAt)) {
    formattedModifiedAt = `Yesterday at ${format(modifiedAt, "HH:mm")}`;
  } else {
    formattedModifiedAt = format(modifiedAt, "MMM dd");
  }
  return (
    <Link to={`/n/${note.id}`}>
      <div className="w-full border border-border-subtle rounded-md px-4 py-2">
        <div className="flex flex-row items-center justify-between mb-2">
          <div className="flex flex-row gap-2">
            <div
              className={`px-2 py-1 rounded-sm flex flex-row items-center gap-1  ${NOTE_STATUS_CONFIG[note.status].bgColor}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${NOTE_STATUS_CONFIG[note.status].dotColor}`}
              />
              <span
                className={`text-xs ${NOTE_STATUS_CONFIG[note.status].textColor}`}
              >
                {note.status}
              </span>
            </div>
            <div className="px-2 py-1 rounded-sm flex flex-row items-center gap-1 bg-primary-bg">
              <MessageCircle className="text-primary" size={12} />
              <span className="text-xs text-primary">
                {capitalizeFirstLetter(note.note_type.name)}
              </span>
            </div>
          </div>
          <span className="text-xs text-content-muted">
            {formattedModifiedAt}
          </span>
        </div>
        <h1 className="font-bold">{titlePreview}</h1>
        <span className="text-content-muted text-sm">{contentPreview}</span>
        <div className="flex flex-row overflow-clip gap-1 mt-2">
          {note.tags.map((tag) => (
            <div className="px-2 py-1 border border-border-subtle rounded-sm flex bg-bg-sidebar">
              <span className="text-xs text-content-muted">#{tag.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default NoteGridItem;
