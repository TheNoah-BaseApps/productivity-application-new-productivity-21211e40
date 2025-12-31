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
    const { hours_logged, description, status } = await request.json();

    const result = await query(
      `UPDATE timesheets
       SET hours_logged = COALESCE($1, hours_logged),
           description = COALESCE($2, description),
           status = COALESCE($3, status)
       WHERE id = $4 AND employee_id = $5
       RETURNING *`,
      [hours_logged, description, status, id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Timesheet not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update timesheet error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update timesheet' }, { status: 500 });
  }
}