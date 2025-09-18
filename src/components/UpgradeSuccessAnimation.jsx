
"use client";

import { useEffect, useState } from 'react';
import { Check, Star, Sparkles, Trophy, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

const UpgradeSuccessAnimation = ({ plan, onComplete }) => {
    const [stage, setStage] = useState(0);

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 100),
            setTimeout(() => setStage(2), 1000),
            setTimeout(() => setStage(3), 2500),
            // Auto-complete after 4 seconds
            setTimeout(() => {
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            }, 4000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { 
                duration: 0.5, 
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };
    
    const iconContainer = {
        hidden: { scale: 0 },
        visible: { 
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
            }
        }
    };

    const tickVariants = {
        hidden: { pathLength: 0 },
        visible: {
            pathLength: 1,
            transition: { duration: 0.8, ease: "easeInOut", delay: 0.8 }
        }
    };
    
    const particles = Array.from({ length: 20 });

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-lg flex items-center justify-center z-50 animate-in fade-in-25">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative text-center p-8 max-w-lg w-full"
            >
                {/* Background Glow */}
                <div className="absolute -inset-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>

                 {/* Particle Effects */}
                 <AnimatePresence>
                    {stage >= 1 && particles.map((_, i) => (
                        <motion.div 
                            key={i}
                            className="absolute rounded-full"
                            initial={{ 
                                top: '50%', 
                                left: '50%', 
                                scale: 0,
                                opacity: 0,
                                background: Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6'
                            }}
                            animate={{
                                x: `${(Math.random() - 0.5) * 600}px`,
                                y: `${(Math.random() - 0.5) * 400}px`,
                                scale: Math.random() * 1.5,
                                opacity: [0.8, 0],
                            }}
                            transition={{
                                duration: 1 + Math.random(),
                                delay: Math.random() * 0.5 + 0.5,
                                ease: "easeOut"
                            }}
                        />
                    ))}
                 </AnimatePresence>

                <motion.div 
                    variants={iconContainer}
                    className="relative mx-auto w-32 h-32 flex items-center justify-center"
                >
                    <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-30"
                        animate={{ scale: [1, 1.2, 1], transition: { duration: 2, repeat: Infinity } }}
                    />
                    <motion.div
                        className="absolute inset-2 bg-slate-800 rounded-full"
                    />
                    <Trophy className="w-20 h-20 text-amber-400 z-10 drop-shadow-lg" />
                     <motion.svg
                        className="absolute w-full h-full z-20"
                        viewBox="0 0 52 52"
                    >
                        <motion.path
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                            fill="none"
                            strokeWidth="4"
                            stroke="#34d399"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            variants={tickVariants}
                        />
                    </motion.svg>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-4xl font-bold mt-8 text-white">
                    Upgrade Successful!
                </motion.h1>
                
                <motion.p variants={itemVariants} className="text-lg text-slate-300 mt-4">
                    Welcome to the <span className="font-bold text-blue-400">{plan?.name}</span> plan!
                </motion.p>

                <motion.div 
                    variants={itemVariants} 
                    className="mt-8 bg-slate-800/50 border border-slate-700 p-4 rounded-xl shadow-inner"
                >
                     <h3 className="font-semibold text-white">What's next?</h3>
                     <p className="text-slate-400 mt-2">You can now access all the premium features included in your new plan. Go ahead and explore!</p>
                </motion.div>

                <motion.div variants={itemVariants} className="mt-10">
                    <Button 
                        onClick={onComplete}
                        className="h-12 px-8 text-lg font-semibold btn-gradient-glow"
                    >
                        Awesome!
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UpgradeSuccessAnimation;
