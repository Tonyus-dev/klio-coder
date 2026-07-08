import { useState } from 'react';
import type { PromptMode } from '../lib/promptForgeApi';

interface VariationsPanelProps {
  variations: string[];
  mode: PromptMode;
  onSelect: (prompt: string) => void;
}

const MODE_EMOJI: Record<PromptMode, string> = {
  code: '⌨️',
  vibecode: '🚀',
  image: '🎨',
  video: '🎬'
};

export default function VariationsPanel({ variations, mode, onSelect }: VariationsPanelProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="pf-variations-panel">
      <div className="pf-variations-header">
        <span className="pf-variations-title">✨ {variations.length} Variações Geradas</span>
        <span className="pf-variations-hint">Escolha a que mais gostou</span>
      </div>

      <div className="pf-variations-list">
        {variations.map((v, i) => (
          <div
            key={i}
            className={`pf-variation-item ${expanded === i ? 'expanded' : ''}`}
          >
            <div
              className="pf-variation-header"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div className="pf-variation-label">
                <span className="pf-variation-num">{i + 1}</span>
                <span>{MODE_EMOJI[mode]} Variação {i + 1}</span>
              </div>
              <div className="pf-variation-controls">
                <button
                  id={`pf-variation-copy-${i}`}
                  className="pf-out-btn"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await navigator.clipboard.writeText(v);
                    const btn = e.currentTarget;
                    btn.textContent = '✓';
                    setTimeout(() => { btn.textContent = '📋'; }, 1500);
                  }}
                  title="Copiar"
                >
                  📋
                </button>
                <button
                  id={`pf-variation-select-${i}`}
                  className="pf-out-btn pf-out-btn-accent"
                  onClick={(e) => { e.stopPropagation(); onSelect(v); }}
                >
                  Usar esta →
                </button>
                <svg
                  className={`pf-variation-chevron ${expanded === i ? 'open' : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
            </div>

            {expanded === i && (
              <div className="pf-variation-body">
                <pre className="pf-output-pre">{v}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
