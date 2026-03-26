export function parseDateInput(value: string): Date | null {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}
