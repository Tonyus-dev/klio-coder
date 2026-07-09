import { isSupabaseConfigured, supabase } from '../supabase';

export { isSupabaseConfigured };

export function getSupabaseClient() {
  return supabase;
}

export function requireSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para usar persistência remota.');
  }
  return supabase;
}
