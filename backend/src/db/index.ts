import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { getISTDateTimeString } from '../utils/datetime';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[DB Warning] DATABASE_URL environment variable is not defined.');
}

const pool = new Pool({
  connectionString: connectionString || undefined,
  ssl: connectionString ? { rejectUnauthorized: false } : false
});

function convertPlaceholders(sql: string): string {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const formattedSql = convertPlaceholders(sql);
  const res = await pool.query(formattedSql, params);
  return res.rows as T[];
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const formattedSql = convertPlaceholders(sql);
  const res = await pool.query(formattedSql, params);
  return (res.rows[0] as T) || null;
}

export async function execute(
  sql: string,
  params: any[] = []
): Promise<{ lastID: number; changes: number }> {
  let formattedSql = convertPlaceholders(sql);

  if (
    /^\s*INSERT\s+INTO/i.test(formattedSql) &&
    !/RETURNING/i.test(formattedSql) &&
    !/system_settings/i.test(formattedSql)
  ) {
    formattedSql += ' RETURNING id';
  }

  const res = await pool.query(formattedSql, params);
  const lastID = res.rows[0]?.id ? Number(res.rows[0].id) : 0;
  return { lastID, changes: res.rowCount || 0 };
}

export async function initDatabase() {
  if (!connectionString) {
    console.error('[DB Error] Cannot initialize database: DATABASE_URL environment variable is missing.');
    return;
  }

  // 1. Members Table
  await execute(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      reg_id VARCHAR(30) UNIQUE NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      email VARCHAR(120),
      address TEXT NOT NULL,
      place_city VARCHAR(100) NOT NULL,
      gender VARCHAR(30),
      dob VARCHAR(30),
      adhaar_number VARCHAR(30),
      notes TEXT,
      created_at VARCHAR(50) NOT NULL,
      updated_at VARCHAR(50) NOT NULL,
      CONSTRAINT idx_name_mobile_unique UNIQUE(full_name, mobile_number)
    );
  `);

  // Ensure adhaar_number column exists if table was created previously
  try {
    await execute(`ALTER TABLE members ADD COLUMN IF NOT EXISTS adhaar_number VARCHAR(30);`);
  } catch (e) {
    // Ignore if column exists
  }

  // 1b. Visitors Table
  await execute(`
    CREATE TABLE IF NOT EXISTS visitors (
      id SERIAL PRIMARY KEY,
      visitor_id VARCHAR(30) UNIQUE NOT NULL,
      full_name VARCHAR(150) NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      place_city VARCHAR(100) NOT NULL,
      gender VARCHAR(20),
      adhaar_number VARCHAR(30),
      dob VARCHAR(30),
      invited_by VARCHAR(150),
      notes TEXT,
      status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
      transferred_member_reg_id VARCHAR(30),
      created_at VARCHAR(50) NOT NULL,
      updated_at VARCHAR(50) NOT NULL
    );
  `);

  try {
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS place_city VARCHAR(100);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS gender VARCHAR(20);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS adhaar_number VARCHAR(30);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS dob VARCHAR(30);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS invited_by VARCHAR(150);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS notes TEXT;`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE';`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS transferred_member_reg_id VARCHAR(30);`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS created_at VARCHAR(50) DEFAULT '';`);
    await execute(`ALTER TABLE visitors ADD COLUMN IF NOT EXISTS updated_at VARCHAR(50) DEFAULT '';`);
    await execute(`DELETE FROM visitors;`);
  } catch (e) {
    console.error('[DB Migration Error for visitors table]', e);
  }

  // 2. Sunday Attendance Table
  await execute(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      reg_id VARCHAR(30) NOT NULL,
      service_date VARCHAR(20) NOT NULL,
      check_in_time VARCHAR(20) NOT NULL,
      status VARCHAR(20) DEFAULT 'Present',
      scanned_by VARCHAR(100) DEFAULT 'Admin Scanner',
      created_at VARCHAR(50) NOT NULL,
      CONSTRAINT idx_member_service_date UNIQUE(member_id, service_date)
    );
  `);

  // 3. Admins Table
  await execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
      status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
      created_at VARCHAR(50) NOT NULL,
      last_login VARCHAR(50)
    );
  `);

  // 4. Admin Access Requests Table
  await execute(`
    CREATE TABLE IF NOT EXISTS admin_requests (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(150) NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      reason TEXT NOT NULL,
      password_hash VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
      created_at VARCHAR(50) NOT NULL,
      reviewed_at VARCHAR(50)
    );
  `);

  try {
    await execute(`ALTER TABLE admin_requests ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);`);
  } catch (e) {}

  // 5. System Settings Table
  await execute(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key_name VARCHAR(100) PRIMARY KEY,
      key_value TEXT NOT NULL,
      updated_at VARCHAR(50) NOT NULL
    );
  `);

  // Seed Default System Settings
  await execute(
    `INSERT INTO system_settings (key_name, key_value, updated_at) VALUES (?, ?, ?) ON CONFLICT (key_name) DO NOTHING`,
    ['organization_name', 'Glorious Apostolic Church India Council', getISTDateTimeString()]
  );

  // Seed Default Permanent Super Admin: gloriousapostolicchurch777@gmail.com / glorious@340
  const superAdminEmail = 'gloriousapostolicchurch777@gmail.com';

  try {
    await execute(
      `UPDATE admins SET email = ?, role = 'SUPER_ADMIN', status = 'ACTIVE' WHERE LOWER(email) = 'gacic_admin@gmail.com'`,
      [superAdminEmail]
    );
  } catch (migErr) {}

  const existingSuperAdmin = await queryOne(`SELECT * FROM admins WHERE LOWER(email) = LOWER(?)`, [superAdminEmail]);

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
    await execute(
      `UPDATE admins SET password_hash = ?, role = 'SUPER_ADMIN', status = 'ACTIVE' WHERE LOWER(email) = LOWER(?)`,
      [defaultPasswordHash, superAdminEmail]
    );
  }


  // 6. Make place_city optional in members and visitors tables
  try {
    await execute(`ALTER TABLE members ALTER COLUMN place_city DROP NOT NULL;`);
  } catch (e) {}
  try {
    await execute(`ALTER TABLE visitors ALTER COLUMN place_city DROP NOT NULL;`);
  } catch (e) {}

  // 7. One-time clean of seed members in Neon DB (preserves future manual entries)
  try {
    const cleanedFlag = await queryOne<{ key_value: string }>(
      `SELECT key_value FROM system_settings WHERE key_name = 'seed_members_purged_v1'`
    );

    if (!cleanedFlag) {
      console.log('[DB Clean] Purging seed members and attendance from Neon DB for manual entry...');
      await execute(`DELETE FROM attendance;`);
      await execute(`DELETE FROM members;`);
      try {
        await execute(`SELECT setval(pg_get_serial_sequence('members', 'id'), 1, false);`);
      } catch (seqErr) {}
      await execute(
        `INSERT INTO system_settings (key_name, key_value, updated_at) VALUES (?, ?, ?) ON CONFLICT (key_name) DO UPDATE SET key_value = EXCLUDED.key_value`,
        ['seed_members_purged_v1', 'true', getISTDateTimeString()]
      );
      console.log('[DB Clean] Neon DB members table is now empty and ready for manual entries.');
    }
  } catch (cleanErr) {
    console.error('[DB Clean Error]', cleanErr);
  }

  console.log('[DB] Neon PostgreSQL Database Initialized Successfully.');
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

/**
 * Generate the lowest available Visitor ID: VIS-2026-00001, VIS-2026-00002...
 * Gap-filling: if VIS-2026-00001 was deleted, the next visitor gets VIS-2026-00001.
 */
export async function generateNextVisitorId(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = `VIS-${currentYear}-`;

  // Get all existing visitor IDs for this year, sorted numerically
  const rows = await query<{ visitor_id: string }>(
    `SELECT visitor_id FROM visitors WHERE visitor_id LIKE ? ORDER BY visitor_id ASC`,
    [`${prefix}%`]
  );

  // Build a set of used sequence numbers
  const usedNums = new Set<number>();
  for (const row of rows) {
    const match = row.visitor_id.match(/VIS-\d+-(\d+)/);
    if (match) usedNums.add(parseInt(match[1], 10));
  }

  // Find the smallest positive integer not in use
  let nextSeq = 1;
  while (usedNums.has(nextSeq)) nextSeq++;

  return `${prefix}${String(nextSeq).padStart(5, '0')}`;
}

export default pool;
