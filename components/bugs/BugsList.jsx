'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function BugsList({ bugs, onEdit, onRefresh }) {
  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => <span className="font-medium">{row.title}</span>
    },
    {
      header: 'Severity',
      accessorKey: 'severity',
      cell: (row) => <StatusBadge status={row.severity} />
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
      header: 'Reported',
      accessorKey: 'created_at',
      cell: (row) => format(new Date(row.created_at), 'MMM dd, yyyy')
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button size="sm" variant="outline" onClick={() => onEdit(row)}>
          <Edit className="h-4 w-4" />
        </Button>
      )
    }
  ];

  return (
    <Card className="p-6">
      <DataTable 
        data={bugs} 
        columns={columns}
        searchPlaceholder="Search bugs..."
        emptyMessage="No bugs reported. Great job!"
      />
    </Card>
  );
}