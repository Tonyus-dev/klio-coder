ALTER TABLE public.guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kaline_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kaline_sediments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kaline_garden ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "guardians_select_own"
ON public.guardians
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "guardians_update_own"
ON public.guardians
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "guardians_insert_own"
ON public.guardians
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "businesses_guardian_all"
ON public.businesses
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "businesses_public_read_active"
ON public.businesses
FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "services_guardian_all"
ON public.services
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = services.business_id
    AND b.guardian_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = services.business_id
    AND b.guardian_id = auth.uid()
  )
);

CREATE POLICY "services_public_read_active"
ON public.services
FOR SELECT
USING (
  active = TRUE AND EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = services.business_id
    AND b.is_active = TRUE
  )
);

CREATE POLICY "clients_guardian_read"
ON public.clients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = clients.business_id
    AND b.guardian_id = auth.uid()
  )
);

CREATE POLICY "clients_public_insert"
ON public.clients
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = clients.business_id
    AND b.is_active = TRUE
  )
);

CREATE POLICY "appointments_guardian_all"
ON public.appointments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = appointments.business_id
    AND b.guardian_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = appointments.business_id
    AND b.guardian_id = auth.uid()
  )
);

CREATE POLICY "appointments_public_insert"
ON public.appointments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = appointments.business_id
    AND b.is_active = TRUE
  )
);

CREATE POLICY "payment_proofs_guardian_read"
ON public.payment_proofs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.appointments a
    JOIN public.businesses b ON b.id = a.business_id
    WHERE a.id = payment_proofs.appointment_id
    AND b.guardian_id = auth.uid()
  )
);

CREATE POLICY "payment_proofs_public_insert"
ON public.payment_proofs
FOR INSERT
WITH CHECK (TRUE);

-- Memory / Eco Policies
CREATE POLICY "chat_sessions_guardian_all"
ON public.chat_sessions
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "messages_guardian_all"
ON public.messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = messages.session_id
    AND cs.guardian_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_sessions cs
    WHERE cs.id = messages.session_id
    AND cs.guardian_id = auth.uid()
  )
);

CREATE POLICY "kaline_contexts_guardian_all"
ON public.kaline_contexts
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "kaline_sediments_guardian_all"
ON public.kaline_sediments
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "kaline_garden_guardian_all"
ON public.kaline_garden
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "eco_sessions_guardian_all"
ON public.eco_sessions
FOR ALL
USING (guardian_id = auth.uid())
WITH CHECK (guardian_id = auth.uid());

CREATE POLICY "eco_blocks_guardian_all"
ON public.eco_blocks
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.eco_sessions es
    WHERE es.id = eco_blocks.session_id
    AND es.guardian_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.eco_sessions es
    WHERE es.id = eco_blocks.session_id
    AND es.guardian_id = auth.uid()
  )
);

CREATE POLICY "eco_analysis_guardian_all"
ON public.eco_analysis
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.eco_sessions es
    WHERE es.id = eco_analysis.session_id
    AND es.guardian_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.eco_sessions es
    WHERE es.id = eco_analysis.session_id
    AND es.guardian_id = auth.uid()
  )
);
