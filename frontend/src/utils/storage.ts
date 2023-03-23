import { safeParse } from "./json";

export class Storage {
  getLocalStorage = (key: string) =>
    localStorage ? localStorage.getItem(key) || "" : "";

  setLocalStorage(key: string, value: string) {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  }

  getFromKey<T>(key: string): T | Record<string, unknown> {
    const jsonString = this.getLocalStorage(key);
    return safeParse<T>(jsonString) || {};
  }
}

const storage = new Storage();

export { storage };
