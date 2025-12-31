/**
 * @swagger
 * /api/meetings:
 *   get:
 *     summary: Get all meetings
 *     tags: [Meetings]
 *   post:
 *     summary: Create meeting
 *     tags: [Meetings]
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
      `SELECT m.*, u.name as created_by_name
       FROM meetings m
       LEFT JOIN users u ON m.created_by = u.id
       ORDER BY m.date DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get meetings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch meetings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { title, date, attendees, notes, action_items } = await request.json();

    if (!title || !date) {
      return NextResponse.json({ success: false, error: 'Title and date are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO meetings (title, date, attendees, notes, action_items, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [title, date, JSON.stringify(attendees || []), notes, JSON.stringify(action_items || []), user.id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create meeting' }, { status: 500 });
  }
}