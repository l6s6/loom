import { MessageCircle, Network } from "lucide-react";
import { useState } from "react";
import { useNotesContext } from "@/context/NotesContext.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { NOTE_STATUS_CONFIG } from "@/types/note.ts";

const EditorFooter = () => {
  const { notes } = useNotesContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = [...notes]
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const handleAddLink = (target_id: number) => {
    console.log(target_id);
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
        <Command>
          <CommandInput
            placeholder="Search Notes to add Connections"
            onValueChange={setSearchQuery}
          />
          <CommandList className="h-36">
            <CommandEmpty>
              <span className="text-content-muted">No Notes found.</span>
            </CommandEmpty>
            <CommandGroup heading="Notes">
              {filteredNotes.map((note) => (
                <CommandItem
                  key={note.id}
                  onSelect={() => handleAddLink(note.id)}
                >
                  <div className="w-full h-33 border border-border-subtle rounded-md px-4 py-2">
                    <div className="flex flex-row items-center justify-between mb-2">
                      <div className="flex flex-row gap-2">
                        <div
                          className={`px-2 py-1 rounded-sm flex flex-row items-center gap-1  ${NOTE_STATUS_CONFIG[note.status].bgColor}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${NOTE_STATUS_CONFIG[note.status].dotColor}`}
                          />
                          <span
                            className={`text-xs ${NOTE_STATUS_CONFIG[note.status].textColor}`}
                          >
                            {note.status}
                          </span>
                        </div>
                        <div className="px-2 py-1 rounded-sm flex flex-row items-center gap-1 bg-primary-bg">
                          <MessageCircle className="text-primary" size={12} />
                          <span className="text-xs text-primary">
                            {note.note_type.name.charAt(0).toUpperCase() +
                              note.note_type.name.slice(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-content-muted">
                        {formattedModifiedAt}
                      </span>
                    </div>
                    <h1 className="font-bold">{titlePreview}</h1>
                    <span className="text-content-muted text-sm">
                      {contentPreview}
                    </span>
                    <div className="flex flex-row overflow-clip gap-1 mt-2">
                      {note.tags.map((tag) => (
                        <div className="px-2 py-1 border border-border-subtle rounded-sm flex bg-bg-sidebar">
                          <span className="text-xs text-content-muted">
                            #{tag.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
};

export default EditorFooter;
