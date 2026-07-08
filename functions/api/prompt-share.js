// Cloudflare Pages Function — /api/prompt-share
// Creates and retrieves shareable public prompt URLs

export async function onRequestPost(context) {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const body = await context.request.json();
    const { prompt, mode, idea, metadata = {} } = body;

    if (!prompt || !mode) {
      return new Response(JSON.stringify({ error: 'prompt e mode são obrigatórios.' }), {
        status: 400, headers: corsHeaders
      });
    }

    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Fallback: gera um ID local e retorna (para uso sem Supabase)
      const id = generateId();
      return new Response(JSON.stringify({
        id,
        url: `/p/${id}`,
        note: 'Compartilhamento temporário (sem persistência de servidor configurada)'
      }), { headers: corsHeaders });
    }

    // Salvar no Supabase
    const res = await fetch(`${supabaseUrl}/rest/v1/public_prompts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ prompt, mode, idea, metadata })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Supabase error');

    const id = data[0]?.id;
    return new Response(JSON.stringify({ id, url: `/p/${id}` }), { headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestGet(context) {
  const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };

  try {
    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'id é obrigatório.' }), {
        status: 400, headers: corsHeaders
      });
    }

    const supabaseUrl = context.env.SUPABASE_URL;
    const supabaseKey = context.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: 'Servidor não configurado.' }), {
        status: 503, headers: corsHeaders
      });
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/public_prompts?id=eq.${id}&select=*`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    const data = await res.json();
    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt não encontrado.' }), {
        status: 404, headers: corsHeaders
      });
    }

    // Incrementar views
    await fetch(`${supabaseUrl}/rest/v1/public_prompts?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ views: (data[0].views || 0) + 1 })
    });

    return new Response(JSON.stringify(data[0]), { headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
