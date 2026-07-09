import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, AlertTriangle, Heart, Phone, Mail, MapPin, Clock, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// ==================== TYPES ====================
interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    type?: 'product_info' | 'order_summary' | 'company_info' | 'menu' | 'emergency' | 'alternatives' | 'variants' | 'usage' | 'complaint';
    data?: any;
}

interface ConversationContext {
    lastMentionedProduct?: string;
    lastMentionedProductData?: any;
    conversationHistory: Message[];
    awaitingSelection?: boolean;
    selectionType?: 'variant' | 'alternative' | 'category';
    selectionOptions?: any[];
    orderState?: string;
    orderData?: {
        items: Array<{
            productName: string;
            productId?: string;
            productCompany: string;
            packSize: string;
            quantity: number;
            unitPrice: number;
        }>;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        deliveryAddress?: string;
    };
    cart?: any[];
}

// ==================== COMPANY INFO ====================
const COMPANY_INFO = {
    name: "Swift Sales Distributer",
    phone: "03008607811",
    whatsapp: "03008607811",
    email: "customercare.swiftsales@gmail.com",
    location: "C8GM+HFF, Sardar Colony, Rahim Yar Khan",
    hours: "Monday - Saturday: 9:00 AM - 6:00 PM",
    ceo: "Ejaz Malik",
    established: "2010"
};



// ==================== MAIN COMPONENT ====================
export const ChatBot: React.FC = () => {
    // Custom style to hide horizontal scrollbar and style vertical one
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
    `;

    const apiBaseUrl = import.meta.env.VITE_API_URL || '';
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [context, setContext] = useState<ConversationContext>({
        conversationHistory: []
    });
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Welcome to our pharmacy! How can I assist you today? Are you looking for a specific medicine?`,
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize session on mount
    useEffect(() => {
        const initSession = async () => {
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);

            try {
                await fetch(`${apiBaseUrl}/api/chat/session`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: newSessionId,
                        userIp: 'unknown',
                        userAgent: navigator.userAgent
                    })
                });
            } catch (error) {
                console.error('Error creating session:', error);
            }
        };

        initSession();
    }, []);

    const addBotMessage = (text: string, type?: Message['type'], data?: any) => {
        const newMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'bot',
            timestamp: new Date(),
            type,
            data
        };
        setMessages(prev => [...prev, newMsg]);
        setContext(prev => ({
            ...prev,
            conversationHistory: [...prev.conversationHistory, newMsg]
        }));
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${apiBaseUrl}/api/rag/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: userText,
                    context: context,
                    sessionId: sessionId,
                    source: "website"
                })
            });

            const data = await response.json();
            setIsLoading(false);

            if (data.success) {
                const botMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);

                // Update context from backend
                if (data.updatedContext) {
                    setContext(prev => ({ ...prev, ...data.updatedContext }));
                }

                // Process ACTIONS (Standardized with WhatsApp)
                if (data.actions && data.actions.length > 0) {
                    processActions(data.actions);
                }
            } else {
                addBotMessage("I'm having trouble processing your request. Please try again or call us at 03008607811.");
            }
        } catch (error) {
            console.error('Chat error:', error);
            setIsLoading(false);
            addBotMessage("Connection issue. Please check your internet and try again.");
        }
    };

    const processActions = (actions: any[]) => {
        actions.forEach(action => {
            console.log(`[ACTION] Executing: ${action.type}`, action);
            
            switch (action.type) {
                case 'ADD_TO_CART':
                    // Update local cart state if needed, though backend already updated context
                    const productDisplay = `${action.product_name} x ${action.quantity}`;
                    console.log(`🛒 Added to cart: ${productDisplay}`);
                    break;
                
                case 'PLACE_ORDER':
                    // Trigger order submission
                    handleOrderSubmission(action);
                    break;
                
                default:
                    console.warn(`[ACTION] Unknown action type: ${action.type}`);
            }
        });
    };    // Clear chat function (Simplified)
    const handleClearChat = () => {
        if (confirm('Are you sure you want to clear this conversation?')) {
            setMessages([{
                id: Date.now().toString(),
                text: `Welcome to our pharmacy! How can I assist you today? Are you looking for a specific medicine?`,
                sender: 'bot',
                timestamp: new Date()
            }]);
            setContext({ conversationHistory: [] });
            setInput('');
            // Optional: notify backend to clear session
        }
    };


    // Handle order submission to backend
    const handleOrderSubmission = async (orderData: any) => {
        try {
            addBotMessage('📦 Processing your order... Please wait.');

            const response = await fetch(`${apiBaseUrl}/api/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    ...orderData
                })
            });

            const result = await response.json();

            if (result.success) {
                const orderId = result.order.orderId;
                addBotMessage(
                    `✅ **Order Placed Successfully!**\n\n` +
                    `📋 **Order ID:** ${orderId}\n` +
                    `📦 **Total Items:** ${result.order.totalItems}\n` +
                    `📞 **Contact:** ${orderData.customerPhone}\n\n` +
                    `**What happens next?**\n` +
                    `1️⃣ Our team will confirm your order via phone within 30 minutes\n` +
                    `2️⃣ We'll verify product availability and finalize pricing\n` +
                    `3️⃣ Your order will be prepared for delivery\n` +
                    `4️⃣ Delivery within 24-48 hours\n\n` +
                    `💡 **Pro Tip:** Save your Order ID: **${orderId}** for tracking!\n\n` +
                    `📞 Questions? Call us: ${COMPANY_INFO.phone}\n\n` +
                    `Thank you for choosing ${COMPANY_INFO.name}! 🙏`,
                    'order_summary',
                    { orderId, orderDetails: result.order }
                );

                // Clear order context
                setContext(prev => ({
                    ...prev,
                    orderState: undefined,
                    orderData: undefined
                }));
            } else {
                addBotMessage(
                    `❌ Sorry, there was an issue processing your order.\n\n` +
                    `Please contact us directly:\n` +
                    `📞 ${COMPANY_INFO.phone}\n` +
                    `📧 ${COMPANY_INFO.email}\n\n` +
                    `We'll help you place your order right away!`
                );
            }
        } catch (error) {
            console.error('Order submission error:', error);
            addBotMessage(
                `⚠️ Connection issue while processing your order.\n\n` +
                `Please try again or contact us:\n` +
                `📞 ${COMPANY_INFO.phone}\n\n` +
                `Your cart is saved - we won't lose your order!`
            );
        }
    };

    return (
        <>
            <style>{scrollbarStyles}</style>
            <div className={`fixed z-50 transition-all duration-300 ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-8 sm:right-8' : 'bottom-4 right-4 sm:bottom-8 sm:right-8'}`}>
            <AnimatePresence>
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 transition-colors group relative"
                    >
                        <MessageSquare size={30} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
                    </button>
                )}

                {isOpen && (
                    <div
                        className="w-full h-[100dvh] sm:w-[380px] sm:h-[550px] sm:max-h-[calc(100vh-6rem)] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden sm:border sm:border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                                    <Heart size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">SwiftBot</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-100">Your Pharma Assistant</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleClearChat}
                                    className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                    title="Clear chat"
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 bg-slate-50/50 custom-scrollbar min-h-0">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                                            {m.sender === 'bot' ? <Heart size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'}`}>
                                            <div className="text-sm leading-relaxed whitespace-pre-line overflow-hidden break-words" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                                {(() => {
                                                    // Enhanced Markdown Parser for Bold, Links, and Naked URLs
                                                    // Handles **bold**, *bold*, and [text](url)
                                                    const parts = m.text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
                                                    return parts.map((part, index) => {
                                                        // Handle Bold: **text** or *text*
                                                        if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('*') && part.endsWith('*'))) {
                                                            const content = part.startsWith('**') ? part.slice(2, -2) : part.slice(1, -1);
                                                            if (content.trim()) {
                                                                return <strong key={index} className="font-bold text-slate-900">{content}</strong>;
                                                            }
                                                        }
                                                        // Handle Links: [text](url)
                                                        if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
                                                            const match = part.match(/^\[(.*?)\]\((.*?)\)$/);
                                                            if (match) {
                                                                return (
                                                                    <a
                                                                        key={index}
                                                                        href={match[2]}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-700 underline font-semibold transition-colors break-all"
                                                                    >
                                                                        {match[1]}
                                                                    </a>
                                                                );
                                                            }
                                                        }
                                                        
                                                        // Handle naked URLs (simple regex)
                                                        const urlRegex = /(https?:\/\/[^\s]+)/g;
                                                        if (urlRegex.test(part)) {
                                                            const subParts = part.split(urlRegex);
                                                            return subParts.map((subPart, subIndex) => {
                                                                if (urlRegex.test(subPart)) {
                                                                    return (
                                                                        <a
                                                                            key={`${index}-${subIndex}`}
                                                                            href={subPart}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:text-blue-700 underline font-semibold transition-colors break-all"
                                                                        >
                                                                            {subPart}
                                                                        </a>
                                                                    );
                                                                }
                                                                return subPart;
                                                            });
                                                        }

                                                        return part;
                                                    });
                                                })()}
                                            </div>

                                            {m.type === 'emergency' && (
                                                <div className="mt-3 p-3 bg-red-50 rounded-xl border-2 border-red-200">
                                                    <div className="flex items-center gap-2 text-red-700 font-bold">
                                                        <AlertTriangle size={16} />
                                                        <span className="text-xs uppercase tracking-wider">Medical Emergency</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about medicines, health..."
                                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="mt-3 text-center text-[9px] text-slate-400 font-medium">
                                Professional pharmaceutical guidance • Not a substitute for medical advice
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
        </>
    );
};
