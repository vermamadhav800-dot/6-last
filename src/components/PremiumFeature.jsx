
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Star, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PremiumFeature = ({ 
  children, 
  feature, 
  requiredPlan = 'pro', 
  currentPlan = 'standard',
  onUpgrade,
  className = ""
}) => {
  const { toast } = useToast();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const planLevels = {
    standard: 0,
    pro: 1,
    business: 2
  };

  const isLocked = (planLevels[currentPlan] ?? 0) < (planLevels[requiredPlan] ?? 1);

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      setShowUpgradeModal(true);
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan) {
      case 'pro': return Star;
      case 'business': return Crown;
      default: return Lock;
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'pro': return 'from-blue-500 to-blue-600';
      case 'business': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (!isLocked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred Content */}
      <div className="blur-sm pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-3 p-4"
        >
          <div className="flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          
          <div className="space-y-1">
            <p className="text-slate-300 text-sm capitalize">
              {feature?.description || `This feature requires the ${requiredPlan} plan`}
            </p>
            <Button
              onClick={handleUpgradeClick}
              size="sm"
              className={`bg-gradient-to-r ${getPlanColor(requiredPlan)} hover:opacity-90 text-white text-xs`}
            >
              <Lock className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${getPlanColor(requiredPlan)} rounded-full flex items-center justify-center`}>
                {(() => {
                  const Icon = getPlanIcon(requiredPlan);
                  return <Icon className="w-8 h-8 text-white" />;
                })()}
              </div>
              
              <h3 className="text-2xl font-bold text-white capitalize">Upgrade to {requiredPlan}</h3>
              <p className="text-slate-300">
                Unlock this feature and many more with the {requiredPlan} plan.
              </p>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Advanced Analytics & Reporting</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span>AI-Powered Insights</span>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => setShowUpgradeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    if (onUpgrade) {
                      onUpgrade();
                    } else {
                      toast({
                        title: "Redirecting to Upgrade",
                        description: "Taking you to the upgrade page...",
                      });
                    }
                  }}
                  className={`flex-1 bg-gradient-to-r ${getPlanColor(requiredPlan)} hover:opacity-90`}
                >
                  Upgrade Now
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PremiumFeature;
