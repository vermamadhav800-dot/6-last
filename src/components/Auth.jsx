
"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, User as UserIcon, Lock, LoaderCircle, Shield, User, Phone as PhoneIcon, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AppLogo from "./AppLogo";

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
            <div className="space-y-8">
                {/* Animated OTP Header */}
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
                    {/* Animated OTP Input */}
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

                    {/* Demo OTP Hint */}
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg">
                            <Shield className="h-4 w-4 text-amber-400" />
                            <span className="text-sm text-amber-300 font-medium">Demo OTP: 151515</span>
                        </div>
                    </div>

                    {/* Animated Submit Button */}
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

                    {/* Resend OTP Button */}
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
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* High-tech Phone Input */}
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

            {/* Animated Send Button */}
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
        </div>
    );
};

const OwnerRegisterForm = ({ onAuth, role, setAuthMode }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isRegistered) {
            setAuthMode('login');
        }
    }, [isRegistered, setAuthMode]);

    const handleAuthAction = async (e) => {
        e.preventDefault();
        if (!name || !phone || !password) {
            toast({ variant: "destructive", title: "Error", description: "Please fill out all fields." });
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            toast({ variant: "destructive", title: "Error", description: "Please enter a valid 10-digit phone number." });
            return;
        }
        setIsLoading(true);
        try {
            const registerSuccess = await onAuth({ name, phone, password, role }, 'register');
            if (registerSuccess) {
                setIsRegistered(true);
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred during registration." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleAuthAction} className="space-y-4">
            <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 py-6 text-base" required />
            </div>
            <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 py-6 text-base" required />
            </div>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input type="password" placeholder="Set a Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 py-6 text-base" required />
            </div>

            <Button type="submit" className="w-full py-6 text-lg btn-gradient-glow" disabled={isLoading}>
                {isLoading ? <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" />Registering...</> : "Create Account"}
            </Button>
            <Button variant="link" className="w-full" onClick={() => setAuthMode('login')}>
                Already have an account? Sign In
            </Button>
        </form>
    );
};


const TenantLoginForm = ({ onAuth, role, isLoading: parentIsLoading }) => {
    const [phone, setPhone] = useState("");
    const [tenantId, setTenantId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const { toast } = useToast();

    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        if (!phone.trim()) {
            toast({ variant: "destructive", title: "Phone Number Required", description: "Please enter your 10-digit phone number." });
            return;
        }
        if (!/^\d{10}$/.test(phone)) {
            toast({ variant: "destructive", title: "Invalid Phone Number", description: "Please enter a valid 10-digit phone number." });
            return;
        }

        setIsLoading(true);
        try {
            const phoneExists = await onAuth({ username: phone }, 'tenant-phone-check');
            if (phoneExists) {
                setIsVerified(true);
            } else {
                toast({ variant: "destructive", title: "Phone Number Not Found", description: "This phone number is not registered. Please contact your property owner." });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred while checking the phone number." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!tenantId.trim()) {
            toast({ variant: "destructive", title: "Login ID Required", description: "Please enter the login ID provided by your owner." });
            return;
        }
        
        setIsLoading(true);
        try {
            await onAuth({ username: phone, tenantId, role }, 'login');
        } catch (error) {
            // The main onAuth handler will show the toast for success/failure.
            // This catch is for unexpected errors during the call itself.
            toast({ variant: "destructive", title: "Login Error", description: "An unexpected error occurred during login." });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isVerified) {
        return (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="tel"
                        placeholder="Enter your Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 py-6 text-base"
                        required
                        disabled={isLoading || parentIsLoading}
                        maxLength={10}
                    />
                </div>
                <Button type="submit" className="w-full py-6 text-lg btn-gradient-glow" disabled={isLoading || parentIsLoading}>
                    {isLoading ? (
                        <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                    ) : (
                        "Verify Phone"
                    )}
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
            <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Enter your Login ID"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                    className="pl-10 py-6 text-base"
                    required
                    disabled={isLoading || parentIsLoading}
                    autoFocus
                />
            </div>
            <CardDescription className="text-center text-xs pt-2">
                Enter the Login ID provided by your property owner.
            </CardDescription>
            <Button type="submit" className="w-full py-6 text-lg btn-gradient-glow" disabled={isLoading || parentIsLoading}>
                {isLoading ? (
                    <><LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> Signing In...</>
                ) : (
                    "Sign In as Tenant"
                )}
            </Button>
            <Button variant="link" className="w-full" onClick={() => setIsVerified(false)} disabled={isLoading || parentIsLoading}>
                Back to enter phone number
            </Button>
        </form>
    );
};


export default function Auth({ onAuth, isOtpSent, isLoading }) {
    const [role, setRole] = useState('tenant');
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
    const bgRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!bgRef.current) return;
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
            const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1

            bgRef.current.style.transform = `translateX(${x * 15}px) translateY(${y * 15}px)`;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    const renderOwnerForm = () => {
        if (authMode === 'login') {
            return (
                <>
                    <OwnerLoginForm onAuth={onAuth} isOtpSent={isOtpSent} isLoading={isLoading} />
                     <Button variant="link" className="w-full mt-4" onClick={() => setAuthMode('register')}>
                        Don't have an account? Create one
                    </Button>
                </>
            );
        }
        return <OwnerRegisterForm onAuth={onAuth} role="owner" setAuthMode={setAuthMode} />;
    }
    
    const starLayers = [
        {   // Slowest, smallest, and most numerous stars
            numStars: 400,
            size: 1,
            speed: 500, // Longest duration
            twinkleSpeed: 7,
        },
        {   // Medium-speed, medium-sized stars
            numStars: 150,
            size: 1.5,
            speed: 300,
            twinkleSpeed: 5,
        },
        {   // Fastest, largest, and least numerous stars
            numStars: 50,
            size: 2,
            speed: 150, // Shortest duration
            twinkleSpeed: 3,
        },
    ];

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            
            {/* High-tech Animated Background */}
            <div ref={bgRef} className="animated-bg-container">
                {/* Floating Geometric Shapes */}
                <div className="absolute inset-0">
                    {Array.from({ length: 20 }).map((_, i) => {
                        // Use deterministic positioning based on index to avoid hydration mismatch
                        const seed = i * 137.508; // Golden angle approximation
                        const top = (Math.sin(seed) * 50 + 50) % 100;
                        const left = (Math.cos(seed) * 50 + 50) % 100;
                        const animationDelay = (i * 0.1) % 3;
                        const animationDuration = 3 + (i % 3);
                        
                        return (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-60 animate-pulse"
                                style={{
                                    top: `${top}%`,
                                    left: `${left}%`,
                                    animationDelay: `${animationDelay}s`,
                                    animationDuration: `${animationDuration}s`,
                                }}
                            />
                        );
                    })}
                </div>

                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid-pattern"></div>
                </div>

                {/* Floating Particles */}
                {starLayers.map((layer, i) => (
                    <div 
                        key={i} 
                        className="stars-layer"
                        style={{ animationDuration: `${layer.speed}s` }}
                    >
                        {Array.from({ length: layer.numStars }).map((_, j) => {
                            const duplicate = j >= layer.numStars / 2;
                            let leftPosition = Math.random() * 100;
                            if (duplicate) {
                                leftPosition += 100;
                            }

                            return (
                                <div 
                                    key={j}
                                    className="star"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${leftPosition}%`,
                                        width: `${layer.size}px`,
                                        height: `${layer.size}px`,
                                        animationDelay: `${Math.random() * layer.twinkleSpeed}s, ${Math.random() * layer.speed}s`,
                                        animationDuration: `${layer.twinkleSpeed}s, ${layer.speed}s`,
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Main Auth Card */}
            <Card className="w-full max-w-lg shadow-2xl animate-fade-in-scale glass-card relative z-10 border border-white/10">
                <CardHeader className="text-center relative pb-8">
                    {/* Glowing Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-t-2xl blur-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-t-2xl"></div>
                    
                    <div className="relative z-10">
                        {/* Animated Logo */}
                        <div className="relative inline-block mb-6">
                            <AppLogo className="w-20 h-20 mx-auto drop-shadow-2xl" iconClassName="w-12 h-12"/>
                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                        </div>
                        
                        <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            TenantFlow Pro
                        </CardTitle>
                        <CardDescription className="text-slate-300/80 text-lg">
                            Next-Generation Property Management Platform
                        </CardDescription>
                    </div>
                </CardHeader>
                
                <CardContent className="px-8 pb-8">
                    {/* Role Selection with Enhanced Design */}
                    <div className="grid grid-cols-2 gap-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-2 rounded-xl mb-8 backdrop-blur-sm border border-white/10">
                        <button 
                            onClick={() => { setRole('tenant'); setAuthMode('login'); }} 
                            className={cn(
                                "py-4 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group",
                                role === 'tenant' 
                                    ? 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 shadow-lg shadow-indigo-500/20 border border-indigo-400/40 text-white' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <User className="h-5 w-5" />
                                <span>Tenant Portal</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => { setRole('owner'); setAuthMode('login'); }}
                            className={cn(
                                "py-4 rounded-lg text-sm font-semibold transition-all duration-300 relative overflow-hidden group",
                                role === 'owner' 
                                    ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-lg shadow-purple-500/20 border border-purple-400/40 text-white' 
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                <Shield className="h-5 w-5" />
                                <span>Owner Dashboard</span>
                            </div>
                        </button>
                    </div>
                    
                    {/* Form Content */}
                    {role === 'owner' ? renderOwnerForm() : <TenantLoginForm onAuth={onAuth} role="tenant" isLoading={isLoading} />}
                </CardContent>
            </Card>
        </div>
    );
}
