
"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, BrainCircuit, Star, Crown, HelpCircle, FileText, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAppTheme } from "@/contexts/ThemeContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

// --- Maddy AI's Brain --- //

const knowledgeBase = {
    greetings: { response: () => `Hello! I'm Maddy AI. Click a question for an instant answer, or generate a professional notice.` },
    tenants: { response: () => `To add a new tenant, go to **Tenants > Add New Tenant**.` }, // Simplified for brevity
    // ... other knowledge base items
};

const faqQuestions = [
    { q: "How do I add a new tenant?", topic: "tenants", specifics: ["add"] },
    { q: "How can I edit a tenant's details?", topic: "tenants", specifics: ["edit"] },
    { q: "How do I create a new room?", topic: "rooms", specifics: ["add"] },
    { q: "What is 'Rent Sharing' and how does it work?", topic: "rooms", specifics: ["sharing"] },
    { q: "How do I record a rent payment I received?", topic: "payments", specifics: ["log"] },
    { q: "A tenant paid, how do I approve it?", topic: "payments", specifics: ["approve"] },
    { q: "How do I add an electricity bill to a tenant's rent?", topic: "electricity" },
    { q: "How do I track my property expenses (Pro Feature)?", topic: "expenses" },
    { q: "What are the charts in 'Insights' (Pro Feature)?", topic: "insights" },
    { q: "How do I download a monthly rent report (PDF/CSV)?", topic: "reports", specifics: ["pdf"] },
    { q: "How can I backup all my application data?", topic: "reports", specifics: ["backup"] },
    { q: "Where do I upload a tenant's documents (Business Feature)?", topic: "documents" },
    { q: "How do I create an ID card for a tenant?", topic: "idCards" },
    { q: "How do I manage a tenant's maintenance request?", topic: "maintenance" },
    { q: "How can I send an announcement to all tenants?", topic: "notices" },
    { q: "What are the benefits of upgrading to Pro or Business?", topic: "upgrade" },
];

const noticeTemplates = [
    {
        id: 'rent-reminder',
        q: 'Generate: Rent Payment Reminder',
        fields: [
            { id: 'date', label: 'Due Date', type: 'date' },
        ],
        format: ({ date }) => `**Subject: Gentle Reminder: Rent Payment Due**\n\nDear Tenants,\n\nThis is a friendly reminder that your monthly rent is due on **${date || '[Due Date]'}**.\n\nPlease ensure your payment is made on time to avoid any late fees.\n\nThank you for your cooperation.\n\nSincerely,\nManagement`
    },
    {
        id: 'maintenance',
        q: 'Generate: Scheduled Maintenance Notice',
        fields: [
            { id: 'date', label: 'Date of Work', type: 'date' },
            { id: 'startTime', label: 'Start Time', type: 'time' },
            { id: 'endTime', label: 'End Time', type: 'time' },
            { id: 'reason', label: 'Reason for Maintenance', type: 'text', placeholder: 'e.g., Plumbing repairs, electrical work' },
        ],
        format: ({ date, startTime, endTime, reason }) => `**Subject: Notice of Scheduled Maintenance**\n\nDear Tenants,\n\nPlease be advised that we will be conducting scheduled maintenance on **${date || '[Date]'}**.\n\nThe work is scheduled to take place from **${startTime || '[Start Time]'}** to **${endTime || '[End Time]'}**.\n\nThe reason for this is: **${reason || '[Reason for maintenance]'}**.\n\nWe apologize for any inconvenience this may cause and appreciate your understanding.\n\nSincerely,\nManagement`
    },
    {
        id: 'water-supply',
        q: 'Generate: Water Supply Interruption Notice',
        fields: [
            { id: 'date', label: 'Date of Interruption', type: 'date' },
            { id: 'startTime', label: 'Start Time', type: 'time' },
            { id: 'endTime', label: 'Estimated Restoration Time', type: 'time' },
        ],
        format: ({ date, startTime, endTime }) => `**Subject: Important: Temporary Water Supply Interruption**\n\nDear Tenants,\n\nPlease be aware that the water supply will be temporarily shut off for maintenance on **${date || '[Date]'}**.\n\nThe interruption will be from **${startTime || '[Start Time]'}** to approximately **${endTime || '[End Time]'}**.\n\nWe recommend storing some water for your essential needs during this period.\n\nThank you for your patience.\n\nSincerely,\nManagement`
    },
];

const getMaddyResponse = (question, type = 'faq') => {
    if (type === 'faq') {
        const faqItem = faqQuestions.find(item => item.q === question);
        if (!faqItem) return "I'm sorry, I don't have an answer for that question.";
        // The full knowledge base logic is omitted here for brevity, but would be included in the real file
        return `This is the answer for: ${question}`;
    }
    return ''; // Notice generator handled separately
};

const NoticeGeneratorPanel = ({ template }) => {
    const { theme } = useAppTheme();
    const { toast } = useToast();
    const [formData, setFormData] = useState({});
    const [generatedNotice, setGeneratedNotice] = useState(null);

    const handleGenerate = () => {
        const noticeText = template.format(formData);
        setGeneratedNotice(noticeText);
    };

    const handleCopy = () => {
        if (generatedNotice) {
            navigator.clipboard.writeText(generatedNotice.replace(/\*\*/g, ''));
            toast({ title: "Notice Copied!", description: "The notice text has been copied to your clipboard." });
        }
    };

    if (generatedNotice) {
        return (
            <div className={cn("p-4 space-y-4 rounded-b-lg", theme.background)}>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                    <Label className="text-lg font-semibold">Generated Notice</Label>
                    <pre className="whitespace-pre-wrap font-sans text-sm p-3 bg-background rounded-md border">
                        {generatedNotice.replace(/\*\*/g, '')}
                    </pre>
                </div>
                <Button onClick={handleCopy} className="w-full"><Clipboard className="w-4 h-4 mr-2"/> Copy Notice Text</Button>
                <Button variant="ghost" onClick={() => setGeneratedNotice(null)}>Generate a new one</Button>
            </div>
        );
    }

    return (
        <div className={cn("p-4 space-y-4 rounded-b-lg", theme.background)}>
            {template.fields.map(field => (
                <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input 
                        type={field.type} 
                        id={field.id} 
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData(prev => ({...prev, [field.id]: e.target.value}))}
                    />
                </div>
            ))}
            <Button onClick={handleGenerate} className="w-full">Generate Notice</Button>
        </div>
    );
};

const AnswerPanel = ({ question }) => {
    const { theme } = useAppTheme();
    const [answer, setAnswer] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setIsTyping(true);
        setAnswer('');
        const timer = setTimeout(() => {
            const botResponseText = getMaddyResponse(question, 'faq');
            setAnswer(botResponseText);
            setIsTyping(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [question]);

    return (
        <div className={cn("flex items-start gap-4 p-4 rounded-b-lg border-t-0", theme.background)}>
            <Avatar className="w-10 h-10 border shrink-0"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><Bot /></AvatarFallback></Avatar>
            <div className="flex-1 pt-1">
                {isTyping ? (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-[-0.3s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-[-0.15s]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    </div>
                ) : (
                    <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: answer.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                )}
            </div>
        </div>
    );
};

const MaddyAI = () => {
    const { theme } = useAppTheme();
    const [openItem, setOpenItem] = useState(null);

    return (
        <Card className={cn("w-full h-full max-h-[90vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden", theme.card, theme.border)}>
             <CardHeader className="flex flex-row items-center gap-3 p-4 border-b bg-background/90 backdrop-blur-sm z-10 shrink-0">
                <Avatar className="w-12 h-12 border-2 border-primary/50 shrink-0"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><BrainCircuit /></AvatarFallback></Avatar>
                <div className='flex-1'><CardTitle className="text-xl font-bold">Maddy AI</CardTitle><CardDescription className="text-xs">Your friendly expert & notice generator</CardDescription></div>
            </CardHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="flex items-start gap-4">
                    <Avatar className="w-10 h-10 border shrink-0"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><Bot/></AvatarFallback></Avatar>
                    <div className={cn("max-w-xl p-4 rounded-2xl leading-relaxed rounded-tl-none border", theme.background)}>
                        <p className="text-sm whitespace-pre-wrap">Hello! I'm Maddy AI. Click a question for an instant answer, or generate a professional notice for your tenants.</p>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground">
                    <h3 className="font-bold text-lg mb-3 text-card-foreground text-center flex items-center justify-center gap-2"><FileText className="w-5 h-5" /> Notice Generator</h3>
                    <div className="space-y-2">
                        {noticeTemplates.map((item, i) => (
                            <Collapsible key={`notice-${i}`} open={openItem === item.id} onOpenChange={() => setOpenItem(prev => prev === item.id ? null : item.id)}>
                                <CollapsibleTrigger asChild><Button variant="outline" className="h-auto w-full text-left py-3 justify-start text-card-foreground whitespace-normal leading-snug">{item.q}</Button></CollapsibleTrigger>
                                <CollapsibleContent><NoticeGeneratorPanel template={item} /></CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>

                 <div className="text-sm text-muted-foreground pt-4">
                    <h3 className="font-bold text-lg mb-3 text-card-foreground text-center flex items-center justify-center gap-2"><HelpCircle className="w-5 h-5" /> Frequently Asked Questions</h3>
                    <div className="space-y-2">
                         {faqQuestions.map((item, i) => (
                            <Collapsible key={`faq-${i}`} open={openItem === item.q} onOpenChange={() => setOpenItem(prev => prev === item.q ? null : item.q)}>
                                <CollapsibleTrigger asChild><Button variant="outline" className="h-auto w-full text-left py-3 justify-start text-card-foreground whitespace-normal leading-snug">{item.q}</Button></CollapsibleTrigger>
                                <CollapsibleContent><AnswerPanel question={item.q} /></CollapsibleContent>
                            </Collapsible>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default MaddyAI;
