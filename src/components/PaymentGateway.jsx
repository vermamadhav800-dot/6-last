
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function PaymentGateway({ ownerProfile }) {
  const { toast } = useToast();

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ownerProfile.upiId);
    toast({ title: "Success", description: "UPI ID copied to clipboard." });
  };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Pay with UPI</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                {ownerProfile.qrCode ? (
                    <img src={ownerProfile.qrCode} alt="QR Code" className="w-48 h-48" />
                ) : (
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <p className="text-muted-foreground">No QR Code</p>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <p className="text-lg font-medium">{ownerProfile.upiId}</p>
                    <Button variant="ghost" size="icon" onClick={handleCopyUpi}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <a href={`upi://pay?pa=${ownerProfile.upiId}&pn=Owner&am=1&cu=INR`} className="text-blue-500 hover:underline">
                    Pay Now
                </a>
            </CardContent>
        </Card>
    </div>
  );
}
