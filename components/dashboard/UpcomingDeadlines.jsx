'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function UpcomingDeadlines() {
  const deadlines = [
    {
      id: 1,
      title: 'Complete user authentication module',
      type: 'Task',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: 'high'
    },
    {
      id: 2,
      title: 'Review API documentation',
      type: 'Task',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Sprint planning meeting',
      type: 'Meeting',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: 'high'
    },
    {
      id: 4,
      title: 'Deploy to staging environment',
      type: 'Delivery',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'critical'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Tasks and milestones due soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50">
              <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm">{deadline.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{deadline.type}</span>
                  <StatusBadge status={deadline.priority} />
                  <span className="text-xs text-slate-500">
                    Due {formatDistanceToNow(deadline.dueDate, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}