import { useEffect, useMemo, useState } from "react";
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
import { type NoteStatus, NOTE_STATUS_CONFIG } from "@/types/note.ts";
import { useParams } from "react-router-dom";
import { useGetNoteById, useUpdateNote } from "@/hooks/useNotes.ts";
import { useGetTypes } from "@/hooks/useTypes.ts";
import { useGetTags } from "@/hooks/useTags.ts";

export default function EditorView() {
  const { noteId } = useParams();
  const noteIdInt = noteId ? parseInt(noteId) : NaN;
  const { updateNote } = useUpdateNote();
  const { note, error, refetchNote } = useGetNoteById(noteIdInt);
  const { types, refetchTypes } = useGetTypes();
  const { tags, refetchTags } = useGetTags();

  // Note State
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState("open");
  const [typeName, setTypeName] = useState("");

  // Search States for Popovers
  const [typeSearch, setTypeSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Open States for Popovers
  const [typeOpen, setTypeOpen] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [loadingNote, setLoadingNote] = useState(true);

  const availableTags = useMemo(
    () =>
      tags
        .filter((t) => !note?.tags.some((selected) => selected.id === t.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [tags, note],
  );

  // Update Note fields when note is loaded
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setStatus(note.status);
      setTypeName(note.note_type.name);
      setLoadingNote(false);
    }
  }, [note]);

  // Debouncing to avoid too many db updates
  useEffect(() => {
    const titleChanged = note && title !== note.title;
    const contentChanged = note && content !== note.content;

    if (!titleChanged && !contentChanged) return;
    const timerId = setTimeout(() => {
      updateNote({
        id: noteIdInt,
        title: title,
        content: content,
      });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [title, content, note, noteIdInt, updateNote]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setStatusOpen(false);
    await updateNote({
      id: noteIdInt,
      status: newStatus,
    });
  };

  const handleTypeChange = async (newType: string) => {
    setTypeName(newType);
    setTypeOpen(false);
    setTypeSearch("");
    await updateNote({
      id: noteIdInt,
      note_type_name: newType,
    });
    await refetchTypes();
  };

  const handleAddTag = async (name: string) => {
    if (note === undefined) {
      return;
    }
    const newTagArr = [...note.tags.map((tag) => tag.name), name];
    await updateNote({
      id: noteIdInt,
      tag_names: newTagArr,
    });
    setTagSearch("");
    setTagOpen(false);
    setTagSearch("");
    await refetchNote(noteIdInt);
    await refetchTags();
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (note === undefined) {
      return;
    }
    const newTagArr = note.tags
      .filter((tag) => tag.name !== tagToRemove)
      .map((tag) => tag.name);
    await updateNote({
      id: noteIdInt,
      tag_names: newTagArr,
    });
    await refetchNote(noteIdInt);
    await refetchTags();
  };

  if (error) return <p>Error: {error}</p>;
  if (loadingNote) return <p>Loading</p>;
  if (note === undefined) return <p>Note undefined</p>;

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
                  <Button
                    variant="outline"
                    className={NOTE_STATUS_CONFIG[status].bgColor}
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
                    {typeName}
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
                        onClick={() => handleTypeChange(typeSearch)}
                        variant="secondary"
                      >
                        <Plus size={14} className="mr-2 shrink-0" />
                        <span className="truncate">
                          Create Type "{typeSearch}"
                        </span>
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
            <div className="w-[1px] h-6 bg-slate-200 mx-1" /> {/* Separator */}
            {/* 3. TAGS (Popover + Command + Multi Select Pills) */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Selected Tags */}
              {note.tags
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
                      onClick={() => handleRemoveTag(tag.name)}
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
                      {availableTags.length === 0 && (
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
