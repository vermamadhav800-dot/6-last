
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Eye } from "lucide-react";

export default function PendingApprovals({ ownerState, setOwnerState, ownerId }) {
  const { toast } = useToast();

  const handleApproval = (payment, status) => {
    setOwnerState(prev => {
        const ownerData = prev[ownerId] || {};
        const updatedApprovals = ownerData.pendingApprovals.filter(p => p.id !== payment.id);

        if (status === 'approved') {
            const newPayment = {
                ...payment,
                status: 'approved',
                id: `pay_${Date.now()}`,
            };
            return {
                ...prev,
                [ownerId]: {
                    ...ownerData,
                    payments: [...(ownerData.payments || []), newPayment],
                    pendingApprovals: updatedApprovals,
                }
            };
        } else { // Rejected
            return {
                ...prev,
                [ownerId]: {
                    ...ownerData,
                    pendingApprovals: updatedApprovals,
                }
            };
        }
    });

    toast({
        title: `Payment ${status}`,
        description: `The payment of ₹${payment.amount} has been ${status}.`
    });
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Pending Payment Approvals</CardTitle>
            <CardDescription>Review and approve or reject tenant payment submissions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {(ownerState.pendingApprovals || []).filter(p => p.type === 'payment').map(payment => {
                    const tenant = ownerState.tenants.find(t => t.id === payment.tenantId);
                    return (
                        <li key={payment.id} className="p-4 bg-muted rounded-lg flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="font-semibold">₹{payment.amount.toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground">Submitted by: {tenant?.name || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">{new Date(payment.date).toLocaleString()}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 md:mt-0">
                                <a href={payment.screenshotUrl} target="_blank" rel="noopener noreferrer">
                                  <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />View Screenshot</Button>
                                </a>
                                <Button variant="outline" size="sm" className="bg-green-500 text-white" onClick={() => handleApproval(payment, 'approved')}><Check className="mr-2 h-4 w-4" />Approve</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleApproval(payment, 'rejected')}><X className="mr-2 h-4 w-4" />Reject</Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
            {(ownerState.pendingApprovals || []).filter(p => p.type === 'payment').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No pending payment approvals.</p>
            )}
        </CardContent>
    </Card>
  );
}
