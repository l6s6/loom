import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "./App.tsx";
import Layout from "./Layout.tsx";
import NoteView from "./NoteEditor.tsx";
import Test from "@/Test.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/test" element={<Test />} />
          <Route path="/n/:noteId" element={<NoteView />} />;
        </Routes>
      </Layout>
    </BrowserRouter>
  </StrictMode>,
);
