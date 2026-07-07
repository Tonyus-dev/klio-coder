import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// O Supabase será ativado na etapa final. 
// Para inicializar, você precisará preencher as variáveis no seu .env:
// VITE_SUPABASE_URL=sua_url
// VITE_SUPABASE_ANON_KEY=sua_chave

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Serviço temporário de mock para testar a UI sem bater no banco real
export const mockService = {
  getBusinessBySlug: async (slug: string) => {
    return {
      id: '123',
      slug,
      name: slug.replace(/-/g, ' '),
      description: 'Atendimento especializado',
      services: [
        { id: '1', name: 'Consulta Inicial', price: 150, duration: 60 }
      ]
    };
  }
};
