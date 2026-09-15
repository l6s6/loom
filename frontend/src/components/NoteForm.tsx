import { type ChangeEvent, useState } from "react";
import { useCreateNote } from "../hooks/useNotes.ts";
import type { CreateNote } from "../types/note.ts";
import { FormField } from "./FormField.tsx";

interface NoteFormProps {
  onCreated: () => Promise<void>;
}

const NoteForm = ({ onCreated }: NoteFormProps) => {
  const { create } = useCreateNote();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteTypeName, setNoteTypeName] = useState("");
  const [status, setStatus] = useState("");
  const [tagNames, setTagNames] = useState("");

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    let data: CreateNote = {
      title,
      content,
      note_type_name: noteTypeName,
      status: status || undefined,
      tag_names: tagNames ? tagNames.split(",").map((tag) => tag.trim()) : [],
    };
    await create(data);
    await onCreated();
  };

  return (
    <form className="max-w-md mx-auto space-y-4" onSubmit={handleSubmit}>
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

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                 shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Note
      </button>
    </form>
  );
};

export default NoteForm;
