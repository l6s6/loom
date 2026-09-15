import { useState, useEffect } from "react";
import type {
  CreateNote,
  DeleteNote,
  Note,
  UpdateNote,
} from "../types/note.ts";
import {
  fetchGetNotes,
  fetchCreateNote,
  fetchUpdateNote,
  fetchDeleteNote,
} from "../api/notes.ts";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setNotes(await fetchGetNotes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return { refetch: fetchNotes, notes, loading, error };
}

export function useCreateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const createNote = async (note: CreateNote) => {
    try {
      return await fetchCreateNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { createNote, loading, error };
}

export function useUpdateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateNote = async (noteUpdates: UpdateNote) => {
    try {
      return await fetchUpdateNote(noteUpdates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { updateNote, loading, error };
}

export function useDeleteNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const deleteNote = async (note: DeleteNote) => {
    try {
      return await fetchDeleteNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { deleteNote, loading, error };
}
