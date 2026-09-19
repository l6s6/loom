import type { Dispatch, SetStateAction } from "react";
import { AlignLeft } from "lucide-react";

interface ContentAreaProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const ContentArea = ({ value, onChange }: ContentAreaProps) => {
  return (
    <div className="relative group mt-8">
      <div className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <AlignLeft size={20} className="text-slate-300 hover:text-slate-500" />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing..."
        className="w-full bg-transparent border-none outline-none focus:ring-0 placeholder-slate-300 p-0 text-lg text-slate-700 min-h-[400px] resize-none leading-relaxed"
      />
    </div>
  );
};

export default ContentArea;
