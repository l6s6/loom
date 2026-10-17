export { cn } from "cn";

export function getStringPreview(
  limit: number,
  str: string,
  placeholder: string,
): string {
  if (!str || str.length == 0) return placeholder;
  return str.length > limit ? str.substring(0, limit) + "..." : str;
}
