
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { IdCard, Users, Download } from "lucide-react";
import TenantIdCard from './TenantIdCard';
import html2canvas from 'html2canvas';

const IdCardDialog = ({ isOpen, setIsOpen, tenant, ownerState }) => {
    if (!tenant) return null;

    const handleDownload = () => {
        const cardElement = document.getElementById("tenant-id-card-printable");
        if (cardElement) {
            html2canvas(cardElement, { 
                scale: 3, // Higher scale for better quality
                useCORS: true, // Needed for external images
                backgroundColor: null, // Use element's background
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><IdCard /> Tenant ID Card</DialogTitle>
                </DialogHeader>
                <div id="tenant-id-card-printable" className="py-4 flex justify-center">
                    <TenantIdCard 
                        tenant={tenant} 
                        ownerState={ownerState} 
                        propertyName={ownerState.defaults?.propertyName}
                    />
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                    <Button onClick={handleDownload}><Download className="mr-2 h-4 w-4" /> Download</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function IdCards({ appState: activeProperty, setAppState: setOwnerState, ownerState }) {
    const { tenants = [] } = activeProperty;
    const [isIdCardModalOpen, setIsIdCardModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        if (!tenants || tenants.length === 0) return;

        let needsUpdate = false;
        const updatedTenants = tenants.map(tenant => {
            if (!tenant.tenantId) {
                needsUpdate = true;
                return { ...tenant, tenantId: Math.floor(100000 + Math.random() * 900000).toString() };
            }
            return tenant;
        });

        if (needsUpdate) {
            setOwnerState(prevOwnerState => {
                const newOwnerState = { ...prevOwnerState };
                const propertyIndex = newOwnerState.properties.findIndex(p => p.id === activeProperty.id);

                if (propertyIndex !== -1) {
                    newOwnerState.properties[propertyIndex] = {
                        ...newOwnerState.properties[propertyIndex],
                        tenants: updatedTenants,
                    };
                }
                return newOwnerState;
            });
        }
    }, [tenants, setOwnerState, activeProperty.id]);

    const handleGenerateIdCard = (tenant) => {
        setSelectedTenant(tenant);
        setIsIdCardModalOpen(true);
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold font-headline">Tenant ID Cards</h2>
                <p className="text-muted-foreground">Generate and download official ID cards for your tenants.</p>
                </div>
            </div>

            {tenants.length === 0 ? (
                <Card className="glass-card text-center text-muted-foreground py-16 border-2 border-dashed rounded-2xl">
                    <Users className="mx-auto h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Tenants Found</h3>
                    <p>Add tenants to generate their ID cards.</p>
                </Card>
            ) : (
                <Card className="glass-card">
                    <CardHeader>
                        <CardTitle>All Tenants</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {tenants.map(tenant => (
                                <div key={tenant.id} className="bg-background/50 border rounded-lg p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow duration-200">
                                    <Avatar className="w-20 h-20 mb-3 border-2 border-primary/50">
                                        <AvatarImage src={tenant.profilePhotoUrl} alt={tenant.name} />
                                        <AvatarFallback className="text-2xl">{tenant.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold text-lg">{tenant.name}</p>
                                    <p className="text-sm text-muted-foreground">Room: {tenant.unitNo}</p>
                                    <p className="text-sm text-muted-foreground">{tenant.phone}</p>
                                    <Button 
                                        onClick={() => handleGenerateIdCard(tenant)} 
                                        className="mt-4 w-full btn-gradient-glow"
                                    >
                                        <IdCard className="mr-2 h-4 w-4" /> View ID Card
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {isIdCardModalOpen && 
                <IdCardDialog 
                    isOpen={isIdCardModalOpen} 
                    setIsOpen={setIsIdCardModalOpen} 
                    tenant={selectedTenant} 
                    ownerState={ownerState}
                />
            }
        </div>
    );
}
