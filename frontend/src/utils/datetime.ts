/**
 * Format IST Date strings (YYYY-MM-DD) into readable formats like "Sunday, 10 Aug 2026"
 */
export function formatISTDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format IST DateTime
 */
export function formatISTDateTime(dateTimeStr: string): string {
  if (!dateTimeStr) return '';
  return dateTimeStr; // Already stored in IST format "YYYY-MM-DD hh:mm:ss AM/PM"
}
