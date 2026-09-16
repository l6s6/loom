import { useParams } from "react-router-dom";
import { useGetNoteById } from "./hooks/useNotes.ts";

const NoteView = () => {
  const { noteId } = useParams();
  if (noteId === undefined) {
    return <p>no note id given</p>;
  }
  const noteIdInt: number = parseInt(noteId);
  if (isNaN(noteIdInt)) {
    return <p>note id is NaN</p>;
  }
  const { note, error, loading } = useGetNoteById(noteIdInt);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  if (note === undefined) {
    return <p>Error fetching note</p>;
  }
  const tagsArr = note.tags.map((obj) => obj.name);
  const hasTags = tagsArr.length > 0;
  return (
    <div className="px-8  py-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{note.title}</h1>
        <h3 className="text-gray-500">Status: {note.status}</h3>
        <h3 className="text-gray-500">
          Tags: {hasTags ? tagsArr.join(", ") : "-"}
        </h3>
      </div>

      <p className="">{note.content}</p>
    </div>
  );
};

export default NoteView;
