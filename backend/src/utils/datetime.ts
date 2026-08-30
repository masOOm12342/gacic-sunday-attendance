/**
 * Utility functions for Indian Standard Time (IST - Asia/Kolkata / Mumbai)
 * UTC Offset: +05:30
 */

export function getISTNow(): Date {
  return new Date();
}

export function isISTSunday(date: Date = new Date()): boolean {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  }).format(date);
  return weekday.toLowerCase() === 'sunday';
}

export function getISTDayName(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long'
  }).format(date);
}

export function getISTDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getISTTimeString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

export function getISTDateTimeString(date: Date = new Date()): string {
  return `${getISTDateString(date)} ${getISTTimeString(date)}`;
}

