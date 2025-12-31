'use client';

import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalButton from '@/components/ui/ApprovalButton';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

export default function LeavesList({ leaves, onRefresh }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user.role === 'manager' || user.role === 'admin';

  const columns = [
    {
      header: 'Employee',
      accessorKey: 'employee_name',
      cell: (row) => <span className="font-medium">{row.employee_name}</span>
    },
    {
      header: 'Leave Type',
      accessorKey: 'leave_type',
    },
    {
      header: 'Start Date',
      accessorKey: 'start_date',
      cell: (row) => format(new Date(row.start_date), 'MMM dd, yyyy')
    },
    {
      header: 'End Date',
      accessorKey: 'end_date',
      cell: (row) => format(new Date(row.end_date), 'MMM dd, yyyy')
    },
    {
      header: 'Status',
      accessorKey: 'approval_status',
      cell: (row) => <StatusBadge status={row.approval_status} />
    },
    {
      header: 'Actions',
      cell: (row) => {
        if (row.approval_status === 'pending' && isManager) {
          return (
            <ApprovalButton
              itemId={row.id}
              itemType="Leave"
              approveEndpoint="/api/leaves/[id]/approve"
              rejectEndpoint="/api/leaves/[id]/reject"
              onSuccess={onRefresh}
            />
          );
        }
        return null;
      }
    }
  ];

  return (
    <Card className="p-6">
      <DataTable 
        data={leaves} 
        columns={columns}
        searchPlaceholder="Search leaves..."
        emptyMessage="No leave requests found."
      />
    </Card>
  );
}