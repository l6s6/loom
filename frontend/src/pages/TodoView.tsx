import { CenterContainer } from "@/components/layout/CenterContainer.tsx";

/**
 * Placeholder page for future TODO functionality.
 *
 * This view currently acts as a stub so the route exists while the feature is
 * still under development.
 */
const TodoView = () => {
  return (
    <CenterContainer>
      <h1 className="w-full text-4xl font-extrabold bg-transparent border-none outline-none focus:ring-0 placeholder-slate-200 p-0 mb-6 tracking-tight">
        TODO
      </h1>
      <div className="w-full h-full px-4 py-8 flex flex-col justify-center">
        <p className="text-content-muted text-center mt-4">
          This page is not finished yet.
        </p>
      </div>
    </CenterContainer>
  );
};

export default TodoView;
