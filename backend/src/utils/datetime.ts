/**
 * Utility functions for Indian Standard Time (IST - Asia/Kolkata / Mumbai)
 * UTC Offset: +05:30
 */

export function getISTNow(): Date {
  const now = new Date();
  // IST offset in minutes is +330 (+5 hours 30 mins)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (330 * 60000));
}

export function getISTDateString(date: Date = getISTNow()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getISTTimeString(date: Date = getISTNow()): string {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export function getISTDateTimeString(date: Date = getISTNow()): string {
  return `${getISTDateString(date)} ${getISTTimeString(date)}`;
}
