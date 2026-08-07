import { Router, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { query } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Member, AttendanceRecord } from '../types';
import { getISTDateString } from '../utils/datetime';

const router = Router();

// GET /api/export/members/excel
router.get('/members/excel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Ordered by Registration ID Sequence (REG-2026-00001, REG-2026-00002...)
    const members = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Members List');

    // Title Row
    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Glorious Apostolic Church India Council - Master Member Directory';
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

    // Headers
    worksheet.getRow(3).values = [
      'Reg ID',
      'Full Name',
      'Mobile Number',
      'Email',
      'Place / City',
      'Address',
      'Gender',
      'Date of Birth',
      'Registration Date'
    ];
    worksheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4C1D95' } };
    worksheet.getRow(3).height = 24;

    members.forEach((m) => {
      worksheet.addRow([
        m.reg_id,
        m.full_name,
        m.mobile_number,
        m.email || 'N/A',
        m.place_city,
        m.address,
        m.gender || 'N/A',
        m.dob || 'N/A',
        m.created_at
      ]);
    });

    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Members_${getISTDateString()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error: any) {
    console.error('Export members excel error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export members to Excel.' });
  }
});

// GET /api/export/members/pdf
router.get('/members/pdf', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Ordered by Registration ID Sequence (REG-2026-00001, REG-2026-00002...)
    const members = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Members_${getISTDateString()}.pdf`);

    doc.pipe(res);

    // Header
    doc.fillColor('#0A192F').fontSize(16).text('Glorious Apostolic Church India Council', { align: 'center' });
    doc.fillColor('#4C1D95').fontSize(12).text('Master Member Directory Report', { align: 'center' });
    doc.fillColor('#666666').fontSize(9).text(`Generated on IST: ${getISTDateString()} | Total Members: ${members.length}`, { align: 'center' });
    doc.moveDown(1.5);

    // Simple Table formatting
    doc.fontSize(9).fillColor('#000000');
    let y = doc.y;

    doc.rect(30, y, 535, 20).fill('#0A192F');
    doc.fillColor('#FFFFFF').text('Reg ID', 35, y + 5, { width: 90 });
    doc.text('Full Name', 125, y + 5, { width: 140 });
    doc.text('Mobile Number', 270, y + 5, { width: 100 });
    doc.text('Place / City', 375, y + 5, { width: 100 });
    doc.text('Reg Date', 480, y + 5, { width: 80 });

    y += 24;

    members.forEach((m, idx) => {
      if (y > 750) {
        doc.addPage();
        y = 30;
      }

      const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(30, y, 535, 18).fill(bg);
      doc.fillColor('#1E293B');
      doc.text(m.reg_id, 35, y + 4, { width: 90 });
      doc.text(m.full_name, 125, y + 4, { width: 140 });
      doc.text(m.mobile_number, 270, y + 4, { width: 100 });
      doc.text(m.place_city, 375, y + 4, { width: 100 });
      doc.text(m.created_at.split(' ')[0], 480, y + 4, { width: 80 });

      y += 20;
    });

    doc.end();
  } catch (error: any) {
    console.error('Export members PDF error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export members to PDF.' });
  }
});

// GET /api/export/attendance/excel
router.get('/attendance/excel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date } = req.query;

    let sql = `
      SELECT a.service_date, a.check_in_time, a.status, a.scanned_by, m.reg_id, m.full_name, m.mobile_number, m.place_city
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params: any[] = [];
    if (date) {
      sql += ` WHERE a.service_date = ?`;
      params.push(String(date));
    }

    // Sort by Registration ID sequence (REG-2026-00001, REG-2026-00002...) regardless of scan order!
    sql += ` ORDER BY m.reg_id ASC, m.id ASC`;

    const records = await query<any>(sql, params);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sunday Attendance');

    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Glorious Apostolic Church India Council - Sunday Attendance Report ${date ? `(${date})` : ''}`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

    worksheet.getRow(3).values = [
      'Service Date',
      'Reg ID',
      'Member Name',
      'Mobile Number',
      'Place / City',
      'Check-in Time (IST)',
      'Status',
      'Scanned By'
    ];
    worksheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD97706' } };
    worksheet.getRow(3).height = 24;

    records.forEach((r) => {
      worksheet.addRow([
        r.service_date,
        r.reg_id,
        r.full_name,
        r.mobile_number,
        r.place_city,
        r.check_in_time,
        r.status,
        r.scanned_by
      ]);
    });

    worksheet.columns.forEach((col) => {
      col.width = 20;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Sunday_Attendance_${getISTDateString()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to export attendance to Excel.' });
  }
});

// GET /api/export/attendance/pdf
router.get('/attendance/pdf', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date } = req.query;

    let sql = `
      SELECT a.service_date, a.check_in_time, a.status, a.scanned_by, m.reg_id, m.full_name, m.mobile_number, m.place_city
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params: any[] = [];
    if (date) {
      sql += ` WHERE a.service_date = ?`;
      params.push(String(date));
    }

    // Sort by Registration ID sequence (REG-2026-00001, REG-2026-00002...) regardless of scan order!
    sql += ` ORDER BY m.reg_id ASC, m.id ASC`;

    const records = await query<any>(sql, params);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Sunday_Attendance_${getISTDateString()}.pdf`);

    doc.pipe(res);

    doc.fillColor('#0A192F').fontSize(16).text('Glorious Apostolic Church India Council', { align: 'center' });
    doc.fillColor('#D97706').fontSize(12).text(`Sunday Service Attendance Log ${date ? `(${date})` : ''}`, { align: 'center' });
    doc.fillColor('#666666').fontSize(9).text(`Generated on IST: ${getISTDateString()} | Total Checked-in: ${records.length}`, { align: 'center' });
    doc.moveDown(1.5);

    let y = doc.y;

    doc.rect(30, y, 535, 20).fill('#0A192F');
    doc.fillColor('#FFFFFF').text('Service Date', 35, y + 5, { width: 85 });
    doc.text('Reg ID', 120, y + 5, { width: 85 });
    doc.text('Member Name', 205, y + 5, { width: 140 });
    doc.text('City', 350, y + 5, { width: 80 });
    doc.text('Check-in (IST)', 435, y + 5, { width: 80 });
    doc.text('Status', 520, y + 5, { width: 40 });

    y += 24;

    records.forEach((r, idx) => {
      if (y > 750) {
        doc.addPage();
        y = 30;
      }

      const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(30, y, 535, 18).fill(bg);
      doc.fillColor('#1E293B');
      doc.text(r.service_date, 35, y + 4, { width: 85 });
      doc.text(r.reg_id, 120, y + 4, { width: 85 });
      doc.text(r.full_name, 205, y + 4, { width: 140 });
      doc.text(r.place_city, 350, y + 4, { width: 80 });
      doc.text(r.check_in_time, 435, y + 4, { width: 80 });
      doc.text(r.status, 520, y + 4, { width: 40 });

      y += 20;
    });

    doc.end();
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to export attendance PDF.' });
  }
});

export default router;
