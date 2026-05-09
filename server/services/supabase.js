
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== '') {
    try {
        const { createClient } = require('@supabase/supabase-js');
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase client initialized (Legacy Mode)');
    } catch (error) {
        console.warn('⚠️ Supabase initialization failed:', error.message);
    }
} else {
    console.log('ℹ️ Supabase credentials missing. Running in LOCAL SQLITE MODE.');
    // Provide a dummy object to prevent crashes in legacy code
    supabase = {
        from: () => ({
            select: () => ({
                eq: () => ({
                    in: () => ({ data: [], error: null }),
                    data: [],
                    error: null
                }),
                in: () => ({ data: [], error: null }),
                data: [],
                error: null
            })
        })
    };
}

module.exports = { supabase };
