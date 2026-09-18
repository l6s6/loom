import React, { useState } from "react";
import { Check, Plus, X, Hash, AlignLeft, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// --- DOMAIN TYPES ---

export type NoteStatus = "open" | "ongoing" | "closed";

export interface NoteType {
  id: string;
  name: string;
}

export interface NoteTag {
  id: string;
  name: string;
}

const STATUS_CONFIG: Record<
  NoteStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  open: {
    label: "Open",
    dotColor: "bg-green-500",
    textColor: "text-green-700",
  },
  ongoing: {
    label: "Ongoing",
    dotColor: "bg-blue-500",
    textColor: "text-blue-700",
  },
  closed: {
    label: "Closed",
    dotColor: "bg-gray-400",
    textColor: "text-gray-600",
  },
};

export default function NoteEditor() {
  // App State
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  // Metadata State
  const [status, setStatus] = useState<NoteStatus>("open");
  const [type, setType] = useState<NoteType | null>({
    id: "t-1",
    name: "Observation",
  });
  const [tags, setTags] = useState<NoteTag[]>([{ id: "tag-1", name: "React" }]);

  // DB Mock State
  const [availableTypes, setAvailableTypes] = useState<NoteType[]>([
    { id: "t-1", name: "Observation" },
    { id: "t-2", name: "Question" },
    { id: "t-3", name: "Quote" },
  ]);

  const [availableTags, setAvailableTags] = useState<NoteTag[]>([
    { id: "tag-1", name: "React" },
    { id: "tag-2", name: "TypeScript" },
    { id: "tag-3", name: "UI Design" },
  ]);

  // Search States for Popovers
  const [typeSearch, setTypeSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Open States for Popovers
  const [typeOpen, setTypeOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filteredTags = availableTags.filter(
    (t) => !tags.some((selected) => selected.id === t.id),
  );

  const handleAddType = (name: string) => {
    const newType: NoteType = { id: `t-${Date.now()}`, name };
    setAvailableTypes((prev) => [...prev, newType]);
    setType(newType);
    setTypeOpen(false);
    setTypeSearch("");
  };

  const handleAddTag = (name: string) => {
    const newTag: NoteTag = { id: `tag-${Date.now()}`, name };
    setAvailableTags((prev) => [...prev, newTag]);
    setTags((prev) => [...prev, newTag]);
    setTagSearch("");
    // Keep popover open for adding more tags
  };

  const handleRemoveTag = (idToRemove: string) => {
    setTags((prev) => prev.filter((t) => t.id !== idToRemove));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-16">
          {/* Note Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight text-slate-900"
          />

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <DropdownMenu onOpenChange={setStatusOpen} open={statusOpen}>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline">
                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_CONFIG[status].dotColor}`}
                    />
                    <span className={STATUS_CONFIG[status].textColor}>
                      {STATUS_CONFIG[status].label}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </Button>
                }
              />
              <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(value) => {
                      setStatus(value);
                      setStatusOpen(false);
                    }}
                  >
                    {(
                      Object.entries(STATUS_CONFIG) as [
                        NoteStatus,
                        (typeof STATUS_CONFIG)[NoteStatus],
                      ][]
                    ).map(([key, config]) => (
                      <DropdownMenuRadioItem value={key}>
                        <span
                          className={`w-2 h-2 rounded-full ${config.dotColor}`}
                        />
                        <span className="flex-1">{config.label}</span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 2. TYPE (Popover + Command) */}
            <div className="w-[1px] h-6 bg-slate-200 mx-1" /> {/* Separator */}
            <Popover open={typeOpen} onOpenChange={setTypeOpen}>
              <PopoverTrigger
                render={
                  <Button variant="outline">
                    {type?.name}
                    <ChevronDown size={14} className="text-slate-400" />
                  </Button>
                }
              />
              <PopoverContent className="w-64 p-1" align="start">
                <Command>
                  <CommandInput
                    placeholder="Select or create a type"
                    onValueChange={setTypeSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      <Button
                        onClick={() => handleAddType(typeSearch)}
                        variant="secondary"
                      >
                        <Plus size={14} className="mr-2 shrink-0" />
                        <span className="truncate">
                          Create Type "{typeSearch}"
                        </span>
                      </Button>
                    </CommandEmpty>
                    <CommandGroup heading="Existing Types">
                      {availableTypes.map((t) => (
                        <CommandItem
                          value={t.id}
                          onSelect={() => {
                            setType(t);
                            setTypeOpen(false);
                            setTypeSearch("");
                          }}
                        >
                          <span className="flex-1">{t.name}</span>
                          {type?.id === t.id && (
                            <Check size={14} className="text-slate-600" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <div className="w-[1px] h-6 bg-slate-200 mx-1" /> {/* Separator */}
            {/* 3. TAGS (Popover + Command + Multi Select Pills) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Selected Tags */}
              {tags.map((tag) => (
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
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              {/* Add Tag Trigger */}
              <Popover open={tagOpen} onOpenChange={setTagOpen}>
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
                      {filteredTags.length === 0 && (
                        <CommandEmpty>
                          {tagSearch ? (
                            <Button
                              onClick={() => handleAddTag(tagSearch)}
                              variant="secondary"
                            >
                              <Plus size={14} className="mr-2 shrink-0" />
                              <span className="truncate">
                                Create Tag "{tagSearch}"
                              </span>
                            </Button>
                          ) : (
                            "No tags found."
                          )}
                        </CommandEmpty>
                      )}

                      {filteredTags.length > 0 && (
                        <CommandGroup heading="Existing Tags">
                          {filteredTags.map((t) => (
                            <CommandItem
                              value={t.id}
                              onSelect={() => {
                                setTags([...tags, t]);
                                setTagSearch("");
                                setTagOpen(false);
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
          </div>

          {/* Note Content Area */}
          <div className="relative group mt-8">
            <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <AlignLeft
                size={20}
                className="text-slate-300 hover:text-slate-500"
              />
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 p-0 text-lg text-slate-700 min-h-[400px] resize-none leading-relaxed"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
