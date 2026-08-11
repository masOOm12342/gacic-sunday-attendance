import { Router, Response } from 'express';
import { query, queryOne } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { getISTDateString } from '../utils/datetime';
import { Member } from '../types';

const router = Router();

/**
 * Calculates the date of the most recent Sunday relative to a given YYYY-MM-DD date.
 */
function getMostRecentSundayDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  
  if (day === 0) {
    return dateStr; // Today is Sunday
  }
  
  // Subtract 'day' days to get to previous Sunday
  date.setDate(date.getDate() - day);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}

router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayDate = getISTDateString(); // YYYY-MM-DD (IST)
    const [y, m, d] = todayDate.split('-').map(Number);
    const todayObj = new Date(y, m - 1, d);
    const isTodaySunday = todayObj.getDay() === 0;

    // Determine active service date for dashboard display:
    // If today is Sunday -> use todayDate
    // If weekday -> check database for most recent Sunday with attendance, or fallback to previous Sunday date
    let activeServiceDate = todayDate;

    if (!isTodaySunday) {
      const latestAttendanceSunday = await queryOne<{ service_date: string }>(
        `SELECT DISTINCT service_date FROM attendance ORDER BY service_date DESC LIMIT 1`
      );

      if (latestAttendanceSunday && latestAttendanceSunday.service_date) {
        activeServiceDate = latestAttendanceSunday.service_date;
      } else {
        activeServiceDate = getMostRecentSundayDate(todayDate);
      }
    }

    // 1. Total Registered Members
    const totalMembersRes = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM members`);
    const totalMembers = parseInt(String(totalMembersRes?.count || 0), 10);

    // 2. Active Service Date Check-ins
    const todayCheckInsRes = await queryOne<{ count: string | number }>(
      `SELECT COUNT(*) as count FROM attendance WHERE service_date = ?`,
      [activeServiceDate]
    );
    const todayCheckIns = parseInt(String(todayCheckInsRes?.count || 0), 10);

    // 3. Members Not Checked In for Active Service Date
    const notCheckedIn = Math.max(0, totalMembers - todayCheckIns);

    // 4. Attendance Percentage
    const attendancePercentage = totalMembers > 0
      ? Number(((todayCheckIns / totalMembers) * 100).toFixed(1))
      : 0;

    // 5. Recent 5 Registrations
    const recentRegistrations = await query<Member>(
      `SELECT id, reg_id, full_name, mobile_number, place_city, created_at FROM members ORDER BY id DESC LIMIT 5`
    );

    // 6. Recent 5 Check-ins (for activeServiceDate or overall)
    const recentCheckIns = await query(
      `SELECT a.id, a.reg_id, a.service_date, a.check_in_time, m.full_name, m.mobile_number, m.place_city
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       WHERE a.service_date = ?
       ORDER BY a.id DESC LIMIT 5`,
      [activeServiceDate]
    );

    // Fallback if no check-ins for active date yet
    const displayCheckIns = recentCheckIns.length > 0
      ? recentCheckIns
      : await query(
          `SELECT a.id, a.reg_id, a.service_date, a.check_in_time, m.full_name, m.mobile_number, m.place_city
           FROM attendance a
           JOIN members m ON a.member_id = m.id
           ORDER BY a.id DESC LIMIT 5`
        );

    // 7. Not Checked In Members List (5 recent members not checked in for activeServiceDate)
    const notCheckedInMembers = await query<Member>(
      `SELECT id, reg_id, full_name, mobile_number, place_city, created_at
       FROM members
       WHERE id NOT IN (SELECT member_id FROM attendance WHERE service_date = ?)
       ORDER BY id DESC LIMIT 5`,
      [activeServiceDate]
    );

    // 8. Recent 7 Attendance Days Trend
    const attendanceTrendRaw = await query(
      `SELECT service_date, COUNT(*) as count
       FROM attendance
       GROUP BY service_date
       ORDER BY service_date DESC LIMIT 7`
    );

    const attendanceTrend = attendanceTrendRaw.map(row => ({
      service_date: row.service_date,
      count: parseInt(String(row.count || 0), 10)
    }));

    return res.json({
      success: true,
      todayDate,
      stats: {
        totalMembers,
        todayCheckIns,
        notCheckedIn,
        attendancePercentage,
        isTodaySunday,
        activeServiceDate,
        recentRegistrations,
        recentCheckIns: displayCheckIns,
        notCheckedInMembers,
        attendanceTrend: attendanceTrend.reverse()
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics.' });
  }
});

export default router;
