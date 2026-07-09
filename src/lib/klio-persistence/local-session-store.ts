import { KLIO_STORAGE_KEYS } from './config';
import type { KlioLocalPreferences, KlioSessionDraft, KlioMemoryCandidate } from './types';

// Local session store não é memória.
// Local session store não é Supabase.
// Local session store não é banco vetorial.
// Local session store serve apenas para preferências e rascunhos locais.

export function getLocalPreferences(): Partial<KlioLocalPreferences> {
  return {
    runtimeMode: (localStorage.getItem(KLIO_STORAGE_KEYS.runtimeMode) as any) || 'online',
    presencaRegime: (localStorage.getItem(KLIO_STORAGE_KEYS.presencaRegime) as any) || 'green',
    notaEfemera: localStorage.getItem(KLIO_STORAGE_KEYS.notaEfemera) || '',
    userNickname: localStorage.getItem(KLIO_STORAGE_KEYS.userNickname) || 'Ká',
    userPronouns: localStorage.getItem(KLIO_STORAGE_KEYS.userPronouns) || 'ele/dele',
    userPhoto: localStorage.getItem(KLIO_STORAGE_KEYS.userPhoto) || '',
    ollamaUrl: localStorage.getItem(KLIO_STORAGE_KEYS.ollamaUrl) || 'http://localhost:11434'
  };
}

export function setLocalPreference<K extends keyof KlioLocalPreferences>(key: K, value: KlioLocalPreferences[K]) {
  const storageKey = KLIO_STORAGE_KEYS[key];
  if (storageKey) {
    localStorage.setItem(storageKey, value);
  }
}

export function getSessionDraft(): KlioSessionDraft {
  try {
    const raw = localStorage.getItem(KLIO_STORAGE_KEYS.threadSummary);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function setSessionDraft(draft: KlioSessionDraft) {
  localStorage.setItem(KLIO_STORAGE_KEYS.threadSummary, JSON.stringify(draft));
}

export function getLocalMemoryCandidates(): KlioMemoryCandidate[] {
  try {
    const raw = localStorage.getItem(KLIO_STORAGE_KEYS.localMemoryCandidates);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function addLocalMemoryCandidate(candidate: Omit<KlioMemoryCandidate, 'id' | 'createdAt' | 'status' | 'source'>) {
  const candidates = getLocalMemoryCandidates();
  const newCandidate: KlioMemoryCandidate = {
    ...candidate,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'candidate',
    source: 'local_session'
  };
  candidates.push(newCandidate);
  localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(candidates));
  return newCandidate;
}

export function discardLocalMemoryCandidate(id: string) {
  const candidates = getLocalMemoryCandidates().filter(c => c.id !== id);
  localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(candidates));
}
