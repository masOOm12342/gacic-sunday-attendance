import { Router, Response } from 'express';
import { query, queryOne } from '../db';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Super Admin: GET /api/database/info
router.get('/info', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memberCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM members`);
    const visitorCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM visitors WHERE (status IS NULL OR TRIM(UPPER(status)) = 'ACTIVE')`);
    const attendanceCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM attendance`);
    const adminCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM admins`);
    const requestCount = await queryOne<{ count: string | number }>(`SELECT COUNT(*) as count FROM admin_requests`);
    const settings = await query(`SELECT * FROM system_settings`);

    return res.json({
      success: true,
      tables: [
        { name: 'members', records: parseInt(String(memberCount?.count || 0), 10) },
        { name: 'visitors', records: parseInt(String(visitorCount?.count || 0), 10) },
        { name: 'attendance', records: parseInt(String(attendanceCount?.count || 0), 10) },
        { name: 'admins', records: parseInt(String(adminCount?.count || 0), 10) },
        { name: 'admin_requests', records: parseInt(String(requestCount?.count || 0), 10) },
        { name: 'system_settings', records: settings.length }
      ],
      settings
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to inspect database info.' });
  }
});

// Super Admin: POST /api/database/clear-visitors
router.post('/clear-visitors', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query(`DELETE FROM visitors`);
    return res.json({ success: true, message: 'Visitors table cleared successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to clear visitors table.' });
  }
});

// Super Admin: POST /api/database/clear-members
router.post('/clear-members', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query(`DELETE FROM attendance`);
    await query(`DELETE FROM members`);
    try {
      await query(`SELECT setval(pg_get_serial_sequence('members', 'id'), 1, false)`);
    } catch (seqErr) {}
    return res.json({ success: true, message: 'All members and attendance records have been cleared from Neon DB.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to clear members table.' });
  }
});

// Super Admin: POST /api/database/clear-attendance
router.post('/clear-attendance', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    await query(`DELETE FROM attendance`);
    return res.json({ success: true, message: 'Attendance records cleared successfully.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to clear attendance table.' });
  }
});

export default router;

