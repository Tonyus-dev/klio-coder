import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// O Supabase será ativado na etapa final. 
// Para inicializar, você precisará preencher as variáveis no seu .env:
// VITE_SUPABASE_URL=sua_url
// VITE_SUPABASE_ANON_KEY=sua_chave

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

