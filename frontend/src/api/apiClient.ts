/**
 * Base API URL for backend requests.
 * Falls back to the local FastAPI development server when no environment variable is set.
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Generic API helper for making HTTP requests to the backend.
 *
 * @template T - The expected JSON response type.
 * @param endpoint - API path to request, relative to the configured base URL.
 * @param options - Fetch options such as method, headers, and body.
 * @returns A parsed JSON response of type T.
 * @throws Throws an Error when the backend responds with a non-OK HTTP status.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Treat empty successful responses (such as 204 No Content) as an empty object.
  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) message = data.detail;
    } catch {
      // Fallback message
    }
    throw new Error(message);
  }

  if (response.status === 204 || options.method === "DELETE") {
    return {} as T;
  }

  return (await response.json()) as T;
}

/**
 * Reset the demo dataset in the backend.
 *
 * @returns A promise resolving to the list of restored demo notes.
 */
export const resetDemoData = () =>
  apiClient<{ message?: string; error?: string }>("/reset-demo", {
    method: "POST",
  });
