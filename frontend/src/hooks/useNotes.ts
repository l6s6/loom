import { useState, useEffect } from "react";
import { type Note, type UpdateNote } from "../types/note.ts";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
} from "../api/notes.ts";
import { useNavigate } from "react-router-dom";
import { useNotesContext } from "@/context/NotesContext.tsx";

export function useGetNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setNotes(await getNotes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchNotes: load, notes, loading: isLoading, error, setNotes };
}

export function useGetNoteById(noteId: number) {
  const [note, setNote] = useState<Note>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNoteById(id);
      setNote(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(noteId);
  }, [noteId]);

  return { refetchNote: load, note, loading: isLoading, error };
}
export function useCreateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async () => {
    setIsLoading(true);
    setError(null);
    try {
      return await createNote();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { createNote: create, loading: isLoading, error };
}

export function useCreateAndNavigateNote() {
  const navigate = useNavigate();
  const { refetchNotes } = useNotesContext();
  const { createNote } = useCreateNote();

  const createAndNavigate = async () => {
    const newNote = await createNote();
    if (newNote) {
      await refetchNotes();
      navigate(`/n/${newNote.id}`);
    }
  };

  return { createAndNavigate };
}

export function useUpdateNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (noteUpdates: UpdateNote) => {
    setIsLoading(true);
    setError(null);
    try {
      return await updateNote(noteUpdates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { updateNote: update, loading: isLoading, error };
}

export function useDeleteNote() {
  const navigate = useNavigate();
  const { refetchNotes } = useNotesContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async (noteId: number, currentUrl?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!currentUrl || currentUrl === noteId.toString()) {
        navigate("/");
      }
      await deleteNote(noteId);
      await refetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteNote: remove, loading: isLoading, error };
}
