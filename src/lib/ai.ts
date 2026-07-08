export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Chamada Segura via Cloudflare Pages Function (ou backend equivalente)
// As chaves OPENROUTER_API_KEY e GEMINI_API_KEY devem ficar SOMENTE no ambiente do servidor (Cloudflare)
export const callOpenRouter = async (messages: ChatMessage[], systemPrompt: string) => {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemPrompt,
        model: 'google/gemini-2.5-flash'
      })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Erro na API de Chat:', errorData);
      return 'Desculpe, o atendimento está indisponível no momento.';
    }

    const data = await res.json();
    return data.content || 'Sem resposta.';

  } catch (err) {
    console.error('Erro ao chamar IA localmente:', err);
    return 'Desculpe, não consegui processar a resposta agora.';
  }
};
