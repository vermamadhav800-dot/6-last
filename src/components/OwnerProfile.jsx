
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User, Building, Phone, Mail, FileText, Save, Trash2, Camera, Edit, X, QrCode } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ViewField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-4">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value || <span className="italic">Not set</span>}</p>
            </div>
        </div>
    </div>
);


export default function OwnerProfile({ appState, setAppState, user, isInitialSetup = false }) {
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(isInitialSetup);

  // State for form inputs, initialized from appState
  const [profile, setProfile] = useState(appState.ownerProfile || {});
  const [defaults, setDefaults] = useState(appState.defaults || {});
  
  // State for file previews
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(profile.photoURL || null);
  const [panCardPreview, setPanCardPreview] = useState(profile.panCardUrl || null);
  const [qrCodePreview, setQrCodePreview] = useState(profile.qrCode || null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleDefaultsChange = (e) => {
    const { name, value } = e.target;
    setDefaults(prev => ({ ...prev, [name]: value }));
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
  
  const handleCancel = () => {
    // Reset form state to original
    setProfile(appState.ownerProfile || {});
    setDefaults(appState.defaults || {});
    setProfilePhotoPreview(appState.ownerProfile?.photoURL || null);
    setPanCardPreview(appState.ownerProfile?.panCardUrl || null);
    setQrCodePreview(appState.ownerProfile?.qrCode || null);
    setIsEditing(false);
  };

  const handleSave = () => {
    if (isInitialSetup && (!defaults.propertyName || !defaults.propertyAddress)) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Property Name and Address are required to continue.",
        });
        return;
    }

    setAppState(prev => {
        const newState = { ...prev };
        newState.ownerProfile = {
            ...newState.ownerProfile,
            ...profile,
            photoURL: profilePhotoPreview, // Use preview state
            panCardUrl: panCardPreview,     // Use preview state
            qrCode: qrCodePreview, // Use preview state
        };
        newState.defaults = {
            ...newState.defaults,
            ...defaults
        };

        // If it's the initial setup, create the first property
        if (isInitialSetup && (!newState.properties || newState.properties.length === 0)) {
            const firstProperty = {
                id: `prop_${Date.now()}`,
                name: defaults.propertyName,
                address: defaults.propertyAddress,
                tenants: [], rooms: [], payments: [], electricity: [], expenses: [],
                pendingApprovals: [], updateRequests: [], maintenanceRequests: [],
                notifications: [], globalNotices: []
            };
            newState.properties = [firstProperty];
            newState.activePropertyId = firstProperty.id;
        }

        return newState;
    });

    toast({
      title: "Profile Saved",
      description: "Your profile information has been updated.",
    });
    setIsEditing(false); // Exit edit mode after saving
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold font-headline">{isInitialSetup ? 'Setup Your Profile' : 'Owner Profile'}</h2>
          <p className="text-muted-foreground">{isInitialSetup ? 'Please complete your profile to start using the app.' : 'Manage your personal and business information.'}</p>
        </div>
        {!isEditing && !isInitialSetup && (
            <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 ring-2 ring-offset-2 ring-primary ring-offset-background">
              <AvatarImage src={profilePhotoPreview} alt="Profile Preview" />
              <AvatarFallback className="text-3xl">{profile.name?.charAt(0) || 'O'}</AvatarFallback>
            </Avatar>
            {isEditing ? (
                <div className="flex-1">
                    <Label htmlFor="profilePhoto" className="cursor-pointer text-sm font-medium flex items-center gap-2 bg-muted p-3 rounded-lg border hover:bg-muted/80 justify-center">
                        <Camera className="w-4 h-4" />
                        {profilePhotoPreview ? 'Change Photo' : 'Upload Photo'}
                    </Label>
                    <Input id="profilePhoto" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfilePhotoPreview)} className="sr-only" />
                    <p className="text-xs text-muted-foreground mt-2">Recommended size: 200x200px. PNG or JPG.</p>
                </div>
            ) : (
                <div className="flex-1">
                    <p className="text-2xl font-bold">{profile.name}</p>
                    <p className="text-muted-foreground">{profile.email}</p>
                </div>
            )}
          </div>
          {isEditing ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label htmlFor="name">Full Name</Label><Input id="name" name="name" value={profile.name || ''} onChange={handleProfileChange} /></div>
                    <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" name="phone" value={profile.phone || ''} onChange={handleProfileChange} /></div>
                </div>
                <div><Label htmlFor="email">Email Address</Label><Input id="email" name="email" type="email" value={profile.email || ''} onChange={handleProfileChange} /></div>
            </>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                <ViewField icon={User} label="Full Name" value={profile.name} />
                <ViewField icon={Phone} label="Phone Number" value={profile.phone} />
                <ViewField icon={Mail} label="Email Address" value={profile.email} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business & Payment Information</CardTitle>
          <CardDescription>Manage your business, tax, and payment-related information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="propertyName">{isInitialSetup ? 'Your First Property Name' : 'Default Property Name'}</Label><Input id="propertyName" name="propertyName" value={defaults.propertyName || ''} onChange={handleDefaultsChange} required /></div>
                <div><Label htmlFor="gstin">GSTIN (Optional)</Label><Input id="gstin" name="gstin" value={profile.gstin || ''} onChange={handleProfileChange} /></div>
              </div>
              <div><Label htmlFor="propertyAddress">{isInitialSetup ? 'Property Address' : 'Default Property Address'}</Label><Input id="propertyAddress" name="propertyAddress" value={defaults.propertyAddress || ''} onChange={handleDefaultsChange} required /></div>
              <div><Label htmlFor="upiId">UPI ID</Label><Input id="upiId" name="upiId" value={profile.upiId || ''} onChange={handleProfileChange} /></div>
              
              <div className="space-y-2 pt-4 border-t mt-4">
                  <Label>PAN Card</Label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {panCardPreview && (
                      <img src={panCardPreview} alt="PAN Card Preview" className="w-48 h-auto rounded-md border p-1 object-contain"/>
                    )}
                    <div className="flex-1">
                      <Input 
                        id="panCardUrl"
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, .pdf" 
                        onChange={(e) => handleFileChange(e, setPanCardPreview)}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Upload a clear image or PDF of your PAN card.
                      </p>
                      {panCardPreview && (
                        <Button variant="link" className="text-red-500 p-0 h-auto mt-2" onClick={() => setPanCardPreview(null)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t mt-4">
                  <Label>Payment QR Code</Label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {qrCodePreview && (
                        <img src={qrCodePreview} alt="QR Code Preview" className="w-48 h-auto rounded-md border p-1 object-contain"/>
                    )}
                    <div className="flex-1">
                        <Input 
                            id="qrCode"
                            type="file" 
                            accept="image/png, image/jpeg, image/jpg" 
                            onChange={(e) => handleFileChange(e, setQrCodePreview)}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Upload your UPI payment QR code image.
                        </p>
                        {qrCodePreview && (
                            <Button variant="link" className="text-red-500 p-0 h-auto mt-2" onClick={() => setQrCodePreview(null)}>
                                <Trash2 className="mr-2 h-4 w-4" /> Remove File
                            </Button>
                        )}
                    </div>
                   </div>
                </div>
            </>
          ) : (
            <div className="space-y-2">
                <ViewField icon={Building} label={isInitialSetup ? 'Your First Property Name' : 'Default Property Name'} value={defaults?.propertyName} />
                <ViewField icon={Building} label={isInitialSetup ? 'Property Address' : 'Default Property Address'} value={defaults?.propertyAddress} />
                <ViewField icon={User} label="UPI ID" value={profile.upiId} />
                 <div className="flex items-start gap-4 p-3 rounded-lg">
                    <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm text-muted-foreground">PAN Card</p>
                        {panCardPreview ? (
                             <a href={panCardPreview} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Document</a>
                        ) : (
                            <p className="font-medium italic">Not set</p>
                        )}
                    </div>
                </div>
                <div className="flex items-start gap-4 p-3 rounded-lg">
                    <QrCode className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                        <p className="text-sm text-muted-foreground">Payment QR Code</p>
                        {qrCodePreview ? (
                                <img src={qrCodePreview} alt="QR Code" className="w-32 h-32 mt-2 rounded-md" />
                        ) : (
                            <p className="font-medium italic">Not set</p>
                        )}
                    </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {isEditing && (
        <div className="flex justify-end gap-4">
            {!isInitialSetup && <Button variant="outline" onClick={handleCancel}><X className="mr-2 h-4 w-4" /> Cancel</Button>}
            <Button onClick={handleSave} size="lg" className="btn-gradient-glow">
            <Save className="mr-2 h-4 w-4" /> {isInitialSetup ? 'Save and Continue' : 'Save Changes'}
            </Button>
        </div>
      )}
    </div>
  );
}
