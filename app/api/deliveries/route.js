/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Get all deliveries
 *     tags: [Deliveries]
 *   post:
 *     summary: Create delivery
 *     tags: [Deliveries]
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
      `SELECT d.*, m.name as milestone_name
       FROM deliveries d
       LEFT JOIN milestones m ON d.milestone_id = m.id
       ORDER BY d.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get deliveries error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deliveries' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { milestone_id, phase, status, start_date, end_date, artifacts } = await request.json();

    if (!milestone_id || !phase) {
      return NextResponse.json({ success: false, error: 'Milestone and phase are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO deliveries (milestone_id, phase, status, start_date, end_date, artifacts, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [milestone_id, phase, status || 'in_progress', start_date, end_date, JSON.stringify(artifacts || [])]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create delivery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create delivery' }, { status: 500 });
  }
}