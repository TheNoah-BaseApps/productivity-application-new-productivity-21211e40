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
    const { name, description, target_date, status, delivery_phase } = await request.json();

    const result = await query(
      `UPDATE milestones
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           target_date = COALESCE($3, target_date),
           status = COALESCE($4, status),
           delivery_phase = COALESCE($5, delivery_phase)
       WHERE id = $6
       RETURNING *`,
      [name, description, target_date, status, delivery_phase, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Milestone not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update milestone error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update milestone' }, { status: 500 });
  }
}