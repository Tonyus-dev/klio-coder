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
      // 1. Check or Create Client
      let clientId = null;
      let portalToken = null;
      
      const { data: clients, error: searchError } = await supabase
        .from('clients')
        .select('*')
        .eq('business_id', payload.business_id)
        .eq('phone', payload.phone)
        .limit(1);
        
      if (searchError) throw new Error("Erro ao buscar cliente");

      if (clients && clients.length > 0) {
        clientId = clients[0].id;
        portalToken = clients[0].portal_token;
        // Optionally update email/name
      } else {
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            business_id: payload.business_id,
            name: payload.name,
            phone: payload.phone,
            email: payload.email || null,
          })
          .select()
          .single();
          
        if (createError || !newClient) throw new Error("Erro ao cadastrar cliente");
        clientId = newClient.id;
        portalToken = newClient.portal_token;
      }

      // 2. Create Appointment
      const { error: apptError } = await supabase
        .from('appointments')
        .insert({
          business_id: payload.business_id,
          client_id: clientId,
          service_id: payload.service_id || null,
          requested_date: payload.requested_date || null,
          requested_time: payload.requested_time || null,
          notes: payload.notes || null,
        });

      if (apptError) throw new Error("Erro ao solicitar agendamento");

      return { portalToken };
    } catch (err: any) {
      return { error: err.message };
    }
  },

  // PÚBLICO: Portal
  async getClientPortalByToken(token: string) {
    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .select('*, businesses(name)')
      .eq('portal_token', token)
      .single();
      
    if (clientErr || !client) return { error: "Portal não encontrado ou link inválido" };

    const { data: appointments } = await supabase
      .from('appointments')
      .select('*, services(name, price)')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });

    return { client, appointments: appointments || [] };
  },

  async sendPaymentProof(payload: {
    appointment_id: string;
    client_id: string;
    reference: string;
    notes?: string;
    amount?: number;
  }) {
    const { error } = await supabase
      .from('payment_proofs')
      .insert({
        appointment_id: payload.appointment_id,
        client_id: payload.client_id,
        reference: payload.reference,
        notes: payload.notes || null,
        amount: payload.amount || null,
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
