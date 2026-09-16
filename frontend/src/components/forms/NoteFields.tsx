import { FormField } from "./FormField.tsx";
import { SelectField } from "./SelectField.tsx";
import { NoteStatus } from "../../types/note.ts";
import { type Dispatch, type SetStateAction } from "react";
import { SuggestionFormField } from "./SuggestionFormField.tsx";
import { TagField } from "./TagField.tsx";

interface NoteFieldsProps {
  title: string;
  setTitle: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
  noteTypeName: string;
  setNoteTypeName: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
  existingTags: string[];
  existingTypes: string[];
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
  tags,
  setTags,
  existingTags,
  existingTypes,
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
      <SuggestionFormField
        label="NoteType"
        value={noteTypeName}
        onChange={setNoteTypeName}
        placeholder="question"
        suggestions={existingTypes}
      />
      <SelectField
        label="Status"
        value={status}
        onChange={setStatus}
        options={Object.values(NoteStatus)}
      />
      <TagField tags={tags} onChange={setTags} suggestions={existingTags} />
    </div>
  );
}
