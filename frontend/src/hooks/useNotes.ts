import {useState, useEffect} from "react";
import type Note from "../types/note.ts";
import {fetchNotes} from "../api/notes.ts";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetch = async () => {
          try {
            setNotes(await fetchNotes());
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
            setLoading(false);
          }
      };
      fetch();
  }, []);

  return { notes, loading, error };
}