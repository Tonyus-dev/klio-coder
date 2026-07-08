const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export function onRequestGet({ env }) {
  return json({
    ok: true,
    app: 'klio-coder',
    runtime: 'online',
    openrouterConfigured: Boolean(env.OPENROUTER_API_KEY),
  });
}

export function onRequestOptions() {
  return new Response(null, { status: 204 });
}
