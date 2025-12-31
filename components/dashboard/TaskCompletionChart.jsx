'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TaskCompletionChart() {
  const data = [
    { name: 'Mon', completed: 12, pending: 8 },
    { name: 'Tue', completed: 15, pending: 6 },
    { name: 'Wed', completed: 10, pending: 9 },
    { name: 'Thu', completed: 18, pending: 5 },
    { name: 'Fri', completed: 14, pending: 7 },
    { name: 'Sat', completed: 8, pending: 3 },
    { name: 'Sun', completed: 5, pending: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion Trend</CardTitle>
        <CardDescription>Weekly task completion overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#3b82f6" name="Completed" />
            <Bar dataKey="pending" fill="#94a3b8" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}