'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, AlertCircle } from 'lucide-react';
import BugsList from '@/components/bugs/BugsList';
import BugForm from '@/components/bugs/BugForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function BugsPage() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBug, setEditingBug] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await fetch('/api/bugs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bugs');
      }

      const data = await response.json();
      
      if (data.success) {
        setBugs(data.data || []);
      } else {
        throw new Error(data.error || 'Failed to load bugs');
      }
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bug) => {
    setEditingBug(bug);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBug(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchBugs();
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
            <h1 className="text-3xl font-bold text-slate-900">Bugs</h1>
            <p className="text-slate-600 mt-1">Track and resolve issues</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Report Bug
          </Button>
        </div>

        <BugsList 
          bugs={bugs}
          onEdit={handleEdit}
          onRefresh={fetchBugs}
        />
      </div>

      <Dialog open={showForm} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBug ? 'Edit Bug' : 'Report Bug'}
            </DialogTitle>
          </DialogHeader>
          <BugForm
            bug={editingBug}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}