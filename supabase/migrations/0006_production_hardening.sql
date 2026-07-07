-- PR 12 — Production Hardening
-- Define search_path explícito nas RPCs públicas para evitar hijacking de search path.
-- Concede EXECUTE explicitamente para o role anon.

-- search_path seguro para cada RPC pública
ALTER FUNCTION public.create_public_appointment_request(
  UUID, TEXT, TEXT, TEXT, UUID, DATE, TIME, TEXT
) SET search_path = public;

ALTER FUNCTION public.get_client_portal_by_token(TEXT)
SET search_path = public;

ALTER FUNCTION public.send_payment_proof_by_token(
  TEXT, UUID, TEXT, DECIMAL, TEXT
) SET search_path = public;

-- Grants explícitos para o role anon (acesso público controlado)
GRANT EXECUTE ON FUNCTION public.create_public_appointment_request(
  UUID, TEXT, TEXT, TEXT, UUID, DATE, TIME, TEXT
) TO anon;

GRANT EXECUTE ON FUNCTION public.get_client_portal_by_token(TEXT) TO anon;

GRANT EXECUTE ON FUNCTION public.send_payment_proof_by_token(
  TEXT, UUID, TEXT, DECIMAL, TEXT
) TO anon;

-- Confirmar que RLS está habilitado nas tabelas sensíveis
-- (idempotente: não causa erro se já estiver habilitado)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Garantir que não há SELECT público aberto em clients, appointments, payment_proofs
DROP POLICY IF EXISTS "clients_public_select" ON public.clients;
DROP POLICY IF EXISTS "appointments_public_select" ON public.appointments;
DROP POLICY IF EXISTS "payment_proofs_public_select" ON public.payment_proofs;
