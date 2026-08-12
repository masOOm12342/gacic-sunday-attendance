import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne, execute } from '../db';
import { JWT_SECRET, authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { AdminUser, JWTPayload } from '../types';
import { getISTDateTimeString } from '../utils/datetime';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await queryOne<AdminUser & { password_hash: string }>(
      `SELECT * FROM admins WHERE LOWER(email) = ?`,
      [cleanEmail]
    );

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
    }

    if (admin.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        message: 'Your admin account request is pending approval by Super Admin.'
      });
    }

    const passwordMatches = bcrypt.compareSync(password, admin.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid admin email or password.' });
    }

    // Update last login
    const now = getISTDateTimeString();
    await execute(`UPDATE admins SET last_login = ? WHERE id = ?`, [now, admin.id]);

    const payload: JWTPayload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      full_name: admin.full_name
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    return res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
        last_login: now
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }

    const admin = await queryOne<AdminUser>(`SELECT id, full_name, email, role, status, created_at, last_login FROM admins WHERE id = ?`, [req.user.id]);

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin user not found.' });
    }

    return res.json({ success: true, user: admin });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error fetching session user.' });
  }
});

// POST /api/auth/request-access
router.post('/request-access', async (req: Request, res: Response) => {
  try {
    const { full_name, email, mobile_number, reason, password } = req.body;

    if (!full_name || !email || !mobile_number || !reason || !password) {
      return res.status(400).json({ success: false, message: 'All fields including Password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered as admin or request
    const existingAdmin = await queryOne(`SELECT id FROM admins WHERE LOWER(email) = ?`, [cleanEmail]);
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'An active admin account with this email already exists.' });
    }

    const existingReq = await queryOne(`SELECT id, status FROM admin_requests WHERE LOWER(email) = ?`, [cleanEmail]);
    if (existingReq) {
      return res.status(400).json({
        success: false,
        message: `An admin request for this email is already ${existingReq.status.toLowerCase()}.`
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const now = getISTDateTimeString();
    await execute(
      `INSERT INTO admin_requests (full_name, email, mobile_number, reason, password_hash, status, created_at) VALUES (?, ?, ?, ?, ?, 'PENDING', ?)`,
      [full_name.trim(), cleanEmail, mobile_number.trim(), reason.trim(), passwordHash, now]
    );

    return res.status(201).json({
      success: true,
      message: 'Admin access request submitted successfully with your password! It is now pending approval by the Super Admin.'
    });
  } catch (error: any) {
    console.error('Admin request error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit admin request.' });
  }
});

export default router;
