import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import NoteGridItem from "@/features/notes/components/NoteGridItem.tsx";
import { useState } from "react";
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
import { useMatch } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Search } from "lucide-react";
import {
  useCreateAndNavigateNote,
  useDeleteNote,
  useGetNotes,
} from "@/features/notes/hooks.ts";

export function App() {
  const { notes } = useGetNotes();
  const { createAndNavigate } = useCreateAndNavigateNote();
  const { deleteNote } = useDeleteNote();

  const match = useMatch("/n/:noteId");
  const urlNoteId = match?.params.noteId;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = [...notes]
    .sort((a, b) => a.modified_at.localeCompare(b.modified_at))
    .reverse()
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some((tag) =>
          `#${tag.name.toLowerCase()}`.includes(searchQuery.toLowerCase()),
        ),
    );

  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Your Notes
      </h1>
      <Command>
        <InputGroup className="w-full">
          <InputGroupInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            {filteredNotes.length} results
          </InputGroupAddon>
        </InputGroup>
        <CommandList className="max-h-full mt-4">
          <CommandEmpty>
            <span className="text-content-muted">No Notes found.</span>
          </CommandEmpty>

          <CommandGroup className="**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-1 md:**:[[cmdk-group-items]]:grid-cols-2 **:[[cmdk-group-items]]:gap-2">
            {/* Use [&>svg]:hidden on CommandItem to hide Check Mark placeholder  */}
            {filteredNotes.map((note) => (
              <CommandItem key={note.id} className="p-0 w-full [&>svg]:hidden">
                <ContextMenu key={note.id}>
                  <ContextMenuTrigger className="w-full h-full">
                    <NoteGridItem note={note} key={note.id} />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuGroup>
                      <ContextMenuLabel>File</ContextMenuLabel>
                      <ContextMenuItem onClick={() => createAndNavigate()}>
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
                        onClick={() => {
                          deleteNote(note.id, urlNoteId);
                        }}
                      >
                        Delete
                        <ContextMenuShortcut>⌫</ContextMenuShortcut>
                      </ContextMenuItem>
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenu>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CenterContainer>
  );
}
