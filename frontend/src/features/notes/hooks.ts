import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createNote,
  createNoteType,
  createTag,
  deleteNote,
  deleteNoteType,
  deleteTag,
  getNoteById,
  getNotes,
  getNoteTypes,
  getTags,
  updateNote,
  updateNoteType,
  updateTag,
} from "@/features/notes/api.ts";
import type { Note, NoteStatus } from "@/features/notes/types.ts";

/**
 * Fetches the note list, optionally scoped by a query string.
 *
 * @param queryString - Optional URL query string used to filter the notes list.
 * @returns Result object with notes, loading state, and error message.
 */
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

/**
 * Fetches a single note by ID.
 *
 * @param noteId - The note ID to fetch.
 * @returns Result object with the note, loading state, and error message.
 */
export function useGetNoteById(noteId: string) {
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

/**
 * Fetches all available note types.
 *
 * @returns Result object with note types, loading state, and error message.
 */
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

/**
 * Fetches all tags used across notes.
 *
 * @returns Result object with tags, loading state, and error message.
 */
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

/**
 * Deletes a tag and invalidates the tag cache.
 */
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

/**
 * Deletes a note type and invalidates the note type cache.
 */
export function useDeleteNoteType() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteNoteType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["note_types"] }),
  });

  return {
    deleteNoteType: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Creates a note and navigates to the editor page for the new note.
 */
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
    createAndNavigateNote: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Creates a new tag and invalidates the tag cache.
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });

  return {
    createTag: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Creates a new note type and invalidates the note type cache.
 */
export function useCreateNoteType() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createNoteType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["note_types"] }),
  });

  return {
    createNoteType: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Updates a note and synchronizes the cached note data and related metadata caches.
 */
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

/**
 * Updates a tag and invalidates related note and tag queries.
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return { updateTag: mutateAsync, isLoading: isPending, error };
}

/**
 * Updates a note type and invalidates related note and type queries.
 */
export function useUpdateNoteType() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateNoteType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note_types"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return { updateNoteType: mutateAsync, isLoading: isPending, error };
}

/**
 * Deletes a note, invalidates note queries, and redirects the user home if needed.
 */
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

  const remove = async (noteId: string, currentUrl?: string) => {
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

/**
 * Encapsulates the local editor state and autosave behavior for a note.
 */
export function useNoteEditorLogic(note: Note) {
  const { updateNote } = useUpdateNote();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Auto-save debounce: persist changes after 500 ms when content or title differs.
  useEffect(() => {
    if (title === note.title && content === note.content) return;

    if (title == "" || title == null) {
      setTitle(note.title);
    }

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
