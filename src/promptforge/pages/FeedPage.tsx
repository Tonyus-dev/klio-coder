import { useState, useEffect } from 'react';
import type { PromptMode } from '../lib/promptForgeApi';

interface PublicPrompt {
  id: string;
  prompt: string;
  mode: PromptMode;
  idea?: string;
  upvotes: number;
  views: number;
  created_at: string;
  user_voted?: boolean;
}

const MODE_LABELS: Record<PromptMode, { label: string; emoji: string; color: string }> = {
  code:     { label: 'Código',    emoji: '⌨️', color: '#8B5CF6' },
  vibecode: { label: 'Vibe Code', emoji: '🚀', color: '#FF4C1F' },
  image:    { label: 'Imagem',    emoji: '🎨', color: '#F59E0B' },
  video:    { label: 'Vídeo',     emoji: '🎬', color: '#E50914' },
};

// Mock data for display when Supabase not configured
const MOCK_PROMPTS: PublicPrompt[] = [
  {
    id: 'mock1', mode: 'vibecode', upvotes: 42, views: 187, created_at: new Date().toISOString(),
    idea: 'App de gestão financeira pessoal',
    prompt: `Crie um app mobile-first de gestão financeira chamado "Fluxo" com as seguintes especificações:\n\n**Stack:** Next.js 15, Supabase, Tailwind CSS, Recharts\n**Auth:** Supabase Auth com Google OAuth\n\n**Funcionalidades principais:**\n- Dashboard com gráfico de gastos por categoria (donut chart)\n- Registro rápido de transações via swipe\n- Metas mensais com progresso visual\n- Relatórios exportáveis em PDF\n- Modo offline com sync automático\n\n**Design:** Dark mode com cores vibrantes por categoria. Tipografia Inter. Micro-animações em todas as interações.`
  },
  {
    id: 'mock2', mode: 'image', upvotes: 31, views: 94, created_at: new Date(Date.now() - 86400000).toISOString(),
    idea: 'Retrato futurista de cidade',
    prompt: `Futuristic cyberpunk cityscape at golden hour, towering neon-lit skyscrapers reflected in rain-soaked streets, flying vehicles leaving light trails, atmospheric fog and steam from vents, ultra-detailed, 8K resolution, cinematic color grading, shot with Hasselblad, f/2.8, bokeh foreground elements, style of Blade Runner 2049 --ar 16:9 --q 2`
  },
  {
    id: 'mock3', mode: 'code', upvotes: 28, views: 73, created_at: new Date(Date.now() - 172800000).toISOString(),
    idea: 'Sistema de auth com JWT',
    prompt: `Implemente um sistema completo de autenticação em Node.js/TypeScript com:\n\n**Requisitos:**\n- JWT access token (15min) + refresh token (7 dias) com rotação automática\n- Hash de senha com bcrypt (rounds: 12)\n- Rate limiting por IP (5 tentativas/15min)\n- Middleware de autorização por roles (admin, user, guest)\n- Blacklist de tokens revogados via Redis\n\n**Endpoints:** POST /auth/register, /auth/login, /auth/refresh, /auth/logout\n\n**Extras:** Logs de auditoria, validação Zod, testes Jest com cobertura >80%\n\nUse padrão Repository. Documente com JSDoc.`
  },
];

type SortBy = 'recent' | 'votes' | 'views';
type FilterMode = PromptMode | 'all';

export default function FeedPage() {
  const [prompts, setPrompts] = useState<PublicPrompt[]>(MOCK_PROMPTS);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<SortBy>('votes');
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Load voted IDs from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pf_voted') || '[]');
      setVotedIds(new Set(saved));
    } catch {}
  }, []);

  const filtered = prompts
    .filter(p => filter === 'all' || p.mode === filter)
    .sort((a, b) => {
      if (sortBy === 'votes') return b.upvotes - a.upvotes;
      if (sortBy === 'views') return b.views - a.views;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  function handleVote(id: string) {
    const alreadyVoted = votedIds.has(id);
    const newVoted = new Set(votedIds);

    setPrompts(prev => prev.map(p =>
      p.id === id ? { ...p, upvotes: p.upvotes + (alreadyVoted ? -1 : 1) } : p
    ));

    if (alreadyVoted) {
      newVoted.delete(id);
    } else {
      newVoted.add(id);
    }
    setVotedIds(newVoted);
    localStorage.setItem('pf_voted', JSON.stringify([...newVoted]));
  }

  async function handleCopy(prompt: string, id: string) {
    await navigator.clipboard.writeText(prompt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `há ${d} dia${d > 1 ? 's' : ''}`;
    if (h > 0) return `há ${h}h`;
    return 'agora';
  }

  const MODES: FilterMode[] = ['all', 'code', 'vibecode', 'image', 'video'];

  return (
    <div className="pf-page pf-feed-page">
      <div className="pf-page-header">
        <a href="/forge" className="pf-back-btn">← Voltar</a>
        <h1 className="pf-page-title">🌐 Feed da Comunidade</h1>
        <p className="pf-page-subtitle">Os melhores prompts gerados pela comunidade</p>
      </div>

      {/* Controls */}
      <div className="pf-feed-controls">
        <div className="pf-history-filters">
          {MODES.map(m => (
            <button
              key={m}
              className={`pf-filter-btn ${filter === m ? 'active' : ''}`}
              onClick={() => setFilter(m)}
            >
              {m === 'all' ? 'Todos' : `${MODE_LABELS[m as PromptMode].emoji} ${MODE_LABELS[m as PromptMode].label}`}
            </button>
          ))}
        </div>
        <div className="pf-feed-sort">
          <span className="pf-sort-label">Ordenar:</span>
          {(['votes', 'recent', 'views'] as SortBy[]).map(s => (
            <button
              key={s}
              className={`pf-sort-btn ${sortBy === s ? 'active' : ''}`}
              onClick={() => setSortBy(s)}
            >
              {s === 'votes' ? '🔥 Votos' : s === 'recent' ? '🕐 Recentes' : '👁 Views'}
            </button>
          ))}
        </div>
      </div>

      {/* Feed note */}
      <div className="pf-feed-note">
        💡 Feed mostra exemplos da comunidade. Configure Supabase para ver prompts reais compartilhados.
      </div>

      {/* Cards */}
      <div className="pf-feed-list">
        {filtered.map(p => {
          const modeInfo = MODE_LABELS[p.mode];
          const isExpanded = expandedId === p.id;
          const isVoted = votedIds.has(p.id);

          return (
            <div key={p.id} className="pf-feed-card" data-mode={p.mode}>
              {/* Card header */}
              <div className="pf-feed-card-header">
                <span className="pf-output-badge" data-mode={p.mode}>
                  {modeInfo.emoji} {modeInfo.label}
                </span>
                <span className="pf-feed-time">{timeAgo(p.created_at)}</span>
              </div>

              {/* Idea */}
              {p.idea && <p className="pf-feed-idea">💡 {p.idea}</p>}

              {/* Prompt preview */}
              <div
                className={`pf-feed-prompt-preview ${isExpanded ? 'expanded' : ''}`}
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                <pre className="pf-output-pre pf-feed-pre">
                  {isExpanded ? p.prompt : p.prompt.slice(0, 200) + (p.prompt.length > 200 ? '...' : '')}
                </pre>
                {p.prompt.length > 200 && (
                  <button className="pf-feed-expand-btn">
                    {isExpanded ? '▲ Menos' : '▼ Ver tudo'}
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="pf-feed-card-actions">
                <button
                  id={`pf-feed-vote-${p.id}`}
                  className={`pf-feed-vote-btn ${isVoted ? 'voted' : ''}`}
                  onClick={() => handleVote(p.id)}
                >
                  {isVoted ? '▲' : '△'} {p.upvotes}
                </button>
                <span className="pf-feed-views">👁 {p.views}</span>
                <button
                  id={`pf-feed-copy-${p.id}`}
                  className="pf-out-btn"
                  onClick={() => handleCopy(p.prompt, p.id)}
                >
                  {copied === p.id ? '✓ Copiado' : '📋 Copiar'}
                </button>
                <a href="/forge" className="pf-out-btn pf-out-btn-accent">
                  ✨ Usar como base
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
