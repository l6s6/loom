import { Link, useMatch } from "react-router-dom";
import { ArrowLeft, Trash } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { useDeleteNote } from "@/features/notes/hooks.ts";

const EditorTopBar = ({ noteId }: { noteId: number }) => {
  const { deleteNote } = useDeleteNote();
  const match = useMatch("/n/:noteId");
  const urlNoteId = match?.params.noteId;
  return (
    <header className="mx-4 flex flex-row items-center h-navbar border-b border-border-subtle">
      <div className="flex flex-row justify-between w-full px-8">
        <div className="flex flex-row gap-16 items-center">
          <Link to="/">
            <div className="flex flex-row gap-2 items-center group">
              <ArrowLeft
                className="text-content-muted group-hover:text-content-muted-hover"
                size={16}
              />
              <span className="text-sm text-content-muted group-hover:text-content-muted-hover">
                Back to Notes
              </span>
            </div>
          </Link>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" className="group">
                <Trash className="text-red-500 group-hover:text-red-600 transition-all" />
              </Button>
            }
          />
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete chat?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={() => deleteNote(noteId, urlNoteId)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default EditorTopBar;
