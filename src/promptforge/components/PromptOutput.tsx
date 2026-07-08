import { useState, useEffect, useRef } from 'react';
import { sharePrompt } from '../lib/promptForgeApi';
import type { PromptMode } from '../lib/promptForgeApi';

interface PromptOutputProps {
  prompt: string;
  mode: PromptMode;
  idea: string;
  isLoading: boolean;
  onRefine: () => void;
  onScore: () => void;
  onSave: (prompt: string) => void;
}

export default function PromptOutput({ prompt, mode, idea, isLoading, onRefine, onScore, onSave }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!prompt) {
      setDisplayText('');
      return;
    }

    setIsTyping(true);
    setDisplayText('');
    setShareUrl(null);

    let i = 0;
    const speed = prompt.length > 500 ? 4 : prompt.length > 200 ? 8 : 16;

    const tick = () => {
      if (i < prompt.length) {
        setDisplayText(prompt.slice(0, i + 1));
        i++;
        // Speed up after first 100 chars
        const delay = i < 20 ? 30 : speed;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setIsTyping(false);
      }
    };

    timerRef.current = setTimeout(tick, 50);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [prompt]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMarkdown = async () => {
    const md = `# Prompt — ${mode.toUpperCase()}\n\n**Ideia:** ${idea}\n\n---\n\n\`\`\`\n${prompt}\n\`\`\`\n\n*Gerado pelo PromptForge*`;
    await navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const result = await sharePrompt(prompt, mode, idea);
      const fullUrl = `${window.location.origin}${result.url}`;
      setShareUrl(fullUrl);
      await navigator.clipboard.writeText(fullUrl);
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    } finally {
      setSharing(false);
    }
  };

  if (!prompt && !isLoading) {
    return (
      <div className="pf-output-empty">
        <div className="pf-output-empty-icon">✨</div>
        <p>Seu prompt gerado vai aparecer aqui</p>
        <span>Descreva sua ideia e clique em "Gerar Prompt"</span>
      </div>
    );
  }

  return (
    <div className="pf-output-panel">
      {/* Header */}
      <div className="pf-output-header">
        <div className="pf-output-header-left">
          <span className="pf-output-badge" data-mode={mode}>
            {mode === 'code' && '⌨️'}
            {mode === 'vibecode' && '🚀'}
            {mode === 'image' && '🎨'}
            {mode === 'video' && '🎬'}
            {mode}
          </span>
          {isTyping && <span className="pf-typing-indicator">gerando...</span>}
        </div>

        <div className="pf-output-actions">
          <button id="pf-btn-copy" className="pf-out-btn" onClick={handleCopy} disabled={isTyping || isLoading} title="Copiar prompt">
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            )}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>

          <button id="pf-btn-copy-md" className="pf-out-btn" onClick={handleCopyMarkdown} disabled={isTyping || isLoading} title="Copiar como Markdown">
            {copiedMd ? '✓ .md' : '📝 .md'}
          </button>

          <button id="pf-btn-score" className="pf-out-btn" onClick={onScore} disabled={isTyping || isLoading} title="Avaliar prompt">
            📊 Score
          </button>

          <button id="pf-btn-refine" className="pf-out-btn pf-out-btn-accent" onClick={onRefine} disabled={isTyping || isLoading} title="Melhorar prompt">
            🔧 Refinar
          </button>

          <button id="pf-btn-share" className="pf-out-btn" onClick={handleShare} disabled={isTyping || isLoading || sharing} title="Compartilhar prompt">
            {sharing ? '...' : '🔗 Compartilhar'}
          </button>

          <button id="pf-btn-save" className="pf-out-btn pf-out-btn-save" onClick={() => onSave(prompt)} disabled={isTyping} title="Salvar no histórico">
            💾 Salvar
          </button>
        </div>
      </div>

      {/* Share URL feedback */}
      {shareUrl && (
        <div className="pf-share-url">
          <span>🔗 URL copiada:</span>
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">{shareUrl}</a>
        </div>
      )}

      {/* Prompt content */}
      <div className="pf-output-content">
        {isLoading && !displayText ? (
          <div className="pf-output-loading">
            <div className="pf-output-shimmer" />
            <div className="pf-output-shimmer pf-output-shimmer-sm" />
            <div className="pf-output-shimmer pf-output-shimmer-md" />
          </div>
        ) : (
          <pre className="pf-output-pre">
            {displayText}
            {isTyping && <span className="pf-cursor">▋</span>}
          </pre>
        )}
      </div>
    </div>
  );
}
