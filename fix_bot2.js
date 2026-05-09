const fs = require('fs');
let content = fs.readFileSync('components/ChatBot.tsx', 'utf-8');

const fsPatch = require('./CHATBOT_PATCH.js');
// Wait, I can't require it if it's not a valid module, but I can read it!
let patchStr = fs.readFileSync('CHATBOT_PATCH.js', 'utf-8');

