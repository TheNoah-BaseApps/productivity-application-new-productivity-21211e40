/**
 * @swagger
 * /api/dashboard/metrics:
 *   get:
 *     summary: Get dashboard metrics
 *     tags: [Dashboard]
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

    const [activeTasks, completedTasks, pendingLeaves, pendingExpenses, totalUsers, availableUsers] = await Promise.all([
      query("SELECT COUNT(*) as count FROM tasks WHERE status IN ('backlog', 'in_progress', 'in_review')"),
      query("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed' AND last_updated_date >= NOW() - INTERVAL '7 days'"),
      query("SELECT COUNT(*) as count FROM leaves WHERE approval_status = 'pending'"),
      query("SELECT COUNT(*) as count FROM expenses WHERE approval_status = 'pending'"),
      query("SELECT COUNT(*) as count FROM users"),
      query(`SELECT COUNT(*) as count FROM users WHERE id NOT IN (
        SELECT DISTINCT employee_id FROM leaves 
        WHERE approval_status = 'approved' 
        AND start_date <= CURRENT_DATE 
        AND end_date >= CURRENT_DATE
      )`)
    ]);

    const metrics = {
      activeTasks: parseInt(activeTasks.rows[0]?.count || 0),
      tasksCompleted: parseInt(completedTasks.rows[0]?.count || 0),
      pendingApprovals: parseInt(pendingLeaves.rows[0]?.count || 0) + parseInt(pendingExpenses.rows[0]?.count || 0),
      totalMembers: parseInt(totalUsers.rows[0]?.count || 0),
      availableMembers: parseInt(availableUsers.rows[0]?.count || 0),
      deliveryProgress: 67
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Get metrics error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch metrics' }, { status: 500 });
  }
}