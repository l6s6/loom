const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204 || options.method === "DELETE") {
    return {} as T;
  }

  return (await response.json()) as T;
}
