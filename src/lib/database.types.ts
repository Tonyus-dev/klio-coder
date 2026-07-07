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
      guardians: {
        Row: {
          id: string
          display_name: string | null
          nickname: string | null
          pronouns: string | null
          avatar_url: string | null
          theme_preference: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          display_name?: string | null
          nickname?: string | null
          pronouns?: string | null
          avatar_url?: string | null
          theme_preference?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          display_name?: string | null
          nickname?: string | null
          pronouns?: string | null
          avatar_url?: string | null
          theme_preference?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      businesses: {
        Row: {
          id: string
          guardian_id: string
          name: string
          slug: string
          description: string | null
          public_phone: string | null
          public_email: string | null
          address: string | null
          tone_notes: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          guardian_id: string
          name: string
          slug: string
          description?: string | null
          public_phone?: string | null
          public_email?: string | null
          address?: string | null
          tone_notes?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          guardian_id?: string
          name?: string
          slug?: string
          description?: string | null
          public_phone?: string | null
          public_email?: string | null
          address?: string | null
          tone_notes?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
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
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string
          description?: string | null
          duration_minutes?: number | null
          price?: number | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      clients: {
        Row: {
          id: string
          business_id: string
          name: string | null
          phone: string | null
          email: string | null
          portal_token: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          name?: string | null
          phone?: string | null
          email?: string | null
          portal_token?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          name?: string | null
          phone?: string | null
          email?: string | null
          portal_token?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          business_id: string
          client_id: string | null
          service_id: string | null
          requested_date: string | null
          requested_time: string | null
          starts_at: string | null
          status: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          business_id: string
          client_id?: string | null
          service_id?: string | null
          requested_date?: string | null
          requested_time?: string | null
          starts_at?: string | null
          status?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          business_id?: string
          client_id?: string | null
          service_id?: string | null
          requested_date?: string | null
          requested_time?: string | null
          starts_at?: string | null
          status?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      payment_proofs: {
        Row: {
          id: string
          appointment_id: string | null
          client_id: string | null
          amount: number | null
          reference: string | null
          notes: string | null
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          appointment_id?: string | null
          client_id?: string | null
          amount?: number | null
          reference?: string | null
          notes?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          appointment_id?: string | null
          client_id?: string | null
          amount?: number | null
          reference?: string | null
          notes?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
