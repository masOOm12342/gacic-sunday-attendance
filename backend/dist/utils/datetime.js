"use strict";
/**
 * Utility functions for Indian Standard Time (IST - Asia/Kolkata / Mumbai)
 * UTC Offset: +05:30
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getISTNow = getISTNow;
exports.getISTDateString = getISTDateString;
exports.getISTTimeString = getISTTimeString;
exports.getISTDateTimeString = getISTDateTimeString;
function getISTNow() {
    const now = new Date();
    // IST offset in minutes is +330 (+5 hours 30 mins)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (330 * 60000));
}
function getISTDateString(date = getISTNow()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function getISTTimeString(date = getISTNow()) {
    return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}
function getISTDateTimeString(date = getISTNow()) {
    return `${getISTDateString(date)} ${getISTTimeString(date)}`;
}
