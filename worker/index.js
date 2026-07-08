import handleHealth from './routes/health.js';
import handlePromptForge from './routes/prompt-forge.js';
import handleChat from './routes/chat.js';
import handlePromptShare from './routes/prompt-share.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey'
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    try {
      if (pathname === '/api/health') return await handleHealth(request, env, corsHeaders);
      if (pathname === '/api/prompt-forge') return await handlePromptForge(request, env, corsHeaders);
      if (pathname === '/api/chat') return await handleChat(request, env, corsHeaders);
      if (pathname === '/api/prompt-share') return await handlePromptShare(request, env, corsHeaders);

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
