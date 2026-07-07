-- Migration file for Supabase
-- Creates all tables and Row Level Security (RLS) policies for Kuan-Yin SaaS

-- 1. Tabela Guardians (Usuários logados, vinculados ao Supabase Auth)
CREATE TABLE public.guardians (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guardiões podem ver e atualizar a si mesmos"
    ON public.guardians FOR ALL
    USING (auth.uid() = id);

-- 2. Tabela Businesses (Negócios criados pelos guardiões)
CREATE TABLE public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand_color TEXT DEFAULT '#BE185D',
    prompt_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Negócios são públicos para visualização (vitrine)
CREATE POLICY "Vitrine de negócios pública"
    ON public.businesses FOR SELECT
    USING (true);

CREATE POLICY "Guardiões gerenciam seus próprios negócios"
    ON public.businesses FOR ALL
    USING (auth.uid() = guardian_id);

-- 3. Tabela Services (Serviços ofertados pelo negócio)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Serviços são públicos
CREATE POLICY "Serviços públicos"
    ON public.services FOR SELECT
    USING (true);

CREATE POLICY "Guardiões gerenciam seus serviços"
    ON public.services FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.businesses WHERE id = business_id));

-- 4. Tabela Business Hours (Horários de funcionamento)
CREATE TABLE public.business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    UNIQUE(business_id, day_of_week)
);

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Horários públicos"
    ON public.business_hours FOR SELECT
    USING (true);

CREATE POLICY "Guardiões gerenciam seus horários"
    ON public.business_hours FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.businesses WHERE id = business_id));

-- 5. Tabela Appointments (Agendamentos feitos pelos clientes ou sugeridos pela IA)
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('proposed', 'confirmed', 'cancelled')) DEFAULT 'proposed',
    client_response TEXT CHECK (client_response IN ('accepted', 'refused')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- O cliente (Público) não pode ler nem gravar diretamente por segurança.
-- A IA (Service Role Key) vai ler e criar agendamentos pelo Backend/Edge Function.
-- O Guardião tem acesso total aos agendamentos de sua clínica.
CREATE POLICY "Guardiões gerenciam seus agendamentos"
    ON public.appointments FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.businesses WHERE id = business_id));

-- 6. Tabela Orders (Pedidos/Orçamentos para o Portal do Cliente)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('quoted', 'confirmed', 'delivered', 'cancelled')) DEFAULT 'quoted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guardiões gerenciam seus pedidos"
    ON public.orders FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.businesses WHERE id = business_id));

-- 7. Tabela Payments (Comprovantes enviados no Portal do Cliente)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    reference_code TEXT,
    status TEXT CHECK (status IN ('pending_verification', 'confirmed', 'rejected')) DEFAULT 'pending_verification',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Guardiões gerenciam os pagamentos"
    ON public.payments FOR ALL
    USING (auth.uid() = (
      SELECT guardian_id 
      FROM public.businesses 
      JOIN public.orders ON public.orders.business_id = public.businesses.id 
      WHERE public.orders.id = payments.order_id
    ));

-- 8. Função utilitária para registrar automaticamente um Guardian quando um usuário se cadastra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.guardians (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparada após signup no Supabase Auth
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
