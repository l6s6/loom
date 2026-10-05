export { cn } from "cn";

export function getStringPreview(
  limit: number,
  str: string,
  placeholder: string,
): string {
  if (!str || str.length == 0) return placeholder;
  return str.length > limit ? str.substring(0, limit) + "..." : str;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
