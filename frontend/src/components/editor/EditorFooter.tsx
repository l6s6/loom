import { MoveDownLeft, MoveUpRight, Network } from "lucide-react";
import { useMemo, useState } from "react";
import { useNotesContext } from "@/context/NotesContext.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useCreateLink, useGetLinks } from "@/hooks/useLinks.ts";
import type { CreateNoteLink } from "@/types/noteLink.ts";
import LinkListItem from "@/components/editor/LinkListItem.tsx";
import EditorLinks from "@/components/editor/EditorLinks.tsx";

const EditorFooter = ({ noteId }: { noteId: number }) => {
  const { notes } = useNotesContext();
  const { links, refetchLinks } = useGetLinks(noteId);
  const { createLink } = useCreateLink();
  const [searchQuery, setSearchQuery] = useState("");

  const incomingLinks = useMemo(
    () =>
      links
        .filter((link) => link.target.id === noteId)
        .sort((a, b) => a.source.title.localeCompare(b.source.title)),
    [links, noteId],
  );

  const outgoingLinks = useMemo(
    () =>
      links
        .filter((link) => link.source.id === noteId)
        .sort((a, b) => a.target.title.localeCompare(b.target.title)),
    [links, noteId],
  );

  const filteredNotes = [...notes]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(
      (note) =>
        note.id !== noteId &&
        !outgoingLinks.some((link) => link.target.id == note.id) &&
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())),
    );

  const handleAddLink = async (target_id: number) => {
    const link: CreateNoteLink = {
      origin: "manual",
      target_id: target_id,
      source_id: noteId,
      link_type_name: "test",
    };
    setSearchQuery("");
    await createLink(link);
    await refetchLinks();
  };

  return (
    <div className="flex flex-col py-4 border-border-subtle border-t">
      <div className="flex flex-row h-full items-center gap-4">
        <Network size={16} className="text-content-muted font-medium" />
        <h3 className={"text-sm truncate pr-2 text-content-muted font-bold"}>
          Connections
        </h3>
      </div>
      <div>
        <Command className="mt-4 px-0">
          <CommandInput
            placeholder="Search Notes to add Connections"
            onValueChange={setSearchQuery}
          />
          {searchQuery && (
            <ScrollArea className="max-h-72 rounded-md border mt-4">
              <CommandList>
                <CommandEmpty>
                  <span className="text-content-muted">No Notes found.</span>
                </CommandEmpty>
                <CommandGroup heading="Notes">
                  {filteredNotes.map((note) => (
                    <CommandItem
                      key={note.id}
                      value={note.title}
                      onSelect={() => handleAddLink(note.id)}
                    >
                      <LinkListItem note={note} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          )}
        </Command>
      </div>
      <div className="flex flex-row w-full gap-2 mt-2">
        <EditorLinks
          links={incomingLinks}
          refetch={refetchLinks}
          icon={MoveDownLeft}
          type="incoming"
        />
        <EditorLinks
          links={outgoingLinks}
          refetch={refetchLinks}
          icon={MoveUpRight}
          type="outgoing"
        />
      </div>
    </div>
  );
};

export default EditorFooter;
