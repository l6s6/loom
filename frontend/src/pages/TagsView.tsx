import {
  useCreateTag,
  useDeleteTag,
  useGetTags,
} from "@/features/notes/hooks.ts";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import { MoreVertical, Plus } from "lucide-react";
import type { Note, Tag, TagCreate } from "@/features/notes/types.ts";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.tsx";
import { useState } from "react";
import { Field, FieldGroup } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";

const TagsView = () => {
  const { tags, isLoading, error } = useGetTags();
  const { create } = useCreateTag();
  const { deleteTag } = useDeleteTag();

  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

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
              <CreateTagDialog createTag={create} />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          {sortedTags && sortedTags.length !== 0 ? (
            sortedTags.map((tag) => (
              <TagItem key={tag.id} tag={tag} onDelete={deleteTag} />
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
  onDelete: (tagId: number) => Promise<void>;
}

const TagItem = ({ tag, onDelete }: TagItemProps) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  return (
    <div
      className="flex flex-row justify-between w-full border-border-subtle py-2 px-4"
      key={tag.id}
    >
      <div className="px-4 py-2 border border-border-subtle rounded-sm flex bg-bg-sidebar">
        <span className="font-bold text-content-muted">#{tag.name}</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <span className="text-sm text-content-muted">X Notes</span>
        <DropdownMenu
          open={isMoreOpen || isDeleteAlertOpen}
          onOpenChange={setIsMoreOpen}
        >
          <DropdownMenuTrigger>
            <div className="flex flex-row justify-center items-center size-8 text-muted-foreground data-[state=open]:bg-muted">
              <MoreVertical size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              <ConfirmDeleteDialog
                open={isDeleteAlertOpen}
                onOpenChange={setIsDeleteAlertOpen}
                trigger={<span>Delete</span>}
                name="tag"
                onDelete={() => onDelete(tag.id)}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const CreateTagDialog = ({
  createTag,
}: {
  createTag: UseMutateAsyncFunction<Note, Error, TagCreate, unknown>;
}) => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const handleCreateTag = async () => {
    const tag: TagCreate = {
      name: name,
    };
    setName("");
    setOpen(false);
    await createTag(tag);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleCreateTag}>
        <DialogTrigger
          render={
            <Button
              variant="outline"
              className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
              size="icon"
            >
              <Plus />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Tag</DialogTitle>
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
                <Button variant="outline" onClick={() => setName("")}>
                  Cancel
                </Button>
              }
            />
            <Button onClick={handleCreateTag}>Create Tag</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
