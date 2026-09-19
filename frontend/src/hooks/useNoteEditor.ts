import { useEffect, useMemo, useState } from "react";
import { useGetNoteById, useUpdateNote } from "@/hooks/useNotes.ts";
import { useGetTypes } from "@/hooks/useTypes.ts";
import { useGetTags } from "@/hooks/useTags.ts";
import { useNotesContext } from "@/context/NotesContext.tsx";

export function useNoteEditor(noteId: number) {
  const { updateNote } = useUpdateNote();
  const { patchNoteInList } = useNotesContext();
  const { note, error, refetchNote } = useGetNoteById(noteId);
  const { types, refetchTypes } = useGetTypes();
  const { tags, refetchTags } = useGetTags();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [status, setStatus] = useState("open");
  const [typeName, setTypeName] = useState("");

  const availableTags = useMemo(
    () =>
      tags
        .filter((t) => !note?.tags.some((selected) => selected.id === t.id))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [tags, note],
  );

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setStatus(note.status);
      setTypeName(note.note_type.name);
      setIsLoading(false);
    }
  }, [note]);

  useEffect(() => {
    const titleChanged = note && title !== note.title;
    const contentChanged = note && content !== note.content;

    if (!titleChanged && !contentChanged) return;
    const timerId = setTimeout(async () => {
      await updateNote({ id: noteId, title, content });
      patchNoteInList(noteId, { title, content });
    }, 500);

    return () => clearTimeout(timerId);
  }, [title, content, note, noteId, updateNote]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    await updateNote({ id: noteId, status: newStatus });
    patchNoteInList(noteId, { status: newStatus });
  };

  const handleTypeChange = async (newType: string) => {
    setTypeName(newType);
    await updateNote({ id: noteId, note_type_name: newType });
    const updated = await refetchNote(noteId);
    if (updated) {
      patchNoteInList(noteId, { note_type: updated.note_type });
    }
    await refetchTypes();
  };

  const handleAddTag = async (name: string) => {
    if (!note) return;
    const newTagArr = [...note.tags.map((tag) => tag.name), name];
    await updateNote({ id: noteId, tag_names: newTagArr });
    const updated = await refetchNote(noteId);
    if (updated) {
      patchNoteInList(noteId, { tags: updated.tags });
    }
    await refetchTags();
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!note) return;
    const newTagArr = note.tags
      .filter((tag) => tag.name !== tagToRemove)
      .map((tag) => tag.name);
    await updateNote({ id: noteId, tag_names: newTagArr });
    const updated = await refetchNote(noteId);
    if (updated) {
      patchNoteInList(noteId, { tags: updated.tags });
    }
    await refetchTags();
  };

  return {
    note,
    title,
    setTitle,
    content,
    setContent,
    typeName,
    setTypeName,
    status,
    setStatus,
    tags,
    types,
    isLoading,
    error,
    availableTags,
    handleAddTag,
    handleRemoveTag,
    handleStatusChange,
    handleTypeChange,
  };
}
