export function startOfLocalDay(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
}
