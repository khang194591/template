export function safeStringify<T>(obj: T | Record<string, unknown>) {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return "";
  }
}

export function safeParse<T>(str: string) {
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    return undefined;
  }
}
