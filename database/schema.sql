-- ====================================================================
-- Glorious Apostolic Church India Council
-- Production-Ready PostgreSQL Database Schema & Initial Data Seed
-- Sunday Attendance & Member Management System (Neon Cloud DB)
-- Timezone: Indian Standard Time (IST - Asia/Kolkata / Mumbai)
-- ====================================================================

-- 1. MEMBERS TABLE
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
  notes TEXT,
  created_at VARCHAR(50) NOT NULL,
  updated_at VARCHAR(50) NOT NULL,
  CONSTRAINT idx_name_mobile_unique UNIQUE(full_name, mobile_number)
);

CREATE INDEX IF NOT EXISTS idx_reg_id ON members(reg_id);
CREATE INDEX IF NOT EXISTS idx_mobile ON members(mobile_number);
CREATE INDEX IF NOT EXISTS idx_full_name ON members(full_name);
CREATE INDEX IF NOT EXISTS idx_place_city ON members(place_city);

-- 2. SUNDAY ATTENDANCE TABLE
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

CREATE INDEX IF NOT EXISTS idx_service_date ON attendance(service_date);
CREATE INDEX IF NOT EXISTS idx_attendance_reg_id ON attendance(reg_id);

-- 3. ADMINS TABLE
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

-- 4. ADMIN ACCESS REQUESTS TABLE
CREATE TABLE IF NOT EXISTS admin_requests (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at VARCHAR(50) NOT NULL,
  reviewed_at VARCHAR(50)
);

-- 5. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS system_settings (
  key_name VARCHAR(100) PRIMARY KEY,
  key_value TEXT NOT NULL,
  updated_at VARCHAR(50) NOT NULL
);
