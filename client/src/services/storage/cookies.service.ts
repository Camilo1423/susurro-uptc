import { injectable } from "inversify";
import Cookies from "js-cookie";

/**
 * Servicio para operaciones con cookies del navegador.
 * Permite leer, escribir, actualizar y borrar cookies.
 */
@injectable()
export class CookieService {
  public setItem(
    key: string,
    value: unknown,
    options?: Cookies.CookieAttributes,
  ): void {
    try {
      const valueStr =
        typeof value === "object" ? JSON.stringify(value) : value?.toString();
      Cookies.set(key, valueStr ?? "", options);
    } catch (error) {
      console.error("Error saving cookie:", error);
    }
  }

  public getItem<T>(key: string): T | null {
    const itemStr = Cookies.get(key);
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
      console.error("Error reading cookie:", error);
      return null;
    }
  }

  public removeItem(key: string, options?: Cookies.CookieAttributes): void {
    try {
      Cookies.remove(key, options);
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  }

  public getAll(): Record<string, string> {
    try {
      return Cookies.get();
    } catch (error) {
      console.error("Error getting all cookies:", error);
      return {};
    }
  }

  public hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }
}
