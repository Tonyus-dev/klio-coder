import { useState } from 'react';
import type { PromptMode } from '../lib/promptForgeApi';

interface ScoreData {
  overall: number;
  clarity: number;
  specificity: number;
  creativity: number;
  completeness: number;
  suggestions: string[];
  error?: string;
}

interface PromptScoreProps {
  score: ScoreData | null;
  isLoading: boolean;
  onClose: () => void;
}

const SCORE_LABELS: Record<keyof Omit<ScoreData, 'suggestions' | 'overall' | 'error'>, string> = {
  clarity: 'Clareza',
  specificity: 'Especificidade',
  creativity: 'Criatividade',
  completeness: 'Completude'
};

function ScoreRing({ value, size = 80 }: { value: number; size?: number }) {
  const r = (size / 2) - 8;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 80 ? '#22C55E' : value >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="pf-score-ring">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="16" fontWeight="700">
        {value}
      </text>
    </svg>
  );
}

function MiniBar({ value, label }: { value: number; label: string }) {
  const color = value >= 80 ? '#22C55E' : value >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="pf-mini-bar-row">
      <span className="pf-mini-bar-label">{label}</span>
      <div className="pf-mini-bar-track">
        <div
          className="pf-mini-bar-fill"
          style={{ width: `${value}%`, background: color, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </div>
      <span className="pf-mini-bar-value" style={{ color }}>{value}</span>
    </div>
  );
}

export default function PromptScore({ score, isLoading, onClose }: PromptScoreProps) {
  if (!score && !isLoading) return null;

  return (
    <div className="pf-score-panel">
      <div className="pf-score-header">
        <span className="pf-score-title">📊 Score do Prompt</span>
        <button id="pf-score-close" className="pf-score-close" onClick={onClose}>✕</button>
      </div>

      {isLoading ? (
        <div className="pf-score-loading">
          <div className="pf-score-shimmer" />
          <div className="pf-score-shimmer pf-score-shimmer-sm" />
        </div>
      ) : score?.error ? (
        <div className="pf-score-error">Falha ao avaliar prompt. Tente novamente.</div>
      ) : score ? (
        <div className="pf-score-content">
          {/* Overall ring */}
          <div className="pf-score-overall">
            <ScoreRing value={score.overall} size={90} />
            <div className="pf-score-overall-label">
              <span className="pf-score-overall-text">Score Geral</span>
              <span className="pf-score-overall-grade">
                {score.overall >= 90 ? '🏆 Excelente' :
                  score.overall >= 75 ? '✅ Bom' :
                  score.overall >= 60 ? '⚡ Médio' : '🔧 Precisa melhorar'}
              </span>
            </div>
          </div>

          {/* Dimension bars */}
          <div className="pf-score-dims">
            {(Object.keys(SCORE_LABELS) as Array<keyof typeof SCORE_LABELS>).map(key => (
              <MiniBar key={key} value={score[key]} label={SCORE_LABELS[key]} />
            ))}
          </div>

          {/* Suggestions */}
          {score.suggestions?.length > 0 && (
            <div className="pf-score-suggestions">
              <span className="pf-score-suggestions-title">💡 Sugestões de melhoria</span>
              <ul className="pf-score-suggestions-list">
                {score.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
