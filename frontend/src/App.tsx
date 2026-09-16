import { useGetNotes } from "./hooks/useNotes.ts";
import CreateNoteForm from "./components/forms/CreateNoteForm.tsx";
import UpdateNoteForm from "./components/forms/UpdateNoteForm.tsx";
import DeleteNoteForm from "./components/forms/DeleteNoteForm.tsx";
import { useGetTags } from "./hooks/useTags.ts";
import { useGetTypes } from "./hooks/useTypes.ts";

export function App() {
  const { refetchNotes } = useGetNotes();
  const { refetchTags, tags } = useGetTags();
  const { refetchTypes, types } = useGetTypes();

  const refetchData = async () => {
    await refetchNotes();
    await refetchTags();
    await refetchTypes();
  };

  let typesArr = types.map((obj) => obj.name);
  let tagsArr = tags.map((obj) => obj.name);

  return (
    <div className="w-full h-full px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <CreateNoteForm
            onSubmitted={refetchData}
            tags={tagsArr}
            types={typesArr}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <UpdateNoteForm
            onSubmitted={refetchData}
            tags={tagsArr}
            types={typesArr}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <DeleteNoteForm onSubmitted={refetchData} />
        </div>
      </section>
    </div>
  );
}
