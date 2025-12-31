/**
 * @swagger
 * /api/expenses:
 *   get:
 *     summary: Get all expenses
 *     tags: [Expenses]
 *   post:
 *     summary: Submit expense
 *     tags: [Expenses]
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
      `SELECT e.*, u.name as employee_name, a.name as approved_by_name
       FROM expenses e
       LEFT JOIN users u ON e.employee_id = u.id
       LEFT JOIN users a ON e.approved_by = a.id
       ORDER BY e.created_at DESC`
    );

    return NextResponse.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { category, amount, date, description, receipt_url } = await request.json();

    if (!category || !amount || !date || !description) {
      return NextResponse.json({ success: false, error: 'Category, amount, date, and description are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO expenses (employee_id, category, amount, date, description, receipt_url, approval_status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
       RETURNING *`,
      [user.id, category, amount, date, description, receipt_url]
    );

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit expense' }, { status: 500 });
  }
}