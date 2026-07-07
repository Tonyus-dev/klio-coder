CREATE TABLE public.kaline_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  scope TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.kaline_sediments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.kaline_garden (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  source_sediment_id UUID REFERENCES public.kaline_sediments(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.eco_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id UUID NOT NULL REFERENCES public.guardians(id) ON DELETE CASCADE,
  title TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('audio', 'text')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'processing', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.eco_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.eco_sessions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  block_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.eco_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.eco_sessions(id) ON DELETE CASCADE,
  summary TEXT,
  insights JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kaline_contexts_guardian_id ON public.kaline_contexts(guardian_id);
CREATE INDEX idx_kaline_sediments_guardian_id ON public.kaline_sediments(guardian_id);
CREATE INDEX idx_kaline_sediments_status ON public.kaline_sediments(status);
CREATE INDEX idx_kaline_garden_guardian_id ON public.kaline_garden(guardian_id);
CREATE INDEX idx_eco_sessions_guardian_id ON public.eco_sessions(guardian_id);
CREATE INDEX idx_eco_blocks_session_id ON public.eco_blocks(session_id);
CREATE INDEX idx_eco_analysis_session_id ON public.eco_analysis(session_id);
