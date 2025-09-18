
"use client";

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, CreditCard, Calendar, Lock, ShieldCheck, QrCode } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import AppLogo from './AppLogo';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const paymentMethods = [
    { id: 'credit-card', name: 'Credit Card', icon: CreditCard },
    { id: 'upi', name: 'UPI/QR', icon: QrCode },
    { id: 'net-banking', name: 'Net Banking', icon: ShieldCheck },
];

export default function PaymentGateway({ isOpen, onOpenChange, plan, onPaymentSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
    const [formErrors, setFormErrors] = useState({});
    const { toast } = useToast();

    const validateForm = () => {
        const errors = {};
        if (paymentMethod === 'credit-card') {
            if (!/^(\d{4}\s?){4}$/.test(cardDetails.number)) {
                errors.number = 'Invalid card number.';
            }
            if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(cardDetails.expiry)) {
                errors.expiry = 'Invalid expiry date (MM/YY).';
            }
            if (!/^\d{3,4}$/.test(cardDetails.cvc)) {
                errors.cvc = 'Invalid CVC.';
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = (event) => {
        event.preventDefault();
        if (paymentMethod === 'credit-card' && !validateForm()) {
            toast({
                title: "Invalid Details",
                description: "Please check your payment details and try again.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            const isSuccess = Math.random() > 0.1; // 90% success rate

            if (isSuccess) {
                toast({
                    title: "Payment Successful!",
                    description: `You've successfully upgraded to the ${plan.name} plan.`,
                    className: "bg-green-100 dark:bg-green-900 border-green-400",
                });
                onPaymentSuccess(plan);
            } else {
                toast({
                    title: "Payment Failed",
                    description: "We couldn't process your payment. Please try again or use a different payment method.",
                    variant: "destructive"
                });
            }
        }, 2000);
    };
    
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        let parts = [];
        for (let i=0, len=match.length; i<len; i+=4) {
            parts.push(match.substring(i, i+4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    }

    const formatExpiry = (value) => {
        const cleanValue = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (cleanValue.length >= 3) {
            return `${cleanValue.slice(0, 2)} / ${cleanValue.slice(2, 4)}`;
        }
        return cleanValue;
    }

    const PaymentForm = useMemo(() => {
        switch (paymentMethod) {
            case 'credit-card':
                return (
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    id="card-number" 
                                    placeholder="0000 0000 0000 0000" 
                                    className={cn("pl-10 bg-slate-800/60 border-slate-700 focus:border-blue-500", formErrors.number && "border-red-500")} 
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({...cardDetails, number: formatCardNumber(e.target.value)})}
                                    required 
                                />
                            </div>
                            {formErrors.number && <p className="text-sm text-red-500">{formErrors.number}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry-date">Expiry Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        id="expiry-date" 
                                        placeholder="MM / YY" 
                                        className={cn("pl-10 bg-slate-800/60 border-slate-700 focus:border-blue-500", formErrors.expiry && "border-red-500")} 
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({...cardDetails, expiry: formatExpiry(e.target.value)})}
                                        required 
                                    />
                                </div>
                                {formErrors.expiry && <p className="text-sm text-red-500">{formErrors.expiry}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        id="cvc" 
                                        placeholder="123" 
                                        className={cn("pl-10 bg-slate-800/60 border-slate-700 focus:border-blue-500", formErrors.cvc && "border-red-500")} 
                                        value={cardDetails.cvc}
                                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                        required 
                                        maxLength={4}
                                    />
                                </div>
                                {formErrors.cvc && <p className="text-sm text-red-500">{formErrors.cvc}</p>}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'upi':
                return (
                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="text-center p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=estateflow@paymentbank&pn=EstateFlow&am=${plan?.priceAmount || '499'}`} alt="UPI QR Code" className="w-48 h-48 mx-auto p-2 border-4 border-blue-500 rounded-lg bg-white"/>
                        <p className="mt-4 text-muted-foreground">Scan the QR code with your UPI app</p>
                        <p className="font-semibold text-lg">or pay to <span className="text-blue-400">estateflow@paymentbank</span></p>
                    </motion.div>
                );
            case 'net-banking':
                return (
                     <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="text-center p-8 rounded-xl bg-slate-800/60 border border-slate-700">
                        <ShieldCheck className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-muted-foreground">You will be redirected to your bank's secure website to complete the payment.</p>
                        <p className="font-semibold text-blue-400 mt-2">This is a simulated redirection.</p>
                    </motion.div>
                );
            default:
                return null;
        }
    }, [paymentMethod, cardDetails, formErrors, plan]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-slate-900/80 backdrop-blur-sm border-slate-700 text-white shadow-2xl shadow-blue-500/10">
                <DialogHeader>
                    <div className="flex flex-col items-center text-center gap-2 mb-4">
                        <AppLogo className="w-14 h-14 mb-2" />
                        <DialogTitle className="text-2xl font-bold">Secure Checkout</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Upgrading to the <span className="font-bold text-blue-400">{plan?.name}</span> plan.
                        </DialogDescription>
                    </div>
                </DialogHeader>
                
                <div className="p-4 border border-slate-700 rounded-lg bg-slate-800/50">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Plan: {plan?.name}</span>
                        <span className="font-bold text-xl">{plan?.price}{plan?.priceSuffix}</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">Billed {plan?.id.includes('yearly') ? 'annually' : 'monthly'}. You can cancel anytime.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 my-4">
                    {paymentMethods.map(method => {
                        const Icon = method.icon;
                        return (
                            <Button 
                                key={method.id} 
                                variant={paymentMethod === method.id ? 'default' : 'outline'}
                                onClick={() => setPaymentMethod(method.id)}
                                className={cn(
                                    "flex flex-col h-20 items-center justify-center gap-2 text-xs transition-all",
                                    paymentMethod === method.id 
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg"
                                        : "bg-slate-800/60 border-slate-700 hover:bg-slate-700/80 hover:text-white"
                                )}
                            >
                                <Icon className="w-6 h-6" />
                                <span>{method.name}</span>
                            </Button>
                        )
                    })}
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    {PaymentForm}
                    
                    <DialogFooter className="pt-4">
                        <Button type="submit" className="w-full btn-gradient-glow h-14 text-lg" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                `Pay ${plan?.price}`
                            )}
                        </Button>
                    </DialogFooter>
                </form>
                 <p className="text-xs text-center text-slate-500 mt-4">Powered by EstateFlow Secure Payments</p>
            </DialogContent>
        </Dialog>
    );
}
