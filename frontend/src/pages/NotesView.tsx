import { CenterContainer } from "@/components/layout/CenterContainer.tsx";
import NoteGridItem from "@/features/notes/components/NoteGridItem.tsx";

import { useSearchParams } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  useCreateAndNavigateNote,
  useDeleteNote,
  useGetNotes,
} from "@/features/notes/hooks.ts";
import NoteSearchBar from "@/features/notes/components/NoteSearchBar.tsx";
import LoadingSpinner from "@/components/LoadingSpinner.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import { buildQueryString } from "@/lib/utils.ts";

export function NotesView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const feedFilters = {
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    tag: searchParams.get("tag") || "",
    is_loose_end: searchParams.get("is_loose_end") || "",
    is_archived: searchParams.get("is_archived") || "",
    is_pinned: searchParams.get("is_pinned") || "",
    is_private: searchParams.get("is_private") || "",
  };

  const queryString = buildQueryString(feedFilters);

  const { notes, isLoading, error } = useGetNotes(queryString);
  const { createAndNavigateNote } = useCreateAndNavigateNote();
  const { deleteNote } = useDeleteNote();

  const handleFilterChange = (name: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const sortedNotes = [...notes]
    .sort((a, b) => a.modified_at.localeCompare(b.modified_at))
    .reverse();

  if (error) return <ErrorView error={error} />;

  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Your Notes
      </h1>
      <Command>
        <NoteSearchBar
          feedFilters={feedFilters}
          handleFilterChange={handleFilterChange}
        />
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <CommandList className="max-h-full mt-4">
            <CommandEmpty>
              <span className="text-content-muted">No Notes found.</span>
            </CommandEmpty>

            <CommandGroup className="**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-1 md:**:[[cmdk-group-items]]:grid-cols-2 **:[[cmdk-group-items]]:gap-2">
              {/* Use [&>svg]:hidden on CommandItem to hide Check Mark placeholder  */}
              {sortedNotes.map((note) => (
                <CommandItem
                  key={note.id}
                  className="p-0 w-full [&>svg]:hidden data-selected:bg-transparent"
                >
                  <NoteGridItem
                    note={note}
                    onCreate={createAndNavigateNote}
                    onDelete={deleteNote}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </CenterContainer>
  );
}
