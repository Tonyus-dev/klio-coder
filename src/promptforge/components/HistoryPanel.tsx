import { useState, useMemo } from 'react';
import {
  getLocalHistory,
  deleteLocalHistoryItem,
  toggleLocalFavorite,
  updateLocalTags,
  searchLocalHistory,
  type HistoryItem
} from '../lib/offlineStorage';
import type { PromptMode } from '../lib/promptForgeApi';

interface HistoryPanelProps {
  onReload: (item: HistoryItem) => void;
  onClose: () => void;
  refreshKey?: number;
}

const MODE_LABELS: Record<PromptMode, string> = {
  code: '⌨️',
  vibecode: '🚀',
  image: '🎨',
  video: '🎬'
};

const MODES: Array<PromptMode | 'all'> = ['all', 'code', 'vibecode', 'image', 'video'];

function TagEditor({ tags, onSave }: { tags: string[]; onSave: (tags: string[]) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(tags.join(', '));

  if (!editing) {
    return (
      <div className="pf-history-tags" onClick={() => setEditing(true)}>
        {tags.length > 0
          ? tags.map(t => <span key={t} className="pf-tag">#{t}</span>)
          : <span className="pf-tag-add">+ tag</span>}
      </div>
    );
  }

  return (
    <input
      className="pf-tag-input"
      autoFocus
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={() => {
        const newTags = value.split(',').map(t => t.trim()).filter(Boolean);
        onSave(newTags);
        setEditing(false);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') setEditing(false);
      }}
      placeholder="tag1, tag2, tag3"
    />
  );
}

export default function HistoryPanel({ onReload, onClose, refreshKey }: HistoryPanelProps) {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState<PromptMode | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [, forceRefresh] = useState(0);

  const history = useMemo(() => {
    let items = searchLocalHistory(search, modeFilter === 'all' ? undefined : modeFilter);
    if (showFavoritesOnly) items = items.filter(i => i.is_favorite);
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, modeFilter, showFavoritesOnly, refreshKey, forceRefresh]);

  const handleDelete = (id: string) => {
    deleteLocalHistoryItem(id);
    forceRefresh(n => n + 1);
  };

  const handleFavorite = (id: string) => {
    toggleLocalFavorite(id);
    forceRefresh(n => n + 1);
  };

  const handleTagSave = (id: string, tags: string[]) => {
    updateLocalTags(id, tags);
    forceRefresh(n => n + 1);
  };

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="pf-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="pf-modal pf-history-modal">
        <div className="pf-modal-header">
          <div>
            <h2 className="pf-modal-title">🕐 Histórico</h2>
            <p className="pf-modal-subtitle">{history.length} prompt{history.length !== 1 ? 's' : ''}</p>
          </div>
          <button id="pf-history-close" className="pf-modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Controls */}
        <div className="pf-history-controls">
          <input
            id="pf-history-search"
            className="pf-templates-search"
            type="text"
            placeholder="Buscar por ideia, prompt ou tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="pf-history-filters">
            {MODES.map(mode => (
              <button
                key={mode}
                className={`pf-filter-btn ${modeFilter === mode ? 'active' : ''}`}
                onClick={() => setModeFilter(mode)}
              >
                {mode === 'all' ? 'Todos' : `${MODE_LABELS[mode as PromptMode]} ${mode}`}
              </button>
            ))}
            <button
              className={`pf-filter-btn pf-filter-fav ${showFavoritesOnly ? 'active' : ''}`}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              ⭐ Favoritos
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="pf-history-list">
          {history.length === 0 ? (
            <div className="pf-history-empty">
              <div>📭</div>
              <p>{search || showFavoritesOnly ? 'Nenhum resultado encontrado.' : 'Nenhum prompt no histórico ainda.'}</p>
            </div>
          ) : (
            history.map(item => (
              <div key={item.id} className="pf-history-item" data-mode={item.mode}>
                <div className="pf-history-item-header">
                  <span className="pf-history-mode-badge">{MODE_LABELS[item.mode]} {item.mode}</span>
                  <span className="pf-history-date">{formatDate(item.created_at)}</span>
                </div>

                <p className="pf-history-idea">💡 {item.idea}</p>
                <p className="pf-history-prompt-preview">{item.prompt.slice(0, 120)}...</p>

                <TagEditor tags={item.tags} onSave={tags => handleTagSave(item.id, tags)} />

                <div className="pf-history-actions">
                  <button
                    id={`pf-history-fav-${item.id}`}
                    className={`pf-history-btn ${item.is_favorite ? 'active-fav' : ''}`}
                    onClick={() => handleFavorite(item.id)}
                    title="Favoritar"
                  >
                    {item.is_favorite ? '⭐' : '☆'}
                  </button>
                  <button
                    id={`pf-history-reload-${item.id}`}
                    className="pf-history-btn"
                    onClick={() => { onReload(item); onClose(); }}
                    title="Carregar prompt"
                  >
                    🔁 Recarregar
                  </button>
                  <button
                    id={`pf-history-delete-${item.id}`}
                    className="pf-history-btn pf-history-btn-delete"
                    onClick={() => handleDelete(item.id)}
                    title="Deletar"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
