'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function DeliveryMetrics() {
  const data = [
    { name: 'Planning', value: 2 },
    { name: 'Development', value: 5 },
    { name: 'Testing', value: 3 },
    { name: 'Deployment', value: 1 },
    { name: 'Released', value: 4 },
  ];

  const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#10b981', '#22c55e'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Pipeline Distribution</CardTitle>
        <CardDescription>Current projects by delivery phase</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}