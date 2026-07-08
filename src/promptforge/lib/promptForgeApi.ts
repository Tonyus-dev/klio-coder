// PromptForge — API Client
// All calls go through Cloudflare Functions (server-side API keys)

export type PromptMode = 'code' | 'vibecode' | 'image' | 'video';

export interface GenerateResult {
  prompt?: string;
  variations?: string[];
  model_used: string;
}

export interface ScoreResult {
  score: {
    overall: number;
    clarity: number;
    specificity: number;
    creativity: number;
    completeness: number;
    suggestions: string[];
    error?: string;
  };
  model_used: string;
}

export interface ShareResult {
  id: string;
  url: string;
  note?: string;
}

import {
  checkOllamaAvailable,
  generatePromptLocal,
  generateVariationsLocal,
  refinePromptLocal,
  scorePromptLocal
} from './localOllamaEngine';

async function callApi<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data as T;
}

// Utility to check if local mode is enforced
function isLocalMode(): boolean {
  return localStorage.getItem('Klio_promptforge_local_mode') === 'true';
}

// Generate a prompt from an idea
export async function generatePrompt(idea: string, mode: PromptMode): Promise<GenerateResult> {
  if (isLocalMode()) {
    return generatePromptLocal(idea, mode);
  }
  return callApi<GenerateResult>('/api/prompt-forge', { idea, mode, action: 'generate', count: 1 });
}

// Generate multiple variations
export async function generateVariations(idea: string, mode: PromptMode, count = 3): Promise<GenerateResult> {
  if (isLocalMode()) {
    return generateVariationsLocal(idea, mode, count);
  }
  return callApi<GenerateResult>('/api/prompt-forge', { idea, mode, action: 'generate', count });
}

// Refine an existing prompt
export async function refinePrompt(
  existingPrompt: string,
  refinementInstruction: string,
  mode: PromptMode,
  idea?: string
): Promise<GenerateResult> {
  if (isLocalMode()) {
    return refinePromptLocal(existingPrompt, refinementInstruction, mode);
  }
  return callApi<GenerateResult>('/api/prompt-forge', {
    existingPrompt,
    refinementInstruction,
    mode,
    idea,
    action: 'refine'
  });
}

// Remix a prompt into another mode
export async function remixPrompt(existingPrompt: string, targetMode: PromptMode, idea?: string): Promise<GenerateResult> {
  return callApi<GenerateResult>('/api/prompt-forge', {
    existingPrompt,
    mode: targetMode,
    idea,
    action: 'remix'
  });
}

// Score/evaluate a prompt
export async function scorePrompt(existingPrompt: string, mode: PromptMode): Promise<ScoreResult> {
  if (isLocalMode()) {
    return scorePromptLocal(existingPrompt);
  }
  return callApi<ScoreResult>('/api/prompt-forge', {
    existingPrompt,
    mode,
    action: 'score'
  });
}

// Share a prompt (creates public URL)
export async function sharePrompt(prompt: string, mode: PromptMode, idea?: string): Promise<ShareResult> {
  return callApi<ShareResult>('/api/prompt-share', { prompt, mode, idea });
}

// Get a shared prompt by ID
export async function getSharedPrompt(id: string): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/prompt-share?id=${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Não encontrado');
  return data;
}
