
"use client";

import { useState, useEffect, useReducer } from "react";
import StartupScreen from "@/components/StartupScreen";
import Auth from "@/components/auth/Auth";
import MainApp from "@/components/MainApp";
import ProfessionalTenantDashboard from "@/components/TenantDashboard";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/lib/hooks";
import { INITIAL_APP_STATE } from "@/lib/consts";
import { appReducer } from "@/lib/reducers/appReducer";

export default function Home() {
  const [isStartupLoading, setIsStartupLoading] = useState(true);
  const [authStorage, setAuthStorage] = useLocalStorage("auth", { user: null, role: null });
  const [auth, setAuth] = useState(authStorage);
  const [globalAppState, setGlobalAppState] = useLocalStorage("appState_v2", {});
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tempPhone, setTempPhone] = useState(null);

  // Use a reducer for the logged-in owner's state
  const [ownerState, dispatch] = useReducer(appReducer, null);

  const { toast } = useToast();

  useEffect(() => {
    const startupTimer = setTimeout(() => setIsStartupLoading(false), 2000);
    return () => clearTimeout(startupTimer);
  }, []);

  useEffect(() => {
    setAuthStorage(auth);
    if (auth.role === 'owner' && auth.user) {
        // Initialize or update the reducer state when auth changes
        const initialState = globalAppState[auth.user.username] || {
            ...INITIAL_APP_STATE,
            MOCK_USER_INITIAL: { ...auth.user }
        };
        if (JSON.stringify(ownerState) !== JSON.stringify(initialState)) {
           dispatch({ type: 'SET_STATE', payload: initialState });
        }
    } else {
        dispatch({ type: 'SET_STATE', payload: null });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, globalAppState]);


  useEffect(() => {
    // Persist ownerState changes to global app state and local storage
    if (auth.role === 'owner' && auth.user && ownerState && JSON.stringify(globalAppState[auth.user.username]) !== JSON.stringify(ownerState)) {
      const newGlobalState = { ...globalAppState, [auth.user.username]: ownerState };
      setGlobalAppState(newGlobalState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerState, auth]);

  const handleAuth = async (credentials, action) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
        if (action === 'login-phone-start') {
            const normalizedPhone = (credentials.phone || '').replace(/\D/g, '').slice(-10);
            const owner = Object.values(globalAppState).find(o => (o?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === normalizedPhone);
            
            if (!owner) {
                toast({ variant: "destructive", title: "Login Failed", description: "Phone number not registered." });
                return false;
            }

            setTempPhone(owner.MOCK_USER_INITIAL.phone);
            setIsOtpSent(true);
            toast({ title: "OTP Sent", description: "Use the demo OTP: 151515" });
            return true;

        } else if (action === 'login-phone-verify') {
            if (credentials.otp !== '151515') {
                toast({ variant: "destructive", title: "Login Failed", description: "Invalid OTP." });
                return false;
            }

            const ownerData = Object.values(globalAppState).find(o => (o?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === (tempPhone || '').replace(/\D/g, '').slice(-10));
            if (ownerData) {
                setAuth({ user: ownerData.MOCK_USER_INITIAL, role: 'owner' });
                toast({ title: "Login Successful", description: "Welcome back!" });
                setTempPhone(null);
                setIsOtpSent(false);
                return true;
            }

            toast({ variant: "destructive", title: "Login Failed", description: "Could not find user data." });
            return false;

        } else if (action === 'login') { // Tenant Login
            const normalizedUserInputPhone = (credentials.username || '').replace(/\D/g, '').slice(-10);
            if (!normalizedUserInputPhone) {
                toast({ variant: "destructive", title: "Login Failed", description: "Phone number is required." });
                return false;
            }

            for (const ownerKey in globalAppState) {
                const ownerData = globalAppState[ownerKey];
                if (ownerData?.properties) {
                    for (const property of ownerData.properties) {
                        const tenant = property.tenants?.find(t => (t.phone || '').replace(/\D/g, '').slice(-10) === normalizedUserInputPhone);
                        if (tenant) {
                            setAuth({ user: tenant, role: 'tenant', ownerId: ownerKey, propertyId: property.id });
                            toast({ title: "Login Successful!", description: `Welcome back, ${tenant.name}!` });
                            return true;
                        }
                    }
                }
            }

            toast({ variant: "destructive", title: "Login Failed", description: "Phone number not found." });
            return false;

        } else if (action === 'register') {
            const normalizedPhone = (credentials.phone || '').replace(/\D/g, '').slice(-10);
            if (Object.values(globalAppState).some(o => (o?.MOCK_USER_INITIAL?.phone || '').replace(/\D/g, '').slice(-10) === normalizedPhone)) {
                toast({ variant: "destructive", title: "Registration Failed", description: "Phone number already registered." });
                return false;
            }
            
            const newOwner = {
                name: credentials.name,
                username: normalizedPhone,
                phone: normalizedPhone,
                createdAt: new Date().toISOString(),
            };

            const newOwnerState = {
                ...INITIAL_APP_STATE,
                MOCK_USER_INITIAL: newOwner,
            };

            setGlobalAppState(prev => ({...prev, [normalizedPhone]: newOwnerState}));
            toast({ title: "Registration Successful", description: "Please sign in to continue." });
            return true;
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Auth Error", description: "An unexpected error occurred." });
    } finally {
        setIsLoading(false);
    }
    return false;
  };

  const handleLogout = () => {
    setAuth({ user: null, role: null });
    setIsOtpSent(false);
    setTempPhone(null);
  };

  const renderContent = () => {
      if (isStartupLoading) return <StartupScreen />;
      
      if (auth.user && auth.role === 'owner') {
          if (!ownerState) return <StartupScreen message="Initializing Owner Dashboard..."/>;
          return <MainApp 
            ownerState={ownerState} 
            setAppState={dispatch} // Pass the dispatch function
            onLogout={handleLogout} 
            user={auth.user} 
          />;
      } 
      
      if (auth.user && auth.role === 'tenant') {
            const ownerData = globalAppState[auth.ownerId];
            if (!ownerData) { handleLogout(); return <Auth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>; }
            
            const property = ownerData.properties.find(p => p.id === auth.propertyId);
            const tenant = property?.tenants.find(t => t.id === auth.user.id);
            if (!tenant) { handleLogout(); return <Auth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading}/>; }
            
            return <ProfessionalTenantDashboard 
                tenant={tenant}
                ownerState={ownerData}
                setAppState={(updater) => {
                     const newOwnerState = typeof updater === 'function' ? updater(ownerData) : updater;
                     setGlobalAppState(p => ({...p, [auth.ownerId]: newOwnerState}));
                }}
                ownerId={auth.ownerId}
                property={property}
                onLogout={handleLogout} 
            />;
      }

      return <Auth onAuth={handleAuth} isOtpSent={isOtpSent} isLoading={isLoading} setIsLoading={setIsLoading} />;
  }

  return <>{renderContent()}</>;
}
