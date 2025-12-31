'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TaskList({ tasks, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete task');

      toast.success('Task deleted successfully');
      onRefresh();
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
    }
  };

  const columns = [
    {
      header: 'Description',
      accessorKey: 'task_description',
      cell: (row) => <span className="font-medium">{row.task_description}</span>
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Due Date',
      accessorKey: 'due_date',
      cell: (row) => row.due_date ? format(new Date(row.due_date), 'MMM dd, yyyy') : 'No due date'
    },
    {
      header: 'Hours',
      cell: (row) => `${row.actual_hours || 0} / ${row.estimated_hours || 0}`
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card className="p-6">
      <DataTable 
        data={tasks} 
        columns={columns}
        searchPlaceholder="Search tasks..."
        emptyMessage="No tasks found. Create your first task to get started."
      />
    </Card>
  );
}