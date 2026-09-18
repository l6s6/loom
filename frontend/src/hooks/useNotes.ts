import { useState, useEffect } from "react";
import {
  type CreateNote,
  EMPTY_NEW_NOTE,
  type Note,
  type UpdateNote,
} from "../types/note.ts";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
} from "../api/notes.ts";

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

export function useGetNoteById(noteId: number) {
  const [note, setNote] = useState<Note>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (id: number) => {
    try {
      setNote(await getNoteById(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(noteId);
  }, [noteId]);

  return { refetchNote: load, note, loading, error };
}

export function useCreateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const create = async (note: CreateNote = EMPTY_NEW_NOTE) => {
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

  const remove = async (noteId: number) => {
    try {
      return await deleteNote(noteId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { deleteNote: remove, loading, error };
}
