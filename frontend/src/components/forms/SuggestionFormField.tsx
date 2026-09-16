import { useId } from "react";

interface SuggestionFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
}

export const SuggestionFormField = ({
  label,
  value,
  onChange,
  placeholder,
  suggestions,
}: SuggestionFormFieldProps) => {
  const dataListId = useId();
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        list={dataListId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 sm:text-sm px-3 py-2"
      />
      <datalist id={dataListId}>
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </div>
  );
};
