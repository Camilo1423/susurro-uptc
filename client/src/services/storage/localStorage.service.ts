import { injectable } from "inversify";

/**
 * Servicio para operaciones con localStorage.
 * Permite leer, escribir, actualizar y borrar datos del almacenamiento local.
 */
@injectable()
export class LocalStorageService {
  public setItem(key: string, value: unknown): void {
    try {
      const valueStr =
        typeof value === "object" ? JSON.stringify(value) : value?.toString();
      localStorage.setItem(key, valueStr ?? "");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  public getItem<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    try {
      try {
        const parsedValue = JSON.parse(itemStr);
        return parsedValue as T;
      } catch {
        if (!isNaN(Number(itemStr)) && itemStr.trim() !== "") {
          return Number(itemStr) as unknown as T;
        }
        return itemStr as unknown as T;
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }

  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  public hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}
