
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, MoreVertical, Search, UserPlus, BedDouble, Users, FileText, Phone, Mail, BadgeInfo, Banknote, ShieldAlert, Calendar, FileScan } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return names[0][0].toUpperCase();
};

const TenantFormModal = ({ isOpen, setIsOpen, tenant, setAppState: dispatch, rooms, tenants, ownerState }) => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData({
            name: tenant?.name || '',
            phone: tenant?.phone || '',
            email: tenant?.email || '',
            aadhaar: tenant?.aadhaar || '',
            rent: tenant?.rent || '',
            moveInDate: tenant?.moveInDate || new Date().toISOString().split('T')[0],
            moveOutDate: tenant?.moveOutDate || '',
            roomId: tenant?.roomId || '',
            profilePhotoUrl: tenant?.profilePhotoUrl || null,
            aadhaarCardUrl: tenant?.aadhaarCardUrl || null,
            leaseAgreementUrl: tenant?.leaseAgreementUrl || null,
        });
    }, [isOpen, tenant]);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.phone || !formData.roomId) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Name, Phone, and Room are required." });
            return;
        }

        if (tenant) { // Editing existing tenant
            const updatedTenants = tenants.map(t => t.id === tenant.id ? { ...t, ...formData } : t);
            dispatch({ type: 'UPDATE_PROPERTY_DATA', payload: { key: 'tenants', data: updatedTenants } });
        } else { // Adding new tenant
            dispatch({ type: 'ADD_TENANT_AND_ADJUST_RENT', payload: { newTenant: { id: `t_${Date.now()}`, ...formData } } });
        }

        toast({ title: "Success", description: `Tenant ${tenant ? 'updated' : 'added'} successfully.` });
        setIsOpen(false);
    };
    
    const roomForTenant = rooms.find(r => r.id === formData.roomId);
    const isRentSharing = roomForTenant?.rentSharing;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{tenant ? 'Edit Tenant Details' : 'Add New Tenant'}</DialogTitle>
                    <DialogDescription>Fill in the details for the tenant. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                    {/* Column 1: Profile & Basic Info */}
                    <div className="col-span-1 flex flex-col items-center space-y-4">
                        <Avatar className="h-32 w-32 border-4 border-slate-700">
                            <AvatarImage src={formData.profilePhotoUrl} />
                            <AvatarFallback className="text-4xl bg-slate-700">{getInitials(formData.name)}</AvatarFallback>
                        </Avatar>
                        <Input id="profile-photo-upload" type="file" className="hidden" onChange={e => handleFileChange(e, 'profilePhotoUrl')} />
                        <Label htmlFor="profile-photo-upload" className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300">Upload Profile Photo</Label>
                        <div className="w-full space-y-3">
                            <Input placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <Input placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            <Input placeholder="Email Address" value={formData.email} type="email" onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>

                    {/* Column 2: Room & Tenancy Info */}
                    <div className="col-span-1 space-y-4 border-l border-r border-slate-800 px-6">
                        <div className="space-y-2">
                            <Label>Room / Unit</Label>
                            <select value={formData.roomId} onChange={e => setFormData({...formData, roomId: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded p-2">
                                <option value="">Select a Room</option>
                                {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Rent Amount (₹)</Label>
                            <Input type="number" value={isRentSharing ? 'Auto-calculated' : formData.rent} onChange={e => setFormData({...formData, rent: e.target.value})} disabled={isRentSharing} placeholder={isRentSharing ? 'Shared Rent' : 'e.g., 15000'} />
                            {isRentSharing && <p className="text-xs text-slate-400">Rent for this room is shared and will be set automatically.</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Move-in Date</Label>
                            <Input type="date" value={formData.moveInDate} onChange={e => setFormData({...formData, moveInDate: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Move-out Date (Optional)</Label>
                            <Input type="date" value={formData.moveOutDate} onChange={e => setFormData({...formData, moveOutDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Column 3: Documents */}
                    <div className="col-span-1 space-y-4">
                        <div className="space-y-2">
                            <Label>Aadhaar Number</Label>
                            <Input value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} placeholder="1234 5678 9012" />
                        </div>
                        <div className="space-y-2">
                            <Label>Aadhaar Card Scan</Label>
                            <div className="w-full h-24 mt-1 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.aadhaarCardUrl ? <img src={formData.aadhaarCardUrl} alt="Aadhaar Preview" className="h-full w-full object-contain"/> : <FileScan className="text-slate-500 w-10 h-10"/> }
                            </div>
                            <Input id="aadhaar-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={e => handleFileChange(e, 'aadhaarCardUrl')} />
                            <Label htmlFor="aadhaar-upload" className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300">Upload Aadhaar Scan</Label>
                        </div>
                         <div className="space-y-2">
                            <Label>Lease Agreement</Label>
                             <div className="w-full h-24 mt-1 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                {formData.leaseAgreementUrl ? <img src={formData.leaseAgreementUrl} alt="Lease Preview" className="h-full w-full object-contain"/> : <FileText className="text-slate-500 w-10 h-10"/> }
                            </div>
                            <Input id="lease-upload" type="file" className="hidden" accept="image/*,application/pdf" onChange={e => handleFileChange(e, 'leaseAgreementUrl')} />
                            <Label htmlFor="lease-upload" className="cursor-pointer text-sm text-indigo-400 hover:text-indigo-300">Upload Lease Document</Label>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}>Save Tenant</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function Tenants({ appState: activeProperty, setAppState: dispatch, ownerState }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [tenantToDelete, setTenantToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const tenants = activeProperty.tenants || [];
    const rooms = activeProperty.rooms || [];

    const openModal = (tenant = null) => {
        setEditingTenant(tenant);
        setIsModalOpen(true);
    };

    const handleDeleteTenant = () => {
        if (!tenantToDelete) return;
        const updatedTenants = tenants.filter(t => t.id !== tenantToDelete.id);
        dispatch({ type: 'UPDATE_PROPERTY_DATA', payload: { key: 'tenants', data: updatedTenants } });
        // TODO: This should dispatch an action that also re-calculates rent for the room.
        setTenantToDelete(null);
    };

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.phone.includes(searchTerm)
    );
    
    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Manage Tenants</CardTitle><CardDescription>View, add, edit, or remove tenants from your property.</CardDescription></div>
                    <Button onClick={() => openModal()}><UserPlus className="mr-2 h-4 w-4" /> Add Tenant</Button>
                </CardHeader>
                 <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input 
                            placeholder="Search by name, phone, or unit..."
                            className="pl-10 w-full"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTenants.map(tenant => {
                    const room = rooms.find(r => r.id === tenant.roomId);
                    return (
                    <Card key={tenant.id} className="bg-slate-800/50 border-white/10 flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Avatar className="h-16 w-16"><AvatarImage src={tenant.profilePhotoUrl} /><AvatarFallback>{getInitials(tenant.name)}</AvatarFallback></Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-xl">{tenant.name}</CardTitle>
                                <CardDescription>{room?.name || 'No Room'}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical/></Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openModal(tenant)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTenantToDelete(tenant)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm flex-1">
                            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-400"/><span>{tenant.phone}</span></div>
                            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-400"/><span>{tenant.email || 'Not provided'}</span></div>
                            <div className="flex items-center gap-3 text-green-400"><Banknote className="h-4 w-4"/><span>Rent: ₹{tenant.rent ? tenant.rent.toFixed(2) : 'N/A'}</span></div>
                            {tenant.moveInDate && <div className="flex items-center gap-3 text-slate-400"><Calendar className="h-4 w-4"/><span>Joined: {new Date(tenant.moveInDate).toLocaleDateString()}</span></div>}
                        </CardContent>
                    </Card>
                )})}
            </div>

            {isModalOpen && (
                <TenantFormModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} tenant={editingTenant} setAppState={dispatch} rooms={rooms} tenants={tenants} ownerState={ownerState} />
            )}

            {tenantToDelete && (
                <Dialog open={!!tenantToDelete} onOpenChange={() => setTenantToDelete(null)}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>This will permanently delete {tenantToDelete.name}. This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setTenantToDelete(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={handleDeleteTenant}>Delete Tenant</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
