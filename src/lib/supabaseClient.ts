import { createClient } from '@supabase/supabase-js';

// Tambahkan https:// di awal URL
const supabaseUrl = 'https://fumcrznhvregdsfehiso.supabase.co';
const supabaseAnonKey = 'sb_publishable_5WmsaED8eeGPbLtVQsXQJQ_lRpU-_4b';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);