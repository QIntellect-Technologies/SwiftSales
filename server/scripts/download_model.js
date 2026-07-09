const { pipeline, env } = require('@xenova/transformers');
const path = require('path');

async function downloadModel() {
    const modelDir = path.join(__dirname, '../models');
    
    // Configure transformers to cache in our specific directory
    env.localModelPath = modelDir;
    env.cacheDir = modelDir; // Forces download into this directory
    
    console.log(`Downloading Xenova/all-MiniLM-L6-v2 to ${modelDir}...`);
    try {
        await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
            cache_dir: modelDir,
        });
        console.log('✅ Model downloaded successfully!');
    } catch (err) {
        console.error('❌ Failed to download model:', err);
    }
}

downloadModel();
