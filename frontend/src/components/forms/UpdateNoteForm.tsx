import { NoteFields } from "./NoteFields.tsx";
import { useNoteFieldsState } from "../../hooks/useNoteFieldsState.ts";
import { useUpdateNote } from "../../hooks/useNotes.ts";
import { type ChangeEvent, useState } from "react";
import { FormField } from "./FormField.tsx";
import Button from "../Button.tsx";

interface UpdateNoteFormProps {
  onSubmitted: () => Promise<void>;
  types: string[];
  tags: string[];
}

const UpdateNoteForm = ({ onSubmitted, types, tags }: UpdateNoteFormProps) => {
  const [noteId, setNoteId] = useState("");
  const fields = useNoteFieldsState();
  const { updateNote } = useUpdateNote();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    let noteIdInt: number = parseInt(noteId);
    if (isNaN(noteIdInt)) {
      throw new Error(`Invalid noteId: ${noteId}`);
    }
    await updateNote({
      id: noteIdInt,
      title: fields.title || undefined,
      content: fields.content || undefined,
      note_type_name: fields.noteTypeName || undefined,
      status: fields.status || undefined,
      tag_names: fields.tags,
    });
    await onSubmitted();
  };

  return (
    <div className="w-full">
      <h1 className="mb-8 text-2xl font-bold text-indigo-600">Update Note</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-4">
          <FormField
            label="NoteId"
            value={noteId}
            onChange={setNoteId}
            placeholder="123"
          />
          <NoteFields {...fields} existingTypes={types} existingTags={tags} />
        </div>

        <div className="my-6">
          <Button label="Update Note" buttonType="submit" />
        </div>
      </form>{" "}
    </div>
  );
};

export default UpdateNoteForm;
