-- 0004_eco_chamber_schema.sql
-- Adiciona tabelas para a Câmara do Eco (Caverna do Eco): gravação, transcrição em blocos e análise de reuniões.

-- 1. Sessões da Câmara do Eco
CREATE TABLE public.eco_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    mode TEXT CHECK (mode IN ('audio', 'text')),
    status TEXT CHECK (status IN ('nova', 'gravando', 'finalizando', 'transcrevendo', 'finalizada', 'analisando', 'analisada', 'erro')),
    is_analyzed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.eco_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam suas sessões de eco"
    ON public.eco_sessions FOR ALL
    USING (auth.uid() = guardian_id);


-- 2. Blocos de Transcrição
CREATE TABLE public.eco_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.eco_sessions(id) ON DELETE CASCADE,
    order_index INT NOT NULL,
    start_time TEXT, -- ex: '00:00'
    end_time TEXT,   -- ex: '03:00'
    status TEXT CHECK (status IN ('queued', 'processing', 'transcribed', 'failed', 'current')),
    transcription TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.eco_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam blocos de eco"
    ON public.eco_blocks FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.eco_sessions WHERE id = session_id));


-- 3. Análise Estruturada da Sessão (Resumo, Temas, Decisões)
CREATE TABLE public.eco_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.eco_sessions(id) ON DELETE CASCADE UNIQUE,
    summary TEXT,
    themes TEXT[],
    decisions TEXT[],
    signals TEXT[],
    next_steps TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.eco_analysis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam análises de eco"
    ON public.eco_analysis FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.eco_sessions WHERE id = session_id));
