import {
  useCreateNoteType,
  useDeleteNoteType,
  useGetNoteTypes,
  useUpdateNoteType,
} from "@/features/notes/hooks.ts";
import EntityManagement from "@/components/layout/EntityManagement.tsx";
import { Link } from "react-router-dom";

/**
 * Page for managing note types in the application.
 *
 * It loads available note types, allows creation and editing through the generic
 * entity management UI, and links each type badge to the filtered notes view.
 */
const NoteTypesView = () => {
  const { types, isLoading, error } = useGetNoteTypes();
  const { createNoteType } = useCreateNoteType();
  const { updateNoteType } = useUpdateNoteType();
  const { deleteNoteType } = useDeleteNoteType();

  return (
    <EntityManagement
      title="Note Type Overview"
      entityName="Note Type"
      items={types}
      isLoading={isLoading}
      error={error}
      onCreate={(name) => createNoteType({ name })}
      onUpdate={(id, name) => updateNoteType({ id, name })}
      onDelete={deleteNoteType}
      canDelete={(item) => item.note_count === 0}
      renderBadge={(item) => (
        <Link to={`/?type=${item.name}`}>
          <div className="px-4 py-2 border border-transparent rounded-sm bg-primary-bg cursor-pointer">
            <span className="font-bold text-primary">{item.name}</span>
          </div>
        </Link>
      )}
    />
  );
};

export default NoteTypesView;
