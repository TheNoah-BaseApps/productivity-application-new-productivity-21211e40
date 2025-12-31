'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Edit, Trash2, Search, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function SoftwareDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/software-deliveries');
      const result = await response.json();
      
      if (result.success) {
        setDeliveries(result.data);
        calculateStats(result.data);
      } else {
        toast.error('Failed to load deliveries');
      }
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const pending = data.filter(d => d.installation_status === 'Pending').length;
    const completed = data.filter(d => d.installation_status === 'Completed').length;
    const failed = data.filter(d => d.installation_status === 'Failed').length;
    setStats({ total, pending, completed, failed });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this delivery?')) return;

    try {
      const response = await fetch(`/api/software-deliveries/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();

      if (result.success) {
        toast.success('Delivery deleted successfully');
        fetchDeliveries();
      } else {
        toast.error('Failed to delete delivery');
      }
    } catch (error) {
      console.error('Error deleting delivery:', error);
      toast.error('Failed to delete delivery');
    }
  };

  const handleEdit = (delivery) => {
    setEditingDelivery(delivery);
    setShowEditModal(true);
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.software_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.delivery_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || delivery.installation_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const variants = {
      'Completed': 'default',
      'Pending': 'secondary',
      'In Progress': 'outline',
      'Failed': 'destructive'
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
          <h1 className="text-3xl font-bold text-slate-900">Software Deliveries</h1>
          <p className="text-slate-600 mt-1">Track software delivery installations and support</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Delivery
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Deliveries</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.failed}</CardTitle>
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
                  placeholder="Search by software name, customer ID, or delivery ID..."
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
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Deliveries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Deliveries List</CardTitle>
          <CardDescription>Manage software delivery records</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDeliveries.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No deliveries found</h3>
              <p className="text-slate-600 mb-4">Get started by adding your first delivery</p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Delivery
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Delivery ID</TableHead>
                  <TableHead>Software Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Support Level</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.delivery_id}</TableCell>
                    <TableCell>{delivery.software_name}</TableCell>
                    <TableCell>{delivery.version}</TableCell>
                    <TableCell>{delivery.customer_id}</TableCell>
                    <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(delivery.installation_status)}</TableCell>
                    <TableCell>{delivery.support_level || 'N/A'}</TableCell>
                    <TableCell>{delivery.assigned_agent || 'Unassigned'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(delivery)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(delivery.id)}
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
      <DeliveryFormModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={fetchDeliveries}
      />
      <DeliveryFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        delivery={editingDelivery}
        onSuccess={fetchDeliveries}
      />
    </div>
  );
}

function DeliveryFormModal({ open, onOpenChange, delivery, onSuccess }) {
  const [formData, setFormData] = useState({
    delivery_id: '',
    customer_id: '',
    software_name: '',
    version: '',
    delivery_date: '',
    installation_status: 'Pending',
    support_level: '',
    assigned_agent: '',
    feedback_received: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (delivery) {
      setFormData({
        delivery_id: delivery.delivery_id || '',
        customer_id: delivery.customer_id || '',
        software_name: delivery.software_name || '',
        version: delivery.version || '',
        delivery_date: delivery.delivery_date ? new Date(delivery.delivery_date).toISOString().split('T')[0] : '',
        installation_status: delivery.installation_status || 'Pending',
        support_level: delivery.support_level || '',
        assigned_agent: delivery.assigned_agent || '',
        feedback_received: delivery.feedback_received || ''
      });
    } else {
      setFormData({
        delivery_id: '',
        customer_id: '',
        software_name: '',
        version: '',
        delivery_date: '',
        installation_status: 'Pending',
        support_level: '',
        assigned_agent: '',
        feedback_received: ''
      });
    }
  }, [delivery]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = delivery ? `/api/software-deliveries/${delivery.id}` : '/api/software-deliveries';
      const method = delivery ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(delivery ? 'Delivery updated successfully' : 'Delivery created successfully');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || 'Failed to save delivery');
      }
    } catch (error) {
      console.error('Error saving delivery:', error);
      toast.error('Failed to save delivery');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{delivery ? 'Edit Delivery' : 'Add New Delivery'}</DialogTitle>
          <DialogDescription>
            {delivery ? 'Update delivery information' : 'Enter delivery details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_id">Delivery ID *</Label>
              <Input
                id="delivery_id"
                value={formData.delivery_id}
                onChange={(e) => setFormData({ ...formData, delivery_id: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer ID *</Label>
              <Input
                id="customer_id"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="software_name">Software Name *</Label>
              <Input
                id="software_name"
                value={formData.software_name}
                onChange={(e) => setFormData({ ...formData, software_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version *</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date *</Label>
              <Input
                id="delivery_date"
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installation_status">Installation Status *</Label>
              <Select
                value={formData.installation_status}
                onValueChange={(value) => setFormData({ ...formData, installation_status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="support_level">Support Level</Label>
              <Select
                value={formData.support_level}
                onValueChange={(value) => setFormData({ ...formData, support_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select support level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_agent">Assigned Agent</Label>
              <Input
                id="assigned_agent"
                value={formData.assigned_agent}
                onChange={(e) => setFormData({ ...formData, assigned_agent: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback_received">Feedback Received</Label>
            <Textarea
              id="feedback_received"
              value={formData.feedback_received}
              onChange={(e) => setFormData({ ...formData, feedback_received: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : delivery ? 'Update Delivery' : 'Create Delivery'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}