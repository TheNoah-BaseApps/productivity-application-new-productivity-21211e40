import { Progress } from '@/components/ui/progress';

export default function ProgressTracker({ 
  steps = [], 
  currentStep = 0 
}) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-2 text-slate-600">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}