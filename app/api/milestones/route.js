/**
 * @swagger
 * /api/milestones:
 *   get:
 *     summary: Get all milestones
 *     tags: [Milestones]
 *   post:
 *     summary: Create milestone
 *     tags: [Milestones]
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
      `SELECT * FROM milestones ORDER BY target_date ASC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get milestones error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch milestones' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, target_date, status, delivery_phase } = await request.json();

    if (!name || !target_date) {
      return NextResponse.json({ success: false, error: 'Name and target date are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO milestones (name, description, target_date, status, delivery_phase, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [name, description, target_date, status || 'planning', delivery_phase || 'planning']
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create milestone error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create milestone' }, { status: 500 });
  }
}