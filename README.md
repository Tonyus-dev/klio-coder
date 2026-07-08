# Klio Coder

Klio Coder é o app técnico privado de Antônio.

* Online = Cloudflare Workers / OpenRouter.
* Local = Ollama/Hefaístia.
* Klio não faz parte da Kaline V27 pública.
* A Kaline V27 pública contém Kaline, Kháris e Kuan.

## Rodar localmente

```bash
npm install
npm run dev
```

## Variáveis

Copie `.env.example` para `.env.local` e configure seu `.dev.vars` para o Worker.

## Deploy no Cloudflare Workers

O projeto usa um Cloudflare Worker puro rodando em `worker/index.js`.

Configuração e Deploy:
```bash
npm run build
npx wrangler deploy
```

Secret necessário (via dashboard do Cloudflare ou `wrangler secret put`):
- `OPENROUTER_API_KEY`

Endpoints do Worker:
- `/api/health`
- `/api/prompt-forge`
- `/api/chat`
- `/api/prompt-share`
