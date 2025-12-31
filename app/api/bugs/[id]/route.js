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
    const { title, description, severity, priority, status, assigned_to } = await request.json();

    const updateData = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) { updateData.push(`title = $${paramCount++}`); values.push(title); }
    if (description !== undefined) { updateData.push(`description = $${paramCount++}`); values.push(description); }
    if (severity !== undefined) { updateData.push(`severity = $${paramCount++}`); values.push(severity); }
    if (priority !== undefined) { updateData.push(`priority = $${paramCount++}`); values.push(priority); }
    if (status !== undefined) { updateData.push(`status = $${paramCount++}`); values.push(status); }
    if (assigned_to !== undefined) { updateData.push(`assigned_to = $${paramCount++}`); values.push(assigned_to); }

    if (status === 'resolved') {
      updateData.push(`resolved_date = NOW()`);
    }

    values.push(id);

    const result = await query(
      `UPDATE bugs SET ${updateData.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Bug not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update bug error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update bug' }, { status: 500 });
  }
}