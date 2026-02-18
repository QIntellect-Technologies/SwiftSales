const { pipeline } = require('@xenova/transformers');

/**
 * Intent Classification Service
 * Uses zero-shot classification to understand query intent before FAQ search
 */
class IntentClassifier {
    constructor() {
        this.classifier = null;
        this.initialized = false;

        // Define intent categories with descriptions
        this.intents = {
            TRUST_SAFETY: {
                label: 'asking about company trust, safety, legitimacy, registration, licensing, credentials, authenticity, or if the company is real',
                faqCategories: ['company_info', 'licensing', 'company_generated']
            },
            ORDERING: {
                label: 'asking how to order, how to buy, how to purchase, payment process, checkout steps, or delivery instructions',
                faqCategories: ['ordering_delivery', 'ordering_generated']
            },
            PRODUCT_INFO: {
                label: 'asking about specific medicine information, product details, usage, dosage, side effects, or ingredients',
                faqCategories: ['product_information', 'products_generated', 'comparison']
            },
            MEDICAL_ADVICE: {
                label: 'asking about medical symptoms, health conditions, treatment advice, diagnosis, or disease information',
                faqCategories: ['medical_conditions', 'medical_generated', 'medical_guidance', 'chronic_care']
            },
            GENERAL_CHAT: {
                label: 'greeting, saying thanks, goodbye, asking who you are, or general conversation',
                faqCategories: ['conversational', 'conversational_generated']
            },
            CATALOG_BROWSING: {
                label: 'browsing products, searching for medicines, checking availability, or asking about stock',
                faqCategories: ['catalog_browsing', 'product_information']
            }
        };
    }

    /**
     * Initialize the zero-shot classifier
     */
    async initialize() {
        if (this.initialized) return;

        try {
            console.log('[INTENT] Initializing zero-shot classifier...');
            this.classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
            this.initialized = true;
            console.log('[INTENT] ✅ Classifier initialized successfully!');
        } catch (error) {
            console.error('[INTENT] ❌ Failed to initialize classifier:', error);
            throw error;
        }
    }

    /**
     * Classify query intent
     * @param {string} query - User query
     * @returns {Promise<{intent: string, confidence: number, faqCategories: string[]}>}
     */
    async classifyIntent(query) {
        if (!this.initialized) {
            await this.initialize();
        }

        try {
            // Prepare candidate labels
            const candidateLabels = Object.values(this.intents).map(intent => intent.label);

            // Classify
            const result = await this.classifier(query, candidateLabels, {
                multi_label: false
            });

            // Get top intent
            const topLabel = result.labels[0];
            const topScore = result.scores[0];

            // Map back to intent key
            const intentKey = Object.keys(this.intents).find(
                key => this.intents[key].label === topLabel
            );

            const detectedIntent = {
                intent: intentKey,
                confidence: topScore,
                faqCategories: this.intents[intentKey].faqCategories,
                allScores: result.labels.map((label, i) => ({
                    intent: Object.keys(this.intents).find(k => this.intents[k].label === label),
                    score: result.scores[i]
                }))
            };

            console.log(`[INTENT] Query: "${query}" → ${intentKey} (${(topScore * 100).toFixed(1)}%)`);

            return detectedIntent;
        } catch (error) {
            console.error('[INTENT] Classification error:', error);
            // Fallback to no filtering
            return {
                intent: 'UNKNOWN',
                confidence: 0,
                faqCategories: null,
                allScores: []
            };
        }
    }

    /**
     * Get FAQ categories for a specific intent
     * @param {string} intentKey - Intent key
     * @returns {string[]} - FAQ categories
     */
    getFaqCategories(intentKey) {
        return this.intents[intentKey]?.faqCategories || null;
    }
}

// Singleton instance
let intentClassifierInstance = null;

function getIntentClassifier() {
    if (!intentClassifierInstance) {
        intentClassifierInstance = new IntentClassifier();
    }
    return intentClassifierInstance;
}

module.exports = { IntentClassifier, getIntentClassifier };
