export default class WebHelper {
  static joinUrl(base: string, path: string): string {
    return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  }

  static capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  static isEmpty(str?: string | null): boolean {
    return !str || str.trim().length === 0;
  }

  static truncate(str: string, length: number): string {
    return str.length > length ? str.slice(0, length) + "…" : str;
  }
}
