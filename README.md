# Glorious Apostolic Church India Council
## Production-Ready QR Code Registration, Visitor Management & Sunday Attendance System

A high-performance web and mobile application engineered for **Glorious Apostolic Church India Council** to handle member registration, visitor tracking, digital QR code badge generation, live camera-based Sunday service attendance scanning, role-based Super Admin access governance, and high-performance Excel/CSV/PDF exports.

---

## 🌟 Key Features

### 1. Member Registration & Profile Management
- **Public & Admin Registration**: Clean, accessible registration form with real-time field validation.
- **Sequential Registration ID Generation**: Automated generation of continuous, formatted IDs (`REG-YYYY-00001`, `REG-YYYY-00002`...).
- **Smart Duplicate Matching**: Duplicates are flagged only when **both Full Name AND Mobile Number** match an existing record, allowing family members sharing a mobile phone number to register seamlessly.
- **Detailed Profiles**: Capture Full Name, Gender, Mobile Number, Place/City, Address, Date of Birth, Aadhaar Number, and Notes.
- **Case-Insensitive Search & Filters**: Search members dynamically by Name, Registration ID, Mobile Number, or Place/City using case-insensitive PostgreSQL queries.
- **Full Lifecycle Management**: Edit member details, toggle active/inactive status, or remove records with immediate database synchronization.

### 2. Visitor Management System
- **Public & Admin Visitor Registration**: Dedicated visitor onboarding flow for first-time church visitors.
- **Intelligent Sequential Visitor IDs**: Auto-generated sequential Visitor IDs (`VIS-YYYY-00001`...) with gap-filling logic to maintain clean sequence indexing.
- **Visitor Badges & QR Codes**: Instant generation of digital QR badges for church visitors.
- **Visitor Directory**: Filterable and searchable visitor directory with contact info, inviting member details, and visit notes.
- **Export & Conversion**: Full export capabilities for visitor lists and support for transferring visitors to full member status.

### 3. Digital QR Code Badges & Public Search
- **Instant Badge Rendering**: High-resolution QR codes generated dynamically for both registered members and visitors.
- **Multiple Badge Actions**:
  - **Download PNG Badge**: Save high-resolution badge image directly to device.
  - **Save / Export as PDF**: Formatted printable PDF badge.
  - **Direct Print**: Print-ready layout optimized for physical badge issuance.
- **Public Badge Lookup**: Search and retrieve digital badges at any time using Registration ID, Visitor ID, or 10-digit Mobile Number.

### 4. Sunday Service Camera Scanner & Attendance Tracking
- **Live Camera Scanner**: Fast, continuous QR code scanning utilizing device webcams and mobile cameras (`html5-qrcode`).
- **Strict Sunday-Only Attendance Policy**: Uses calendar date and IST day verification (`Asia/Kolkata`) to enforce that attendance check-in can only be recorded on Sundays. Scans on non-Sunday days verify member details but lock check-in recording.
- **Audio & Visual Feedback**: Instant chime sound and interactive confetti celebration on successful attendance check-in.
- **Same-Day Duplicate Prevention**: Prevents accidental double check-ins on the same Sunday service date with friendly warning notifications displaying previous check-in time.
- **Manual Check-In Fallback**: Fast manual lookup and check-in option by Registration ID or Mobile Number for devices without cameras.
- **Attendance History & Logs**: Detailed attendance tracking with exact check-in timestamps, service dates, and scanner attribution.


### 5. Role-Based Access Control & Admin Governance
- **Role Hierarchy**: Structured access levels (`SUPER_ADMIN` and `ADMIN`).
- **Self-Service Admin Access Requests**: Prospective administrators can submit an access request and set their preferred password during application.
- **Admin Approval Queue**: Super Admins review pending requests with one-click **Approve**, **Reject**, or **Delete** controls.
- **Cryptographic Security**: Passwords hashed using `bcrypt` and authenticated via secure JSON Web Tokens (JWT).

### 6. Analytics Dashboard & Real-Time Sync
- **Live KPI Overview**: Instant metrics for Total Registered Members, Active Members, Sunday Attendance, and Total Visitors.
- **Cross-Tab Synchronization**: Custom event bus automatically updates open browser tabs and administrator sessions in real-time when records change.
- **Indian Standard Time (IST - UTC+5:30)**: All logs, check-ins, reports, and time calculations are standardized to IST.

### 7. Multi-Format Reporting & Data Exports
- **Excel (`.xlsx`)**: Formatted multi-column spreadsheets with styled headers for Members, Visitors, and Attendance logs.
- **Plain-Text CSV**: Data-safe CSV formatting preserving exact zero-padded numbers and preventing Excel scientific notation or date mangling.
- **PDF Reports**: Clean, tabular PDF exports generated via `jspdf` and `jspdf-autotable`.

---

## 🛠 Tech Stack & Architecture

- **Frontend**:
  - React 18 with TypeScript
  - Vite for ultra-fast builds and hot-module replacement
  - Tailwind CSS for modern glassmorphism design system
  - Lucide React for modern iconography
  - `html5-qrcode` for camera QR scanning
  - `qrcode.react`, `jspdf`, `jspdf-autotable`, `xlsx`, `canvas-confetti`

- **Backend**:
  - Node.js & Express with TypeScript
  - PostgreSQL (compatible with Neon Serverless Postgres, Supabase, RDS, and standard PostgreSQL)
  - Connection pooling with SSL support (`pg`)
  - JWT (JSON Web Tokens) for stateless authentication
  - `bcryptjs` for salted password hashing
  - Helmet & CORS security middleware

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- A PostgreSQL database instance (e.g., [Neon](https://neon.tech), Supabase, or local PostgreSQL)

---

### 1. Installation

Clone the repository and install dependencies for both backend and frontend:

```bash
# Clone repository
git clone https://github.com/masOOm12342/gacic-sunday-attendance.git
cd gacic-sunday-attendance

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

### 2. Environment Configuration

#### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_secure_jwt_secret_key_here
```

#### Frontend Configuration
Create a `.env` file in the `frontend/` directory (optional for local development if running on default ports):

```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Running in Development

#### Start Backend Server:
```bash
cd backend
npm run dev
```
*Backend runs on `http://localhost:5000` with auto-migration and database health checks.*

#### Start Frontend Application:
In a separate terminal:
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000` or `http://localhost:5173`.*

---

### 4. Building for Production

```bash
# Build Backend
cd backend
npm run build

# Build Frontend
cd ../frontend
npm run build
```

---

## 🔒 Security & Administrative Access

- Administrative accounts are managed through the **Admin Access Request** workflow or initialized via server environment configurations.
- Super Admin privileges allow reviewing, approving, and rejecting new administrator applications.
- Passwords are encrypted with salted hashes and never stored or returned in plaintext.

---

## 📄 License & Organization

© 2026 **Glorious Apostolic Church India Council**. All Rights Reserved.
