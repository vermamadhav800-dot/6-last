
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppLogo from './AppLogo';
import { User, Phone, Home, Shield, LockKeyhole } from 'lucide-react';

const TenantIdCard = ({ tenant, ownerState, propertyName, roomNo }) => {
    const ownerName = ownerState?.MOCK_USER_INITIAL?.name || "Property Owner";

    return (
        <div className="font-sans" id="tenant-id-card">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #tenant-id-card, #tenant-id-card * {
                            visibility: visible;
                        }
                        #tenant-id-card {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                `}
            </style>
            <div className="w-[350px] h-auto bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 p-4 flex justify-between items-center">
                   <div className='flex items-center gap-3'>
                     <AppLogo className="w-10 h-10" iconClassName="w-6 h-6" />
                     <h2 className="text-white text-lg font-bold tracking-wide">{propertyName}</h2>
                   </div>
                </div>
                <div className="p-6 relative">
                    <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">TENANT</div>
                    <div className="flex flex-col items-center -mt-20">
                        <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-lg">
                            <AvatarImage src={tenant.profilePhotoUrl} alt={tenant.name} />
                            <AvatarFallback className="text-3xl">{tenant.name ? tenant.name.charAt(0) : 'T'}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">{tenant.name}</h3>
                    </div>
                    <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4 text-sm">
                        <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gray-400 mr-4" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{tenant.phone}</span>
                        </div>
                        <div className="flex items-center">
                            <Home className="w-5 h-5 text-gray-400 mr-4" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Room: {roomNo || 'N/A'}</span>
                        </div>
                         <div className="flex items-center">
                            <Shield className="w-5 h-5 text-gray-400 mr-4" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Managed by: {ownerName}</span>
                        </div>
                    </div>
                     <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 border-2 border-dashed border-blue-300 dark:border-blue-500/50 rounded-xl p-4 text-center">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-300 flex items-center justify-center gap-2"><LockKeyhole className="w-4 h-4"/> Your Unique Login ID</p>
                        <p className="text-3xl font-extrabold tracking-wider text-blue-800 dark:text-blue-200 mt-2 font-mono">{tenant.loginId || 'Not Generated'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Use this ID with your phone to sign in.</p>
                    </div>
                </div>
                 <div className="bg-gray-100 dark:bg-black/20 px-6 py-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                    This is an official document for resident identification purposes.
                </div>
            </div>
        </div>
    );
};

export default TenantIdCard;
