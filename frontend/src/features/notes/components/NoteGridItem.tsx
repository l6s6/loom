import { Link } from "react-router-dom";
import { isToday, isYesterday, format } from "date-fns";
import { getStringPreview } from "@/lib/utils.ts";
import { type Note } from "@/features/notes/types.ts";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu.tsx";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

import { NOTE_STATUS_CONFIG } from "@/features/notes/types.ts";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

interface NoteListItemProps {
  note: Note;
  onCreate: UseMutateAsyncFunction<Note, Error>;
  onDelete: (noteId: string, currentUrl?: string) => Promise<void>;
}

const NoteGridItem = ({ note, onCreate, onDelete }: NoteListItemProps) => {
  const contentPreview = getStringPreview(
    50,
    note.content,
    "No content yet...",
  );
  const titlePreview = getStringPreview(35, note.title, "Untitled");
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
    <ContextMenu key={note.id}>
      <ContextMenuTrigger className="w-full h-full">
        <Link to={`/n/${note.id}`}>
          <Card className="hover:bg-bg-sidebar gap-4">
            <CardHeader>
              <CardTitle>{titlePreview}</CardTitle>
              <CardDescription>
                <div className="flex flex-row gap-4">
                  <span className="text-content-muted">
                    {formattedModifiedAt}
                  </span>
                  <div className="flex flex-row gap-2">
                    <div className="px-1 py-0.5 rounded-sm flex flex-row items-center gap-1 bg-primary-bg">
                      <span className="text-xs text-primary">
                        {note.note_type.name}
                      </span>
                    </div>
                    {note.tags.map((tag) => (
                      <div
                        key={tag.id}
                        className="px-1 py-0.5 border border-border-subtle rounded-sm flex bg-bg-sidebar"
                      >
                        <span className="text-xs text-content-muted">
                          #{tag.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardDescription>
              <CardAction>
                <div
                  className={`px-1 py-0.5 rounded-sm flex flex-row items-center gap-1  ${NOTE_STATUS_CONFIG[note.status].bgColor}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${NOTE_STATUS_CONFIG[note.status].dotColor}`}
                  />
                  <span
                    className={`text-xs capitalize ${NOTE_STATUS_CONFIG[note.status].textColor}`}
                  >
                    {note.status}
                  </span>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-content-muted">{contentPreview}</p>
            </CardContent>
          </Card>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>File</ContextMenuLabel>
          <ContextMenuItem onClick={() => onCreate()}>
            New File
            <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem disabled={true}>
            Cut
            <ContextMenuShortcut>Ctrl + X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled={true}>
            Copy
            <ContextMenuShortcut>Ctrl + C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled={true}>
            Paste
            <ContextMenuShortcut>Ctrl + V</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuItem
            variant="destructive"
            onClick={() => onDelete(note.id)}
          >
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default NoteGridItem;
