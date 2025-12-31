'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Edit, Trash2, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function TimeSheetsPage() {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTimesheet, setEditingTimesheet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    totalHours: 0
  });

  useEffect(() => {
    fetchTimesheets();
  }, []);

  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/time-sheets');
      const result = await response.json();
      
      if (result.success) {
        setTimesheets(result.data);
        calculateStats(result.data);
      } else {
        toast.error('Failed to load timesheets');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      toast.error('Failed to load timesheets');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(t => t.approval_status === 'Pending').length;
    const approved = data.filter(t => t.approval_status === 'Approved').length;
    const totalHours = data.reduce((sum, t) => sum + (t.hours_worked || 0), 0);
    setStats({ total, pending, approved, totalHours });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this timesheet?')) return;

    try {
      const response = await fetch(`/api/time-sheets/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Timesheet deleted successfully');
        fetchTimesheets();
      } else {
        toast.error('Failed to delete timesheet');
      }
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      toast.error('Failed to delete timesheet');
    }
  };

  const handleEdit = (timesheet) => {
    setEditingTimesheet(timesheet);
    setShowEditModal(true);
  };

  const filteredTimesheets = timesheets.filter(timesheet => {
    const matchesSearch = 
      timesheet.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.project_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timesheet.task_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || timesheet.approval_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'Approved': 'default',
      'Pending': 'secondary',
      'Rejected': 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Time Sheets</h1>
          <p className="text-slate-600 mt-1">Track employee time and project hours</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Timesheet
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Entries</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Approval</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Hours</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.totalHours}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by employee, project, or task ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Timesheets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Entries</CardTitle>
          <CardDescription>Manage employee timesheet records</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTimesheets.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No timesheets found</h3>
              <p className="text-slate-600 mb-4">Get started by adding your first timesheet entry</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Timesheet
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timesheet ID</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell className="font-medium">{timesheet.timesheet_id}</TableCell>
                    <TableCell>{timesheet.employee_id}</TableCell>
                    <TableCell>{timesheet.project_id}</TableCell>
                    <TableCell>{timesheet.task_id}</TableCell>
                    <TableCell>{new Date(timesheet.date).toLocaleDateString()}</TableCell>
                    <TableCell>{timesheet.start_time}</TableCell>
                    <TableCell>{timesheet.end_time}</TableCell>
                    <TableCell>{timesheet.hours_worked}h</TableCell>
                    <TableCell>{getStatusBadge(timesheet.approval_status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(timesheet)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(timesheet.id)}
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

      {/* Add/Edit Modals */}
      <TimesheetFormModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchTimesheets}
      />
      <TimesheetFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        timesheet={editingTimesheet}
        onSuccess={fetchTimesheets}
      />
    </div>
  );
}

function TimesheetFormModal({ open, onOpenChange, timesheet, onSuccess }) {
  const [formData, setFormData] = useState({
    timesheet_id: '',
    employee_id: '',
    project_id: '',
    task_id: '',
    date: '',
    start_time: '',
    end_time: '',
    hours_worked: 0,
    approval_status: 'Pending'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (timesheet) {
      setFormData({
        timesheet_id: timesheet.timesheet_id || '',
        employee_id: timesheet.employee_id || '',
        project_id: timesheet.project_id || '',
        task_id: timesheet.task_id || '',
        date: timesheet.date ? new Date(timesheet.date).toISOString().split('T')[0] : '',
        start_time: timesheet.start_time || '',
        end_time: timesheet.end_time || '',
        hours_worked: timesheet.hours_worked || 0,
        approval_status: timesheet.approval_status || 'Pending'
      });
    } else {
      setFormData({
        timesheet_id: '',
        employee_id: '',
        project_id: '',
        task_id: '',
        date: '',
        start_time: '',
        end_time: '',
        hours_worked: 0,
        approval_status: 'Pending'
      });
    }
  }, [timesheet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = timesheet ? `/api/time-sheets/${timesheet.id}` : '/api/time-sheets';
      const method = timesheet ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(timesheet ? 'Timesheet updated successfully' : 'Timesheet created successfully');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || 'Failed to save timesheet');
      }
    } catch (error) {
      console.error('Error saving timesheet:', error);
      toast.error('Failed to save timesheet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{timesheet ? 'Edit Timesheet' : 'Add New Timesheet'}</DialogTitle>
          <DialogDescription>
            {timesheet ? 'Update timesheet information' : 'Enter timesheet details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timesheet_id">Timesheet ID *</Label>
              <Input
                id="timesheet_id"
                value={formData.timesheet_id}
                onChange={(e) => setFormData({ ...formData, timesheet_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project ID *</Label>
              <Input
                id="project_id"
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task_id">Task ID *</Label>
              <Input
                id="task_id"
                value={formData.task_id}
                onChange={(e) => setFormData({ ...formData, task_id: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time">Start Time *</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time">End Time *</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours_worked">Hours Worked *</Label>
              <Input
                id="hours_worked"
                type="number"
                value={formData.hours_worked}
                onChange={(e) => setFormData({ ...formData, hours_worked: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="approval_status">Approval Status *</Label>
            <Select
              value={formData.approval_status}
              onValueChange={(value) => setFormData({ ...formData, approval_status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : timesheet ? 'Update Timesheet' : 'Create Timesheet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}