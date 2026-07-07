-- 0003_kaline_memory_layers.sql
-- Refina a arquitetura de memória da Kaline em três camadas exatas (Contextos, Sedimentos Contextuais e Jardim)

-- 1. Tabela de Contextos (Identidade e Memória Relacional - O que vai no prompt)
CREATE TABLE public.kaline_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT CHECK (type IN ('identidade', 'memoria_relacional')),
    is_active BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kaline_contexts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seus contextos"
    ON public.kaline_contexts FOR ALL
    USING (auth.uid() = guardian_id);


-- 2. Tabela de Sedimentos (Memória de Curto Prazo / Hipóteses)
-- Substituindo a tabela genérica anterior pela versão fiel ao MemoryPanel com CONTEXTO original
DROP TABLE IF EXISTS public.sediments CASCADE;

CREATE TABLE public.kaline_sediments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    text TEXT NOT NULL, -- O insight extraído
    raw_context TEXT, -- O CONTEXTO BRUTO (mensagens anteriores que geraram essa sedimentação)
    type TEXT CHECK (type IN ('iconic', 'echoic', 'short_term', 'working', 'prospective', 'episodic', 'semantic', 'procedural')),
    status TEXT CHECK (status IN ('pendente', 'revisado', 'arquivado')) DEFAULT 'pendente',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kaline_sediments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seus sedimentos"
    ON public.kaline_sediments FOR ALL
    USING (auth.uid() = guardian_id);


-- 3. Tabela do Jardim (Memória de Longo Prazo / Fatos Aprovados)
CREATE TABLE public.kaline_garden (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('kaline', 'ká', 'ecossistema', 'preferência')),
    tags TEXT[] DEFAULT '{}',
    importance INT DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
    next_revision DATE,
    approved_at DATE DEFAULT CURRENT_DATE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kaline_garden ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seu jardim"
    ON public.kaline_garden FOR ALL
    USING (auth.uid() = guardian_id);
