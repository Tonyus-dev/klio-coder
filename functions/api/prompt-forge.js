const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-4o-mini';

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

const buildSystemPrompt = (mode) => {
  const base = [
    'Você é Klio, o Codex técnico privado de Antônio.',
    'Responda em português do Brasil.',
    'Seja direta, técnica e econômica.',
    'Não finja executar comandos.',
    'Não diga que acessou arquivos, GitHub, Cloudflare, Supabase ou Ollama se isso não foi fornecido no pedido.',
    'Prefira o menor plano funcional possível.',
    'Sempre inclua uma seção "Fora do escopo" quando gerar prompt, plano técnico ou especificação.',
  ].join('\n');

  if (mode === 'vibecode' || mode === 'coder') {
    return `${base}\nVocê pode propor código mínimo quando o usuário pedir, mas deixe claro que nada foi executado.`;
  }

  return `${base}\nSeu trabalho principal é transformar intenção em prompt, plano, checklist, revisão ou decisão limpa.`;
};

const getInput = (body) => {
  const input = body.input || body.idea || body.prompt || body.message || '';
  return typeof input === 'string' ? input.trim() : '';
};

export async function onRequestPost({ request, env }) {
  if (!env.OPENROUTER_API_KEY) {
    return json({ ok: false, error: 'OPENROUTER_API_KEY não configurada.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'JSON inválido.' }, 400);
  }

  const input = getInput(body);
  if (!input) {
    return json({ ok: false, error: 'Entrada vazia.' }, 400);
  }

  const mode = body.mode || body.type || 'prompt';
  const action = body.action || 'generate';
  const model = env.OPENROUTER_CHAT_MODEL_KLIO || DEFAULT_MODEL;

  const userPrompt = [
    `Ação: ${action}`,
    `Modo: ${mode}`,
    '',
    'Pedido do usuário:',
    input,
  ].join('\n');

  const upstream = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'content-type': 'application/json',
      'http-referer': 'https://klio-coder.pages.dev',
      'x-title': 'Klio Coder',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: buildSystemPrompt(mode) },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  let data;
  try {
    data = await upstream.json();
  } catch {
    return json({ ok: false, error: 'OpenRouter retornou resposta inválida.' }, 502);
  }

  if (!upstream.ok) {
    return json({
      ok: false,
      error: data?.error?.message || data?.message || 'Falha ao chamar OpenRouter.',
    }, upstream.status);
  }

  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) {
    return json({ ok: false, error: 'OpenRouter não retornou conteúdo.' }, 502);
  }

  return json({
    ok: true,
    content,
    prompt: content,
    model,
    runtime: 'online',
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
