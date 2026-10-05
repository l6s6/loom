import { useState } from "react";
import {
  type Note,
  NOTE_STATUS_CONFIG,
  type NoteStatus,
  type NoteTag,
  type NoteType,
} from "@/features/notes/types.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Check, ChevronDown, Hash, Plus, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";

interface NoteMetaBarProps {
  initialNote: Note;
  onStatusChange: (newStatus: string) => void;
  types: NoteType[];
  onTypeChange: (newType: string) => void;
  availableTags: NoteTag[];
  onAddTag: (name: string) => void;
  onRemoveTag: (tagToRemove: string) => void;
}

const NoteMetaBar = ({
  initialNote,
  onStatusChange,
  types,
  onTypeChange,
  availableTags,
  onAddTag,
  onRemoveTag,
}: NoteMetaBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <StatusSelector status={initialNote.status} onChange={onStatusChange} />
      <NoteTypeSelector
        typeName={initialNote.note_type.name}
        types={types}
        onChange={onTypeChange}
      />
      <TagSelector
        tags={initialNote.tags}
        availableTags={availableTags}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
      />
    </div>
  );
};

export default NoteMetaBar;

interface StatusSelectorProps {
  status: NoteStatus;
  onChange: (newStatus: string) => void;
}

const StatusSelector = ({ status, onChange }: StatusSelectorProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setIsStatusOpen(false);
    onChange(newStatus);
  };

  return (
    <DropdownMenu onOpenChange={setIsStatusOpen} open={isStatusOpen}>
      <div className="pr-2 border-r border-border-subtle">
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className={`${NOTE_STATUS_CONFIG[status].bgColor}
              ${NOTE_STATUS_CONFIG[status].hoverColor}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${NOTE_STATUS_CONFIG[status].dotColor}`}
              />
              <span className={NOTE_STATUS_CONFIG[status].textColor}>
                {NOTE_STATUS_CONFIG[status].label}
              </span>
              <ChevronDown
                size={14}
                className={NOTE_STATUS_CONFIG[status].textColor}
              />
            </Button>
          }
        />
      </div>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={status}
            onValueChange={(value) => handleStatusChange(value)}
          >
            {(
              Object.entries(NOTE_STATUS_CONFIG) as [
                NoteStatus,
                (typeof NOTE_STATUS_CONFIG)[NoteStatus],
              ][]
            ).map(([key, config]) => (
              <DropdownMenuRadioItem value={key}>
                <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
                <span className="flex-1">{config.label}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface TagSelectorProps {
  tags: NoteTag[];
  availableTags: NoteTag[];
  onAdd: (name: string) => void;
  onRemove: (tagToRemove: string) => void;
}

const TagSelector = ({
  tags,
  availableTags,
  onAdd,
  onRemove,
}: TagSelectorProps) => {
  const [tagSearch, setTagSearch] = useState("");
  const [isTagOpen, setIsTagOpen] = useState(false);

  const handleAddTag = (tagName: string) => {
    onAdd(tagName);
    setTagSearch("");
    setIsTagOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Selected Tags */}
      {tags
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((tag) => (
          <span
            key={tag.id}
            className="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 flex items-center gap-1 group"
          >
            <Hash
              size={12}
              className="text-slate-400 group-hover:text-slate-500"
            />
            {tag.name}
            <button
              onClick={() => onRemove(tag.name)}
              className="ml-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <X size={12} />
            </button>
          </span>
        ))}

      {/* Add Tag Trigger */}
      <Popover open={isTagOpen} onOpenChange={setIsTagOpen}>
        <PopoverTrigger
          render={
            <Button variant="ghost">
              <Plus size={14} />
            </Button>
          }
        />
        <PopoverContent className="w-64 p-1" align="start">
          <Command>
            <CommandInput
              placeholder="Select or create a tag"
              onValueChange={setTagSearch}
            />
            <CommandList>
              {availableTags.length === 0 && (
                <CommandEmpty>
                  {tagSearch ? (
                    <Button
                      onClick={() => handleAddTag(tagSearch)}
                      variant="secondary"
                    >
                      <Plus size={14} className="mr-2 shrink-0" />
                      <span className="truncate">Create Tag "{tagSearch}"</span>
                    </Button>
                  ) : (
                    "No tags found."
                  )}
                </CommandEmpty>
              )}

              {availableTags.length > 0 && (
                <CommandGroup heading="Existing Tags">
                  {availableTags.map((t) => (
                    <CommandItem
                      value={t.name}
                      onSelect={() => {
                        handleAddTag(t.name);
                      }}
                    >
                      <span className="flex-1">{t.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface TypeSelectorProps {
  typeName: string;
  types: NoteTag[];
  onChange: (newType: string) => void;
}

const NoteTypeSelector = ({ typeName, types, onChange }: TypeSelectorProps) => {
  const [typeSearch, setTypeSearch] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleTypeChange = (typeName: string) => {
    onChange(typeName);
    setIsTypeOpen(false);
    setTypeSearch("");
  };

  return (
    <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
      <div className="pr-2 border-r border-border-subtle">
        <PopoverTrigger
          render={
            <Button variant="outline">
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
