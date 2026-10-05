import {
  Check,
  ChevronDown,
  type LucideIcon,
  MoveDownLeft,
  MoveUpRight,
  Network,
  Plus,
  Search,
  Unlink,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { useGetNotes } from "@/features/notes/hooks.ts";
import {
  useCreateLink,
  useDeleteLink,
  useGetLinksByNoteId,
  useGetLinkTypes,
} from "@/features/links/hooks.ts";
import type {
  CreateLink,
  LinkType,
  Link as NoteLink,
} from "@/features/links/types.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
import { getStringPreview } from "@/lib/utils.ts";

const NoteConnections = ({ noteId }: { noteId: number }) => {
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
    const link: CreateLink = {
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
                onChange={(newType: string) => setTypeName(newType)}
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
        <NoteLinks links={incomingLinks} icon={MoveDownLeft} type="incoming" />
        <NoteLinks links={outgoingLinks} icon={MoveUpRight} type="outgoing" />
      </div>
    </div>
  );
};

export default NoteConnections;

interface LinkTypeSelectorProps {
  typeName: string;
  types: LinkType[];
  onChange: (newType: string) => void;
}

const LinkTypeSelector = ({
  typeName,
  types,
  onChange,
}: LinkTypeSelectorProps) => {
  const [typeSearch, setTypeSearch] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleTypeChange = (typeName: string) => {
    onChange(typeName);
    setIsTypeOpen(false);
    setTypeSearch("");
  };

  return (
    <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
      <div className="">
        <PopoverTrigger
          render={
            <Button variant="ghost" size="sm">
              {typeName}
              <ChevronDown size={14} className="text-slate-400" />
            </Button>
          }
        />
      </div>
      <PopoverContent className="w-64 p-1" align="start">
        <Command>
          <CommandInput
            placeholder="Select or create a type"
            onValueChange={setTypeSearch}
          />
          <CommandList>
            <CommandEmpty>
              <Button
                onClick={() => handleTypeChange(typeSearch)}
                variant="secondary"
              >
                <Plus size={14} className="mr-2 shrink-0" />
                <span className="truncate">Create Type "{typeSearch}"</span>
              </Button>
            </CommandEmpty>
            <CommandGroup heading="Existing Types">
              {types.map((t) => (
                <CommandItem
                  value={t.name}
                  onSelect={() => handleTypeChange(t.name)}
                >
                  <span className="flex-1">{t.name}</span>
                  {typeName === t.name && (
                    <Check size={14} className="text-slate-600" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface NoteLinksProps {
  links: NoteLink[];
  icon: LucideIcon;
  type: "incoming" | "outgoing";
}

const NoteLinks = ({ links, icon, type }: NoteLinksProps) => {
  const { deleteLink } = useDeleteLink();

  const Icon = icon;
  const isIncoming = type === "incoming";
  const label = isIncoming ? "Incoming Links" : "Outgoing Links";

  const handleDeleteLink = async (linkId: number) => {
    await deleteLink(linkId);
  };

  return (
    <div className="bg-bg-sidebar border border-border-subtle w-full rounded-md px-4 py-2">
      <div className="flex flex-row items-center gap-2 mb-4">
        <Icon className="text-content-muted" size={12} />
        <span className="text-sm text-content-muted">{label}</span>
      </div>
      {links.map((link) => {
        const otherNote = isIncoming ? link.source : link.target;
        return (
          <div
            key={link.id}
            className="flex flex-row items-center justify-between border border-border-subtle rounded-md px-2 py-1 bg w-full group bg-bg-editor hover:shadow-sm"
          >
            <Link
              key={link.id}
              to={`/n/${otherNote.id}`}
              className="w-full flex flex-col"
            >
              <div className="flex flex-row items-center justify-between">
                <h1 className="font-bold text-base/6">
                  {getStringPreview(25, otherNote.title, "Untitled")}
                </h1>

                <div className="px-2 py-0.5 rounded-sm flex bg-primary-bg">
                  <span className="text-xs text-primary">
                    {link.link_type.name}
                  </span>
                </div>
              </div>
              <span className="text-content-muted text-sm">
                {getStringPreview(35, otherNote.content, "No content yet...")}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 hover:text-destructive"
              onClick={() => handleDeleteLink(link.id)}
            >
              <Unlink size={10} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
