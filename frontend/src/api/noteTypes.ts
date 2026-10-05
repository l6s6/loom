import type { NoteType } from "../types/noteType.ts";
import { apiClient } from "@/api/client.ts";

// GET Note Types
export const getNoteTypes = () => apiClient<NoteType[]>("/notes/types");
