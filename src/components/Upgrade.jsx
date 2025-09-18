
"use client";

import { useState } from 'react';
import { Check, ArrowRight, Star, Zap, Crown, Building2, TrendingUp, Sparkles, X, Info, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { useAppTheme } from '@/contexts/ThemeContext';
import PaymentGateway from './PaymentGateway';
import UpgradeSuccessAnimation from './UpgradeSuccessAnimation';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Cpu, LineChart, Gauge, Headphones, Layers, Workflow, Stars, BarChart3, BellRing, FolderArchive, Plug, Palette } from 'lucide-react';

// --- Data Definitions ---

const featureDefinitions = {
    tenantManagement: { label: 'Tenant Management', icon: Layers, description: "Manage tenant information, lease agreements, and contact details." },
    paymentTracking: { label: 'Payment Tracking', icon: BarChart3, description: "Track rent payments, view payment history, and manage invoices." },
    basicReporting: { label: 'Basic Reporting', icon: LineChart, description: "Generate simple reports on rent collection and occupancy." },
    emailSupport: { label: 'Email Support', icon: Headphones, description: "Get help from our support team via email." },
    
    advancedAnalytics: { label: 'Advanced Analytics', icon: Cpu, description: "Gain deeper insights into your property performance with advanced analytics." },
    automatedReminders: { label: 'Automated Reminders', icon: BellRing, description: "Set up automated rent reminders for your tenants." },
    pdfCsvExports: { label: 'PDF & CSV Exports', icon: FileText, description: "Export reports and invoices to PDF and CSV formats." },
    multiProperty: { label: 'Multi-Property Support', icon: Building2, description: "Manage multiple properties from a single account." },
    prioritySupport: { label: 'Priority Support', icon: Headphones, description: "Get faster response times from our support team." },

    aiInsights: { label: 'AI-Powered Insights', icon: Sparkles, description: "Leverage AI to get predictive insights on rental trends and property valuation." },
    documentManagement: { label: 'Document Management', icon: FolderArchive, description: "Store and manage all your property-related documents securely." },
    dedicatedSupport: { label: 'Dedicated Support', icon: ShieldCheck, description: "Get a dedicated account manager and personalized support." }
};

const professionalPlans = {
    monthly: {
        standard: {
            id: 'standard-monthly',
            name: 'Standard',
            price: 'Free',
            priceSuffix: '',
            description: 'Essential features for getting started with property management.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: false },
                { id: 'automatedReminders', included: false },
                { id: 'multiProperty', included: false },
                { id: 'documentManagement', included: false },
            ],
            icon: Building2,
            color: 'from-slate-500 to-slate-600',
            isPopular: false,
            priceAmount: 0,
            planType: 'standard'
        },
        pro: {
            id: 'pro-monthly',
            name: 'Professional',
            price: '₹499',
            priceSuffix: '/mo',
            description: 'Advanced tools for growing businesses and serious landlords.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: true },
                { id: 'automatedReminders', included: true },
                { id: 'multiProperty', included: true },
                { id: 'documentManagement', included: false },
            ],
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            isPopular: true,
            priceAmount: 499,
            planType: 'pro'
        },
        business: {
            id: 'business-monthly',
            name: 'Business',
            price: '₹999',
            priceSuffix: '/mo',
            description: 'The ultimate solution for large-scale property operations.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: true },
                { id: 'automatedReminders', included: true },
                { id: 'multiProperty', included: true },
                { id: 'documentManagement', included: true },
            ],
            icon: Crown,
            color: 'from-purple-500 to-purple-600',
            isPopular: false,
            priceAmount: 999,
            planType: 'business'
        }
    },
    yearly: {
        standard: {
            id: 'standard-yearly',
            name: 'Standard',
            price: 'Free',
            priceSuffix: '',
            description: 'Essential features for getting started with property management.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: false },
                { id: 'automatedReminders', included: false },
                { id: 'multiProperty', included: false },
                { id: 'documentManagement', included: false },
            ],
            icon: Building2,
            color: 'from-slate-500 to-slate-600',
            isPopular: false,
            priceAmount: 0,
            planType: 'standard'
        },
        pro: {
            id: 'pro-yearly',
            name: 'Professional',
            price: '₹4999',
            priceSuffix: '/yr',
            originalPrice: '₹5988',
            description: 'Save big with annual billing for serious landlords.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: true },
                { id: 'automatedReminders', included: true },
                { id: 'multiProperty', included: true },
                { id: 'documentManagement', included: false },
            ],
            icon: TrendingUp,
            color: 'from-blue-500 to-blue-600',
            isPopular: true,
            priceAmount: 4999,
            planType: 'pro'
        },
        business: {
            id: 'business-yearly',
            name: 'Business',
            price: '₹9999',
            priceSuffix: '/yr',
            originalPrice: '₹11988',
            description: 'The ultimate solution with maximum savings for large operations.',
            features: [
                { id: 'tenantManagement', included: true },
                { id: 'paymentTracking', included: true },
                { id: 'basicReporting', included: true },
                { id: 'emailSupport', included: true },
                { id: 'advancedAnalytics', included: true },
                { id: 'automatedReminders', included: true },
                { id: 'multiProperty', included: true },
                { id: 'documentManagement', included: true },
            ],
            icon: Crown,
            color: 'from-purple-500 to-purple-600',
            isPopular: false,
            priceAmount: 9999,
            planType: 'business'
        }
    }
};

const allFeatures = Object.keys(featureDefinitions).map(key => ({
    id: key,
    feature: featureDefinitions[key].label,
    description: featureDefinitions[key].description,
    standard: professionalPlans.monthly.standard.features.find(f => f.id === key)?.included || false,
    pro: professionalPlans.monthly.pro.features.find(f => f.id === key)?.included || false,
    business: professionalPlans.monthly.business.features.find(f => f.id === key)?.included || false,
}));


const faqs = [
    {
        question: "Can I change my plan later?",
        answer: "Absolutely! You can upgrade, downgrade, or switch between monthly and yearly billing at any time. The changes will be prorated."
    },
    {
        question: "What happens if I downgrade to the standard plan?",
        answer: "You'll retain access to all your core data. However, you will lose access to the premium features of the Pro or Business plans at the end of your current billing cycle."
    },
    {
        question: "Is there a free trial for paid plans?",
        answer: "We offer a 14-day free trial on our Professional plan. No credit card is required to get started. This allows you to explore all the premium features risk-free."
    },
    {
        question: "What payment methods are accepted?",
        answer: "We accept a wide range of payment methods, including all major credit cards, debit cards, UPI, and Net Banking, all processed through our secure payment gateway."
    },
     {
        question: "How secure is my data?",
        answer: "Data security is our top priority. We use industry-standard encryption for data at rest and in transit, and our infrastructure is built on secure, cloud-based services."
    },
    {
        question: "Can I cancel my subscription?",
        answer: "Yes, you can cancel your subscription at any time. You will continue to have access to your plan's features until the end of your current billing period."
    }
];

// --- Main Component ---

export default function Upgrade({ appState, setAppState, onUpgradeSuccess }) {
    const { toast } = useToast();
    const { theme: appTheme } = useAppTheme();
    
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly');

    const currentPlan = appState.defaults?.subscriptionPlan || 'standard';
    const plans = professionalPlans[billingCycle];

    const handlePlanSelect = (plan) => {
        if (plan.planType === currentPlan) return;

        if (plan.priceAmount === 0) {
            setAppState(prev => ({
                ...prev,
                defaults: { ...prev.defaults, subscriptionPlan: 'standard' }
            }));
            toast({
                title: 'Plan Updated',
                description: 'You have been successfully downgraded to the Standard plan.',
            });
        } else {
            setSelectedPlan(plan);
            setShowPayment(true);
        }
    };

    const handleUpgradeSuccess = (plan) => {
        setShowPayment(false);
        setShowSuccess(true);
        
        setAppState(prev => ({
            ...prev,
            defaults: { ...prev.defaults, subscriptionPlan: plan.planType },
        }));
        
        toast({
            title: "Upgrade Successful!",
            description: `You now have access to all ${plan.name} features.`,
        });
        
        if (onUpgradeSuccess) {
           setTimeout(() => {
                setShowSuccess(false);
                onUpgradeSuccess(plan);
           }, 3500); // Allow time for animation before callback
        }
    };

    if (showSuccess) {
        return <UpgradeSuccessAnimation plan={selectedPlan} onComplete={() => setShowSuccess(false)} />;
    }

    return (
        <TooltipProvider>
            <div className="min-h-full bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900 text-white animate-in fade-in-50 duration-500">
                <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none"></div>
                <div className="relative isolate overflow-hidden">
                    {/* Header */}
                    <div className="text-center space-y-4 pt-16 pb-12 px-6">
                        <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-full shadow-2xl shadow-purple-500/20">
                            <div className="p-3 rounded-full bg-slate-800">
                                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent">
                            Find Your Perfect Plan
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
                            Unlock powerful features to streamline your property management, enhance tenant relations, and boost your revenue.
                        </p>
                    </div>

                    {/* Billing Cycle Toggle */}
                    <div className="flex justify-center items-center space-x-4 pb-12">
                        <Label htmlFor="billing-cycle" className={cn("font-medium text-lg", billingCycle === 'monthly' ? 'text-white' : 'text-slate-400')}>Monthly</Label>
                        <Switch
                            id="billing-cycle"
                            checked={billingCycle === 'yearly'}
                            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                            className="data-[state=checked]:bg-primary"
                        />
                        <div className="flex items-center gap-2">
                            <Label htmlFor="billing-cycle" className={cn("font-medium text-lg", billingCycle === 'yearly' ? 'text-white' : 'text-slate-400')}>Yearly</Label>
                            <div className="bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">SAVE 17%</div>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 lg:px-8">
                        {Object.values(plans).map((plan) => {
                            const isCurrentPlan = plan.planType === currentPlan;
                            const Icon = plan.icon;
                            return (
                                <Card
                                    key={plan.id}
                                    className={cn(
                                        "group relative overflow-hidden flex flex-col border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 rounded-2xl bg-slate-800/50 backdrop-blur-sm",
                                        plan.isPopular ? "border-blue-500/80 shadow-blue-500/20" : "border-slate-700/80",
                                        isCurrentPlan ? "ring-2 ring-green-500 ring-offset-4 ring-offset-slate-900" : ""
                                    )}
                                >
                                    <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-purple-600/10" />
                                    {isCurrentPlan && (
                                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/15 text-green-300 border border-green-500/30">
                                        <Check className="w-3 h-3" /> Current
                                      </div>
                                    )}
                                    {plan.isPopular && !isCurrentPlan && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                                                <Star className="h-4 w-4" /> Most Popular
                                            </div>
                                        </div>
                                    )}
                                    <CardHeader className="text-center pt-12 pb-6">
                                        <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <CardTitle className="text-3xl font-bold text-white">{plan.name}</CardTitle>
                                        <CardDescription className="text-base text-slate-300 px-4">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col justify-between">
                                        <div className="text-center my-6">
                                            {plan.originalPrice && <p className="text-slate-400 line-through">{plan.originalPrice}</p>}
                                            <span className="text-5xl font-bold tracking-tight text-white">{plan.price}</span>
                                            <span className="text-lg text-slate-400">{plan.priceSuffix}</span>
                                        </div>
                                        <ul className="space-y-3 text-left">
                                            {plan.features.map((featureItem, index) => {
                                                const featureDetail = featureDefinitions[featureItem.id];
                                                return (
                                                <li key={index} className={cn("flex items-start gap-3", !featureItem.included && "text-slate-500 line-through")}>
                                                    {featureItem.included ? <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" /> : <X className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />}
                                                    <div className="flex items-center gap-2">
                                                        <featureDetail.icon className="w-4 h-4" />
                                                        <span>{featureDetail.label}</span>
                                                    </div>
                                                </li>
                                            )})}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="pt-8 pb-8">
                                        <Button
                                            onClick={() => handlePlanSelect(plan)}
                                            className={cn(
                                                "w-full h-14 text-lg font-bold transition-all duration-300 shadow-lg",
                                                plan.isPopular && "btn-gradient-glow hover:shadow-blue-500/50",
                                                isCurrentPlan && "bg-green-600 hover:bg-green-700 text-white",
                                                !plan.isPopular && !isCurrentPlan && `bg-gradient-to-r ${plan.color} text-white hover:opacity-90`
                                            )}
                                            disabled={isCurrentPlan}
                                        >
                                            {isCurrentPlan ? "Current Plan" : (plan.priceAmount === 0 ? "Downgrade" : "Upgrade")}
                                            {!isCurrentPlan && <Zap className="ml-2 h-5 w-5" />}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Guarantee / Security Strip */}
                    <div className="max-w-5xl mx-auto mt-12">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-slate-300 text-sm bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                            <ShieldCheck className="w-5 h-5 text-green-400" />
                            <span>Secure payments • Cancel anytime • Priority support included on Pro and Business plans</span>
                        </div>
                    </div>

                    {/* Features Comparison */}
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-bold tracking-tight text-white">Compare All Features</h2>
                             <p className="mt-4 text-lg text-slate-300">A detailed breakdown of what each plan offers to help you choose.</p>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="py-5 px-4 w-2/5 text-lg font-semibold text-white">Features</th>
                                        <th className="text-center py-5 px-4 text-lg font-semibold text-white">Standard</th>
                                        <th className="text-center py-5 px-4 text-lg font-semibold text-white">Professional</th>
                                        <th className="text-center py-5 px-4 text-lg font-semibold text-white">Business</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {allFeatures.map((row, index) => (
                                        <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="py-4 px-4 text-slate-200 font-medium">
                                                <div className='flex items-center gap-2'>
                                                    {row.feature}
                                                    <Tooltip>
                                                        <TooltipTrigger><Info className='w-4 h-4 text-slate-400' /></TooltipTrigger>
                                                        <TooltipContent><p>{row.description}</p></TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                            {[row.standard, row.pro, row.business].map((isIncluded, i) => (
                                                 <td key={i} className="text-center py-4 px-4">
                                                    {isIncluded ? (
                                                        <Check className="h-6 w-6 text-green-400 mx-auto" />
                                                    ) : (
                                                        <X className="h-6 w-6 text-slate-500 mx-auto" />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-4xl mx-auto px-6 lg:px-8 mt-24 pb-24">
                        <div className="text-center mb-12">
                             <h2 className="text-4xl font-bold tracking-tight text-white">Frequently Asked Questions</h2>
                             <p className="mt-4 text-lg text-slate-300">Have questions? We have answers. If you can't find what you're looking for, feel free to contact us.</p>
                        </div>
                        <div className="space-y-6">
                            {faqs.map((faq, index) => (
                                <details key={index} className="group p-6 rounded-xl border border-slate-700/80 bg-slate-800/50 backdrop-blur-sm transition-all hover:bg-slate-700/50">
                                    <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-lg text-white">
                                        {faq.question}
                                        <div className="group-open:rotate-180 transition-transform">
                                            <ArrowRight className="h-5 w-5 rotate-90" />
                                        </div>
                                    </summary>
                                    <p className="mt-4 text-slate-300">
                                        {faq.answer}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>

                 {selectedPlan && (
                    <PaymentGateway
                        isOpen={showPayment}
                        onOpenChange={() => setShowPayment(false)}
                        plan={selectedPlan}
                        onPaymentSuccess={() => handleUpgradeSuccess(selectedPlan)}
                    />
                )}
            </div>
        </TooltipProvider>
    );
}
