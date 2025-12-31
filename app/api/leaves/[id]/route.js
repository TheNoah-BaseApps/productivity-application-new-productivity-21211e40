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
    const body = await request.json();

    const result = await query(
      `UPDATE leaves
       SET approval_status = COALESCE($1, approval_status),
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [body.approval_status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Leave not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update leave error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update leave' }, { status: 500 });
  }
}