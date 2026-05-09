const fs = require('fs');
let c = fs.readFileSync('components/ChatBot.tsx', 'utf-8');
c = c.replace('fetch(/api/rag/general', 'fetch(\\$\{apiBaseUrl\}/api/rag/general\');
fs.writeFileSync('components/ChatBot.tsx', c, 'utf-8');
