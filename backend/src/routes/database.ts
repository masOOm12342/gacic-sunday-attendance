import { Router, Response } from 'express';
import { query, queryOne } from '../db';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Super Admin: GET /api/database/info
router.get('/info', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memberCount = await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM members`);
    const attendanceCount = await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM attendance`);
    const adminCount = await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM admins`);
    const requestCount = await queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM admin_requests`);
    const settings = await query(`SELECT * FROM system_settings`);

    return res.json({
      success: true,
      tables: [
        { name: 'members', records: memberCount?.count || 0 },
        { name: 'attendance', records: attendanceCount?.count || 0 },
        { name: 'admins', records: adminCount?.count || 0 },
        { name: 'admin_requests', records: requestCount?.count || 0 },
        { name: 'system_settings', records: settings.length }
      ],
      settings
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to inspect database info.' });
  }
});

export default router;
