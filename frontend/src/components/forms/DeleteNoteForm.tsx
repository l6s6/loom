import { useDeleteNote } from "../../hooks/useNotes.ts";
import { type ChangeEvent, useState } from "react";
import { FormField } from "./FormField.tsx";
import Button from "../Button.tsx";

const DeleteNoteForm = ({
  onSubmitted,
}: {
  onSubmitted: () => Promise<void>;
}) => {
  const [noteId, setNoteId] = useState("");
  const { deleteNote } = useDeleteNote();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.preventDefault();
    let noteIdInt: number = parseInt(noteId);
    if (isNaN(noteIdInt)) {
      throw new Error(`Invalid noteId: ${noteId}`);
    }
    await deleteNote({
      id: noteIdInt,
    });
    setNoteId("");
    await onSubmitted();
  };

  return (
    <div className="w-full">
      <h1 className="mb-8 text-2xl font-bold text-indigo-600">Delete Note</h1>
      <form onSubmit={handleSubmit} className="w-full">
        <FormField
          label="NoteId"
          value={noteId}
          onChange={setNoteId}
          placeholder="123"
        />
        <div className="my-6">
          <Button label="Delete Note" buttonType="submit" />
        </div>
      </form>
    </div>
  );
};

export default DeleteNoteForm;
