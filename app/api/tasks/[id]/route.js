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
    const { task_description, status, priority, due_date, estimated_hours, actual_hours } = await request.json();

    const result = await query(
      `UPDATE tasks
       SET task_description = COALESCE($1, task_description),
           status = COALESCE($2, status),
           priority = COALESCE($3, priority),
           due_date = COALESCE($4, due_date),
           estimated_hours = COALESCE($5, estimated_hours),
           actual_hours = COALESCE($6, actual_hours),
           last_updated_date = NOW()
       WHERE id = $7
       RETURNING *`,
      [task_description, status, priority, due_date, estimated_hours, actual_hours, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const result = await query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete task' }, { status: 500 });
  }
}