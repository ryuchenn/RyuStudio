export default class DateHelper {
  static formatDate(dateStr: string, withTime: boolean = false): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
      ...(withTime && {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
    return date.toLocaleString("en-US", options);
  }

  static formatDateWithoutYear(dateStr: string, withTime: boolean = false): string {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      ...(withTime && {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
    return date.toLocaleString("en-US", options);
  }
  
  static formatYMD(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  }

  static formatFull(date: Date | string): string {
    return new Date(date).toLocaleString();
  }
}
