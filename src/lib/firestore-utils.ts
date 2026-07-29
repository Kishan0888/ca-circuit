type TimestampLike = Date | { toDate?: () => Date } | null | undefined;

function toMillis(value: TimestampLike): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  return 0;
}

export function sortByCreatedAtDesc<T extends { createdAt?: TimestampLike }>(items: T[]): T[] {
  return [...items].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
}

export function sortByFieldDesc<T>(items: T[], getValue: (item: T) => number): T[] {
  return [...items].sort((a, b) => getValue(b) - getValue(a));
}

export function sortByFieldAsc<T>(items: T[], getValue: (item: T) => number): T[] {
  return [...items].sort((a, b) => getValue(a) - getValue(b));
}
