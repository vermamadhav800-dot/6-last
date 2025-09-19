
"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Info, CornerDownLeft, BrainCircuit, Zap, Star, Crown, Wrench, Megaphone, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTheme } from "@/contexts/ThemeContext";

// --- Maddy AI's Brain - Final Deep Knowledge Base ---
const knowledgeBase = {
    greetings: {
        keywords: ["hello", "hi", "hey", "maddy", "yo", "start"],
        response: () => `Hello! I'm Maddy AI. Below is a list of frequently asked questions. Click one to get an instant answer, or type your own question in the box at the bottom.`,
    },
    help: { keywords: ["help", "support", "assistance"], response: () => `You can either click a question from the list below or type your own question in the input box. I can explain any feature of the EstateFlow app.` },
    thanks: { keywords: ["thanks", "thank you"], response: () => `You're welcome! I'm here to help. Feel free to ask another question.` },
    identity: { keywords: ["who are you", "what are you"], response: () => `I am Maddy AI, a specialized assistant for the EstateFlow application. My brain contains detailed, step-by-step instructions for every feature.` },
    dashboard: { keywords: ["dashboard", "overview", "home page"], response: () => `The **Dashboard** is your command center. It gives you a quick summary of your most important metrics like **Total Tenants**, **Occupancy Rate**, and **Total Dues**.` },
    tenants: {
        keywords: ["tenant", "resident", "add tenant", "edit tenant"],
        response: (specifics) => {
            if (specifics.includes("add")) return `Here’s how to add a new tenant:\n1. Go to the **"Tenants"** tab.\n2. Click the **"Add New Tenant"** button.\n3. Fill in their details like name, contact info, move-in date, and assign them to a room.`;
            if (specifics.includes("edit")) return `To edit a tenant's information:\n1. Go to the **"Tenants"** tab.\n2. Click on the tenant's name in the list.\n3. This will open their profile where you can update their details.`;
            return `The **Tenants** section is where you manage all your residents. You can add new tenants, see a full list of existing tenants, and edit their profiles.`;
        }
    },
    rooms: {
        keywords: ["room", "rent sharing", "add room"],
        response: (specifics) => {
            if (specifics.includes("add")) return `To add a new room:\n1. Go to the **"Rooms"** tab.\n2. Click **"Add New Room"**.\n3. Set the room's name and its total monthly rent.`;
            if (specifics.includes("sharing")) return `**Rent Sharing** is a key feature. When editing a room, if you enable 'Rent Sharing', the total rent is automatically and equally divided among all tenants assigned to that room.`;
            return `The **Rooms** section is where you define every rentable unit in your property, including its rent.`;
        }
    },
    payments: {
        keywords: ["payment", "rent", "log payment", "approve payment"],
        response: (specifics) => {
            if (specifics.includes("log")) return `To manually record a payment you've received:\n1. Go to the **"Payments"** tab.\n2. Click **"Log a Payment"**.\n3. Select the tenant, enter the amount, and the date.`;
            if (specifics.includes("approve")) return `When a tenant pays and notifies you via their portal, it appears in the **"Approvals"** tab. Just review the details and click **"Approve"** to confirm it.`;
            return `You handle all financial transactions in the **Payments** and **Approvals** sections.`;
        }
    },
    electricity: { keywords: ["electricity", "bill", "utility"], response: () => `The **Electricity** feature helps you bill for utilities. Go to the **Electricity** tab, click "Add Reading", enter the details, and apply it to a room. The cost will be automatically divided among that room's tenants and added to their dues.` },
    maintenance: { keywords: ["maintenance", "requests", "complaint"], response: () => `When a tenant submits a maintenance request (e.g., for a repair), it appears in the **"Requests"** tab. You can view the details and mark it as "Completed" once the issue is resolved.` },
    notices: { keywords: ["notice", "announcement", "board"], response: () => `Use the **Notices** tab to send a message to all tenants at once. Click **"Post a Notice"**, write your message, and it will appear on the notice board in every tenant's portal.` },
    expenses: { keywords: ["expense", "cost", "spending"], response: () => `Expense tracking is a **Pro feature** (<Star className="inline h-4 w-4" />). In the **Expenses** section, you can log all your property-related costs (like repairs or salaries) to get a clear picture of your outgoings.` },
    insights: { keywords: ["insights", "financial", "charts"], response: () => `The **Insights** tab is a **Pro feature** (<Star className="inline h-4 w-4" />) that gives you a deep financial analysis with 12-month trend charts for Revenue, Expenses, and Profit.` },
    reports: {
        keywords: ["report", "csv", "pdf", "backup", "json"],
        response: (specifics) => {
            if (specifics.includes("pdf")) return `You can download a monthly **Rent Roll report** in **PDF** or **CSV** format from the **Reports** tab. This is a **Pro feature** (<Star className="inline h-4 w-4" />).`;
            if (specifics.includes("backup")) return `For maximum security, use the **Full Data Backup** feature in the **Reports** tab. It exports all your data into a single JSON file. This is a **Pro feature** (<Star className="inline h-4 w-4" />).`;
            return `The **Reports** section is a **Pro feature** (<Star className="inline h-4 w-4" />) for exporting your data as PDF/CSV reports or creating a full JSON backup.`;
        }
    },
    documents: { keywords: ["document", "file", "upload", "lease"], response: () => `Document Management is a **Business plan** feature (<Crown className="inline h-4 w-4" />). It provides a secure place to upload and store each tenant's **Profile Photo**, **Aadhaar Card**, and **Lease Agreement**. You can manage these from the **Documents** tab.` },
    idCards: { keywords: ["id card", "identification"], response: () => `The **ID Cards** feature automatically creates a printable identification card for a tenant using their name and photo (if uploaded).` },
    upgrade: { keywords: ["upgrade", "pro", "business", "plan"], response: () => `You can upgrade your plan from the **Upgrade** tab. The **Pro plan** (<Star className="inline h-4 w-4" />) unlocks financial tools like Insights and Reports. The **Business plan** (<Crown className="inline h-w-4" />) adds secure document storage.` },
    fallback: { keywords: [], response: () => `I apologize, I only have knowledge about the EstateFlow application. Please click a question from the list or try asking about a specific feature.` }
};

// --- Comprehensive FAQ List ---
const faqQuestions = [
    { q: "How do I add a new tenant?", topic: "tenants", specifics: ["add"] },
    { q: "How can I edit a tenant's details?", topic: "tenants", specifics: ["edit"] },
    { q: "How do I create a new room?", topic: "rooms", specifics: ["add"] },
    { q: "What is 'Rent Sharing' and how does it work?", topic: "rooms", specifics: ["sharing"] },
    { q: "How do I record a rent payment I received?", topic: "payments", specifics: ["log"] },
    { q: "A tenant paid online, how do I approve it?", topic: "payments", specifics: ["approve"] },
    { q: "How do I add an electricity bill to a tenant's due amount?", topic: "electricity" },
    { q: "How do I track my property expenses?", topic: "expenses" },
    { q: "What do the financial charts in 'Insights' mean?", topic: "insights" },
    { q: "How do I download a monthly rent report (PDF/CSV)?", topic: "reports", specifics: ["pdf"] },
    { q: "How can I backup all my application data?", topic: "reports", specifics: ["backup"] },
    { q: "Where do I upload a tenant's documents (Lease, ID)?", topic: "documents" },
    { q: "How do I create an ID card for a tenant?", topic: "idCards" },
    { q: "How do I manage a maintenance request from a tenant?", topic: "maintenance" },
    { q: "How can I send an announcement to all tenants?", topic: "notices" },
    { q: "What are the benefits of upgrading my plan?", topic: "upgrade" },
];

const getMaddyResponse = (userInput) => {
    const lowerCaseInput = userInput.toLowerCase().trim();
    if (!lowerCaseInput) return { id: 'fallback', response: knowledgeBase.fallback.response(userInput) };

    let bestMatch = { id: 'fallback', score: 0 };
    const words = new Set(lowerCaseInput.replace(/[?.,]/g, '').split(/\s+/));

    for (const topicId in knowledgeBase) {
        if (topicId === 'fallback') continue;
        const topic = knowledgeBase[topicId];
        let currentScore = 0;
        topic.keywords.forEach(keyword => {
            if (lowerCaseInput.includes(keyword)) currentScore += 2;
            words.forEach(word => { if (word.length > 2 && keyword.includes(word)) currentScore += 1; });
        });
        if (currentScore > bestMatch.score) bestMatch = { id: topicId, score: currentScore };
    }
    
    const specifics = Array.from(words);
    if (bestMatch.score > 2) {
        const responseFn = knowledgeBase[bestMatch.id].response;
        return { id: bestMatch.id, response: responseFn(specifics) };
    }
    return { id: 'fallback', response: knowledgeBase.fallback.response(userInput) };
};

const MaddyAI = () => {
    const { theme } = useAppTheme();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    const handleSend = (query) => {
        const userQuery = query || input;
        if (userQuery.trim() === '') return;

        const userMessage = { text: userQuery, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        setIsTyping(true);
        setTimeout(() => {
            const { response } = getMaddyResponse(userQuery);
            const botResponse = { text: response, sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
            inputRef.current?.focus();
        }, 1000);
    };
    
    const handleFaqClick = (question) => {
        // Directly send the FAQ question to be processed
        handleSend(question);
    }

    useEffect(() => {
        if (messages.length === 0 && !isTyping) {
            setIsTyping(true);
            setTimeout(() => {
                setMessages([{ text: knowledgeBase.greetings.response(), sender: 'bot' }]);
                setIsTyping(false);
            }, 800);
        }
    }, []);
    
    useEffect(scrollToBottom, [messages, isTyping]);
    
    return (
        <Card className={cn("w-full h-full max-h-[90vh] flex flex-col shadow-2xl rounded-2xl overflow-hidden", theme.card, theme.border)}>
            <CardHeader className="flex flex-row items-center gap-4 p-4 border-b bg-background/80 backdrop-blur-sm z-10 shrink-0">
                <div className="relative">
                    <Avatar className="w-16 h-16 border-2 border-primary/50">
                         <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><BrainCircuit /></AvatarFallback>
                    </Avatar>
                     <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
                </div>
                <div className='flex-1'>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">Maddy AI</CardTitle>
                    <CardDescription className="text-sm">Your friendly expert for EstateFlow</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 min-h-0">
                <ScrollArea className="h-full w-full">
                    <div className="space-y-6 pb-4 px-6">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-4", msg.sender === 'user' ? 'justify-end' : '')}>
                                {msg.sender === 'bot' && (
                                    <Avatar className="w-10 h-10 border shrink-0">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><BrainCircuit/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-xl p-4 rounded-2xl leading-relaxed",
                                    msg.sender === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : `${theme.background} rounded-tl-none border`)}>
                                     <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                </div>
                                {msg.sender === 'user' && (
                                     <Avatar className="w-10 h-10 border shrink-0"><AvatarFallback><User /></AvatarFallback></Avatar>
                                )}
                            </div>
                        ))}
                        
                        {messages.length <= 1 && !isTyping && (
                            <div className="text-sm text-muted-foreground pt-4">
                                <h3 className="font-bold text-lg mb-4 text-card-foreground text-center flex items-center justify-center gap-2"><HelpCircle className="w-5 h-5" /> Frequently Asked Questions</h3>
                                <div className="space-y-2">
                                    {faqQuestions.map((item, i) => (
                                        <Button 
                                            key={i} 
                                            variant="outline" 
                                            className="h-auto w-full text-left py-3 justify-start text-card-foreground"
                                            onClick={() => handleFaqClick(item.q)}
                                        >
                                            {item.q}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isTyping && (
                             <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border shrink-0"><AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><BrainCircuit/></AvatarFallback></Avatar>
                                <div className={cn("max-w-md p-4 rounded-2xl rounded-tl-none", theme.background, "border")}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 border-t bg-background/80 backdrop-blur-sm shrink-0">
                <div className="relative w-full">
                    <Input
                        ref={inputRef}
                        placeholder="Or type your own question here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSend(); e.preventDefault(); }}}
                        className="pr-20 h-12 rounded-full pl-6 text-base"
                    />
                    <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1'>
                        <Button type="submit" size="icon" onClick={() => handleSend()} className="rounded-full w-9 h-9" disabled={isTyping || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default MaddyAI;
