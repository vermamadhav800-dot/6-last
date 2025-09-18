
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Palette, Upload, Import, AlertTriangle, FileJson, Type, Monitor, Smartphone, Trash2, Sparkles, Settings as SettingsIcon, Download } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppTheme } from '@/contexts/ThemeContext';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Textarea } from './ui/textarea';
import { INITIAL_APP_STATE } from '@/lib/consts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { themes } from '@/contexts/ThemeContext';


export default function AppSettings({ appState, setAppState, user }) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { currentTheme, setCurrentTheme, theme: appTheme } = useAppTheme();
  const [defaults, setDefaults] = useState(appState.defaults || {});
  const safeInitialUser = appState.MOCK_USER_INITIAL || { name: '', username: '' };
  const [currentUser, setCurrentUser] = useState(safeInitialUser);
  const [qrCodePreview, setQrCodePreview] = useState((appState.defaults && appState.defaults.qrCodeUrl) || null);
  const [useFuturisticUpgrade, setUseFuturisticUpgrade] = useState((appState.defaults && appState.defaults.useFuturisticUpgrade) ?? true);
  const isPro = (appState.defaults && (appState.defaults.subscriptionPlan === 'pro' || appState.defaults.subscriptionPlan === 'business')) || false;
  
  const [isImportAlertOpen, setIsImportAlertOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [dataToImport, setDataToImport] = useState(null);
  const [importText, setImportText] = useState('');

  const handleDefaultsChange = (e) => {
    const { name, value, type } = e.target;
    setDefaults(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };
  
  const handleReminderSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDefaults(prev => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [name]: type === 'checkbox' ? checked : Number(value),
      }
    }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e, setPreview) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setAppState(prev => ({ 
      ...prev, 
      defaults: {
        ...defaults,
        qrCodeUrl: qrCodePreview,
        useFuturisticUpgrade: useFuturisticUpgrade,
      }, 
      MOCK_USER_INITIAL: { ...prev.MOCK_USER_INITIAL, ...currentUser } 
    }));
    toast({
      title: "Settings Saved",
      description: "Your new settings have been applied.",
    });
  };

  const handleImportFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setDataToImport(importedData);
          setIsImportAlertOpen(true);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "The selected file is not valid JSON.",
          });
        }
      };
      reader.readAsText(file);
    } else {
       toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select a valid .json file.",
      });
    }
     // Reset the file input so the same file can be selected again
    e.target.value = null;
  };
  
  const handleTextImport = () => {
    if (!importText.trim()) {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "The text box is empty. Please paste your JSON data.",
        });
        return;
    }

    try {
        const importedData = JSON.parse(importText);
        setDataToImport(importedData);
        setIsImportAlertOpen(true);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: "The pasted text is not valid JSON.",
        });
    }
  };

  const handleConfirmImport = () => {
    if (dataToImport) {
      try {
        // Detect shape: either an ownerState-like object or a full appState map
        let importedOwnerState = null;
        if (Array.isArray(dataToImport?.tenants) || Array.isArray(dataToImport?.rooms)) {
          importedOwnerState = dataToImport;
        } else if (typeof dataToImport === 'object') {
          const firstKey = Object.keys(dataToImport)[0];
          if (firstKey && typeof dataToImport[firstKey] === 'object') {
            importedOwnerState = dataToImport[firstKey];
          }
        }

        if (!importedOwnerState) {
          toast({ variant: 'destructive', title: 'Import Failed', description: 'Unrecognized file format.' });
          setIsImportAlertOpen(false);
          return;
        }

        // Only merge operational data into the current owner state
        setAppState(prev => {
          const current = prev || {};
          const ownerKey = user?.username || current?.MOCK_USER_INITIAL?.username;
          const base = ownerKey && current[ownerKey] ? current[ownerKey] : current;
          const mergedOwner = {
            ...base,
            // preserve profile and defaults
            MOCK_USER_INITIAL: base?.MOCK_USER_INITIAL || current?.MOCK_USER_INITIAL || {},
            defaults: base?.defaults || current?.defaults || {},
            // replace operational slices from imported data if present
            tenants: importedOwnerState.tenants || [],
            rooms: importedOwnerState.rooms || [],
            payments: importedOwnerState.payments || [],
            electricity: importedOwnerState.electricity || [],
            expenses: importedOwnerState.expenses || [],
            pendingApprovals: importedOwnerState.pendingApprovals || [],
            updateRequests: importedOwnerState.updateRequests || [],
            maintenanceRequests: importedOwnerState.maintenanceRequests || [],
            notifications: importedOwnerState.notifications || [],
            globalNotices: importedOwnerState.globalNotices || base?.globalNotices || [],
          };

        // normalize tenant IDs if missing
          mergedOwner.tenants = (mergedOwner.tenants || []).map(t => ({
            ...t,
            tenantId: t.tenantId || Math.floor(100000 + Math.random() * 900000).toString(),
          }));

          if (ownerKey && current[ownerKey]) {
            return { ...current, [ownerKey]: mergedOwner };
          }
          return mergedOwner; // fallback single-owner structure
        });

        toast({ title: 'Import Successful', description: 'Data merged into your account. Reloading...' });
        setTimeout(() => window.location.reload(), 1200);
      } catch (_) {
        toast({ variant: 'destructive', title: 'Import Failed', description: 'Unable to merge the provided data.' });
      }
    }
    setIsImportAlertOpen(false);
    setDataToImport(null);
    setImportText('');
  };
  
  const handleConfirmDeleteAll = () => {
    setAppState(prev => ({
      ...prev,
      // Preserve profile and defaults (including any profile photos/QR/theme)
      MOCK_USER_INITIAL: prev.MOCK_USER_INITIAL || (user ? { ...user } : prev.MOCK_USER_INITIAL),
      defaults: prev.defaults || defaults,
      // Clear data related to operations only
      tenants: [],
      rooms: [],
      payments: [],
      electricity: [],
      expenses: [],
      pendingApprovals: [],
      updateRequests: [],
      maintenanceRequests: [],
      notifications: [],
      // Keep global notices as-is; remove if you want them cleared too
      globalNotices: prev.globalNotices || []
    }));
    toast({
      title: 'Operational Data Cleared',
      description: 'Tenants, rooms, payments, and related records were deleted. Profile/settings preserved. Reloading...'
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    toast({
      title: 'Theme Updated',
      description: `Switched to ${themes[newTheme].name} theme`,
    });
  };

  const handleExportOperational = () => {
    const ownerData = appState; // In this component, appState represents current owner slice
    const exportPayload = {
      tenants: ownerData.tenants || [],
      rooms: ownerData.rooms || [],
      payments: ownerData.payments || [],
      electricity: ownerData.electricity || [],
      expenses: ownerData.expenses || [],
      pendingApprovals: ownerData.pendingApprovals || [],
      updateRequests: ownerData.updateRequests || [],
      maintenanceRequests: ownerData.maintenanceRequests || [],
      notifications: ownerData.notifications || [],
      globalNotices: ownerData.globalNotices || [],
      _meta: { exportedAt: new Date().toISOString(), version: 'v2', note: 'Login/profile/settings excluded' }
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estateflow-operational-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export Ready', description: 'Operational data exported without login info.' });
  };


  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold font-headline">Settings</h2>
        <p className="text-muted-foreground">Manage your application and user settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the look and feel of your application.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2 sm:gap-4">
            <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
                className="flex-1 sm:flex-none"
            >
                <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
                 className="flex-1 sm:flex-none"
            >
                <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
             <Button 
                variant={theme === 'system' ? 'default' : 'outline'} 
                onClick={() => setTheme('system')}
                 className="flex-1 sm:flex-none"
            >
                <Palette className="mr-2 h-4 w-4" /> System
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <span>Upgrade Interface</span>
          </CardTitle>
          <CardDescription>Choose between different upgrade interface styles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
            <div>
              <Label htmlFor="futuristic-upgrade" className="font-semibold">Futuristic Upgrade Interface</Label>
              <p className="text-sm text-muted-foreground">Use the modern futuristic design with checkboxes and animations for the upgrade page.</p>
            </div>
            <Switch 
              id="futuristic-upgrade"
              checked={useFuturisticUpgrade}
              onCheckedChange={setUseFuturisticUpgrade}
              className="shrink-0"
            />
          </div>
          {useFuturisticUpgrade && (
            <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg">
              <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Futuristic interface enabled</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Experience the next-generation upgrade interface with beautiful animations and modern design.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
            <CardTitle>Automations</CardTitle>
            <CardDescription>Configure automated features like payment reminders. <span className="text-amber-500 font-semibold">(Pro Feature)</span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div>
                    <Label htmlFor="enable-reminders" className="font-semibold">Enable Automatic Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send payment reminders to tenants automatically.</p>
                </div>
                <Switch 
                    id="enable-reminders"
                    name="enabled"
                    checked={defaults.reminderSettings?.enabled || false}
                    onCheckedChange={(checked) => handleReminderSettingsChange({ target: { name: 'enabled', type: 'checkbox', checked } })}
                    disabled={!isPro}
                    className="shrink-0"
                />
            </div>
            {defaults.reminderSettings?.enabled && isPro && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4 border-l-2 ml-2">
                    <div>
                        <Label htmlFor="beforeDays">Remind Before Due Date (Days)</Label>
                        <Input
                            id="beforeDays"
                            name="beforeDays"
                            type="number"
                            value={defaults.reminderSettings?.beforeDays || 3}
                            onChange={handleReminderSettingsChange}
                        />
                         <p className="text-xs text-muted-foreground mt-1">A reminder will be sent this many days before the due date.</p>
                    </div>
                     <div>
                        <Label htmlFor="overdueDays">Remind When Overdue (Every X Days)</Label>
                        <Input
                            id="overdueDays"
                            name="overdueDays"
                            type="number"
                            value={defaults.reminderSettings?.overdueDays || 3}
                            onChange={handleReminderSettingsChange}
                        />
                         <p className="text-xs text-muted-foreground mt-1">A new reminder will be sent if payment is still overdue after this many days.</p>
                    </div>
                </div>
            )}
             {!isPro && (
              <div className="text-center text-sm text-muted-foreground p-4 bg-muted rounded-lg">
                Upgrade to the Pro plan to unlock automated payment reminders.
              </div>
            )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Property & Payment Settings</CardTitle>
          <CardDescription>Set default values and your property and payment details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <Label htmlFor="propertyName">Property Name</Label>
              <Input
                id="propertyName"
                name="propertyName"
                type="text"
                placeholder="e.g., Happy Homes PG"
                value={defaults.propertyName || ''}
                onChange={handleDefaultsChange}
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                name="propertyAddress"
                type="text"
                placeholder="e.g., 123 Main St, Anytown"
                value={defaults.propertyAddress || ''}
                onChange={handleDefaultsChange}
              />
            </div>
            <div>
              <Label htmlFor="electricityRatePerUnit">Default Electricity Rate (per Unit)</Label>
              <Input
                id="electricityRatePerUnit"
                name="electricityRatePerUnit"
                type="number"
                value={defaults.electricityRatePerUnit}
                onChange={handleDefaultsChange}
              />
            </div>
             <div className="relative">
              <Label htmlFor="upiId">Your UPI ID</Label>
              <Input
                id="upiId"
                name="upiId"
                type="text"
                placeholder="e.g., yourname@okhdfcbank"
                value={defaults.upiId || ''}
                onChange={handleDefaultsChange}
              />
            </div>
          </div>
           <div className="space-y-2 pt-4 border-t mt-4">
              <Label>Payment QR Code</Label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {qrCodePreview && (
                  <img src={qrCodePreview} alt="QR Code Preview" className="w-24 h-24 rounded-md border p-1"/>
                )}
                <div className="flex-1">
                  <Input 
                    id="qrCode"
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg" 
                    onChange={(e) => handleFileChange(e, setQrCodePreview)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload a QR code image. Tenants will see this image to make payments.
                  </p>
                  {qrCodePreview && (
                    <Button variant="link" className="text-red-500 p-0 h-auto mt-2" onClick={() => setQrCodePreview(null)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Image
                    </Button>
                  )}
                </div>
              </div>
            </div>
        </CardContent>
      </Card>
       
       <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Import your application data from a backup file. This is useful for backups and transfers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="import-backup" className="font-semibold">Option 1: Import from File (Desktop)</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Label htmlFor="import-backup" className="cursor-pointer">
                            <FileJson className="mr-2 h-4 w-4" /> Select JSON File
                        </Label>
                    </Button>
                    <Input id="import-backup" type="file" accept=".json,application/json" className="sr-only" onChange={handleImportFileSelect} />
                    <p className="text-sm text-muted-foreground flex-1">Importing will merge data into your current account.</p>
                </div>
                <div className="mt-4">
                  <Button onClick={handleExportOperational} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Export Operational Data (No Login Info)
                  </Button>
                </div>
            </div>
             <div className="border-t pt-6 space-y-2">
                 <Label htmlFor="import-text" className="font-semibold">Option 2: Import from Text (Mobile)</Label>
                 <p className="text-sm text-muted-foreground">Copy the text from your JSON backup file and paste it here.</p>
                 <Textarea 
                    id="import-text"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder='Paste your JSON content here...'
                    rows={6}
                 />
                 <Button onClick={handleTextImport} className="w-full sm:w-auto">
                    <Type className="mr-2 h-4 w-4" /> Import Pasted Data
                 </Button>
            </div>
            <div className="border-t pt-6">
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <Label className="font-semibold text-red-500 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Delete All Data
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">This will erase all tenants, rooms, payments, and settings. This action cannot be undone.</p>
                  </div>
                  <Button variant="destructive" onClick={() => setIsDeleteAlertOpen(true)}>
                    Delete All Data
                  </Button>
                </div>
              </div>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={currentUser?.name || ''} onChange={handleUserChange} />
          </div>
          <div>
            <Label htmlFor="username">Email (Username)</Label>
            <Input id="username" name="username" value={currentUser?.username || ''} onChange={handleUserChange} disabled />
          </div>
           <div>
            <Label htmlFor="password">New Password</Label>
            <Input id="password" name="password" type="password" placeholder="Enter new password (optional)" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="btn-gradient-glow w-full sm:w-auto">Save All Settings</Button>
      </div>

       {/* Theme Selection */}
       <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Selection
            </CardTitle>
            <CardDescription>Choose your preferred visual theme for the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <Label htmlFor="theme-select">Application Theme</Label>
                <Select value={currentTheme} onValueChange={handleThemeChange}>
                    <SelectTrigger id="theme-select" className="w-full">
                        <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(themes).map(([key, theme]) => (
                            <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
                                    <div className="flex-1">
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
            <div className="space-y-3">
                <Label>Theme Preview</Label>
                <div className={`p-4 rounded-lg bg-gradient-to-r ${appTheme.primary} text-white`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${appTheme.secondary} flex items-center justify-center`}>
                            <Type className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-semibold">Sample Card</div>
                            <div className="text-sm opacity-80">This is how your theme will look</div>
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>


       <AlertDialog open={isImportAlertOpen} onOpenChange={setIsImportAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="text-amber-500" />
                Overwrite All Data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to import this data? This action cannot be undone and will permanently replace all existing data in the application with the contents of the backup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsImportAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>Yes, Overwrite and Import</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="text-red-500" />
              Delete All Data?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove all data for this account on this device, including tenants, rooms, payments, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDeleteAll}>
              Yes, Delete Everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </div>
  );
}
