import type { NoteTag } from "@/types/noteTag.ts";
import { Plus, X, Hash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface TagSelectorProps {
  tags: NoteTag[];
  availableTags: NoteTag[];
  onAdd: (name: string) => Promise<void>;
  onRemove: (tagToRemove: string) => Promise<void>;
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

export default TagSelector;
