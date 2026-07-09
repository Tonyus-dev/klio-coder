export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos-alvo da Klio Coder.
// As tabelas serão criadas em PR futuro de Supabase/migrations.
// Este arquivo não prova existência remota.
export interface Database {
  public: {
    Tables: {
      klio_threads: {
        Row: {
          id: string
          created_at: string
          summary: string | null
          goal: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          summary?: string | null
          goal?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          summary?: string | null
          goal?: string | null
        }
      }
      klio_messages: {
        Row: {
          id: string
          thread_id: string
          content: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          content: string
          role: string
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          content?: string
          role?: string
          created_at?: string
        }
      }
      klio_sedimentos: {
        Row: {
          id: string
          content: string
          level: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          level: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          level?: string
          created_at?: string
        }
      }
      klio_memorias: {
        Row: {
          id: string
          content: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          type: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          type?: string
          created_at?: string
        }
      }
      klio_memory_candidates: {
        Row: {
          id: string
          content: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          status?: string
          created_at?: string
        }
      }
      klio_settings: {
        Row: {
          id: string
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
