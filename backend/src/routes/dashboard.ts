import { Router, Response } from 'express';
import { query, queryOne } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { getISTDateString } from '../utils/datetime';

const router = Router();

router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayDate = getISTDateString(); // YYYY-MM-DD (IST)

    // 1. Total Registered Members
    const totalMembersRes = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM members`);
    const totalMembers = parseInt(String(totalMembersRes?.count || 0), 10);

    // 2. Today's Check-ins
    const todayCheckInsRes = await queryOne<{ count: string | number }>(
      `SELECT COUNT(*) as count FROM attendance WHERE service_date = ?`,
      [todayDate]
    );
    const todayCheckIns = parseInt(String(todayCheckInsRes?.count || 0), 10);

    // 3. Members Not Checked In Today
    const notCheckedIn = Math.max(0, totalMembers - todayCheckIns);

    // 4. Attendance Percentage
    const attendancePercentage = totalMembers > 0
      ? Number(((todayCheckIns / totalMembers) * 100).toFixed(1))
      : 0;

    // 5. Recent 5 Registrations
    const recentRegistrations = await query(
      `SELECT id, reg_id, full_name, mobile_number, place_city, created_at FROM members ORDER BY id DESC LIMIT 5`
    );

    // 6. Recent 5 Check-ins
    const recentCheckIns = await query(
      `SELECT a.id, a.reg_id, a.service_date, a.check_in_time, m.full_name, m.mobile_number, m.place_city
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       ORDER BY a.id DESC LIMIT 5`
    );

    // 7. Recent 5 Attendance Days Trend
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
        recentRegistrations,
        recentCheckIns,
        attendanceTrend: attendanceTrend.reverse()
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute dashboard metrics.' });
  }
});

export default router;
