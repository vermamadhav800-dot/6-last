
"use client";

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, User, Bot, Info, CornerDownLeft, BrainCircuit, Zap, Star, Crown, Wrench, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTheme } from "@/contexts/ThemeContext";

// --- Maddy AI's Brain - Final Deep Knowledge Base ---
const knowledgeBase = {
    // --- General & Meta Topics ---
    greetings: {
        keywords: ["hello", "hi", "hey", "maddy", "yo", "start"],
        response: () => `Hello! I'm Maddy AI, your dedicated EstateFlow assistant. My purpose is to provide you with clear, step-by-step guidance for any feature in this app. How can I help you today?`,
    },
    help: {
        keywords: ["help", "support", "assistance", "guide", "what can you do"],
        response: () => `I can provide detailed guidance on every feature within EstateFlow. For example, you could ask me:

• "How do I add a tenant and set their rent?"
• "Explain how to handle a maintenance request."
• "What is the best way to backup all my data?"

I'm ready to help. Just ask your question in simple terms.`,
    },
    thanks: {
        keywords: ["thanks", "thank you", "appreciated", "great", "perfect", "awesome"],
        response: () => `You're most welcome! I'm glad I could provide a clear and helpful answer. Is there anything else you need assistance with?`,
    },
    identity: {
        keywords: ["who are you", "what is your name", "what are you", "purpose", "your brain"],
        response: () => `I am Maddy AI. Think of me as a friendly expert on the EstateFlow application. My brain is built on a deep knowledge base of every feature, allowing me to provide instant and accurate guidance to make your life easier.`,
    },

    // --- Standard Plan Features ---
    dashboard: {
        keywords: ["dashboard", "main screen", "overview", "home page", "analytics", "quick look", "metrics"],
        response: () => `The **Dashboard** is your command center. It gives you a quick, visual summary of your most important metrics:

• **Total Tenants:** The number of active residents across your property.
• **Occupancy Rate:** The percentage of your rooms that are currently filled.
• **Total Revenue (Last 6 Months):** A snapshot of your income.
• **Total Dues:** The total outstanding rent amount you need to collect.`,
    },
    tenants: {
        keywords: ["tenant", "tenants", "resident", "add tenant", "customer", "profile", "aadhaar", "tenant list", "update tenant", "edit tenant"],
        response: (specifics) => {
            let base = `The **Tenants** section is where you manage all your residents.`;
            if (specifics.includes("add") || specifics.includes("new")) {
                base += `\n\nHere’s how to add a new tenant, step-by-step:\n1. From the side menu, click on **"Tenants"**.\n2. Click the blue **"Add New Tenant"** button.\n3. A form will open. Fill in the tenant's essential details like their **Full Name**, **Contact Info**, **Move-in Date**, and which **Room** they will occupy.\n4. You should also enter their **Aadhaar Number** for your records.`;
            } else if (specifics.includes("edit") || specifics.includes("update")) {
                base += `\n\nTo update a tenant's information:\n1. Go to the **Tenants** section.\n2. Find the tenant in the list and click on their name.\n3. This will take you to their detailed profile page where you can edit their information.`;
            } else {
                base += `\n\nHere you can see a full list of your tenants, add new ones, and click on any tenant to view or update their detailed profile, including payment history and personal information.`;
            }
            return base;
        },
    },
    rooms: {
        keywords: ["room", "rooms", "property", "add room", "space", "unit", "rent sharing", "edit room", "update rent"],
        response: (specifics) => {
            let base = `The **Rooms** section is where you define and manage all the rentable units in your property.`;
            if(specifics.includes("add")){
                base += `\n\nTo add a new room:\n1. Click on **"Rooms"** in the menu.\n2. Click the **"Add New Room"** button.\n3. Set the room's name (e.g., "Room 101") and its total monthly rent amount.`;
            } else if (specifics.includes("sharing")){
                base += `\n\n**Rent Sharing** is a very useful feature. When you create or edit a room, you can enable 'Rent Sharing'. If enabled, the room's total rent is automatically and equally divided among all the tenants living in it. For example, if a room's rent is ₹10,000 and two tenants live there, each will be billed ₹5,000.`;
            } else {
                 base += `\n\nThis is the foundation for tracking your property's occupancy and calculating rent for each tenant accurately.`;
            }
            return base;
        },
    },
    payments: {
        keywords: ["payment", "payments", "rent", "log payment", "invoice", "fee", "collection", "approve payment", "due", "bill", "charge"],
        response: (specifics) => {
            let base = `The **Payments** and **Approvals** sections are where you handle all money-related tasks.`;
            if(specifics.includes("log")){
                base += `\n\nTo manually record a payment you've received (e.g., in cash or bank transfer):\n1. Navigate to the **Payments** tab.\n2. Click **"Log a Payment"**.\n3. Select the tenant, enter the amount, and the date. This updates their balance.`
            } else if(specifics.includes("approve")){
                base += `\n\nWhen tenants use their portal to notify you they've paid, you must approve it:\n1. Go to the **Approvals** tab (you'll see a red dot if there are pending approvals).\n2. Review the pending payment details.\n3. Click **"Approve"** to formally record the payment. It will then appear in your financial records.`
            } else {
                base += `\n\nYou can manually log payments you receive, or approve payment notifications sent by tenants through their portal. This keeps your financial records accurate.`;
            }
            return base;
        },
    },
    maintenance: {
        keywords: ["maintenance", "requests", "complaint", "fix", "issue", "repair", "plumbing", "electrical"],
        response: () => `The **Requests** tab is where you manage maintenance issues reported by tenants.\n\nHere is the process:\n1. When a tenant submits a maintenance request (e.g., for a broken faucet), it appears in this list.\n2. You can view the details of the request.\n3. After the issue has been resolved, you can update its status to **"Completed"** to keep everything organized.`
    },
    notices: {
        keywords: ["notice", "notices", "announcement", "board", "broadcast", "message all"],
        response: () => `The **Notices** tab allows you to communicate with all your tenants at once.\n\nTo post a new announcement:\n1. Navigate to the **Notices** tab.\n2. Click **"Post a Notice"**.\n3. Write your message and post it.\nThis notice will then be visible to all tenants in their portal, which is perfect for general announcements like maintenance schedules or holiday greetings.`
    },

    // --- Pro & Business Plan Features ---
    expenses: {
        keywords: ["expense", "expenses", "cost", "log expense", "spending", "outgoings", "track costs"],
        response: () => `Tracking your expenses is a key **Pro feature** (<Star className="inline h-4 w-4" />) for understanding your true profitability.\n\nIn the **Expenses** section, you can:\n1. **Log Every Cost:** Click "Log an Expense" to record any spending, from maintenance and repairs to salaries and utility bills.\n2. **Categorize Spending:** Assign a category to each expense to see where your money is going.\n3. **Analyze Trends:** This data is automatically used in the **Insights** tab to give you a clear financial picture.`,
    },
    insights: {
        keywords: ["insights", "financial", "profit", "loss", "charts", "analytics", "performance"],
        response: () => `The **Insights** tab is an advanced analytics dashboard, exclusive to the **Pro plan** (<Star className="inline h-4 w-4" />) and above.\n\nIt helps you understand your business performance with:\n• **12-Month Financial Trends:** See your Revenue, Expenses, and Profit over the last year in an easy-to-read chart.\n• **Expense Breakdown:** A pie chart shows you exactly which categories are costing you the most money.`,
    },
    reports: {
        keywords: ["report", "reports", "csv", "export", "pdf", "download", "backup", "json", "data backup"],
        response: (specifics) => {
            let base = `The **Reports** section is a powerful **Pro feature** (<Star className="inline h-4 w-4" />) for exporting your data.`;
            if(specifics.includes("csv") || specifics.includes("pdf")){
                base += `\n\nYou can generate a professional **Rent Roll report** for any month. This report lists all tenants, their rooms, rent amounts, and payment status. You can download it as a **PDF** for printing or a **CSV** file for use in spreadsheet software like Excel.`;
            } else if (specifics.includes("backup") || specifics.includes("json")){
                base += `\n\nFor maximum security, you can use the **Full Data Backup** feature. This lets you download your entire application data (tenants, payments, expenses, etc.) into a single **JSON file**. This is the best way to keep a personal copy of your records.`;
            } else {
                base += `\n\nYou can export monthly rent rolls as PDF/CSV files or perform a full backup of all your app data into a single JSON file.`;
            }
            return base;
        },
    },
    documents: {
        keywords: ["document", "documents", "file", "storage", "lease", "agreement", "upload", "tenant photo"],
        response: () => `Secure Document Management is a premium feature on the **Business plan** (<Crown className="inline h-4 w-4" />).\n\nIt allows you to upload and securely store critical files for each tenant:\n• **Profile Photo:** Essential for ID cards and quick identification.\n• **Aadhaar Card:** For official identity verification.\n• **Lease Agreement:** To keep legally binding documents safe and accessible.\n\nAll uploaded files can be easily viewed in the central **Documents** tab.`,
    },
    upgrade: {
        keywords: ["upgrade", "pro", "business", "plan", 'subscription', "premium", "features", "pricing"],
        response: () => `Upgrading your plan in the **Upgrade** tab unlocks powerful features to professionalize your operation.\n\n<Star className="inline h-4 w-4 text-blue-400" /> **Pro Plan Benefits:** Gives you financial control with **Expense Tracking**, **Financial Insights**, and advanced **Reports** (PDF/CSV/JSON backup).\n\n<Crown className="inline h-4 w-4 text-purple-400" /> **Business Plan Benefits:** Includes all Pro features, plus a secure system for **Document Management** to store leases, IDs, and photos.`,
    },

    // --- Fallback ---
    fallback: {
        keywords: [],
        response: (userInput) => {
            const suggestions = ["how to add a new tenant", "explain the electricity bill feature", "what do I get if I upgrade to Pro", "how do I backup my data"];
            const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
            return `I apologize, my knowledge is highly specialized for the EstateFlow application, and I couldn't find a direct answer for your query. \n\nCould you please try rephrasing? For example, you could ask something simpler like, "${randomSuggestion}?"`;
        }
    }
};

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
            words.forEach(word => {
                if (word.length > 2 && keyword.includes(word)) currentScore += 1;
            });
        });

        if (currentScore > bestMatch.score) {
            bestMatch = { id: topicId, score: currentScore };
        }
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = () => {
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);

        setIsTyping(true);
        setTimeout(() => {
            const { response } = getMaddyResponse(input);
            const botResponse = { text: response, sender: 'bot' };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
            inputRef.current?.focus();
        }, 1200);

        setInput('');
    };
    
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        setTimeout(() => inputRef.current?.focus(), 100); 
    }

    useEffect(() => {
        if (messages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setMessages([{ text: knowledgeBase.greetings.response(), sender: 'bot' }]);
                setIsTyping(false);
            }, 1000);
        }
    }, []);
    
    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const suggestedQuestions = [
        "How to add a new tenant?",
        "Explain rent sharing for rooms.",
        "How do I backup my data?",
        "How do I handle maintenance requests?",
    ];
    
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
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        Maddy AI
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">Online</span>
                    </CardTitle>
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
                                <div className={cn(
                                    "max-w-xl p-4 rounded-2xl leading-relaxed",
                                    msg.sender === 'user' 
                                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                                        : `${theme.background} rounded-tl-none border`
                                )}>
                                     <div className="text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                                </div>
                                {msg.sender === 'user' && (
                                     <Avatar className="w-10 h-10 border shrink-0">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                             <div className="flex items-start gap-4">
                                <Avatar className="w-10 h-10 border shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white"><BrainCircuit/></AvatarFallback>
                                </Avatar>
                                <div className={cn("max-w-md p-4 rounded-2xl rounded-tl-none", theme.background, "border")}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                         {messages.length <= 1 && !isTyping && (
                            <div className="text-center text-sm text-muted-foreground pt-8">
                                <h3 className="font-bold text-lg mb-4 text-card-foreground">Here are a few things you can ask:</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {suggestedQuestions.map((q, i) => (
                                        <Button 
                                            key={i} 
                                            variant="outline" 
                                            className="h-auto text-left py-3 justify-start"
                                            onClick={() => handleSuggestionClick(q)}
                                        >
                                            {q}
                                        </Button>
                                    ))}
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
                        placeholder="Ask Maddy anything in simple terms..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleSend();
                                e.preventDefault();
                            }
                        }}
                        className="pr-20 h-12 rounded-full pl-6 text-base"
                    />
                    <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1'>
                            <Button type="submit" size="icon" onClick={handleSend} className="rounded-full w-9 h-9" disabled={isTyping || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

export default MaddyAI;
