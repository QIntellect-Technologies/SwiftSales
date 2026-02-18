const fs = require('fs-extra');
const path = require('path');

// --- Configuration ---
const TARGET_FILE = path.join(__dirname, '../data/faq_data.json');
const TARGET_COUNT = 10000; // Goal: 10,000+ unique questions

// --- Core Intents & Templates ---
// We define "Core Intents" (the actual meaning) and "Question Templates" (ways to ask).
// The generator will combine these to create massive variations.

const INTENTS = {
    "shipping_cost": {
        topic: "Shipping Cost",
        templates: [
            "How much is shipping?", "What is the delivery fee?", "Cost of delivery?", "Shipping charges?",
            "Do I have to pay for shipping?", "Is delivery free?", "Delivery price?", "Courier charges?",
            "How much for delivery to {CITY}?", "Shipping rate for {CITY}?", "Fee for shipping to {CITY}?",
            "What are the shipping fees?", "How much does it cost to ship?", "Is there a delivery charge?",
            "What is the postage cost?", "How much to ship to {CITY}?", "Courier fee to {CITY}?",
            "Shipping expenses?", "Freight cost?", "What is the postal charge?",
            "Is free shipping available?", "How do I get free delivery?", "Minimum for free shipping?",
            "Do you offer free shipping?", "Delivery is free?", "No shipping cost?",
            "Shipping to {CITY} cost?", "How much does shipping run?", "What is your shipping rate?",
            "Parcel delivery cost?", "Logistics fee?", "Transport charges for meds?"
        ],
        answer: "Shipping is flat Rs. 200 nationwide. Free for orders over Rs. 5000!"
    },
    "delivery_time": {
        topic: "Delivery Time",
        templates: [
            "When will I get my order?", "Delivery time?", "How long does shipping take?", "When does it arrive?",
            "Estimated delivery date?", "How fast is delivery?", "Shipping duration?", "Time for delivery?",
            "When will my package reach {CITY}?", "Delivery days for {CITY}?",
            "How many days for delivery?", "Expected arrival?", "Delivery estimate?",
            "When will it arrive?", "How soon can I get my order?", "What is the ETA?",
            "Is same day delivery available?", "Next day delivery?", "Express delivery?",
            "How long to {CITY}?", "Days to deliver?", "Standard delivery time?",
            "When does the order come?", "How many working days?", "Weekend delivery?",
            "Fastest delivery option?", "Delivery schedule?", "How quick is shipping?",
            "Overnight delivery available?", "Same day shipping?", "Rush delivery?"
        ],
        answer: "Standard delivery takes 2-3 working days. Lahore/Islamabad/Karachi often next day."
    },
    "return_policy": {
        topic: "Return Policy",
        templates: [
            "Can I return items?", "Return policy?", "How to return?", "Exchange policy?",
            "Do you accept returns?", "Is there a refund policy?", "Returning a product?", "Item exchange?",
            "What if I don't like it?", "Can I send it back?",
            "What is the return window?", "How many days to return?", "Return procedure?",
            "Can I exchange a product?", "Refund process?", "Money back guarantee?",
            "Damaged item return?", "Wrong item received?", "Product not as described?",
            "How to get a refund?", "Return shipping cost?", "Who pays for return?",
            "7 day return?", "Is there a return fee?", "Can I swap products?",
            "What if product is defective?", "Faulty product return?", "Return conditions?",
            "Policy for returns?", "Exchange conditions?"
        ],
        answer: "We have a 7-day return policy for damaged or incorrect items. Contact support for assistance."
    },
    "payment_methods": {
        topic: "Payment Methods",
        templates: [
            "How can I pay?", "Payment options?", "Do you accept credit cards?", "Cash on delivery?",
            "Is COD available?", "Bank transfer?", "JazzCash?", "EasyPaisa?",
            "What payment methods do you have?", "Can I pay via card?",
            "Online payment?", "Digital payment?", "Mobile wallet?", "Debit card accepted?",
            "Visa card?", "Mastercard?", "IBAN transfer?", "Bank account?",
            "Prepaid payment?", "Advance payment?", "Secure payment?",
            "How to pay online?", "Pay by bank?", "Meezan bank?", "HBL transfer?",
            "UBL payment?", "Which banks?", "Payment gateway?", "Checkout options?",
            "Ways to pay?", "Payment choices?"
        ],
        answer: "We accept Cash on Delivery (COD), Bank Transfer, JazzCash, and EasyPaisa."
    },
    "order_status": {
        topic: "Order Status",
        templates: [
            "Where is my order?", "Track order?", "Order status?", "Check my order?",
            "Has my order shipped?", "Tracking number?", "My package location?", "Trace order?",
            "Status of order {ID}?", "Where is package {ID}?",
            "Status of my order?", "Where is my package?",
            "How do I track?", "Tracking link?", "SMS tracking?", "Order dispatched?",
            "Is my order confirmed?", "Order confirmation?", "Order out for delivery?",
            "Order in transit?", "Package location?", "Delivery update?",
            "When was order shipped?", "Is order shipped?", "Track via SMS?",
            "Can I track online?", "Real time tracking?", "Live order tracking?",
            "Order delayed?", "Why is order late?", "Order not delivered?",
            "Lost package?", "Missing order?"
        ],
        answer: "You will receive a tracking link via SMS once your order ships. Reply with your Order ID to check status."
    },
    "location": {
        topic: "Location",
        templates: [
            "Where are you located?", "Shop address?", "Office location?", "Where is your store?",
            "Location map?", "Address please?", "Are you in Lahore?", "Are you in Karachi?",
            "Physical store?", "Head office?",
            "Where is your office?", "Company location?", "Registered address?",
            "Can I visit your shop?", "Walk in store?", "Is there a physical shop?",
            "Showroom location?", "Branch location?", "Rahim Yar Khan office?",
            "Do you have branches?", "Where can I find you?", "Office address?",
            "Can I pick up in person?", "Self pickup?", "Pick up from store?",
            "Warehouse location?", "Nearest branch?", "Shop map?",
            "How to find you?", "Directions to office?"
        ],
        answer: "Our head office is in Sardar Colony, Rahim Yar Khan. We serve nationwide online!"
    },
    "contact": {
        topic: "Contact",
        templates: [
            "Phone number?", "Contact details?", "How to call?", "Support number?",
            "WhatsApp number?", "Email address?", "Customer service?", "Helpline?",
            "Talk to support?", "Contact info?",
            "How to reach you?", "Support team?", "Get in touch?", "Chat support?",
            "Business number?", "WhatsApp chat?", "Direct contact?", "Official email?",
            "Corporate email?", "Customer care?",
            "Company phone?", "Swift Sales contact?", "How to message you?",
            "Online chat?", "Live support?", "24/7 support?",
            "After hours contact?", "Emergency contact?", "Main office number?",
            "Customer help?", "Query submission?"
        ],
        answer: "Call/WhatsApp us at +92 321 7780623 or email swiftsales.healthcare@gmail.com."
    },
    "authenticity": {
        topic: "Product Authenticity",
        templates: [
            "Are products original?", "Is this fake?", "Authentic medicines?", "Original brands?",
            "Do you sell copies?", "Is it genuine?", "Quality guarantee?", "Real products?",
            "Certified medicines?", "Official distributor?",
            "Are medicines genuine?", "Are you authorized?", "Licensed distributor?",
            "Products certified?", "DRAP approved?", "Government registered?",
            "Are medicines safe?", "Verified products?", "Trusted source?",
            "Batch verified?", "Expiry checked?", "Quality control?",
            "Import medicines?", "Local manufacturer?", "Brand authorized?",
            "Spurious medicines?", "Counterfeit drugs?", "Safe to consume?",
            "Regulated products?", "Pharma certified?"
        ],
        answer: "100% Authentic. We source directly from manufacturers and authorized distributors."
    },
    "discounts": {
        topic: "Discounts",
        templates: [
            "Any discounts?", "Promo codes?", "Coupon code?", "Sale?",
            "Can I get a discount?", "Price reduction?", "Wholesale rates?", "Bulk discount?",
            "Offers available?", "Deals?",
            "Any current offers?", "Discount codes?", "Voucher?", "Flash sale?",
            "Special offers?", "Price drop?", "Reduced price?", "Markdown?",
            "Clearance sale?", "Student discount?", "Loyalty rewards?",
            "Referral discount?", "First order discount?", "Eid sale?",
            "Seasonal offers?", "Ramadan discount?", "New year sale?",
            "Bundle offer?", "Combo deal?", "Savings?",
            "How to save?", "Price match?"
        ],
        answer: "We offer seasonal discounts! Subscribe to our newsletter or check the homepage for current codes."
    },
    "account": {
        topic: "Account Management",
        templates: [
            "How to register?", "Create account?", "Sign up?", "Login issues?",
            "Forgot password?", "Reset password?", "My profile?", "Change address?",
            "Delete account?", "Update details?",
            "New user registration?", "Account setup?", "Make an account?",
            "Can't log in?", "Password reset link?", "Username forgotten?",
            "Account locked?", "Recover account?", "Email not received?",
            "OTP not received?", "Verification code?", "Two factor auth?",
            "Edit profile?", "Change phone number?", "Update email?",
            "Order history?", "Previous orders?", "Wishlist?",
            "Saved addresses?", "Saved payment?", "Account security?"
        ],
        answer: "You can manage your account from the 'My Account' section in the top menu."
    },
    "greeting": {
        topic: "Greeting",
        templates: [
            "Hi", "Hello", "Hey there", "Good morning", "Good evening", "Salam", "Hola", "Greetings",
            "Anyone there?", "Is this a bot?",
            "Hello there", "Good afternoon", "Good day", "Hey!", "Hiya",
            "What's up?", "Howdy", "Hi there", "Hey bot", "Hello bot",
            "Start", "Begin", "Namaste", "Assalamualaikum", "Welcome",
            "Hi SwiftBot", "Hello SwiftBot", "Hey SwiftBot",
            "Ping", "Are you there?", "Is anyone online?"
        ],
        answer: "Hello! I'm SwiftBot, ready to help you with medicines, orders, or general questions. 😊"
    },
    "bot_identity": {
        topic: "Identity",
        templates: [
            "Who are you?", "What is your name?", "Are you human?", "Real person?", "What can you do?",
            "Tell me about yourself", "Your capabilities?", "What is your purpose?",
            "What is SwiftBot?", "Are you AI?", "Are you a robot?",
            "Are you automated?", "Is this customer service?", "Is this support?",
            "Who am I talking to?", "Introduce yourself", "About SwiftBot?",
            "What is this chatbot?", "How do you work?", "Are you ChatGPT?",
            "Powered by AI?", "Machine or human?", "What AI are you?",
            "Your name?", "Who made you?", "Created by?",
            "What are your features?", "What help do you offer?", "Your limitations?"
        ],
        answer: "Thank you for asking! I am **SwiftBot**, the official AI assistant for Swift Sales Healthcare. 😊 I'm here to guide you through our pharmaceutical catalog, help you find medicines, and allow you to place orders directly here. How can I assist you today?"
    },
    "partnership": {
        topic: "Partnership Inquiries",
        templates: [
            "I want to become a partner", "How to work with you?", "Investment opportunities?", "Business partnership?",
            "Become a distributor?", "Supply medicines to you?", "Partner with Swift Sales?",
            "Business collaboration?", "Joint venture?", "Wholesale partnership?",
            "Agency agreement?", "Reseller program?", "Franchise?",
            "Resell products?", "Become a dealer?", "Authorized reseller?",
            "Commission partnership?", "Revenue sharing?", "Affiliate program?",
            "B2B partnership?", "Corporate tie-up?", "Business tie-up?",
            "Supply agreement?", "Medical supply partnership?", "Pharmaceutical partnership?",
            "Want to invest?", "Interested in collaboration?", "Can we work together?"
        ],
        answer: "We're always looking for valuable partnerships! Please contact our CEO directly via email at **swiftsales.healthcare@gmail.com** or visit our head office in Sardar Colony, Rahim Yar Khan. You can also send a query through our contact page, and our team will get in touch with you. Thank you for your interest!"
    },
    "how_to_search": {
        topic: "How to Search",
        templates: [
            "How do I find medicines?", "Search help?", "How to use this site?", "Finding products?",
            "Can I search by brand?", "Search guide",
            "How to find a product?", "Find medicine?", "Browse products?",
            "Search by name?", "Search by category?", "Filter medicines?",
            "How to browse?", "Product catalog?", "Full list of products?",
            "Find generic medicine?", "Find specific drug?", "Medicine search?",
            "Is there a search bar?", "How to look up medicine?", "How to explore products?",
            "Can I filter by brand?", "Sort by price?", "Alphabetical search?",
            "Search by ingredient?", "Find alternatives?", "Similar medicines?"
        ],
        answer: "Simply type the name of the medicine in the search bar or ask me directly!"
    },
    "troubleshoot_login": {
        topic: "Login Help",
        templates: [
            "I can't login", "Login error", "Account access failed", "Cannot sign in",
            "Password not working", "User not found",
            "Login problem?", "Sign in issue?", "Can't access account?",
            "Wrong password?", "Account suspended?", "Blocked account?",
            "Invalid credentials?", "Session expired?", "Keep logging out?",
            "Remember me not working?", "Auto logout?", "Stay signed in?",
            "Browser issue login?", "Clear cache login?", "Mobile login issue?",
            "App login problem?", "Verification failed?", "OTP issue login?",
            "Email login not working?", "Phone login issue?", "Social login?"
        ],
        answer: "Please ensure your caps lock is off. If issues persist, use the 'Forgot Password' link."
    },
    "cod_availability": {
        topic: "Cash on Delivery",
        templates: [
            "Is COD available?", "Cash on delivery?", "Pay cash?", "Pay on arrival?",
            "Do you take cash?",
            "Cash payment?", "Pay when delivered?", "Pay after receiving?",
            "Can I pay in person?", "No advance payment?", "COD order?",
            "Cash accepted?", "Is advance required?", "Pay in cash?",
            "No online payment?", "Door step payment?", "Pay rider?",
            "Physical cash?", "COD limit?", "Maximum COD amount?",
            "COD available in {CITY}?", "Cash delivery in {CITY}?",
            "No card needed?", "Cash only option?", "Prefer cash payment?"
        ],
        answer: "Yes! Cash on Delivery (COD) is available for all orders nationwide."
    },
    "talk_to_support": {
        topic: "Support Handoff",
        templates: [
            "I want to talk to a person", "Connect me to agent", "Customer support please",
            "Call support", "Human help",
            "Real person please", "Talk to human?", "Speak to someone?",
            "Get a representative?", "Escalate issue?", "Supervisor?",
            "Manager please?", "Live chat?", "Live agent?",
            "Is there a human?", "Stop talking to bot", "Exit bot?",
            "Emergency help?", "Urgent assistance?", "Personal support?",
            "Dedicated support?", "Private query?", "Sensitive issue?",
            "Complaint to manager?", "Raise a complaint?", "File a complaint?"
        ],
        answer: "You can call or WhatsApp our support team at +92 321 7780623."
    },
    "cancel_order": {
        topic: "Cancel Order",
        templates: [
            "Cancel my order", "How to cancel?", "Stop delivery", "I changed my mind",
            "Cancel purchase",
            "Order cancellation?", "Cancel placed order?", "Undo order?",
            "Reverse my order?", "Order mistake?", "Wrong order?",
            "Don't want anymore?", "Please cancel?", "Stop shipment?",
            "Halt delivery?", "Remove order?", "Delete order?",
            "Cancel before shipping?", "Cancel after shipping?", "Refund after cancel?",
            "How long to cancel?", "Cancellation window?", "Cancel policy?",
            "Can I cancel anytime?", "Cancellation fee?", "Free cancellation?"
        ],
        answer: "To cancel an order, please call us immediately at +92 321 7780623 with your Order ID."
    },
    "bulk_orders": {
        topic: "Bulk Orders",
        templates: [
            "Do you sell wholesale?", "Bulk buying?", "Large quantity order?", "Wholesale price?",
            "Distributor rates?",
            "Corporate buying?", "Hospital supply?", "Pharmacy supply?",
            "Bulk medicine?", "Quantity discount?", "Volume pricing?",
            "Bulk purchase?", "Institutional order?", "Clinic order?",
            "Reseller buying?", "Trade pricing?", "Dealer price?",
            "Large order discount?", "Minimum order quantity?", "MOQ?",
            "Pharmacy distributor?", "Hospital distributor?", "Medical store supply?",
            "Procurement?", "Healthcare procurement?", "B2B order?"
        ],
        answer: "Yes, we are a wholesale distributor! Contact us directly for bulk rates."
    },
    "quality_assurance": {
        topic: "Quality",
        templates: [
            "Are these safe?", "Temperature controlled?", "Cold chain?", "Storage quality?",
            "Expired medicines?",
            "Medicine safety?", "Proper storage?", "How stored?",
            "Refrigerated medicines?", "Vaccine storage?", "Insulin storage?",
            "Expiry date checked?", "Non expired?", "Fresh medicines?",
            "Quality check?", "DRAP compliance?", "Regulatory compliance?",
            "WHO standard?", "GMP certified?", "Quality assured?",
            "Safe packaging?", "Damage free?", "Sealed products?",
            "Tamper proof?", "Heat stable?", "Proper handling?"
        ],
        answer: "We strictly follow cold-chain protocols and only supply 100% authentic, non-expired products."
    },
    "swiftbot_innovation": {
        topic: "Innovation",
        templates: [
            "What is your innovation?", "New technology?", "How do you use AI?", "What makes you different?",
            "Do you have a mobile app?", "How to order via chat?", "SwiftBot capabilities?",
            "Why choose you?", "Unique features?", "Special features?",
            "Tech stack?", "AI features?", "Chatbot?",
            "WhatsApp ordering?", "Order on WhatsApp?", "Chat to order?",
            "How is this different?", "Competitor comparison?", "Better than others?",
            "Future features?", "Upcoming features?", "What's new?",
            "App download?", "Mobile site?", "Responsive site?",
            "AI powered?", "Smart search?", "Recommendation engine?"
        ],
        answer: "Our core innovation is **SwiftBot**! We don't have a separate mobile app; instead, we've built an AI assistant that allows you to search products and place orders directly through this chat interface or WhatsApp."
    },
    "feedback": {
        topic: "Feedback",
        templates: [
            "I have a suggestion", "Feedback", "Complaint about design", "Site review",
            "Rate service",
            "Give feedback?", "Leave review?", "Post review?",
            "How to complain?", "Raise concern?", "Bad experience?",
            "Service complaint?", "Product complaint?", "Delivery complaint?",
            "Positive feedback?", "Negative review?", "Star rating?",
            "Review platform?", "Google review?", "Facebook review?",
            "Testimonial?", "Customer review?", "User feedback?",
            "Improvement suggestion?", "Website feedback?", "App feedback?",
            "Quality of service feedback?", "Overall experience?", "Satisfaction survey?"
        ],
        answer: "We love hearing from you! Please send your feedback to swiftsales.healthcare@gmail.com."
    },
    "jobs": {
        topic: "Careers",
        templates: [
            "Are you hiring?", "Job openings?", "Careers?", "Work with you?",
            "Vacancy?",
            "Jobs at Swift Sales?", "Recruitment?", "Apply for job?",
            "Job application?", "Open positions?", "Staff needed?",
            "Internship?", "Fresher jobs?", "Entry level?",
            "Sales job?", "Marketing job?", "Pharmaceutical career?",
            "Warehouse job?", "Delivery job?", "Rider vacancy?",
            "IT job?", "Remote work?", "Work from home?",
            "Part time job?", "Full time job?", "Freelance?"
        ],
        answer: "We are always looking for talent! Send your CV to our email address."
    }
};

const CITIES = [
    "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta",
    "Sialkot", "Gujranwala", "Hyderabad", "Rahim Yar Khan", "Bahawalpur", "Sargodha", "Sukkur",
    "Larkana", "Sheikhupura", "Jhang", "Mardan", "Dera Ghazi Khan", "Gujrat", "Kasur",
    "Sahiwal", "Muzaffarabad", "Nawabshah"
];

const FILLERS = [
    "Please tell me,", "I want to know,", "Can you say,", "Do you know,", "Quick question,",
    "Hey,", "Hello,", "Hi,", "Excuse me,", "I was wondering,", "I need to know,", "Can you help me,",
    "Please clarify,", "Just wondering,", "By the way,", "Actually,", "One more thing,",
    "Sorry to bother,", "If you don't mind,", "Tell me,"
];

const SUFFIXES = [
    "Please let me know.", "Thanks.", "Thank you!", "ASAP please!", "Urgent!",
    "I'd appreciate the info.", "Looking forward to your reply.", "Much appreciated.",
    "Please advise.", "Your help is needed."
];

const FORMAL_PREFIXES = [
    "Dear SwiftBot,", "Hi team,", "To the support team,", "Hello Swift Sales,",
    "I have a query:", "I need assistance with:", "Can you assist me with:",
    "Good day,", "To whom it may concern,", "Support,"
];

const TYPO_MAP = {
    "shipping": "shiping",
    "delivery": "deliery",
    "price": "pice",
    "return": "retrn",
    "phone": "fone",
    "address": "adress",
    "payment": "payemnt",
    "medicine": "medicin",
    "account": "acount",
    "cancel": "cancl",
    "order": "oder",
    "available": "availble",
    "discount": "discont",
    "wholesale": "wholsale",
    "authentic": "authenric",
    "quality": "qulaity"
};

const REWRITES = [
    (q) => q.replace("How much", "What is the price of"),
    (q) => q.replace("Can I", "Is it possible to"),
    (q) => q.replace("Do you", "Does your company"),
    (q) => q.replace("Is there", "Do you have"),
    (q) => q.replace("Where is", "What is the location of"),
    (q) => q.replace("How to", "What is the process to"),
    (q) => q.replace("What is", "Tell me about"),
    (q) => (q.endsWith("?") ? q.replace("?", " please?") : q + " please?"),
];

// --- Generation Logic ---

function generateFAQs() {
    console.log(`🚀 Starting massive FAQ generation... Target: ${TARGET_COUNT}+`);

    let allFAQs = [];
    const seen = new Set();

    function addFAQ(question, answer, category, tags) {
        const key = question.trim().toLowerCase();
        if (!seen.has(key) && key.length > 2) {
            seen.add(key);
            allFAQs.push({ question: question.trim(), answer, category, tags });
        }
    }

    // === PHASE 1: Base templates & City variations ===
    Object.keys(INTENTS).forEach(key => {
        const intent = INTENTS[key];
        intent.templates.forEach(template => {
            if (template.includes("{CITY}")) {
                CITIES.forEach(city => {
                    addFAQ(template.replace("{CITY}", city), intent.answer, intent.topic, [key, "city_specific"]);
                });
            } else if (template.includes("{ID}")) {
                const sampleIds = ["#12345", "SW-987", "ID:4455", "ORD-112"];
                sampleIds.forEach(id => {
                    addFAQ(template.replace("{ID}", id), intent.answer, intent.topic, [key, "id_specific"]);
                });
            } else {
                addFAQ(template, intent.answer, intent.topic, [key]);
                // Auto-append city for delivery-related items
                if (["shipping_cost", "delivery_time", "cod_availability"].includes(key)) {
                    const sampleCities = CITIES.slice(0, 5);
                    sampleCities.forEach(city => {
                        addFAQ(`${template} to ${city}?`, intent.answer, intent.topic, [key, "city_appended"]);
                    });
                }
            }
        });
    });

    console.log(`Phase 1 done: ${allFAQs.length} FAQs`);

    const phase1List = [...allFAQs];

    // === PHASE 2: Filler prefixes ===
    phase1List.forEach(item => {
        FILLERS.forEach(filler => {
            if (filler.trim() !== "") {
                const q = `${filler} ${item.question.charAt(0).toLowerCase() + item.question.slice(1)}`;
                addFAQ(q, item.answer, item.category, [...item.tags, "conversational"]);
            }
        });
    });

    console.log(`Phase 2 done: ${allFAQs.length} FAQs`);

    // === PHASE 3: Question suffixes ===
    phase1List.forEach((item, idx) => {
        if (idx % 2 === 0) { // Every 2nd item
            SUFFIXES.forEach(suffix => {
                const q = `${item.question} ${suffix}`;
                addFAQ(q, item.answer, item.category, [...item.tags, "with_suffix"]);
            });
        }
    });

    console.log(`Phase 3 done: ${allFAQs.length} FAQs`);

    // === PHASE 4: Formal prefixes ===
    phase1List.forEach((item, idx) => {
        if (idx % 3 === 0) { // Every 3rd item
            FORMAL_PREFIXES.forEach(prefix => {
                const q = `${prefix} ${item.question.charAt(0).toLowerCase() + item.question.slice(1)}`;
                addFAQ(q, item.answer, item.category, [...item.tags, "formal"]);
            });
        }
    });

    console.log(`Phase 4 done: ${allFAQs.length} FAQs`);

    // === PHASE 5: Phrasing rewrites ===
    phase1List.forEach((item, idx) => {
        if (idx % 2 === 0) { // Every 2nd item
            REWRITES.forEach(rewriteFn => {
                const newQ = rewriteFn(item.question);
                if (newQ !== item.question) {
                    addFAQ(newQ, item.answer, item.category, [...item.tags, "rewritten"]);
                }
            });
        }
    });

    console.log(`Phase 5 done: ${allFAQs.length} FAQs`);

    // === PHASE 6: Typo simulation ===
    phase1List.forEach((item, idx) => {
        if (idx % 3 === 0) {
            let q = item.question;
            let changed = false;
            Object.keys(TYPO_MAP).forEach(word => {
                if (q.toLowerCase().includes(word)) {
                    q = q.replace(new RegExp(word, 'i'), TYPO_MAP[word]);
                    changed = true;
                }
            });
            if (changed) {
                addFAQ(q, item.answer, item.category, [...item.tags, "typo_variant"]);
            }
        }
    });

    console.log(`Phase 6 done: ${allFAQs.length} FAQs`);

    // === PHASE 7: Case variations ===
    phase1List.forEach((item, idx) => {
        if (idx % 10 === 0) {
            addFAQ(item.question.toUpperCase(), item.answer, item.category, [...item.tags, "uppercase"]);
            addFAQ(item.question.toLowerCase(), item.answer, item.category, [...item.tags, "lowercase"]);
        }
    });

    console.log(`Phase 7 done: ${allFAQs.length} FAQs`);

    // === PHASE 8: Combined prefix + suffix ===
    phase1List.forEach((item, idx) => {
        if (idx % 15 === 0) {
            const samplePrefix = FILLERS[Math.floor(Math.random() * FILLERS.length)];
            const sampleSuffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
            if (samplePrefix && sampleSuffix) {
                const q = `${samplePrefix} ${item.question.charAt(0).toLowerCase() + item.question.slice(1)} ${sampleSuffix}`;
                addFAQ(q, item.answer, item.category, [...item.tags, "combined"]);
            }
        }
    });

    console.log(`Phase 8 done: ${allFAQs.length} FAQs`);

    // Shuffle and save
    allFAQs.sort(() => Math.random() - 0.5);

    fs.ensureDirSync(path.dirname(TARGET_FILE));
    fs.writeJsonSync(TARGET_FILE, allFAQs, { spaces: 2 });

    console.log(`\n✅ SUCCESS: Generated ${allFAQs.length} unique FAQ pairs!`);
    console.log(`📁 Saved to: ${TARGET_FILE}`);
}

generateFAQs();
