export { cn } from "cn";

export function getStringPreview(
  limit: number,
  str: string,
  placeholder: string,
) {
  return str.length > 0
    ? str.length > limit
      ? str.substring(0, limit) + "..."
      : str
    : placeholder;
}
