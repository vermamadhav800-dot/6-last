
"use client";

import { useState, useEffect } from "react";
import StartupScreen from "@/components/StartupScreen";
import ProfessionalAuth from "@/components/ProfessionalAuth";
import MainApp from "@/components/MainApp";
import ProfessionalTenantDashboard from "@/components/TenantDashboard";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks";
import { INITIAL_APP_STATE } from "@/lib/consts";
import OwnerProfile from "@/components/OwnerProfile";

export default function Home() {
  const [isStartupLoading, setIsStartupLoading] = useState(true);
  const [authStorage, setAuthStorage] = useLocalStorage("auth", { user: null, role: null });
  const [auth, setAuth] = useState(authStorage);
  const [appState, setAppState] = useLocalStorage("appState_v2", {});
  const { toast } = useToast();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempPhone, setTempPhone] = useState(null);

  useEffect(() => {
    const startupTimer = setTimeout(() => {
      setIsStartupLoading(false);
    }, 2000);
    return () => clearTimeout(startupTimer);
  }, []);

  useEffect(() => {
    setAuthStorage(auth);
  }, [auth, setAuthStorage]);

  // Migration: Move single-property data to multi-property structure
  useEffect(() => {
    setAppState(currentAppState => {
      let needsUpdate = false;
      const updatedState = JSON.parse(JSON.stringify(currentAppState));
      
      for (const ownerKey in updatedState) {
        const ownerState = updatedState[ownerKey];
        if (ownerState && !ownerState.properties) {
            needsUpdate = true;
            const defaultProperty = {
                id: `prop_${Date.now()}`,
                name: ownerState.defaults?.propertyName || 'Default Property',
                address: ownerState.defaults?.propertyAddress || '',
                tenants: ownerState.tenants || [],
                rooms: ownerState.rooms || [],
                payments: ownerState.payments || [],
                electricity: ownerState.electricity || [],
                expenses: ownerState.expenses || [],
                pendingApprovals: ownerState.pendingApprovals || [],
                updateRequests: ownerState.updateRequests || [],
                maintenanceRequests: ownerState.maintenanceRequests || [],
                notifications: ownerState.notifications || [],
                globalNotices: ownerState.globalNotices || [],
            };
            
            ownerState.properties = [defaultProperty];
            ownerState.activePropertyId = defaultProperty.id;

            // Remove old top-level keys
            delete ownerState.tenants;
            delete ownerState.rooms;
            delete ownerState.payments;
            delete ownerState.electricity;
            delete ownerState.expenses;
            delete ownerState.pendingApprovals;
            delete ownerState.updateRequests;
            delete ownerState.maintenanceRequests;
            delete ownerState.notifications;
            delete ownerState.globalNotices;
        }
      }
      if (needsUpdate) return updatedState;
      return currentAppState;
    });
  }, [setAppState]);

  // One-time tenant ID migration (now inside properties)
  useEffect(() => {
    setAppState(currentAppState => {
        let needsUpdate = false;
        const updatedState = JSON.parse(JSON.stringify(currentAppState));
        for (const ownerKey in updatedState) {
            if (updatedState[ownerKey] && updatedState[ownerKey].properties) {
                updatedState[ownerKey].properties.forEach(property => {
                    if (property.tenants) {
                        property.tenants.forEach(tenant => {
                            if (!tenant.tenantId) {
                                needsUpdate = true;
                                tenant.tenantId = Math.floor(100000 + Math.random() * 900000).toString();
                            }
                        });
                    }
                });
            }
        }
        if (needsUpdate) return updatedState;
        return currentAppState;
    });
  }, [setAppState]);

  // Effect to show profile completion toast
  useEffect(() => {
    if (auth.role === 'owner' && auth.user?.username) {
        const ownerData = appState[auth.user.username];
        if (ownerData) {
            const isProfileComplete = ownerData.properties && ownerData.properties.length > 0 && ownerData.properties[0].name;
            if (!isProfileComplete) {
                toast({
                    title: "Welcome! Let's set up your profile.",
                    description: "Please fill in your property details to continue.",
                    duration: 5000,
                });
            }
        }
    }
  }, [auth.role, auth.user?.username, appState, toast]);

  const handleAuth = async (credentials, action) => {
    setIsLoading(true);

    try {
        if (action === 'login-phone-start') {
            const normalizedPhone = (credentials.phone || '').replace(/\D/g, '').slice(-10);
            const owner = Object.values(appState).find(owner => owner?.MOCK_USER_INITIAL?.phone === credentials.phone);
            if (!owner) {
                const ownerByNormalized = Object.values(appState).find(owner => (owner?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === normalizedPhone);
                if (!ownerByNormalized) {
                    toast({ variant: "destructive", title: "Login Failed", description: "Phone number not registered to any owner." });
                    setIsLoading(false);
                    return false;
                }
                setTempPhone(ownerByNormalized.MOCK_USER_INITIAL.phone);
                setIsOtpSent(true);
                toast({ title: "OTP Sent", description: "Use the demo OTP: 151515" });
                setIsLoading(false);
                return true;
            }
            setTempPhone(credentials.phone);
            setIsOtpSent(true);
            toast({ title: "OTP Sent", description: "Use the demo OTP: 151515" });
            setIsLoading(false);
            return true;
        }

        if (action === 'login-phone-verify') {
            if (credentials.otp !== '151515') {
                toast({ variant: "destructive", title: "Login Failed", description: "Invalid OTP. Please use the demo OTP." });
                setIsLoading(false);
                return false;
            }

            const ownerData = Object.values(appState).find(ownerState => ownerState?.MOCK_USER_INITIAL?.phone === tempPhone
              || (ownerState?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === (tempPhone || '').replace(/\D/g, '').slice(-10));
            if (ownerData) {
                setAuth({ user: ownerData.MOCK_USER_INITIAL, role: 'owner' });
                toast({ title: "Login Successful", description: "Welcome back!" });
                setIsLoading(false);
                setTempPhone(null);
                setIsOtpSent(false);
                return true;
            }
            toast({ variant: "destructive", title: "Login Failed", description: "Could not find user data." });
            setIsLoading(false);
            return false;
        }

        if (action === 'login') { // Tenant login
            for (const ownerKey in appState) {
                const ownerData = appState[ownerKey];
                if (ownerData && ownerData.properties) {
                    for (const property of ownerData.properties) {
                        const tenant = property.tenants?.find(t => t.phone === credentials.username && t.tenantId === credentials.tenantId);
                        if (tenant) {
                            setAuth({ user: tenant, role: 'tenant', ownerId: ownerKey, propertyId: property.id });
                            toast({ title: "Login Successful", description: `Welcome, ${tenant.name}!` });
                            setIsLoading(false);
                            return true;
                        }
                    }
                }
            }
        } else if (action === 'register') { // Owner registration
            const normalizedPhone = (credentials.phone || '').replace(/\D/g, '').slice(-10);
            const phoneExists = Object.values(appState).some(owner => (owner?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === normalizedPhone);
            if (phoneExists) {
                toast({ variant: "destructive", title: "Registration Failed", description: "An account with this phone number already exists." });
                setIsLoading(false);
                return false;
            }
            
            const newOwner = {
                name: credentials.name,
                username: normalizedPhone,
                phone: normalizedPhone,
                email: '',
                password: credentials.password,
                createdAt: new Date().toISOString(),
            };

            const newOwnerState = {
                ...INITIAL_APP_STATE,
                MOCK_USER_INITIAL: newOwner,
            };

            setAppState(prev => ({...prev, [normalizedPhone]: newOwnerState}));
            toast({ title: "Registration Successful", description: "Your account has been created. Please sign in." });
            setIsLoading(false);
            return true;
        }
    } catch (error) {
        console.error("Auth Error:", error);
        toast({ variant: "destructive", title: "Authentication Error", description: "An unexpected error occurred." });
    }
    setIsLoading(false);
    return false;
  };

  const handleLogout = () => {
    setAuth({ user: null, role: null });
    setIsOtpSent(false);
    setTempPhone(null);
  };
  
  const setOwnerState = (updater) => {
    if (!auth.user || !auth.user.username) return;
    setAppState(prevAppState => {
      const currentOwnerState = prevAppState[auth.user.username] || INITIAL_APP_STATE;
      const newOwnerState = typeof updater === 'function' ? updater(currentOwnerState) : updater;
      return {
        ...prevAppState,
        [auth.user.username]: newOwnerState
      };
    });
  };

  const renderContent = () => {
      if (isStartupLoading) return <StartupScreen />;
      
      if (auth.user) {
          if (auth.role === 'owner') {
             const ownerData = appState[auth.user.username];
             if (!ownerData) {
                handleLogout();
                return <ProfessionalAuth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>;
             }

             const isProfileComplete = ownerData.properties && ownerData.properties.length > 0 && ownerData.properties[0].name;
             if (!isProfileComplete) {
                return (
                    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
                        <OwnerProfile
                            appState={ownerData}
                            setAppState={setOwnerState}
                            user={auth.user}
                            isInitialSetup={true}
                        />
                    </div>
                );
             }

             return <MainApp 
                ownerState={ownerData} 
                setAppState={setAppState}
                onLogout={handleLogout} 
                user={auth.user} 
              />;
          }
          if (auth.role === 'tenant') {
            const ownerData = appState[auth.ownerId];
            if (!ownerData || !ownerData.properties) {
              handleLogout();
              return <ProfessionalAuth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>;
            }
            const property = ownerData.properties.find(p => p.id === auth.propertyId);
            if (!property) {
                handleLogout();
                return <ProfessionalAuth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>;
            }
            const tenant = property.tenants.find(t => t.id === auth.user.id);
            if (!tenant) {
              handleLogout();
              return <ProfessionalAuth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>;
            }
            return <ProfessionalTenantDashboard 
                tenant={tenant}
                ownerState={ownerData}
                setAppState={setAppState}
                ownerId={auth.ownerId}
                property={property}
                onLogout={handleLogout} 
            />;
          }
      }

      return <ProfessionalAuth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>;
  }

  return <>{renderContent()}</>;
}
