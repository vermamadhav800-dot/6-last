
"use client";

import { useState } from "react";
import { Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AppLogo from "../AppLogo";
import { motion, AnimatePresence } from "framer-motion";
import OwnerLoginForm from "./OwnerLoginForm";
import OwnerRegisterForm from "./OwnerRegisterForm";
import TenantLoginForm from "./TenantLoginForm";
import AuthBackground from "./AuthBackground";

export default function Auth({ onAuth, isOtpSent, isLoading }) {
    const [role, setRole] = useState('tenant');
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    const renderOwnerForm = () => {
        if (authMode === 'login') {
            return (
                <AnimatePresence mode="wait">
                    <motion.div
                        key="owner-login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <OwnerLoginForm onAuth={onAuth} isOtpSent={isOtpSent} isLoading={isLoading} />
                         <Button variant="link" className="w-full mt-4" onClick={() => setAuthMode('register')}>
                            Don't have an account? Create one
                        </Button>
                    </motion.div>
                </AnimatePresence>
            );
        }
        return <OwnerRegisterForm onAuth={onAuth} role="owner" setAuthMode={setAuthMode} />;
    }
    
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
            
            <AuthBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                <Card className="w-full max-w-lg shadow-2xl glass-card relative z-10 border border-white/10">
                    <CardHeader className="text-center relative pb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-t-2xl blur-xl"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-t-2xl"></div>
                        
                        <div className="relative z-10">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <div className="relative inline-block mb-6">
                                    <AppLogo className="w-20 h-20 mx-auto drop-shadow-2xl" iconClassName="w-12 h-12"/>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                                </div>
                            </motion.div>
                            
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                    TenantFlow Pro
                                </CardTitle>
                                <CardDescription className="text-slate-300/80 text-lg">
                                    Next-Generation Property Management Platform
                                </CardDescription>
                            </motion.div>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="px-8 pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                        >
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
                        </motion.div>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={role}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {role === 'owner' ? renderOwnerForm() : <TenantLoginForm onAuth={onAuth} role="tenant" isLoading={isLoading} />}
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
