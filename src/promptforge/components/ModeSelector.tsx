import type { PromptMode } from '../lib/promptForgeApi';

interface Mode {
  id: PromptMode;
  label: string;
  emoji: string;
  description: string;
  color: string;
  glow: string;
  gradient: string;
}

const MODES: Mode[] = [
  {
    id: 'code',
    label: 'Código',
    emoji: '⌨️',
    description: 'Para IAs de código como Claude, GPT, Gemini',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.4)',
    gradient: 'linear-gradient(135deg, #4C1D95, #7C3AED)'
  },
  {
    id: 'vibecode',
    label: 'Vibe Code',
    emoji: '🚀',
    description: 'Especificações completas de apps para IA construir',
    color: '#FF4C1F',
    glow: 'rgba(255,76,31,0.4)',
    gradient: 'linear-gradient(135deg, #7C1D0C, #DC2626)'
  },
  {
    id: 'image',
    label: 'Imagem',
    emoji: '🎨',
    description: 'Para Midjourney, DALL-E, Flux, Stable Diffusion',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.4)',
    gradient: 'linear-gradient(135deg, #78350F, #D97706)'
  },
  {
    id: 'video',
    label: 'Vídeo',
    emoji: '🎬',
    description: 'Para Sora, Kling, Runway, Pika',
    color: '#E50914',
    glow: 'rgba(229,9,20,0.4)',
    gradient: 'linear-gradient(135deg, #7F1D1D, #B91C1C)'
  }
];

interface ModeSelectorProps {
  selected: PromptMode;
  onChange: (mode: PromptMode) => void;
}

export default function ModeSelector({ selected, onChange }: ModeSelectorProps) {
  return (
    <div className="pf-mode-selector">
      {MODES.map(mode => {
        const isActive = selected === mode.id;
        return (
          <button
            key={mode.id}
            id={`pf-mode-${mode.id}`}
            onClick={() => onChange(mode.id)}
            className="pf-mode-card"
            data-active={isActive}
            style={{
              '--mode-color': mode.color,
              '--mode-glow': mode.glow,
              '--mode-gradient': mode.gradient,
            } as React.CSSProperties}
          >
            <div className="pf-mode-icon">{mode.emoji}</div>
            <div className="pf-mode-content">
              <span className="pf-mode-label">{mode.label}</span>
              <span className="pf-mode-desc">{mode.description}</span>
            </div>
            {isActive && <div className="pf-mode-active-dot" />}
          </button>
        );
      })}
    </div>
  );
}

export { MODES };
