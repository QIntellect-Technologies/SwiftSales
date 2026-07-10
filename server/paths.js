/**
 * paths.js -- Centralised data-path resolution for Railway (and any host).
 *
 * On Railway:
 *   1. Add a Volume in the Railway dashboard, mounted at e.g. /data
 *   2. Set environment variable DATA_PATH=/data  in Railway > Variables
 *
 * Locally (no DATA_PATH env var set):
 *   Falls back to the repo-relative server/data/ directory as usual.
 *
 * All server code that reads/writes persistent data files should import
 * from here instead of constructing paths with __dirname.
 */

const path = require('path');
const fs   = require('fs-extra');

// Root directory for all persistent data files.
const DATA_ROOT = process.env.DATA_PATH
    ? path.resolve(process.env.DATA_PATH)   // Railway Volume mount, e.g. /data
    : path.join(__dirname, 'data');          // local dev fallback: server/data/

const MEDICINES_FILE = path.join(DATA_ROOT, 'medicines.json');
const EMBEDDINGS_DIR = path.join(DATA_ROOT, 'embeddings');
const VECTORS_FILE   = path.join(EMBEDDINGS_DIR, 'supabase_vectors.json');
const DATABASE_FILE  = path.join(DATA_ROOT, 'chatbot.db');

// Ensure the data directories exist (important on first Railway deploy when volume is empty)
fs.ensureDirSync(DATA_ROOT);
fs.ensureDirSync(EMBEDDINGS_DIR);

// Log resolved paths once on startup -- easy to verify in Railway logs
console.log('=== Data Paths ===');
console.log('DATA_ROOT       :', DATA_ROOT);
console.log('MEDICINES_FILE  :', MEDICINES_FILE);
console.log('VECTORS_FILE    :', VECTORS_FILE);
console.log('DATABASE_FILE   :', DATABASE_FILE);
console.log('==================');

module.exports = { DATA_ROOT, MEDICINES_FILE, EMBEDDINGS_DIR, VECTORS_FILE, DATABASE_FILE };
