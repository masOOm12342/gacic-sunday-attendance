import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { getISTDateTimeString } from '../utils/datetime';

const dbDir = path.resolve(__dirname, '../../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'church_app.db');
const db = new sqlite3.Database(dbPath);

export function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows as T[]);
    });
  });
}

export function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve((row as T) || null);
    });
  });
}

export function execute(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export async function initDatabase() {
  // 1. Members Table
  await execute(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reg_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL,
      email TEXT,
      address TEXT NOT NULL,
      place_city TEXT NOT NULL,
      gender TEXT,
      dob TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(full_name, mobile_number)
    );
  `);

  // 2. Sunday Attendance Table
  await execute(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      reg_id TEXT NOT NULL,
      service_date TEXT NOT NULL,
      check_in_time TEXT NOT NULL,
      status TEXT DEFAULT 'Present',
      scanned_by TEXT DEFAULT 'Admin Scanner',
      created_at TEXT NOT NULL,
      FOREIGN KEY(member_id) REFERENCES members(id),
      UNIQUE(member_id, service_date)
    );
  `);

  // 3. Admins Table
  await execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN',
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      created_at TEXT NOT NULL,
      last_login TEXT
    );
  `);

  // 4. Admin Access Requests Table
  await execute(`
    CREATE TABLE IF NOT EXISTS admin_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile_number TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at TEXT NOT NULL,
      reviewed_at TEXT
    );
  `);

  // 5. System Settings Table
  await execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key_name TEXT PRIMARY KEY,
      key_value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Seed Default System Settings
  await execute(
    `INSERT OR IGNORE INTO system_settings (key_name, key_value, updated_at) VALUES (?, ?, ?)`,
    ['organization_name', 'Glorious Apostolic Church India Council', getISTDateTimeString()]
  );

  // Seed Default Permanent Super Admin: gacic_admin@gmail.com / glorious@340
  const superAdminEmail = 'gacic_admin@gmail.com';
  const existingSuperAdmin = await queryOne(`SELECT * FROM admins WHERE email = ?`, [superAdminEmail]);

  const defaultPasswordHash = bcrypt.hashSync('glorious@340', 10);

  if (!existingSuperAdmin) {
    await execute(
      `INSERT INTO admins (full_name, email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        'Glorious Super Admin',
        superAdminEmail,
        defaultPasswordHash,
        'SUPER_ADMIN',
        'ACTIVE',
        getISTDateTimeString()
      ]
    );
    console.log(`[DB Seed] Created default Super Admin: ${superAdminEmail}`);
  } else {
    // Always update hash to ensure glorious@340 is valid
    await execute(
      `UPDATE admins SET password_hash = ?, role = 'SUPER_ADMIN', status = 'ACTIVE' WHERE email = ?`,
      [defaultPasswordHash, superAdminEmail]
    );
  }

  // Seed sample members if DB is fresh
  const memberCount = await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM members`);
  if (memberCount && memberCount.count === 0) {
    const now = getISTDateTimeString();
    await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'REG-2026-00001',
        'Pastor Samuel Joseph',
        '9876543210',
        'samuel@gloriouschurch.org',
        '12 Grace Avenue, Bandra West',
        'Mumbai',
        'Male',
        '1982-05-15',
        'Senior Pastor',
        now,
        now
      ]
    );
    await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'REG-2026-00002',
        'Grace Joseph',
        '9876543210', // Same mobile number as Pastor Samuel, different name -> allowed!
        'grace@gloriouschurch.org',
        '12 Grace Avenue, Bandra West',
        'Mumbai',
        'Female',
        '1985-08-20',
        'Worship Ministry',
        now,
        now
      ]
    );
    await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'REG-2026-00003',
        'David Thomas',
        '9820011223',
        'david.thomas@gmail.com',
        '45 Churchgate Road',
        'Mumbai',
        'Male',
        '1995-11-03',
        'Youth Leader',
        now,
        now
      ]
    );
    console.log('[DB Seed] Inserted sample church members');
  }

  console.log('[DB] SQLite Database Initialized & Seeded Successfully.');
}

/**
 * Generate sequential Registration ID: REG-2026-00001, REG-2026-00002...
 */
export async function generateNextRegistrationId(): Promise<string> {
  const currentYear = new Date().getFullYear(); // e.g., 2026
  const lastMember = await queryOne<{ reg_id: string }>(
    `SELECT reg_id FROM members ORDER BY id DESC LIMIT 1`
  );

  let nextSeq = 1;
  if (lastMember && lastMember.reg_id) {
    const match = lastMember.reg_id.match(/REG-\d+-(\d+)/);
    if (match && match[1]) {
      nextSeq = parseInt(match[1], 10) + 1;
    }
  }

  const paddedSeq = String(nextSeq).padStart(5, '0');
  return `REG-${currentYear}-${paddedSeq}`;
}

export default db;
