import { CenterContainer } from "@/components/layout/CenterContainer.tsx";

const GraphView = () => {
  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        Graph View
      </h1>
      <div className="w-full h-full px-4 py-8 flex flex-col justify-center">
        <p className="text-content-muted text-center mt-4">
          Graph view coming soon.{" "}
        </p>
      </div>
    </CenterContainer>
  );
};

export default GraphView;
