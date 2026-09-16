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
    <form onSubmit={handleSubmit} className="w-full">
      <FormField
        label="noteId"
        value={noteId}
        onChange={setNoteId}
        placeholder="123"
      />
      <div className="my-6">
        <Button label="Delete Note" buttonType="submit" />
      </div>
    </form>
  );
};

export default DeleteNoteForm;
