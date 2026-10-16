import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useGetNoteTypes, useGetTags } from "@/features/notes/hooks.ts";
import { NoteStatus } from "@/features/notes/types.ts";

interface NoteSearchBarProps {
  feedFilters: { search: string; type: string; status: string; tag: string };
  handleFilterChange: (name: string, value: string) => void;
}

const NoteSearchBar = ({
  feedFilters,
  handleFilterChange,
}: NoteSearchBarProps) => {
  const { types } = useGetNoteTypes();
  const { tags } = useGetTags();
  return (
    <InputGroup className="w-full">
      <InputGroupInput
        value={feedFilters.search}
        onChange={(e) => handleFilterChange("search", e.target.value)}
        placeholder="Search Notes to add Connections"
        autoComplete="off"
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <SearchFilterSelector
        title="Tag"
        value={feedFilters.tag}
        onValueChange={(value) => handleFilterChange("tag", value)}
        values={[...tags.map((t) => t.name)]}
      />
      <SearchFilterSelector
        title="Status"
        value={feedFilters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
        values={Object.values(NoteStatus)}
      />
      <SearchFilterSelector
        title="NoteType"
        value={feedFilters.type}
        onValueChange={(value) => handleFilterChange("type", value)}
        values={[...types.map((t) => t.name)]}
      />
    </InputGroup>
  );
};

export default NoteSearchBar;

interface SerachFilterSelectorProps {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  values: string[];
}

const SearchFilterSelector = ({
  title,
  value,
  onValueChange,
  values,
}: SerachFilterSelectorProps) => {
  return (
    <InputGroupAddon align="inline-end">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" className="pr-1.5! text-xs">
              <span className={value && "text-primary font-bold underline"}>
                {value || title}
              </span>
              <ChevronDown
                className={`size-3 transition-all ${value && "text-primary rotate-90 ease-in-out"}`}
              />
            </Button>
          }
        />
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          alignOffset={-4}
          className="w-36"
        >
          <DropdownMenuGroup>
            <DropdownMenuRadioGroup
              value={value}

              onValueChange={onValueChange}
            >
              <DropdownMenuRadioItem value="">No Filter</DropdownMenuRadioItem>
              {values.map((v) => (
                <DropdownMenuRadioItem key={v} value={v}>
                  {v}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </InputGroupAddon>
  );
};
