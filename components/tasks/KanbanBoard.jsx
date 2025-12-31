'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function KanbanBoard({ tasks, onEdit, onRefresh }) {
  const columns = [
    { id: 'backlog', title: 'Backlog', status: 'backlog' },
    { id: 'in_progress', title: 'In Progress', status: 'in_progress' },
    { id: 'in_review', title: 'In Review', status: 'in_review' },
    { id: 'completed', title: 'Completed', status: 'completed' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map(column => (
        <Card key={column.id} className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{column.title}</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                {getTasksByStatus(column.status).length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-2 overflow-y-auto max-h-96">
            {getTasksByStatus(column.status).map(task => (
              <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <p className="font-medium text-sm line-clamp-2">
                    {task.task_description}
                  </p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.priority} />
                    {task.due_date && (
                      <span className="text-xs text-slate-500">
                        Due: {format(new Date(task.due_date), 'MMM dd')}
                      </span>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onEdit(task)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
            {getTasksByStatus(column.status).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                No tasks
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}