/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT t.*, u.name as assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       ORDER BY t.creation_date DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { task_description, assigned_to, status, priority, due_date, estimated_hours } = await request.json();

    if (!task_description) {
      return NextResponse.json({ success: false, error: 'Task description is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO tasks (task_description, assigned_to, status, priority, due_date, estimated_hours, creation_date, last_updated_date)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [task_description, assigned_to, status || 'backlog', priority || 'medium', due_date, estimated_hours]
    );

    if (assigned_to) {
      await createNotification(assigned_to, 'task_assigned', `New task assigned: ${task_description}`);
    }

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}