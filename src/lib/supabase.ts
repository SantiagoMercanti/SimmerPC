import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Usar una instancia única en todo el proyecto
export const supabase =
  globalThis.supabase ||
  createClient(supabaseUrl, supabaseAnonKey);

// Guardar la instancia en globalThis para evitar duplicados en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabase;
}
