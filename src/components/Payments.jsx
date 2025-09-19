
"use client";

import { useState } from 'react';
import { Plus, Trash2, CheckCircle, Clock, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from './StatCard';
import { useToast } from "@/hooks/use-toast";
import { differenceInDays, parseISO } from 'date-fns';
import RentReceipt from './RentReceipt';
import PaymentGateway from './PaymentGateway'; // Import the new component


export default function Payments({ appState, setAppState }) {
  const { payments, tenants, rooms, electricity, ownerProfile } = appState;
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const { toast } = useToast();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false);


  const confirmDeletePayment = (payment) => {
    setPaymentToDelete(payment);
    setIsDeleteAlertOpen(true);
  };

  const handleDeletePayment = () => {
    if (!paymentToDelete) return;
    setAppState(prev => ({ ...prev, payments: prev.payments.filter(p => p.id !== paymentToDelete.id) }));
    toast({ title: "Success", description: "Payment record deleted." });
    setIsDeleteAlertOpen(false);
    setPaymentToDelete(null);
  };

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
  });
  const thisMonthCollection = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);

  const totalPending = tenants.reduce((totalPending, tenant) => {
    const room = rooms.find(r => r.number === tenant.unitNo);
    if (!room) return totalPending;

    const monthlyCharges = (tenant.otherCharges || [])
      .filter(c => new Date(c.date).getMonth() === thisMonth && new Date(c.date).getFullYear() === thisYear)
      .reduce((sum, c) => sum + c.amount, 0);

    const totalDue = tenant.rentAmount + monthlyCharges;

    const paidThisMonth = payments
      .filter(p => p.tenantId === tenant.id && new Date(p.date).getMonth() === thisMonth && new Date(p.date).getFullYear() === thisYear)
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = totalDue - paidThisMonth;
    
    return totalPending + (pendingAmount > 0 ? pendingAmount : 0);
  }, 0);


  if (selectedReceipt) {
    return <RentReceipt receiptDetails={selectedReceipt} onBack={() => setSelectedReceipt(null)} appState={appState} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold font-headline">Payment Management</h2>
          <p className="text-muted-foreground">Track all incoming rent payments and manage payment gateway.</p>
        </div>
        <Dialog open={isPaymentGatewayOpen} onOpenChange={setIsPaymentGatewayOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> View Payment Gateway</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
                <DialogTitle>Payment Gateway</DialogTitle>
                <DialogDescription>
                  Tenants can use this information to pay their rent.
                </DialogDescription>
            </DialogHeader>
            <PaymentGateway ownerProfile={ownerProfile} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Collected" value={`₹${totalCollected.toLocaleString('en-IN', {minimumFractionDigits: 2})}`} icon={CheckCircle} color="success" />
        <StatCard title="Pending Amount (This Month)" value={`₹${totalPending > 0 ? totalPending.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}`} icon={Clock} color="warning" />
        <StatCard title="Collected This Month" value={`₹${thisMonthCollection.toLocaleString('en-IN', {minimumFractionDigits: 2})}`} icon={Calendar} color="primary" />
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No payments recorded yet.</TableCell>
                </TableRow>
              ) : (
                payments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(payment => {
                  const tenant = tenants.find(t => t.id === payment.tenantId);
                  if (!tenant) return null;
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{tenant?.name || "Unknown Tenant"} (Room {tenant?.unitNo})</TableCell>
                      <TableCell>₹{payment.amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">{payment.method}</span></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedReceipt({ payment, tenant })}>
                            <FileText className="mr-2 h-4 w-4" /> Receipt
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDeletePayment(payment)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this payment record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPaymentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePayment}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
