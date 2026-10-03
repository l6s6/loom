import { Network } from "lucide-react";
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
import { getStringPreview } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";

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
        <Command className="mt-4">
          <CommandInput
            placeholder="Search Notes to add Connections"
            onValueChange={setSearchQuery}
          />

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
                    <div className="w-full rounded-md px-2">
                      <h1 className="font-bold">
                        {getStringPreview(25, note.title, "Untitled")}
                      </h1>
                      <span className="text-content-muted text-sm">
                        {getStringPreview(
                          35,
                          note.content,
                          "No content yet...",
                        )}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </div>
    </div>
  );
};

export default EditorFooter;
