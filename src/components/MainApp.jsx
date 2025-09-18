
"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  DoorOpen,
  CreditCard,
  Zap,
  BarChart,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  Wallet,
  TrendingUp,
  Wrench,
  Megaphone,
  Star,
  CheckCircle,
  Lock,
  FolderArchive,
  BrainCircuit,
  MoreHorizontal,
  Crown,
  IdCard,
  User,
  Building,
  ChevronDown,
} from "lucide-react";
import AppLogo from "@/components/AppLogo";
import ProfessionalDashboard from "@/components/Dashboard";
import Tenants from "@/components/Tenants";
import Rooms from "@/components/Rooms";
import Payments from "@/components/Payments";
import Electricity from "@/components/Electricity";
import Reports from "@/components/Reports";
import AppSettings from "@/components/Settings";
import Expenses from "@/components/Expenses";
import Insights from "@/components/Insights";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Separator } from "./ui/separator";
import Approvals from "./Approvals";
import NoticeBoard from "./NoticeBoard";
import { differenceInDays, parseISO } from 'date-fns';
import Upgrade from "./Upgrade";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import Documents from "./Documents";
import AIAssistant from "./AIAssistant";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import IdCards from "./IdCards";
import { useAppTheme } from "@/contexts/ThemeContext";
import OwnerProfile from "./OwnerProfile";
import Properties from "./Properties";


const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, plan: 'standard', group: 'main' },
  { id: "profile", label: "Profile", icon: User, plan: 'standard', group: 'main' },
  { id: "properties", label: "Properties", icon: Building, plan: 'pro', group: 'management' },
  { id: "tenants", label: "Tenants", icon: Users, plan: 'standard', group: 'management' },
  { id: "id-cards", label: "ID Cards", icon: IdCard, plan: 'standard', group: 'management' },
  { id: "rooms", label: "Rooms", icon: DoorOpen, plan: 'standard', group: 'management' },
  { id: "payments", label: "Payments", icon: CreditCard, plan: 'standard', group: 'management' },
  { id: "requests", label: "Requests", icon: Wrench, plan: 'standard', group: 'operations' },
  { id: "notices", label: "Notices", icon: Megaphone, plan: 'standard', group: 'operations' },
  { id: "insights", label: "Insights", icon: TrendingUp, plan: 'pro', group: 'analytics' },
  { id: "expenses", label: "Expenses", icon: Wallet, plan: 'pro', group: 'analytics' },
  { id: "electricity", label: "Electricity", icon: Zap, plan: 'pro', group: 'analytics' },
  { id: "reports", label: "Reports", icon: BarChart, plan: 'pro', group: 'analytics' },
  { id: "documents", label: "Documents", icon: FolderArchive, plan: 'business', group: 'analytics' },
  { id: "ai-assistant", label: "AI Assistant", icon: BrainCircuit, plan: 'business', group: 'analytics' },
];

const TAB_GROUPS = ['main', 'management', 'operations', 'analytics'];


function AppContent({ activeTab, setActiveTab, ownerState, setOwnerState, user, activeProperty, setActivePropertyId }) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const { theme: appTheme } = useAppTheme();
  
  const renderTabContent = () => {
    // Pass activeProperty to all components that need it
    const props = { appState: activeProperty, setAppState: setOwnerState, user, setActiveTab, ownerState };
    switch (activeTab) {
      case "dashboard":
        return <ProfessionalDashboard {...props} />;
      case "profile":
        return <OwnerProfile appState={ownerState} setAppState={setOwnerState} user={user} />;
      case "properties":
        return <Properties appState={ownerState} setAppState={setOwnerState} setActivePropertyId={setActivePropertyId} />;
      case "insights":
        return <Insights {...props} />;
      case "tenants":
        return <Tenants {...props} ownerState={ownerState}/>;
      case "id-cards":
        return <IdCards {...props} />;
      case "rooms":
        return <Rooms {...props} />;
      case "payments":
        return <Payments {...props} />;
      case "requests":
        return <Approvals {...props} />;
      case "electricity":
        return <Electricity {...props} />;
      case "expenses":
        return <Expenses {...props} />;
      case "documents":
        return <Documents {...props} />;
      case "ai-assistant":
        return <AIAssistant {...props} />;
      case "reports":
        return <Reports {...props} />;
      case "notices":
        return <NoticeBoard {...props} />;
      case "settings":
        return <AppSettings appState={ownerState} setAppState={setOwnerState} user={user} />;
      case "upgrade":
        return <Upgrade appState={ownerState} setAppState={setOwnerState} onUpgradeSuccess={() => setActiveTab('dashboard')} />;
      default:
        return <ProfessionalDashboard {...props} />;
    }
  };

  const currentTabInfo = TABS.find(t => t.id === activeTab) || {};
  const currentTabLabel = activeTab === 'upgrade' ? 'Upgrade Plan' : (currentTabInfo.label || 'Dashboard');

  return (
    <div className={`flex-1 flex flex-col bg-gradient-to-br ${appTheme.card} backdrop-blur-xl relative`}>
      <header className={`sticky top-0 z-30 flex h-16 items-center gap-4 border-b ${appTheme.border} ${appTheme.card} backdrop-blur-2xl px-6 shadow-2xl ${appTheme.glow}`}>
        {isMobile && <SidebarTrigger className={`${appTheme.text} hover:bg-white/10`} />}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-xl font-bold p-2 h-auto">
                <Building className="w-6 h-6 text-primary" />
                <span className="truncate max-w-xs">{activeProperty.name}</span>
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Switch Property</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ownerState.properties.map(prop => (
                <DropdownMenuCheckboxItem
                    key={prop.id}
                    checked={prop.id === activeProperty.id}
                    onCheckedChange={() => setActivePropertyId(prop.id)}
                >
                    {prop.name}
                </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setActiveTab('properties')}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Properties
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-300 group-hover:text-indigo-400" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300 group-hover:text-indigo-400" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300 font-medium">Online</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6 relative">
        {appTheme.isColorful && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        )}
        
        <div className="relative z-10 animate-fade-in">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default function MainApp({ onLogout, user, ownerState, setAppState }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { theme: appTheme } = useAppTheme();
  
  const setActivePropertyId = (propertyId) => {
    setOwnerState(prev => ({ ...prev, activePropertyId: propertyId }));
  };

  const activeProperty = ownerState.properties?.find(p => p.id === ownerState.activePropertyId) || ownerState.properties?.[0];

  if (!activeProperty) {
    // This can happen if the last active property was deleted.
    // Fallback to the first property or handle empty state.
    if (ownerState.properties?.length > 0) {
        setActivePropertyId(ownerState.properties[0].id);
    }
    // If there are no properties, the profile setup screen will be shown.
    return null; // Or a loading/empty state
  }

  const setOwnerState = (updater) => {
    setAppState(prevAppState => {
        const newOwnerState = typeof updater === 'function' ? updater(prevAppState[user.username]) : updater;
        return {
            ...prevAppState,
            [user.username]: newOwnerState
        };
    });
  };

  const pendingApprovalsCount = (activeProperty.pendingApprovals || []).length;
  const pendingMaintenanceCount = (activeProperty.maintenanceRequests || []).filter(r => r.status === 'Pending').length;
  const pendingUpdateRequestsCount = (activeProperty.updateRequests || []).length;
  const totalPendingRequests = pendingApprovalsCount + pendingMaintenanceCount + pendingUpdateRequestsCount;

  const currentPlan = ownerState.defaults?.subscriptionPlan || 'standard';
  const isPro = currentPlan === 'pro' || currentPlan === 'business';
  const isBusiness = currentPlan === 'business';

  const handleTabClick = (tab) => {
    const planOrder = { standard: 1, pro: 2, business: 3 };
    const currentPlanRank = planOrder[currentPlan] || 1;
    const requiredPlanRank = planOrder[tab.plan] || 1;
    
    if (currentPlanRank < requiredPlanRank) {
      setActiveTab('upgrade');
      toast({
        variant: "destructive",
        title: "Upgrade Required",
        description: `The "${tab.label}" feature is only available on the ${tab.plan.charAt(0).toUpperCase() + tab.plan.slice(1)} plan or higher.`
      });
    } else {
      setActiveTab(tab.id);
    }
  }

  const ownerName = ownerState.MOCK_USER_INITIAL?.name || user.name;
  const ownerPhoto = ownerState.MOCK_USER_INITIAL?.photoURL;

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full bg-gradient-to-br ${appTheme.background} relative overflow-hidden`}>
        {appTheme.isColorful && (
          <>
            <div className="absolute inset-0 cyber-grid opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5"></div>
          </>
        )}
        
        <Sidebar collapsible="icon" className={`border-r ${appTheme.border} ${appTheme.card} backdrop-blur-xl`}>
          <SidebarHeader className={`border-b ${appTheme.border} pb-4`}>
            <div className="flex items-center gap-3 p-3">
              <div className="relative">
                <AppLogo 
                  className="w-10 h-10" 
                  iconClassName="w-6 h-6" 
                  variant={appTheme.isColorful ? 'default' : 'professional'} 
                />
                {appTheme.isColorful && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-sm"></div>
                )}
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-bold ${appTheme.isColorful ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-text-animated' : appTheme.text}`}>
                  EstateFlow
                </span>
                <p className={`text-xs ${appTheme.muted} font-medium`}>Owner Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
             <SidebarMenu>
              {TAB_GROUPS.map((group, index) => (
                <div key={group}>
                  {index > 0 && <Separator className="my-2" />}
                  {TABS.filter(tab => tab.group === group).map(tab => {
                    const planOrder = { standard: 1, pro: 2, business: 3 };
                    const currentPlanRank = planOrder[currentPlan] || 1;
                    const requiredPlanRank = planOrder[tab.plan] || 1;
                    const isLocked = currentPlanRank < requiredPlanRank;
                    const hasPendingRequests = tab.id === 'requests' && totalPendingRequests > 0;
                    
                    return (
                      <SidebarMenuItem key={tab.id}>
                        <SidebarMenuButton
                          onClick={() => handleTabClick(tab)}
                          isActive={activeTab === tab.id}
                          tooltip={{ children: tab.label }}
                          disabled={isLocked}
                          className={cn(
                            "relative group transition-all duration-300 rounded-xl mx-1",
                            isLocked && "cursor-not-allowed opacity-50",
                            hasPendingRequests && "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white font-semibold border border-indigo-500/30",
                            activeTab === tab.id && !isLocked && "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/40",
                            !activeTab === tab.id && !isLocked && "hover:bg-white/5 hover:text-white text-slate-300"
                          )}
                        >
                          {activeTab === tab.id && !isLocked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-sm -z-10"></div>
                          )}
                          
                          <div className="flex items-center gap-3 w-full">
                            <tab.icon className={cn(
                              "h-5 w-5 transition-colors",
                              activeTab === tab.id && !isLocked && "text-indigo-300",
                              !activeTab === tab.id && !isLocked && "text-slate-400 group-hover:text-white"
                            )} />
                            <span className="font-medium">{tab.label}</span>
                            
                            {tab.id === 'requests' && totalPendingRequests > 0 && (
                              <span className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg shadow-red-500/25 animate-pulse">
                                {totalPendingRequests}
                              </span>
                            )}
                            
                            {isLocked && (
                              <Badge variant="outline" className="ml-auto bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30 text-xs font-semibold">
                                {tab.plan.charAt(0).toUpperCase() + tab.plan.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-white/10 pt-4">
            <div className="p-3 mb-4">
              {currentPlan === 'standard' ? (
                <Button 
                  className="w-full font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/50 hover:scale-105 tech-button rounded-xl py-3" 
                  onClick={() => setActiveTab('upgrade')}
                >
                  <Star className="mr-3 h-5 w-5" />
                  <span className="text-sm">Upgrade to Pro</span>
                </Button>
              ) : (
                <div 
                  className={cn(
                    "w-full text-center p-3 rounded-xl text-sm font-semibold flex items-center justify-center border transition-all duration-300",
                    currentPlan === 'pro' && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30 shadow-lg shadow-blue-500/20",
                    currentPlan === 'business' && "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border-violet-500/30 shadow-lg shadow-violet-500/20"
                  )}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  <span>{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan</span>
                </div>
              )}
            </div>
            
            <Separator className="my-3 bg-white/10" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all duration-300 group border border-transparent hover:border-white/10",
                  isBusiness && 'premium-glow'
                )}>
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarImage src={ownerPhoto} alt={ownerName} />
                      <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold">
                        {ownerName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isBusiness && (
                      <Crown className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 rotate-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse" />
                    )}
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></div>
                  </div>
                  
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-semibold truncate text-white group-hover:text-indigo-300 transition-colors">
                      {ownerName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user.username}
                    </p>
                  </div>
                  
                  <MoreHorizontal className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64 mb-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 shadow-2xl" align="end" side="top">
                <DropdownMenuLabel className="text-slate-300 font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                
                 <DropdownMenuItem 
                  onClick={() => setActiveTab('profile')}
                  className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => setActiveTab('settings')}
                  className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={() => setActiveTab('upgrade')}
                  className="text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Star className="mr-3 h-4 w-4" />
                  <span>Manage Plan</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem 
                  onClick={onLogout} 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors focus:text-red-300"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <AppContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ownerState={ownerState}
          setOwnerState={setOwnerState}
          user={user}
          activeProperty={activeProperty}
          setActivePropertyId={setActivePropertyId}
        />
      </div>
    </SidebarProvider>
  );
}

    