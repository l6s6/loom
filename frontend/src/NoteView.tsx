import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetNoteById, useUpdateNote } from "./hooks/useNotes.ts";
import { NoteStatus } from "./types/note.ts";
import { useNoteFieldsState } from "./hooks/useNoteFieldsState.ts";

const NoteView = () => {
  const { noteId } = useParams();

  const noteIdInt = noteId ? parseInt(noteId) : NaN;

  const { note, error, loading } = useGetNoteById(noteIdInt);
  const { updateNote } = useUpdateNote();
  const fields = useNoteFieldsState();

  useEffect(() => {
    if (note) {
      fields.setTitle(note.title);
      fields.setContent(note.content);
      fields.setStatus(note.status);
    }
  }, [note]);

  // Debouncing to avoid too many db updates
  useEffect(() => {
    const titleChanged = note && fields.title !== note.title;
    const contentChanged = note && fields.content !== note.content;

    if (!titleChanged && !contentChanged) return;
    const timerId = setTimeout(() => {
      updateNote({
        id: noteIdInt,
        title: fields.title,
        content: fields.content,
      });
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [fields.title, fields.content, note, noteIdInt, updateNote]);

  if (!noteId || isNaN(noteIdInt)) return <p>Invalid note ID</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!note) return <p>Error fetching note</p>;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    fields.setStatus(e.target.value);
    updateNote({
      id: noteIdInt,
      status: e.target.value,
    });
  };

  const tagsArr = note.tags.map((obj) => obj.name);
  const hasTags = tagsArr.length > 0;
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-4xl mx-auto px-editor-x py-editor-y">
        <input
          type="text"
          value={fields.title}
          onChange={(e) => fields.setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-4xl font-bold bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 p-0"
        />
        <div className="mb-4 border-b border-gray-300 py-4">
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Status:</span>

            <select
              value={fields.status}
              onChange={handleStatusChange}
              className="bg-transparent appearance-none border-none outline-none focus:ring-0 p-0 text-gray-500 cursor-pointer"
            >
              {Object.values(NoteStatus).map((option: string) => (
                <option key={option} value={option} className="text-gray-900">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <h3 className="text-gray-500">Type: {note.note_type.name}</h3>
          <h3 className="text-gray-500">
            Tags: {hasTags ? tagsArr.join(", ") : "-"}
          </h3>{" "}
        </div>
        <input
          type="text"
          value={fields.content}
          onChange={(e) => fields.setContent(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 p-0"
        />
      </div>
    </div>
  );
};

export default NoteView;
