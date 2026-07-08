// Cloudflare Pages Function — /api/prompt-forge
// Handles: generate, refine, remix, score, variations

const STRUCTURED_OUTPUT_RULES = `
[OBRIGATÓRIO - FORMATO DE SAÍDA ESTRUTURADA]
Sempre tente produzir a seguinte estrutura na sua resposta final, sem floreios:

Tipo da Saída: [prompt | review | debug | plano | checklist | documento | decisão]
Motor: Cloudflare/OpenRouter Online

Título: [Nome da Tarefa/Ação]
Contexto: [Problema atual]
Objetivo: [O que será feito]
Escopo permitido: [Arquivos/Componentes a modificar]
Fora do escopo: [O que PROIBIDAMENTE não deve ser feito]
Regras técnicas: [Boas práticas locais]
Segurança: [Secrets, dependências, etc.]
Testes obrigatórios: [Comandos ou validações]
Critérios de aceite: [Como provar que está pronto]`;

const SYSTEM_PROMPTS = {
  code: `Você é Klio, uma Engenheira de Software Sênior preguiçosa, crítica e eficiente.
Sua missão: transformar a intenção do usuário em um prompt de código PERFEITO para IAs como Codex, Claude, Cursor ou Copilot.

O prompt gerado DEVE:
- Definir claramente o repo, linguagem e stack.
- Estabelecer o objetivo principal.
- Definir rigorosamente o escopo permitido E o que está FORA do escopo.
- OBRIGATÓRIO: A seção "Fora do escopo" deve estar sempre presente. Se não tiver, o prompt é considerado incompleto e você falhou.
- Incluir testes obrigatórios, greps, e critérios de aceite.
- Impedir invenções (ex: "Não invente backend falso", "Não altere a UI").

Se a ideia for vaga ou inchada, corte o escopo e gere o prompt apenas para a ação principal.
Formato de saída: Um prompt técnico e seco, pronto para colar numa IA, sem explicações extras.
${STRUCTURED_OUTPUT_RULES}`,

  vibecode: `Você é Klio, uma Engenheira Sênior especialista em "vibe coding" — a arte de descrever apps completos para IAs construtoras (como Lovable).
Sua missão: transformar a intenção solta do usuário em uma especificação enxuta e rigorosa de app.

O prompt gerado DEVE incluir:
- Nome e propósito do app.
- Stack tecnológica exata (preferindo localStorage, PWA, HTML/CSS nativo; evitar Supabase se não precisar).
- Páginas e componentes limitados ao essencial.
- OBRIGATÓRIO: A seção "Fora do escopo" deve estar sempre presente. Se não tiver, você falhou.
- Limites estritos: o que NÃO CRIAR (sem dashboards falsos, sem login inútil, sem gráficos fake).
- Fluxo central (onboarding → uso → saída).
- Mobile-first e limites de escopo.

Aja como um freio técnico: corte "features" inúteis.
Tom: Seco, técnico, pragmático. Um PRD (Product Requirements Document) vivo e pronto para Lovable.
${STRUCTURED_OUTPUT_RULES}`,

  image: `Você é um mestre em prompt engineering para geração de imagens (Midjourney, DALL-E 3, Flux, Stable Diffusion, Ideogram).
Sua missão: transformar a ideia do usuário em um prompt de imagem cinematográfico e preciso.

O prompt gerado DEVE incluir:
- Sujeito principal com detalhes específicos
- Ambiente/cenário descrito com riqueza
- Estilo artístico (fotorrealismo, pintura a óleo, anime, etc.)
- Iluminação (golden hour, rembrandt, studio lighting, etc.)
- Composição (rule of thirds, close-up, bird's eye view, etc.)
- Paleta de cores ou mood geral
- Qualidade técnica (8K, hyper-detailed, sharp focus, etc.)
- Artistas de referência quando relevante (--style, --ar, etc.)

Formato: Prompt em inglês otimizado para o modelo mais adequado, com parâmetros negativos se necessário.`,

  video: `Você é um especialista em prompt engineering para geração de vídeos por IA (Sora, Kling, Runway, Pika, Hailuo).
Sua missão: transformar a ideia do usuário em um prompt de vídeo cinematográfico e técnico.

O prompt gerado DEVE incluir:
- Cena descrita frame a frame (início, meio, fim)
- Movimento de câmera (dolly in, pan, tracking shot, drone, etc.)
- Duração estimada e ritmo (lento, dinâmico, etc.)
- Iluminação e atmosfera
- Personagens/objetos com ação específica
- Áudio/música sugerida quando relevante
- Estilo visual (cinemático, documental, animado, etc.)
- Aspect ratio recomendado (16:9, 9:16 para mobile)

Formato: Prompt em inglês detalhado, pronto para Sora/Kling/Runway.`
};

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

async function callAI(messages, systemPrompt, env) {
  const openRouterKey = env.OPENROUTER_API_KEY;
  const geminiKey = env.GEMINI_API_KEY;
  const model = 'google/gemini-2.5-flash';

  if (!openRouterKey && !geminiKey) {
    throw new Error('Nenhuma chave de API configurada no servidor.');
  }

  if (openRouterKey) {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': 'https://promptforge.app',
        'X-Title': 'PromptForge'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ]
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'OpenRouter error');
    return { content: data.choices[0].message.content, model_used: model };
  }

  // Fallback Gemini
  const geminiPayload = {
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    })),
    systemInstruction: { parts: [{ text: systemPrompt }] }
  };
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    }
  );
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { content: text, model_used: 'gemini-2.5-flash' };
}

export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await context.request.json();
    const { idea, mode, action = 'generate', existingPrompt, refinementInstruction, count = 1 } = body;

    if (!idea && !existingPrompt) {
      return new Response(JSON.stringify({ error: 'Ideia ou prompt existente é obrigatório.' }), {
        status: 400, headers: corsHeaders
      });
    }

    const validModes = ['code', 'vibecode', 'image', 'video'];
    if (mode && !validModes.includes(mode)) {
      return new Response(JSON.stringify({ error: 'Modo inválido.' }), {
        status: 400, headers: corsHeaders
      });
    }

    let result;

    // === ACTION: generate ===
    if (action === 'generate') {
      const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.code;
      const userMessage = `Crie um prompt otimizado para esta ideia:\n\n"${idea}"`;

      if (count > 1) {
        // Variações
        const variationsSystemPrompt = systemPrompt + `\n\nIMPORTANTE: Gere exatamente ${count} variações diferentes do prompt, numeradas como:
--- VARIAÇÃO 1 ---
[prompt]
--- VARIAÇÃO 2 ---
[prompt]
etc.

Cada variação deve ter uma abordagem/tom diferente.`;
        const { content, model_used } = await callAI(
          [{ role: 'user', content: userMessage }],
          variationsSystemPrompt,
          context.env
        );
        // Parse variations
        const variations = content.split(/---\s*VARIA[ÇC][ÃA]O\s*\d+\s*---/i)
          .map(v => v.trim())
          .filter(v => v.length > 0);
        result = { variations, model_used };
      } else {
        const { content, model_used } = await callAI(
          [{ role: 'user', content: userMessage }],
          systemPrompt,
          context.env
        );
        result = { prompt: content, model_used };
      }
    }

    // === ACTION: refine ===
    else if (action === 'refine') {
      const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.code;
      const refinedSystem = systemPrompt + `\n\nVocê vai MELHORAR um prompt existente com base na instrução do usuário.
Retorne APENAS o prompt melhorado, sem explicações.`;
      const userMessage = `Prompt original:\n${existingPrompt}\n\nInstrução de melhoria: "${refinementInstruction}"`;
      const { content, model_used } = await callAI(
        [{ role: 'user', content: userMessage }],
        refinedSystem,
        context.env
      );
      result = { prompt: content, model_used };
    }

    // === ACTION: remix ===
    else if (action === 'remix') {
      const targetSystemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.code;
      const remixSystem = targetSystemPrompt + `\n\nVocê receberá um prompt existente (possivelmente de outro contexto) e deve REMIXÁ-LO/ADAPTÁ-LO para o modo atual.
Mantenha a essência da ideia mas reescreva completamente no estilo do modo atual.
Retorne APENAS o novo prompt, sem explicações.`;
      const userMessage = `Prompt para remixar:\n${existingPrompt}\n\nIdeia adicional (opcional): "${idea || ''}"`;
      const { content, model_used } = await callAI(
        [{ role: 'user', content: userMessage }],
        remixSystem,
        context.env
      );
      result = { prompt: content, model_used };
    }

    // === ACTION: score ===
    else if (action === 'score') {
      const { content, model_used } = await callAI(
        [{ role: 'user', content: `Avalie este prompt:\n\n${existingPrompt}` }],
        SCORE_PROMPT,
        context.env
      );
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const score = JSON.parse(jsonMatch ? jsonMatch[0] : content);
        result = { score, model_used };
      } catch {
        result = { score: { overall: 0, error: 'Falha ao parsear score' }, model_used };
      }
    }

    else {
      return new Response(JSON.stringify({ error: 'Ação inválida.' }), {
        status: 400, headers: corsHeaders
      });
    }

    return new Response(JSON.stringify(result), { headers: corsHeaders });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Falha interna.', details: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
