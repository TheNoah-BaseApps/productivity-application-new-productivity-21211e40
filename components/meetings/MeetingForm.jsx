'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';

export default function MeetingForm({ meeting, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    notes: '',
    attendees: [],
    action_items: []
  });
  const [newAttendee, setNewAttendee] = useState('');
  const [newActionItem, setNewActionItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        date: meeting.date ? new Date(meeting.date).toISOString().slice(0, 16) : '',
        notes: meeting.notes || '',
        attendees: Array.isArray(meeting.attendees) ? meeting.attendees : [],
        action_items: Array.isArray(meeting.action_items) ? meeting.action_items : []
      });
    }
  }, [meeting]);

  const addAttendee = () => {
    if (newAttendee.trim()) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, newAttendee.trim()]
      });
      setNewAttendee('');
    }
  };

  const removeAttendee = (index) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter((_, i) => i !== index)
    });
  };

  const addActionItem = () => {
    if (newActionItem.trim()) {
      setFormData({
        ...formData,
        action_items: [...formData.action_items, { task: newActionItem.trim(), completed: false }]
      });
      setNewActionItem('');
    }
  };

  const removeActionItem = (index) => {
    setFormData({
      ...formData,
      action_items: formData.action_items.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const url = meeting ? `/api/meetings/${meeting.id}` : '/api/meetings';
      
      const response = await fetch(url, {
        method: meeting ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save meeting');
      }

      toast.success(`Meeting ${meeting ? 'updated' : 'created'} successfully`);
      onSuccess();
    } catch (err) {
      console.error('Error saving meeting:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date & Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Attendees</Label>
        <div className="flex gap-2">
          <Input
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            placeholder="Enter name or email"
            disabled={loading}
          />
          <Button type="button" onClick={addAttendee} disabled={loading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.attendees.map((attendee, index) => (
            <div key={index} className="bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="text-sm">{attendee}</span>
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Meeting Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Action Items</Label>
        <div className="flex gap-2">
          <Input
            value={newActionItem}
            onChange={(e) => setNewActionItem(e.target.value)}
            placeholder="Add action item"
            disabled={loading}
          />
          <Button type="button" onClick={addActionItem} disabled={loading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {formData.action_items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
              <span className="text-sm flex-1">{item.task}</span>
              <button
                type="button"
                onClick={() => removeActionItem(index)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            meeting ? 'Update' : 'Create'
          )}
        </Button>
      </div>
    </form>
  );
}