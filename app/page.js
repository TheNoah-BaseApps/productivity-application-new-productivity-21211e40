'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users, Calendar, TrendingUp, FileText, Bug, Video, Package, Clock } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: FileText,
      title: 'Product Requirements',
      description: 'Define and track product requirements from concept to delivery'
    },
    {
      icon: CheckCircle2,
      title: 'Task Tracking',
      description: 'Manage tasks with milestones, priorities, and real-time progress'
    },
    {
      icon: Bug,
      title: 'Bug Tracking',
      description: 'Report, track, and resolve bugs with severity classification'
    },
    {
      icon: Calendar,
      title: 'Leave & Timesheet',
      description: 'Manage leave requests and track time against tasks and projects'
    },
    {
      icon: TrendingUp,
      title: 'Delivery Pipeline',
      description: 'Track software delivery phases from planning to deployment'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Meeting notes, action items, and team availability tracking'
    },
    {
      icon: Video,
      title: 'Meeting Recordings',
      description: 'Access and manage meeting recordings with searchable archive'
    },
    {
      icon: Package,
      title: 'Software Deliveries',
      description: 'Track software installations, support levels, and customer feedback'
    },
    {
      icon: Clock,
      title: 'Time Sheets',
      description: 'Employee time tracking with project and task linkage'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Productivity Hub</h1>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button onClick={() => router.push('/register')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Unified Productivity Management
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Connect product requirements, task execution, delivery tracking, and administrative workflows in one powerful platform
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" onClick={() => router.push('/register')}>
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
              Sign In
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <Icon className="w-10 h-10 text-blue-600 mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to transform your productivity?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join teams already using Productivity Hub to deliver better, faster
          </p>
          <Button size="lg" variant="secondary" onClick={() => router.push('/register')}>
            Create Your Account
          </Button>
        </div>
      </main>

      <footer className="border-t bg-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-slate-600">
          <p>&copy; 2024 Productivity Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}