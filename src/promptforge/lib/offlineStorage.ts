// PromptForge — Offline Storage
// Handles localStorage (history, favorites, stats) and IndexedDB for larger payloads

import type { PromptMode } from './promptForgeApi';

export interface HistoryItem {
  id: string;
  idea: string;
  mode: PromptMode;
  prompt: string;
  model_used?: string;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
}

export interface UserStats {
  total_prompts: number;
  prompts_by_mode: Record<PromptMode, number>;
  streak_days: number;
  last_active_date: string;
  most_used_mode: PromptMode;
}

const HISTORY_KEY = 'pf_history';
const STATS_KEY = 'pf_stats';
const MAX_LOCAL_HISTORY = 100;

function generateId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// =============================================
// HISTORY
// =============================================

export function getLocalHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocalHistory(item: Omit<HistoryItem, 'id' | 'is_favorite' | 'tags' | 'created_at'>): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: generateId(),
    is_favorite: false,
    tags: [],
    created_at: new Date().toISOString()
  };

  const history = getLocalHistory();
  const updated = [newItem, ...history].slice(0, MAX_LOCAL_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  updateLocalStats(item.mode);

  return newItem;
}

export function deleteLocalHistoryItem(id: string): void {
  const history = getLocalHistory().filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function toggleLocalFavorite(id: string): boolean {
  const history = getLocalHistory();
  const index = history.findIndex(item => item.id === id);
  if (index === -1) return false;

  history[index].is_favorite = !history[index].is_favorite;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history[index].is_favorite;
}

export function updateLocalTags(id: string, tags: string[]): void {
  const history = getLocalHistory();
  const index = history.findIndex(item => item.id === id);
  if (index === -1) return;

  history[index].tags = tags;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function searchLocalHistory(query: string, mode?: PromptMode): HistoryItem[] {
  const history = getLocalHistory();
  const q = query.toLowerCase();

  return history.filter(item => {
    const matchesMode = !mode || item.mode === mode;
    const matchesQuery = !q ||
      item.idea.toLowerCase().includes(q) ||
      item.prompt.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q));
    return matchesMode && matchesQuery;
  });
}

// =============================================
// STATS
// =============================================

function getDefaultStats(): UserStats {
  return {
    total_prompts: 0,
    prompts_by_mode: { code: 0, vibecode: 0, image: 0, video: 0 },
    streak_days: 0,
    last_active_date: '',
    most_used_mode: 'code'
  };
}

export function getLocalStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...getDefaultStats(), ...JSON.parse(raw) } : getDefaultStats();
  } catch {
    return getDefaultStats();
  }
}

function updateLocalStats(mode: PromptMode): void {
  const stats = getLocalStats();
  const today = new Date().toISOString().split('T')[0];

  stats.total_prompts += 1;
  stats.prompts_by_mode[mode] = (stats.prompts_by_mode[mode] || 0) + 1;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (stats.last_active_date === yesterday) {
    stats.streak_days += 1;
  } else if (stats.last_active_date !== today) {
    stats.streak_days = 1;
  }

  stats.last_active_date = today;

  // Recalculate most used mode
  const modeEntries = Object.entries(stats.prompts_by_mode) as [PromptMode, number][];
  stats.most_used_mode = modeEntries.reduce((a, b) => b[1] > a[1] ? b : a)[0];

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// =============================================
// TEMPLATES (built-in)
// =============================================

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  mode: PromptMode;
  idea: string;
  tags: string[];
}

export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  // CODE
  { id: 't1', title: 'API REST CRUD', description: 'Backend completo com operações CRUD', mode: 'code',
    idea: 'Crie uma API REST com endpoints CRUD para um recurso [nome], usando [framework], com validação, autenticação JWT e documentação Swagger.',
    tags: ['backend', 'api', 'rest'] },
  { id: 't2', title: 'Componente React', description: 'Componente reutilizável com TypeScript', mode: 'code',
    idea: 'Crie um componente React em TypeScript chamado [Nome] que [funcionalidade]. Inclua props bem tipadas, estados, efeitos e estilização com [CSS/Tailwind].',
    tags: ['frontend', 'react', 'typescript'] },
  { id: 't3', title: 'Script de Automação', description: 'Script Python para automatizar tarefas', mode: 'code',
    idea: 'Crie um script Python que [tarefa]. Inclua tratamento de erros, logging, argumentos de linha de comando e documentação inline.',
    tags: ['python', 'automation', 'script'] },

  // VIBECODE
  { id: 't4', title: 'SaaS Dashboard', description: 'App SaaS completo com auth e pagamento', mode: 'vibecode',
    idea: 'Crie um SaaS de [nicho] com dashboard, autenticação, planos de assinatura, área do cliente e painel admin. Stack: Next.js 15, Supabase, Stripe, Tailwind.',
    tags: ['saas', 'dashboard', 'nextjs'] },
  { id: 't5', title: 'App Mobile PWA', description: 'Progressive Web App para mobile', mode: 'vibecode',
    idea: 'Crie um PWA mobile-first para [propósito] com onboarding, notificações push, modo offline, câmera e compartilhamento nativo.',
    tags: ['pwa', 'mobile', 'offline'] },

  // IMAGE
  { id: 't6', title: 'Produto Premium', description: 'Foto de produto estilo comercial', mode: 'image',
    idea: 'Foto publicitária de [produto] em cenário minimalista, iluminação de produto profissional, fundo gradient suave, detalhes nítidos, estilo Apple/Samsung.',
    tags: ['product', 'commercial', 'advertising'] },
  { id: 't7', title: 'Retrato Cinematográfico', description: 'Retrato de pessoa com qualidade de filme', mode: 'image',
    idea: 'Retrato fotorrealista de [descrição da pessoa], iluminação Rembrandt, bokeh suave, profundidade de campo rasa, cores cinematográficas, 8K.',
    tags: ['portrait', 'cinematic', 'photography'] },
  { id: 't8', title: 'Arte Digital Conceitual', description: 'Ilustração conceitual artística', mode: 'image',
    idea: 'Ilustração digital de [conceito abstrato], estilo arte conceitual de videogame AAA, perspectiva dramática, paleta de cores [descrição], detalhes intrincados.',
    tags: ['art', 'concept', 'illustration'] },

  // VIDEO
  { id: 't9', title: 'Vídeo de Produto', description: 'Comercial de produto estilo Apple', mode: 'video',
    idea: 'Vídeo comercial de 15 segundos de [produto]: abre com close no produto girando lentamente, câmera se afasta revelando cenário premium, corte para destaque de features, logo final com tagline.',
    tags: ['commercial', 'product', 'advertising'] },
  { id: 't10', title: 'Cinematic Landscape', description: 'Vídeo de paisagem cinematográfica', mode: 'video',
    idea: 'Timelapse cinematográfico de [lugar/paisagem]: câmera drone movendo lentamente, golden hour, nuvens em movimento acelerado, cores vibrantes, 4K.',
    tags: ['landscape', 'cinematic', 'drone'] }
];
