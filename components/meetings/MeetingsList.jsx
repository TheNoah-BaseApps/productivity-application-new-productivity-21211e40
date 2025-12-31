'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/DataTable';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function MeetingsList({ meetings, onEdit, onRefresh }) {
  const columns = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: (row) => <span className="font-medium">{row.title}</span>
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (row) => format(new Date(row.date), 'MMM dd, yyyy HH:mm')
    },
    {
      header: 'Attendees',
      cell: (row) => {
        const attendees = Array.isArray(row.attendees) ? row.attendees : [];
        return `${attendees.length} attendees`;
      }
    },
    {
      header: 'Action Items',
      cell: (row) => {
        const actionItems = Array.isArray(row.action_items) ? row.action_items : [];
        return `${actionItems.length} items`;
      }
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
        data={meetings} 
        columns={columns}
        searchPlaceholder="Search meetings..."
        emptyMessage="No meetings found."
      />
    </Card>
  );
}