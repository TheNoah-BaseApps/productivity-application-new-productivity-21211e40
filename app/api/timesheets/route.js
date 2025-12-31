/**
 * @swagger
 * /api/timesheets:
 *   get:
 *     summary: Get all timesheets
 *     tags: [Timesheets]
 *   post:
 *     summary: Submit timesheet
 *     tags: [Timesheets]
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
      `SELECT t.*, task.task_description
       FROM timesheets t
       LEFT JOIN tasks task ON t.task_id = task.id
       WHERE t.employee_id = $1
       ORDER BY t.date DESC`,
      [user.id]
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get timesheets error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch timesheets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { task_id, date, hours_logged, description } = await request.json();

    if (!task_id || !date || !hours_logged) {
      return NextResponse.json({ success: false, error: 'Task, date, and hours are required' }, { status: 400 });
    }

    if (parseFloat(hours_logged) > 24) {
      return NextResponse.json({ success: false, error: 'Hours cannot exceed 24' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO timesheets (employee_id, task_id, date, hours_logged, description, status, submitted_at)
       VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
       RETURNING *`,
      [user.id, task_id, date, hours_logged, description]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create timesheet error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit timesheet' }, { status: 500 });
  }
}