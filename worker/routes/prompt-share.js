function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export default async function handlePromptShare(request, env, corsHeaders) {
  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { prompt, mode, idea, metadata = {} } = body;

      if (!prompt || !mode) {
        return new Response(JSON.stringify({ error: 'prompt e mode são obrigatórios.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Supabase removed for now according to plan
      const id = generateId();
      return new Response(JSON.stringify({
        id,
        url: `/p/${id}`,
        note: 'Compartilhamento temporário (sem persistência de servidor configurada - Worker Puro)'
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } else if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id');

      if (!id) {
        return new Response(JSON.stringify({ error: 'id é obrigatório.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Sem supabase, não temos como recuperar
      return new Response(JSON.stringify({ error: 'Servidor não configurado com persistência.' }), {
        status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } else {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
