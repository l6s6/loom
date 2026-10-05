import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getNoteById,
} from "../api/notes.ts";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetNotes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
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

export function useUpdateNote() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNoteFromServer, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // Update Cache from single note
      queryClient.setQueryData(["note", variables.id], updatedNoteFromServer);
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
    loading: isPending,
    error: error ? error.message : null,
  };
}
