export function isRealObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isPrimitive(
  value: unknown,
): value is string | number | boolean | bigint | symbol | null | undefined {
  return (
    value === null || (typeof value !== "object" && typeof value !== "function")
  );
}
