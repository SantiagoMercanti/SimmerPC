import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const client = createClient('https://ewdxhsdntsvjxfyfwvib.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZHhoc2RudHN2anhmeWZ3dmliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjE0OTUsImV4cCI6MjA2OTczNzQ5NX0.arKWhLT4mxbwPkFKAwI1528ilC-9bRq5s4fPJlQuF2M');