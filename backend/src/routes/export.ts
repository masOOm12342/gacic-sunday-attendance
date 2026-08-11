import { Router, Response } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { query, queryOne } from '../db';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { Member } from '../types';
import { getISTDateString } from '../utils/datetime';

const router = Router();

// GET /api/export/members/excel
router.get('/members/excel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const members = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Members List');

    worksheet.mergeCells('A1:I1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Glorious Apostolic Church India Council - Master Member Directory';
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

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
    const members = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Members_${getISTDateString()}.pdf`);

    doc.pipe(res);

    doc.fillColor('#0A192F').fontSize(16).text('Glorious Apostolic Church India Council', { align: 'center' });
    doc.fillColor('#4C1D95').fontSize(12).text('Master Member Directory Report', { align: 'center' });
    doc.fillColor('#666666').fontSize(9).text(`Generated on IST: ${getISTDateString()} | Total Members: ${members.length}`, { align: 'center' });
    doc.moveDown(1.5);

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

// GET /api/export/attendance/excel (Supports range=week | range=month | range=year | single date)
router.get('/attendance/excel', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date, range, month, year } = req.query;

    const workbook = new ExcelJS.Workbook();
    const currentYear = new Date().getFullYear();

    // ── MONTH-WISE EXPORT MATRIX
    if (range === 'month') {
      const targetMonthStr = String(month || getISTDateString().slice(0, 7)); // YYYY-MM

      const allMembers = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);
      const sundaysInMonth = await query<{ service_date: string }>(
        `SELECT DISTINCT service_date FROM attendance WHERE service_date LIKE ? ORDER BY service_date ASC`,
        [`${targetMonthStr}%`]
      );

      const SundayDates = sundaysInMonth.map(s => s.service_date);
      const worksheet = workbook.addWorksheet(`Monthly Report ${targetMonthStr}`);

      const colCount = 5 + SundayDates.length + 2;
      worksheet.mergeCells(1, 1, 1, Math.max(7, colCount));
      const titleCell = worksheet.getCell(1, 1);
      titleCell.value = `Glorious Apostolic Church India Council - Monthly Attendance Matrix (${targetMonthStr})`;
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      const headerRowValues = ['Reg ID', 'Full Name', 'Mobile Number', 'Place / City', 'Status'];
      SundayDates.forEach(d => headerRowValues.push(d));
      headerRowValues.push('Total Present', 'Attendance %');

      worksheet.getRow(3).values = headerRowValues;
      worksheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4C1D95' } };
      worksheet.getRow(3).height = 24;

      // Fetch all attendance for this month
      const attendanceMap = new Map<string, Set<string>>(); // member_id -> Set of service_dates
      const attRecords = await query<{ member_id: number; service_date: string }>(
        `SELECT member_id, service_date FROM attendance WHERE service_date LIKE ?`,
        [`${targetMonthStr}%`]
      );

      attRecords.forEach(r => {
        if (!attendanceMap.has(String(r.member_id))) {
          attendanceMap.set(String(r.member_id), new Set());
        }
        attendanceMap.get(String(r.member_id))!.add(r.service_date);
      });

      allMembers.forEach(m => {
        const memberAttended = attendanceMap.get(String(m.id)) || new Set();
        let presentCount = 0;
        const rowValues: any[] = [m.reg_id, m.full_name, m.mobile_number, m.place_city, 'Active'];

        SundayDates.forEach(sDate => {
          if (memberAttended.has(sDate)) {
            rowValues.push('Present');
            presentCount++;
          } else {
            rowValues.push('Absent');
          }
        });

        const rate = SundayDates.length > 0 ? ((presentCount / SundayDates.length) * 100).toFixed(1) + '%' : 'N/A';
        rowValues.push(presentCount, rate);
        worksheet.addRow(rowValues);
      });

      worksheet.columns.forEach((col) => { col.width = 18; });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=GACIC_Monthly_Attendance_${targetMonthStr}.xlsx`);
      await workbook.xlsx.write(res);
      return res.end();
    }

    // ── YEAR-WISE EXPORT MATRIX
    if (range === 'year') {
      const targetYearStr = String(year || currentYear);
      const allMembers = await query<Member>(`SELECT * FROM members ORDER BY reg_id ASC, id ASC`);
      const allSundays = await query<{ service_date: string }>(
        `SELECT DISTINCT service_date FROM attendance WHERE service_date LIKE ? ORDER BY service_date ASC`,
        [`${targetYearStr}%`]
      );

      const worksheet = workbook.addWorksheet(`Yearly Report ${targetYearStr}`);

      worksheet.mergeCells('A1:G1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = `Glorious Apostolic Church India Council - Yearly Attendance Summary (${targetYearStr})`;
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      worksheet.getRow(3).values = [
        'Reg ID',
        'Member Name',
        'Mobile Number',
        'Place / City',
        'Total Sundays Held',
        'Total Sundays Attended',
        'Overall Attendance %'
      ];
      worksheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      worksheet.getRow(3).height = 24;

      const totalSundaysCount = allSundays.length;

      for (const m of allMembers) {
        const attCountRes = await queryOne<{ count: string | number }>(
          `SELECT COUNT(*) as count FROM attendance WHERE member_id = ? AND service_date LIKE ?`,
          [m.id, `${targetYearStr}%`]
        );
        const attendedCount = parseInt(String(attCountRes?.count || 0), 10);
        const ratePct = totalSundaysCount > 0 ? ((attendedCount / totalSundaysCount) * 100).toFixed(1) + '%' : '0%';

        worksheet.addRow([
          m.reg_id,
          m.full_name,
          m.mobile_number,
          m.place_city,
          totalSundaysCount,
          attendedCount,
          ratePct
        ]);
      }

      worksheet.columns.forEach((col) => { col.width = 22; });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=GACIC_Yearly_Attendance_${targetYearStr}.xlsx`);
      await workbook.xlsx.write(res);
      return res.end();
    }

    // ── STANDARD / WEEK-WISE SINGLE REPORT (Column: "Approved By")
    let sql = `
      SELECT a.service_date, a.check_in_time, a.status, a.scanned_by as approved_by, m.reg_id, m.full_name, m.mobile_number, m.place_city
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params: any[] = [];
    if (date) {
      sql += ` WHERE a.service_date = ?`;
      params.push(String(date));
    }

    sql += ` ORDER BY m.reg_id ASC, m.id ASC`;
    const records = await query<any>(sql, params);

    const worksheet = workbook.addWorksheet('Sunday Attendance');

    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = `Glorious Apostolic Church India Council - Sunday Attendance Report ${date ? `(${date})` : ''}`;
    titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(1).height = 30;

    // Header with "Approved By"
    worksheet.getRow(3).values = [
      'Service Date',
      'Reg ID',
      'Member Name',
      'Mobile Number',
      'Place / City',
      'Check-in Time (IST)',
      'Status',
      'Approved By'
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
        r.approved_by || 'Admin Scanner'
      ]);
    });

    worksheet.columns.forEach((col) => {
      col.width = 20;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Sunday_Attendance_${date || getISTDateString()}.xlsx`);

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error: any) {
    console.error('Attendance Excel export error:', error);
    return res.status(500).json({ success: false, message: 'Failed to export attendance to Excel.' });
  }
});

// GET /api/export/attendance/pdf
router.get('/attendance/pdf', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { date } = req.query;

    let sql = `
      SELECT a.service_date, a.check_in_time, a.status, a.scanned_by as approved_by, m.reg_id, m.full_name, m.mobile_number, m.place_city
      FROM attendance a
      JOIN members m ON a.member_id = m.id
    `;
    const params: any[] = [];
    if (date) {
      sql += ` WHERE a.service_date = ?`;
      params.push(String(date));
    }

    sql += ` ORDER BY m.reg_id ASC, m.id ASC`;
    const records = await query<any>(sql, params);

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=GACIC_Sunday_Attendance_${date || getISTDateString()}.pdf`);

    doc.pipe(res);

    doc.fillColor('#0A192F').fontSize(16).text('Glorious Apostolic Church India Council', { align: 'center' });
    doc.fillColor('#D97706').fontSize(12).text(`Sunday Service Attendance Log ${date ? `(${date})` : ''}`, { align: 'center' });
    doc.fillColor('#666666').fontSize(9).text(`Generated on IST: ${getISTDateString()} | Total Checked-in: ${records.length}`, { align: 'center' });
    doc.moveDown(1.5);

    let y = doc.y;

    doc.rect(30, y, 535, 20).fill('#0A192F');
    doc.fillColor('#FFFFFF').text('Service Date', 35, y + 5, { width: 80 });
    doc.text('Reg ID', 115, y + 5, { width: 85 });
    doc.text('Member Name', 200, y + 5, { width: 130 });
    doc.text('City', 330, y + 5, { width: 75 });
    doc.text('Check-in (IST)', 405, y + 5, { width: 70 });
    doc.text('Approved By', 475, y + 5, { width: 85 });

    y += 24;

    records.forEach((r, idx) => {
      if (y > 750) {
        doc.addPage();
        y = 30;
      }

      const bg = idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(30, y, 535, 18).fill(bg);
      doc.fillColor('#1E293B');
      doc.text(r.service_date, 35, y + 4, { width: 80 });
      doc.text(r.reg_id, 115, y + 4, { width: 85 });
      doc.text(r.full_name, 200, y + 4, { width: 130 });
      doc.text(r.place_city, 330, y + 4, { width: 75 });
      doc.text(r.check_in_time, 405, y + 4, { width: 70 });
      doc.text(r.approved_by || 'Admin', 475, y + 4, { width: 85 });

      y += 20;
    });

    doc.end();
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to export attendance PDF.' });
  }
});

export default router;
