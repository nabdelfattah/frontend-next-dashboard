/**
 * Shallow-equality check for two flat string-keyed records, ignoring key
 * order (unlike a plain `JSON.stringify` comparison).
 */
export function shallowEqualRecord(
  a: Record<string, string>,
  b: Record<string, string>
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}
