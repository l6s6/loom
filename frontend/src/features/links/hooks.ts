import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLink,
  deleteLink,
  getLinks,
  getLinksByNoteId,
  getLinkTypes,
} from "@/features/links/api.ts";

/**
 * Fetch the full list of links and expose the result to a component.
 *
 * @returns An object with the links data, loading state, and error message.
 */
export function useGetLinks() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["links"],
    queryFn: getLinks,
  });

  return {
    notes: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}

/**
 * Fetch the links associated with a specific note.
 *
 * @param noteId - The ID of the note whose links should be retrieved.
 * @returns An object with the current note's links, loading state, and error message.
 */
export function useGetLinksByNoteId(noteId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["links", noteId],
    queryFn: () => getLinksByNoteId(noteId),
  });

  return {
    links: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}

/**
 * Mutation hook for creating a new link and invalidating cached link queries.
 *
 * @returns An object with the async mutation function and loading/error state.
 */
export function useCreateLink() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createLink,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    createLink: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Mutation hook for deleting a link and invalidating cached link queries.
 *
 * @returns An object with the async delete mutation function and loading/error state.
 */
export function useDeleteLink() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["links"] }),
  });

  return {
    deleteLink: mutateAsync,
    isLoading: isPending,
    error: error ? error.message : null,
  };
}

/**
 * Fetch all available link type definitions.
 *
 * @returns An object with the link types, loading state, and error message.
 */
export function useGetLinkTypes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["link-types"],
    queryFn: getLinkTypes,
  });

  return {
    types: data || [],
    isLoading,
    error: error ? error.message : null,
  };
}
