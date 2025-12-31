/**
 * @swagger
 * /api/bugs:
 *   get:
 *     summary: Get all bugs
 *     tags: [Bugs]
 *   post:
 *     summary: Report bug
 *     tags: [Bugs]
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
      `SELECT b.*, r.name as reported_by_name, a.name as assigned_to_name
       FROM bugs b
       LEFT JOIN users r ON b.reported_by = r.id
       LEFT JOIN users a ON b.assigned_to = a.id
       ORDER BY b.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get bugs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bugs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, severity, priority, status } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO bugs (title, description, severity, priority, status, reported_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [title, description, severity || 'medium', priority || 'medium', status || 'open', user.id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create bug error:', error);
    return NextResponse.json({ success: false, error: 'Failed to report bug' }, { status: 500 });
  }
}