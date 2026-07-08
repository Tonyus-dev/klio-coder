-- PromptForge: Supabase Migration
-- Run via: supabase db push OR Supabase Dashboard SQL Editor

-- ============================================================
-- TABELA: prompt_history (histórico privado do usuário)
-- ============================================================
create table if not exists prompt_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  idea text not null,
  mode text not null check (mode in ('code', 'vibecode', 'image', 'video')),
  generated_prompt text not null,
  model_used text,
  is_favorite boolean default false,
  tags text[] default '{}',
  votes_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: usuário só vê e gerencia seus próprios prompts
alter table prompt_history enable row level security;

create policy "users_own_history" on prompt_history
  for all using (auth.uid() = user_id);

-- ============================================================
-- TABELA: public_prompts (prompts compartilhados publicamente)
-- ============================================================
create table if not exists public_prompts (
  id uuid default gen_random_uuid() primary key,
  prompt text not null,
  mode text not null check (mode in ('code', 'vibecode', 'image', 'video')),
  idea text,
  metadata jsonb default '{}',
  views integer default 0,
  upvotes integer default 0,
  shared_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- Qualquer um pode ler prompts públicos
alter table public_prompts enable row level security;

create policy "public_read" on public_prompts
  for select using (true);

create policy "authenticated_insert" on public_prompts
  for insert with check (true); -- Permite anônimos criarem (via service key no backend)

create policy "owner_update" on public_prompts
  for update using (auth.uid() = shared_by);

-- ============================================================
-- TABELA: prompt_votes (votos nos prompts públicos)
-- ============================================================
create table if not exists prompt_votes (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references public_prompts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique(prompt_id, user_id)
);

alter table prompt_votes enable row level security;

create policy "users_own_votes" on prompt_votes
  for all using (auth.uid() = user_id);

-- Função para atualizar contador de votos
create or replace function update_upvotes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public_prompts set upvotes = upvotes + 1 where id = NEW.prompt_id;
  elsif TG_OP = 'DELETE' then
    update public_prompts set upvotes = upvotes - 1 where id = OLD.prompt_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_vote_change
  after insert or delete on prompt_votes
  for each row execute function update_upvotes_count();

-- ============================================================
-- TABELA: user_stats (cache de estatísticas do usuário)
-- ============================================================
create table if not exists user_stats (
  user_id uuid references auth.users(id) on delete cascade primary key,
  total_prompts integer default 0,
  prompts_by_mode jsonb default '{"code":0,"vibecode":0,"image":0,"video":0}',
  streak_days integer default 0,
  last_active_date date,
  most_used_mode text default 'code',
  updated_at timestamptz default now()
);

alter table user_stats enable row level security;

create policy "users_own_stats" on user_stats
  for all using (auth.uid() = user_id);

-- Função para atualizar stats quando um prompt é criado
create or replace function update_user_stats_on_prompt()
returns trigger as $$
declare
  today date := current_date;
  current_stats user_stats%rowtype;
begin
  select * into current_stats from user_stats where user_id = NEW.user_id;
  
  if not found then
    insert into user_stats (user_id, total_prompts, prompts_by_mode, streak_days, last_active_date)
    values (
      NEW.user_id,
      1,
      jsonb_build_object('code', 0, 'vibecode', 0, 'image', 0, 'video', 0) || 
        jsonb_build_object(NEW.mode, 1),
      1,
      today
    );
  else
    update user_stats set
      total_prompts = total_prompts + 1,
      prompts_by_mode = prompts_by_mode || 
        jsonb_build_object(NEW.mode, (prompts_by_mode->>NEW.mode)::int + 1),
      streak_days = case 
        when last_active_date = today - 1 then streak_days + 1
        when last_active_date = today then streak_days
        else 1
      end,
      last_active_date = today,
      updated_at = now()
    where user_id = NEW.user_id;
  end if;
  
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_prompt_created
  after insert on prompt_history
  for each row execute function update_user_stats_on_prompt();

-- ============================================================
-- ÍNDICES para performance
-- ============================================================
create index if not exists idx_prompt_history_user_id on prompt_history(user_id);
create index if not exists idx_prompt_history_mode on prompt_history(mode);
create index if not exists idx_prompt_history_created_at on prompt_history(created_at desc);
create index if not exists idx_prompt_history_tags on prompt_history using gin(tags);
create index if not exists idx_public_prompts_mode on public_prompts(mode);
create index if not exists idx_public_prompts_upvotes on public_prompts(upvotes desc);
create index if not exists idx_public_prompts_created_at on public_prompts(created_at desc);
