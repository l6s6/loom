import { type ChangeEvent, useState } from "react";
import {
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
} from "../hooks/useNotes.ts";
import type { CreateNote, DeleteNote, UpdateNote } from "../types/note.ts";
import { FormField } from "./FormField.tsx";

interface NoteFormProps {
  mode: "create" | "update" | "delete";
  onSubmitted: () => Promise<void>;
}

const NoteForm = ({ onSubmitted, mode }: NoteFormProps) => {
  const { createNote } = useCreateNote();
  const { updateNote } = useUpdateNote();
  const { deleteNote } = useDeleteNote();

  const [noteId, setNoteId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteTypeName, setNoteTypeName] = useState("");
  const [status, setStatus] = useState("");
  const [tagNames, setTagNames] = useState("");

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    switch (mode) {
      case "create":
        await handleCreate();
        break;
      case "update":
        await handleUpdate();
        break;
      case "delete":
        await handleDelete();
        break;
      default:
        throw new Error(`Unknown mode: ${mode}`);
    }
    onSubmitted();
  };

  const handleCreate = async () => {
    let data: CreateNote = {
      title,
      content,
      note_type_name: noteTypeName,
      status: status || undefined,
      tag_names: tagNames ? tagNames.split(",").map((tag) => tag.trim()) : [],
    };
    await createNote(data);
  };

  const handleUpdate = async () => {
    let noteIdInt: number;
    try {
      noteIdInt = parseInt(noteId);
    } catch (error) {
      throw new Error(`Invalid noteId: ${noteId}`);
    }
    let data: UpdateNote = {
      id: noteIdInt,
      title: title || undefined,
      content: content || undefined,
      note_type_name: noteTypeName || undefined,
      status: status || undefined,
      tag_names: tagNames ? tagNames.split(",").map((tag) => tag.trim()) : [],
    };
    await updateNote(data);
  };

  const handleDelete = async () => {
    let noteIdInt: number;
    try {
      noteIdInt = parseInt(noteId);
    } catch (error) {
      throw new Error(`Invalid noteId: ${noteId}`);
    }
    let data: DeleteNote = {
      id: noteIdInt,
    };
    await deleteNote(data);
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
      {/** ID field is only needed for update and delete modes */}
      {(mode === "update" || mode === "delete") && (
        <FormField
          label="noteId"
          value={noteId}
          onChange={setNoteId}
          placeholder="123"
        />
      )}
      {/** Note Details only needed for update and create modes */}
      {(mode === "update" || mode === "create") && (
        <>
          <FormField
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="Untitled"
          />
          <FormField
            label="Content"
            value={content}
            onChange={setContent}
            placeholder="This note is about..."
          />
          <FormField
            label="NoteType"
            value={noteTypeName}
            onChange={setNoteTypeName}
            placeholder="question"
          />
          <FormField
            label="Status"
            value={status}
            onChange={setStatus}
            placeholder="open | ongoing | closed"
          />
          <FormField
            label="Tags"
            value={tagNames}
            onChange={setTagNames}
            placeholder="life, inspiration, ..."
          />
        </>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                 shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {mode.toUpperCase()} NOTE
      </button>
    </form>
  );
};

export default NoteForm;
