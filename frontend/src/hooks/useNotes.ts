import { useState, useEffect } from "react";
import type { CreateNote, Note } from "../types/note.ts";
import { createNote, fetchNotes } from "../api/notes.ts";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setNotes(await fetchNotes());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { refetch, notes, loading, error };
}

export function useCreateNote() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const create = async (newNote: CreateNote) => {
    try {
      return await createNote(newNote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { create, loading, error };
}
