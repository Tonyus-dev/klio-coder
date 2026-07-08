import { useMemo } from 'react';
import { getLocalStats } from '../lib/offlineStorage';
import type { PromptMode } from '../lib/promptForgeApi';

const MODE_LABELS: Record<PromptMode, { label: string; emoji: string; color: string }> = {
  code:     { label: 'Código',    emoji: '⌨️', color: '#8B5CF6' },
  vibecode: { label: 'Vibe Code', emoji: '🚀', color: '#FF4C1F' },
  image:    { label: 'Imagem',    emoji: '🎨', color: '#F59E0B' },
  video:    { label: 'Vídeo',     emoji: '🎬', color: '#E50914' },
};

function StatCard({ label, value, sub, emoji }: { label: string; value: string | number; sub?: string; emoji: string }) {
  return (
    <div className="pf-stat-card">
      <div className="pf-stat-emoji">{emoji}</div>
      <div className="pf-stat-value">{value}</div>
      <div className="pf-stat-label">{label}</div>
      {sub && <div className="pf-stat-sub">{sub}</div>}
    </div>
  );
}

function ModeBar({ mode, count, total }: { mode: PromptMode; count: number; total: number }) {
  const { label, emoji, color } = MODE_LABELS[mode];
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="pf-mode-stat-row">
      <span className="pf-mode-stat-label">{emoji} {label}</span>
      <div className="pf-mode-stat-track">
        <div
          className="pf-mode-stat-fill"
          style={{ width: `${pct}%`, background: color, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      <span className="pf-mode-stat-count">{count}</span>
    </div>
  );
}

export default function StatsPage() {
  const stats = useMemo(() => getLocalStats(), []);
  const total = stats.total_prompts;
  const modes: PromptMode[] = ['code', 'vibecode', 'image', 'video'];

  const mostUsed = stats.most_used_mode;
  const { label: mostUsedLabel, emoji: mostUsedEmoji } = MODE_LABELS[mostUsed] || MODE_LABELS.code;

  function getStreakMessage(streak: number) {
    if (streak === 0) return 'Comece hoje!';
    if (streak < 3) return 'Bom começo!';
    if (streak < 7) return 'Você está pegando o ritmo!';
    if (streak < 14) return 'Impressionante!';
    return '🔥 Em chamas!';
  }

  return (
    <div className="pf-page pf-stats-page">
      <div className="pf-page-header">
        <a href="/forge" className="pf-back-btn">← Voltar</a>
        <h1 className="pf-page-title">📊 Suas Estatísticas</h1>
        <p className="pf-page-subtitle">Acompanhe sua evolução como Prompt Engineer</p>
      </div>

      {/* Summary cards */}
      <div className="pf-stats-grid">
        <StatCard emoji="⚡" label="Total de Prompts" value={total} sub="desde o início" />
        <StatCard
          emoji="🔥"
          label="Streak"
          value={`${stats.streak_days} dia${stats.streak_days !== 1 ? 's' : ''}`}
          sub={getStreakMessage(stats.streak_days)}
        />
        <StatCard
          emoji={mostUsedEmoji}
          label="Modo Favorito"
          value={mostUsedLabel}
          sub={`${stats.prompts_by_mode[mostUsed] || 0} prompts`}
        />
        <StatCard
          emoji="📅"
          label="Última atividade"
          value={stats.last_active_date
            ? new Date(stats.last_active_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            : '—'}
        />
      </div>

      {/* Mode breakdown */}
      <div className="pf-stats-section">
        <h2 className="pf-stats-section-title">Prompts por modo</h2>
        <div className="pf-stats-modes">
          {modes.map(m => (
            <ModeBar mode={m} count={stats.prompts_by_mode[m] || 0} total={total} />
          ))}
        </div>
      </div>

      {/* Level progress */}
      <div className="pf-stats-section">
        <h2 className="pf-stats-section-title">🎯 Nível com Klio</h2>
        <div className="pf-level-ladder">
          {[
            { min: 0,   label: 'Iniciante',   icon: '🌱' },
            { min: 5,   label: 'Aprendiz',    icon: '📖' },
            { min: 20,  label: 'Praticante',  icon: '⚡' },
            { min: 50,  label: 'Avançado',    icon: '🚀' },
            { min: 100, label: 'Expert',      icon: '🏆' },
          ].map((lvl, i) => {
            const reached = total >= lvl.min;
            return (
              <div key={i} className={`pf-level-step ${reached ? 'reached' : ''}`}>
                <span className="pf-level-icon">{lvl.icon}</span>
                <span className="pf-level-name">{lvl.label}</span>
                <span className="pf-level-req">{lvl.min}+ prompts</span>
              </div>
            );
          })}
        </div>
      </div>

      {total === 0 && (
        <div className="pf-stats-empty">
          <p>Ainda sem prompts gerados. <a href="/forge">Comece agora →</a></p>
        </div>
      )}
    </div>
  );
}
