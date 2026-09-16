import { FormField } from "./FormField.tsx";

interface NoteFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  noteTypeName: string;
  setNoteTypeName: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  tagNames: string;
  setTagNames: (v: string) => void;
}

export function NoteFields({
  title,
  setTitle,
  content,
  setContent,
  noteTypeName,
  setNoteTypeName,
  status,
  setStatus,
  tagNames,
  setTagNames,
}: NoteFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
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
    </div>
  );
}
