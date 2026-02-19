import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, AlertTriangle, Heart, Phone, Mail, MapPin, Clock, Package, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import medicinesDataRaw from '../src/data/medicines.json';
import productDetails from '../src/data/productDetails.json';

// Flatten pharmaceutical_products structure into flat array
// Now handles both nested and flat structures for robustness
const medicinesData = Array.isArray(medicinesDataRaw)
    ? medicinesDataRaw
    : ((medicinesDataRaw as any).pharmaceutical_products?.flatMap((company: any) =>
        company.products.map((product: any) => ({
            ...product,
            company: company.company_name,
            pack_size: product.specification
        }))
    ) || []);


// ==================== TYPES ====================
interface Message {
    id: string;
    text: string;
    sender: 'bot' | 'user';
    timestamp: Date;
    type?: 'product_info' | 'order_summary' | 'company_info' | 'menu' | 'emergency' | 'alternatives' | 'variants' | 'usage' | 'complaint';
    data?: any;
}

type IntentType =
    | 'greeting' | 'medicine_search' | 'condition_treatment' | 'product_details'
    | 'company_info' | 'company_leadership' | 'manufacturer_inquiry' | 'price_inquiry' | 'ordering_process'
    | 'prescription_requirement' | 'side_effects' | 'alternatives' | 'thank_you'
    | 'goodbye' | 'hours_location' | 'emergency_medical' | 'usage_instructions'
    | 'follow_up' | 'complaint' | 'stock_check' | 'drug_interaction' | 'unclear'
    | 'product_catalog' | 'conversational' | 'general_ordering' | 'manufacturer_list'
    | 'product_comparison' | 'category_search' | 'price_query' | 'natural_language_search'
    | 'offensive_content';

interface ConversationContext {
    lastMentionedProduct?: string;
    lastMentionedProductData?: any;
    lastProductVariants?: any[];
    userCondition?: string;
    conversationHistory: Message[];
    awaitingSelection?: boolean;
    selectionType?: 'variant' | 'alternative' | 'category';
    selectionOptions?: any[];
    // Order flow context
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
        deliveryCity?: string;
        deliveryArea?: string;
        orderNotes?: string;
    };
    cart?: any[];
    pendingOrder?: any;
}

interface ConditionMapping {
    keywords: string[];
    products: string[];
    category: string;
}

// ==================== COMPANY INFO ====================
const COMPANY_INFO = {
    name: "Swift Sales Distributer",
    shortName: "Swift Sales",
    established: "2010",
    owner: "Ejaz Malik",
    ceo: "Ejaz Malik",
    ceoMessage: "Providing quality products with integrity and speed.",
    headOffice: "Sardar Colony, Rahim Yar Khan, Punjab, Pakistan",
    location: "C8GM+HFF, Sardar Colony, Rahim Yar Khan",
    googleMaps: "https://maps.app.goo.gl/YourLinkHere",
    phone: "+92 321 7780623",
    secondaryPhone: "+92 3XX XXXXXXX",
    whatsapp: "+92 321 7780623",
    email: "swiftsales.healthcare@gmail.com",
    supportEmail: "support@swiftsales.pk",
    website: "www.swiftsales.pk",
    facebook: "fb.com/swiftsaleshealthcare",
    yearsOfExcellence: "14+",
    totalStaff: "50+ Dedicated Professionals",
    registration: {
        drugLicense: "DL-RYK-786-2024",
        ntn: "1234567-8"
    },
    totalProducts: "2,136+",
    manufacturerCount: "34",
    hours: "Monday - Saturday: 9:00 AM - 6:00 PM",
    sunday: "Closed (Emergency Support Available via Phone)",
    mission: "To provide accessible, quality distribution with professional guidance and exceptional customer service, ensuring every client has access to essential products exactly when they need them.",
    deliveryInfo: {
        available: true,
        sameDayDelivery: "Orders before 5:00 PM",
        freeDeliveryAbove: "Rs. 2000",
        deliveryFee: "Rs. 150"
    }
};

// ==================== EXTRAORDINARY GREETING SYSTEM (100+ Variations) ====================
const GREETING_MESSAGES = {
    morning: [
        "Good morning! ☀️ Ready to help you find the perfect products to start your day right!",
        "Rise and shine! 🌅 SwiftBot here to assist with all your distribution needs!",
        "Morning! Hope you're feeling great today! How can I help with your order? 🌞",
        "Good morning! Let's make today more efficient together! What do you need? 📦",
        "Hello! Beautiful morning to take care of your business! I'm here to help! 🏢",
        "Morning! Your distribution assistant is ready! What can I do for you? ☕",
        "Good morning! Starting the day with quality supply chain support! 🌄",
        "Hey there! Morning energy activated! Let's find what you need! ⚡",
        "Good morning! Fresh start, fresh business! How may I assist? 🌻",
        "Morning sunshine! SwiftBot ready to brighten your business journey! ✨"
    ],
    afternoon: [
        "Good afternoon! 🌤️ How can I assist with your pharmaceutical needs?",
        "Afternoon! Hope your day is going well! What products are you looking for? 🏢",
        "Hello! Midday check-in! How can SwiftBot help you today? 📦",
        "Good afternoon! Let's take care of your distribution needs right now! 🌞",
        "Afternoon! Your trusted distribution partner is here! What do you need? 💼",
        "Hey! Afternoon vibes! Ready to help you grow! 🌺",
        "Good afternoon! Swift service for your swift growth! How can I help? ⚡",
        "Afternoon! Let's find the perfect solution for your business! 🎯",
        "Hello there! Afternoon business check! What brings you here today? 🌿",
        "Good afternoon! Quality products, quality service! What can I do? 💚"
    ],
    evening: [
        "Good evening! 🌆 How can I help you tonight?",
        "Evening! Winding down? Let me help with your distribution needs! 🌙",
        "Good evening! SwiftBot here for your pharmaceutical questions! 📦",
        "Hello! Evening care is just as important! What do you need? 🌃",
        "Evening! Let's ensure you have everything for a successful tomorrow! 🏢",
        "Good evening! Your business doesn't sleep, and neither do we! How can I help? 🌟",
        "Hey! Evening distribution support activated! What brings you here? 🌇",
        "Good evening! Quality products at any hour! What can I assist with? 💙",
        "Evening! Let me help you rest easy with the right products! 🌜",
        "Good evening! Swift Sales Distributer, always here for you! What do you need? ✨"
    ],
    night: [
        "Hello! 🌙 Even at night, we're here to help! What do you need?",
        "Good night! Need something urgent? I'm here 24/7! 📦",
        "Late night? No problem! SwiftBot is always ready! What can I do? 🌟",
        "Hello! Night owl? Let me help you find what you need! 🦉",
        "Good evening! Distribution doesn't wait! How can I assist? 🌃",
        "Night time business check! What brings you here? 💙",
        "Hello! Burning the midnight oil? Let me help with your stock! 🕯️",
        "Good night! Your success is our priority, anytime! What do you need? 🌙",
        "Late night support! SwiftBot ready to assist! How can I help? ⭐",
        "Hello! Even in the quiet hours, we're here for you! What can I do? 🌌"
    ],
    energetic: [
        "Hey there! 🚀 Super excited to help you today! What do you need?",
        "Hello! ⚡ Let's find exactly what you're looking for! Ready when you are!",
        "Hi! 🎯 SwiftBot powered up and ready to assist! What's on your mind?",
        "Welcome! 💪 Let's tackle your business needs together! How can I help?",
        "Hey! 🌟 Energized and ready to find the perfect products for you!",
        "Hello! 🔥 Fired up to provide the best distribution guidance! What do you need?",
        "Hi there! ⚡ Lightning-fast service, caring support! What brings you here?",
        "Welcome! 🎊 Thrilled to help you on your business journey! What can I do?",
        "Hey! 💫 Dynamic distribution support at your service! How may I assist?",
        "Hello! 🌈 Bringing positive energy to your distribution needs! What's up?"
    ],
    professional: [
        "Welcome to Swift Sales Distributer. How may I assist you today? 🏢",
        "Good day. I'm SwiftBot, your pharmaceutical advisor. What do you need? 📦",
        "Hello. Professional distribution guidance at your service. How can I help? 📋",
        "Welcome. Expert distribution assistance ready. What brings you here? 💼",
        "Good day. Swift Sales Distributer - Quality care, every time. What do you need? ✅",
        "Hello. Your trusted distribution partner. How may I assist? 🎯",
        "Welcome. Professional, reliable, caring service. What can I do for you? 💚",
        "Good day. Expert guidance for your business needs. How can I help? 📊",
        "Hello. Swift Sales Distributer - Excellence in distribution. What do you need? 🏆",
        "Welcome. Dedicated to your growth and success. How may I assist? 💙"
    ],
    caring: [
        "Hello! 💚 How is your business doing today? What can I help you with?",
        "Hi there! 🤗 I'm here to take care of your distribution needs. What do you need?",
        "Welcome! 💙 Your success matters to us. How can I help you grow today?",
        "Hello! 🌸 Let me help you find the right solution. What brings you here?",
        "Hi! 💛 We care about your business journey. What do you need today?",
        "Welcome! 🌺 Dedicated care, expert guidance. How can I assist?",
        "Hello! 💕 Your success is precious to us. What can I do for you?",
        "Hi there! 🌼 Gentle, proactive, professional support. What do you need?",
        "Welcome! 💖 We're here to support your growth. How may I help?",
        "Hello! 🌻 Caring for your business with dedication. What brings you here?"
    ],
    wellness: [
        "Hello! 🌿 Let's work towards better business together! What do you need?",
        "Hi! 💪 Business growth is a journey, and we're here to guide you! How can I help?",
        "Welcome! 🥗 Your success, our priority! What brings you here today?",
        "Hello! 🧘 Holistic support, expert advice! What can I assist with?",
        "Hi there! 🏃 Active distribution, active business! How may I help you?",
        "Welcome! 🌱 Growing stronger every day! What do you need?",
        "Hello! 💚 Progress starts here! How can I support your business?",
        "Hi! 🌟 Vibrant business, vibrant life! What brings you to us?",
        "Welcome! 🍃 Natural growth, professional guidance! What can I do?",
        "Hello! 🌈 Efficiency and success go hand in hand! How can I help?"
    ],
    motivational: [
        "Hello! 💪 You're taking charge of your business - that's amazing! What do you need?",
        "Hi! 🌟 Every step towards growth is a victory! How can I help?",
        "Welcome! 🎯 You've got this! Let me support your distribution journey! What do you need?",
        "Hello! 🚀 Investing in your growth is the best decision! How can I assist?",
        "Hi there! ⭐ Your success matters! Let's find what you need together!",
        "Welcome! 💫 Taking care of your supply chain is powerful! What brings you here?",
        "Hello! 🏆 You're prioritizing your efficiency - excellent! How can I help?",
        "Hi! 🌈 Stock is wealth, and you're on the right path! What do you need?",
        "Welcome! ✨ Your commitment to excellence inspires us! How may I assist?",
        "Hello! 🎊 Celebrating your business journey! What can I do for you?"
    ],
    friendly: [
        "Hey friend! 👋 What can I help you find today?",
        "Hi there! 😊 So glad you're here! What do you need?",
        "Hello! 🙂 Your friendly distribution assistant ready! How can I help?",
        "Hey! 👍 Let's find exactly what you're looking for! What's up?",
        "Hi! 😄 Always happy to help! What brings you here?",
        "Hello there! 🤝 Your business partner at your service! What do you need?",
        "Hey! 💬 Let's chat about your distribution needs! How can I assist?",
        "Hi friend! 🌟 Ready to help you succeed! What can I do?",
        "Hello! 😊 Friendly service, expert care! What brings you here?",
        "Hey there! 👋 Let's make your business journey easier! What do you need?"
    ],
    seasonal: [
        "Hello! 🌸 Spring into better business! How can I help?",
        "Hi! ☀️ Summer growth vibes! What do you need today?",
        "Welcome! 🍂 Fall into good business! How may I assist?",
        "Hello! ❄️ Winter essentials! What brings you here?",
        "Hi! 🌺 Seasonal support ready! What can I do?",
        "Welcome! 🌞 Efficiency and growth! How can I help you?",
        "Hello! 🍁 Autumn business check! What do you need?",
        "Hi! ⛄ Proactive distribution care! How may I assist you?",
        "Welcome! 🌼 Blooming with success! What brings you here?",
        "Hello! 🌤️ Weather the season with good stock! What can I do?"
    ]
};

// Smart greeting selector
const getSmartGreeting = (): string => {
    const hour = new Date().getHours();
    const day = new Date().getDay();

    // Determine time of day
    let timeCategory: keyof typeof GREETING_MESSAGES;
    if (hour >= 5 && hour < 12) timeCategory = 'morning';
    else if (hour >= 12 && hour < 17) timeCategory = 'afternoon';
    else if (hour >= 17 && hour < 21) timeCategory = 'evening';
    else timeCategory = 'night';

    // Mix in other categories for variety
    const categories = [timeCategory, 'energetic', 'professional', 'caring', 'wellness', 'motivational', 'friendly'];
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)] as keyof typeof GREETING_MESSAGES;

    const greetings = GREETING_MESSAGES[selectedCategory];
    return greetings[Math.floor(Math.random() * greetings.length)];
};

// ==================== CONDITION MAPPINGS ====================
const CONDITION_MAPPINGS: Record<string, ConditionMapping> = {
    pain: {
        keywords: ['pain', 'headache', 'backache', 'toothache', 'ache', 'hurt', 'sore'],
        products: ['SIDOCAM', 'PROXCAM', 'POFEN', 'SIDOFENAC-K'],
        category: 'Pain Relief'
    },
    fever: {
        keywords: ['fever', 'temperature', 'hot', 'pyrexia'],
        products: ['SIDOCAM', 'PROXCAM', 'POFEN'],
        category: 'Fever Management'
    },
    cough: {
        keywords: ['cough', 'cold', 'flu', 'throat', 'congestion'],
        products: ['SENKOF', 'PENTALLIN', 'BRONOCARE', 'COFREX', 'KUFMED'],
        category: 'Respiratory Care'
    },
    skin: {
        keywords: ['skin', 'rash', 'acne', 'eczema', 'derma', 'itch', 'pimple'],
        products: ['SIDIK CREAM', 'A-CION GEL', 'SCABI WASH', 'RACNE', 'AKWIN', 'GLOW'],
        category: 'Dermatological Care'
    },
    stomach: {
        keywords: ['stomach', 'digestion', 'acidity', 'gastric', 'ulcer', 'heartburn', 'indigestion'],
        products: ['JELOCID', 'SANAMIDOL', 'PENTACID', 'ACIPRAZ', 'MERAZ', 'H2-FOZ'],
        category: 'Gastrointestinal Care'
    },
    vitamins: {
        keywords: ['vitamin', 'supplement', 'weak', 'energy', 'tired', 'multivitamin', 'fatigue'],
        products: ['VITAGLOBIN', 'VIVIN PLUS', 'GENCAL PLUS', 'SAGEVIT', 'HOMEGA'],
        category: 'Vitamins & Supplements'
    },
    calcium: {
        keywords: ['calcium', 'bone', 'osteo'],
        products: ['INTICAL', 'CALIK', 'GENCAL PLUS', 'E-CAL D'],
        category: 'Calcium Supplements'
    },
    iron: {
        keywords: ['iron', 'anemia', 'anaemia', 'blood', 'hemoglobin'],
        products: ['IROSONE', 'IROFEM', 'GLAYFER', 'FERLIT-F'],
        category: 'Iron Supplements'
    },
    antibiotic: {
        keywords: ['antibiotic', 'infection', 'bacterial'],
        products: ['AZICOB', 'CIPROK', 'STRACEF', 'DRONCEF', 'BACTONIS', 'CIPONA'],
        category: 'Antibiotics'
    },
    baby: {
        keywords: ['baby', 'infant', 'formula', 'newborn', 'child'],
        products: ['V-LAC', 'FOLIBION'],
        category: 'Baby Care'
    }
};

// ==================== FUZZY MATCHING ====================
const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
            }
        }
    }
    return matrix[str2.length][str1.length];
};

const fuzzySearch = (query: string, threshold: number = 3) => {
    const lowerQuery = query.toLowerCase();
    const exactMatches = medicinesData.filter(m => m.name.toLowerCase().includes(lowerQuery));

    if (exactMatches.length > 0) return { exact: exactMatches, fuzzy: [] };

    const fuzzyMatches = medicinesData
        .map(m => ({ ...m, distance: levenshteinDistance(lowerQuery, m.name.toLowerCase()) }))
        .filter(m => m.distance <= threshold)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

    return { exact: [], fuzzy: fuzzyMatches };
};

// ==================== INTENT CLASSIFICATION ====================
const classifyIntent = (text: string, context: ConversationContext): IntentType => {
    const lower = text.toLowerCase().trim();

    // ==================== PRIORITY 1: SAFETY & GREETINGS ====================

    // Offensive content (highest priority for safety)
    if (/(fuck|bitch|bastard|asshole|idiot|stupid|bad bot|useless|shit|damn|crap)/i.test(lower)) {
        return 'offensive_content';
    }

    // Emergency detection
    if (/(can't breathe|chest pain|severe pain|emergency|urgent|help immediately|suicide|dying)/i.test(lower)) {
        return 'emergency_medical';
    }

    // Simple greetings (exact matches only)
    if (/^(hi|hello|hey|salam|good morning|good afternoon|good evening|assalam|greetings)$/i.test(lower)) {
        return 'greeting';
    }

    // Conversational queries
    if (/(how\s+(are|r)\s+(you|u|ou)|are\s+you\s+(fine|ok|okay|good)|how\s+do\s+you\s+feel|what'?s\s+up|how\s+you\s+doing)/i.test(lower)) {
        return 'conversational';
    }

    // Thank you / Goodbye
    if (/(thank|thanks|appreciate|grateful)/i.test(lower)) return 'thank_you';
    if (/(bye|goodbye|see you|later|take care)/i.test(lower)) return 'goodbye';

    // ==================== PRIORITY 2: CONTEXT-AWARE ====================

    // Follow-up detection (if there's context from previous conversation)
    const isFollowUp = (
        (context.lastMentionedProduct || context.awaitingSelection) &&
        /(it|that|they|them|those|these|the price|cost|how to|usage|details|more|side effect)/i.test(lower)
    ) || (
            lower.startsWith('and ') || lower.startsWith('also ') || lower.includes(' what about')
        );
    if (isFollowUp) return 'follow_up';

    // Selection from options
    if (context.awaitingSelection && (/^[1-9]$|first|second|third|that one|this one|tell me more|more info|details|all of them|these/i.test(lower))) {
        return 'follow_up';
    }

    // ==================== PRIORITY 3: RAG-POWERED INTELLIGENCE ====================
    // Route ALL other queries to RAG for intelligent responses

    return 'unclear'; // Will be handled by RAG in processIntent
};

// ==================== PRODUCT DETAIL HELPER ====================
const getProductDetails = (productName: string) => {
    const normalizedName = productName.toUpperCase().replace(/\s+/g, ' ').trim();

    for (const [key, details] of Object.entries(productDetails)) {
        if (normalizedName.includes(key.toUpperCase())) {
            return { key, details };
        }
    }
    return null;
};

// ==================== MAIN COMPONENT ====================
export const ChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');
    const [context, setContext] = useState<ConversationContext>({
        conversationHistory: []
    });
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello! Welcome to ${COMPANY_INFO.name}. I'm SwiftBot, your pharmaceutical assistant. 😊\n\nHow can I help you today?\n\n• Find specific medicines\n• Get health recommendations\n• Learn about products\n• Company information\n• Place orders`,
            sender: 'bot',
            timestamp: new Date(),
            type: 'menu'
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
                await fetch('http://localhost:5000/api/chat/session', {
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

    // Save message to database
    const saveMessageToDb = async (message: Message, intent?: string) => {
        if (!sessionId) return;

        try {
            await fetch('http://localhost:5000/api/chat/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    messageId: message.id,
                    sender: message.sender,
                    messageText: message.text,
                    messageType: message.type,
                    intent: intent
                })
            });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    // Save product inquiry to database
    const saveProductInquiry = async (productName: string, productId?: string, productCompany?: string, inquiryType?: string) => {
        if (!sessionId) return;

        try {
            await fetch('http://localhost:5000/api/chat/product-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    messageId: Date.now().toString(),
                    productName,
                    productId,
                    productCompany,
                    inquiryType
                })
            });
        } catch (error) {
            console.error('Error saving product inquiry:', error);
        }
    };

    // Save user condition to database
    const saveUserCondition = async (conditionType: string, productsRecommended: string[]) => {
        if (!sessionId) return;

        try {
            await fetch('http://localhost:5000/api/chat/condition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    conditionType,
                    productsRecommended
                })
            });
        } catch (error) {
            console.error('Error saving condition:', error);
        }
    };

    // Clear chat function
    const handleClearChat = async () => {
        if (confirm('Are you sure you want to clear this conversation?')) {
            // End current session in database
            if (sessionId) {
                try {
                    await fetch(`http://localhost:5000/api/chat/session/${sessionId}`, {
                        method: 'DELETE'
                    });
                } catch (error) {
                    console.error('Error ending session:', error);
                }
            }

            // Reset state
            setMessages([{
                id: Date.now().toString(),
                text: `Hello! Welcome to ${COMPANY_INFO.name}. I'm SwiftBot, your pharmaceutical assistant. 😊\n\nHow can I help you today?\n\n• Find specific medicines\n• Get health recommendations\n• Learn about products\n• Company information\n• Place orders`,
                sender: 'bot',
                timestamp: new Date(),
                type: 'menu'
            }]);
            setContext({ conversationHistory: [] });
            setInput('');

            // Create new session
            const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            setSessionId(newSessionId);

            try {
                await fetch('http://localhost:5000/api/chat/session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId: newSessionId,
                        userIp: 'unknown',
                        userAgent: navigator.userAgent
                    })
                });
            } catch (error) {
                console.error('Error creating new session:', error);
            }
        }
    };

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

        // Save to database
        saveMessageToDb(newMsg);
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
        setContext(prev => ({
            ...prev,
            conversationHistory: [...prev.conversationHistory, userMsg]
        }));
        setInput('');
        // Detect intent and save user message to database
        const intent = classifyIntent(userText, context);
        saveMessageToDb(userMsg, intent);

        // Process intent immediately (or with minimal delay for UI responsiveness)
        setTimeout(() => {
            processIntent(userText);
        }, 50);
    };

    const processIntent = (text: string) => {
        const intent = classifyIntent(text, context);

        switch (intent) {
            case 'greeting':
                const smartGreeting = getSmartGreeting();
                addBotMessage(smartGreeting, 'menu');
                break;

            case 'follow_up':
                if (context.awaitingSelection && context.selectionOptions) {
                    handleFollowUp(text);
                } else {
                    // Intelligent follow-up: send to RAG with the full context of the last mentioned product
                    addBotMessage(`🤔 Checking details for ${context.lastMentionedProduct || 'our products'}...`);

                    fetch('http://localhost:5000/api/rag/query', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: text,
                            context: context,
                            sessionId
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.response) {
                                if (data.type === 'order_ready' && data.orderData) {
                                    handleOrderSubmission(data.orderData);
                                } else {
                                    addBotMessage(data.response);
                                }
                                if (data.updatedContext) {
                                    setContext(prev => ({ ...prev, ...data.updatedContext }));
                                }
                            } else {
                                addBotMessage(`I'm still learning! Could you please clarify if you're asking about **${context.lastMentionedProduct}**?`);
                            }
                        })
                        .catch(() => {
                            addBotMessage(`I'm here to help! Are you asking for more details about **${context.lastMentionedProduct}**?`);
                        });
                }
                break;

            case 'medicine_search':
            case 'stock_check':
                handleMedicineSearch(text);
                break;

            case 'condition_treatment':
                handleConditionTreatment(text);
                break;

            case 'usage_instructions':
                handleUsageInstructions(text);
                break;

            case 'complaint':
                handleComplaint(text);
                break;

            case 'drug_interaction':
                handleDrugInteraction(text);
                break;

            case 'company_info':
                addBotMessage(
                    `✨ **Detailed Profile: ${COMPANY_INFO.name}**\n\n` +
                    `🤵 **Founder & CEO:** ${COMPANY_INFO.ceo}\n` +
                    `💬 "${COMPANY_INFO.ceoMessage}"\n\n` +
                    `🏢 **Head Office:** ${COMPANY_INFO.headOffice}\n` +
                    `📍 **Location:** ${COMPANY_INFO.location}\n\n` +
                    `📞 **Contact:** ${COMPANY_INFO.phone}\n` +
                    `💬 **WhatsApp:** ${COMPANY_INFO.whatsapp}\n` +
                    `📧 **Email:** ${COMPANY_INFO.email}\n` +
                    `🌐 **Website:** [${COMPANY_INFO.website}](https://${COMPANY_INFO.website})\n\n` +
                    `📊 **Quick Stats:**\n` +
                    `• **${COMPANY_INFO.totalProducts}** Registered Products\n` +
                    `• **${COMPANY_INFO.manufacturerCount}** Manufacturers\n` +
                    `• **${COMPANY_INFO.yearsOfExcellence}** Years of Excellence\n\n` +
                    `How can I help you today? 😊`,
                    'company_info'
                );
                break;

            case 'company_leadership':
                addBotMessage(
                    `👔 **Leadership at ${COMPANY_INFO.name}**\n\n` +
                    `**Founder & CEO:** ${COMPANY_INFO.ceo}\n` +
                    `💬 "${COMPANY_INFO.ceoMessage}"\n\n` +
                    `Under ${COMPANY_INFO.ceo}'s leadership since ${COMPANY_INFO.established}, Swift Sales Distributer has grown to:\n` +
                    `• **${COMPANY_INFO.totalProducts}** products\n` +
                    `• **${COMPANY_INFO.manufacturerCount}** manufacturing partners\n` +
                    `• **${COMPANY_INFO.yearsOfExcellence}** years of excellence in distribution\n\n` +
                    `📞 **Contact:** ${COMPANY_INFO.phone}\n` +
                    `📧 **Email:** ${COMPANY_INFO.email}\n\n` +
                    `How else can I help you? 😊`
                );
                break;

            case 'manufacturer_inquiry':
                addBotMessage(
                    `We partner with **${COMPANY_INFO.manufacturerCount} top-tier manufacturers**. Here are our primary partners:\n\n` +
                    `1. **SHROOQ PHARMA** (239 products)\n` +
                    `2. **SWISS IQ BIOCEUTICS** (163 products)\n` +
                    `3. **AVANT PHARMA** (139 products)\n` +
                    `4. **TRIAFA PHARMACEUTICAL** (110 products)\n` +
                    `5. **OSPHERIC PHARMACEUTICALS** (107 products)\n\n` +
                    `Would you like to see products from any of these?`
                );
                break;

            case 'hours_location':
                addBotMessage(
                    `📍 **Our Location & Hours**\n\n` +
                    `**Address:**\n${COMPANY_INFO.location}\n\n` +
                    `**Operating Hours:**\n${COMPANY_INFO.hours}\n**Sunday:** ${COMPANY_INFO.sunday}\n\n` +
                    `**Contact:**\n📞 ${COMPANY_INFO.phone}\n📧 ${COMPANY_INFO.email}\n\n` +
                    `💡 **Pro Tips:**\n` +
                    `• Weekday mornings are usually less busy\n` +
                    `• Call ahead for prescription orders - we'll have them ready!\n` +
                    `• Saturday afternoons can be crowded\n\n` +
                    `Need directions? Our location is easily accessible in Sardar Colony!`
                );
                break;

            case 'conversational':
                const conversationalResponses = [
                    "I'm doing great, thank you for asking! 😊 I'm here and ready to help you with any pharmaceutical needs. What can I do for you today?",
                    `I'm doing great, thank you for asking! 😊\n\nI'm here and ready to help you with:\n• Finding medicines\n• Health recommendations\n• Product information\n• Ordering assistance\n\nHow can I assist you today?`,
                    "I'm wonderful! 🌟 Always happy to assist with your health and medicine questions. How can I help you?",
                    "I'm doing fantastic, thanks! 💊 Ready to help you find the perfect medicine or answer any health questions. What do you need?",
                    "I'm great! 😊 More importantly, how can I help YOU today? Looking for a specific medicine or health advice?",
                    "I'm doing well, thank you! 🏥 I'm here to make your pharmaceutical shopping easier. What brings you here today?"
                ];
                const randomResponse = conversationalResponses[Math.floor(Math.random() * conversationalResponses.length)];
                addBotMessage(randomResponse, 'menu');
                break;

            case 'price_inquiry':
                addBotMessage(
                    `For current pricing information:\n\n` +
                    `📞 **Phone:** ${COMPANY_INFO.phone}\n` +
                    `📧 **Email:** ${COMPANY_INFO.email}\n\n` +
                    `💬 **WhatsApp:** ${COMPANY_INFO.whatsapp}\n\n` +
                    `Feel free to visit us or call for any assistance! 😊\n\n` +
                    `Prices may vary based on:\n` +
                    `• Pack size\n• Current promotions\n• Bulk discounts\n\n` +
                    `Our team will provide you with accurate pricing and availability!`
                );
                break;

            case 'ordering_process':
                addBotMessage(
                    `**How to Order from ${COMPANY_INFO.name}:**\n\n` +
                    `📱 **Phone Order:**\n` +
                    `Call: ${COMPANY_INFO.phone}\n` +
                    `Available: ${COMPANY_INFO.hours}\n\n` +
                    `🏪 **In-Store:**\n` +
                    `Visit: ${COMPANY_INFO.location}\n` +
                    `Immediate pickup available\n\n` +
                    `🚚 **Home Delivery:**\n` +
                    `• Same-day delivery (orders before 5:00 PM)\n` +
                    `• Free delivery on orders above Rs. 2000\n` +
                    `• Delivery fee: Rs. 150 for orders below Rs. 2000\n\n` +
                    `📋 **What You'll Need:**\n` +
                    `✓ Product name & quantity\n` +
                    `✓ Prescription (for prescription medicines)\n` +
                    `✓ Contact information\n` +
                    `✓ Delivery address\n\n` +
                    `💡 Tip: Have your prescription ready when ordering!`
                );
                break;

            case 'prescription_requirement':
                addBotMessage(
                    `**About Prescriptions:**\n\n` +
                    `Many medications require a valid prescription from a licensed healthcare provider for:\n\n` +
                    `• Patient safety\n• Proper diagnosis\n• Correct usage\n• Legal compliance\n\n` +
                    `⚠️ **Important:**\n` +
                    `• Never use medicines without proper guidance\n` +
                    `• Complete the full course as prescribed\n` +
                    `• Consult our pharmacist for questions\n\n` +
                    `📞 Call us at ${COMPANY_INFO.phone} for specific medicine requirements!`
                );
                break;

            case 'side_effects':
                addBotMessage(
                    `**About Side Effects & Safety:**\n\n` +
                    `⚠️ For detailed safety information, I recommend speaking with a healthcare professional.\n\n` +
                    `📞 **Our Pharmacist Can Help:**\n` +
                    `• Discuss potential side effects\n` +
                    `• Explain safety precautions\n• Review drug interactions\n\n` +
                    `**Contact:** ${COMPANY_INFO.phone}\n\n` +
                    `🏥 **General Safety Tips:**\n` +
                    `✓ Read medicine leaflet carefully\n` +
                    `✓ Follow prescribed dosage exactly\n` +
                    `✓ Inform doctor of allergies\n` +
                    `✓ Report unusual symptoms immediately\n\n` +
                    `🚨 Seek emergency help for severe reactions!`
                );
                break;

            case 'emergency_medical':
                addBotMessage(
                    `🚨 **THIS SOUNDS LIKE A MEDICAL EMERGENCY!** 🚨\n\n` +
                    `**PLEASE ACT IMMEDIATELY:**\n\n` +
                    `1️⃣ Call Emergency Services: 1122\n` +
                    `2️⃣ Go to nearest Emergency Room\n` +
                    `3️⃣ If alone, call someone for help\n\n` +
                    `**DO NOT WAIT - GET PROFESSIONAL MEDICAL HELP NOW!**\n\n` +
                    `Your safety is the absolute priority. Please seek immediate medical attention.\n\n` +
                    `(After emergency is handled, contact us at ${COMPANY_INFO.phone} for prescription refills)`,
                    'emergency'
                );
                break;

            case 'thank_you':
                addBotMessage(
                    `You're very welcome! I'm glad I could help! 😊\n\n` +
                    `Remember:\n` +
                    `📞 ${COMPANY_INFO.phone}\n` +
                    `📧 ${COMPANY_INFO.email}\n\n` +
                    `Stay healthy! Feel free to ask if you need anything else!`
                );
                break;

            case 'goodbye':
                addBotMessage(
                    `Goodbye! Take care and stay healthy! 🌟\n\n` +
                    `We're here whenever you need us:\n` +
                    `📞 ${COMPANY_INFO.phone}\n` +
                    `📍 ${COMPANY_INFO.location}\n\n` +
                    `Have a wonderful day! 👋`
                );
                break;

            case 'product_catalog':
                addBotMessage(
                    `📦 **Our Product Catalog:**\n\n` +
                    `We have over **${COMPANY_INFO.totalProducts} pharmaceutical products** from **${COMPANY_INFO.manufacturerCount} registered companies**.\n\n` +
                    `**Popular Categories:**\n` +
                    `• Pain Relief & Fever Management\n` +
                    `• Antibiotics & Infections\n` +
                    `• Skin Care & Dermatology\n` +
                    `• Digestive Health & Gastric Care\n` +
                    `• Vitamins & Nutritional Supplements\n` +
                    `• Respiratory & Cough Care\n\n` +
                    `**How can I help you?**\n` +
                    `• Search for a specific medicine by name\n` +
                    `• Get recommendations for a health condition\n` +
                    `• Browse products from a specific manufacturer\n\n` +
                    `Just tell me what you're looking for! 😊`
                );
                break;


            case 'general_ordering':
                addBotMessage(
                    `Great! I'd be happy to help you place an order! 🛒\n\n` +
                    `**Ordering Options:**\n\n` +
                    `📞 **Phone Order:**\n` +
                    `Call ${COMPANY_INFO.phone}\n` +
                    `We'll take your order and have it ready!\n\n` +
                    `🏪 **In-Store:**\n` +
                    `Visit us at: ${COMPANY_INFO.location}\n` +
                    `Hours: ${COMPANY_INFO.hours}\n\n` +
                    `🚚 **Home Delivery:**\n` +
                    `• Minimum order: Rs. 500\n` +
                    `• Delivery fee: Rs. 100-200 (based on location)\n` +
                    `• Call to arrange delivery\n\n` +
                    `Which product would you like to order? Tell me the name and I'll check availability! 😊`
                );
                break;

            case 'product_comparison':
                // Extract product names from query
                const comparisonMatch = text.match(/(compare|difference between|vs|versus)\s+(.+?)\s+(and|vs|versus|or)\s+(.+?)(\?|$)/i);
                if (comparisonMatch) {
                    const product1 = comparisonMatch[2].trim();
                    const product2 = comparisonMatch[4].trim();

                    addBotMessage(`🔍 Comparing ${product1.toUpperCase()} and ${product2.toUpperCase()}...`);

                    // Use RAG for intelligent comparison
                    fetch('http://localhost:5000/api/rag/query', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: `Compare ${product1} and ${product2} medicines. Focus on key differences, uses, and which might be better for what situation.`,
                            context: { totalProducts: medicinesData.length, orderState: context.orderState, orderData: context.orderData },
                            sessionId
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.response) {
                                addBotMessage(`📊 **Comparison: ${product1.toUpperCase()} vs ${product2.toUpperCase()}**\n\n${data.response}\n\n💡 Need more details about either product? Just ask!`);
                                if (data.updatedContext) {
                                    setContext(prev => ({ ...prev, ...data.updatedContext }));
                                }
                            } else {
                                addBotMessage(`I can help compare products! Try searching for each one individually first:\n• "Do you have ${product1}?"\n• "Do you have ${product2}?"`);
                            }
                        })
                        .catch(error => {
                            console.error('Comparison error:', error);
                            addBotMessage(`Let me search for both products:\n• ${product1}\n• ${product2}\n\nWhich one would you like to know about first?`);
                        });
                } else {
                    addBotMessage(`I can help you compare products! Please specify which two medicines you'd like to compare.\n\nExample: "Compare SIDOCAM and PROXCAM"`);
                }
                break;

            case 'category_search':
                // Extract category from query
                const categoryMatch = text.match(/(antibiotic|pain|fever|vitamin|supplement|skin|gastric|diabetes|blood pressure)/i);
                if (categoryMatch) {
                    const category = categoryMatch[1];
                    addBotMessage(`🔍 Searching for ${category} products...`);

                    // Use RAG to find and categorize products
                    fetch('http://localhost:5000/api/rag/search', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: `${category} medicine pharmaceutical product`,
                            limit: 15,
                            sessionId
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.results && data.results.length > 0) {
                                let response = `💊 **${category.toUpperCase()} Products:**\n\n`;
                                data.results.slice(0, 10).forEach((result, i) => {
                                    response += `${i + 1}. **${result.metadata.name}**\n`;
                                    response += `   ${result.metadata.company}`;
                                    if (result.metadata.pack_size) response += ` - ${result.metadata.pack_size}`;
                                    response += `\n\n`;
                                });
                                if (data.results.length > 10) {
                                    response += `_...and ${data.results.length - 10} more products_\n\n`;
                                }
                                response += `📞 For detailed information, call ${COMPANY_INFO.phone}\n\nWhich product interests you?`;
                                addBotMessage(response);
                            } else {
                                addBotMessage(`I couldn't find specific ${category} products in our current catalog. Let me know what condition you're treating, and I can suggest alternatives!`);
                            }
                        })
                        .catch(error => {
                            console.error('Category search error:', error);
                            addBotMessage(`I can help you find ${category} products! What specific condition are you treating?`);
                        });
                } else {
                    addBotMessage(`I can help you find products by category! Try:\n• "Show me all pain relievers"\n• "List antibiotics"\n• "What vitamins do you have?"`);
                }
                break;


            case 'price_query':
                addBotMessage(`💰 Analyzing pricing and availability...`);

                fetch('http://localhost:5000/api/rag/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `Provide detailed pricing, package, or affordability information for: ${text}`,
                        context: context,
                        sessionId
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.response) {
                            if (data.type === 'order_ready' && data.orderData) handleOrderSubmission(data.orderData);
                            else addBotMessage(data.response);
                            if (data.updatedContext) {
                                setContext(prev => ({ ...prev, ...data.updatedContext }));
                            }
                        } else {
                            addBotMessage(`For exact pricing of ${context.lastMentionedProduct || 'our medicines'}, please call us at ${COMPANY_INFO.phone}. Prices can vary by pack size!`);
                        }
                    });
                break;

            case 'natural_language_search':
                // Handle complex natural language queries
                addBotMessage(`🤔 Understanding your needs...`);

                fetch('http://localhost:5000/api/rag/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: text,
                        context: context,
                        sessionId
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.response) {
                            if (data.type === 'order_ready' && data.orderData) handleOrderSubmission(data.orderData);
                            else addBotMessage(`💡 ${data.response}\n\n📞 For personalized recommendations, call ${COMPANY_INFO.phone}`);
                            if (data.updatedContext) {
                                setContext(prev => ({ ...prev, ...data.updatedContext }));
                            }
                        } else {
                            addBotMessage(`I'd love to help! Could you tell me more about what you're looking for? For example:\n• What condition are you treating?\n• Any specific preferences (price, brand, etc.)?`);
                        }
                    })
                    .catch(error => {
                        console.error('Natural language search error:', error);
                        addBotMessage(`I want to help you find the right product! Could you rephrase your question or tell me:\n• What condition you're treating?\n• Any specific requirements?`);
                    });
                break;

            case 'offensive_content':
                addBotMessage(
                    `I'm here to provide professional pharmaceutical assistance and help you with your healthcare needs. 😊\n\n` +
                    `Let's keep our conversation respectful so I can assist you better. How can I help you with our medicines or company information today?`,
                    'menu'
                );
                break;

            case 'unclear':
            default:
                // Use RAG with embeddings search to try and answer
                addBotMessage(`Please wait, let me search this for you... 🔍`);

                // Delay the actual search and loading bubble to allow user to read the message
                setTimeout(() => {
                    setIsLoading(true);

                    fetch('http://localhost:5000/api/rag/query', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: text,
                            context: context,
                            sessionId
                        })
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.response) {
                                if (data.type === 'order_ready' && data.orderData) handleOrderSubmission(data.orderData);
                                else addBotMessage(data.response);
                                if (data.updatedContext) {
                                    setContext(prev => ({ ...prev, ...data.updatedContext }));
                                }
                            } else {
                                addBotMessage(
                                    `I want to make sure I understand you correctly. Could you please rephrase that?\n\n` +
                                    `Try asking:\n` +
                                    `• "Do you have [medicine name]?"\n` +
                                    `• "I need something for [condition]"\n` +
                                    `• "How to use [medicine]?"\n` +
                                    `• "Tell me about your company" 😊`
                                );
                            }
                        })
                        .catch(error => {
                            console.error('General query error:', error);
                            addBotMessage(`I'm here to help! Could you please tell me more about what you're looking for?`);
                        })
                        .finally(() => {
                            setIsLoading(false);
                        });
                }, 1500); // 1.5s delay before showing bubble/fetching
                break;
        }
    };

    const handleFollowUp = (text: string) => {
        if (!context.awaitingSelection || !context.selectionOptions) {
            return;
        }

        let selectedIndex = -1;
        const lower = text.toLowerCase();

        // Handle numbered selection
        if (/^[1-9]$/.test(text)) {
            selectedIndex = parseInt(text) - 1;
        } else if (/first|1st/i.test(lower)) {
            selectedIndex = 0;
        } else if (/second|2nd/i.test(lower)) {
            selectedIndex = 1;
        } else if (/third|3rd/i.test(lower)) {
            selectedIndex = 2;
        } else if (/(all|these|them|details)/i.test(lower)) {
            // "Show me details for these" -> Show the first one as a starting point
            // This prevents falling back to search
            selectedIndex = 0;
            addBotMessage("Here are the details for the first option. Let me know if you'd like to see others! 😊");
        }

        if (selectedIndex >= 0 && selectedIndex < context.selectionOptions.length) {
            const selected = context.selectionOptions[selectedIndex];

            setContext(prev => ({
                ...prev,
                lastMentionedProduct: selected.name,
                lastMentionedProductData: selected,
                awaitingSelection: false,
                selectionOptions: undefined
            }));

            // Provide detailed information about selected product
            provideDetailedProductInfo(selected);
        } else {
            addBotMessage(
                `Please select a valid option by typing the number (1, 2, 3, etc.) or saying "the first one", "the second one", etc.`
            );
        }
    };

    const provideDetailedProductInfo = (product: any) => {
        const details = getProductDetails(product.name);

        if (details && details.details) {
            const d = details.details as any;

            let response = `Perfect! **${product.name}** - Great choice!\n\n`;
            response += `📦 **Product Information:**\n`;
            response += `• Code: ${product.id}\n`;
            response += `• Manufacturer: ${product.company}\n`;
            response += `• Pack Size: ${product.pack_size || 'Standard'}\n`;

            if (d.requiresPrescription !== undefined) {
                response += `• Prescription: ${d.requiresPrescription ? '⚠️ Required' : '✓ Not Required'}\n`;
            }

            if (d.benefits && d.benefits.length > 0) {
                response += `\n🎯 **Benefits:**\n`;
                d.benefits.slice(0, 4).forEach((b: string) => {
                    response += `• ${b}\n`;
                });
            }

            if (d.usageInstructions) {
                response += `\n💊 **How to Use:**\n`;
                if (d.usageInstructions.adults) {
                    response += `**Adults:** ${d.usageInstructions.adults}\n`;
                }
                if (d.usageInstructions.timing) {
                    response += `**When:** ${d.usageInstructions.timing}\n`;
                }
                if (d.usageInstructions.frequency) {
                    response += `**Frequency:** ${d.usageInstructions.frequency}\n`;
                }
            }

            if (d.precautions && d.precautions.length > 0) {
                response += `\n⚠️ **Important Precautions:**\n`;
                d.precautions.slice(0, 3).forEach((p: string) => {
                    response += `• ${p}\n`;
                });
            }

            response += `\n📞 **To Order:**\n`;
            response += `Call: ${COMPANY_INFO.phone}\n`;
            response += `Visit: ${COMPANY_INFO.location}\n\n`;
            response += `Would you like to know:\n`;
            response += `• More detailed usage instructions?\n`;
            response += `• Side effects?\n`;
            response += `• How to order?\n`;
            response += `• Alternative options?`;

            addBotMessage(response, 'product_info', product);
        } else {
            // Basic product info without detailed database entry
            let response = `**${product.name}** is available!\n\n`;
            response += `📋 **Details:**\n`;
            if (product.code || product.id) {
                response += `• Code: ${product.code || product.id}\n`;
            }
            response += `• Manufacturer: ${product.company}\n`;
            response += `• Specification: ${product.pack_size || 'Standard Pack'}\n\n`;
            response += `📞 For detailed information and to order:\n`;
            response += `Call: ${COMPANY_INFO.phone}\n`;
            response += `Our pharmacist can provide complete usage guidance!\n\n`;
            response += `Would you like to know about similar products or place an order?`;

            addBotMessage(response, 'product_info', product);
        }
    };

    const handleMedicineSearch = (text: string) => {
        // Remove common phrases and punctuation
        const query = text
            .replace(/(do you have|looking for|need|want|search|find|available|is|the|in stock|stock)/gi, '')
            .replace(/[?!.,;]/g, '') // Remove punctuation
            .trim();
        const { exact, fuzzy } = fuzzySearch(query);

        if (exact.length > 0) {
            if (exact.length === 1) {
                const match = exact[0];
                setContext(prev => ({
                    ...prev,
                    lastMentionedProduct: match.name,
                    lastMentionedProductData: match,
                    awaitingSelection: false
                }));
                provideDetailedProductInfo(match);
            } else {
                // Multiple variants found
                setContext(prev => ({
                    ...prev,
                    awaitingSelection: true,
                    selectionType: 'variant',
                    selectionOptions: exact.slice(0, 5)
                }));

                let response = `Yes! We have **${query.toUpperCase()}** available in multiple formulations:\n\n`;
                exact.slice(0, 5).forEach((m, i) => {
                    response += `${i + 1}. **${m.name}** (${m.pack_size || 'Standard'}) - Code: ${m.id}\n   ${m.company}\n\n`;
                });
                response += `Which formulation are you looking for? Please type the number (1, 2, 3...) or say "the first one" 😊`;

                addBotMessage(response, 'variants', exact.slice(0, 5));
            }
        } else if (fuzzy.length > 0) {
            setContext(prev => ({
                ...prev,
                awaitingSelection: true,
                selectionType: 'variant',
                selectionOptions: fuzzy
            }));

            addBotMessage(
                `I couldn't find an exact match for "${query}". Did you mean:\n\n` +
                fuzzy.map((m, i) => `${i + 1}. **${m.name}** (${m.company})`).join('\n') +
                `\n\nPlease type the number or let me know if you need help! 😊`
            );
        } else {
            // Instead of showing "not found", use RAG to search
            addBotMessage(`🔍 Searching for "${query}" in our catalog...`);

            fetch('http://localhost:5000/api/rag/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: text,
                    context: context,
                    sessionId
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.response) {
                        // Handle order submission
                        if (data.type === 'order_ready' && data.orderData) {
                            handleOrderSubmission(data.orderData);
                        } else {
                            addBotMessage(data.response);
                        }
                        // Update context with backend state
                        if (data.updatedContext) {
                            setContext(prev => ({
                                ...prev,
                                ...data.updatedContext
                            }));
                        }
                    } else {
                        addBotMessage(
                            `I couldn't find "${query}" in our current inventory of ${COMPANY_INFO.totalProducts} products.\n\n` +
                            `This could mean:\n` +
                            `• Different spelling/brand name\n` +
                            `• Specialty medication we need to order\n\n` +
                            `Can you:\n` +
                            `• Check the spelling?\n` +
                            `• Provide the manufacturer name?\n` +
                            `• Tell me what it's used for?\n\n` +
                            `📞 Call us at ${COMPANY_INFO.phone} - Our pharmacist can check availability!\n\n` +
                            `Or tell me what condition you're treating, and I can suggest available alternatives!`
                        );
                    }
                })
                .catch(err => {
                    console.error('RAG search error:', err);
                    addBotMessage(
                        `I couldn't find "${query}" in our current inventory of ${COMPANY_INFO.totalProducts} products.\n\n` +
                        `📞 Call us at ${COMPANY_INFO.phone} - Our pharmacist can check availability!`
                    );
                });
        }
    };

    const handleConditionTreatment = (text: string) => {
        const lower = text.toLowerCase();
        let foundCondition: string | null = null;
        let mapping: ConditionMapping | null = null;

        for (const [condition, map] of Object.entries(CONDITION_MAPPINGS)) {
            if (map.keywords.some(keyword => lower.includes(keyword))) {
                foundCondition = condition;
                mapping = map;
                break;
            }
        }

        if (mapping && foundCondition) {
            setContext(prev => ({ ...prev, userCondition: foundCondition }));

            const products = medicinesData.filter(m =>
                mapping!.products.some(p => m.name.toUpperCase().includes(p.toUpperCase()))
            ).slice(0, 4);

            if (products.length > 0) {
                setContext(prev => ({
                    ...prev,
                    awaitingSelection: true,
                    selectionType: 'alternative',
                    selectionOptions: products
                }));

                addBotMessage(
                    `I understand you're dealing with **${foundCondition}**. I'm sorry to hear that! 😔\n\n` +
                    `⚠️ **Important:** While I can suggest products, I always recommend consulting with a healthcare professional for proper diagnosis.\n\n` +
                    `**For ${mapping.category}, we have:**\n\n` +
                    products.map((p, i) =>
                        `${i + 1}. **${p.name}**\n   ${p.company} • ${p.pack_size || 'Standard'}`
                    ).join('\n\n') +
                    `\n\n📞 **Call our pharmacist at ${COMPANY_INFO.phone}** for personalized advice!\n\n` +
                    `Would you like detailed information about any specific product? Just type the number!`
                );
            } else {
                addBotMessage(
                    `For ${foundCondition}, I recommend calling our pharmacist directly at ${COMPANY_INFO.phone} for the best treatment options!`
                );
            }
        } else {
            addBotMessage(
                `I'd like to help with your health concern! Could you please tell me more specifically what symptoms you're experiencing?\n\n` +
                `I can suggest products for:\n` +
                `• Pain/Fever\n• Cough/Cold\n• Skin problems\n• Digestive issues\n• Vitamins/Supplements\n• Baby care\n\n` +
                `What are you dealing with?`
            );
        }
    };

    const handleUsageInstructions = (text: string) => {
        const productName = context.lastMentionedProduct ||
            text.replace(/(how to use|how to take|dosage|usage|instructions)/gi, '').trim();

        if (!productName) {
            addBotMessage(
                `I'd be happy to provide usage instructions! Which medicine would you like to know about?\n\n` +
                `Please tell me the medicine name, and I'll provide detailed usage guidance! 😊`
            );
            return;
        }

        const details = getProductDetails(productName);

        if (details && details.details) {
            const d = details.details as any;

            let response = `📋 **USAGE INSTRUCTIONS FOR ${details.key}**\n\n`;

            if (d.usageInstructions) {
                if (d.usageInstructions.adults) {
                    response += `**Adults:**\n${d.usageInstructions.adults}\n\n`;
                }
                if (d.usageInstructions.children) {
                    response += `**Children:**\n${d.usageInstructions.children}\n\n`;
                }
                if (d.usageInstructions.timing) {
                    response += `⏰ **When to Take:**\n${d.usageInstructions.timing}\n\n`;
                }
                if (d.usageInstructions.duration) {
                    response += `📅 **Duration:**\n${d.usageInstructions.duration}\n\n`;
                }
                if (d.usageInstructions.method) {
                    response += `💡 **Method:**\n`;
                    d.usageInstructions.method.forEach((step: string, i: number) => {
                        response += `${i + 1}. ${step}\n`;
                    });
                    response += `\n`;
                }
                if (d.usageInstructions.preparation) {
                    response += `🍼 **Preparation:**\n`;
                    d.usageInstructions.preparation.forEach((step: string, i: number) => {
                        response += `${i + 1}. ${step}\n`;
                    });
                    response += `\n`;
                }
            }

            if (d.precautions && d.precautions.length > 0) {
                response += `⚠️ **Important Notes:**\n`;
                d.precautions.forEach((p: string) => {
                    response += `• ${p}\n`;
                });
                response += `\n`;
            }

            if (d.expectedResults) {
                response += `📊 **Expected Results:**\n`;
                Object.entries(d.expectedResults).forEach(([period, result]) => {
                    response += `• ${period}: ${result}\n`;
                });
                response += `\n`;
            }

            response += `📞 For personalized dosage based on your specific needs:\n`;
            response += `Call our pharmacist: ${COMPANY_INFO.phone}\n\n`;
            response += `Any other questions about this medicine?`;

            addBotMessage(response, 'usage');
            // Punctuate response
            const punctuatedResponse = response;

            // Check for smart recommendations
            const recommendationMatch = punctuatedResponse.match(/\[RECOMMEND: (.*?)\]/);
            let finalResponse = punctuatedResponse;
            let recommendedProducts: any[] = [];

            if (recommendationMatch) {
                // Remove the tag from the visible message
                finalResponse = finalResponse.replace(recommendationMatch[0], '').trim();

                // Parse product names
                const productNames = recommendationMatch[1].split(',').map(s => s.trim());

                // Find these products in our database
                recommendedProducts = productNames
                    .map(name => {
                        // fuzzy search for each recommended product
                        const { exact, fuzzy } = fuzzySearch(name);
                        return exact[0] || fuzzy[0];
                    })
                    .filter(p => p !== undefined);
            }

            addBotMessage(finalResponse, 'menu');

            // If we found valid recommendations, show them as cards
            if (recommendedProducts.length > 0) {
                setTimeout(() => {
                    addBotMessage("Here are the recommended products:", 'variants', recommendedProducts);
                }, 500);
            }
        } else {
            addBotMessage(
                `For detailed usage instructions on ${productName}:\n\n` +
                `📞 **Call our pharmacist:** ${COMPANY_INFO.phone}\n` +
                `⏰ **Available:** ${COMPANY_INFO.hours}\n\n` +
                `They will provide:\n` +
                `✓ Exact dosage for your age/condition\n` +
                `✓ When and how to take it\n` +
                `✓ Important precautions\n` +
                `✓ What to expect\n\n` +
                `This ensures you get personalized, safe guidance! 😊`
            );
        }
    };

    const handleComplaint = (text: string) => {
        addBotMessage(
            `I'm truly sorry to hear you're experiencing an issue. Your satisfaction and safety are extremely important to us, and I want to make sure we address this properly. 😟\n\n` +
            `🔍 **To help you immediately, please contact us directly:**\n\n` +
            `📞 **Phone:** ${COMPANY_INFO.phone}\n` +
            `📧 **Email:** ${COMPANY_INFO.email}\n` +
            `🏪 **Visit:** ${COMPANY_INFO.location}\n` +
            `⏰ **Available:** ${COMPANY_INFO.hours}\n\n` +
            `📋 **When You Contact Us, Please Provide:**\n` +
            `✓ Your name and contact number\n` +
            `✓ Date of purchase\n` +
            `✓ Medicine name\n` +
            `✓ Nature of the problem\n` +
            `✓ Receipt/bill (if available)\n\n` +
            `🎯 **What We'll Do:**\n` +
            `1️⃣ Listen to your concern carefully\n` +
            `2️⃣ Investigate the situation thoroughly\n` +
            `3️⃣ Provide immediate resolution (replacement/refund)\n` +
            `4️⃣ Take preventive measures\n\n` +
            `⚠️ **IF THIS IS A MEDICAL EMERGENCY:**\n` +
            `If you're experiencing severe side effects:\n` +
            `🚨 Seek immediate medical attention\n` +
            `📞 Call emergency services: 1122\n\n` +
            `We take all complaints seriously. Your feedback helps us improve! 🙏`,
            'complaint'
        );
    };

    const handleDrugInteraction = (text: string) => {
        addBotMessage(
            `That's a very important question about potential drug interactions! Thank you for being careful about your health. 🏥\n\n` +
            `⚠️ **IMPORTANT:**\n` +
            `Since you're taking multiple medications, checking for drug interactions requires professional pharmaceutical expertise.\n\n` +
            `👨‍⚕️ **I STRONGLY RECOMMEND:**\n\n` +
            `**Option 1 - SPEAK WITH OUR PHARMACIST (BEST):**\n` +
            `📞 Call: ${COMPANY_INFO.phone}\n` +
            `⏰ Available: ${COMPANY_INFO.hours}\n` +
            `💡 They will:\n` +
            `   • Review all your medications\n` +
            `   • Check for interactions\n` +
            `   • Provide safe guidance\n` +
            `   • Suggest timing if safe to take together\n\n` +
            `**Option 2 - CONSULT YOUR DOCTOR:**\n` +
            `🏥 Your prescribing physician knows your complete medical history\n\n` +
            `**Option 3 - VISIT OUR PHARMACY:**\n` +
            `🏪 ${COMPANY_INFO.location}\n` +
            `💡 In-person consultation with pharmacist\n\n` +
            `🚨 **SAFETY FIRST:**\n` +
            `• Don't start new medication without checking\n` +
            `• Drug interactions can be serious\n` +
            `• Professional advice is FREE!\n\n` +
            `📋 **What to Have Ready When You Call:**\n` +
            `✓ Names of all your current medications\n` +
            `✓ Dosages and schedules\n` +
            `✓ Any medical conditions\n` +
            `✓ Allergies (if any)\n\n` +
            `Your safety is our priority! Please don't hesitate to call. 📞`
        );
    };

    // Handle order submission to backend
    const handleOrderSubmission = async (orderData: any) => {
        try {
            addBotMessage('📦 Processing your order... Please wait.');

            const response = await fetch('http://localhost:5000/api/orders/create', {
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
        <div className="fixed bottom-8 right-8 z-50">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-blue-700 transition-colors group"
                    >
                        <MessageSquare size={30} className="group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
                    </motion.button>
                )}

                {isOpen && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="w-[420px] h-[650px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-between">
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
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                            {messages.map((m) => (
                                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] flex gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                                            {m.sender === 'bot' ? <Heart size={16} /> : <User size={16} />}
                                        </div>
                                        <div className={`p-4 rounded-2xl ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'}`}>
                                            <div className="text-sm leading-relaxed whitespace-pre-line">
                                                {(() => {
                                                    // Simple Markdown Parser for Bold and Links
                                                    const parts = m.text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
                                                    return parts.map((part, index) => {
                                                        // Handle Bold: **text**
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
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
                                                                        className={`underline font-medium ${m.sender === 'user' ? 'text-white' : 'text-blue-600 hover:text-blue-700'}`}
                                                                    >
                                                                        {match[1]}
                                                                    </a>
                                                                );
                                                            }
                                                        }
                                                        // Return normal text
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
                        <div className="p-6 bg-white border-t border-slate-100">
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
