
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Edit, Trash2, BedDouble, Users, DollarSign, KeyRound, Building, CheckSquare, XSquare } from 'lucide-react';

export default function Rooms({ appState: activeProperty, setAppState: dispatch }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [roomToDelete, setRoomToDelete] = useState(null);
    const [newRoomData, setNewRoomData] = useState({ name: '', capacity: '', rent: '', rentSharing: false });
    const { toast } = useToast();

    const rooms = activeProperty.rooms || [];
    const tenants = activeProperty.tenants || [];

    const openModal = (room) => {
        if (room) {
            setEditingRoom(room);
            setNewRoomData(room);
        } else {
            setEditingRoom(null);
            setNewRoomData({ name: '', capacity: '', rent: '', rentSharing: false });
        }
        setIsModalOpen(true);
    };

    const handleSaveRoom = () => {
        if (!newRoomData.name || !newRoomData.capacity || !newRoomData.rent) {
            toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all fields." });
            return;
        }

        const roomPayload = {
            ...newRoomData,
            capacity: Number(newRoomData.capacity),
            rent: Number(newRoomData.rent),
        };

        if (editingRoom) {
            dispatch({ 
                type: 'UPDATE_ROOM', 
                payload: { ...editingRoom, ...roomPayload } 
            });
        } else {
            dispatch({ 
                type: 'ADD_ROOM', 
                payload: { ...roomPayload, id: `room_${Date.now()}` } 
            });
        }

        toast({ title: "Success", description: `Room ${editingRoom ? 'updated' : 'added'} successfully.` });
        setIsModalOpen(false);
    };

    const handleDeleteConfirmation = () => {
        if (!roomToDelete) return;
        
        dispatch({ 
            type: 'DELETE_ROOM', 
            payload: { id: roomToDelete.id } 
        });
        
        toast({ variant: "destructive", title: "Deleted", description: "The room has been deleted." });
        setRoomToDelete(null);
    };
    
    const getOccupancy = (roomId) => tenants.filter(t => t.roomId === roomId).length;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Rooms</CardTitle>
                        <CardDescription>Add, edit, or view rooms in {activeProperty.name}.</CardDescription>
                    </div>
                    <Button onClick={() => openModal(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add Room</Button>
                </CardHeader>
                <CardContent>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rooms.map(room => {
                           const occupancy = getOccupancy(room.id);
                           const isFull = occupancy >= room.capacity;
                            return (
                                <Card key={room.id} className={`bg-slate-800/50 border-white/10 ${isFull ? 'border-yellow-500/50' : ''}`}>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg">{room.name}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal(room)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="destructive_outline" size="icon" className="h-8 w-8" onClick={() => setRoomToDelete(room)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><Users/>Capacity</span> <span className={`font-semibold ${isFull ? 'text-yellow-400' : 'text-white'}`}>{occupancy} / {room.capacity}</span></div>
                                        <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><DollarSign/>Rent</span> <span className="font-semibold">₹{room.rent}/month</span></div>
                                        <div className="flex justify-between items-center"><span className="text-slate-400 flex items-center gap-2"><KeyRound/>Sharing</span> {room.rentSharing ? <CheckSquare className="text-green-400"/> : <XSquare className="text-red-400"/>}</div>
                                        {isFull && <p className="text-yellow-400 text-xs text-center font-bold">Room is Full</p>}
                                    </CardContent>
                                </Card>
                            );
                        })}
                   </div>
                     {rooms.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
                            <Building className="mx-auto h-12 w-12 text-slate-500"/>
                            <h3 className="mt-2 text-lg font-medium text-white">No Rooms Found</h3>
                            <p className="mt-1 text-sm text-slate-400">Get started by adding a new room to your property.</p>
                            <div className="mt-6">
                                <Button onClick={() => openModal(null)}><PlusCircle className="mr-2 h-4 w-4" /> Add Your First Room</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Room Name/No.</Label>
                            <Input id="name" value={newRoomData.name} onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})} className="col-span-3" placeholder="e.g., Room 101, Hall A"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="capacity" className="text-right">Capacity</Label>
                            <Input id="capacity" type="number" value={newRoomData.capacity} onChange={(e) => setNewRoomData({...newRoomData, capacity: e.target.value})} className="col-span-3" placeholder="e.g., 2"/>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rent" className="text-right">Total Rent (₹)</Label>
                            <Input id="rent" type="number" value={newRoomData.rent} onChange={(e) => setNewRoomData({...newRoomData, rent: e.target.value})} className="col-span-3" placeholder="e.g., 20000"/>
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-2">
                             <input type="checkbox" id="rentSharing" checked={newRoomData.rentSharing} onChange={(e) => setNewRoomData({...newRoomData, rentSharing: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <Label htmlFor="rentSharing">Enable rent sharing between tenants</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveRoom}>Save Room</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <Dialog open={!!roomToDelete} onOpenChange={() => setRoomToDelete(null)}>
                 <DialogContent className="bg-slate-900 border-slate-700 text-white">
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>This will permanently delete the room "{roomToDelete?.name}". This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoomToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDeleteConfirmation}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
