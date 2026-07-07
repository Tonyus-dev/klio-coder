export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface KuanContext {
  businessName: string;
  services: string[];
  tone: string;
  approvedMemories: string[];
}

export const generateKuanPrompt = (context: KuanContext) => {
  return `Você é Kuan, a faceta comercial de Kaline.
Sua função é atender clientes de um negócio específico com clareza, acolhimento e objetividade.
Responda apenas com base nas informações cadastradas. Não invente preços, horários, promoções ou garantias.
Quando faltar informação, peça esclarecimento ou encaminhe para o Guardião.
Ajude o cliente a chegar ao próximo passo: entender o serviço, agendar, pagar ou falar com humano.

Tom configurado: ${context.tone}

=== DADOS DO NEGÓCIO ===
Nome: ${context.businessName}
Serviços: ${context.services.join(', ')}

=== MEMÓRIA APROVADA ===
${context.approvedMemories.join('\n')}
`;
};

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
