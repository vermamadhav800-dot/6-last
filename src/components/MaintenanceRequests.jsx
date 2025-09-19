
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Wrench, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_MAP = {
  Pending: { icon: Clock, color: 'amber', label: 'Pending' },
  'In Progress': { icon: Wrench, color: 'blue', label: 'In Progress' },
  Resolved: { icon: CheckCircle, color: 'green', label: 'Resolved' },
};

export default function MaintenanceRequests({ appState, setAppState }) {
  const [filter, setFilter] = useState('All');

  const maintenanceRequests = useMemo(() => {
    const allRequests = appState.properties?.flatMap(p => 
        (p.maintenanceRequests || []).map(req => ({ ...req, propertyName: p.name }))
    ) || [];

    const sortedRequests = allRequests.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filter === 'All') {
      return sortedRequests;
    }
    return sortedRequests.filter(req => req.status === filter);
  }, [appState.properties, filter]);

  const handleStatusChange = (requestId, propertyId, newStatus) => {
    setAppState(currentAppState => {
      const updatedProperties = currentAppState.properties.map(p => {
        if (p.id === propertyId) {
          return {
            ...p,
            maintenanceRequests: p.maintenanceRequests.map(req =>
              req.id === requestId ? { ...req, status: newStatus } : req
            ),
          };
        }
        return p;
      });

      return {
        ...currentAppState,
        properties: updatedProperties,
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
                <CardTitle>Maintenance Requests</CardTitle>
                <CardDescription>View and manage all tenant maintenance requests.</CardDescription>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
                <Button variant={filter === 'All' ? 'default' : 'outline'} onClick={() => setFilter('All')}>All</Button>
                <Button variant={filter === 'Pending' ? 'default' : 'outline'} onClick={() => setFilter('Pending')}>Pending</Button>
                <Button variant={filter === 'In Progress' ? 'default' : 'outline'} onClick={() => setFilter('In Progress')}>In Progress</Button>
                <Button variant={filter === 'Resolved' ? 'default' : 'outline'} onClick={() => setFilter('Resolved')}>Resolved</Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {maintenanceRequests.length > 0 ? (
          <ul className="space-y-4">
            {maintenanceRequests.map(req => {
              const StatusIcon = STATUS_MAP[req.status]?.icon || Wrench;
              const statusColor = STATUS_MAP[req.status]?.color || 'gray';

              return (
                <li key={req.id} className="p-4 bg-muted/50 rounded-lg border flex flex-col md:flex-row md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{req.request}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            From: <strong>{req.tenantName}</strong> at <strong>{req.propertyName}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(req.date), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge variant="outline" className={`text-${statusColor}-600 border-${statusColor}-500`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {req.status}
                        </Badge>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(req.id, req.propertyId, 'Pending')}>Mark as Pending</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(req.id, req.propertyId, 'In Progress')}>Mark as In Progress</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(req.id, req.propertyId, 'Resolved')}>Mark as Resolved</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Wrench className="mx-auto h-16 w-16 opacity-30 mb-6" />
            <p className="text-lg font-medium">No Maintenance Requests</p>
            <p>The queue is clear. Well done!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
