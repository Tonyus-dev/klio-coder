-- 0002_kaline_core_schema.sql
-- Adiciona as tabelas centrais da Estação Kaline (Memória, Chats, Hábitos e Perfil expandido)

-- 1. Expandindo a tabela Guardians com informações de perfil
ALTER TABLE public.guardians 
ADD COLUMN nickname TEXT,
ADD COLUMN pronouns TEXT,
ADD COLUMN avatar_url TEXT,
ADD COLUMN theme_preference TEXT DEFAULT 'kaline';

-- 2. Sessões de Chat (para separar as conversas com Kaline, Klio e Kháris)
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    facet TEXT NOT NULL CHECK (facet IN ('kaline', 'klio', 'kharis')),
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam suas sessões de chat"
    ON public.chat_sessions FOR ALL
    USING (auth.uid() = guardian_id);

-- 3. Mensagens do Chat
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam suas mensagens"
    ON public.messages FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.chat_sessions WHERE id = session_id));

-- 4. Sedimentação (Anotações, Memória de Longo Prazo e Jardim)
CREATE TABLE public.sediments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_facet TEXT CHECK (source_facet IN ('kaline', 'klio', 'kharis', 'manual')),
    tags TEXT[] DEFAULT '{}',
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sediments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seus sedimentos"
    ON public.sediments FOR ALL
    USING (auth.uid() = guardian_id);

-- 5. Hábitos e Rotinas (Aba Caverna/Today)
CREATE TABLE public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('morning', 'afternoon', 'night', 'all')),
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'custom')),
    target_value INT NOT NULL DEFAULT 1,
    unit TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seus hábitos"
    ON public.habits FOR ALL
    USING (auth.uid() = guardian_id);

-- 6. Registros de Hábitos (Histórico)
CREATE TABLE public.habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    completed_value INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_id, log_date)
);

ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam logs de hábitos"
    ON public.habit_logs FOR ALL
    USING (auth.uid() = (SELECT guardian_id FROM public.habits WHERE id = habit_id));

-- 7. Diário e Humor (Daily Log)
CREATE TABLE public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    mood TEXT CHECK (mood IN ('great', 'good', 'neutral', 'tired', 'stressed')),
    reflection TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guardian_id, log_date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guardiões gerenciam seu diário"
    ON public.daily_logs FOR ALL
    USING (auth.uid() = guardian_id);
