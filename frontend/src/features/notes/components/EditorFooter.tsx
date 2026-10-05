import { MoveDownLeft, MoveUpRight, Network, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import EditorLinks from "@/features/links/components/EditorLinks.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import LinkTypeSelector from "@/features/links/components/LinkTypeSelector.tsx";
import { useGetNotes } from "@/features/notes/hooks.ts";
import {
  useCreateLink,
  useGetLinksByNoteId,
  useGetLinkTypes,
} from "@/features/links/hooks.ts";
import type { CreateNoteLink } from "@/features/links/types.ts";

const EditorFooter = ({ noteId }: { noteId: number }) => {
  const { notes } = useGetNotes();
  const { links } = useGetLinksByNoteId(noteId);
  const { types } = useGetLinkTypes();
  const { createLink } = useCreateLink();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeName, setTypeName] = useState("relates to");

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
      link_type_name: typeName,
    };
    setSearchQuery("");
    await createLink(link);
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
          <InputGroup className="w-full">
            <InputGroupInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Notes to add Connections"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <LinkTypeSelector
                typeName={typeName}
                types={types}
                onChange={(newType) => setTypeName(newType)}
              />
            </InputGroupAddon>
          </InputGroup>
          {searchQuery && (
            <ScrollArea className="max-h-72 rounded-md border mt-4">
              <CommandList className="p-2">
                <CommandEmpty className="p-0">
                  <span className="text-content-muted">No Notes found.</span>
                </CommandEmpty>
                <CommandGroup className="p-0">
                  {filteredNotes.map((note) => (
                    <CommandItem
                      key={note.id}
                      value={note.title}
                      onSelect={() => handleAddLink(note.id)}
                    >
                      {note.title}
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
          icon={MoveDownLeft}
          type="incoming"
        />
        <EditorLinks links={outgoingLinks} icon={MoveUpRight} type="outgoing" />
      </div>
    </div>
  );
};

export default EditorFooter;
