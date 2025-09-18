"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  User, QrCode, Download, Edit, Camera, Mail, Phone, MapPin, 
  Calendar, CreditCard, Shield, Crown, Star, Eye, X, CheckCircle,
  Building2, IndianRupee, Clock, FileText, Badge as BadgeIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const TenantProfile = ({ tenant, ownerState, setOwnerState }) => {
  const { toast } = useToast();
  const [showIdCard, setShowIdCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTenant, setEditedTenant] = useState(tenant);
  const [showUpdateRequest, setShowUpdateRequest] = useState(false);
  const [updateRequest, setUpdateRequest] = useState({
    field: '',
    currentValue: '',
    newValue: '',
    reason: ''
  });

  const room = ownerState.rooms?.find(r => r.number === tenant.room);
  const payments = ownerState.payments?.filter(p => p.tenantId === tenant.id) || [];
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const lastPayment = payments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const handleSave = () => {
    setOwnerState(prev => ({
      ...prev,
      tenants: prev.tenants.map(t => 
        t.id === tenant.id ? editedTenant : t
      )
    }));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleCancel = () => {
    setEditedTenant(tenant);
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedTenant(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateRequest = () => {
    if (!updateRequest.field || !updateRequest.newValue || !updateRequest.reason) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      tenantId: tenant.id,
      type: 'profile_update',
      title: `Update ${updateRequest.field}`,
      description: `Request to update ${updateRequest.field} from "${updateRequest.currentValue}" to "${updateRequest.newValue}". Reason: ${updateRequest.reason}`,
      priority: 'medium',
      status: 'pending',
      createdAt: new Date().toISOString(),
      tenantName: tenant.name,
      room: tenant.room,
      updateRequest: {
        field: updateRequest.field,
        currentValue: updateRequest.currentValue,
        newValue: updateRequest.newValue,
        reason: updateRequest.reason
      }
    };

    setOwnerState(prev => ({
      ...prev,
      maintenanceRequests: [...(prev.maintenanceRequests || []), newRequest]
    }));

    toast({
      title: "Update Request Submitted",
      description: "Your profile update request has been submitted for owner approval.",
    });

    setShowUpdateRequest(false);
    setUpdateRequest({
      field: '',
      currentValue: '',
      newValue: '',
      reason: ''
    });
  };

  const startUpdateRequest = (field) => {
    setUpdateRequest({
      field: field,
      currentValue: tenant[field] || '',
      newValue: '',
      reason: ''
    });
    setShowUpdateRequest(true);
  };

  const downloadIdCard = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "ID Card Downloaded",
      description: "Your tenant ID card has been saved to your device",
    });
  };

  const getSubscriptionBadge = () => {
    const plans = {
      free: { color: 'bg-slate-500', icon: User, text: 'Free' },
      plus: { color: 'bg-blue-500', icon: Star, text: 'Plus' },
      premium: { color: 'bg-purple-500', icon: Crown, text: 'Premium' }
    };
    const plan = plans[tenant.subscriptionPlan || 'free'];
    return (
      <Badge className={`${plan.color} text-white flex items-center space-x-1`}>
        <plan.icon className="w-3 h-3" />
        <span>{plan.text}</span>
      </Badge>
    );
  };

  const IdCardView = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setShowIdCard(false)}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ID Card Design */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full opacity-20"></div>
          </div>
          
          {/* Header */}
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">EstateFlow</h3>
                  <p className="text-sm opacity-80">Tenant ID Card</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-80">ID: {tenant.tenantId || tenant.id}</div>
                <div className="text-xs opacity-80">Room: {tenant.room}</div>
              </div>
            </div>

            {/* Tenant Photo */}
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="w-16 h-16 border-4 border-white/30">
                <AvatarImage src={tenant.profilePhotoUrl} />
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {tenant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{tenant.name}</h2>
                <p className="text-sm opacity-80">{tenant.phone}</p>
                {tenant.email && (
                  <p className="text-sm opacity-80">{tenant.email}</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="opacity-80">Room</p>
                <p className="font-semibold">{tenant.room}</p>
              </div>
              <div>
                <p className="opacity-80">Move-in Date</p>
                <p className="font-semibold">
                  {tenant.moveInDate ? format(parseISO(tenant.moveInDate), 'MMM yyyy') : 'N/A'}
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-6 flex justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                <QrCode className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <Button
            onClick={downloadIdCard}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={() => setShowIdCard(false)}
            variant="outline"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

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
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 via-blue-100 to-slate-200 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-slate-300 text-lg">Manage your personal information and view your ID card</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-400" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription>Your profile details and contact information</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  {getSubscriptionBadge()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpdateRequest(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Request Update
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-slate-600">
                  <AvatarImage src={tenant.profilePhotoUrl} />
                  <AvatarFallback className="bg-slate-700 text-slate-300 text-2xl">
                    {tenant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-100">{tenant.name}</h3>
                  <p className="text-slate-400">{tenant.phone}</p>
                  {tenant.email && (
                    <p className="text-slate-400">{tenant.email}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>Room {tenant.room}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {tenant.moveInDate ? format(parseISO(tenant.moveInDate), 'MMM yyyy') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Full Name</label>
                      <input
                        type="text"
                        value={editedTenant.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Phone Number</label>
                      <input
                        type="text"
                        value={editedTenant.phone}
                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Email</label>
                      <input
                        type="email"
                        value={editedTenant.email || ''}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Room Number</label>
                      <input
                        type="text"
                        value={editedTenant.room}
                        onChange={(e) => handleFieldChange('room', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Phone</p>
                          <p className="font-medium text-slate-100">{tenant.phone}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startUpdateRequest('phone')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Email</p>
                          <p className="font-medium text-slate-100">{tenant.email || 'Not provided'}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startUpdateRequest('email')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-400">Room</p>
                          <p className="font-medium text-slate-100">{tenant.room}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startUpdateRequest('room')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-sm text-slate-400">Move-in Date</p>
                        <p className="font-medium text-slate-100">
                          {tenant.moveInDate ? format(parseISO(tenant.moveInDate), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* ID Card */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BadgeIcon className="w-5 h-5 text-green-400" />
                <span>ID Card</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-slate-400 mb-4">View and download your tenant ID card</p>
                <Button
                  onClick={() => setShowIdCard(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View ID Card
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Stats */}
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-yellow-400" />
                <span>Payment Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Paid</span>
                  <span className="font-semibold text-slate-100">₹{totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payments</span>
                  <span className="font-semibold text-slate-100">{payments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Payment</span>
                  <span className="font-semibold text-slate-100">
                    {lastPayment ? format(parseISO(lastPayment.date), 'MMM dd') : 'None'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Info */}
          {room && (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-400" />
                  <span>Room Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Room Type</span>
                  <span className="font-semibold text-slate-100">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Capacity</span>
                  <span className="font-semibold text-slate-100">{room.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Rent</span>
                  <span className="font-semibold text-slate-100">₹{room.rent}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showIdCard && <IdCardView />}
        {showUpdateRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpdateRequest(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Request Profile Update</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300">Field to Update</label>
                  <input
                    type="text"
                    value={updateRequest.field}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Current Value</label>
                  <input
                    type="text"
                    value={updateRequest.currentValue}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100"
                    disabled
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">New Value</label>
                  <input
                    type="text"
                    value={updateRequest.newValue}
                    onChange={(e) => setUpdateRequest(prev => ({ ...prev, newValue: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new value"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300">Reason for Update</label>
                  <textarea
                    value={updateRequest.reason}
                    onChange={(e) => setUpdateRequest(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain why you need this update"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleUpdateRequest}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    Submit Request
                  </Button>
                  <Button
                    onClick={() => setShowUpdateRequest(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TenantProfile;

