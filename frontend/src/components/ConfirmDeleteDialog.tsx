import {
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog.tsx";
import { Trash } from "lucide-react";
import type { JSX } from "react";

interface ConfirmDialogProps {
  name: string;
  onDelete: () => Promise<void>;
  trigger: JSX.Element;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
}

const ConfirmDeleteDialog = ({
  onDelete,
  name,
  trigger,
  open,
  onOpenChange,
}: ConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 dark:text-destructive">
            <Trash />
          </AlertDialogMedia>
          <AlertDialogTitle>{`Delete ${name}?`}</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will permanently delete this ${name}.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
