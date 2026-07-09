export type KlioRuntimeMode = 'online' | 'local';

export type KlioMemoryLevel =
  | 'iconic'
  | 'echoic'
  | 'short_term'
  | 'working'
  | 'prospective'
  | 'episodic'
  | 'semantic'
  | 'procedural';

export type KlioReviewStatus =
  | 'draft'
  | 'candidate'
  | 'em_revisao'
  | 'confirmed'
  | 'discarded'
  | 'archived';

export interface KlioLocalPreferences {
  runtimeMode: KlioRuntimeMode;
  presencaRegime: 'green' | 'yellow' | 'blue' | 'red';
  notaEfemera: string;
  userNickname: string;
  userPronouns: string;
  userPhoto: string;
  ollamaUrl: string;
}

export interface KlioSessionDraft {
  threadSummary?: string;
  currentGoal?: string;
  lastDecision?: string;
  openLoops?: string;
  toneHint?: string;
}

export interface KlioMemoryCandidate {
  id: string;
  text: string;
  level: KlioMemoryLevel;
  status: KlioReviewStatus;
  createdAt: string;
  source: 'local_session';
}
