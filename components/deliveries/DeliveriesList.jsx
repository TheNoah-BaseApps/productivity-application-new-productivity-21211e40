'use client';

import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

export default function DeliveriesList({ deliveries, onRefresh }) {
  const columns = [
    {
      header: 'Phase',
      accessorKey: 'phase',
      cell: (row) => <StatusBadge status={row.phase} />
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    },
    {
      header: 'Start Date',
      accessorKey: 'start_date',
      cell: (row) => row.start_date ? format(new Date(row.start_date), 'MMM dd, yyyy') : 'Not set'
    },
    {
      header: 'End Date',
      accessorKey: 'end_date',
      cell: (row) => row.end_date ? format(new Date(row.end_date), 'MMM dd, yyyy') : 'Not set'
    },
    {
      header: 'Artifacts',
      cell: (row) => {
        const artifacts = Array.isArray(row.artifacts) ? row.artifacts : [];
        return `${artifacts.length} files`;
      }
    }
  ];

  return (
    <Card className="p-6">
      <DataTable 
        data={deliveries} 
        columns={columns}
        searchPlaceholder="Search deliveries..."
        emptyMessage="No delivery records found."
      />
    </Card>
  );
}