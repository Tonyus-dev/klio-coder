import { useState, useCallback, useEffect } from 'react';
import ModeSelector from '../components/ModeSelector';
import InputPanel from '../components/InputPanel';
import PromptOutput from '../components/PromptOutput';
import VariationsPanel from '../components/VariationsPanel';
import PromptScore from '../components/PromptScore';
import RefinementPanel from '../components/RefinementPanel';
import TemplateLibrary from '../components/TemplateLibrary';
import KlioPanel from '../components/KlioPanel';
import HistoryPanel from '../components/HistoryPanel';
import { generatePrompt, generateVariations, scorePrompt } from '../lib/promptForgeApi';
import { saveToLocalHistory, type HistoryItem } from '../lib/offlineStorage';
import type { PromptMode } from '../lib/promptForgeApi';

export default function ForgePage() {
  const [mode, setMode] = useState<PromptMode>('vibecode');
  const [idea, setIdea] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [variations, setVariations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showScore, setShowScore] = useState(false);
  const [scoreData, setScoreData] = useState<{overall:number;clarity:number;specificity:number;creativity:number;completeness:number;suggestions:string[];error?:string} | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  const [showRefine, setShowRefine] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  // Engine Settings
  const [localMode, setLocalMode] = useState<boolean>(() => localStorage.getItem('Klio_promptforge_local_mode') === 'true');
  const [ollamaModel, setOllamaModel] = useState<string>(() => localStorage.getItem('Klio_ollama_model') || 'qwen2.5:1.5b');
  const [ollamaUrl, setOllamaUrl] = useState<string>(() => localStorage.getItem('Klio_ollama_url') || 'http://localhost:11434');

  useEffect(() => {
    localStorage.setItem('Klio_promptforge_local_mode', localMode.toString());
  }, [localMode]);

  useEffect(() => {
    localStorage.setItem('Klio_ollama_model', ollamaModel);
  }, [ollamaModel]);

  useEffect(() => {
    localStorage.setItem('Klio_ollama_url', ollamaUrl);
  }, [ollamaUrl]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') { e.preventDefault(); handleGenerate(); }
        if (e.key === 'm') { e.preventDefault(); cycleMode(); }
        if (e.key === 'k') { e.preventDefault(); setIdea(''); setGeneratedPrompt(''); setVariations([]); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [idea, mode]);

  function cycleMode() {
    const modes: PromptMode[] = ['code', 'vibecode', 'image', 'video'];
    const idx = modes.indexOf(mode);
    setMode(modes[(idx + 1) % modes.length]);
  }

  const handleGenerate = useCallback(async (count = 1) => {
    if (!idea.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    setVariations([]);
    setShowScore(false);
    setScoreData(null);

    try {
      if (count > 1) {
        const result = await generateVariations(idea, mode, count);
        if (result.variations?.length) {
          setVariations(result.variations);
          setGeneratedPrompt(result.variations[0]);
        }
      } else {
        const result = await generatePrompt(idea, mode);
        if (result.prompt) {
          setGeneratedPrompt(result.prompt);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar prompt. Verifique a API configurada.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, mode, isLoading]);

  const handleScore = useCallback(async () => {
    if (!generatedPrompt) return;
    setShowScore(true);
    setScoreLoading(true);
    setScoreData(null);
    try {
      const result = await scorePrompt(generatedPrompt, mode);
      setScoreData(result.score);
    } catch {
      setScoreData({ overall: 0, clarity: 0, specificity: 0, creativity: 0, completeness: 0, suggestions: [], error: 'Falha ao avaliar.' });
    } finally {
      setScoreLoading(false);
    }
  }, [generatedPrompt, mode]);

  const handleSave = useCallback((prompt: string) => {
    if (!prompt || !idea) return;
    saveToLocalHistory({ idea, mode, prompt });
    setHistoryRefreshKey(k => k + 1);
    // Small visual feedback
    const btn = document.getElementById('pf-btn-save');
    if (btn) {
      btn.textContent = '✓ Salvo!';
      setTimeout(() => { if (btn) btn.textContent = '💾 Salvar'; }, 2000);
    }
  }, [idea, mode]);

  const handleReloadFromHistory = useCallback((item: HistoryItem) => {
    setIdea(item.idea);
    setMode(item.mode);
    setGeneratedPrompt(item.prompt);
    setVariations([]);
  }, []);

  return (
    <div className="pf-forge-page">
      {/* Top bar */}
      <div className="pf-forge-topbar">
        <div className="pf-forge-topbar-left">
          <span className="pf-forge-logo">⚡ PromptForge</span>
          <span className="pf-forge-tagline">Crie prompts perfeitos com IA</span>
        </div>
        <div className="pf-forge-topbar-right">
          <button
            id="pf-nav-history"
            className="pf-nav-btn"
            onClick={() => setShowHistory(true)}
            title="Histórico"
          >
            🕐 Histórico
          </button>
          
          <div className="flex items-center gap-2 bg-[#1A1C23] px-2 py-1 rounded border border-[#2A2D35]">
            <label className="text-xs text-[#A89F96] flex items-center gap-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={localMode} 
                onChange={(e) => setLocalMode(e.target.checked)} 
                className="rounded bg-[#06070A] border-[#2A2D35] text-[#FF4C1F] focus:ring-[#FF4C1F]/30"
              />
              Local (Ollama)
            </label>
            {localMode && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ollamaUrl}
                  onChange={(e) => setOllamaUrl(e.target.value)}
                  placeholder="http://localhost:11434"
                  className="bg-[#06070A] text-[#F7EFE7] text-xs border border-[#2A2D35] rounded px-2 py-0.5 outline-none focus:border-[#FF4C1F] w-32"
                  title="Ollama URL"
                />
                <select
                  value={ollamaModel}
                  onChange={(e) => setOllamaModel(e.target.value)}
                  className="bg-[#06070A] text-[#F7EFE7] text-xs border border-[#2A2D35] rounded px-1 py-0.5 outline-none focus:border-[#FF4C1F]"
                >
                  <option value="qwen2.5:1.5b">qwen2.5:1.5b (Leve)</option>
                  <option value="qwen2.5:3b">qwen2.5:3b (Econômico)</option>
                  <option value="qwen2.5:latest">qwen2.5:latest (Completo)</option>
                </select>
              </div>
            )}
          </div>

          <a href="/forge/stats" className="pf-nav-btn" id="pf-nav-stats">📊 Stats</a>
          <a href="/forge/feed" className="pf-nav-btn" id="pf-nav-feed">🌐 Feed</a>
        </div>
      </div>

      {/* Main content */}
      <div className="pf-forge-main">
        {/* Left column: input */}
        <div className="pf-forge-col pf-forge-col-input">
          <ModeSelector selected={mode} onChange={m => { setMode(m); setGeneratedPrompt(''); setVariations([]); }} />
          <InputPanel
            idea={idea}
            mode={mode}
            isLoading={isLoading}
            onIdeaChange={setIdea}
            onGenerate={handleGenerate}
            onRemix={() => {}}
            onShowTemplates={() => setShowTemplates(true)}
          />
          {error && (
            <div className="pf-error-banner">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Right column: output + Klio */}
        <div className="pf-forge-col pf-forge-col-output">
          {variations.length > 1 ? (
            <VariationsPanel
              variations={variations}
              mode={mode}
              onSelect={p => { setGeneratedPrompt(p); setVariations([]); }}
            />
          ) : (
            <PromptOutput
              prompt={generatedPrompt}
              mode={mode}
              idea={idea}
              isLoading={isLoading}
              onRefine={() => setShowRefine(true)}
              onScore={handleScore}
              onSave={handleSave}
            />
          )}

          {/* Score panel (appears below output) */}
          {showScore && (
            <PromptScore
              score={scoreData}
              isLoading={scoreLoading}
              onClose={() => setShowScore(false)}
            />
          )}

          {/* Klio — only in Vibe Code mode */}
          <KlioPanel
            currentPrompt={generatedPrompt}
            currentIdea={idea}
            isVisible={mode === 'vibecode'}
          />
        </div>
      </div>

      {/* Modals */}
      {showTemplates && (
        <TemplateLibrary
          currentMode={mode}
          onSelect={t => { setIdea(t.idea); setMode(t.mode); }}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showRefine && generatedPrompt && (
        <RefinementPanel
          currentPrompt={generatedPrompt}
          mode={mode}
          idea={idea}
          onRefined={p => { setGeneratedPrompt(p); setVariations([]); }}
          onClose={() => setShowRefine(false)}
        />
      )}

      {showHistory && (
        <HistoryPanel
          onReload={handleReloadFromHistory}
          onClose={() => setShowHistory(false)}
          refreshKey={historyRefreshKey}
        />
      )}
    </div>
  );
}
