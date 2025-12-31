/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Get all leaves
 *     tags: [Leaves]
 *   post:
 *     summary: Submit leave request
 *     tags: [Leaves]
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT l.*, u.name as employee_name, a.name as approved_by_name
       FROM leaves l
       LEFT JOIN users u ON l.employee_id = u.id
       LEFT JOIN users a ON l.approved_by = a.id
       ORDER BY l.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get leaves error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch leaves' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { leave_type, start_date, end_date, reason } = await request.json();

    if (!leave_type || !start_date || !end_date) {
      return NextResponse.json({ success: false, error: 'Leave type, start date, and end date are required' }, { status: 400 });
    }

    if (new Date(start_date) > new Date(end_date)) {
      return NextResponse.json({ success: false, error: 'End date must be after start date' }, { status: 400 });
    }

    const userResult = await query('SELECT name FROM users WHERE id = $1', [user.id]);
    const userName = userResult.rows[0]?.name || 'Unknown';

    const result = await query(
      `INSERT INTO leaves (employee_id, employee_name, leave_type, start_date, end_date, reason, approval_status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
       RETURNING *`,
      [user.id, userName, leave_type, start_date, end_date, reason]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create leave error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit leave request' }, { status: 500 });
  }
}