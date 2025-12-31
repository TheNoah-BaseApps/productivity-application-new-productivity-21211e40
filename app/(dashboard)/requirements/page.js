'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, AlertCircle } from 'lucide-react';
import RequirementsList from '@/components/requirements/RequirementsList';
import RequirementForm from '@/components/requirements/RequirementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);

  useEffect(() => {
    fetchRequirements();
  }, []);

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/requirements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requirements');
      }

      const data = await response.json();
      
      if (data.success) {
        setRequirements(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to load requirements');
      }
    } catch (err) {
      console.error('Error fetching requirements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (requirement) => {
    setEditingRequirement(requirement);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRequirement(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchRequirements();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Requirements</h1>
            <p className="text-slate-600 mt-1">Manage product requirements and features</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Requirement
          </Button>
        </div>

        <RequirementsList 
          requirements={requirements}
          onEdit={handleEdit}
          onRefresh={fetchRequirements}
        />
      </div>

      <Dialog open={showForm} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRequirement ? 'Edit Requirement' : 'Add Requirement'}
            </DialogTitle>
          </DialogHeader>
          <RequirementForm
            requirement={editingRequirement}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}