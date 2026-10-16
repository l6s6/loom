import {
  useCreateNoteType,
  useDeleteNoteType,
  useGetNoteTypes,
  useUpdateNoteType,
} from "@/features/notes/hooks.ts";
import EntityManagement from "@/components/layout/EntityManagement.tsx";

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
        <div className="px-4 py-2 border border-transparent rounded-sm bg-primary-bg">
          <span className="font-bold text-primary">{item.name}</span>
        </div>
      )}
    />
  );
};

export default NoteTypesView;
