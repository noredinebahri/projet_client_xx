import format from "date-fns/format";

export const dateFormat = 'dd.MM.yyyy'
export const timeFormat = 'HH:mm'
export const dateTimeFormat = `${dateFormat} ${timeFormat}`;

export function formatDateTime(date: Date | null | undefined, part? : 'date' | 'time'): string {
  if (date) {
    const targetFormat = part ? (part === 'date' ? dateFormat : timeFormat) : dateTimeFormat;
    return format(date, targetFormat);
  }
  return '';
}

export function parseDateInIso(dateInIso: string): Date | null {
  if (dateInIso) {
    const parsedDate = new Date(dateInIso)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }
  return null;
}

export function parseDatePropertiesForEachElementOf<T, R>(objects: T[], properties: (keyof T)[]): R[] {
  if (objects) {
    return objects.map(object => parseDatePropertiesOf<T, R>(object, properties));
  }
  return objects;
}

export function parseDatePropertiesOf<T, R>(object: T, properties: (keyof T)[]): R {
  if (object) {
    const objectCopy = {...object} as any;
    properties.forEach(property => {
      if (property) {
        const propertyValue = objectCopy[property];
        if (propertyValue) {
          objectCopy[property] = parseDateInIso(propertyValue);
        }
      }
    });
    return objectCopy as R;
  }
  return object as unknown as R;
}
