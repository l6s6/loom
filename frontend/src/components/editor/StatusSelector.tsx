import { useState } from "react";
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
import { NOTE_STATUS_CONFIG, type NoteStatus } from "@/types/note.ts";
import { ChevronDown } from "lucide-react";

interface StatusSelectorProps {
  status: string;
  onChange: (newStatus: string) => Promise<void>;
}

const StatusSelector = ({ status, onChange }: StatusSelectorProps) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setIsStatusOpen(false);
    onChange(newStatus);
  };

  return (
    <DropdownMenu onOpenChange={setIsStatusOpen} open={isStatusOpen}>
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

export default StatusSelector;
