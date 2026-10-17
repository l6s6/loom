import { useState, type JSX } from "react";
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
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import type { BaseEntity } from "@/features/notes/types.ts";

interface EntityManagementProps<T extends BaseEntity> {
  title: string;
  entityName: string;
  items: T[];
  isLoading: boolean;
  error: any;
  onCreate: (name: string) => Promise<unknown>;
  onUpdate: (id: string, name: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<void>;
  renderBadge: (item: T) => JSX.Element;
  canDelete?: (item: T) => boolean;
}

export default function EntityManagement<T extends BaseEntity>({
  title,
  entityName,
  items,
  isLoading,
  error,
  onCreate,
  onUpdate,
  onDelete,
  renderBadge,
  canDelete = () => true,
}: EntityManagementProps<T>) {
  const sortedItems = [...items].sort(
    (a, b) => b.note_count - a.note_count || a.name.localeCompare(b.name),
  );
  const maxNoteCount = Math.max(0, ...items.map((item) => item.note_count));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        {title}
      </h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle">
          <CardTitle>Your {entityName}s</CardTitle>
          <CardAction>
            <div className="flex flex-row items-center gap-4">
              <span className="text-content-muted text-sm ">
                {items.length} {entityName.toLowerCase()}s in total
              </span>
              <EntityDialog
                entityName={entityName}
                label="Create"
                onSubmit={(name) => onCreate(name)}
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
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <EntityItem
                key={item.id}
                item={item}
                entityName={entityName}
                maxNoteCount={maxNoteCount}
                renderBadge={renderBadge}
                canDelete={canDelete(item)}
                onDelete={() => onDelete(item.id)}
                onUpdate={(name) => onUpdate(item.id, name)}
              />
            ))
          ) : (
            <span className="flex flex-row justify-center text-content-muted">
              No {entityName.toLowerCase()}s found.
            </span>
          )}
        </CardContent>
      </Card>
    </CenterContainer>
  );
}

const EntityItem = <T extends BaseEntity>({
  item,
  entityName,
  maxNoteCount,
  renderBadge,
  canDelete,
  onDelete,
  onUpdate,
}: {
  item: T;
  entityName: string;
  maxNoteCount: number;
  renderBadge: (item: T) => JSX.Element;
  canDelete: boolean;
  onDelete: () => Promise<void>;
  onUpdate: (name: string) => Promise<unknown>;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  return (
    <div className="flex flex-row justify-between w-full border-border-subtle p-2 group items-center hover:bg-sidebar rounded-md">
      {renderBadge(item)}
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <Progress
            value={item.note_count}
            max={maxNoteCount}
            className="w-16 max-w-sm"
          />
          <span className="text-sm text-content-muted w-2 text-end">
            {item.note_count}
          </span>
        </div>
        <div className="flex flex-row">
          <EntityDialog
            entityName={entityName}
            label="Edit"
            oldName={item.name}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={onUpdate}
            trigger={
              <Button
                variant="ghost"
                size="icon-sm"
                className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 text-content-muted"
              >
                <Pen size={10} />
              </Button>
            }
          />
          {canDelete ? (
            <ConfirmDeleteDialog
              name={entityName.toLowerCase()}
              open={isDeleteAlertOpen}
              onOpenChange={setIsDeleteAlertOpen}
              onDelete={onDelete}
              trigger={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="[&_svg:not([class*='size-'])]:size-3.5 opacity-0 group-hover:opacity-100 text-content-muted hover:text-destructive"
                >
                  <Trash size={10} />
                </Button>
              }
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
                  <DialogTitle>Cannot Delete {entityName}</DialogTitle>
                  <DialogDescription>
                    {entityName} cannot be deleted since it is still used in{" "}
                    {item.note_count} notes.
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

const EntityDialog = ({
  entityName,
  trigger,
  label,
  onSubmit,
  oldName = "",
  open: controlledOpen,
  onOpenChange,
}: {
  entityName: string;
  trigger?: JSX.Element;
  label: string;
  onSubmit: (name: string) => Promise<unknown>;
  oldName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [name, setName] = useState(oldName);
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleSubmit = async () => {
    await onSubmit(name);
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {label} {entityName}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`My${entityName.replace(" ", "")}`}
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
                  onClick={() => setName(oldName)}
                >
                  Cancel
                </Button>
              }
            />
            <Button onClick={handleSubmit}>
              {label} {entityName}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
