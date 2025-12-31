import { query } from './db';

export async function createNotification(userId, type, message) {
  try {
    await query(
      `INSERT INTO notifications (user_id, type, message, read, created_at)
       VALUES ($1, $2, $3, false, NOW())`,
      [userId, type, message]
    );
  } catch (error) {
    console.error('Create notification error:', error);
  }
}

export async function createTaskNotification(taskId, assignedTo, createdBy) {
  if (!assignedTo || assignedTo === createdBy) return;

  try {
    const taskResult = await query(
      'SELECT task_description FROM tasks WHERE id = $1',
      [taskId]
    );

    if (taskResult.rows.length > 0) {
      const taskDescription = taskResult.rows[0].task_description;
      await createNotification(
        assignedTo,
        'task_assigned',
        `You have been assigned a new task: ${taskDescription}`
      );
    }
  } catch (error) {
    console.error('Create task notification error:', error);
  }
}

export async function createLeaveNotification(leaveId, status) {
  try {
    const leaveResult = await query(
      'SELECT employee_id, employee_name FROM leaves WHERE id = $1',
      [leaveId]
    );

    if (leaveResult.rows.length > 0) {
      const { employee_id, employee_name } = leaveResult.rows[0];
      const message = status === 'approved'
        ? 'Your leave request has been approved'
        : 'Your leave request has been rejected';
      
      await createNotification(employee_id, `leave_${status}`, message);
    }
  } catch (error) {
    console.error('Create leave notification error:', error);
  }
}

export async function createExpenseNotification(expenseId, status) {
  try {
    const expenseResult = await query(
      'SELECT employee_id, category, amount FROM expenses WHERE id = $1',
      [expenseId]
    );

    if (expenseResult.rows.length > 0) {
      const { employee_id, category, amount } = expenseResult.rows[0];
      const message = status === 'approved'
        ? `Your ${category} expense claim of $${amount} has been approved`
        : `Your ${category} expense claim of $${amount} has been rejected`;
      
      await createNotification(employee_id, `expense_${status}`, message);
    }
  } catch (error) {
    console.error('Create expense notification error:', error);
  }
}

export async function createDeadlineNotification(userId, itemType, itemName, daysUntilDue) {
  try {
    const message = `${itemType} "${itemName}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`;
    await createNotification(userId, 'deadline_approaching', message);
  } catch (error) {
    console.error('Create deadline notification error:', error);
  }
}

export async function markAllAsRead(userId) {
  try {
    await query(
      'UPDATE notifications SET read = true WHERE user_id = $1 AND read = false',
      [userId]
    );
  } catch (error) {
    console.error('Mark all notifications read error:', error);
  }
}

export async function deleteOldNotifications(daysOld = 30) {
  try {
    await query(
      `DELETE FROM notifications 
       WHERE created_at < NOW() - INTERVAL '${daysOld} days'`
    );
  } catch (error) {
    console.error('Delete old notifications error:', error);
  }
}