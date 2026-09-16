import { useState } from "react";

interface NoteFieldsValues {
  title: string;
  content: string;
  noteTypeName: string;
  status: string;
  tagNames: string;
}

export function useNoteFieldsState(initial?: Partial<NoteFieldsValues>) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [noteTypeName, setNoteTypeName] = useState(initial?.noteTypeName ?? "");
  const [status, setStatus] = useState(initial?.status ?? "");
  const [tagNames, setTagNames] = useState(initial?.tagNames ?? "");

  return {
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
  };
}
