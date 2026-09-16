import {
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
  useState,
} from "react";

interface TagFieldProps {
  tags: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  suggestions: string[];
}

export const TagField = ({ tags, onChange, suggestions }: TagFieldProps) => {
  const [currentTag, setCurrentTag] = useState("");

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!tags.includes(currentTag) && currentTag) {
        onChange((preValues: string[]) => [...preValues, currentTag]);
      }
      setCurrentTag("");
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    onChange((preValues) => preValues.filter((item) => item !== tagToDelete));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Tags</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            className="flex flex-wrap gap-2 rounded-full bg-gray-200 px-2 py-1 items-center"
            key={tag}
          >
            <span>{tag}</span>
            <div
              className="flex h-4 w-4 items-center justify-center hover:bg-gray-300 text-center cursor-pointer"
              onClick={() => handleDeleteTag(tag)}
            >
              X
            </div>
          </div>
        ))}
        <input
          type="text"
          list="tag-suggestions"
          value={currentTag}
          onChange={(e) => setCurrentTag(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="inspiration"
          className="mt-1 flex-1 min-w-48 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm px-3 py-2"
        />
      </div>
      <datalist id="tag-suggestions">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
};
