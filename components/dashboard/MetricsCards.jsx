'use client';

import MetricsCard from '@/components/ui/MetricsCard';
import { CheckSquare, AlertCircle, Calendar, TrendingUp } from 'lucide-react';

export default function MetricsCards({ metrics }) {
  const cards = [
    {
      title: 'Active Tasks',
      value: metrics?.activeTasks || 0,
      icon: CheckSquare,
      description: `${metrics?.tasksCompleted || 0} completed this week`,
      trend: { direction: 'up', value: '12%' }
    },
    {
      title: 'Pending Approvals',
      value: metrics?.pendingApprovals || 0,
      icon: AlertCircle,
      description: 'Requires your action',
    },
    {
      title: 'Team Availability',
      value: `${metrics?.availableMembers || 0}/${metrics?.totalMembers || 0}`,
      icon: Calendar,
      description: 'Members available today',
    },
    {
      title: 'Delivery Progress',
      value: `${metrics?.deliveryProgress || 0}%`,
      icon: TrendingUp,
      description: 'Current sprint completion',
      trend: { direction: 'up', value: '5%' }
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <MetricsCard key={index} {...card} />
      ))}
    </div>
  );
}