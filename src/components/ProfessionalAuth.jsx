
"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, User as UserIcon, Lock, LoaderCircle, Shield, User, Phone as PhoneIcon, KeyRound, Mail, Eye, EyeOff, ArrowRight, Sparkles, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import AppLogo from "./AppLogo";
import { motion, AnimatePresence } from "framer-motion";
import { useAppTheme } from "@/contexts/ThemeContext";

const ProfessionalAuth = ({ onAuth, isOtpSent, isLoading }) => {
  const [activeTab, setActiveTab] = useState('owner');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { theme: appTheme } = useAppTheme();

  const OwnerLoginForm = () => {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Animated OTP Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative inline-block"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <KeyRound className="h-10 w-10 text-white animate-bounce" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-ping"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Enter Verification Code
              </h3>
              <p className="text-slate-300 mt-2">
                We've sent a 6-digit code to your phone
              </p>
            </motion.div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            onSubmit={handleOtpSubmit}
            className="space-y-6"
          >
            {/* Animated OTP Input */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-400 animate-pulse" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-12 py-8 text-xl text-center font-mono tracking-widest bg-slate-800/80 backdrop-blur-sm border-2 border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-white"
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
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-3 h-6 w-6" />
                    Verify OTP
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Building2 className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-ping"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Owner Login
            </h2>
            <p className="text-slate-300 mt-2">Access your property management dashboard</p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handlePhoneSubmit}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-sm"></div>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-12 py-8 text-lg bg-slate-800/80 backdrop-blur-sm border-2 border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
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
                  Send OTP
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    );
  };

  const TenantLoginForm = () => {
    const [credentials, setCredentials] = useState({ username: "", tenantId: "" });
    const { toast } = useToast();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!credentials.username || !credentials.tenantId) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please enter both phone number and tenant ID.",
        });
        return;
      }
      onAuth(credentials, 'login');
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <User className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-ping"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tenant Login
            </h2>
            <p className="text-slate-300 mt-2">Access your tenant portal</p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-green-400" />
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="pl-12 py-8 text-lg bg-slate-800/80 backdrop-blur-sm border-2 border-green-500/30 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
                <Input
                  type="text"
                  placeholder="Enter your tenant ID"
                  value={credentials.tenantId}
                  onChange={(e) => setCredentials(prev => ({ ...prev, tenantId: e.target.value }))}
                  className="pl-12 py-8 text-lg bg-slate-800/80 backdrop-blur-sm border-2 border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-2xl shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <User className="mr-3 h-6 w-6" />
                  Login to Portal
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    );
  };

  const OwnerRegisterForm = () => {
    const [formData, setFormData] = useState({
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
      if (isRegistered) {
        setActiveTab('owner');
        toast({
          title: "Registration Successful",
          description: "Please login with your phone number and OTP 151515",
        });
      }
    }, [isRegistered]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Password Mismatch",
          description: "Passwords do not match.",
        });
        return;
      }
      const success = await onAuth(formData, 'register');
      if (success) {
        setIsRegistered(true);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center animate-pulse">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full blur-lg opacity-30 animate-ping"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-slate-300 mt-2">Start managing your properties today</p>
          </motion.div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-400" />
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="pl-12 py-6 bg-slate-800/80 backdrop-blur-sm border-2 border-purple-500/30 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-pink-400" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-12 py-6 bg-slate-800/80 backdrop-blur-sm border-2 border-pink-500/30 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-red-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-12 pr-12 py-6 bg-slate-800/80 backdrop-blur-sm border-2 border-red-500/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-xl blur-sm"></div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-red-400" />
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-12 py-6 bg-slate-800/80 backdrop-blur-sm border-2 border-red-500/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 rounded-xl text-white"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className="w-full py-8 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 rounded-xl" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-3 h-6 w-6 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Crown className="mr-3 h-6 w-6" />
                  Create Account
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>

        {/* Back to Login Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => setActiveTab('owner')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Login here
            </button>
          </p>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* App Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full shadow-2xl shadow-blue-500/30 mb-4">
            <div className="p-3 rounded-full bg-slate-800">
              <AppLogo className="w-12 h-12" variant="professional" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 via-blue-100 to-slate-200 bg-clip-text text-transparent mb-2">
            EstateFlow
          </h1>
          <p className="text-slate-300 text-lg">Professional Property Management</p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 mb-8 border border-slate-700"
        >
          <button
            onClick={() => setActiveTab('owner')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'owner'
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Owner</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('tenant')}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === 'tenant'
                ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <div className="flex items-center justify-center space-x-2">
              <User className="w-4 h-4" />
              <span>Tenant</span>
            </div>
          </button>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'owner' && !isOtpSent && <OwnerLoginForm key="owner-login" />}
                {activeTab === 'owner' && isOtpSent && <OwnerLoginForm key="owner-otp" />}
                {activeTab === 'tenant' && <TenantLoginForm key="tenant-login" />}
                {activeTab === 'register' && <OwnerRegisterForm key="owner-register" />}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Register Link */}
        {activeTab !== 'register' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => setActiveTab('register')}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Create one here
              </button>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalAuth;
