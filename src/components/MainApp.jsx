
"use client";

import { useState, useEffect, useReducer } from "react";
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
  Lock,
  FolderArchive,
  BrainCircuit,
  MoreHorizontal,
  IdCard,
  User,
  Building,
  ChevronDown,
  Mail
} from "lucide-react";
import AppLogo from "@/components/AppLogo";
import ProfessionalDashboard from "@/components/ProfessionalDashboard";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarProvider, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarContent, SidebarFooter, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Separator } from "./ui/separator";
import Upgrade from "./Upgrade";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import IdCards from "./IdCards";
import { useAppTheme } from "@/contexts/ThemeContext";
import OwnerProfile from "./OwnerProfile";
import Properties from "./Properties";
import MaintenanceRequests from "./MaintenanceRequests";
import PendingApprovals from "./PendingApprovals";
import Documents from "./Documents";
import AIAssistant from "./AIAssistant";
import NoticeBoard from "./NoticeBoard";
import { parseISO } from "date-fns";

// --- DATA HANDLING & CALCULATIONS ---
const calculateDues = (tenant) => {
    if (!tenant || !tenant.moveInDate) return { totalDue: 0, rentDue: 0, otherChargesDue: 0, breakdown: [] };

    const now = new Date();
    const moveInDate = parseISO(tenant.moveInDate);
    let monthsSinceMoveIn = (now.getFullYear() - moveInDate.getFullYear()) * 12 + now.getMonth() - moveInDate.getMonth();
    if (now.getDate() < moveInDate.getDate()) {
        monthsSinceMoveIn--;
    }
    monthsSinceMoveIn = Math.max(0, monthsSinceMoveIn);

    const totalPaid = (tenant.payments || []).reduce((acc, p) => acc + p.amount, 0);
    const totalRentOwed = (tenant.rent || 0) * (monthsSinceMoveIn + 1);
    const otherChargesDue = (tenant.otherCharges || []).reduce((acc, charge) => acc + charge.amount, 0);
    const totalOwed = totalRentOwed + otherChargesDue;
    const totalDue = totalOwed - totalPaid;

    return { totalDue: Math.max(0, totalDue) };
};


// --- CENTRALIZED STATE MANAGEMENT LOGIC (The "Brain") ---
const appReducer = (state, action) => {
  const { activePropertyId } = state;

  const updateProperty = (propertyId, updateFn) => {
    if (!propertyId) return state.properties;
    return state.properties.map(p => 
      p.id === propertyId ? updateFn(p) : p
    );
  };

  switch (action.type) {
    case 'SET_STATE':
        return action.payload;

    case 'SET_ACTIVE_PROPERTY':
      return { ...state, activePropertyId: action.payload };

    case 'ADD_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: [...(p.rooms || []), action.payload] }))
        };

    case 'UPDATE_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: (p.rooms || []).map(r => r.id === action.payload.id ? action.payload : r) }))
        };

    case 'DELETE_ROOM':
        return {
            ...state,
            properties: updateProperty(activePropertyId, p => ({ ...p, rooms: (p.rooms || []).filter(r => r.id !== action.payload.id) }))
        };

    case 'ADD_TENANT_AND_ADJUST_RENT': {
      const { newTenant: tenantData } = action.payload;
      
      const tenantNamePart = tenantData.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      
      const newTenant = {
          ...tenantData,
          loginId: `${tenantNamePart}-${randomNum}`,
          payments: [],
          otherCharges: [],
      };

      const properties = updateProperty(activePropertyId, property => {
        const updatedTenants = [...(property.tenants || []), newTenant];
        const room = (property.rooms || []).find(r => r.id === newTenant.roomId);

        if (room && room.rentSharing) {
            const tenantsInSameRoom = updatedTenants.filter(t => t.roomId === newTenant.roomId);
            if (tenantsInSameRoom.length > 0) {
                 const rentPerTenant = room.rent / tenantsInSameRoom.length;
                 const finalTenants = updatedTenants.map(t => {
                    if (t.roomId === newTenant.roomId) {
                        return { ...t, rent: rentPerTenant };
                    }
                    return t;
                });
                return { ...property, tenants: finalTenants };
            }
        }
        return { ...property, tenants: updatedTenants };
      });
      return { ...state, properties };
    }

    case 'APPLY_ELECTRICITY_BILL': {
      const { reading } = action.payload;
      const properties = updateProperty(activePropertyId, property => {
        const tenantsInRoom = (property.tenants || []).filter(t => t.roomId === reading.roomId);
        if (tenantsInRoom.length === 0) return property;
        
        const amountPerTenant = parseFloat(reading.totalAmount) / tenantsInRoom.length;

        const updatedTenants = property.tenants.map(t => {
          if (tenantsInRoom.some(tr => tr.id === t.id)) {
            const otherCharges = (t.otherCharges || []).filter(oc => oc.id !== `elec-${reading.id}`);
            otherCharges.push({
              id: `elec-${reading.id}`,
              amount: amountPerTenant,
              description: `Electricity Bill for ${new Date(reading.date).toLocaleString('default', { month: 'long' })}`,
              date: reading.date,
            });
            return { ...t, otherCharges };
          }
          return t;
        });

        const updatedElectricity = (property.electricity || []).map(r => r.id === reading.id ? { ...r, applied: true } : r);
        return { ...property, tenants: updatedTenants, electricity: updatedElectricity };
      });
      return { ...state, properties };
    }
    
    case 'UPDATE_PROPERTY_DATA': {
       const { key, data } = action.payload;
       return {
           ...state,
           properties: updateProperty(activePropertyId, p => ({ ...p, [key]: data }))
       };
    }
    
    case 'UPDATE_OWNER_DEFAULTS': {
        return {
            ...state,
            defaults: { ...(state.defaults || {}), ...action.payload }
        };
    }

    default:
      return state;
  }
};


// --- UI COMPONENTS ---

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, plan: 'standard', group: 'main' },
  { id: "profile", label: "Profile", icon: User, plan: 'standard', group: 'main' },
  { id: "properties", label: "Properties", icon: Building, plan: 'pro', group: 'management' },
  { id: "tenants", label: "Tenants", icon: Users, plan: 'standard', group: 'management' },
  { id: "id-cards", label: "ID Cards", icon: IdCard, plan: 'standard', group: 'management' },
  { id: "rooms", label: "Rooms", icon: DoorOpen, plan: 'standard', group: 'management' },
  { id: "payments", label: "Payments", icon: CreditCard, plan: 'standard', group: 'management' },
  { id: "requests", label: "Requests", icon: Wrench, plan: 'standard', group: 'operations' },
  { id: "approvals", label: "Approvals", icon: Mail, plan: 'standard', group: 'operations' },
  { id: "notices", label: "Notices", icon: Megaphone, plan: 'standard', group: 'operations' },
  { id: "insights", label: "Insights", icon: TrendingUp, plan: 'pro', group: 'analytics' },
  { id: "expenses", label: "Expenses", icon: Wallet, plan: 'pro', group: 'analytics' },
  { id: "electricity", label: "Electricity", icon: Zap, plan: 'pro', group: 'analytics' },
  { id: "reports", label: "Reports", icon: BarChart, plan: 'pro', group: 'analytics' },
  { id: "documents", label: "Documents", icon: FolderArchive, plan: 'business', group: 'analytics' },
  { id: "ai-assistant", label: "AI Assistant", icon: BrainCircuit, plan: 'business', group: 'analytics' },
  { id: "upgrade", label: "Upgrade", icon: Star, plan: 'standard', group: 'pro' },
];

const TAB_GROUPS = ['main', 'management', 'operations', 'analytics', 'pro'];

function AppContent({ activeTab, setActiveTab, ownerState, dispatch, user, activeProperty }) {
  const { isMobile } = useSidebar();
  const { setTheme, theme } = useTheme();
  const { theme: appTheme } = useAppTheme();
  
  const enhancedActiveProperty = {
      ...activeProperty,
      tenants: (activeProperty.tenants || []).map(t => ({ ...t, dues: calculateDues(t) }))
  };

  const renderTabContent = () => {
    const props = { appState: enhancedActiveProperty, setAppState: dispatch, user, setActiveTab, ownerState };

    switch (activeTab) {
      case "dashboard": return <ProfessionalDashboard {...props} />;
      case "profile": return <OwnerProfile appState={ownerState} setAppState={(...args) => dispatch({type: 'UPDATE_OWNER_DEFAULTS', payload: args[0](ownerState.defaults)})} user={user} />;
      case "properties": return <Properties appState={ownerState} setAppState={dispatch} setActivePropertyId={(id) => dispatch({type: 'SET_ACTIVE_PROPERTY', payload: id})} />;
      case "tenants": return <Tenants {...props} />;
      case "rooms": return <Rooms {...props} />;
      case "electricity": return <Electricity {...props} />;
      case "insights": return <Insights {...props} />;
      case "id-cards": return <IdCards {...props} />;
      case "payments": return <Payments {...props} />;
      case "requests": return <MaintenanceRequests {...props} appState={ownerState} />;
      case "approvals": return <PendingApprovals {...props} />;
      case "expenses": return <Expenses {...props} />;
      case "documents": return <Documents {...props} />;
      case "ai-assistant": return <AIAssistant {...props} />;
      case "reports": return <Reports {...props} />;
      case "notices": return <NoticeBoard {...props} />;
      case "settings": return <AppSettings appState={ownerState} setAppState={(...args) => dispatch({type: 'UPDATE_OWNER_DEFAULTS', payload: args[0](ownerState.defaults)})} user={user} />;
      case "upgrade": return <Upgrade appState={ownerState} setAppState={(...args) => dispatch({type: 'UPDATE_OWNER_DEFAULTS', payload: args[0](ownerState.defaults)})} onUpgradeSuccess={() => setActiveTab('dashboard')} />;
      default: return <ProfessionalDashboard {...props} />;
    }
  };

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
                    onCheckedChange={() => dispatch({type: 'SET_ACTIVE_PROPERTY', payload: prop.id})}
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
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="relative w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 group">
            <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-300 group-hover:text-indigo-400" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-slate-300 group-hover:text-indigo-400" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-300 font-medium">Online</span>
          </div>
        </div>
      </header>
      
      <main className="flex-1 overflow-auto p-6 relative">
        <div className="relative z-10 animate-fade-in">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default function MainApp({ onLogout, user, ownerState: initialOwnerState, setAppState: setGlobalAppState }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const { theme: appTheme } = useAppTheme();

  const [ownerState, dispatch] = useReducer(appReducer, initialOwnerState);

  useEffect(() => {
    if (typeof window !== 'undefined' && user?.username) {
      const savedState = localStorage.getItem(`estateFlowAppState_${user.username}`);
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          if (parsedState && parsedState.properties) {
            dispatch({ type: 'SET_STATE', payload: parsedState });
          }
        } catch (e) {
          console.error("Failed to parse saved state:", e);
        }
      }
    }
  }, [user?.username]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ownerState !== initialOwnerState) {
      localStorage.setItem(`estateFlowAppState_${user.username}`, JSON.stringify(ownerState));
    }
  }, [ownerState, user?.username, initialOwnerState]);


  if (!user || !ownerState) {
    return <div className="flex items-center justify-center min-h-screen w-full"><p>Loading...</p></div>;
  }

  useEffect(() => {
    if (!ownerState.properties || ownerState.properties.length === 0) {
      if(activeTab !== 'properties') setActiveTab('properties');
    } else if (!ownerState.activePropertyId || !ownerState.properties.find(p=>p.id === ownerState.activePropertyId)) {
        dispatch({ type: 'SET_ACTIVE_PROPERTY', payload: ownerState.properties[0].id });
    }
  }, [ownerState.properties, ownerState.activePropertyId, activeTab]);

  const activeProperty = ownerState.properties?.find(p => p.id === ownerState.activePropertyId);

  if (!activeProperty) {
     if (ownerState.properties && ownerState.properties.length > 0) {
        return <div className="flex items-center justify-center min-h-screen w-full"><p>Initializing Property...</p></div>;
     } else {
         return (
            <div className={`flex min-h-screen w-full bg-gradient-to-br ${appTheme.background} relative overflow-hidden`}>
                <div className="flex-1 flex flex-col"><Properties appState={ownerState} setAppState={dispatch} setActiveTab={setActiveTab} /></div>
            </div>
        );
     }
  }

  const handleTabClick = (tab) => {
    const planOrder = { standard: 1, pro: 2, business: 3 };
    const currentPlan = ownerState.defaults?.subscriptionPlan || 'standard';
    const currentPlanRank = planOrder[currentPlan] || 1;
    const requiredPlanRank = planOrder[tab.plan] || 1;
    
    if (tab.id === 'upgrade' || currentPlanRank < requiredPlanRank) {
      setActiveTab('upgrade');
      if(currentPlanRank < requiredPlanRank) {
        toast({ variant: "destructive", title: "Upgrade Required", description: `The "${tab.label}" feature is available on the ${tab.plan.charAt(0).toUpperCase() + tab.plan.slice(1)} plan.` });
      }
    } else {
      setActiveTab(tab.id);
    }
  }
  
  const pendingApprovalsCount = (ownerState.pendingApprovals || []).filter(p => p.type === 'payment').length;
  const pendingMaintenanceCount = (activeProperty.maintenanceRequests || []).filter(r => r.status === 'Pending').length;
  const currentPlan = ownerState.defaults?.subscriptionPlan || 'standard';
  const ownerName = ownerState.MOCK_USER_INITIAL?.name || user.name;
  const ownerPhoto = ownerState.MOCK_USER_INITIAL?.photoURL;

  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full bg-gradient-to-br ${appTheme.background} relative overflow-hidden`}>
        <Sidebar collapsible="icon" className={`border-r ${appTheme.border} ${appTheme.card} backdrop-blur-xl`}>
          <SidebarHeader className={`border-b ${appTheme.border} pb-4`}>
             <div className="flex items-center gap-3 p-3">
               <AppLogo className="w-10 h-10" iconClassName="w-6 h-6" variant={appTheme.isColorful ? 'default' : 'professional'} />
               <div className="flex flex-col">
                 <span className={`text-xl font-bold ${appTheme.isColorful ? 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent gradient-text-animated' : appTheme.text}`}>EstateFlow</span>
                 <p className={`text-xs ${appTheme.muted} font-medium`}>Owner Dashboard</p>
               </div>
             </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {TAB_GROUPS.map((group, index) => (
                <div key={group}>
                  {index > 0 && <Separator className="my-2" />}
                  <h4 className="font-semibold text-xs uppercase text-slate-400 px-3 my-2">{group}</h4>
                  {TABS.filter(tab => tab.group === group).map(tab => {
                    const planOrder = { standard: 1, pro: 2, business: 3 };
                    const currentPlanRank = planOrder[currentPlan] || 1;
                    const requiredPlanRank = planOrder[tab.plan] || 1;
                    const isLocked = currentPlanRank < requiredPlanRank && tab.id !== 'upgrade';
                    const hasPendingApprovals = tab.id === 'approvals' && pendingApprovalsCount > 0;

                    return (
                      <SidebarMenuItem key={tab.id}>
                        <SidebarMenuButton onClick={() => handleTabClick(tab)} isActive={activeTab === tab.id} disabled={isLocked}
                          className={cn(isLocked && "cursor-not-allowed opacity-50", hasPendingApprovals && "bg-gradient-to-r from-indigo-500/20 to-purple-500/20")}>
                          <tab.icon className="h-5 w-5" />
                          <span>{tab.label}</span>
                          {isLocked && <Lock className="ml-auto h-4 w-4" />}
                           {hasPendingApprovals && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </div>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-white/10 pt-4">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                        <Avatar className="h-10 w-10"><AvatarImage src={ownerPhoto} /><AvatarFallback>{ownerName?.charAt(0)}</AvatarFallback></Avatar>
                        <div className="overflow-hidden flex-1"><p className="text-sm font-semibold truncate">{ownerName}</p><p className="text-xs text-slate-400 truncate">{user.username}</p></div>
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 mb-2" align="end" side="top">
                    <DropdownMenuItem onClick={() => setActiveTab('profile')}><User className="mr-2 h-4 w-4"/>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('settings')}><Settings className="mr-2 h-4 w-4"/>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="text-red-400"><LogOut className="mr-2 h-4 w-4"/>Log Out</DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <AppContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ownerState={ownerState}
          dispatch={dispatch}
          user={user}
          activeProperty={activeProperty}
        />
      </div>
    </SidebarProvider>
  );
}
