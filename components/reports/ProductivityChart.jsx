'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ProductivityChart() {
  const data = [
    { week: 'Week 1', completed: 12, created: 15 },
    { week: 'Week 2', completed: 19, created: 18 },
    { week: 'Week 3', completed: 15, created: 20 },
    { week: 'Week 4', completed: 22, created: 17 },
    { week: 'Week 5', completed: 18, created: 16 },
    { week: 'Week 6', completed: 25, created: 19 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity Trends</CardTitle>
        <CardDescription>Tasks created vs completed over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Created" />
            <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}