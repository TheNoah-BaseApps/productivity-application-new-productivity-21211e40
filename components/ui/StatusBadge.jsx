import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusColors = {
  // Task/Bug status
  backlog: 'bg-slate-100 text-slate-700',
  in_progress: 'bg-blue-100 text-blue-700',
  in_review: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  open: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-700',
  
  // Leave status
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  
  // Priority
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-blue-100 text-blue-700',
  
  // Delivery phases
  planning: 'bg-indigo-100 text-indigo-700',
  development: 'bg-blue-100 text-blue-700',
  testing: 'bg-purple-100 text-purple-700',
  deployment: 'bg-green-100 text-green-700',
  released: 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status, className }) {
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  const colorClass = statusColors[normalizedStatus] || 'bg-slate-100 text-slate-700';

  return (
    <Badge variant="outline" className={cn(colorClass, className)}>
      {status}
    </Badge>
  );
}