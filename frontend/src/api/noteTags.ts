import type { NoteTag } from "../types/noteTag.ts";
import { apiClient } from "@/api/client.ts";

// GET Note Tags
export const getNoteTags = () => apiClient<NoteTag[]>("/notes/tags");
