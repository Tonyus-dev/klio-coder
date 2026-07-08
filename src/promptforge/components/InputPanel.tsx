import { useState, useRef, useEffect } from 'react';
import STTButton from './STTButton';
import type { PromptMode } from '../lib/promptForgeApi';
import type { PromptTemplate } from '../lib/offlineStorage';

interface InputPanelProps {
  idea: string;
  mode: PromptMode;
  isLoading: boolean;
  onIdeaChange: (val: string) => void;
  onGenerate: (count?: number) => void;
  onRemix: (existingPrompt: string) => void;
  onShowTemplates: () => void;
  templates?: PromptTemplate[];
}

const PLACEHOLDERS: Record<PromptMode, string> = {
  code: 'Ex: uma API REST para gerenciar tarefas com auth JWT e banco PostgreSQL...',
  vibecode: 'Ex: um app de finanças pessoais mobile-first com gráficos, metas e notificações...',
  image: 'Ex: um dragão de cristal voando sobre uma floresta cyberpunk ao anoitecer...',
  video: 'Ex: um timelapse de nascer do sol nas montanhas com câmera drone afastando lentamente...'
};

const MAX_CHARS = 1000;

export default function InputPanel({
  idea,
  mode,
  isLoading,
  onIdeaChange,
  onGenerate,
  onShowTemplates
}: InputPanelProps) {
  const [showVariations, setShowVariations] = useState(false);
  const [remixMode, setRemixMode] = useState(false);
  const [remixInput, setRemixInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 280)}px`;
  }, [idea]);

  const handleSTT = (text: string) => {
    onIdeaChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  const charsLeft = MAX_CHARS - idea.length;
  const isOverLimit = charsLeft < 0;

  return (
    <div className="pf-input-panel">
      {/* Header toolbar */}
      <div className="pf-input-toolbar">
        <div className="pf-input-toolbar-left">
          <span className="pf-input-label">
            💡 Descreva sua ideia
          </span>
          <button
            id="pf-btn-templates"
            className="pf-toolbar-btn"
            onClick={onShowTemplates}
            title="Ver templates"
          >
            📋 Templates
          </button>
        </div>
        <STTButton onTranscript={handleSTT} disabled={isLoading} />
      </div>

      {/* Textarea */}
      <div className="pf-textarea-wrapper">
        <textarea
          ref={textareaRef}
          id="pf-idea-input"
          className={`pf-textarea ${isOverLimit ? 'over-limit' : ''}`}
          value={idea}
          onChange={e => onIdeaChange(e.target.value.slice(0, MAX_CHARS + 50))}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[mode]}
          disabled={isLoading}
          rows={4}
        />
        <div className={`pf-char-count ${charsLeft < 100 ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}>
          {charsLeft < 0 ? `+${Math.abs(charsLeft)} acima do limite` : `${idea.length}/${MAX_CHARS}`}
        </div>
      </div>

      {/* Remix input */}
      {remixMode && (
        <div className="pf-remix-section">
          <label className="pf-input-label">🔀 Cole um prompt existente para remixar:</label>
          <textarea
            id="pf-remix-input"
            className="pf-textarea pf-remix-textarea"
            value={remixInput}
            onChange={e => setRemixInput(e.target.value)}
            placeholder="Cole aqui o prompt original que deseja remixar..."
            rows={3}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="pf-actions">
        <div className="pf-actions-left">
          <button
            id="pf-btn-remix-toggle"
            className={`pf-action-secondary ${remixMode ? 'active' : ''}`}
            onClick={() => setRemixMode(!remixMode)}
            title="Modo Remix"
          >
            🔀 Remix
          </button>
          <button
            id="pf-btn-variations-toggle"
            className={`pf-action-secondary ${showVariations ? 'active' : ''}`}
            onClick={() => setShowVariations(!showVariations)}
            title="Gerar variações"
          >
            ✨ Variações
          </button>
        </div>

        <div className="pf-actions-right">
          {showVariations ? (
            <div className="pf-variations-btns">
              {[2, 3].map(n => (
                <button
                  key={n}
                  id={`pf-btn-variations-${n}`}
                  className="pf-action-variation"
                  onClick={() => onGenerate(n)}
                  disabled={isLoading || (!idea.trim()) || isOverLimit}
                >
                  {n}x
                </button>
              ))}
            </div>
          ) : null}

          <button
            id="pf-btn-generate"
            className="pf-action-primary"
            onClick={() => onGenerate()}
            disabled={isLoading || (!idea.trim()) || isOverLimit}
          >
            {isLoading ? (
              <span className="pf-loading-dots">
                <span /><span /><span />
              </span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                Gerar Prompt
                <kbd>⌘↵</kbd>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="pf-shortcuts-hint">
        <span>⌘Enter: Gerar</span>
        <span>⌘M: Trocar modo</span>
        <span>⌘K: Limpar</span>
      </div>
    </div>
  );
}
