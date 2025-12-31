import { NextResponse } from 'next/server';
import { query } from '@/lib/database/aurora';

/**
 * @swagger
 * /api/time-sheets:
 *   get:
 *     summary: Get all time sheets
 *     description: Retrieve a list of all time sheets with optional filtering and pagination
 *     tags: [Time Sheets]
 *     parameters:
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: string
 *         description: Filter by employee ID
 *       - in: query
 *         name: project_id
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: approval_status
 *         schema:
 *           type: string
 *         description: Filter by approval status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maximum number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: Successfully retrieved time sheets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Server error
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const employee_id = searchParams.get('employee_id');
    const project_id = searchParams.get('project_id');
    const approval_status = searchParams.get('approval_status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let sql = 'SELECT * FROM time_sheets WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (employee_id) {
      sql += ` AND employee_id = $${paramIndex}`;
      params.push(employee_id);
      paramIndex++;
    }

    if (project_id) {
      sql += ` AND project_id = $${paramIndex}`;
      params.push(project_id);
      paramIndex++;
    }

    if (approval_status) {
      sql += ` AND approval_status = $${paramIndex}`;
      params.push(approval_status);
      paramIndex++;
    }

    sql += ` ORDER BY date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching time sheets:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/time-sheets:
 *   post:
 *     summary: Create a new time sheet
 *     description: Add a new time sheet record
 *     tags: [Time Sheets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timesheet_id
 *               - employee_id
 *               - project_id
 *               - task_id
 *               - date
 *               - start_time
 *               - end_time
 *               - hours_worked
 *               - approval_status
 *             properties:
 *               timesheet_id:
 *                 type: string
 *               employee_id:
 *                 type: string
 *               project_id:
 *                 type: string
 *               task_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               start_time:
 *                 type: string
 *               end_time:
 *                 type: string
 *               hours_worked:
 *                 type: integer
 *               approval_status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Time sheet created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      timesheet_id,
      employee_id,
      project_id,
      task_id,
      date,
      start_time,
      end_time,
      hours_worked,
      approval_status
    } = body;

    if (!timesheet_id || !employee_id || !project_id || !task_id || !date || !start_time || !end_time || hours_worked === undefined || !approval_status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO time_sheets (
        timesheet_id, employee_id, project_id, task_id, date,
        start_time, end_time, hours_worked, approval_status,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;

    const result = await query(sql, [
      timesheet_id,
      employee_id,
      project_id,
      task_id,
      date,
      start_time,
      end_time,
      hours_worked,
      approval_status
    ]);

    return NextResponse.json(
      { success: true, data: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating time sheet:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}