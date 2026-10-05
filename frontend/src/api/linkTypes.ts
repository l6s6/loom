import type { LinkType } from "@/types/linkType.ts";
import { apiClient } from "@/api/client.ts";

// GET Link Types
export const getLinkTypes = () => apiClient<LinkType[]>("/links/types");
