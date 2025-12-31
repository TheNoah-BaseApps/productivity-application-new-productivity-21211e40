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
      return NextResponse.json({ success: false, error: 'Only managers can approve expenses' }, { status: 403 });
    }

    const { id } = params;

    const result = await query(
      `UPDATE expenses
       SET approval_status = 'approved',
           approved_by = $1
       WHERE id = $2
       RETURNING *`,
      [user.id, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
    }

    const expense = result.rows[0];
    await createNotification(expense.employee_id, 'expense_approved', 'Your expense claim has been approved');

    return NextResponse.json({ success: true, data: expense });
  } catch (error) {
    console.error('Approve expense error:', error);
    return NextResponse.json({ success: false, error: 'Failed to approve expense' }, { status: 500 });
  }
}