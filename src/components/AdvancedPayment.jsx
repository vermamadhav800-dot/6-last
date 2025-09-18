"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, IndianRupee, Calendar, FileText, QrCode, 
  Smartphone, Building2, CheckCircle, AlertCircle, Clock,
  Download, Send, Plus, X, Zap, Shield, Star
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import PremiumFeature from './PremiumFeature';
import jsPDF from 'jspdf';

const AdvancedPayment = ({ tenant, ownerState, setOwnerState, currentPlan = 'free', onUpgrade }) => {
  const { toast } = useToast();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'cash',
    reference: '',
    notes: '',
    dueDate: '',
    category: 'rent',
    isRecurring: false,
    recurringType: 'monthly'
  });
  const [approvalAmount, setApprovalAmount] = useState('');
  const [approvalScreenshot, setApprovalScreenshot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const payments = ownerState.payments || [];
  const rooms = ownerState.rooms || [];
  const electricity = ownerState.electricity || [];
  const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
  const totalPaid = tenantPayments.reduce((sum, p) => sum + p.amount, 0);
  const lastPayment = tenantPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const defaults = ownerState.defaults || {};

  const paymentMethods = [
    { value: 'cash', label: 'Cash', icon: IndianRupee, color: 'text-green-600' },
    { value: 'upi', label: 'UPI', icon: Smartphone, color: 'text-blue-600' },
    { value: 'bank', label: 'Bank Transfer', icon: Building2, color: 'text-purple-600' },
    { value: 'card', label: 'Card', icon: CreditCard, color: 'text-orange-600' },
    { value: 'cheque', label: 'Cheque', icon: FileText, color: 'text-gray-600' }
  ];

  const paymentCategories = [
    { value: 'rent', label: 'Rent', color: 'bg-blue-100 text-blue-800' },
    { value: 'electricity', label: 'Electricity', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-green-100 text-green-800' },
    { value: 'security', label: 'Security Deposit', color: 'bg-purple-100 text-purple-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handlePaymentSubmit = async () => {
    if (!paymentData.amount || isNaN(paymentData.amount)) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newPayment = {
      id: Date.now().toString(),
      tenantId: tenant.id,
      amount: parseFloat(paymentData.amount),
      method: paymentData.method,
      reference: paymentData.reference,
      notes: paymentData.notes,
      category: paymentData.category,
      dueDate: paymentData.dueDate || new Date().toISOString(),
      isRecurring: paymentData.isRecurring,
      recurringType: paymentData.recurringType,
      status: 'completed',
      date: new Date().toISOString(),
      processedAt: new Date().toISOString()
    };

    setOwnerState(prev => ({
      ...prev,
      payments: [...(prev.payments || []), newPayment]
    }));

    toast({
      title: "Payment Processed",
      description: `Payment of ₹${paymentData.amount} has been recorded successfully.`,
    });

    setShowPaymentModal(false);
    setPaymentData({
      amount: '',
      method: 'cash',
      reference: '',
      notes: '',
      dueDate: '',
      category: 'rent',
      isRecurring: false,
      recurringType: 'monthly'
    });
    setIsProcessing(false);
  };

  const generateReceipt = (payment) => {
    try {
      const doc = new jsPDF();
      const propertyName = ownerState?.defaults?.propertyName || 'Property';
      const propertyAddress = ownerState?.defaults?.propertyAddress || '';
      const ownerUpi = ownerState?.defaults?.upiId || '';
      const title = 'Payment Receipt';

      // Header
      doc.setFontSize(16);
      doc.text(title, 105, 16, { align: 'center' });
      doc.setFontSize(11);
      doc.text(propertyName, 105, 24, { align: 'center' });
      if (propertyAddress) doc.text(propertyAddress, 105, 30, { align: 'center' });

      // Separator
      doc.setLineWidth(0.5);
      doc.line(10, 34, 200, 34);

      // Details
      let y = 44;
      const addRow = (label, value) => {
        doc.setFontSize(11);
        doc.text(String(label), 14, y);
        doc.text(':', 60, y);
        const text = value == null ? '' : String(value);
        doc.text(text, 64, y);
        y += 8;
      };

      addRow('Receipt ID', payment.id || '-');
      addRow('Tenant Name', tenant?.name || '-');
      addRow('Room', tenant?.unitNo || tenant?.room || '-');
      addRow('Date', payment.date ? format(new Date(payment.date), 'dd MMM yyyy, hh:mm a') : format(new Date(), 'dd MMM yyyy, hh:mm a'));
      addRow('Amount (INR)', `₹${Number(payment.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      addRow('Method', String(payment.method || 'N/A').toUpperCase());
      if (payment.reference) addRow('Reference', payment.reference);
      if (ownerUpi) addRow('Paid To (UPI)', ownerUpi);

      // Notes
      if (payment.notes) {
        y += 2;
        doc.setFontSize(11);
        doc.text('Notes:', 14, y);
        y += 6;
        doc.setFontSize(10);
        const split = doc.splitTextToSize(String(payment.notes), 180);
        doc.text(split, 14, y);
        y += split.length * 5 + 2;
      }

      // Footer
      y += 6;
      doc.setLineWidth(0.2);
      doc.line(10, y, 200, y);
      y += 8;
      doc.setFontSize(9);
      doc.text('This is a system generated receipt.', 105, y, { align: 'center' });

      const filename = `receipt-${tenant?.name?.replace(/\s+/g, '_') || 'tenant'}-${(payment.id || Date.now()).toString()}.pdf`;
      doc.save(filename);
      toast({ title: 'Receipt Downloaded', description: 'Your payment receipt has been downloaded as PDF.' });
    } catch (e) {
      console.error('Receipt generation failed:', e);
      toast({ variant: 'destructive', title: 'Failed to generate receipt', description: 'Please try again.' });
    }
  };

  const getMethodIcon = (method) => {
    const methodInfo = paymentMethods.find(m => m.value === method);
    return methodInfo ? methodInfo.icon : CreditCard;
  };

  const getMethodColor = (method) => {
    const methodInfo = paymentMethods.find(m => m.value === method);
    return methodInfo ? methodInfo.color : 'text-gray-600';
  };

  const getCategoryColor = (category) => {
    const categoryInfo = paymentCategories.find(c => c.value === category);
    return categoryInfo ? categoryInfo.color : 'bg-gray-100 text-gray-800';
  };

  // Compute current month pending including electricity share
  const today = new Date();
  const m = today.getMonth();
  const y = today.getFullYear();
  const room = rooms.find(r => r.number === tenant.unitNo);
  const roomElectricityBill = room ? electricity
    .filter(e => e.roomId === room.id && new Date(e.date).getMonth() === m && new Date(e.date).getFullYear() === y)
    .reduce((sum, e) => sum + (e.totalAmount || 0), 0) : 0;
  const tenantsInRoom = ownerState.tenants?.filter(t => t.unitNo === tenant.unitNo) || [];
  const electricityShare = tenantsInRoom.length > 0 ? roomElectricityBill / tenantsInRoom.length : 0;
  const totalDueThisMonth = (tenant.rentAmount || 0) + electricityShare;
  const paidThisMonth = tenantPayments
    .filter(p => new Date(p.date).getMonth() === m && new Date(p.date).getFullYear() === y)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingThisMonth = Math.max(0, totalDueThisMonth - paidThisMonth);

  const handleScreenshotChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setApprovalScreenshot(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmitApproval = () => {
    const amountNum = parseFloat(approvalAmount);
    if (!amountNum || isNaN(amountNum) || !approvalScreenshot) {
      toast({ variant: 'destructive', title: 'Missing details', description: 'Enter amount and upload payment screenshot.' });
      return;
    }
    const newApproval = {
      id: Date.now().toString(),
      tenantId: tenant.id,
      amount: amountNum,
      date: new Date().toISOString(),
      screenshotUrl: approvalScreenshot
    };
    setOwnerState(prev => ({
      ...prev,
      pendingApprovals: [...(prev.pendingApprovals || []), newApproval],
      notifications: [
        ...(prev.notifications || []),
        {
          id: `pay-${newApproval.id}`,
          tenantId: tenant.id,
          message: `${tenant.name} submitted a payment for approval (₹${amountNum.toLocaleString()}).`,
          createdAt: new Date().toISOString(),
          isRead: false
        }
      ]
    }));
    toast({ title: 'Submitted for Approval', description: 'Your payment will be verified by the owner.' });
    setShowApprovalModal(false);
    setApprovalAmount('');
    setApprovalScreenshot(null);
  };

  return (
    <div className="space-y-6">
      {/* Pending Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending This Month</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">₹{pendingThisMonth.toLocaleString(undefined,{maximumFractionDigits:2})}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Electricity Share</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">₹{electricityShare.toFixed(2)}</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Due</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">₹{totalDueThisMonth.toFixed(2)}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Paid</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">₹{totalPaid.toLocaleString()}</p>
              </div>
              <IndianRupee className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Payments</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tenantPayments.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Last Payment</p>
                <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {lastPayment ? format(new Date(lastPayment.date), 'MMM dd') : 'None'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setShowPaymentModal(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment History</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400 hidden sm:table-cell">Method</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400 hidden md:table-cell">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenantPayments.length > 0 ? (
                  tenantPayments.map((payment) => {
                    const MethodIcon = getMethodIcon(payment.method);
                    return (
                      <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                          {format(new Date(payment.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="p-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="p-4 text-sm hidden sm:table-cell">
                          <div className="flex items-center space-x-2">
                            <MethodIcon className={`w-4 h-4 ${getMethodColor(payment.method)}`} />
                            <span className="capitalize">{payment.method}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm hidden md:table-cell">
                          <Badge className={getCategoryColor(payment.category)}>
                            {paymentCategories.find(c => c.value === payment.category)?.label || payment.category}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">
                          <Button variant="outline" size="sm" onClick={() => generateReceipt(payment)}>
                            <Download className="w-4 h-4 mr-1" /> Receipt
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 dark:text-slate-400">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Submit for Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-900 text-white rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl max-h-[85vh] flex flex-col">
              <div className="p-6 space-y-4 overflow-auto">
                <h3 className="text-xl font-bold">Submit Payment for Approval</h3>
                <div>
                  <Label className="text-slate-300">Amount Paid (₹)</Label>
                  <Input value={approvalAmount} onChange={(e) => setApprovalAmount(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" placeholder="e.g., 5000" />
                </div>
                <div>
                  <Label className="text-slate-300">Upload Screenshot</Label>
                  <Input type="file" accept="image/*" onChange={handleScreenshotChange} className="bg-slate-800 border-slate-700 text-white mt-1" />
                  {approvalScreenshot && <img src={approvalScreenshot} alt="Preview" className="mt-3 w-full max-h-64 object-contain rounded-md border" />}
                </div>
              </div>
              <div className="p-4 border-t border-slate-800 flex gap-3">
                  <Button className="flex-1 btn-gradient-glow" onClick={handleSubmitApproval}>Submit</Button>
                  <Button className="flex-1" variant="outline" onClick={() => setShowApprovalModal(false)}>Cancel</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advanced Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl border dark:border-slate-700 shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="p-6 space-y-4 overflow-auto">
                <h3 className="text-xl font-bold">Record a Payment</h3>
                {(defaults.upiId || defaults.qrCodeUrl) && (
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-start gap-4">
                      {defaults.qrCodeUrl && (
                        <img src={defaults.qrCodeUrl} alt="UPI QR" className="w-24 h-24 rounded-md border object-contain" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-slate-500">Pay via UPI</div>
                        <div className="font-semibold flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-blue-500" /> {defaults.upiId || '—'}
                        </div>
                        {defaults.upiId && (
                          <div className="mt-2">
                            <a
                              href={`upi://pay?pa=${encodeURIComponent(defaults.upiId)}&cu=INR&pn=${encodeURIComponent(defaults.propertyName || 'Rent')}&am=${encodeURIComponent(paymentData.amount || tenant.rentAmount || '')}`}
                              className="inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-sm"
                            >
                              <Smartphone className="w-4 h-4" /> Pay with UPI
                            </a>
                          </div>
                        )}
                        <p className="text-xs text-slate-500 mt-2">After paying, submit for approval with a screenshot.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input value={paymentData.amount} onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })} placeholder="e.g., 5000" />
                  </div>
                  <div>
                    <Label>Method</Label>
                    <Select value={paymentData.method} onValueChange={(v) => setPaymentData({ ...paymentData, method: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea value={paymentData.notes} onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })} placeholder="Optional notes" />
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                <Button className="flex-1 btn-gradient-glow" onClick={() => {
                  setShowPaymentModal(false);
                  setShowApprovalModal(true);
                  if (!approvalAmount) setApprovalAmount(paymentData.amount || String(tenant.rentAmount || ''));
                }}>
                  Submit for Approval
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedPayment;
