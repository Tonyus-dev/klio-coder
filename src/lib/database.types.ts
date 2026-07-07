export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration_minutes: number | null
          price: number | null
          active: boolean
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          active?: boolean
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          active?: boolean
        }
      }
      // Outras tabelas omitidas para o mock, 
      // serão adicionadas no deploy final do Supabase.
    }
  }
}
