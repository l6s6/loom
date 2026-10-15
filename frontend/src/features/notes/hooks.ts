import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createNote,
  createTag,
  deleteNote,
  deleteTag,
  getNoteById,
  getNotes,
  getNoteTypes,
  getTags,
  updateNote,
} from "@/features/notes/api.ts";
import type { Note, NoteStatus } from "@/features/notes/types.ts";

export function useGetNotes(queryString?: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", queryString],
    queryFn: () => getNotes(queryString),
  });

  return {
    notes: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}

export function useGetNoteById(noteId: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => getNoteById(noteId),
  });

  return {
    note: data,
    isLoading,
    error: error ? error.message : null,
  };
}

export function useGetNoteTypes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["note_types"],
    queryFn: getNoteTypes,
  });

  return {
    types: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}

export function useGetTags() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  return {
    tags: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  return {
    deleteTag: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

export function useCreateAndNavigateNote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      navigate(`/n/${newNote.id}`);
    },
  });

  return {
    createAndNavigate: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  return {
    create: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNoteFromServer, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Update Cache from single note
      queryClient.setQueryData(["note", variables.id], updatedNoteFromServer);
      // Update Cache from NoteTypes and Tags if they have been Changed
      if (variables.note_type_name) {
        queryClient.invalidateQueries({ queryKey: ["note_types"] });
      }
      if (variables.tag_names) {
        queryClient.invalidateQueries({ queryKey: ["tags"] });
      }
    },
  });

  return { updateNote: mutateAsync, isLoading: isPending, error };
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteNote,
    onSuccess: (_, noteId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.removeQueries({ queryKey: ["note", noteId] });
    },
  });

  const remove = async (noteId: number, currentUrl?: string) => {
    await mutateAsync(noteId);
    if (!currentUrl || currentUrl === noteId.toString()) {
      navigate("/");
    }
  };

  return {
    deleteNote: remove,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

export function useNoteEditorLogic(note: Note) {
  const { updateNote } = useUpdateNote();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Auto-Save Debounce
  useEffect(() => {
    if (title === note.title && content === note.content) return;

    const timer = setTimeout(() => {
      updateNote({ id: note.id, title, content });
    }, 500);
    return () => clearTimeout(timer);
  }, [title, content, note.id, note.title, note.content, updateNote]);

  const handleStatusChange = (newStatus: NoteStatus) => {
    updateNote({ id: note.id, status: newStatus });
  };

  const handleTypeChange = (newType: string) => {
    updateNote({ id: note.id, note_type_name: newType });
  };

  const handleAddTag = (name: string) => {
    const newTags = [...note.tags.map((t) => t.name), name];
    updateNote({ id: note.id, tag_names: newTags });
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = note.tags
      .filter((t) => t.name !== tagToRemove)
      .map((t) => t.name);

    updateNote({ id: note.id, tag_names: newTags });
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    handleStatusChange,
    handleTypeChange,
    handleAddTag,
    handleRemoveTag,
  };
}
