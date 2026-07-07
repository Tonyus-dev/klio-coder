export async function onRequestPost(context) {
  // context.request contém o request feito pelo frontend
  // context.env contém as variáveis de ambiente (Seguras, do lado do servidor)

  try {
    const body = await context.request.json();
    const { messages, systemPrompt, model = 'google/gemini-2.5-flash' } = body;

    const openRouterKey = context.env.OPENROUTER_API_KEY;
    const geminiKey = context.env.GEMINI_API_KEY;

    if (!openRouterKey && !geminiKey) {
      return new Response(
        JSON.stringify({ error: 'Nenhuma chave de API configurada no servidor.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const payload = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    };

    if (openRouterKey) {
      // Chama OpenRouter
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': context.request.headers.get('Origin') || 'https://kuan-yin.app',
          'X-Title': 'Kuan by Kaline'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      return new Response(JSON.stringify({ content: data.choices[0].message.content }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else if (geminiKey) {
      // Fallback para Gemini Rest API
      // endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=...
      const geminiPayload = {
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiPayload)
      });
      
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro no fallback Gemini';
      
      return new Response(JSON.stringify({ content: text }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Falha interna ao processar IA.', details: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
