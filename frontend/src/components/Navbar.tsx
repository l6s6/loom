const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-20">
      <div className="flex flex-row mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Loom</h1>
        <div className="flex ml-48 flex-row gap-10 items-center">
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
