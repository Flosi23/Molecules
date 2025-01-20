import type { Atom } from "~/domain/entity";

const LOCAL_STORAGE_KEY = "atoms";

export class AtomRepository {
  private static isStorageAvailable(): boolean {
    if (typeof localStorage === "undefined") {
      return false;
    }
    return !!localStorage;
  }

  private static assertLocalStorage(): void {
    if (!this.isStorageAvailable()) {
      throw new Error("localStorage is not available");
    }
  }

  static save(atoms: Atom[]): void {
    // check if localStorage is available
    this.assertLocalStorage();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atoms));
  }

  static load(): Atom[] {
    // check if localStorage is available
    this.assertLocalStorage();
    const atoms = localStorage.getItem(LOCAL_STORAGE_KEY);
    return atoms ? JSON.parse(atoms) : [];
  }
}
