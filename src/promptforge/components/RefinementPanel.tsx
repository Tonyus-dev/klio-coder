import { useState } from 'react';
import { refinePrompt } from '../lib/promptForgeApi';
import type { PromptMode } from '../lib/promptForgeApi';

interface RefinementPanelProps {
  currentPrompt: string;
  mode: PromptMode;
  idea: string;
  onRefined: (newPrompt: string) => void;
  onClose: () => void;
}

const QUICK_REFINEMENTS = [
  'Deixe mais técnico e detalhado',
  'Simplifique a linguagem',
  'Adicione mais contexto de negócio',
  'Torne mais criativo e único',
  'Adicione restrições e edge cases',
  'Foque em performance e escalabilidade',
  'Adapte para iniciantes',
  'Adicione exemplos concretos',
];

export default function RefinementPanel({ currentPrompt, mode, idea, onRefined, onClose }: RefinementPanelProps) {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefine = async (inst: string) => {
    if (!inst.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await refinePrompt(currentPrompt, inst, mode, idea);
      if (result.prompt) {
        onRefined(result.prompt);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao refinar prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pf-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal pf-refine-modal">
        <div className="pf-modal-header">
          <div>
            <h2 className="pf-modal-title">🔧 Refinar Prompt</h2>
            <p className="pf-modal-subtitle">Diga como melhorar o prompt gerado</p>
          </div>
          <button id="pf-refine-close" className="pf-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Quick options */}
        <div className="pf-refine-quick">
          <span className="pf-refine-quick-label">Refinamentos rápidos:</span>
          <div className="pf-refine-chips">
            {QUICK_REFINEMENTS.map(q => (
              <button
                key={q}
                className="pf-refine-chip"
                onClick={() => handleRefine(q)}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="pf-refine-divider">ou escreva sua instrução</div>

        {/* Custom instruction */}
        <div className="pf-refine-custom">
          <textarea
            id="pf-refine-instruction"
            className="pf-textarea"
            value={instruction}
            onChange={e => setInstruction(e.target.value)}
            placeholder="Ex: adicione considerações de acessibilidade e internacionalização..."
            rows={3}
            disabled={isLoading}
          />
          {error && <div className="pf-error-msg">{error}</div>}
          <button
            id="pf-btn-refine-apply"
            className="pf-action-primary"
            onClick={() => handleRefine(instruction)}
            disabled={isLoading || !instruction.trim()}
          >
            {isLoading ? (
              <span className="pf-loading-dots"><span /><span /><span /></span>
            ) : (
              '✨ Aplicar refinamento'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
