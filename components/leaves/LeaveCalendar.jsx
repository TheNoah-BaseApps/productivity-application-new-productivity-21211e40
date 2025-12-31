'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function LeaveCalendar({ leaves }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getLeavesForDate = (date) => {
    return leaves.filter(leave => {
      const startDate = new Date(leave.start_date);
      const endDate = new Date(leave.end_date);
      return date >= startDate && date <= endDate;
    });
  };

  const modifiers = {
    leave: (date) => {
      return leaves.some(leave => {
        const startDate = new Date(leave.start_date);
        const endDate = new Date(leave.end_date);
        return date >= startDate && date <= endDate;
      });
    }
  };

  const modifiersStyles = {
    leave: { backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: 'bold' }
  };

  const selectedDateLeaves = getLeavesForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Team Leave Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Leaves on {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateLeaves.length === 0 ? (
            <p className="text-sm text-slate-500">No leaves on this date</p>
          ) : (
            <div className="space-y-3">
              {selectedDateLeaves.map(leave => (
                <div key={leave.id} className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">{leave.employee_name}</p>
                  <p className="text-xs text-slate-500 mt-1">{leave.leave_type}</p>
                  <Badge variant="outline" className="mt-2">
                    {leave.approval_status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}