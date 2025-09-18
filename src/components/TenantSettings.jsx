"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Palette, Settings as SettingsIcon, User, Bell, Shield, Sparkles, Crown, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { themes } from '@/contexts/ThemeContext';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

const TenantSettings = ({ tenant, setOwnerState, ownerState }) => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { currentTheme, setCurrentTheme, theme: appTheme } = useAppTheme();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isPremium = tenant.subscriptionPlan === 'premium';
  const isPlus = tenant.subscriptionPlan === 'plus';

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    toast({
      title: 'Theme Updated',
      description: `Switched to ${themes[newTheme].name} theme`,
    });
  };

  const handleNotificationToggle = (enabled) => {
    setOwnerState(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => 
        t.id === tenant.id 
          ? { ...t, notificationsEnabled: enabled }
          : t
      )
    }));
    toast({
      title: "Settings Updated",
      description: enabled ? "Notifications enabled" : "Notifications disabled",
    });
  };

  const handleProfileUpdate = (field, value) => {
    setOwnerState(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => 
        t.id === tenant.id 
          ? { ...t, [field]: value }
          : t
      )
    }));
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const tenantPlans = {
    free: {
      name: 'Free',
      features: ['View Bills & Pay Rent', 'Submit Maintenance Requests', 'Access Notice Board'],
      color: 'from-slate-500 to-slate-600',
      icon: User
    },
    plus: {
      name: 'Plus',
      features: ['All Free Features', 'Download Detailed Receipts', 'View Full Payment History'],
      color: 'from-blue-500 to-blue-600',
      icon: Star
    },
    premium: {
      name: 'Premium',
      features: ['All Plus Features', 'Access All Documents', 'Priority Support', 'Advanced Analytics'],
      color: 'from-purple-500 to-purple-600',
      icon: Crown
    }
  };

  const currentPlan = tenantPlans[tenant.subscriptionPlan || 'free'];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full shadow-2xl shadow-blue-500/30">
          <div className="p-3 rounded-full bg-slate-800">
            <SettingsIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 via-blue-100 to-slate-200 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-300 text-lg">Customize your tenant experience</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>Current Plan</span>
              </CardTitle>
              <CardDescription>Your current subscription plan and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${currentPlan.color} text-white`}>
                <div className="flex items-center space-x-3">
                  <currentPlan.icon className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">{currentPlan.name}</h3>
                    <p className="text-sm opacity-90">
                      {tenant.subscriptionPlan === 'premium' ? 'Premium Features' : 
                       tenant.subscriptionPlan === 'plus' ? 'Plus Features' : 'Basic Features'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-200">Included Features:</h4>
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {!isPremium && (
                <Button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-cyan-400" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of your app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Theme Toggle */}
              <div className="space-y-4">
                <Label>System Theme</Label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant={theme === 'light' ? 'default' : 'outline'} 
                    onClick={() => setTheme('light')}
                    className="flex-1"
                  >
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? 'default' : 'outline'} 
                    onClick={() => setTheme('dark')}
                    className="flex-1"
                  >
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </Button>
                </div>
              </div>

              {/* App Theme Selection */}
              <div className="space-y-4">
                <Label>App Theme</Label>
                <Select value={currentTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themes).map(([key, theme]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {theme.name}
                              {key === 'futuristic' && (
                                <Sparkles className="w-3 h-3 text-cyan-500" />
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{theme.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Preview */}
              <div className="space-y-2">
                <Label>Theme Preview</Label>
                <div className={`p-4 rounded-lg bg-gradient-to-r ${appTheme.primary} text-white`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${appTheme.secondary} flex items-center justify-center`}>
                      <SettingsIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">EstateFlow</div>
                      <div className="text-sm opacity-80">Tenant Portal</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-green-400" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="notifications" className="font-semibold">Enable Notifications</Label>
                  <p className="text-sm text-slate-400">Receive updates about payments, maintenance, and announcements</p>
                </div>
                <Switch 
                  id="notifications"
                  checked={tenant.notificationsEnabled ?? true}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Profile Settings</span>
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={tenant.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={tenant.phone}
                  onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                  className="bg-slate-700/50 border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={tenant.email || ''}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  className="bg-slate-700/50 border-slate-600"
                  placeholder="your.email@example.com"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Upgrade Your Plan</h3>
              <p className="text-slate-300">Unlock premium features and enhance your experience</p>
              
              <div className="space-y-3">
                {Object.entries(tenantPlans).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      tenant.subscriptionPlan === key
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                    onClick={() => {
                      if (key !== tenant.subscriptionPlan) {
                        setOwnerState(prev => ({
                          ...prev,
                          tenants: prev.tenants.map(t => 
                            t.id === tenant.id 
                              ? { ...t, subscriptionPlan: key }
                              : t
                          )
                        }));
                        setIsUpgradeModalOpen(false);
                        toast({
                          title: "Plan Updated",
                          description: `You're now on the ${plan.name} plan`,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <plan.icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{plan.name}</div>
                        <div className="text-sm text-slate-400">
                          {plan.features.slice(0, 2).join(', ')}
                          {plan.features.length > 2 && '...'}
                        </div>
                      </div>
                      {tenant.subscriptionPlan === key && (
                        <Badge className="bg-green-500">Current</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => setIsUpgradeModalOpen(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TenantSettings;
