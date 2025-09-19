
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
// BUG FIX: Replaced non-existent 'Id' icon with 'BadgeInfo'
import { PlusCircle, Edit, Trash2, MoreVertical, Search, UserPlus, BedDouble, Users, FileText, Phone, Mail, BadgeInfo, Banknote, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Helper to get initials from a name
const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
};


const TenantFormModal = ({ isOpen, setIsOpen, tenant, setAppState, availableUnits, rooms, tenants, ownerState, onTenantCreated, activeProperty }) => {
    const { toast } = useToast();
    const [profilePhotoPreview, setProfilePhotoPreview] = useState(tenant?.profilePhotoUrl || null);
    const [aadhaarCardPreview, setAadhaarCardPreview] = useState(tenant?.aadhaarCardUrl);
    const [leaseAgreementPreview, setLeaseAgreementPreview] = useState(tenant?.leaseAgreementUrl);
    const [selectedUnit, setSelectedUnit] = useState(tenant?.unitNo);
    const isBusiness = ownerState.defaults?.subscriptionPlan === 'business';

    const [formData, setFormData] = useState({
        name: tenant?.name || '',
        phone: tenant?.phone || '',
        email: tenant?.email || '',
        aadhaar: tenant?.aadhaar || '',
        rentAmount: tenant?.rentAmount || '',
        securityDeposit: tenant?.securityDeposit || '',
        moveInDate: tenant?.moveInDate || '',
        profilePhotoUrl: tenant?.profilePhotoUrl || '',
        aadhaarCardUrl: tenant?.aadhaarCardUrl || '',
        leaseAgreementUrl: tenant?.leaseAgreementUrl || '',
        unitNo: tenant?.unitNo || '',
        roomId: tenant?.roomId || '',
    });

    const handleFileChange = (e, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                // In a real app, you would upload this file and get a URL.
                // For now, we'll just use the base64 data URL for preview.
            };
            reader.readAsDataURL(file);
        }
    };
    
    const recalculateRentForRoom = (unitNo, allTenantsInProperty) => {
        const room = rooms.find(r => r.number === unitNo);
        if (!room) return allTenantsInProperty;

        const tenantsInRoom = allTenantsInProperty.filter(t => t.unitNo === unitNo && t.id !== tenant?.id);
        const newTenantCount = tenantsInRoom.length + 1;
        const newRentAmount = room.rent / newTenantCount;

        return allTenantsInProperty.map(t => 
            t.unitNo === unitNo ? { ...t, rentAmount: newRentAmount } : t
        );
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.phone || !formData.unitNo) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Name, Phone, and Unit Number are required." });
            return;
        }

        setAppState(prevOwnerState => {
            const newTenant = {
                id: tenant?.id || `t_${Date.now()}`,
                ...formData,
                profilePhotoUrl: profilePhotoPreview, // Using preview as URL for now
                aadhaarCardUrl: aadhaarCardPreview,
                leaseAgreementUrl: leaseAgreementPreview,
            };

            const updatedProperties = prevOwnerState.properties.map(p => {
                if (p.id === activeProperty.id) {
                    let updatedTenantsInProperty;
                    if (tenant) { // Editing existing tenant
                        updatedTenantsInProperty = p.tenants.map(t => t.id === tenant.id ? newTenant : t);
                    } else { // Adding new tenant
                        updatedTenantsInProperty = [...(p.tenants || []), newTenant];
                    }
                    
                    const room = rooms.find(r => r.number === newTenant.unitNo);
                    if (room?.rentSharing) {
                        updatedTenantsInProperty = recalculateRentForRoom(newTenant.unitNo, updatedTenantsInProperty);
                    }

                    return { ...p, tenants: updatedTenantsInProperty };
                }
                return p;
            });
            
            return { ...prevOwnerState, properties: updatedProperties };
        });

        toast({ title: "Success", description: `Tenant ${tenant ? 'updated' : 'added'} successfully.` });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{tenant ? 'Edit Tenant' : 'Add New Tenant'}</DialogTitle>
                    <DialogDescription>Fill in the details for the tenant. Click save when you're done.</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    {/* Column 1: Profile Photo & Basic Info */}
                    <div className="col-span-1 space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                            <Avatar className="h-32 w-32 border-4 border-slate-700">
                                <AvatarImage src={profilePhotoPreview} />
                                <AvatarFallback className="text-4xl bg-slate-700">{getInitials(formData.name)}</AvatarFallback>
                            </Avatar>
                            <Input id="profile-photo-upload" type="file" accept="image/*" className="hidden" onChange={e => handleFileChange(e, setProfilePhotoPreview)} />
                            <Label htmlFor="profile-photo-upload" className="cursor-pointer text-indigo-400 hover:text-indigo-300">Upload Photo</Label>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 12345 67890" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" value={formData.email} type="email" onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john.d@example.com" />
                        </div>
                    </div>

                    {/* Column 2: Room & Financial Info */}
                    <div className="col-span-1 space-y-4 border-l border-r border-slate-800 px-6">
                        <div className="space-y-2">
                            <Label htmlFor="unitNo">Room / Unit</Label>
                            <select id="unitNo" value={formData.unitNo} onChange={e => setFormData({...formData, unitNo: e.target.value, roomId: rooms.find(r=>r.number === e.target.value)?.id})} className="w-full bg-slate-800 border-slate-600 rounded p-2">
                                <option value="">Select a Unit</option>
                                {availableUnits.map(unit => <option key={unit.id} value={unit.number}>{unit.name} (Capacity: {unit.capacity})</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
                            <Input id="rentAmount" type="number" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} placeholder="e.g., 15000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                            <Input id="securityDeposit" type="number" value={formData.securityDeposit} onChange={e => setFormData({...formData, securityDeposit: e.target.value})} placeholder="e.g., 30000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moveInDate">Move-in Date</Label>
                            <Input id="moveInDate" type="date" value={formData.moveInDate} onChange={e => setFormData({...formData, moveInDate: e.target.value})} />
                        </div>
                    </div>

                    {/* Column 3: Documents */}
                    <div className="col-span-1 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="aadhaar">Aadhaar Number</Label>
                            <Input id="aadhaar" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} placeholder="1234 5678 9012" />
                        </div>
                        <div className="space-y-2">
                            <Label>Aadhaar Card Scan</Label>
                            {aadhaarCardPreview ? <img src={aadhaarCardPreview} alt="Aadhaar Preview" className="rounded-lg h-24 w-auto"/> : <div className="h-24 bg-slate-800 rounded-lg flex items-center justify-center"><BadgeInfo className="text-slate-500"/></div> }
                            <Input id="aadhaar-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFileChange(e, setAadhaarCardPreview)} />
                            <Label htmlFor="aadhaar-upload" className="cursor-pointer text-indigo-400 hover:text-indigo-300">Upload Aadhaar</Label>
                        </div>
                        <div className="space-y-2">
                            <Label>Lease Agreement</Label>
                             {leaseAgreementPreview ? <img src={leaseAgreementPreview} alt="Lease Preview" className="rounded-lg h-24 w-auto"/> : <div className="h-24 bg-slate-800 rounded-lg flex items-center justify-center"><FileText className="text-slate-500"/></div> }
                            <Input id="lease-upload" type="file" accept="image/*,application/pdf" className="hidden" onChange={e => handleFileChange(e, setLeaseAgreementPreview)} />
                            <Label htmlFor="lease-upload" className={isBusiness ? "cursor-pointer text-indigo-400 hover:text-indigo-300" : "text-slate-500 cursor-not-allowed"}>{isBusiness ? 'Upload Lease' : 'Upload Lease (Business Plan)'}</Label>
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


export default function Tenants({ appState: activeProperty, setAppState, ownerState }) {
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

    const handleDeleteTenant = (tenantId) => {
        setAppState(prevOwnerState => {
            const updatedProperties = prevOwnerState.properties.map(p => {
                if (p.id === activeProperty.id) {
                    const updatedTenants = p.tenants.filter(t => t.id !== tenantId);
                    return { ...p, tenants: updatedTenants };
                }
                return p;
            });
            return { ...prevOwnerState, properties: updatedProperties };
        });
        setTenantToDelete(null);
    };

    const filteredTenants = tenants.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.phone.includes(searchTerm) || 
        (t.unitNo && t.unitNo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const availableUnits = useMemo(() => {
        const tenantsPerUnit = tenants.reduce((acc, tenant) => {
            acc[tenant.unitNo] = (acc[tenant.unitNo] || 0) + 1;
            return acc;
        }, {});

        return rooms.filter(room => {
            const currentOccupancy = tenantsPerUnit[room.number] || 0;
            return currentOccupancy < room.capacity;
        });
    }, [rooms, tenants]);
    
    const stats = {
      totalTenants: tenants.length,
      occupiedRooms: [...new Set(tenants.map(t => t.unitNo))].length,
      pendingSecurity: tenants.filter(t => !t.securityDeposit || t.securityDeposit <= 0).length
    }

    return (
        <div className="space-y-6">
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Tenants</CardTitle>
                        <CardDescription>View, add, edit, or remove tenants from your property.</CardDescription>
                    </div>
                    <Button onClick={() => openModal()}><UserPlus className="mr-2 h-4 w-4" /> Add Tenant</Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                       <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-white/10">
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 text-indigo-400"><Users className="h-5 w-5"/></div>
                          <div><p className="text-sm text-slate-400">Total Tenants</p><p className="text-xl font-bold">{stats.totalTenants}</p></div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-white/10">
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 text-green-400"><BedDouble className="h-5 w-5"/></div>
                          <div><p className="text-sm text-slate-400">Rooms Occupied</p><p className="text-xl font-bold">{stats.occupiedRooms} / {rooms.length}</p></div>
                       </div>
                       <div className="bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-white/10">
                          <div className="bg-slate-900/50 p-3 rounded-lg border border-white/10 text-amber-400"><ShieldAlert className="h-5 w-5"/></div>
                          <div><p className="text-sm text-slate-400">Pending Deposits</p><p className="text-xl font-bold">{stats.pendingSecurity}</p></div>
                       </div>
                    </div>
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
                {filteredTenants.map(tenant => (
                    <Card key={tenant.id} className="bg-slate-800/50 border-white/10 flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-slate-700">
                                <AvatarImage src={tenant.profilePhotoUrl} alt={tenant.name} />
                                <AvatarFallback className="text-xl bg-slate-700">{getInitials(tenant.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <CardTitle className="text-xl text-white">{tenant.name}</CardTitle>
                                <CardDescription className="text-indigo-400 font-semibold">{rooms.find(r => r.id === tenant.roomId)?.name || 'No Room Assigned'}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5"/></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => openModal(tenant)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTenantToDelete(tenant)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm flex-1">
                            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-slate-400"/><span>{tenant.phone}</span></div>
                            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-slate-400"/><span>{tenant.email || 'Not provided'}</span></div>
                            <div className="flex items-center gap-3"><BadgeInfo className="h-4 w-4 text-slate-400"/><span>Aadhaar: {tenant.aadhaar || 'Not provided'}</span></div>
                            <div className="flex items-center gap-3 text-green-400"><Banknote className="h-4 w-4"/><span>Rent: ₹{tenant.rentAmount || 'N/A'}</span></div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isModalOpen && (
                <TenantFormModal 
                    isOpen={isModalOpen} 
                    setIsOpen={setIsModalOpen} 
                    tenant={editingTenant}
                    setAppState={setAppState}
                    availableUnits={availableUnits}
                    rooms={rooms}
                    tenants={tenants}
                    ownerState={ownerState}
                    activeProperty={activeProperty}
                />
            )}

            {tenantToDelete && (
                <Dialog open={!!tenantToDelete} onOpenChange={() => setTenantToDelete(null)}>
                    <DialogContent className="bg-slate-900 border-slate-700 text-white">
                        <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>This will permanently delete {tenantToDelete.name} and all their associated data. This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setTenantToDelete(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDeleteTenant(tenantToDelete.id)}>Delete Tenant</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
