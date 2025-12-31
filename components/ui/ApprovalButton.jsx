'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ApprovalButton({ 
  itemId, 
  itemType, 
  approveEndpoint, 
  rejectEndpoint,
  onSuccess 
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = action === 'approve' ? approveEndpoint : rejectEndpoint;

      const response = await fetch(endpoint.replace('[id]', itemId), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} ${itemType}`);
      }

      toast.success(`${itemType} ${action}d successfully`);
      setShowDialog(false);
      setComment('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(`Error ${action}ing ${itemType}:`, err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (actionType) => {
    setAction(actionType);
    setShowDialog(true);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => openDialog('approve')}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => openDialog('reject')}
        >
          <XCircle className="h-4 w-4 mr-1" />
          Reject
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === 'approve' ? 'Approve' : 'Reject'} {itemType}
            </DialogTitle>
            <DialogDescription>
              Add a comment (optional) for this {action}.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleAction} 
              disabled={loading}
              variant={action === 'approve' ? 'default' : 'destructive'}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                action === 'approve' ? 'Approve' : 'Reject'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}