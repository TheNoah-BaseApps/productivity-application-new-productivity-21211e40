'use client';

import { Card } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import ApprovalButton from '@/components/ui/ApprovalButton';
import DataTable from '@/components/ui/DataTable';
import { format } from 'date-fns';

export default function ExpensesList({ expenses, onRefresh }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isManager = user.role === 'manager' || user.role === 'admin';

  const columns = [
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => format(new Date(row.date), 'MMM dd, yyyy')
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Amount',
      accessorKey: 'amount',
      cell: (row) => `$${parseFloat(row.amount).toFixed(2)}`
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
              itemType="Expense"
              approveEndpoint="/api/expenses/[id]/approve"
              rejectEndpoint="/api/expenses/[id]/reject"
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
        data={expenses} 
        columns={columns}
        searchPlaceholder="Search expenses..."
        emptyMessage="No expense claims found."
      />
    </Card>
  );
}