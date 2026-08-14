import { Router, Response } from 'express';
import { query, queryOne, execute } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { AttendanceRecord, Member } from '../types';
import { getISTDateString, getISTTimeString, getISTDateTimeString } from '../utils/datetime';

const router = Router();

// POST /api/attendance/scan (Scan QR Code or Enter REG ID to mark Sunday Attendance)
router.post('/scan', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code } = req.body; // Scanned QR text or entered string (REG-2026-00001 or REG ID / Mobile)

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Scanned QR Code payload or Registration ID is required.' });
    }

    const cleanCode = code.trim();

    // 1. Find member by REG ID or Mobile Number or ID
    const member = await queryOne<Member>(
      `SELECT * FROM members WHERE reg_id = ? OR mobile_number = ? OR reg_id = UPPER(?)`,
      [cleanCode, cleanCode, cleanCode]
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: `Member not found for scanned code: "${cleanCode}". Please verify registration.`
      });
    }

    // 2. Check if already checked in today (IST date)
    const todayDate = getISTDateString(); // YYYY-MM-DD
    const existingAttendance = await queryOne<AttendanceRecord>(
      `SELECT * FROM attendance WHERE member_id = ? AND service_date = ?`,
      [member.id, todayDate]
    );

    if (existingAttendance) {
      return res.status(200).json({
        success: false,
        alreadyCheckedIn: true,
        message: `Member "${member.full_name}" is already checked in for today (${todayDate}) at ${existingAttendance.check_in_time}.`,
        member,
        attendance: existingAttendance
      });
    }

    // 3. Mark Attendance Present
    const checkInTime = getISTTimeString(); // e.g. "09:45:12 AM"
    const now = getISTDateTimeString();
    const adminName = req.user?.full_name || 'Admin Scanner';

    const result = await execute(
      `INSERT INTO attendance (member_id, reg_id, service_date, check_in_time, status, scanned_by, created_at)
       VALUES (?, ?, ?, ?, 'Present', ?, ?)`,
      [member.id, member.reg_id, todayDate, checkInTime, adminName, now]
    );

    const newAttendance = await queryOne<AttendanceRecord>(`SELECT * FROM attendance WHERE id = ?`, [result.lastID]);

    return res.status(201).json({
      success: true,
      message: `Checked In Successfully! Welcome ${member.full_name}.`,
      member,
      attendance: newAttendance
    });
  } catch (error: any) {
    console.error('Attendance scan error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record attendance.' });
  }
});

// GET /api/attendance (List & Filter Sunday Attendance Records)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, month, year, search } = req.query;

    let sql = `
      SELECT 
        a.id,
        a.member_id,
        a.reg_id,
        a.service_date,
        a.check_in_time,
        a.status,
        a.scanned_by,
        a.created_at,
        m.full_name,
        m.mobile_number,
        m.place_city
      FROM attendance a
      JOIN members m ON a.member_id = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (date) {
      sql += ` AND a.service_date = ?`;
      params.push(String(date));
    }

    if (month && year) {
      // Month format '01' to '12', Year '2026'
      const monthPattern = `${year}-${String(month).padStart(2, '0')}-%`;
      sql += ` AND a.service_date LIKE ?`;
      params.push(monthPattern);
    } else if (year) {
      const yearPattern = `${year}-%`;
      sql += ` AND a.service_date LIKE ?`;
      params.push(yearPattern);
    }

    if (search) {
      const searchPattern = `%${String(search).trim()}%`;
      sql += ` AND (a.reg_id ILIKE ? OR m.full_name ILIKE ? OR m.mobile_number ILIKE ? OR m.place_city ILIKE ?)`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Sort by Registration ID sequence (REG-2026-00001, REG-2026-00002...)
    sql += ` ORDER BY m.reg_id ASC, m.id ASC`;

    const records = await query<AttendanceRecord>(sql, params);
    return res.json({ success: true, count: records.length, attendance: records });
  } catch (error: any) {
    console.error('Error fetching attendance logs:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve attendance logs.' });
  }
});

export default router;
