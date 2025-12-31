'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Video, Plus, Pencil, Trash2, Loader2, Search, ExternalLink } from 'lucide-react';

export default function MeetingRecordingsPage() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRecording, setEditingRecording] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    recording_id: '',
    meeting_title: '',
    participants: '',
    recording_link: '',
    meeting_date: new Date().toISOString().split('T')[0],
    duration: ''
  });

  useEffect(() => {
    fetchRecordings();
  }, []);

  async function fetchRecordings() {
    try {
      setLoading(true);
      const response = await fetch('/api/meeting-recordings');
      const data = await response.json();
      
      if (data.success) {
        setRecordings(data.data || []);
      } else {
        toast.error('Failed to load meeting recordings');
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast.error('Error loading meeting recordings');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/meeting-recordings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Meeting recording created successfully');
        setShowAddDialog(false);
        resetForm();
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to create recording');
      }
    } catch (error) {
      console.error('Error creating recording:', error);
      toast.error('Error creating recording');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/meeting-recordings/${editingRecording.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Meeting recording updated successfully');
        setShowEditDialog(false);
        setEditingRecording(null);
        resetForm();
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to update recording');
      }
    } catch (error) {
      console.error('Error updating recording:', error);
      toast.error('Error updating recording');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this recording?')) return;

    try {
      const response = await fetch(`/api/meeting-recordings/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Meeting recording deleted successfully');
        fetchRecordings();
      } else {
        toast.error(data.error || 'Failed to delete recording');
      }
    } catch (error) {
      console.error('Error deleting recording:', error);
      toast.error('Error deleting recording');
    }
  }

  function openEditDialog(recording) {
    setEditingRecording(recording);
    setFormData({
      recording_id: recording.recording_id,
      meeting_title: recording.meeting_title,
      participants: recording.participants || '',
      recording_link: recording.recording_link || '',
      meeting_date: recording.meeting_date?.split('T')[0] || '',
      duration: recording.duration || ''
    });
    setShowEditDialog(true);
  }

  function resetForm() {
    setFormData({
      recording_id: '',
      meeting_title: '',
      participants: '',
      recording_link: '',
      meeting_date: new Date().toISOString().split('T')[0],
      duration: ''
    });
  }

  const filteredRecordings = recordings.filter(rec =>
    rec.meeting_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.recording_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.participants?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: recordings.length,
    thisMonth: recordings.filter(r => {
      const date = new Date(r.meeting_date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    totalDuration: recordings.reduce((sum, r) => sum + (r.duration || 0), 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Meeting Recordings</h1>
          <p className="text-slate-600 mt-1">Manage and access meeting recordings</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Recording
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Recordings</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>This Month</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.thisMonth}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Duration</CardDescription>
            <CardTitle className="text-3xl text-green-600">{Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recordings List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search recordings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredRecordings.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No recordings found</h3>
              <p className="text-slate-600 mb-4">Get started by adding your first meeting recording</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Recording
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recording ID</TableHead>
                  <TableHead>Meeting Title</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordings.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.recording_id}</TableCell>
                    <TableCell>{rec.meeting_title}</TableCell>
                    <TableCell className="max-w-xs truncate">{rec.participants || '-'}</TableCell>
                    <TableCell>{new Date(rec.meeting_date).toLocaleDateString()}</TableCell>
                    <TableCell>{rec.duration ? `${rec.duration} min` : '-'}</TableCell>
                    <TableCell>
                      {rec.recording_link ? (
                        <a
                          href={rec.recording_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(rec)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(rec.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Meeting Recording</DialogTitle>
            <DialogDescription>Create a new meeting recording entry</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recording_id">Recording ID *</Label>
                <Input
                  id="recording_id"
                  value={formData.recording_id}
                  onChange={(e) => setFormData({ ...formData, recording_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_date">Meeting Date *</Label>
                <Input
                  id="meeting_date"
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting_title">Meeting Title *</Label>
              <Input
                id="meeting_title"
                value={formData.meeting_title}
                onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participants">Participants</Label>
              <Input
                id="participants"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Comma-separated names"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recording_link">Recording Link</Label>
                <Input
                  id="recording_link"
                  type="url"
                  value={formData.recording_link}
                  onChange={(e) => setFormData({ ...formData, recording_link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Create Recording</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Meeting Recording</DialogTitle>
            <DialogDescription>Update recording details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_recording_id">Recording ID *</Label>
                <Input
                  id="edit_recording_id"
                  value={formData.recording_id}
                  onChange={(e) => setFormData({ ...formData, recording_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_meeting_date">Meeting Date *</Label>
                <Input
                  id="edit_meeting_date"
                  type="date"
                  value={formData.meeting_date}
                  onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_meeting_title">Meeting Title *</Label>
              <Input
                id="edit_meeting_title"
                value={formData.meeting_title}
                onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_participants">Participants</Label>
              <Input
                id="edit_participants"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Comma-separated names"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_duration">Duration (minutes)</Label>
                <Input
                  id="edit_duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_recording_link">Recording Link</Label>
                <Input
                  id="edit_recording_link"
                  type="url"
                  value={formData.recording_link}
                  onChange={(e) => setFormData({ ...formData, recording_link: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowEditDialog(false); setEditingRecording(null); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Update Recording</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}