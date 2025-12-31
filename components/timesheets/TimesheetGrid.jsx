'use client';

import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

export default function TimesheetGrid({ timesheets, onRefresh }) {
  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => format(new Date(row.date), 'MMM dd, yyyy')
    },
    {
      header: 'Task',
      accessorKey: 'task_id',
      cell: (row) => row.task_description || `Task #${row.task_id?.substring(0, 8)}`
    },
    {
      header: 'Hours Logged',
      accessorKey: 'hours_logged',
      cell: (row) => `${row.hours_logged} hrs`
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (row) => (
        <span className="line-clamp-1">{row.description}</span>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status || 'pending'} />
    }
  ];

  return (
    <Card className="p-6">
      <DataTable 
        data={timesheets} 
        columns={columns}
        searchPlaceholder="Search timesheets..."
        emptyMessage="No timesheet entries found."
      />
    </Card>
  );
}