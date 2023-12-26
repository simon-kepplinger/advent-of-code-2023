export function cache<T>(
  fn: (...args: unknown[]) => T
): (...args: unknown[]) => T {

  const cache = new Map<string, T>();

  return (...args: unknown[]) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
