import {
  useCreateTag,
  useDeleteTag,
  useGetTags,
  useUpdateTag,
} from "@/features/notes/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import { Pen, Plus, Trash } from "lucide-react";
import type { Tag, TagCreate, TagUpdate } from "@/features/notes/types.ts";
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

const TagsView = () => {
  const { tags, isLoading, error } = useGetTags();
  const { createTag } = useCreateTag();
  const { updateTag } = useUpdateTag();
  const { deleteTag } = useDeleteTag();

  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  const maxNoteCount = Math.max(...tags.map((tag) => tag.note_count));

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Tag Overview
      </h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-border-subtle">
          <CardTitle>Your Tags</CardTitle>
          <CardAction>
            <div className="flex flex-row items-center gap-4">
              <span className="text-content-muted text-sm ">
                {tags.length} tags in total
              </span>
              <TagDialog
                onSubmit={(newTag) => createTag(newTag as TagCreate)}
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
          {sortedTags && sortedTags.length !== 0 ? (
            sortedTags.map((tag) => (
              <TagItem
                key={tag.id}
                maxNoteCount={maxNoteCount}
                tag={tag}
                onDelete={deleteTag}
                onUpdate={updateTag}
              />
            ))
          ) : (
            <span className="flex flex-row justify-center text-content-muted">
              No tags found.
            </span>
          )}
        </CardContent>
      </Card>
    </CenterContainer>
  );
};

export default TagsView;

interface TagItemProps {
  tag: Tag;
  maxNoteCount: number;
  onDelete: (tagId: number) => Promise<void>;
  onUpdate: (tag: TagUpdate) => Promise<unknown>;
}

const TagItem = ({ tag, onDelete, onUpdate, maxNoteCount }: TagItemProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  return (
    <div
      className="flex flex-row justify-between w-full border-border-subtle p-2 group items-center"
      key={tag.id}
    >
      <div className="px-4 py-2 border border-border-subtle rounded-sm bg-bg-sidebar">
        <span className="font-bold text-content-muted">#{tag.name}</span>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-row items-center gap-2">
          <Progress
            value={tag.note_count}
            max={maxNoteCount}
            className="w-16 max-w-sm"
          />
          <span className="text-sm text-content-muted w-2 text-end">
            {tag.note_count}
          </span>
        </div>
        <div className="flex flex-row">
          <TagDialog
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={(updatedTag) => onUpdate(updatedTag as TagUpdate)}
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
            oldTag={tag}
          />
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
            name="tag"
            onDelete={() => onDelete(tag.id)}
          />
        </div>
      </div>
    </div>
  );
};

const TagDialog = ({
  trigger,
  label,
  onSubmit,
  oldTag,
  open: controlledOpen,
  onOpenChange,
}: {
  trigger?: JSX.Element;
  label: string;
  onSubmit: (tag: TagCreate | TagUpdate) => Promise<unknown>;
  oldTag?: Tag;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [name, setName] = useState(oldTag?.name ?? "");
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handleSubmit = async () => {
    const tag = oldTag
      ? ({ id: oldTag.id, name } satisfies TagUpdate)
      : ({ name } satisfies TagCreate);

    await onSubmit(tag);
    setName("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{label} Tag</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="name-1"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="MyTag"
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
                  onClick={() => setName(oldTag?.name ?? "")}
                >
                  Cancel
                </Button>
              }
            />
            <Button onClick={handleSubmit}>{label} Tag</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
