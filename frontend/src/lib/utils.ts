export { cn } from "cn";

export function getStringPreview(
  limit: number,
  str: string,
  placeholder: string,
): string {
  return str.length > 0
    ? str.length > limit
      ? str.substring(0, limit) + "..."
      : str
    : placeholder;
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
