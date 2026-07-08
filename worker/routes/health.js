export default async function handleHealth(request, env, corsHeaders) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    ok: true,
    app: 'klio-coder',
    runtime: 'online',
    openrouterConfigured: !!env.OPENROUTER_API_KEY
  }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
