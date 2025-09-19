
"use client";

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Zap, FileText, Calculator, Home, Trash2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => {
    const colors = {
        primary: 'text-indigo-400',
        success: 'text-green-400',
        warning: 'text-amber-400',
        danger: 'text-red-400',
    };
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl border border-white/10 flex items-center gap-4">
            <div className={`bg-slate-900/50 p-3 rounded-lg border border-white/10 ${colors[color] || 'text-slate-400'}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    );
};

export default function Electricity({ appState: activeProperty, setAppState: setOwnerState }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [readingToDelete, setReadingToDelete] = useState(null);
    const [newReading, setNewReading] = useState({ roomId: '', unitsConsumed: '', ratePerUnit: '', totalAmount: '', date: new Date().toISOString().split('T')[0] });
    const { toast } = useToast();

    const rooms = useMemo(() => activeProperty.rooms || [], [activeProperty.rooms]);
    const electricityReadings = useMemo(() => activeProperty.electricity || [], [activeProperty.electricity]);
    const tenants = useMemo(() => activeProperty.tenants || [], [activeProperty.tenants]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedReading = { ...newReading, [name]: value };

        if (name === 'unitsConsumed' || name === 'ratePerUnit') {
            const units = parseFloat(updatedReading.unitsConsumed) || 0;
            const rate = parseFloat(updatedReading.ratePerUnit) || 0;
            updatedReading.totalAmount = (units * rate).toFixed(2);
        }
        setNewReading(updatedReading);
    };

    const handleAddReading = () => {
        if (!newReading.roomId || !newReading.unitsConsumed || !newReading.ratePerUnit) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please select a room and fill all fields." });
            return;
        }

        setOwnerState(prev => ({
            ...prev,
            properties: prev.properties.map(p => 
                p.id === activeProperty.id
                    ? { ...p, electricity: [...(p.electricity || []), { ...newReading, id: `elec_${Date.now()}`, applied: false }] }
                    : p
            )
        }));

        toast({ title: "Success", description: "New electricity reading added." });
        setIsDialogOpen(false);
        setNewReading({ roomId: '', unitsConsumed: '', ratePerUnit: '', totalAmount: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleDeleteReading = () => {
        if (!readingToDelete) return;

        setOwnerState(prev => ({
            ...prev,
            properties: prev.properties.map(p => 
                p.id === activeProperty.id
                    ? { ...p, electricity: p.electricity.filter(r => r.id !== readingToDelete.id) }
                    : p
            )
        }));
        
        toast({ variant: "destructive", title: "Reading Deleted", description: "The electricity reading has been deleted." });
        setReadingToDelete(null);
    };

    const handleApplyBill = (readingId) => {
        const reading = electricityReadings.find(r => r.id === readingId);
        if (!reading) return;

        const tenantsInRoom = tenants.filter(t => t.roomId === reading.roomId);
        if (tenantsInRoom.length === 0) {
            toast({ variant: "destructive", title: "No Tenants", description: "This room has no tenants to apply the bill to. This is often due to a data sync issue. Please switch tabs and come back." });
            return;
        }

        const amountPerTenant = parseFloat(reading.totalAmount) / tenantsInRoom.length;

        setOwnerState(prevOwnerState => {
            return {
                ...prevOwnerState,
                properties: prevOwnerState.properties.map(p => {
                    if (p.id === activeProperty.id) {
                        const updatedElectricity = (p.electricity || []).map(r => r.id === readingId ? { ...r, applied: true } : r);
                        const updatedTenants = (p.tenants || []).map(t => {
                            if (tenantsInRoom.some(tr => tr.id === t.id)) {
                                const otherCharges = (t.otherCharges || []).filter(oc => oc.id !== `elec-${reading.id}`);
                                otherCharges.push({
                                    id: `elec-${reading.id}`,
                                    amount: amountPerTenant,
                                    description: `Electricity Bill for ${new Date(reading.date).toLocaleString('default', { month: 'long' })}`,
                                    date: reading.date,
                                });
                                return { ...t, otherCharges };
                            }
                            return t;
                        });
                        return { ...p, electricity: updatedElectricity, tenants: updatedTenants };
                    }
                    return p;
                })
            };
        });

        toast({
            title: "Bill Applied!",
            description: `An amount of ₹${amountPerTenant.toFixed(2)} has been added to the bill of ${tenantsInRoom.length} tenant(s).`
        });
    };
    
    const thisMonthReadings = electricityReadings.filter(r => new Date(r.date).getMonth() === new Date().getMonth());
    const totalUnits = thisMonthReadings.reduce((sum, r) => sum + Number(r.unitsConsumed || 0), 0);
    const totalBill = thisMonthReadings.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);
    const avgRate = thisMonthReadings.length > 0 ? thisMonthReadings.reduce((sum, r) => sum + Number(r.ratePerUnit || 0), 0) / thisMonthReadings.length : 0;
    const avgPerRoom = rooms.length > 0 ? totalBill / rooms.length : 0;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Electricity Readings</CardTitle>
                        <CardDescription>Manage electricity for {activeProperty.name}.</CardDescription>
                    </div>
                    <Button onClick={() => setIsDialogOpen(true)}><PlusCircle className="mr-2 h-4 w-4" /> Add Reading</Button>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard title="Total Units (Month)" value={totalUnits.toFixed(2)} icon={Zap} color="primary" />
                        <StatCard title="Total Bill (Month)" value={`₹${totalBill.toLocaleString('en-IN', {minimumFractionDigits: 2})}`} icon={FileText} color="warning" />
                        <StatCard title="Average Rate" value={`₹${avgRate.toFixed(2)}`} icon={Calculator} color="success" />
                        <StatCard title="Avg. Bill/Room" value={`₹${avgPerRoom.toFixed(2)}`} icon={Home} color="danger" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Readings</CardTitle>
                    <CardDescription>Review and apply recent electricity bills to tenants.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {electricityReadings.length > 0 ? electricityReadings.sort((a, b) => new Date(b.date) - new Date(a.date)).map(reading => {
                            const room = rooms.find(r => r.id === reading.roomId);
                            return (
                                <div key={reading.id} className="p-4 bg-slate-800/50 rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 border border-white/10">
                                    <div>
                                        <p className="font-bold text-lg">{room?.name || 'Unknown Room'}</p>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300 mt-1">
                                            <span><span className="font-semibold">Units:</span> {reading.unitsConsumed}</span>
                                            <span><span className="font-semibold">Rate:</span> ₹{reading.ratePerUnit}/unit</span>
                                            <span className="text-amber-400 font-bold"><span className="font-semibold">Total:</span> ₹{reading.totalAmount}</span>
                                            <span><span className="font-semibold">Date:</span> {new Date(reading.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {reading.applied ? (
                                            <Button variant="ghost" disabled className="text-green-400">Applied</Button>
                                        ) : (
                                            <Button onClick={() => handleApplyBill(reading.id)}>Apply Bill</Button>
                                        )}
                                        <Button variant="destructive_outline" size="icon" className="h-9 w-9" onClick={() => setReadingToDelete(reading)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p className="text-center text-slate-400 py-8">No electricity readings found. Click "Add Reading" to start.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Add New Electricity Reading</DialogTitle>
                        <DialogDescription>Enter the meter details for a room in {activeProperty.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="roomId" className="text-right">Room</Label>
                            <select id="roomId" name="roomId" value={newReading.roomId} onChange={handleInputChange} className="col-span-3 bg-slate-800 border-slate-600 rounded p-2">
                                <option value="">Select a Room</option>
                                {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unitsConsumed" className="text-right">Units Consumed</Label>
                            <Input id="unitsConsumed" name="unitsConsumed" type="number" value={newReading.unitsConsumed} onChange={handleInputChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="ratePerUnit" className="text-right">Rate per Unit (₹)</Label>
                            <Input id="ratePerUnit" name="ratePerUnit" type="number" value={newReading.ratePerUnit} onChange={handleInputChange} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalAmount" className="text-right">Total Amount (₹)</Label>
                            <Input id="totalAmount" name="totalAmount" type="number" value={newReading.totalAmount} readOnly className="col-span-3 bg-slate-800" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date</Label>
                            <Input id="date" name="date" type="date" value={newReading.date} onChange={handleInputChange} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddReading}>Add Reading</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!readingToDelete} onOpenChange={() => setReadingToDelete(null)}>
                 <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This will permanently delete the electricity reading. This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setReadingToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteReading}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
