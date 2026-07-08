import { useState } from 'react';
import type { PromptTemplate } from '../lib/offlineStorage';
import { BUILT_IN_TEMPLATES } from '../lib/offlineStorage';
import type { PromptMode } from '../lib/promptForgeApi';

interface TemplateLibraryProps {
  currentMode: PromptMode;
  onSelect: (template: PromptTemplate) => void;
  onClose: () => void;
}

const MODE_LABELS: Record<PromptMode, string> = {
  code: '⌨️ Código',
  vibecode: '🚀 Vibe Code',
  image: '🎨 Imagem',
  video: '🎬 Vídeo'
};

const MODES: PromptMode[] = ['code', 'vibecode', 'image', 'video'];

export default function TemplateLibrary({ currentMode, onSelect, onClose }: TemplateLibraryProps) {
  const [filter, setFilter] = useState<PromptMode | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = BUILT_IN_TEMPLATES.filter(t => {
    const matchMode = filter === 'all' || t.mode === filter;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    return matchMode && matchSearch;
  });

  return (
    <div className="pf-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal pf-templates-modal">
        <div className="pf-modal-header">
          <div>
            <h2 className="pf-modal-title">📋 Templates</h2>
            <p className="pf-modal-subtitle">Ponto de partida para seus prompts</p>
          </div>
          <button id="pf-templates-close" className="pf-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Search & filters */}
        <div className="pf-templates-controls">
          <input
            id="pf-templates-search"
            className="pf-templates-search"
            type="text"
            placeholder="Buscar templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="pf-templates-filters">
            <button
              className={`pf-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            {MODES.map(mode => (
              <button
                key={mode}
                className={`pf-filter-btn ${filter === mode ? 'active' : ''}`}
                onClick={() => setFilter(mode)}
              >
                {MODE_LABELS[mode]}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        <div className="pf-templates-grid">
          {filtered.length === 0 ? (
            <div className="pf-templates-empty">Nenhum template encontrado.</div>
          ) : (
            filtered.map(template => (
              <button
                key={template.id}
                id={`pf-template-${template.id}`}
                className="pf-template-card"
                data-mode={template.mode}
                onClick={() => { onSelect(template); onClose(); }}
              >
                <div className="pf-template-mode-badge">{MODE_LABELS[template.mode]}</div>
                <h3 className="pf-template-title">{template.title}</h3>
                <p className="pf-template-desc">{template.description}</p>
                <div className="pf-template-tags">
                  {template.tags.map(tag => (
                    <span key={tag} className="pf-template-tag">#{tag}</span>
                  ))}
                </div>
                <div className="pf-template-preview">{template.idea.slice(0, 80)}...</div>
                <div className="pf-template-use">Usar template →</div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
