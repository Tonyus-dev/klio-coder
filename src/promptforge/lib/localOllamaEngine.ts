import type { PromptMode, GenerateResult, ScoreResult } from './promptForgeApi';
import { getKlioSystemPrompt } from '../../lib/canon/Klio-canon';

const DEFAULT_OLLAMA_URL = 'http://localhost:11434';
const DEFAULT_MODEL = 'qwen2.5:1.5b'; 

export function getOllamaUrl(): string {
  return localStorage.getItem('Klio_ollama_url') || DEFAULT_OLLAMA_URL;
}

export function setOllamaUrl(url: string) {
  localStorage.setItem('Klio_ollama_url', url);
}

const SCORE_PROMPT = `Você é um avaliador especialista em qualidade de prompts para IA.
Analise o prompt fornecido e retorne um JSON com:
{
  "overall": <0-100>,
  "clarity": <0-100>,
  "specificity": <0-100>,
  "creativity": <0-100>,
  "completeness": <0-100>,
  "suggestions": ["<sugestão 1>", "<sugestão 2>", "<sugestão 3>"]
}
Seja rigoroso mas justo. Retorne APENAS o JSON, sem texto adicional.`;

export async function checkOllamaAvailable(): Promise<boolean> {
  const urlStr = getOllamaUrl();
  if (!isValidOllamaUrl(urlStr)) return false;
  
  try {
    const res = await fetch(`${urlStr}/api/tags`);
    return res.ok;
  } catch {
    return false;
  }
}

function isValidOllamaUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

async function callOllama(prompt: string, isJson = false): Promise<string> {
  const urlStr = getOllamaUrl();
  if (!isValidOllamaUrl(urlStr)) {
    throw new Error('URL do Ollama inválida. Use http:// ou https:// e evite schemas não confiáveis.');
  }

  const model = localStorage.getItem('Klio_ollama_model') || DEFAULT_MODEL;
  
  const res = await fetch(`${urlStr}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: isJson ? 'json' : undefined
    })
  });

  if (!res.ok) throw new Error('Falha ao conectar com Ollama Local');
  const data = await res.json();
  return data.response.trim();
}

export async function generatePromptLocal(idea: string, mode: PromptMode): Promise<GenerateResult> {
  const systemPrompt = getKlioSystemPrompt(mode);
  const prompt = `${systemPrompt}\n\nNota do Sistema: Inclua na resposta: "Motor: Ollama Local".\n\n[IDEIA DO USUÁRIO]\n${idea}\n\n[RESPOSTA ESPERADA]\nApenas o prompt final estruturado e otimizado.`;
  
  const response = await callOllama(prompt);
  const model = localStorage.getItem('Klio_ollama_model') || DEFAULT_MODEL;
  
  return {
    prompt: response,
    model_used: `Ollama Local (${model})`
  };
}

export async function generateVariationsLocal(idea: string, mode: PromptMode, count: number): Promise<GenerateResult> {
  const systemPrompt = getKlioSystemPrompt(mode);
  const prompt = `${systemPrompt}\n\nNota do Sistema: Inclua na resposta: "Motor: Ollama Local".\n\n[IDEIA DO USUÁRIO]\n${idea}\n\n[RESPOSTA ESPERADA]\nGere exatamente ${count} variações distintas estruturadas do prompt otimizado. Separe-as claramente com "---VARIAÇÃO---".`;
  
  const response = await callOllama(prompt);
  const variations = response.split('---VARIAÇÃO---')
    .map(v => v.trim())
    .filter(v => v.length > 0)
    .slice(0, count);

  const model = localStorage.getItem('Klio_ollama_model') || DEFAULT_MODEL;
  return {
    variations,
    model_used: `Ollama Local (${model})`
  };
}

export async function scorePromptLocal(existingPrompt: string): Promise<ScoreResult> {
  const prompt = `${SCORE_PROMPT}\n\n[PROMPT A AVALIAR]\n${existingPrompt}`;
  const response = await callOllama(prompt, true);
  
  try {
    const score = JSON.parse(response);
    const model = localStorage.getItem('Klio_ollama_model') || DEFAULT_MODEL;
    return { score, model_used: `Ollama Local (${model})` };
  } catch (e) {
    throw new Error('Falha ao parsear avaliação estruturada do Ollama.');
  }
}

export async function refinePromptLocal(existingPrompt: string, instruction: string, mode: PromptMode): Promise<GenerateResult> {
  const systemPrompt = getKlioSystemPrompt(mode);
  const prompt = `${systemPrompt}\n\nNota do Sistema: Inclua na resposta: "Motor: Ollama Local".\n\n[PROMPT ATUAL]\n${existingPrompt}\n\n[INSTRUÇÃO DE REFINAMENTO]\n${instruction}\n\n[RESPOSTA ESPERADA]\nApenas o prompt final refinado e estruturado.`;
  
  const response = await callOllama(prompt);
  const model = localStorage.getItem('Klio_ollama_model') || DEFAULT_MODEL;
  return {
    prompt: response,
    model_used: `Ollama Local (${model})`
  };
}
