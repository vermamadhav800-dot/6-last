
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function CreditCardGateway({
  isOpen,
  onOpenChange,
  plan,
  onPaymentSuccess,
}) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate a successful payment after a short delay
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `You have successfully upgraded to the ${plan.name} plan.`,
      });
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 2000); // Simulating network latency
  };

  const handleOpenChange = (open) => {
    if (!isProcessing) {
      onOpenChange(open);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to {plan?.name}</DialogTitle>
          <DialogDescription>
            Enter your card details to complete the payment. This is a demo gateway.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card-number" className="text-right">
              Card Number
            </Label>
            <Input id="card-number" placeholder="**** **** **** 1234" className="col-span-3" defaultValue="4242 4242 4242 4242" disabled={isProcessing} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expiry
            </Label>
            <Input id="expiry" placeholder="MM/YY" className="col-span-3" defaultValue="12/24" disabled={isProcessing} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cvc" className="text-right">
              CVC
            </Label>
            <Input id="cvc" placeholder="123" className="col-span-3" defaultValue="123" disabled={isProcessing} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${plan?.priceAmount}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
