-- Remover políticas antigas de inserção pública permissiva
DROP POLICY IF EXISTS "clients_public_insert" ON public.clients;
DROP POLICY IF EXISTS "appointments_public_insert" ON public.appointments;
DROP POLICY IF EXISTS "payment_proofs_public_insert" ON public.payment_proofs;

-- RPC para solicitar agendamento
CREATE OR REPLACE FUNCTION public.create_public_appointment_request(
    p_business_id UUID,
    p_name TEXT,
    p_phone TEXT,
    p_email TEXT,
    p_service_id UUID,
    p_requested_date DATE,
    p_requested_time TIME,
    p_notes TEXT
) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_id UUID;
    v_portal_token TEXT;
    v_business_active BOOLEAN;
BEGIN
    SELECT is_active INTO v_business_active FROM public.businesses WHERE id = p_business_id;
    IF NOT v_business_active THEN
        RAISE EXCEPTION 'Negócio inativo ou inexistente.';
    END IF;

    SELECT id, portal_token INTO v_client_id, v_portal_token
    FROM public.clients
    WHERE business_id = p_business_id AND phone = p_phone
    LIMIT 1;

    IF v_client_id IS NULL THEN
        INSERT INTO public.clients (business_id, name, phone, email)
        VALUES (p_business_id, p_name, p_phone, p_email)
        RETURNING id, portal_token INTO v_client_id, v_portal_token;
    ELSE
        UPDATE public.clients
        SET name = p_name, email = p_email
        WHERE id = v_client_id;
    END IF;

    INSERT INTO public.appointments (business_id, client_id, service_id, requested_date, requested_time, notes)
    VALUES (p_business_id, v_client_id, p_service_id, p_requested_date, p_requested_time, p_notes);

    RETURN v_portal_token;
END;
$$;

-- RPC para obter o portal do cliente pelo token
CREATE OR REPLACE FUNCTION public.get_client_portal_by_token(p_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client JSON;
    v_appointments JSON;
BEGIN
    SELECT row_to_json(c) INTO v_client
    FROM (
        SELECT clients.id, clients.name, clients.phone, clients.business_id,
            b.name AS "businesses_name"
        FROM public.clients
        JOIN public.businesses b ON b.id = clients.business_id
        WHERE clients.portal_token = p_token
    ) c;

    IF v_client IS NULL THEN
        RAISE EXCEPTION 'Token inválido';
    END IF;

    SELECT json_agg(row_to_json(a)) INTO v_appointments
    FROM (
        SELECT appt.id, appt.business_id, appt.client_id, appt.service_id, 
               appt.requested_date, appt.requested_time, appt.proposed_date, 
               appt.proposed_time, appt.status, appt.notes, appt.created_at,
            (SELECT row_to_json(s) FROM (SELECT name, price FROM public.services WHERE id = appt.service_id) s) AS services
        FROM public.appointments appt
        WHERE appt.client_id = (v_client->>'id')::UUID
        ORDER BY appt.created_at DESC
    ) a;

    RETURN json_build_object(
        'client', (
             SELECT json_build_object(
                 'id', v_client->>'id',
                 'name', v_client->>'name',
                 'phone', v_client->>'phone',
                 'business_id', v_client->>'business_id',
                 'businesses', json_build_object('name', v_client->>'businesses_name')
             )
        ), 
        'appointments', COALESCE(v_appointments, '[]'::json)
    );
END;
$$;

-- RPC para enviar comprovante de pagamento
CREATE OR REPLACE FUNCTION public.send_payment_proof_by_token(
    p_token TEXT,
    p_appointment_id UUID,
    p_reference TEXT,
    p_amount DECIMAL,
    p_notes TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_client_id UUID;
    v_valid_appt BOOLEAN;
BEGIN
    SELECT id INTO v_client_id FROM public.clients WHERE portal_token = p_token;
    
    IF v_client_id IS NULL THEN
        RAISE EXCEPTION 'Token inválido';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.appointments 
        WHERE id = p_appointment_id AND client_id = v_client_id
    ) INTO v_valid_appt;

    IF NOT v_valid_appt THEN
        RAISE EXCEPTION 'Agendamento inválido ou não pertence a este cliente.';
    END IF;

    INSERT INTO public.payment_proofs (appointment_id, client_id, reference, amount, notes)
    VALUES (p_appointment_id, v_client_id, p_reference, p_amount, p_notes);

    RETURN TRUE;
END;
$$;
