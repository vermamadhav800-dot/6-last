
"use client";

import {
  Users, DoorOpen, IndianRupee, Wallet, PiggyBank, UserPlus, FilePlus, Home,
  TrendingUp, Activity, BarChart3, Bell, ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar
} from 'recharts';
import { differenceInDays, parseISO, formatDistanceToNow, isValid, format, subMonths, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

const KedeStatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: `0 10px 20px -5px rgba(var(--color-${color}-500), 0.3)` }} 
    className="h-full"
    onClick={onClick}
  >
    <Card className={`bg-gradient-to-br from-slate-900 to-slate-800 border-l-4 border-${color}-500 text-white cursor-pointer h-full flex flex-col justify-between`}>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <Icon className={`h-5 w-5 text-${color}-400`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const ProfessionalDashboard = ({ appState, setActiveTab }) => {
  const { tenants = [], rooms = [], payments = [], expenses = [] } = appState;

  const {
    totalTenants,
    totalRooms,
    occupiedRoomsCount,
    occupancyRate,
    totalDues,
  } = useMemo(() => {
    const totalTenants = tenants.length;
    const totalRooms = rooms.length;
    const occupiedRooms = new Set(tenants.map(t => t.roomId));
    const occupiedRoomsCount = occupiedRooms.size;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRoomsCount / totalRooms) * 100) : 0;
    const totalDues = tenants.reduce((acc, tenant) => acc + (tenant.dues?.totalDue || 0), 0);
    return { totalTenants, totalRooms, occupiedRoomsCount, occupancyRate, totalDues };
  }, [tenants, rooms]);

  const revenueData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const monthDate = subMonths(today, i);
        const monthStart = startOfMonth(monthDate);
        
        const monthlyRevenue = (payments || []).filter(p => {
            const paymentDate = parseISO(p.date);
            return isValid(paymentDate) && paymentDate.getFullYear() === monthStart.getFullYear() && paymentDate.getMonth() === monthStart.getMonth();
        }).reduce((sum, p) => sum + p.amount, 0);

        data.push({
            name: format(monthStart, 'MMM'),
            revenue: monthlyRevenue,
        });
    }
    return data;
  }, [payments]);

  const recentActivity = useMemo(() => {
    const activities = [];
    (payments || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2).forEach(p => {
        const tenant = tenants.find(t => t.id === p.tenantId);
        if(tenant) activities.push({ id: `pay-${p.id}`, type: 'payment', desc: `₹${p.amount} from ${tenant.name}`, time: parseISO(p.date), icon: IndianRupee, color: 'green'});
    });
    (tenants || []).slice().sort((a, b) => new Date(b.moveInDate) - new Date(a.moveInDate)).slice(0, 2).forEach(t => {
        if(differenceInDays(new Date(), parseISO(t.moveInDate)) <= 15) {
             activities.push({ id: `new-${t.id}`, type: 'tenant', desc: `${t.name} moved in`, time: parseISO(t.moveInDate), icon: UserPlus, color: 'blue'});
        }
    });
    return activities.sort((a, b) => b.time - a.time).slice(0, 4);
  }, [tenants, payments, rooms]);
  
  const totalRevenue = revenueData.reduce((acc, month) => acc + month.revenue, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KedeStatCard title="Total Tenants" value={totalTenants} subtitle="Active residents" icon={Users} color="blue" onClick={() => setActiveTab('tenants')} />
        <KedeStatCard title="Occupancy" value={`${occupancyRate}%`} subtitle={`${occupiedRoomsCount} / ${totalRooms} Rooms`} icon={DoorOpen} color="green" onClick={() => setActiveTab('rooms')} />
        <KedeStatCard title="Total Revenue (6M)" value={`₹${(totalRevenue/1000).toFixed(1)}k`} subtitle="Last 6 months" icon={TrendingUp} color="purple" onClick={() => setActiveTab('payments')} />
        <KedeStatCard title="Total Dues" value={`₹${(totalDues/1000).toFixed(1)}k`} subtitle="Pending from tenants" icon={Wallet} color="red" onClick={() => setActiveTab('payments')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-2">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-white h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center"><BarChart3 className="mr-2 text-purple-400" />Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white' }}
                    labelStyle={{ color: '#94a3b8' }}
                    itemStyle={{ color: '#a78bfa' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                  />
                  <Bar dataKey="revenue" fill="rgba(167, 139, 250, 0.4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
           <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-white h-[350px] flex flex-col">
              <CardHeader>
                  <CardTitle className="flex items-center"><Zap className="mr-2 text-yellow-400" />Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 justify-around">
                  <Button variant="outline" className="w-full bg-transparent border-blue-500 hover:bg-blue-500/20 text-white" onClick={() => setActiveTab('tenants')}><UserPlus className="mr-2 h-4 w-4" /> Add New Tenant</Button>
                  <Button variant="outline" className="w-full bg-transparent border-green-500 hover:bg-green-500/20 text-white" onClick={() => setActiveTab('rooms')}><Home className="mr-2 h-4 w-4" /> Add New Room</Button>
                  <Button variant="outline" className="w-full bg-transparent border-purple-500 hover:bg-purple-500/20 text-white" onClick={() => setActiveTab('payments')}><IndianRupee className="mr-2 h-4 w-4" /> Log a Payment</Button>
                  <Button variant="outline" className="w-full bg-transparent border-orange-500 hover:bg-orange-500/20 text-white" onClick={() => setActiveTab('expenses')}><FilePlus className="mr-2 h-4 w-4" /> Log an Expense</Button>
              </CardContent>
           </Card>
        </motion.div>
      </div>

       <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700 text-white">
                <CardHeader>
                    <CardTitle className="flex items-center"><Activity className="mr-2 text-pink-400" />Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-slate-800/60">
                                    <div className={`p-2 rounded-full bg-${activity.color}-500/20`}>
                                      <activity.icon className={`h-5 w-5 text-${activity.color}-400`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{activity.desc}</p>
                                        <p className="text-xs text-slate-400">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No recent activity to show</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    </motion.div>
  );
};

export default ProfessionalDashboard;
