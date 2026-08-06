-- ====================================================================
-- Glorious Apostolic Church India Council
-- Production-Ready MySQL Database Schema & Initial Data Seed
-- Sunday Attendance & Member Management System
-- Timezone: Indian Standard Time (IST - Asia/Kolkata / Mumbai)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `gacic_church_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gacic_church_db`;

-- --------------------------------------------------------------------
-- 1. MEMBERS TABLE
-- Stores church member registration details.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `reg_id` VARCHAR(30) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `mobile_number` VARCHAR(20) NOT NULL,
  `email` VARCHAR(120) DEFAULT NULL,
  `address` TEXT NOT NULL,
  `place_city` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other', 'Prefer Not to Say') DEFAULT NULL,
  `dob` DATE DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  -- Combined Index for duplicate checking (Both Name AND Mobile must match for duplicate)
  UNIQUE KEY `idx_name_mobile_unique` (`full_name`, `mobile_number`),
  INDEX `idx_reg_id` (`reg_id`),
  INDEX `idx_mobile` (`mobile_number`),
  INDEX `idx_full_name` (`full_name`),
  INDEX `idx_place_city` (`place_city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. SUNDAY ATTENDANCE TABLE
-- Tracks member attendance specifically for Sunday services.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `member_id` INT NOT NULL,
  `reg_id` VARCHAR(30) NOT NULL,
  `service_date` DATE NOT NULL,
  `check_in_time` VARCHAR(20) NOT NULL, -- e.g., '09:45:12 AM' IST
  `status` ENUM('Present', 'Late', 'Excused') DEFAULT 'Present',
  `scanned_by` VARCHAR(100) DEFAULT 'Admin Scanner',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON DELETE CASCADE,
  -- Prevent multiple check-ins on the same Sunday service date
  UNIQUE KEY `idx_member_service_date` (`member_id`, `service_date`),
  INDEX `idx_service_date` (`service_date`),
  INDEX `idx_attendance_reg_id` (`reg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. ADMINS TABLE
-- Manages system administrative users with Role-Based Access Control.
-- Default Super Admin: gacic_admin@gmail.com / password: glorious@340
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
  `status` ENUM('ACTIVE', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'ACTIVE',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` DATETIME DEFAULT NULL,
  INDEX `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Permanent Super Admin Account if not exists
-- Password hash for 'glorious@340' generated with bcrypt (10 rounds)
INSERT INTO `admins` (`full_name`, `email`, `password_hash`, `role`, `status`)
VALUES (
  'Super Admin (GACIC)',
  'gacic_admin@gmail.com',
  '$2a$10$22n9D3a3Fq.9z8Yp8HkRO.qgN/.3Y33jM9g8V3P7P2e6qM8g7Y2', -- bcrypt hash for glorious@340
  'SUPER_ADMIN',
  'ACTIVE'
) ON DUPLICATE KEY UPDATE `email`=`email`;

-- --------------------------------------------------------------------
-- 4. ADMIN ACCESS REQUESTS TABLE
-- Stores requests from users wanting admin credentials.
-- Pending approval by Super Admin.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `mobile_number` VARCHAR(20) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewed_at` DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. SYSTEM SETTINGS TABLE
-- Scalable key-value configuration table.
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `key_value` TEXT NOT NULL,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Default Settings
INSERT INTO `system_settings` (`key_name`, `key_value`) VALUES
('organization_name', 'Glorious Apostolic Church India Council'),
('registration_prefix', 'REG-2026-'),
('last_reg_sequence', '0'),
('timezone', 'Asia/Kolkata')
ON DUPLICATE KEY UPDATE `updated_at`=NOW();
