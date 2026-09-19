import { useState } from "react";
import type { NoteTag } from "@/types/noteTag.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Check, ChevronDown, Plus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";

interface TypeSelectorProps {
  typeName: string;
  types: NoteTag[];
  onChange: (newType: string) => Promise<void>;
}

const TypeSelector = ({ typeName, types, onChange }: TypeSelectorProps) => {
  const [typeSearch, setTypeSearch] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const handleTypeChange = (typeName: string) => {
    onChange(typeName);
    setIsTypeOpen(false);
    setTypeSearch("");
  };

  return (
    <Popover open={isTypeOpen} onOpenChange={setIsTypeOpen}>
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

export default TypeSelector;
