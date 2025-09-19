
"use client";

import { 
  Users, DoorOpen, IndianRupee, Wallet, PiggyBank, UserPlus, DoorClosed, 
  CreditCard, Home, Briefcase, FileText, TrendingUp, TrendingDown, Scale,
  Activity, BarChart3, Calendar, AlertCircle, CheckCircle, Clock, Star,
  ArrowUpRight, ArrowDownRight, Eye, Settings, Bell, Zap, Shield, Wrench, Info,
  Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { differenceInDays, parseISO, formatDistanceToNow, isValid, format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMemo } from 'react';
import { useAppTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import PendingApprovals from './PendingApprovals'; // Import the new component

const ProfessionalDashboard = ({ appState, setActiveTab, setAppState, ownerId }) => {
  const { tenants, rooms, payments, electricity, expenses = [], pendingApprovals = [] } = appState;
  const { theme: appTheme } = useAppTheme();

  const totalTenants = tenants.length;
  const totalRooms = rooms.length;
  const occupiedRoomsCount = new Set(tenants.map(t => t.unitNo)).size;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0;

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  
  const thisMonthPayments = payments.filter(p => {
    const paymentDate = new Date(p.date);
    return paymentDate.getMonth() === thisMonth && paymentDate.getFullYear() === thisYear;
  });

  const monthlyRevenue = thisMonthPayments.reduce((sum, p) => sum + p.amount, 0);
  
  const thisMonthExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
  });
  const monthlyExpenses = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const netProfit = monthlyRevenue - monthlyExpenses;

  // Calculate overdue payments
  const overduePayments = tenants.filter(tenant => {
    const lastPayment = payments
      .filter(p => p.tenantId === tenant.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    
    if (!lastPayment) return true;
    return differenceInDays(new Date(), parseISO(lastPayment.date)) > 30;
  });

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities = [];
    
    const recentPayments = payments
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    recentPayments.forEach(payment => {
      const tenant = tenants.find(t => t.id === payment.tenantId);
      if (tenant) {
        activities.push({
          id: `payment-${payment.id}`,
          type: 'payment',
          title: 'Payment Received',
          description: `₹${payment.amount.toLocaleString()} from ${tenant.name}`,
          time: formatDistanceToNow(parseISO(payment.date), { addSuffix: true }),
          icon: CreditCard,
          color: 'green'
        });
      }
    });

    const newTenants = tenants
      .filter(t => t.moveInDate && differenceInDays(new Date(), parseISO(t.moveInDate)) <= 7)
      .slice(0, 2);
    
    newTenants.forEach(tenant => {
      activities.push({
        id: `tenant-${tenant.id}`,
        type: 'tenant',
        title: 'New Tenant',
        description: `${tenant.name} moved into ${tenant.room}`,
        time: formatDistanceToNow(parseISO(tenant.moveInDate), { addSuffix: true }),
        icon: UserPlus,
        color: 'blue'
      });
    });

    return activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  }, [payments, tenants]);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "blue", onClick }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-${color}-200/50 hover:border-${color}-300/50 bg-gradient-to-br from-${color}-50/50 to-${color}-100/50 dark:from-${color}-900/20 dark:to-${color}-800/20`}
        onClick={onClick}
      >
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
              {trend === 'up' ? (
                <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs md:text-sm ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, onClick, color = "blue" }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-${color}-200/50 hover:border-${color}-300/50 bg-gradient-to-br from-${color}-50/50 to-${color}-100/50 dark:from-${color}-900/20 dark:to-${color}-800/20`}
        onClick={onClick}
      >
        <CardContent className="p-3 md:p-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex-shrink-0`}>
              <Icon className={`w-4 h-4 md:w-5 md:h-5 text-${color}-600 dark:text-${color}-400`} />
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

  return (
    <div className="space-y-4 md:space-y-8 p-4 md:p-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Welcome to EstateFlow</h1>
                            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mt-1">Professional property management dashboard</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"><CheckCircle className="w-3 h-3 mr-1" />System Online</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6">Key Metrics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatCard title="Total Tenants" value={totalTenants} subtitle="Active residents" icon={Users} trend="up" trendValue="+12%" color="blue" onClick={() => setActiveTab('tenants')} />
                <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} subtitle={`${occupiedRoomsCount}/${totalRooms} rooms`} icon={DoorOpen} trend="up" trendValue="+5%" color="green" onClick={() => setActiveTab('rooms')} />
                <StatCard title="Monthly Revenue" value={`₹${monthlyRevenue.toLocaleString()}`} subtitle="This month" icon={IndianRupee} trend="up" trendValue="+8%" color="purple" onClick={() => setActiveTab('payments')} />
                <StatCard title="Net Profit" value={`₹${netProfit.toLocaleString()}`} subtitle="After expenses" icon={TrendingUp} trend={netProfit > 0 ? "up" : "down"} trendValue={netProfit > 0 ? "+15%" : "-3%"} color={netProfit > 0 ? "green" : "red"} onClick={() => setActiveTab('expenses')} />
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 md:mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <QuickActionCard icon={UserPlus} title="Add Tenant" description="Register new tenant" color="blue" onClick={() => setActiveTab('tenants')} />
                <QuickActionCard icon={CreditCard} title="Record Payment" description="Log rent payment" color="green" onClick={() => setActiveTab('payments')} />
                <QuickActionCard icon={Wrench} title="Maintenance" description="Handle requests" color="orange" onClick={() => setActiveTab('requests')} />
                <QuickActionCard icon={BarChart3} title="View Reports" description="Analytics & insights" color="purple" onClick={() => setActiveTab('reports')} />
            </div>
        </motion.div>
        
        <PendingApprovals ownerState={appState} setOwnerState={setAppState} ownerId={ownerId} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><Activity className="w-5 h-5 mr-2" />Recent Activity</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                        <div className={`p-1.5 md:p-2 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex-shrink-0`}><activity.icon className={`w-3 h-3 md:w-4 md:h-4 text-${activity.color}-600 dark:text-${activity.color}-400`} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm md:text-base truncate">{activity.title}</p>
                                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">{activity.description}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-500">{activity.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 md:py-8 text-slate-500 dark:text-slate-400"><Activity className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-50" /><p className="text-sm md:text-base">No recent activity</p></div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <Card>
                    <CardHeader><CardTitle className="flex items-center"><Bell className="w-5 h-5 mr-2" />Alerts & Notifications</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3 md:space-y-4">
                            {overduePayments.length > 0 && (
                                <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-red-900 dark:text-red-100 text-sm md:text-base">Overdue Payments</p>
                                        <p className="text-xs md:text-sm text-red-700 dark:text-red-300">{overduePayments.length} tenant(s) have overdue payments</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"><Info className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="font-medium text-blue-900 dark:text-blue-100 text-sm md:text-base">System Update</p><p className="text-xs md:text-sm text-blue-700 dark:text-blue-300">New features available in the latest update</p></div></div>
                            <div className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"><CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="font-medium text-green-900 dark:text-green-100 text-sm md:text-base">All Systems Operational</p><p className="text-xs md:text-sm text-green-700 dark:text-green-300">All services are running smoothly</p></div></div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    </div>
  );
};

export default ProfessionalDashboard;
