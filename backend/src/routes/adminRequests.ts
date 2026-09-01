import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query, queryOne, execute } from '../db';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../middleware/auth';
import { AdminRequest, AdminUser } from '../types';
import { getISTDateTimeString } from '../utils/datetime';

const router = Router();

// Super Admin: GET /api/admin/requests (List admin requests)
router.get('/', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requests = await query<AdminRequest>(`SELECT * FROM admin_requests ORDER BY id DESC`);
    const activeAdmins = await query<Omit<AdminUser, 'password_hash'>>(
      `SELECT id, full_name, email, role, status, created_at, last_login FROM admins ORDER BY id ASC`
    );
    return res.json({ success: true, requests, activeAdmins });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin requests.' });
  }
});

// Super Admin: POST /api/admin/requests/:id/approve
router.post('/:id/approve', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestId = req.params.id;
    const requestItem = await queryOne<AdminRequest>(`SELECT * FROM admin_requests WHERE id = ?`, [requestId]);

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Admin request not found.' });
    }

    if (requestItem.status === 'APPROVED') {
      return res.status(400).json({ success: false, message: 'This request is already approved.' });
    }

    const { role = 'ADMIN' } = req.body;
    const now = getISTDateTimeString();

    // Use password_hash set by applicant, or fallback to temporary default
    const passwordHash = requestItem.password_hash || bcrypt.hashSync('ChurchAdmin@2026', 10);

    // 1. Create or update admin account
    const existingAdmin = await queryOne(`SELECT id FROM admins WHERE LOWER(email) = LOWER(?)`, [requestItem.email]);
    if (!existingAdmin) {
      await execute(
        `INSERT INTO admins (full_name, email, password_hash, role, status, created_at) VALUES (?, ?, ?, ?, 'ACTIVE', ?)`,
        [requestItem.full_name, requestItem.email.toLowerCase(), passwordHash, role, now]
      );
    } else {
      await execute(
        `UPDATE admins SET status = 'ACTIVE', role = ?, password_hash = ? WHERE LOWER(email) = LOWER(?)`,
        [role, passwordHash, requestItem.email.toLowerCase()]
      );
    }

    // 2. Mark request APPROVED
    await execute(
      `UPDATE admin_requests SET status = 'APPROVED', reviewed_at = ? WHERE id = ?`,
      [now, requestId]
    );

    return res.json({
      success: true,
      message: `Admin access approved for ${requestItem.full_name} (${requestItem.email})! They can now log in with the password they set during registration.`
    });
  } catch (error: any) {
    console.error('Approve error:', error);
    return res.status(500).json({ success: false, message: 'Failed to approve admin request.' });
  }
});

// Super Admin: POST /api/admin/requests/:id/reject
router.post('/:id/reject', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestId = req.params.id;
    const requestItem = await queryOne<AdminRequest>(`SELECT * FROM admin_requests WHERE id = ?`, [requestId]);

    if (!requestItem) {
      return res.status(404).json({ success: false, message: 'Admin request not found.' });
    }

    const now = getISTDateTimeString();
    await execute(
      `UPDATE admin_requests SET status = 'REJECTED', reviewed_at = ? WHERE id = ?`,
      [now, requestId]
    );

    return res.json({ success: true, message: `Admin request for ${requestItem.email} rejected.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to reject admin request.' });
  }
});

// Super Admin: DELETE /api/admin/requests/:id
router.delete('/:id', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const requestId = req.params.id;
    await execute(`DELETE FROM admin_requests WHERE id = ?`, [requestId]);
    return res.json({ success: true, message: 'Admin request record deleted.' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete admin request.' });
  }
});

// Super Admin: DELETE /api/admin/admins/:id (Delete Admin User)
router.delete('/admin-user/:id', authenticateToken, requireSuperAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.params.id;
    const adminUser = await queryOne<AdminUser>(`SELECT * FROM admins WHERE id = ?`, [adminId]);

    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    if (adminUser.role === 'SUPER_ADMIN' || adminUser.email.toLowerCase() === 'gloriousapostolicchurch777@gmail.com' || adminUser.email.toLowerCase() === 'gacic_admin@gmail.com') {
      return res.status(403).json({ success: false, message: 'The primary permanent Super Admin account cannot be deleted!' });
    }

    await execute(`DELETE FROM admins WHERE id = ?`, [adminId]);
    return res.json({ success: true, message: `Admin user ${adminUser.email} deleted.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete admin user.' });
  }
});

export default router;
