import { NoteFields } from "./NoteFields.tsx";
import { useNoteFieldsState } from "../../hooks/useNoteFieldsState.ts";
import { useCreateNote } from "../../hooks/useNotes.ts";
import type { ChangeEvent } from "react";

interface CreateNoteFormProps {
  onSubmitted: () => Promise<void>;
  types: string[];
  tags: string[];
}

const CreateNoteForm = ({ onSubmitted, types, tags }: CreateNoteFormProps) => {
  const fields = useNoteFieldsState();
  const { createNote } = useCreateNote();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createNote({
      title: fields.title,
      content: fields.content,
      note_type_name: fields.noteTypeName,
      status: fields.status,
      tag_names: fields.tags,
    });
    clearForm();
    await onSubmitted();
  };

  const clearForm = () => {
    fields.setTitle("");
    fields.setContent("");
    fields.setStatus("");
    fields.setNoteTypeName("");
    fields.setTags([]);
  };

  return (
    <div className="w-full">
      <h1 className="mb-8 text-2xl font-bold text-indigo-600">Create Note</h1>
      <form onSubmit={handleSubmit}>
        <NoteFields {...fields} existingTypes={types} existingTags={tags} />
        <div className="my-6"></div>
      </form>
    </div>
  );
};

export default CreateNoteForm;
