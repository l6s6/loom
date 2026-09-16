import { useState } from "react";
import { NoteStatus } from "../types/note.ts";

interface NoteFieldsValues {
  title: string;
  content: string;
  noteTypeName: string;
  status: string;
  tags: string[];
}

export function useNoteFieldsState(initial?: Partial<NoteFieldsValues>) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [noteTypeName, setNoteTypeName] = useState(initial?.noteTypeName ?? "");
  const [status, setStatus] = useState(
    initial?.status ?? NoteStatus.None.valueOf(),
  );
  const [tags, setTags] = useState(initial?.tags ?? []);

  return {
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
  };
}
