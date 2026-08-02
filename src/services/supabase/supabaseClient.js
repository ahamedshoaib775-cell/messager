import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://novalink-messaging-app.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmFsaW5rLW1lc3NhZ2luZy1hcHAiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyMjYwMDAwMCwiZXhwIjoyMDM4MTc2MDAwfQ.novalink_supabase_anon_key_production';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
