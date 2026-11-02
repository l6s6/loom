import {
  useCreateTag,
  useDeleteTag,
  useGetTags,
  useUpdateTag,
} from "@/features/notes/hooks.ts";
import EntityManagement from "@/components/layout/EntityManagement.tsx";
import { Link } from "react-router-dom";

/**
 * Page for managing tags in the application.
 *
 * It loads all tags, supports create/update/delete actions through the shared
 * entity management UI, and links each tag badge to the filtered notes view.
 */
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
        <Link to={`/?tag=${item.name}`}>
          <div className="px-4 py-2 border border-border-subtle rounded-sm bg-bg-sidebar">
            <span className="font-bold text-content-muted">#{item.name}</span>
          </div>
        </Link>
      )}
    />
  );
};

export default TagsView;
