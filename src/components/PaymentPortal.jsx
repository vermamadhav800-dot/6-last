
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee, Upload, Send, Clock } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export default function PaymentPortal({ tenant, ownerState, setOwnerState, ownerId }) {
  const { toast } = useToast();
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  const ownerDetails = useMemo(() => ownerState?.defaults || {}, [ownerState]);

  const { totalDue, rentAmount, otherCharges, paidThisMonth } = useMemo(() => {
    if (!tenant) return { totalDue: 0, rentAmount: 0, otherCharges: 0, paidThisMonth: 0 };

    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const rentAmount = tenant.rentAmount || 0;
    
    const otherCharges = (ownerState.electricity || [])
      .filter(e => e.tenantId === tenant.id && new Date(e.date).getMonth() === thisMonth && new Date(e.date).getFullYear() === thisYear)
      .reduce((sum, e) => sum + (e.totalAmount || 0), 0);

    const totalBill = rentAmount + otherCharges;
    
    const approvedPayments = (ownerState.payments || [])
      .filter(p => p.tenantId === tenant.id && p.status === 'approved' && new Date(p.date).getMonth() === thisMonth && new Date(p.date).getFullYear() === thisYear)
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = totalBill - approvedPayments;
    
    return { 
      totalDue: pendingAmount > 0 ? pendingAmount : 0, 
      rentAmount, 
      otherCharges,
      paidThisMonth: approvedPayments
    };
  }, [tenant, ownerState]);

  const pendingPayments = useMemo(() => {
    return (ownerState.pendingApprovals || []).filter(
      p => p.tenantId === tenant.id && p.type === 'payment'
    );
  }, [ownerState, tenant.id]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpiPayment = () => {
    if (ownerDetails && ownerDetails.upiId) {
      const amount = totalDue.toFixed(2);
      const upiUrl = `upi://pay?pa=${ownerDetails.upiId}&pn=Rent%20Payment&am=${amount}&cu=INR`;
      window.location.href = upiUrl;
    } else {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Owner's UPI ID is not configured.",
      });
    }
  };

  const handleSubmitForApproval = () => {
    if (!screenshot) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please upload a payment screenshot.",
      });
      return;
    }

    const newPaymentRequest = {
      id: `pay_req_${Date.now()}`,
      tenantId: tenant.id,
      amount: totalDue,
      date: new Date().toISOString(),
      type: 'payment',
      status: 'processing',
      screenshotUrl: screenshotPreview, // In a real app, you would upload this and store the URL
    };
    
    setOwnerState(prev => {
        const ownerData = prev[ownerId] || {};
        return {
            ...prev,
            [ownerId]: {
                ...ownerData,
                pendingApprovals: [...(ownerData.pendingApprovals || []), newPaymentRequest]
            }
        }
    });

    toast({
      title: "Payment Submitted",
      description: "Your payment is now being processed by the owner.",
    });

    setScreenshot(null);
    setScreenshotPreview(null);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Pay Your Rent</span>
            <IndianRupee className="w-6 h-6 text-green-500" />
          </CardTitle>
          <CardDescription>Complete your payment using the details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Monthly Rent</span>
              <span className="font-semibold">₹{rentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Electricity & Other Charges</span>
              <span className="font-semibold">₹{otherCharges.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Paid this Month</span>
              <span className="font-semibold text-green-600">- ₹{paidThisMonth.toLocaleString()}</span>
            </div>
            <hr className="my-2 border-dashed" />
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold">Total Amount Due</span>
              <span className="font-extrabold text-green-600">₹{totalDue.toLocaleString()}</span>
            </div>
          </div>
          
          {totalDue > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                  {ownerDetails.qrCodeUrl && (
                    <div className="flex flex-col items-center space-y-2">
                        <img src={ownerDetails.qrCodeUrl} alt="QR Code" className="w-36 h-36 rounded-lg border p-1" />
                        <p className="text-xs text-muted-foreground">Scan to Pay</p>
                    </div>
                  )}
                  <Button onClick={handleUpiPayment} className="w-full btn-gradient-glow" disabled={!ownerDetails.upiId}>
                    Pay with UPI
                  </Button>
              </div>

              <div className="space-y-2">
                  <label htmlFor="screenshot" className="font-semibold">Upload Payment Screenshot</label>
                  <Input id="screenshot" type="file" accept="image/*" onChange={handleFileChange} />
                  {screenshotPreview && <img src={screenshotPreview} alt="Screenshot Preview" className="mt-2 rounded-md max-h-48" />}
              </div>

              <Button onClick={handleSubmitForApproval} className="w-full" disabled={!screenshot}>
                <Send className="mr-2 h-4 w-4" /> Submit for Approval
              </Button>
            </div>
          )}

          {totalDue === 0 && (
            <div className="text-center p-4 bg-green-100/50 dark:bg-green-900/20 rounded-lg">
                <p className="font-semibold text-green-700 dark:text-green-300">All dues for this month are cleared. Well done!</p>
            </div>
          )}

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Payments</CardTitle>
          <CardDescription>These are your submitted payments awaiting owner approval.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPayments.length > 0 ? (
            <ul className="space-y-3">
              {pendingPayments.map(p => (
                <li key={p.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-semibold">₹{p.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{new Date(p.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-500">{p.status}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No payments are currently being processed.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
