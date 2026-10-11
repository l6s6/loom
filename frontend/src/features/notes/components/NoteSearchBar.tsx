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

interface NoteSearchBarProps {
  feedFilters: { search: string; type: string; status: string; tag: string };
  handleFilterChange: (name: string, value: string) => void;
}

const NoteSearchBar = ({
  feedFilters,
  handleFilterChange,
}: NoteSearchBarProps) => {
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
      <InputGroupAddon align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="pr-1.5! text-xs">
                Status
                <ChevronDown className="size-3" />
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
                value={feedFilters.status}

                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <DropdownMenuRadioItem value="">
                  No Filter
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="none">None</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="open">Open</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="ongoing">
                  Ongoing
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="close">
                  Closed
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default NoteSearchBar;
