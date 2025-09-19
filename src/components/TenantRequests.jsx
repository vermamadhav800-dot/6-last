
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Wrench, Clock, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function TenantRequests({ tenant, property, setAppState, ownerId }) {
  const [newRequest, setNewRequest] = useState('');
  const { toast } = useToast();

  const maintenanceRequests = useMemo(() => {
    return (property.maintenanceRequests || []).filter(
      req => req.tenantId === tenant.id
    ).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [property.maintenanceRequests, tenant.id]);

  const handleSubmitRequest = () => {
    if (newRequest.trim() === '') {
      toast({
        variant: 'destructive',
        title: 'Empty Request',
        description: 'Please describe your request before submitting.',
      });
      return;
    }

    const request = {
      id: `req_${Date.now()}`,
      tenantId: tenant.id,
      tenantName: tenant.name,
      propertyId: property.id,
      date: new Date().toISOString(),
      request: newRequest,
      status: 'Pending', // Status can be Pending, In Progress, Resolved
    };
    
    setAppState(prevAppState => {
        const ownerData = prevAppState[ownerId];
        if (!ownerData) return prevAppState;

        const updatedProperties = ownerData.properties.map(p => {
            if (p.id === property.id) {
                return {
                    ...p,
                    maintenanceRequests: [...(p.maintenanceRequests || []), request]
                };
            }
            return p;
        });
        
        const newOwnerState = {
            ...ownerData,
            properties: updatedProperties
        };

        return {
            ...prevAppState,
            [ownerId]: newOwnerState
        };
    });

    toast({
      title: 'Request Submitted',
      description: 'Your maintenance request has been sent to the owner.',
    });

    setNewRequest('');
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-500"><Clock className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'In Progress':
        return <Badge variant="outline" className="text-blue-600 border-blue-500"><Wrench className="w-3 h-3 mr-1" />{status}</Badge>;
      case 'Resolved':
        return <Badge variant="outline" className="text-green-600 border-green-500"><CheckCircle className="w-3 h-3 mr-1" />{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>New Maintenance Request</CardTitle>
          <CardDescription>Have an issue? Let the owner know.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the issue in detail (e.g., 'Kitchen sink is leaking under the cabinet')."
            value={newRequest}
            onChange={(e) => setNewRequest(e.target.value)}
            rows={5}
          />
          <Button onClick={handleSubmitRequest} className="w-full">
            <Send className="mr-2 h-4 w-4" /> Submit Request
          </Button>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Request History</CardTitle>
           <CardDescription>Track the status of your submitted requests here.</CardDescription>
        </CardHeader>
        <CardContent>
           {maintenanceRequests.length > 0 ? (
            <ul className="space-y-4">
              {maintenanceRequests.map(req => (
                <li key={req.id} className="p-4 bg-muted rounded-lg flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{req.request}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(req.date), { addSuffix: true })}
                    </p>
                  </div>
                  {getStatusBadge(req.status)}
                </li>
              ))}
            </ul>
          ) : (
             <div className="text-center py-12 text-muted-foreground">
                <Wrench className="mx-auto h-12 w-12 opacity-50 mb-4" />
                <p>You haven't submitted any requests yet.</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
