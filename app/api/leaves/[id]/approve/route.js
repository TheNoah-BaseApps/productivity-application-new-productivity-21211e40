import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function PUT(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'manager' && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Only managers can approve leaves' }, { status: 403 });
    }

    const { id } = params;

    const result = await query(
      `UPDATE leaves
       SET approval_status = 'approved',
           approved_by = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [user.id, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Leave not found' }, { status: 404 });
    }

    const leave = result.rows[0];
    await createNotification(leave.employee_id, 'leave_approved', 'Your leave request has been approved');

    return NextResponse.json({ success: true, data: leave });
  } catch (error) {
    console.error('Approve leave error:', error);
    return NextResponse.json({ success: false, error: 'Failed to approve leave' }, { status: 500 });
  }
}