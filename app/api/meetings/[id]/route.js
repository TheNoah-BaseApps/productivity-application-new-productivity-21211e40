import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { title, date, attendees, notes, action_items } = await request.json();

    const result = await query(
      `UPDATE meetings
       SET title = COALESCE($1, title),
           date = COALESCE($2, date),
           attendees = COALESCE($3, attendees),
           notes = COALESCE($4, notes),
           action_items = COALESCE($5, action_items)
       WHERE id = $6
       RETURNING *`,
      [title, date, attendees ? JSON.stringify(attendees) : null, notes, action_items ? JSON.stringify(action_items) : null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update meeting error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update meeting' }, { status: 500 });
  }
}