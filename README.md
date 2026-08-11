# Glorious Apostolic Church India Council
## Production-Ready QR Code Registration & Sunday Attendance Management System

A commercial SaaS-grade web and mobile application engineered specifically for **Glorious Apostolic Church India Council** to handle new member registration, digital QR code badge generation, live camera-based Sunday service attendance scanning, role-based Super Admin access governance, and high-performance Excel/PDF exports.

---

## 🌟 Key Features

1. **Ultra-Premium Glassmorphism SaaS UI**:
   - Modern theme featuring Deep Blue (`#0A192F`), Royal Purple (`#4C1D95`), and Warm Gold (`#F59E0B`) accents.
   - Micro-interactions, soft ambient glows, dynamic animated KPI counters, floating label input forms, and mobile-first PWA layout.
   - Dedicated top-left placeholder for the Church Logo.

2. **Member Registration & Sequential ID Generation**:
   - Public registration form with floating labels and real-time validation.
   - Auto-generates unique, non-repeating Registration IDs (`REG-2026-00001`, `REG-2026-00002`...).
   - **Smart Duplicate Matching**: A duplicate is flagged ONLY when **BOTH Full Name AND Mobile Number** match an existing member. Multiple family members sharing a mobile phone number can register seamlessly.

3. **Digital QR Badge & Download Module**:
   - Instant rendering of high-resolution QR codes encoding the member's Registration ID.
   - Quick actions: **Download PNG Badge**, **Save as PDF**, and **Print Badge**.
   - Public QR search bar by Registration ID or 10-digit Mobile Number.

4. **Sunday Service Camera Scanner**:
   - Live camera QR Code scanner (`html5-qrcode`) for Sunday check-ins.
   - Audio chime sound on successful scan.
   - **Same-Day Duplicate Prevention**: If a member scans twice on the same Sunday service date, the system alerts *"Member already checked in today at [Time]"*.
   - Manual Registration ID search fallback for environments without a web camera.

5. **Role-Based Security & Super Admin Access Control**:
   - Predefined Permanent Super Admin Account:
     - **Email**: `gacic_admin@gmail.com`
     - **Password**: `glorious@340`
   - Public Admin Access Request queue: Anyone requesting an admin account goes into a `PENDING` state. Only the Super Admin can **Approve**, **Reject**, or **Delete** admin requests.

6. **Indian Standard Time (IST - Mumbai)**:
   - All check-in timestamps, attendance logs, and dashboard analytics operate on **IST (UTC+5:30)**.

7. **Reports & Exports**:
   - One-click export of Master Member Directory and Sunday Attendance Logs to Excel (`.xlsx`) and PDF formats.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
Open a terminal in the project root directory and run:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Running the System in Development

#### Start Backend Server:
```bash
cd backend
npm run dev
```
*Backend runs on http://localhost:5000 with embedded zero-config SQLite database (`database/church_app.db`).*

#### Start Frontend Application:
In a second terminal window:
```bash
cd frontend
npm run dev
```
*Frontend runs on http://localhost:3000.*

---

## 🗄 Production MySQL Database Migration

For enterprise MySQL deployments:
1. Import the provided schema script located at `database/schema.sql` into your MySQL server.
2. The schema contains optimized indexes, unique constraints for duplicate protection, and default seed data.

---

## 🛡 Predefined Credentials

| Account Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `gacic_admin@gmail.com` | `glorious@340` |

---
© 2026 Glorious Apostolic Church India Council. All Rights Reserved.
