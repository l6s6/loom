import { useState, useEffect } from "react";
import type {
  CreateNote,
  DeleteNote,
  Note,
  UpdateNote,
} from "../types/note.ts";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notes.ts";

export function useGetNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setNotes(await getNotes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { refetchNotes: load, notes, loading, error };
}

export function useCreateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const create = async (note: CreateNote) => {
    try {
      return await createNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { createNote: create, loading, error };
}

export function useUpdateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const update = async (noteUpdates: UpdateNote) => {
    try {
      return await updateNote(noteUpdates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { updateNote: update, loading, error };
}

export function useDeleteNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const remove = async (note: DeleteNote) => {
    try {
      return await deleteNote(note);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { deleteNote: remove, loading, error };
}
