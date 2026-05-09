const fs = require('fs');
let content = fs.readFileSync('components/ChatBot.tsx', 'utf-8');

// Replace old conversational
const oldConvRegex = /case 'conversational':[\s\S]*?(?=case 'price_inquiry':)/;
const newConv = \case 'conversational':
                addBotMessage(
                    \I'm doing great, thank you for asking! ??\\n\\n\ +
                    \I'm here and ready to help you with:\\n\ +
                    \• Finding medicines\\n\ +
                    \• Health recommendations\\n\ +
                    \• Product information\\n\ +
                    \• Ordering assistance\\n\\n\ +
                    \How can I assist you today?\
                );
                break;

            \;

content = content.replace(oldConvRegex, newConv);

// Replace old product catalog
const oldCatalogRegex = /case 'product_catalog':[\s\S]*?(?=case 'company_leadership':)/;
const newCatalog = \case 'product_catalog':
                addBotMessage(
                    \?? **Our Product Catalog:**\\n\\n\ +
                    \We have **296 pharmaceutical products** across **5 manufacturers**:\\n\\n\ +
                    \• ?? Derma Shine Pharm (15 products)\\n\ +
                    \• ?? Swiss Pharmaceuticals (71 products)\\n\ +
                    \• ?? Green Crust/Nutric (73 products)\\n\ +
                    \• ?? Amgen Pharma (67 products)\\n\ +
                    \• ?? Triafa Pharmaceutical (70 products)\\n\\n\ +
                    \**Categories:**\\n\ +
                    \? Pain Relief & Anti-inflammatory\\n\ +
                    \? Antibiotics & Antimicrobials\\n\ +
                    \? Vitamins & Supplements\\n\ +
                    \? Skin Care & Dermatology\\n\ +
                    \? Gastric & Digestive Health\\n\ +
                    \? And much more!\\n\\n\ +
                    \What specific product or category are you looking for? ??\
                );
                break;

            \;

content = content.replace(oldCatalogRegex, newCatalog);

// Replace old general ordering
const oldGenOrdRegex = /case 'general_ordering':[\s\S]*?(?=case 'manufacturer_list':)/;
const newGenOrd = \case 'general_ordering':
                addBotMessage(
                    \Great! I'd be happy to help you place an order! ??\\n\\n\ +
                    \**Ordering Options:**\\n\\n\ +
                    \?? **Phone Order:**\\n\ +
                    \Call \\\n\ +
                    \We'll take your order and have it ready!\\n\\n\ +
                    \?? **In-Store:**\\n\ +
                    \Visit us at: \\\n\ +
                    \Hours: \\\n\\n\ +
                    \?? **Home Delivery:**\\n\ +
                    \• Minimum order: Rs. 500\\n\ +
                    \• Delivery fee: Rs. 100-200 (based on location)\\n\ +
                    \• Call to arrange delivery\\n\\n\ +
                    \Which product would you like to order? Tell me the name and I'll check availability! ??\
                );
                break;

            \;

content = content.replace(oldGenOrdRegex, newGenOrd);

// Find the block "case 'offensive_content':" near the bottom that I added previously, and delete it all the way down to default: // Use RAG with embeddings search to try and answer
const bottomDuplicates = /case 'offensive_content':[\s\S]*?case 'unclear':\s*default:\s*\/\/\s*Use RAG with embeddings search to try and answer/g;
content = content.replace(bottomDuplicates, \case 'unclear':
            default:
                // Use RAG with embeddings search to try and answer\);

fs.writeFileSync('components/ChatBot.tsx', content, 'utf-8');
console.log('Bot patched locally!');
