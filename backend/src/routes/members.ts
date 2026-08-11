import { Router, Request, Response } from 'express';
import { query, queryOne, execute, generateNextRegistrationId } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Member } from '../types';
import { getISTDateTimeString } from '../utils/datetime';

const router = Router();

// Public POST /api/members/register (Public Registration)
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes } = req.body;

    if (!full_name || !mobile_number || !address || !place_city || !adhaar_number) {
      return res.status(400).json({
        success: false,
        message: 'Full Name, Mobile Number, Address, Place/City, and Aadhaar Number are required.'
      });
    }

    const cleanName = full_name.trim();
    const cleanMobile = mobile_number.trim();

    // Duplicate Check: Check if BOTH Full Name AND Mobile Number match an existing member
    const existingDuplicate = await queryOne<Member>(
      `SELECT * FROM members WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ?`,
      [cleanName, cleanMobile]
    );

    if (existingDuplicate) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: `Member "${existingDuplicate.full_name}" with mobile ${existingDuplicate.mobile_number} is already registered (Registration ID: ${existingDuplicate.reg_id}).`,
        existingMember: existingDuplicate
      });
    }

    // Generate unique Registration ID
    const reg_id = await generateNextRegistrationId();
    const now = getISTDateTimeString();

    const result = await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reg_id,
        cleanName,
        cleanMobile,
        email ? email.trim() : null,
        address.trim(),
        place_city.trim(),
        gender || null,
        dob || null,
        adhaar_number ? adhaar_number.trim() : null,
        notes ? notes.trim() : null,
        now,
        now
      ]
    );

    const createdMember = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Member registered successfully!',
      member: createdMember
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process member registration.' });
  }
});

// PUBLIC GET /api/members/public/lookup?q=<reg_id_or_mobile> (No auth required)
router.get('/public/lookup', async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || !q.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a Registration ID or Mobile Number.' });
    }

    const searchTerm = q.trim();
    const isNumeric = /^\d+$/.test(searchTerm);
    let member: Member | null = null;

    if (isNumeric) {
      member = await queryOne<Member>(
        `SELECT reg_id, full_name, mobile_number, place_city, gender FROM members WHERE id = ? OR reg_id = ? OR mobile_number = ?`,
        [parseInt(searchTerm, 10), searchTerm, searchTerm]
      );
    } else {
      member = await queryOne<Member>(
        `SELECT reg_id, full_name, mobile_number, place_city, gender FROM members WHERE reg_id = ? OR mobile_number = ?`,
        [searchTerm, searchTerm]
      );
    }

    if (!member) {
      return res.status(404).json({ success: false, message: `No registered member found for "${searchTerm}". Please verify your Registration ID or Mobile Number.` });
    }

    return res.json({ success: true, member });
  } catch (error: any) {
    console.error('Public lookup error:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving member details.' });
  }
});

// Admin GET /api/members (List & Search Members)
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, gender, place } = req.query;

    let sql = `SELECT * FROM members WHERE 1=1`;
    const params: any[] = [];

    if (search) {
      const searchPattern = `%${String(search).trim()}%`;
      sql += ` AND (reg_id LIKE ? OR full_name LIKE ? OR mobile_number LIKE ? OR place_city LIKE ? OR email LIKE ?)`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (gender && gender !== 'ALL') {
      sql += ` AND gender = ?`;
      params.push(gender);
    }

    if (place) {
      sql += ` AND place_city LIKE ?`;
      params.push(`%${place}%`);
    }

    sql += ` ORDER BY id DESC`;

    const members = await query<Member>(sql, params);
    return res.json({ success: true, count: members.length, members });
  } catch (error: any) {
    console.error('Error fetching members:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch members.' });
  }
});

// Admin GET /api/members/:id
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const param = req.params.id ? req.params.id.trim() : '';
    let member: Member | null = null;

    if (/^\d+$/.test(param)) {
      member = await queryOne<Member>(
        `SELECT * FROM members WHERE id = ? OR reg_id = ? OR mobile_number = ?`,
        [parseInt(param, 10), param, param]
      );
    } else {
      member = await queryOne<Member>(
        `SELECT * FROM members WHERE reg_id = ? OR mobile_number = ?`,
        [param, param]
      );
    }

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    return res.json({ success: true, member });
  } catch (error: any) {
    console.error('Error retrieving member by id/reg_id:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving member details.' });
  }
});

// Admin POST /api/members (Manual Add)
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes } = req.body;

    if (!full_name || !mobile_number || !address || !place_city) {
      return res.status(400).json({ success: false, message: 'Full Name, Mobile Number, Address, and Place/City are required.' });
    }

    const cleanName = full_name.trim();
    const cleanMobile = mobile_number.trim();

    const existingDuplicate = await queryOne<Member>(
      `SELECT * FROM members WHERE LOWER(full_name) = LOWER(?) AND mobile_number = ?`,
      [cleanName, cleanMobile]
    );

    if (existingDuplicate) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        message: `Member "${existingDuplicate.full_name}" with mobile ${existingDuplicate.mobile_number} already exists.`
      });
    }

    const reg_id = await generateNextRegistrationId();
    const now = getISTDateTimeString();

    const result = await execute(
      `INSERT INTO members (reg_id, full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        reg_id,
        cleanName,
        cleanMobile,
        email ? email.trim() : null,
        address.trim(),
        place_city.trim(),
        gender || null,
        dob || null,
        adhaar_number ? adhaar_number.trim() : null,
        notes ? notes.trim() : null,
        now,
        now
      ]
    );

    const createdMember = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [result.lastID]);
    return res.status(201).json({ success: true, message: 'Member created successfully!', member: createdMember });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error creating member.' });
  }
});

// Admin PUT /api/members/:id (Edit Member)
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memberId = req.params.id;
    const { full_name, mobile_number, email, address, place_city, gender, dob, adhaar_number, notes } = req.body;

    const existing = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [memberId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const now = getISTDateTimeString();
    await execute(
      `UPDATE members SET
        full_name = ?,
        mobile_number = ?,
        email = ?,
        address = ?,
        place_city = ?,
        gender = ?,
        dob = ?,
        adhaar_number = ?,
        notes = ?,
        updated_at = ?
       WHERE id = ?`,
      [
        full_name ? full_name.trim() : existing.full_name,
        mobile_number ? mobile_number.trim() : existing.mobile_number,
        email !== undefined ? (email ? email.trim() : null) : existing.email,
        address ? address.trim() : existing.address,
        place_city ? place_city.trim() : existing.place_city,
        gender !== undefined ? gender : existing.gender,
        dob !== undefined ? dob : existing.dob,
        adhaar_number !== undefined ? (adhaar_number ? adhaar_number.trim() : null) : existing.adhaar_number,
        notes !== undefined ? notes : existing.notes,
        now,
        memberId
      ]
    );

    const updated = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [memberId]);
    return res.json({ success: true, message: 'Member updated successfully!', member: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error updating member.' });
  }
});

// Admin DELETE /api/members/:id
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memberId = req.params.id;
    const existing = await queryOne<Member>(`SELECT * FROM members WHERE id = ?`, [memberId]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    // Delete associated attendance first
    await execute(`DELETE FROM attendance WHERE member_id = ?`, [memberId]);
    await execute(`DELETE FROM members WHERE id = ?`, [memberId]);

    return res.json({ success: true, message: `Member ${existing.full_name} (${existing.reg_id}) deleted successfully.` });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to delete member.' });
  }
});

export default router;
