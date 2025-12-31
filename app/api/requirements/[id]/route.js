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
    const { title, description, priority, status, target_release } = await request.json();

    const result = await query(
      `UPDATE requirements
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           status = COALESCE($4, status),
           target_release = COALESCE($5, target_release),
           updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, description, priority, status, target_release, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Requirement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update requirement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update requirement' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const result = await query('DELETE FROM requirements WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Requirement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Requirement deleted' });
  } catch (error) {
    console.error('Delete requirement error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete requirement' }, { status: 500 });
  }
}