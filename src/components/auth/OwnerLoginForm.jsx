
"use client";

import { useState } from "react";
import { LoaderCircle, Shield, Phone as PhoneIcon, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const OwnerLoginForm = ({ onAuth, isOtpSent, isLoading }) => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const { toast } = useToast();

    const handlePhoneSubmit = (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(phone)) {
            toast({
                variant: "destructive",
                title: "Invalid Phone Number",
                description: "Please enter a valid 10-digit phone number.",
            });
            return;
        }
        onAuth({ phone, role: 'owner' }, 'login-phone-start');
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (!otp) {
            toast({
                variant: "destructive",
                title: "OTP Required",
                description: "Please enter the OTP.",
            });
            return;
        }
        onAuth({ otp, role: 'owner' }, 'login-phone-verify');
    };
    
    if (isOtpSent) {
        return (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="text-center space-y-4">
                    <div className="relative inline-block">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                            <KeyRound className="h-10 w-10 text-white animate-bounce" />
                        </div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-ping"></div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Enter Verification Code
                        </h3>
                        <p className="text-muted-foreground mt-2">
                            We've sent a 6-digit code to your phone
                        </p>
                    </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400 animate-pulse" />
                            <Input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="pl-12 py-8 text-xl text-center font-mono tracking-widest bg-background/80 backdrop-blur-sm border-2 border-indigo-500/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl"
                                required
                                disabled={isLoading}
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg">
                            <Shield className="h-4 w-4 text-amber-400" />
                            <span className="text-sm text-amber-300 font-medium">Demo OTP: 151515</span>
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                                Verifying Code...
                            </>
                        ) : (
                            <>
                                <Shield className="mr-3 h-6 w-6" />
                                Verify & Access Dashboard
                            </>
                        )}
                    </Button>

                    <div className="text-center">
                        <Button 
                            variant="ghost" 
                            className="text-muted-foreground hover:text-indigo-400 transition-colors"
                            onClick={() => {
                                setOtp("");
                                // Resend OTP logic here
                            }}
                        >
                            Didn't receive code? Resend
                        </Button>
                    </div>
                </form>
            </motion.div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
                <div className="relative">
                    <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-400 animate-pulse" />
                    <Input
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-12 py-8 text-lg font-mono tracking-wider bg-background/80 backdrop-blur-sm border-2 border-indigo-500/30 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 rounded-xl"
                        required
                        disabled={isLoading}
                        maxLength={10}
                    />
                </div>
            </div>

            <Button 
                type="submit" 
                onClick={handlePhoneSubmit}
                className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                        Sending OTP...
                    </>
                ) : (
                    <>
                        <Shield className="mr-3 h-6 w-6" />
                        Send Verification Code
                    </>
                )}
            </Button>
        </motion.div>
    );
};

export default OwnerLoginForm;
