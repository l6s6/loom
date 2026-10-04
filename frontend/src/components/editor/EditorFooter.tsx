import { MoveDownLeft, MoveUpRight, Network } from "lucide-react";
import { Component, useState } from "react";
import { useNotesContext } from "@/context/NotesContext.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { getStringPreview } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useCreateLink, useGetLink } from "@/hooks/useLinks.ts";
import type { CreateNoteLink } from "@/types/noteLink.ts";
import type { Note } from "@/types/note.ts";
import { Link } from "react-router-dom";

class LinkListItem extends Component<{ note: Note }> {
  render() {
    return (
      <div className="w-full rounded-md px-2">
        <h1 className="font-bold">
          {getStringPreview(25, this.props.note.title, "Untitled")}
        </h1>
        <span className="text-content-muted text-sm">
          {getStringPreview(35, this.props.note.content, "No content yet...")}
        </span>
      </div>
    );
  }
}

const EditorFooter = ({ note }: { note: Note }) => {
  const { notes } = useNotesContext();
  const { links } = useGetLink();
  const { createLink } = useCreateLink();
  const [searchQuery, setSearchQuery] = useState("");

  const incomingLinks = [...links]
    .sort((a, b) => a.source.title.localeCompare(b.source.title))
    .filter((link) => link.target.id == note.id);
  const outgoingLinks = [...links]
    .sort((a, b) => a.target.title.localeCompare(b.target.title))
    .filter((link) => link.source.id == note.id);

  const filteredNotes = [...notes]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(
      (note) =>
        note.id !== note.id &&
        (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())),
    );

  const handleAddLink = async (target_id: number) => {
    const link: CreateNoteLink = {
      origin: "manual",
      target_id: target_id,
      source_id: note.id,
      link_type_name: "test",
    };
    await createLink(link);
    return;
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
      <div className="flex flex-row w-full gap-2">
        <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
          <div className="flex flex-row items-center gap-2  mb-4">
            <MoveDownLeft className="text-content-muted" size={12} />
            <span className="text-sm text-content-muted">Incoming Links</span>
          </div>
          {incomingLinks.map((link) => (
            <Link to={`/n/${link.source.id}`}>
              <div className="border border-border-subtle rounded-md px-2 py-1">
                <LinkListItem key={link.id} note={link.source} />
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
          <div className="flex flex-row items-center gap-2 mb-4">
            <MoveUpRight className="text-content-muted" size={12} />
            <span className="text-sm text-content-muted">Outgoing Links</span>
          </div>
          {outgoingLinks.map((link) => (
            <Link to={`/n/${link.target.id}`}>
              <div className="border border-border-subtle rounded-md px-2 py-1">
                <LinkListItem key={link.id} note={link.target} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorFooter;
