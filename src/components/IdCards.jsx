
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { IdCard, Users, Download } from "lucide-react";
import TenantIdCard from './TenantIdCard';
import html2canvas from 'html2canvas';

const IdCardDialog = ({ isOpen, setIsOpen, tenant, ownerState, roomNo }) => {
    if (!tenant) return null;

    const handleDownload = () => {
        const cardElement = document.getElementById("tenant-id-card-printable");
        if (cardElement) {
            html2canvas(cardElement, { 
                scale: 3, 
                useCORS: true,
                backgroundColor: null,
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = `${tenant.name.replace(/ /g, '_')}_ID_Card.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-transparent border-none shadow-none sm:max-w-md p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Tenant ID Card: {tenant.name}</DialogTitle>
                    <DialogDescription>
                        This is the official ID card for {tenant.name}, residing in room {roomNo}. You can download it as an image.
                    </DialogDescription>
                </DialogHeader>
                <div id="tenant-id-card-printable" className="flex justify-center">
                    <TenantIdCard 
                        tenant={tenant} 
                        ownerState={ownerState} 
                        propertyName={ownerState.properties.find(p => p.id === ownerState.activePropertyId)?.name}
                        roomNo={roomNo}
                    />
                </div>
                <DialogFooter className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-full sm:justify-center gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function IdCards({ appState: activeProperty, setAppState: dispatch, ownerState }) {
    const { tenants = [], rooms = [] } = activeProperty;
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    const handleGenerateIdCard = (tenant) => {
        setSelectedTenant(tenant);
        setIsIdCardModalOpen(true);
    };
    
    const getRoomForTenant = (roomId) => rooms.find(r => r.id === roomId)?.name;

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>Tenant ID Cards</CardTitle>
                    <CardDescription>Generate and download official ID cards for your tenants.</CardDescription>
                </CardHeader>
                <CardContent>
                    {tenants.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-lg">
                            <Users className="mx-auto h-12 w-12 text-slate-500"/>
                            <h3 className="mt-2 text-lg font-medium">No Tenants Found</h3>
                            <p className="mt-1 text-sm text-slate-400">Add tenants to generate their ID cards.</p>
                        </div>
                    ) : (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tenants.map(tenant => {
                                const roomName = getRoomForTenant(tenant.roomId);
                                return (
                                <div key={tenant.id} className="bg-slate-800/50 border border-white/10 rounded-lg p-4 flex flex-col items-center text-center shadow-md hover:shadow-indigo-500/20 transition-all duration-300">
                                    <Avatar className="w-24 h-24 mb-4 border-4 border-slate-700">
                                        <AvatarImage src={tenant.profilePhotoUrl} alt={tenant.name} />
                                        <AvatarFallback className="text-3xl">{tenant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-bold text-xl">{tenant.name}</p>
                                    <p className="text-sm text-indigo-300 font-medium">{roomName || 'No Room Assigned'}</p>
                                    <p className="text-sm text-slate-400 mt-1">{tenant.phone}</p>
                                    <Button 
                                        onClick={() => handleGenerateIdCard(tenant)} 
                                        className="mt-5 w-full"
                                    >
                                        <IdCard className="mr-2 h-4 w-4" /> View ID Card
                                    </Button>
                                </div>
                            )})}
                        </div>
                    )}
                </CardContent>
            </Card>

            {isIdCardModalOpen && 
                <IdCardDialog 
                    isOpen={isIdCardModalOpen} 
                    setIsOpen={setIsIdCardModalOpen} 
                    tenant={selectedTenant} 
                    ownerState={ownerState}
                    roomNo={getRoomForTenant(selectedTenant.roomId)}
                />
            }
        </div>
    );
}
