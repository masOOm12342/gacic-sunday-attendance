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

/**
 * Check if the current time in Indian Standard Time (Asia/Kolkata) is Sunday
 */
export function isISTSunday(date: Date = new Date()): boolean {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  }).format(date);
  return weekday.toLowerCase() === 'sunday';
}

/**
 * Get current day name in Indian Standard Time (e.g. "Sunday", "Monday")
 */
export function getISTDayName(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  }).format(date);
}

/**
 * Get formatted IST Date (YYYY-MM-DD)
 */
export function getISTDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

