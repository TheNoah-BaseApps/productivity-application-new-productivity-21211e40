'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductivityChart from '@/components/reports/ProductivityChart';
import ResourceUtilization from '@/components/reports/ResourceUtilization';
import DeliveryMetrics from '@/components/reports/DeliveryMetrics';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-600 mt-1">Analytics and insights</p>
      </div>

      <Tabs defaultValue="productivity" className="w-full">
        <TabsList>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="productivity" className="mt-6">
          <ProductivityChart />
        </TabsContent>
        
        <TabsContent value="resources" className="mt-6">
          <ResourceUtilization />
        </TabsContent>
        
        <TabsContent value="delivery" className="mt-6">
          <DeliveryMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}