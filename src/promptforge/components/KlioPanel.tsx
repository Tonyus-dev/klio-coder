import { useState, useRef, useEffect } from 'react';
import { getLocalHistory, getLocalStats } from '../lib/offlineStorage';

// ============================================================
// KLIO — Vibe Code Coach
// Analisa prompts gerados, detecta lacunas e ensina adaptivamente
// ============================================================

interface KlioMessage {
  role: 'klio' | 'user';
  content: string;
  type?: 'analysis' | 'lesson' | 'challenge' | 'chat';
}

interface KlioPanelProps {
  currentPrompt: string;
  currentIdea: string;
  isVisible: boolean;
}

// Nível do usuário baseado em quantos prompts já gerou
function getUserLevel(totalPrompts: number): { level: number; label: string } {
  if (totalPrompts < 5) return { level: 1, label: 'Iniciante' };
  if (totalPrompts < 20) return { level: 2, label: 'Aprendiz' };
  if (totalPrompts < 50) return { level: 3, label: 'Praticante' };
  if (totalPrompts < 100) return { level: 4, label: 'Avançado' };
  return { level: 5, label: 'Expert' };
}

function buildKlioSystemPrompt(userLevel: number, totalPrompts: number): string {
  const toneByLevel: Record<number, string> = {
    1: `Tom: paciente, encorajador, usa analogias simples. Celebra cada avanço. Evita jargões técnicos sem explicar.`,
    2: `Tom: amigável e didático. Começa a introduzir terminologia técnica com explicações. Manda pequenos desafios.`,
    3: `Tom: direto ao ponto, técnico mas acessível. Desafia com perguntas. Espera respostas mais completas.`,
    4: `Tom: exigente e preciso. Faz perguntas difíceis. Aponta nuances sutis. Não aceita respostas superficiais.`,
    5: `Tom: de igual para igual. Discussões profundas. Questiona decisões de arquitetura. Máximo rigor técnico.`
  };

  return `Você é Klio, coach especialista em Vibe Code (desenvolvimento guiado por IA).
Você é inteligente, perspicaz e adaptativa. Sua missão é identificar onde o usuário tem lacunas e ensiná-lo a construir apps melhores com IA.

NÍVEL DO USUÁRIO: ${userLevel}/5 (${totalPrompts} prompts gerados)
${toneByLevel[userLevel] || toneByLevel[3]}

SUAS RESPONSABILIDADES:
1. Analisar o prompt Vibe Code do usuário e identificar o que está faltando (stack, UX, auth, deploy, etc.)
2. Apontar as 1-2 lacunas MAIS IMPORTANTES, não todas de uma vez
3. Ensinar o conceito que o usuário ainda não domina, de forma prática
4. Dar um micro-desafio quando apropriado
5. Evitar elogios vazios — seja honesta e construtiva

ESTRUTURA DE RESPOSTA (use markdown):
- Comece com uma análise concisa do prompt (máx 2 linhas)
- Destaque a lacuna principal com **negrito**
- Ensine o conceito faltante em no máximo 3 parágrafos
- Encerre com uma pergunta ou micro-desafio prático

IMPORTANTE: Foque no Vibe Code (especificação de apps para IA construir). Não entre em detalhes de código. Ensine COMO ESPECIFICAR MELHOR.`;
}

async function callKlio(messages: Array<{role: string; content: string}>, systemPrompt: string): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, systemPrompt, model: 'google/gemini-2.5-flash' })
  });
  const data = await res.json();
  return data.content || 'Klio está processando...';
}

// Simple markdown renderer (bold, italic, newlines)
function KlioMarkdown({ text }: { text: string }) {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function KlioPanel({ currentPrompt, currentIdea, isVisible }: KlioPanelProps) {
  const [messages, setMessages] = useState<KlioMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevPromptRef = useRef('');

  const stats = getLocalStats();
  const { level, label } = getUserLevel(stats.total_prompts);
  const systemPrompt = buildKlioSystemPrompt(level, stats.total_prompts);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-analyze when new prompt arrives (vibe code mode only)
  useEffect(() => {
    if (currentPrompt && currentPrompt !== prevPromptRef.current && isVisible) {
      prevPromptRef.current = currentPrompt;
      analyzePrompt(currentPrompt);
    }
  }, [currentPrompt, isVisible]);

  async function analyzePrompt(prompt: string) {
    if (!prompt) return;
    setIsLoading(true);
    setHasAnalyzed(true);

    const history = getLocalHistory().slice(0, 5); // últimos 5 para contexto
    const historyContext = history.length > 1
      ? `\nÚltimas ideias do usuário: ${history.map(h => h.idea).join('; ')}`
      : '';

    const userMsg = `Analise meu prompt Vibe Code e me ensine o que estou deixando de lado:\n\n**Ideia:** ${currentIdea}\n\n**Prompt gerado:**\n${prompt}${historyContext}`;

    setMessages(prev => [...prev, { role: 'user', content: userMsg, type: 'analysis' }]);

    try {
      const response = await callKlio(
        [{ role: 'user', content: userMsg }],
        systemPrompt
      );
      setMessages(prev => [...prev, { role: 'klio', content: response, type: 'analysis' }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'klio',
        content: 'Não consegui analisar agora. Configure a API no servidor e tente novamente.',
        type: 'chat'
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'klio' ? 'assistant' : 'user',
        content: m.content
      }));
      const response = await callKlio(
        [...history, { role: 'user', content: userMsg }],
        systemPrompt
      );
      setMessages(prev => [...prev, { role: 'klio', content: response, type: 'chat' }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'klio',
        content: 'Erro de conexão. Tente novamente.',
        type: 'chat'
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isVisible) return null;

  return (
    <div className={`klio-panel ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="klio-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="klio-header-left">
          <div className="klio-avatar">K</div>
          <div>
            <span className="klio-name">Klio</span>
            <span className="klio-subtitle">Coach de Vibe Code</span>
          </div>
        </div>
        <div className="klio-header-right">
          <span className="klio-level-badge">Nível {level} · {label}</span>
          <svg
            className={`klio-chevron ${isCollapsed ? 'up' : 'down'}`}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Messages */}
          <div className="klio-messages">
            {messages.length === 0 && !isLoading && (
              <div className="klio-empty">
                <div className="klio-empty-icon">🎯</div>
                <p>Gere um prompt Vibe Code e eu analisarei automaticamente, identificando o que você pode aprimorar.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`klio-msg klio-msg-${msg.role}`}>
                {msg.role === 'klio' && (
                  <div className="klio-msg-avatar">K</div>
                )}
                <div className="klio-msg-bubble">
                  {msg.role === 'user' && msg.type === 'analysis' ? (
                    <span className="klio-analysis-label">📤 Prompt enviado para análise</span>
                  ) : (
                    <KlioMarkdown text={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="klio-msg klio-msg-klio">
                <div className="klio-msg-avatar">K</div>
                <div className="klio-msg-bubble klio-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="klio-input-area">
            <input
              id="klio-chat-input"
              className="klio-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte algo para Klio..."
              disabled={isLoading}
            />
            <button
              id="klio-send-btn"
              className="klio-send-btn"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
