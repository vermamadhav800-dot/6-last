
"use client";

import { useState } from 'react';
import { Plus, Trash2, Edit, Building, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";

export default function Properties({ appState, setAppState, setActivePropertyId }) {
  const { properties = [] } = appState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const { toast } = useToast();

  const openModal = (property) => {
    setEditingProperty(property);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const propertyData = {
      name: formData.get('name'),
      address: formData.get('address'),
    };

    setAppState(prev => {
        let updatedProperties;
        if (editingProperty) {
            updatedProperties = prev.properties.map(p => p.id === editingProperty.id ? { ...p, ...propertyData } : p);
            toast({ title: "Success", description: "Property updated successfully." });
        } else {
            const newProperty = { 
                ...propertyData, 
                id: `prop_${Date.now()}`,
                tenants: [], rooms: [], payments: [], electricity: [], expenses: [],
                pendingApprovals: [], updateRequests: [], maintenanceRequests: [],
                notifications: [], globalNotices: []
            };
            updatedProperties = [...(prev.properties || []), newProperty];
            toast({ title: "Success", description: "New property added." });
        }
        return { ...prev, properties: updatedProperties };
    });

    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const confirmDeleteProperty = (property) => {
    if (property.tenants && property.tenants.length > 0) {
      toast({ variant: "destructive", title: "Error", description: "Cannot delete property with tenants. Please reassign tenants first." });
      return;
    }
    setPropertyToDelete(property);
  };

  const handleDeleteProperty = () => {
    if (!propertyToDelete) return;
    setAppState(prev => {
        const updatedProperties = prev.properties.filter(p => p.id !== propertyToDelete.id);
        let newActiveId = prev.activePropertyId;
        if (prev.activePropertyId === propertyToDelete.id) {
            newActiveId = updatedProperties.length > 0 ? updatedProperties[0].id : null;
        }
        return {
            ...prev,
            properties: updatedProperties,
            activePropertyId: newActiveId
        };
    });
    toast({ title: "Success", description: "Property deleted." });
    setPropertyToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold font-headline">Property Management</h2>
          <p className="text-muted-foreground">Add, edit, and manage all your properties.</p>
        </div>
        <Button onClick={() => openModal(null)} className="btn-gradient-glow w-full md:w-auto"><Plus className="mr-2 h-4 w-4" /> Add Property</Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-2xl">
          <Building className="mx-auto h-16 w-16 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
          <p className="mb-4">Get started by adding your first property.</p>
          <Button onClick={() => openModal(null)}>Add Your First Property</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => {
            const tenantCount = property.tenants?.length || 0;
            const roomCount = property.rooms?.length || 0;
            return (
              <Card key={property.id} className="glass-card card-hover flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{property.name}</CardTitle>
                     <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2" onClick={() => setActivePropertyId(property.id)}>
                        <MoreVertical className="w-4 h-4"/>
                    </Button>
                  </div>
                   <CardDescription>{property.address}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                   <div className="text-sm text-muted-foreground">Tenants: <span className="font-bold text-foreground">{tenantCount}</span></div>
                   <div className="text-sm text-muted-foreground">Rooms: <span className="font-bold text-foreground">{roomCount}</span></div>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 pt-4">
                  <Button variant="outline" onClick={() => openModal(property)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
                  <AlertDialog>
                     <AlertDialogTrigger asChild>
                      <Button variant="destructive" onClick={() => confirmDeleteProperty(property)}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                    </AlertDialogTrigger>
                    {propertyToDelete && (!propertyToDelete.tenants || propertyToDelete.tenants.length === 0) && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the property "{propertyToDelete?.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPropertyToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteProperty}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    )}
                  </AlertDialog>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
        setIsModalOpen(isOpen);
        if (!isOpen) setEditingProperty(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
            <div><Label htmlFor="name">Property Name</Label><Input id="name" name="name" defaultValue={editingProperty?.name} required /></div>
            <div><Label htmlFor="address">Property Address</Label><Input id="address" name="address" defaultValue={editingProperty?.address} required /></div>
            <DialogFooter className="pt-4"><Button type="submit" className="w-full btn-gradient-glow">{editingProperty ? 'Save Changes' : 'Add Property'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
