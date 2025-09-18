"use client";

import { Building2, LoaderCircle, Zap, Shield, Users, TrendingUp, Database, Cpu } from 'lucide-react';
import AppLogo from './AppLogo';
import { useEffect, useState } from 'react';

export default function StartupScreen() {
  const [particles, setParticles] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const generatedParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 4,
      animationDuration: 3 + Math.random() * 2,
      size: Math.random() * 2 + 1,
    }));
    setParticles(generatedParticles);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center z-50 overflow-hidden">
      {/* Professional Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid-pattern w-full h-full"></div>
      </div>
      
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-slate-800/10"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-gradient-to-r from-blue-400/40 to-slate-400/40 rounded-full animate-pulse"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 max-w-4xl mx-auto px-6">
        {/* Main Logo with Professional Animation */}
        <div className="animate-fade-in-scale mb-12">
          <div className="relative inline-block">
            {/* Professional Logo Container */}
            <div className="w-32 h-32 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-slate-900/50 border border-slate-700/50">
              <AppLogo className="w-20 h-20" variant="professional" />
            </div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-slate-500/20 rounded-2xl blur-xl opacity-60"></div>
            
            {/* Rotating Ring */}
            <div className="absolute -inset-6 border border-slate-600/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute -inset-8 border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }}></div>
          </div>
        </div>

        {/* App Title and Description */}
        <div className="animate-slide-up space-y-8">
          <div>
            <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-slate-100 via-blue-100 to-slate-200 bg-clip-text text-transparent">
              EstateFlow
            </h1>
            <p className="text-slate-300 text-2xl font-semibold mb-3 tracking-wide">
              Professional Property Management
            </p>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Advanced tenant management platform with AI-powered insights, 
              real-time analytics, and enterprise-grade security
            </p>
          </div>

          {/* Professional Feature Icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-3 group">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-blue-500/50 transition-all duration-300">
                <Users className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
              <span className="text-sm text-slate-300 font-medium">Tenant Management</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-green-500/50 transition-all duration-300">
                <Shield className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
              </div>
              <span className="text-sm text-slate-300 font-medium">Enterprise Security</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-purple-500/50 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
              </div>
              <span className="text-sm text-slate-300 font-medium">Analytics & Insights</span>
            </div>
            <div className="flex flex-col items-center space-y-3 group">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-sm group-hover:border-cyan-500/50 transition-all duration-300">
                <Cpu className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="text-sm text-slate-300 font-medium">AI-Powered</span>
            </div>
          </div>

          {/* Professional Loading Section */}
          <div className="space-y-6 mt-16">
            <div className="flex items-center justify-center space-x-3">
              <LoaderCircle className="w-6 h-6 text-blue-400 animate-spin" />
              <span className="text-slate-300 text-lg font-medium">Initializing Professional Platform...</span>
            </div>

            {/* Professional Progress Bar */}
            <div className="w-80 mx-auto">
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Loading...</span>
                <span>{Math.round(loadingProgress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
}
