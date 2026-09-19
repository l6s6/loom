import { type Dispatch, type SetStateAction } from "react";

interface TitleInputProps {
  title: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const TitleInput = ({ title, onChange }: TitleInputProps) => {
  return (
    <input
      type="text"
      value={title}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Untitled"
      className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight"
    />
  );
};

export default TitleInput;
