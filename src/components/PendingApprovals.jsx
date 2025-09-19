
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useMemo } from "react";

export default function PendingApprovals({ ownerState, setAppState, ownerId }) { 
  const { toast } = useToast();

  const tenantToPropertyMap = useMemo(() => {
    const map = new Map();
    ownerState.properties?.forEach(p => {
        (p.tenants || []).forEach(t => {
            map.set(t.id, p.id);
        });
    });
    return map;
  }, [ownerState.properties]);

  const handleApproval = (payment, status) => {
    // setAppState is actually the setOwnerState function from MainApp
    // It expects an updater function that receives the current owner's state
    setAppState(prevOwnerState => {
        const updatedApprovals = (prevOwnerState.pendingApprovals || []).filter(p => p.id !== payment.id);

        if (status === 'approved') {
            const propertyId = tenantToPropertyMap.get(payment.tenantId);
            if (!propertyId) {
                toast({ variant: "destructive", title: "Error", description: "Could not find the property for this tenant." });
                return prevOwnerState; // Return original state if property not found
            }

            const newPayment = {
                ...payment,
                status: 'approved',
                id: `pay_${Date.now()}`,
            };

            const updatedProperties = prevOwnerState.properties.map(p => {
                if (p.id === propertyId) {
                    return {
                        ...p,
                        payments: [...(p.payments || []), newPayment]
                    };
                }
                return p;
            });

            // Return the new, correct owner state object
            return {
                ...prevOwnerState,
                properties: updatedProperties,
                pendingApprovals: updatedApprovals,
            };
        } else { // Rejected
            // Return the new, correct owner state object
            return {
                ...prevOwnerState,
                pendingApprovals: updatedApprovals,
            };
        }
    });

    toast({
        title: `Payment ${status}`,
        description: `The payment of ₹${payment.amount} has been ${status}.`
    });
  };
  
  const allTenants = ownerState.properties?.flatMap(p => p.tenants || []) || [];

  const pendingPayments = (ownerState.pendingApprovals || []).filter(p => p.type === 'payment');

  return (
    <Card>
        <CardHeader>
            <CardTitle>Pending Payment Approvals</CardTitle>
            <CardDescription>Review and approve or reject tenant payment submissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {pendingPayments.map(payment => {
                    const tenant = allTenants.find(t => t.id === payment.tenantId);
                    return (
                        <li key={payment.id} className="p-4 bg-slate-800/50 rounded-lg space-y-4 border border-white/10">
                           <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-xl">₹{payment.amount.toLocaleString()}</p>
                                    <p className="text-sm text-slate-300">Submitted by: {tenant?.name || 'Unknown Tenant'}</p>
                                    <p className="text-xs text-slate-400">{new Date(payment.date).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <Button variant="outline" size="sm" className="bg-green-600 hover:bg-green-700 text-white border-green-700" onClick={() => handleApproval(payment, 'approved')}><Check className="mr-2 h-4 w-4" />Approve</Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleApproval(payment, 'rejected')}><X className="mr-2 h-4 w-4" />Reject</Button>
                                </div>
                           </div>

                            {payment.screenshotUrl && (
                                <div className="pt-4 border-t border-white/10">
                                    <a href={payment.screenshotUrl} target="_blank" rel="noopener noreferrer" title="Click to view full image">
                                        <img src={payment.screenshotUrl} alt="Payment Screenshot" className="rounded-lg w-full max-h-96 object-contain cursor-pointer transition-transform hover:scale-105" />
                                    </a>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            {pendingPayments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No pending payment approvals.</p>
            )}
        </CardContent>
    </Card>
  );
}
