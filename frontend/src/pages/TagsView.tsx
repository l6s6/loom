import {
  useCreateTag,
  useDeleteTag,
  useGetTags,
  useUpdateTag,
} from "@/features/notes/hooks.ts";
import EntityManagement from "@/components/layout/EntityManagement.tsx";

const TagsView = () => {
  const { tags, isLoading, error } = useGetTags();
  const { createTag } = useCreateTag();
  const { updateTag } = useUpdateTag();
  const { deleteTag } = useDeleteTag();

  return (
    <EntityManagement
      title="Tag Overview"
      entityName="Tag"
      items={tags}
      isLoading={isLoading}
      error={error}
      onCreate={(name) => createTag({ name })}
      onUpdate={(id, name) => updateTag({ id, name })}
      onDelete={deleteTag}
      canDelete={() => true}
      renderBadge={(item) => (
        <div className="px-4 py-2 border border-border-subtle rounded-sm bg-bg-sidebar">
          <span className="font-bold text-content-muted">#{item.name}</span>
        </div>
      )}
    />
  );
};

export default TagsView;
