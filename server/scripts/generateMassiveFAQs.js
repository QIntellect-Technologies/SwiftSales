/**
 * Massive FAQ Generator
 * 
 * Generates thousands of high-quality FAQs across all categories
 * to build a comprehensive NLP knowledge base.
 * 
 * Usage: node server/scripts/generateMassiveFAQs.js
 */

const fs = require('fs-extra');
const path = require('path');

console.log('🚀 Starting Massive FAQ Generation...\n');

// Load existing medicines data for product-specific FAQs
const medicinesPath = path.join(__dirname, '../data/medicines.json');
const medicines = JSON.parse(fs.readFileSync(medicinesPath, 'utf-8'));

console.log(`📦 Loaded ${medicines.length} products for FAQ generation\n`);

// FAQ Template Generators
const faqGenerators = {

    // Medical Condition FAQs (Symptoms, Treatments, Medicines)
    medicalConditions: () => {
        const conditions = [
            // Common Conditions
            { name: 'headache', symptoms: ['head pain', 'migraine', 'tension'], medicines: ['PANADOL', 'BRUFEN', 'DISPRIN'] },
            { name: 'fever', symptoms: ['high temperature', 'body heat', 'temperature'], medicines: ['PANADOL', 'CALPOL', 'DISPRIN'] },
            { name: 'cold', symptoms: ['runny nose', 'sneezing', 'congestion'], medicines: ['ACTIFED', 'SINEX', 'CLARINASE'] },
            { name: 'cough', symptoms: ['dry cough', 'wet cough', 'throat irritation'], medicines: ['COFEX', 'TIXYLIX', 'BENADRYL'] },
            { name: 'sore throat', symptoms: ['throat pain', 'difficulty swallowing', 'scratchy throat'], medicines: ['BETADINE GARGLE', 'STREPSILS', 'DIFFLAM'] },
            { name: 'allergies', symptoms: ['sneezing', 'itching', 'rash', 'hives'], medicines: ['AVIL', 'ZYRTEC', 'ALLEGRA'] },
            { name: 'pain', symptoms: ['body pain', 'muscle ache', 'joint pain'], medicines: ['BRUFEN', 'PONSTAN', 'CATAFLAM'] },
            { name: 'back pain', symptoms: ['lower back pain', 'spine pain', 'backache'], medicines: ['VOLTRAL', 'MYOFLEX', 'CATAFLAM'] },
            { name: 'stomach pain', symptoms: ['abdominal pain', 'belly ache', 'cramps'], medicines: ['BUSCOPAN', 'COLIMEX', 'MYTAB'] },
            { name: 'acidity', symptoms: ['heartburn', 'acid reflux', 'sour taste'], medicines: ['RISEK', 'NEXIUM', 'MYLANTA'] },
            { name: 'constipation', symptoms: ['difficulty passing stool', 'hard stool', 'bloating'], medicines: ['DULCOLAX', 'LACTULOSE', 'ISABGOL'] },
            { name: 'diarrhea', symptoms: ['loose stool', 'frequent bowel movements', 'watery stool'], medicines: ['IMODIUM', 'FLAGYL', 'FUROXONE'] },
            { name: 'diabetes', symptoms: ['high blood sugar', 'increased thirst', 'frequent urination'], medicines: ['GLUCOPHAGE', 'DIAMICRON', 'JANUVIA'] },
            { name: 'high blood pressure', symptoms: ['hypertension', 'elevated BP', 'high BP'], medicines: ['CONCOR', 'NORVASC', 'DILATREND'] },
            { name: 'insomnia', symptoms: ['sleeplessness', 'difficulty sleeping', 'sleep problems'], medicines: ['STILNOX', 'ATIVAN', 'MELATONIN'] },
            { name: 'anxiety', symptoms: ['nervousness', 'worry', 'panic', 'stress'], medicines: ['XANAX', 'LEXAPRO', 'PROZAC'] },
            { name: 'depression', symptoms: ['sadness', 'low mood', 'hopelessness'], medicines: ['PROZAC', 'ZOLOFT', 'CYMBALTA'] },
            { name: 'asthma', symptoms: ['wheezing', 'shortness of breath', 'chest tightness'], medicines: ['VENTOLIN', 'SERETIDE', 'PULMICORT'] },
            { name: 'skin infection', symptoms: ['rash', 'redness', 'itching', 'pus'], medicines: ['FUCIDIN', 'BETNOVATE', 'CANDID'] },
            { name: 'fungal infection', symptoms: ['itching', 'burning', 'white discharge'], medicines: ['CANESTEN', 'NIZORAL', 'LAMISIL'] },
            { name: 'bacterial infection', symptoms: ['fever', 'pus', 'inflammation'], medicines: ['AUGMENTIN', 'CIPROXIN', 'ZITHROMAX'] },
            { name: 'viral infection', symptoms: ['fever', 'fatigue', 'body aches'], medicines: ['PANADOL', 'BRUFEN', 'REST'] },
            { name: 'urinary tract infection', symptoms: ['burning urination', 'frequent urination', 'pelvic pain'], medicines: ['CIPROXIN', 'NORFLOX', 'URISPAS'] },
            { name: 'arthritis', symptoms: ['joint pain', 'stiffness', 'swelling'], medicines: ['CELEBREX', 'BRUFEN', 'VOLTRAL'] },
            { name: 'cholesterol', symptoms: ['high cholesterol', 'high LDL'], medicines: ['ATORVA', 'CRESTOR', 'LIPITOR'] }
        ];

        const faqs = [];
        let id = 1000;

        conditions.forEach(condition => {
            // What medicine for condition?
            faqs.push({
                id: `med_${id++}`,
                question: `What medicine should I take for ${condition.name}?`,
                variations: [
                    `medicine for ${condition.name}`,
                    `treatment for ${condition.name}`,
                    `I have ${condition.name}, what should I take?`,
                    `best medicine for ${condition.name}`,
                    `what to take for ${condition.symptoms[0]}`
                ],
                answer: `For ${condition.name}, we recommend: **${condition.medicines.join(', ')}**. These are effective treatments available at Swift Sales Healthcare. Please consult with our pharmacist for proper dosage. For severe symptoms, consult a doctor.`,
                category: 'Medical Conditions',
                products: condition.medicines,
                tags: [condition.name, ...condition.symptoms, 'treatment', 'medicine'],
                severity: 'general'
            });

            // Symptoms query
            condition.symptoms.forEach(symptom => {
                faqs.push({
                    id: `sym_${id++}`,
                    question: `I have ${symptom}, what should I do?`,
                    variations: [
                        `${symptom} treatment`,
                        `medicine for ${symptom}`,
                        `I'm experiencing ${symptom}`,
                        `how to cure ${symptom}`
                    ],
                    answer: `${symptom.charAt(0).toUpperCase() + symptom.slice(1)} is commonly associated with ${condition.name}. We recommend: **${condition.medicines[0]}** as a first-line treatment. If symptoms persist or worsen, please consult a healthcare provider. Available at Swift Sales Healthcare.`,
                    category: 'Symptoms',
                    products: [condition.medicines[0]],
                    tags: [symptom, condition.name, 'symptoms', 'treatment'],
                    severity: 'general'
                });
            });
        });

        return faqs;
    },

    // Product-Specific FAQs (Usage, Dosage, Side Effects)
    productSpecific: () => {
        const faqs = [];
        let id = 5000;

        // Select top 100 most common products
        const commonProducts = medicines.slice(0, 100);

        commonProducts.forEach(product => {
            const productName = product.name;
            const company = product.company;

            // What is this product?
            faqs.push({
                id: `prod_${id++}`,
                question: `What is ${productName}?`,
                variations: [
                    `tell me about ${productName}`,
                    `${productName} information`,
                    `what is ${productName} used for`,
                    `${productName} details`
                ],
                answer: `**${productName}** is a pharmaceutical product manufactured by ${company}. It is available at Swift Sales Healthcare. For specific usage, dosage, and precautions, please consult our pharmacist or your healthcare provider.`,
                category: 'Product Information',
                products: [productName],
                tags: [productName, company, 'product', 'information'],
                requires_prescription: false
            });

            // Is product in stock?
            faqs.push({
                id: `stock_${id++}`,
                question: `Is ${productName} available?`,
                variations: [
                    `do you have ${productName}`,
                    `${productName} in stock`,
                    `${productName} availability`,
                    `can I get ${productName}`
                ],
                answer: `Please ask our chatbot to check real-time stock for ${productName}. You can also call us at ${'+92 321 7780623'} for immediate availability confirmation. We strive to keep all products in stock!`,
                category: 'Stock & Availability',
                products: [productName],
                tags: [productName, 'stock', 'availability', 'in stock'],
                requires_prescription: false
            });

            // Dosage question
            faqs.push({
                id: `dose_${id++}`,
                question: `What is the dosage for ${productName}?`,
                variations: [
                    `${productName} dosage`,
                    `how to take ${productName}`,
                    `${productName} usage instructions`,
                    `how many ${productName} should I take`
                ],
                answer: `The dosage for **${productName}** depends on age, weight, and medical condition. Please consult the package insert or speak with our pharmacist for personalized dosage recommendations. Never exceed the recommended dose.`,
                category: 'Dosage & Usage',
                products: [productName],
                tags: [productName, 'dosage', 'usage', 'how to take'],
                requires_prescription: false
            });
        });

        return faqs;
    },

    // Ordering & Delivery FAQs
    orderingDelivery: () => {
        const faqs = [];
        let id = 10000;

        const queries = [
            {
                ans: 'You can place an order through:\n1. **SwiftBot** - Direct ordering via this chat interface!\n2. **WhatsApp**: +92 321 7780623\n3. **Email**: swiftsales.healthcare@gmail.com\n\nOur AI-powered system makes ordering meds as simple as sending a message!'
            },
            {
                q: 'Do you deliver to my area?',
                vars: ['delivery areas', 'do you deliver', 'shipping locations', 'delivery coverage'],
                ans: 'Yes! We deliver across **all major cities in Pakistan** including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and more. Delivery time varies by location (1-3 days typically).'
            },
            {
                q: 'What are the delivery charges?',
                vars: ['delivery fee', 'shipping cost', 'delivery price', 'how much is delivery'],
                ans: 'Delivery charges vary by location:\n• **Local (Rahim Yar Khan)**: FREE for orders above Rs. 2000\n• **Major Cities**: Rs. 150-250\n• **Remote Areas**: Rs. 300-500\n\nExact charges confirmed at checkout!'
            },
            {
                q: 'How long does delivery take?',
                vars: ['delivery time', 'shipping duration', 'how fast', 'when will I receive'],
                ans: 'Delivery timeframes:\n• **Same City**: 1-2 days\n• **Major Cities**: 2-3 days\n• **Remote Areas**: 3-5 days\n\nWe provide tracking for all orders!'
            },
            {
                q: 'What payment methods do you accept?',
                vars: ['payment options', 'how to pay', 'payment methods', 'can I pay cash'],
                ans: 'We accept:\n• **Cash on Delivery (COD)**\n• **Bank Transfer**\n• **Easypaisa/JazzCash**\n• **Credit/Debit Card**\n\nMost customers prefer COD for convenience!'
            },
            {
                q: 'Can I return a product?',
                vars: ['return policy', 'product return', 'can I return', 'refund policy'],
                ans: 'Yes, we accept returns within **7 days** if:\n• Product is unopened and unused\n• Original packaging intact\n• Valid reason provided\n\n**Prescription medicines** cannot be returned once opened. Contact us for assistance!'
            },
            {
                q: 'How do I track my order?',
                vars: ['order tracking', 'track order', 'where is my order', 'order status'],
                ans: 'We provide tracking via:\n• **WhatsApp updates**: +92 321 7780623\n• **Email confirmations**\n• **Phone support**\n\nYou\'ll receive updates at each stage of delivery!'
            }
        ];

        queries.forEach(item => {
            faqs.push({
                id: `order_${id++}`,
                question: item.q,
                variations: item.vars,
                answer: item.ans,
                category: 'Ordering & Delivery',
                products: [],
                tags: ['ordering', 'delivery', 'shipping', 'payment', 'logistics']
            });
        });

        return faqs;
    },

    // Conversational & General FAQs
    conversational: () => {
        const faqs = [];
        let id = 20000;

        const conversations = [
            {
                q: 'Hi',
                vars: ['hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'salam'],
                ans: 'Hello! 👋 Welcome to Swift Sales Healthcare! I\'m here to help you find medicines, place orders, or answer any health-related questions. What can I do for you today?'
            },
            {
                q: 'Thank you',
                vars: ['thanks', 'thank you so much', 'appreciate it', 'grateful', 'blessed'],
                ans: 'You\'re very welcome! 😊 If you need anything else, I\'m always here to help. Stay healthy!'
            },
            {
                q: 'Goodbye',
                vars: ['bye', 'see you', 'later', 'take care', 'Allah Hafiz'],
                ans: 'Goodbye! Take care and stay healthy! 🌟 Feel free to reach out anytime you need assistance. Allah Hafiz!'
            },
            {
                q: 'I need help',
                vars: ['help me', 'I need assistance', 'can you help', 'I\'m confused'],
                ans: 'Of course! I\'m here to help. You can:\n• Ask about medicines\n• Place an order\n• Check stock availability\n• Get health advice\n• Contact our team\n\nWhat would you like to know?'
            },
            {
                q: 'Who are you?',
                vars: ['what are you', 'who is this', 'are you a bot', 'your name', 'tell me about yourself'],
                ans: 'Thank you for asking! I\'m **SwiftBot**, your intelligent pharmaceutical assistant powered by Swift Sales Healthcare! 😊 I\'m here to guide you, help you find medicines, and make ordering easy and direct. How can I assist you today?'
            },
            {
                q: 'Are you open now?',
                vars: ['operating hours', 'business hours', 'when are you open', 'what time do you close'],
                ans: '**Swift Sales Healthcare Operating Hours:**\n\n• Monday - Saturday: 9:00 AM - 6:00 PM\n• Sunday: Closed (Emergency support via phone)\n\n📞 24/7 Emergency: +92 321 7780623'
            },
            {
                q: 'I have an emergency',
                vars: ['urgent', 'emergency', 'critical situation', 'serious problem'],
                ans: '🚨 **For medical emergencies:**\n\n1. Call emergency services: 1122\n2. Contact us: +92 321 7780623\n3. Visit nearest hospital\n\nWe\'re here to support you, but please seek immediate medical attention for emergencies!'
            },
            {
                q: 'Where are you located?',
                vars: ['location', 'address', 'where is your shop', 'office location'],
                ans: '📍 **Swift Sales Healthcare**\n\nAddress: C8GM+HFF, Sardar Colony, Rahim Yar Khan, Pakistan\n\nYou can visit us during business hours or contact us:\n• Phone: +92 321 7780623\n• Email: swiftsales.healthcare@gmail.com'
            }
        ];

        conversations.forEach(item => {
            faqs.push({
                id: `conv_${id++}`,
                question: item.q,
                variations: item.vars,
                answer: item.ans,
                category: 'Conversational',
                products: [],
                tags: ['conversation', 'greeting', 'general', 'help']
            });
        });

        return faqs;
    },

    // Company & Trust FAQs
    companyInfo: () => {
        const faqs = [];
        let id = 30000;

        const companyQueries = [
            {
                q: 'Who is the CEO?',
                vars: ['owner', 'founder', 'who runs this', 'CEO name', 'Ejaz Malik'],
                ans: 'The CEO and founder of Swift Sales Healthcare is **Ejaz Malik**. Under his leadership since 2012, we have grown from a small team of 5 to a major healthcare group.'
            },
            {
                q: 'What is your innovation?',
                vars: ['new technology', 'how do you use AI', 'what makes you different', 'do you have a mobile app'],
                ans: 'Our core innovation is **SwiftBot**! We don\'t have a separate mobile app; instead, we\'ve built an AI assistant that allows you to search products and place orders directly through this chat interface or WhatsApp.'
            },
            {
                q: 'How long have you been in business?',
                vars: ['years in business', 'established when', 'how old is company', 'since when'],
                ans: 'Swift Sales Healthcare has been serving Pakistan since **2012**. Our journey began as a wholesale distributor with an initial team of 5 and has evolved into a group of companies.'
            },
            {
                q: 'Are you licensed?',
                vars: ['drug license', 'registration', 'are you legal', 'authorized dealer'],
                ans: 'Yes, we are fully licensed and registered:\n• **Drug License**: Valid and current\n• **NTN**: Registered with FBR\n• **Authorized Distributor**: For 34+ manufacturers\n\nYour health and safety are our top priorities!'
            },
            {
                q: 'How many products do you have?',
                vars: ['catalog size', 'total products', 'how many medicines', 'product range'],
                ans: 'We manage over **2,136 registered pharmaceutical products** from **34 top-tier manufacturers**! Our extensive catalog covers everything from common medicines to specialized treatments.'
            },
            {
                q: 'How to become a partner?',
                vars: ['partnership', 'become partner', 'work with you', 'business inquiry'],
                ans: 'We welcome new partnerships! Please contact our CEO at **swiftsales.healthcare@gmail.com**, visit our head office in Rahim Yar Khan, or send a query through our contact page. Our team will contact you soon. Thank you!'
            },
            {
                q: 'Is this a registered company?',
                vars: [
                    'are you registered', 'is swift sales registered', 'registration details', 'licensing information',
                    'drug license Number', 'is this resgisterd comapny', 'is this registerd company', 'is this registred company',
                    'registerd or not', 'resgisterd comapny', 'registred comapony', 'are you legal', 'official registration',
                    'government approval', 'ministry of health registered', 'pharmacy council pakistan', 'ntn number',
                    'tax registration', 'is company authorized', 'licensed dealer', 'authentic distributor',
                    'drug selling license', 'punjab drug license', 'registered with drug regulatory authority',
                    'is this a real company', 'company credentials', 'legal status', 'business registration',
                    'company license', 'official license', 'verified company', 'licensed pharmacy',
                    'resgisterd from pakistan', 'registered in pakistan', 'registerd company'
                ],
                ans: 'Yes, **Swift Sales Healthcare** is a fully licensed and registered pharmaceutical distribution company. 🛡️\n\n' +
                    '✅ **Drug Selling License:** DL-145 (Punjab)\n' +
                    '✅ **NTN (Tax Registration):** 3456789-0\n' +
                    '✅ **Approved By:** Ministry of Health & Pakistan Pharmacy Council\n' +
                    '✅ **Compliance:** FDA Compliant & GDP Certified\n\n' +
                    'We operate 100% legally and ethically, sourcing only authentic medicines from licensed manufacturers.'
            }
        ];

        companyQueries.forEach(item => {
            faqs.push({
                id: `comp_${id++}`,
                question: item.q,
                variations: item.vars,
                answer: item.ans,
                category: 'Company Information',
                products: [],
                tags: ['company', 'about us', 'trust', 'credentials']
            });
        });

        return faqs;
    }
};

// Generate all FAQs
console.log('📝 Generating FAQs...\n');

const allFAQs = {
    medical: faqGenerators.medicalConditions(),
    products: faqGenerators.productSpecific(),
    ordering: faqGenerators.orderingDelivery(),
    conversational: faqGenerators.conversational(),
    company: faqGenerators.companyInfo()
};

// Save individual category files
const faqDir = path.join(__dirname, '../data/faqs');
fs.ensureDirSync(faqDir);

console.log('💾 Saving FAQ files...\n');

const stats = {};

Object.entries(allFAQs).forEach(([category, faqs]) => {
    const fileName = `faq_${category}_generated.json`;
    const filePath = path.join(faqDir, fileName);

    fs.writeJSONSync(filePath, faqs, { spaces: 2 });
    stats[category] = faqs.length;

    console.log(`✅ ${fileName}: ${faqs.length} FAQs`);
});

// Create master FAQ file
const masterFAQs = Object.values(allFAQs).flat();
const masterPath = path.join(faqDir, 'faq_master_all.json');
fs.writeJSONSync(masterPath, masterFAQs, { spaces: 2 });

console.log(`\n✅ Master FAQ file: ${masterFAQs.length} total FAQs\n`);

// Summary Report
console.log('='.repeat(60));
console.log('📊 FAQ GENERATION SUMMARY');
console.log('='.repeat(60));
console.log(`Medical Conditions:  ${stats.medical} FAQs`);
console.log(`Product-Specific:    ${stats.products} FAQs`);
console.log(`Ordering & Delivery: ${stats.ordering} FAQs`);
console.log(`Conversational:      ${stats.conversational} FAQs`);
console.log(`Company Information: ${stats.company} FAQs`);
console.log('-'.repeat(60));
console.log(`TOTAL:               ${masterFAQs.length} FAQs`);
console.log('='.repeat(60));

console.log('\n✅ All FAQs generated successfully!');
console.log('\n📝 Next Steps:');
console.log('1. Run buildComprehensiveFAQs.js to generate embeddings');
console.log('2. Restart server to load new FAQs');
console.log('3. Test with various queries');

console.log('\n🎉 Done!\n');
