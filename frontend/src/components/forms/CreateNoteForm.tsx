import { NoteFields } from "./NoteFields.tsx";
import { useNoteFieldsState } from "../../hooks/useNoteFieldsState.ts";
import { useCreateNote } from "../../hooks/useNotes.ts";
import type { ChangeEvent } from "react";
import Button from "../Button.tsx";

const CreateNoteForm = ({
  onSubmitted,
}: {
  onSubmitted: () => Promise<void>;
}) => {
  const fields = useNoteFieldsState();
  const { createNote } = useCreateNote();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNote({
      title: fields.title,
      content: fields.content,
      note_type_name: fields.noteTypeName,
      status: fields.status || undefined,
      tag_names: fields.tagNames
        ? fields.tagNames.split(",").map((tag: string) => tag.trim())
        : [],
    });
    clearForm();
    await onSubmitted();
  };

  const clearForm = () => {
    fields.setTitle("");
    fields.setContent("");
    fields.setStatus("");
    fields.setNoteTypeName("");
    fields.setTagNames("");
  };

  return (
    <div className="w-full">
      <h1 className="mb-8 text-2xl font-bold text-indigo-600">Create Note</h1>
      <form onSubmit={handleSubmit}>
        <NoteFields {...fields} />
        <div className="my-6">
          <Button label="Create Note" buttonType="submit" />
        </div>
      </form>
    </div>
  );
};

export default CreateNoteForm;
