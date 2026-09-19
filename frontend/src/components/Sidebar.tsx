import { Link, useMatch, useNavigate } from "react-router-dom";
import NoteListItem from "./NoteListItem.tsx";
import { useCreateNote, useDeleteNote } from "../hooks/useNotes.ts";
import { SquarePen } from "lucide-react";
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
import { useNotesContext } from "@/context/NotesContext.tsx";

const Sidebar = () => {
  const navigate = useNavigate();
  const match = useMatch("/n/:noteId");

  const urlNoteId = match?.params.noteId;

  const { notes, refetchNotes } = useNotesContext();
  const { createNote } = useCreateNote();
  const { deleteNote } = useDeleteNote();

  // Copy notes to prevent modifying it
  const filteredNotes = [...notes].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  const handleCreateNote = async () => {
    const newNote = await createNote();
    await refetchNotes();
    if (newNote) {
      navigate(`/n/${newNote.id}`);
    }
  };

  const handleDeleteNote = async (noteToDeleteIt: number) => {
    if (urlNoteId === noteToDeleteIt.toString()) {
      navigate("/");
    }
    await deleteNote(noteToDeleteIt);
    await refetchNotes();
  };

  return (
    <aside className="bg-bg-sidebar transition-all duration-300 w-sidebar flex flex-col h-full border-r border-border-subtle p-4">
      <div className="pl-4 h-16 items-center border-gray-300 flex flex-row justify-between">
        <span className="text-2xl font-bold">Notes</span>
        <SquarePen
          onClick={handleCreateNote}
          className="size-5 m-2 hover:cursor-pointer"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note) => (
          <ContextMenu key={note.id}>
            <ContextMenuTrigger>
              <Link to={`/n/${note.id}`} key={note.id}>
                <NoteListItem note={note} key={note.id} />
              </Link>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuLabel>File</ContextMenuLabel>
                <ContextMenuItem onClick={handleCreateNote}>
                  New File
                  <ContextMenuShortcut>Ctrl + N</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>
                  Cut
                  <ContextMenuShortcut>Ctrl + X</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Copy
                  <ContextMenuShortcut>Ctrl + C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  Paste
                  <ContextMenuShortcut>Ctrl + V</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  Delete
                  <ContextMenuShortcut>⌫</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        ))}

        {filteredNotes.length === 0 && (
          <p className="text-content-muted text-center mt-4">No notes found.</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
