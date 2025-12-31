/**
 * @swagger
 * /api/requirements:
 *   get:
 *     summary: Get all requirements
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create requirement
 *     tags: [Requirements]
 *     security:
 *       - bearerAuth: []
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
      `SELECT r.*, u.name as created_by_name, a.name as assigned_to_name
       FROM requirements r
       LEFT JOIN users u ON r.created_by = u.id
       LEFT JOIN users a ON r.assigned_to = a.id
       ORDER BY r.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get requirements error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, priority, status, target_release } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO requirements (title, description, priority, status, created_by, target_release, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [title, description, priority || 'medium', status || 'backlog', user.id, target_release]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create requirement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create requirement' }, { status: 500 });
  }
}