export default async function handleChat(request, env, corsHeaders) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { messages, systemPrompt, model = 'google/gemini-2.5-flash' } = body;

    const openRouterKey = env.OPENROUTER_API_KEY;

    if (!openRouterKey) {
      return new Response(
        JSON.stringify({ error: 'OPENROUTER_API_KEY não configurada no servidor.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    };

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterKey}`,
        'HTTP-Referer': request.headers.get('Origin') || 'https://klio-coder.app',
        'X-Title': 'Klio Coder'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'OpenRouter error');

    return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Falha interna ao processar IA.', details: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
