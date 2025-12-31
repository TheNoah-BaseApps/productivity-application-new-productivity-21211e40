'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProgressTracker from '@/components/ui/ProgressTracker';

export default function DeliveryTimeline() {
  const phases = ['Planning', 'Development', 'Testing', 'Deployment', 'Released'];
  const currentPhase = 2; // Testing

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Pipeline</CardTitle>
        <CardDescription>Current release progress</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressTracker steps={phases} currentStep={currentPhase} />
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Started:</span>
            <span className="font-medium">Jan 15, 2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Expected completion:</span>
            <span className="font-medium">Feb 28, 2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tasks completed:</span>
            <span className="font-medium">24 / 36</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}