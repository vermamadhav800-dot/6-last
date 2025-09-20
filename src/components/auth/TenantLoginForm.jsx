
"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";

export default function TenantLoginForm({ onAuth, isLoading }) {
    const [username, setUsername] = useState(''); // This will be the phone number

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAuth({ username }, 'login');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                 <label htmlFor="phone" className="text-sm font-medium text-slate-300">Registered Phone Number</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                        id="phone"
                        type="text"
                        placeholder="10-digit phone number"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="username"
                        className="pl-10"
                    />
                </div>
            </div>
            <Button type="submit" className="w-full btn-gradient-glow flex items-center justify-center gap-2" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Sign In as Tenant</span>
            </Button>
        </form>
    );
}
