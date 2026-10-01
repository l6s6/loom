import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-bg-sidebar border-b border-border-subtle">
      <div className="flex flex-row px-8 py-4">
        <div className="w-sidebar">
          <div
            className="flex flex-row just items-center gap-2 text-2xl font-bold text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            <BookOpen />
            Loom
          </div>
        </div>
        <div className="flex flex-row gap-16 items-center">
          <a href="/" className="hover:underline">
            Notes
          </a>
          <a href="/graph" className="hover:underline">
            Graph
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
