export { cn } from "cn";

/**
 * Returns a shortened preview string for display in compact UI surfaces.
 *
 * @param limit - Maximum length of the visible string before truncation.
 * @param str - The source string to preview.
 * @param placeholder - Value returned when the string is empty or missing.
 * @returns A truncated preview string or the placeholder.
 */
export function getStringPreview(
  limit: number,
  str: string,
  placeholder: string,
): string {
  if (!str || str.length == 0) return placeholder;
  return str.length > limit ? str.substring(0, limit) + "..." : str;
}

/**
 * Builds a URL query string from a filter object while ignoring empty values.
 *
 * @param queryFilters - Mapping of query parameter names to values.
 * @returns A query string suitable for backend requests.
 */
export const buildQueryString = (queryFilters: { [s: string]: string }) => {
  const paramsForBackend = new URLSearchParams();
  Object.entries(queryFilters).forEach(([key, value]) => {
    if (value) {
      paramsForBackend.append(key, value);
    }
  });
  return paramsForBackend.toString();
};
