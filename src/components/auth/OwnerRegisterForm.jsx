
"use client";

import { useState, useEffect } from "react";
import { User as UserIcon, Lock, LoaderCircle, Phone as PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
        <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleAuthAction} 
            className="space-y-4"
        >
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
        </motion.form>
    );
};

export default OwnerRegisterForm;
