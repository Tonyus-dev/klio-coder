import { supabase } from './supabase';
import type { Database } from './database.types';

type Business = Database['public']['Tables']['businesses']['Row'];
type Service = Database['public']['Tables']['services']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];
type Appointment = Database['public']['Tables']['appointments']['Row'];
type PaymentProof = Database['public']['Tables']['payment_proofs']['Row'];

export const kuanyinClient = {
  // PÚBLICO: Storefront
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    if (error) return null;
    return data;
  },

  async getServicesByBusinessId(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  async createAppointmentRequest(payload: {
    business_id: string;
    service_id?: string;
    name: string;
    phone: string;
    email?: string;
    requested_date?: string;
    requested_time?: string;
    notes?: string;
  }): Promise<{ portalToken?: string; error?: string }> {
    try {
      const { data, error } = await supabase.rpc('create_public_appointment_request', {
        p_business_id: payload.business_id,
        p_name: payload.name,
        p_phone: payload.phone,
        p_email: payload.email || null,
        p_service_id: payload.service_id || null,
        p_requested_date: payload.requested_date || null,
        p_requested_time: payload.requested_time || null,
        p_notes: payload.notes || null
      });

      if (error) throw new Error(error.message);
      return { portalToken: data };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // PÚBLICO: Portal
  async getClientPortalByToken(token: string) {
    const { data, error } = await supabase.rpc('get_client_portal_by_token', { p_token: token });
    if (error || !data) return { error: "Portal não encontrado ou link inválido" };
    return { client: data.client, appointments: data.appointments || [] };
  },

  async sendPaymentProof(payload: {
    appointment_id: string;
    token: string;
    reference: string;
    notes?: string;
    amount?: number;
  }) {
    const { error } = await supabase.rpc('send_payment_proof_by_token', {
        p_token: payload.token,
        p_appointment_id: payload.appointment_id,
        p_reference: payload.reference,
        p_amount: payload.amount || 0,
        p_notes: payload.notes || null
    });
    if (error) return { error: error.message };
    return { success: true };
  },

  // GUARDIÃO
  async getGuardianBusiness(): Promise<Business | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('guardian_id', session.user.id)
      .single();
      
    if (error) return null;
    return data;
  },

  async upsertGuardianBusiness(payload: { name: string; slug: string; description?: string }): Promise<{ success?: boolean; error?: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: "Sessão não encontrada" };
    
    // Ensure guardian exists
    await supabase.from('guardians').upsert({ id: session.user.id }, { onConflict: 'id' });
    
    const { data: existing } = await supabase
      .from('businesses')
      .select('id')
      .eq('guardian_id', session.user.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: payload.name,
          slug: payload.slug,
          description: payload.description || null
        })
        .eq('id', existing.id);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from('businesses')
        .insert({
          guardian_id: session.user.id,
          name: payload.name,
          slug: payload.slug,
          description: payload.description || null
        });
      if (error) return { error: error.message };
    }
    return { success: true };
  },

  async createService(payload: { business_id: string; name: string; price: number; duration_minutes: number }) {
    const { error } = await supabase
      .from('services')
      .insert(payload);
    if (error) return { error: error.message };
    return { success: true };
  },

  async updateService(id: string, payload: Partial<Service>) {
    const { error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', id);
    if (error) return { error: error.message };
    return { success: true };
  },

  async getGuardianDashboardSummary() {
    const biz = await this.getGuardianBusiness();
    if (!biz) return { error: "Sem negócio" };
    
    const { data: activeAppts } = await supabase
      .from('appointments')
      .select('id')
      .eq('business_id', biz.id)
      .in('status', ['requested', 'proposed', 'confirmed']);
      
    const { data: proofs } = await supabase
      .from('payment_proofs')
      .select('id, appointment_id!inner(business_id)')
      .eq('status', 'pending_verification')
      .eq('appointment_id.business_id', biz.id);

    return {
      activeAppointments: activeAppts?.length || 0,
      pendingProofs: proofs?.length || 0,
    };
  }
};
