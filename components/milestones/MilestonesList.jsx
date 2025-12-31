'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function MilestonesList({ milestones, onEdit, onRefresh }) {
  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (row) => <span className="font-medium">{row.name}</span>
    },
    {
      header: 'Target Date',
      accessorKey: 'target_date',
      cell: (row) => format(new Date(row.target_date), 'MMM dd, yyyy')
    },
    {
      header: 'Delivery Phase',
      accessorKey: 'delivery_phase',
      cell: (row) => <StatusBadge status={row.delivery_phase} />
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
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
        data={milestones} 
        columns={columns}
        searchPlaceholder="Search milestones..."
        emptyMessage="No milestones found."
      />
    </Card>
  );
}