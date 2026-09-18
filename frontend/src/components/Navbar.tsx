const Navbar = () => {
  return (
    <header className="bg-bg-sidebar border-b border-border-subtle">
      <div className="flex flex-row px-8 py-4">
        <div className="w-sidebar">
          <a href="/" className="text-2xl font-bold text-primary">
            Loom
          </a>
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
