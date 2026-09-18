import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App.tsx";
import Layout from "./Layout.tsx";
import Test from "@/Test.tsx";
import GraphView from "@/GraphView.tsx";
import EditorView from "./EditorView.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/n/:noteId" element={<EditorView />} />;
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
