'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { FileText, Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';

export default function ProductRequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    requirement_id: '',
    customer_id: '',
    document_source: '',
    feature_description: '',
    priority: 'Medium',
    associated_product: '',
    requirement_date: new Date().toISOString().split('T')[0],
    status: 'New',
    no_of_sprints: '',
    cost: '',
    q_cparameters: ''
  });

  useEffect(() => {
    fetchRequirements();
  }, []);

  async function fetchRequirements() {
    try {
      setLoading(true);
      const response = await fetch('/api/product-requirements');
      const data = await response.json();
      
      if (data.success) {
        setRequirements(data.data || []);
      } else {
        toast.error('Failed to load product requirements');
      }
    } catch (error) {
      console.error('Error fetching requirements:', error);
      toast.error('Error loading product requirements');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/product-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product requirement created successfully');
        setShowAddDialog(false);
        resetForm();
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to create requirement');
      }
    } catch (error) {
      console.error('Error creating requirement:', error);
      toast.error('Error creating requirement');
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/product-requirements/${editingRequirement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product requirement updated successfully');
        setShowEditDialog(false);
        setEditingRequirement(null);
        resetForm();
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to update requirement');
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast.error('Error updating requirement');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this requirement?')) return;

    try {
      const response = await fetch(`/api/product-requirements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product requirement deleted successfully');
        fetchRequirements();
      } else {
        toast.error(data.error || 'Failed to delete requirement');
      }
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast.error('Error deleting requirement');
    }
  }

  function openEditDialog(requirement) {
    setEditingRequirement(requirement);
    setFormData({
      requirement_id: requirement.requirement_id,
      customer_id: requirement.customer_id || '',
      document_source: requirement.document_source || '',
      feature_description: requirement.feature_description,
      priority: requirement.priority,
      associated_product: requirement.associated_product || '',
      requirement_date: requirement.requirement_date?.split('T')[0] || '',
      status: requirement.status,
      no_of_sprints: requirement.no_of_sprints || '',
      cost: requirement.cost || '',
      q_cparameters: requirement.q_cparameters || ''
    });
    setShowEditDialog(true);
  }

  function resetForm() {
    setFormData({
      requirement_id: '',
      customer_id: '',
      document_source: '',
      feature_description: '',
      priority: 'Medium',
      associated_product: '',
      requirement_date: new Date().toISOString().split('T')[0],
      status: 'New',
      no_of_sprints: '',
      cost: '',
      q_cparameters: ''
    });
  }

  const filteredRequirements = requirements.filter(req =>
    req.feature_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requirement_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customer_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: requirements.length,
    new: requirements.filter(r => r.status === 'New').length,
    inProgress: requirements.filter(r => r.status === 'In Progress').length,
    completed: requirements.filter(r => r.status === 'Completed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Product Requirements</h1>
          <p className="text-slate-600 mt-1">Manage product requirements and feature requests</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Requirements</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>New</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.new}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Requirements List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search requirements..."
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
          ) : filteredRequirements.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No requirements found</h3>
              <p className="text-slate-600 mb-4">Get started by creating your first product requirement</p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Requirement
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement ID</TableHead>
                  <TableHead>Feature Description</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sprints</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.requirement_id}</TableCell>
                    <TableCell className="max-w-xs truncate">{req.feature_description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        req.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {req.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        req.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        req.status === 'Approved' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {req.status}
                      </span>
                    </TableCell>
                    <TableCell>{req.no_of_sprints || '-'}</TableCell>
                    <TableCell>{req.cost ? `$${req.cost}` : '-'}</TableCell>
                    <TableCell>{new Date(req.requirement_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(req)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(req.id)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product Requirement</DialogTitle>
            <DialogDescription>Create a new product requirement</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requirement_id">Requirement ID *</Label>
                <Input
                  id="requirement_id"
                  value={formData.requirement_id}
                  onChange={(e) => setFormData({ ...formData, requirement_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_id">Customer ID</Label>
                <Input
                  id="customer_id"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature_description">Feature Description *</Label>
              <Textarea
                id="feature_description"
                value={formData.feature_description}
                onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="document_source">Document Source</Label>
                <Input
                  id="document_source"
                  value={formData.document_source}
                  onChange={(e) => setFormData({ ...formData, document_source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="associated_product">Associated Product</Label>
                <Input
                  id="associated_product"
                  value={formData.associated_product}
                  onChange={(e) => setFormData({ ...formData, associated_product: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requirement_date">Requirement Date *</Label>
                <Input
                  id="requirement_date"
                  type="date"
                  value={formData.requirement_date}
                  onChange={(e) => setFormData({ ...formData, requirement_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="no_of_sprints">No. of Sprints</Label>
                <Input
                  id="no_of_sprints"
                  type="number"
                  value={formData.no_of_sprints}
                  onChange={(e) => setFormData({ ...formData, no_of_sprints: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="q_cparameters">Q/C Parameters</Label>
              <Textarea
                id="q_cparameters"
                value={formData.q_cparameters}
                onChange={(e) => setFormData({ ...formData, q_cparameters: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowAddDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Create Requirement</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product Requirement</DialogTitle>
            <DialogDescription>Update requirement details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_requirement_id">Requirement ID *</Label>
                <Input
                  id="edit_requirement_id"
                  value={formData.requirement_id}
                  onChange={(e) => setFormData({ ...formData, requirement_id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_customer_id">Customer ID</Label>
                <Input
                  id="edit_customer_id"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_feature_description">Feature Description *</Label>
              <Textarea
                id="edit_feature_description"
                value={formData.feature_description}
                onChange={(e) => setFormData({ ...formData, feature_description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_document_source">Document Source</Label>
                <Input
                  id="edit_document_source"
                  value={formData.document_source}
                  onChange={(e) => setFormData({ ...formData, document_source: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_associated_product">Associated Product</Label>
                <Input
                  id="edit_associated_product"
                  value={formData.associated_product}
                  onChange={(e) => setFormData({ ...formData, associated_product: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_requirement_date">Requirement Date *</Label>
                <Input
                  id="edit_requirement_date"
                  type="date"
                  value={formData.requirement_date}
                  onChange={(e) => setFormData({ ...formData, requirement_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_no_of_sprints">No. of Sprints</Label>
                <Input
                  id="edit_no_of_sprints"
                  type="number"
                  value={formData.no_of_sprints}
                  onChange={(e) => setFormData({ ...formData, no_of_sprints: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_cost">Cost ($)</Label>
                <Input
                  id="edit_cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_q_cparameters">Q/C Parameters</Label>
              <Textarea
                id="edit_q_cparameters"
                value={formData.q_cparameters}
                onChange={(e) => setFormData({ ...formData, q_cparameters: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowEditDialog(false); setEditingRequirement(null); resetForm(); }}>
                Cancel
              </Button>
              <Button type="submit">Update Requirement</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}