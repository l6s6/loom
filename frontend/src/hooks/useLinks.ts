import { createLink, deleteLink, getLinksByNoteId } from "@/api/noteLinks.ts";
import { getLinks } from "@/api/noteLinks.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useGetLinksByNoteId(noteId: number) {
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
    loading: isPending,
    error: error ? error.message : null,
  };
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: deleteLink,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
  });

  return {
    deleteLink: mutateAsync,
    loading: isPending,
    error: error ? error.message : null,
  };
}
