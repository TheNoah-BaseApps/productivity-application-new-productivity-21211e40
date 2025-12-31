'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function RequirementsList({ requirements, onEdit, onRefresh }) {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/requirements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete requirement');

      toast.success('Requirement deleted successfully');
      onRefresh();
    } catch (err) {
      console.error('Error deleting requirement:', err);
      toast.error('Failed to delete requirement');
    }
  };

  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => <span className="font-medium">{row.title}</span>
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      cell: (row) => <StatusBadge status={row.priority} />
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Target Release',
      accessorKey: 'target_release',
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: (row) => format(new Date(row.created_at), 'MMM dd, yyyy')
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
        data={requirements} 
        columns={columns}
        searchPlaceholder="Search requirements..."
        emptyMessage="No requirements found. Create your first requirement to get started."
      />
    </Card>
  );
}