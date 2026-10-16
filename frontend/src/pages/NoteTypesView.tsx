import {
  useCreateNoteType,
  useDeleteNoteType,
  useGetNoteTypes,
  useUpdateNoteType,
} from "@/features/notes/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import { Pen, Plus, Trash } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.tsx";
import { type JSX, useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import type {
  NoteType,
  NoteTypeCreate,
  NoteTypeUpdate,
} from "@/features/notes/types.ts";

const NoteTypesView = () => {
  const { types, isLoading, error } = useGetNoteTypes();
  const { createNoteType } = useCreateNoteType();
  const { updateNoteType } = useUpdateNoteType();
  const { deleteNoteType } = useDeleteNoteType();

  const sortedNoteTypes = [...types].sort(
    (a, b) => b.note_count - a.note_count || a.name.localeCompare(b.name),
  );
  const maxNoteCount = Math.max(...types.map((type) => type.note_count));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Note Type Overview
      </h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle">
          <CardTitle>Your Note Types</CardTitle>
          <CardAction>
            <div className="flex flex-row items-center gap-4">
              <span className="text-content-muted text-sm ">
                {types.length} types in total
              </span>
              <NoteTypeDialog
                onSubmit={(newType) =>
                  createNoteType(newType as NoteTypeCreate)
                }
                label="Create"
                trigger={
                  <Button
                    variant="outline"
                    className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                    size="icon"
                  >
                    <Plus />
                  </Button>
                }
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          {sortedNoteTypes && sortedNoteTypes.length !== 0 ? (
            sortedNoteTypes.map((type) => (
              <NoteTypeItem
                key={type.id}
                maxNoteCount={maxNoteCount}
                type={type}
                onDelete={deleteNoteType}
                onUpdate={updateNoteType}
              />
            ))
          ) : (
            <span className="flex flex-row justify-center text-content-muted">
              No types found.
            </span>
          )}
        </CardContent>
      </Card>
    </CenterContainer>
  );
};

export default NoteTypesView;

interface NoteTypeItemProps {
  type: NoteType;
  maxNoteCount: number;
  onDelete: (typeId: number) => Promise<void>;
  onUpdate: (type: NoteTypeUpdate) => Promise<unknown>;
}

const NoteTypeItem = ({
  type,
  onDelete,
  onUpdate,
  maxNoteCount,
}: NoteTypeItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  return (
    <div
      className="flex flex-row justify-between w-full border-border-subtle p-2 group items-center"
      key={type.id}
    >
      <div className="px-4 py-2 border border-transparent rounded-sm bg-primary-bg">
        <span className="font-bold text-primary">{type.name}</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <Progress
            value={type.note_count}
            max={maxNoteCount}
            className="w-16 max-w-sm"
          />
          <span className="text-sm text-content-muted w-2 text-end">
            {type.note_count}
          </span>
        </div>
        <div className="flex flex-row">
          <NoteTypeDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={(updatedType) => onUpdate(updatedType as NoteTypeUpdate)}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 text-content-muted"
              >
                <Pen size={10} />
              </Button>
            }
            label="Edit"
            oldType={type}
          />
          {type.note_count == 0 ? (
            <ConfirmDeleteDialog
              open={isDeleteAlertOpen}
              onOpenChange={setIsDeleteAlertOpen}
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 text-content-muted hover:text-destructive"
                >
                  <Trash size={10} />
                </Button>
              }
              name="type"
              onDelete={() => onDelete(type.id)}
            />
          ) : (
            <Dialog>
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 text-content-muted hover:text-destructive"
                  >
                    <Trash size={10} />
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cannot Delete Note Type</DialogTitle>
                  <DialogDescription>
                    Note type cannot be deleted since it is still used in{" "}
                    {type.note_count} notes.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

const NoteTypeDialog = ({
  trigger,
  label,
  onSubmit,
  oldType,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: JSX.Element;
  label: string;
  onSubmit: (type: NoteTypeCreate | NoteTypeUpdate) => Promise<unknown>;
  oldType?: NoteType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [name, setName] = useState(oldType?.name ?? "");
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleSubmit = async () => {
    const type = oldType
      ? ({ id: oldType.id, name } satisfies NoteTypeUpdate)
      : ({ name } satisfies NoteTypeCreate);

    await onSubmit(type);
    setName("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{label} Note Type</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MyType"
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setName(oldType?.name ?? "")}
                >
                  Cancel
                </Button>
              }
            />
            <Button onClick={handleSubmit}>{label} Note Type</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
