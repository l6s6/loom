import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotesView } from "./pages/NotesView.tsx";
import Layout from "./components/layout/Layout.tsx";
import EditorView from "./pages/EditorView.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TagsView from "@/pages/TagsView.tsx";
import NoteTypesView from "@/pages/NoteTypesView.tsx";
import TodoView from "@/pages/TodoView.tsx";
import GraphView from "@/pages/GraphView.tsx";

/**
 * Shared React Query client instance for the application.
 */
const queryClient = new QueryClient();

/**
 * Application bootstrap.
 *
 * This creates the React root, configures routing, wraps the app in the Query
 * client provider, and mounts the application layout with all page routes.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<NotesView />} />
            <Route path="/tags" element={<TagsView />} />
            <Route path="/todo" element={<TodoView />} />
            <Route path="/graph" element={<GraphView />} />
            <Route path="/note-types" element={<NoteTypesView />} />
            <Route path="/n/:noteId" element={<EditorView />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
