import { createContext, useContext, type ReactNode } from "react";
import { useGetNotes } from "../hooks/useNotes";
import type { Note } from "../types/note";

interface NotesContextValue {
  notes: Note[];
  loading: boolean;
  error: string | null;
  refetchNotes: () => Promise<void>;
  patchNoteInList: (id: number, changes: Partial<Note>) => void;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { notes, loading, error, refetchNotes, setNotes } = useGetNotes();

  const patchNoteInList = (id: number, changes: Partial<Note>) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, ...changes } : note)),
    );
  };

  const value: NotesContextValue = {
    notes,
    loading,
    error,
    refetchNotes,
    patchNoteInList,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a NotesContext.Provider");
  }
  return context;
}
