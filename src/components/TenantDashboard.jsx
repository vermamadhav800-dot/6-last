
"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
  Home, IndianRupee, User, Menu, X, Sun, Moon, LogOut, FileText, 
  BadgeCheck, BadgeAlert, QrCode, ExternalLink, Upload, Zap, Bell, 
  MessageSquare, Wrench, Megaphone, Clock, Star, Sparkles, FolderArchive, 
  Mail, Phone, Edit, Image as ImageIcon, Crown, TrendingUp, Calendar,
  CreditCard, Shield, Activity, BarChart3, Settings, ChevronRight,
  CheckCircle, AlertCircle, Info, Download, Eye, Send, Plus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTheme } from "next-themes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { differenceInDays, parseISO, format, formatDistanceToNow } from 'date-fns';
import AppLogo from './AppLogo';
import { useToast } from "@/hooks/use-toast";
import useSound from '@/hooks/useSound';
import TenantDocuments from './TenantDocuments';
import TenantSettings from './TenantSettings';
import TenantProfile from './TenantProfile';
import PaymentPortal from './PaymentPortal';
import PremiumFeature from './PremiumFeature';
import Upgrade from './Upgrade';
import { useAppTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import TenantRequests from './TenantRequests'; // Import the new component
import { Badge } from '@/components/ui/badge';

const ProfessionalTenantDashboard = ({ tenant, ownerState, setAppState, ownerId, property, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { theme: appTheme } = useAppTheme();
  const { play: playNotificationSound } = useSound('/sounds/notification.mp3', { volume: 0.5 });

  const tenantPlan = 'premium';
  const isPremium = true;

  const notifications = useMemo(() => {
      return (property.notifications || [])
          .filter(n => n.tenantId === tenant.id)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [property.notifications, tenant.id]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  useEffect(() => {
    if (unreadCount > 0) {
      playNotificationSound();
    }
  }, [unreadCount, playNotificationSound]);

  const updateOwnerState = (updater) => {
    setAppState(prevApp => {
      const ownerData = prevApp[ownerId] || {};
      const updatedOwnerData = typeof updater === 'function' ? updater(ownerData) : updater;
      return { ...prevApp, [ownerId]: updatedOwnerData };
    });
  };

  const markNotificationsAsRead = () => {
    updateOwnerState(prev => {
        const updatedNotifications = prev.notifications.map(n => 
            n.tenantId === tenant.id ? { ...n, isRead: true } : n
        );
        return { ...prev, properties: prev.properties.map(p => p.id === property.id ? { ...p, notifications: updatedNotifications } : p) };
    });
  };

  const tenantStats = useMemo(() => {
    const payments = property.payments || [];
    const tenantPayments = payments.filter(p => p.tenantId === tenant.id);
    const totalPaid = tenantPayments.reduce((sum, p) => sum + p.amount, 0);
    const lastPayment = tenantPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const isOverdue = lastPayment && lastPayment.date ? differenceInDays(new Date(), parseISO(lastPayment.date)) > 30 : false;
    
    return {
      totalPaid,
      lastPayment,
      isOverdue,
      paymentCount: tenantPayments.length,
      averagePayment: tenantPayments.length > 0 ? totalPaid / tenantPayments.length : 0
    };
  }, [property.payments, tenant.id]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FolderArchive },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "blue" }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-${color}-200/50 hover:border-${color}-300/50 bg-gradient-to-br from-${color}-50/50 to-${color}-100/50 dark:from-${color}-900/20 dark:to-${color}-800/20`}
        onClick={onClick}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className={`p-2 md:p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 flex-shrink-0`}>
              <Icon className={`w-5 h-5 md:w-6 md:h-6 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base truncate">{title}</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">{title}</p>
            <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-500 truncate">{subtitle}</p>}
          </div>
          <div className={`p-2 md:p-3 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex-shrink-0`}>
            <Icon className={`w-4 h-4 md:w-6 md:h-6 text-${color}-600 dark:text-${color}-400`} />
          </div>
        </div>
        {trend && (
          <div className="mt-3 md:mt-4 flex items-center">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
            <span className="text-xs md:text-sm text-green-600 dark:text-green-400">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-4 md:space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Welcome back, {tenant.name}!
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">
                You are currently viewing: <strong>{property.name}</strong>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isPremium ? "default" : "secondary"} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                {isPremium ? <Crown className="w-3 h-3 mr-1" /> : null}
                {isPremium ? 'Premium' : 'Standard'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Paid" value={`₹${tenantStats.totalPaid.toLocaleString()}`} subtitle="All time payments" icon={IndianRupee} color="green" />
        <StatCard title="Last Payment" value={tenantStats.lastPayment?.date ? format(parseISO(tenantStats.lastPayment.date), 'MMM dd') : 'N/A'} subtitle={tenantStats.lastPayment?.date ? formatDistanceToNow(parseISO(tenantStats.lastPayment.date), { addSuffix: true }) : 'No payments yet'} icon={Calendar} color="blue" />
        <StatCard title="Payment Count" value={tenantStats.paymentCount.toString()} subtitle="Total transactions" icon={CreditCard} color="purple" />
        <StatCard title="Status" value={tenantStats.isOverdue ? "Overdue" : "Current"} subtitle={tenantStats.isOverdue ? "Payment required" : "Up to date"} icon={tenantStats.isOverdue ? AlertCircle : CheckCircle} color={tenantStats.isOverdue ? "red" : "green"} />
      </div>
      <div>
        <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 md:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <QuickActionCard icon={CreditCard} title="Make Payment" description="Pay your rent online" color="green" onClick={() => setActiveTab('payments')} />
          <QuickActionCard icon={MessageSquare} title="Submit Request" description="Maintenance or other requests" color="blue" onClick={() => setActiveTab('requests')} />
          <PremiumFeature feature={{ description: "Access to all your documents and contracts" }} requiredPlan="pro" currentPlan={tenantPlan} onUpgrade={() => setActiveTab('upgrade')}>
            <QuickActionCard icon={FolderArchive} title="View Documents" description="Access your documents" color="purple" onClick={() => setActiveTab('documents')} />
          </PremiumFeature>
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center text-base md:text-lg"><Activity className="w-4 h-4 md:w-5 md:h-5 mr-2" />Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {tenantStats.lastPayment && (<div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-green-50 dark:bg-green-900/20"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="font-medium text-slate-900 dark:text-slate-100 text-sm md:text-base">Payment Received</p><p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">₹{tenantStats.lastPayment.amount} on {tenantStats.lastPayment.date ? format(parseISO(tenantStats.lastPayment.date), 'MMM dd, yyyy') : 'N/A'}</p></div></div>)}
            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"><Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="font-medium text-slate-900 dark:text-slate-100 text-sm md:text-base">Profile Updated</p><p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Your profile information was last updated recently</p></div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'payments': return <PaymentPortal tenant={tenant} ownerState={ownerState} setOwnerState={setAppState} ownerId={ownerId} />;
      case 'documents': return <TenantDocuments tenant={tenant} />;
      case 'requests': return <TenantRequests tenant={tenant} property={property} setAppState={setAppState} ownerId={ownerId} />;
      case 'profile': return <TenantProfile tenant={tenant} ownerState={property} setOwnerState={updateOwnerState} />;
      case 'settings': return <TenantSettings tenant={tenant} setOwnerState={updateOwnerState} ownerState={property} />;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center space-x-2 md:space-x-4">
              <AppLogo className="w-6 h-6 md:w-8 md:h-8" variant="professional" />
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">EstateFlow</h1>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Tenant Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-4">
              <Button variant="ghost" size="sm" className="p-2" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</Button>
              <Popover onOpenChange={(open) => { if(!open) markNotificationsAsRead() }}>
                <PopoverTrigger asChild>
                   <Button variant="ghost" size="sm" className="p-2 relative">
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">You have {unreadCount} unread messages.</p>
                    </div>
                    <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} className={cn("p-3 rounded-md", n.isRead ? "bg-transparent" : "bg-blue-500/10")}>
                                <p className="text-sm font-medium">{n.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(parseISO(n.createdAt), { addSuffix: true })}</p>
                            </div>
                        )) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No notifications yet.</p>
                        )}
                    </div>
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="sm" className="p-2" onClick={onLogout}><LogOut className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="p-2 md:hidden" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200", activeTab === tab.id ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700")}><tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>{activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}</button>))}
            </div>
          </nav>
        </aside>
        <main className="flex-1 p-3 md:p-6">
          <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>{renderTabContent()}</motion.div></AnimatePresence>
        </main>
      </div>
      {isMobileMenuOpen && (<div className="fixed inset-0 z-50 md:hidden"><div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} /><div className="fixed top-0 left-0 w-72 h-full bg-white dark:bg-slate-800 p-4"><div className="flex items-center justify-between mb-6"><div className="flex items-center space-x-3"><AppLogo className="w-6 h-6" variant="professional" /><div><h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">EstateFlow</h1><p className="text-xs text-slate-600 dark:text-slate-400">Tenant Portal</p></div></div><Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}><X className="w-4 h-4" /></Button></div><nav className="space-y-2">{tabs.map((tab) => (<button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }} className={cn("w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200", activeTab === tab.id ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700")}><tab.icon className="w-5 h-5" /><span className="font-medium">{tab.label}</span>{activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}</button>))}
              <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><LogOut className="w-5 h-5" /><span className="font-medium">Logout</span></button></nav></div></div>)}
    </div>
  );
};

export default ProfessionalTenantDashboard;
