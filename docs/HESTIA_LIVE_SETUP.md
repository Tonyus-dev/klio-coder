# Héstia Live Setup

## Objetivo

Permitir que o `kalinev27` consulte uma estação Héstia real em vez de exibir dados simulados.

## Variável de Ambiente

```env
VITE_HESTIA_URL=http://127.0.0.1:4517
```

## Prioridade de URL

1. `localStorage` chave `kaline_hestia_url` (configurado pelo painel)
2. `VITE_HESTIA_URL` (variável de ambiente no build)
3. `http://127.0.0.1:4517` (fallback local)

## Exemplos de URL

```env
VITE_HESTIA_URL=http://127.0.0.1:4517
VITE_HESTIA_URL=http://100.x.y.z:4517
VITE_HESTIA_URL=https://hestia.seu-tailnet.ts.net
```

## Endpoint Obrigatório

```
GET /api/server/status
```

Resposta esperada:

```json
{
  "uptime": "14h 32m",
  "load": [0.45, 0.52, 0.61],
  "cpu": 18,
  "memory": { "total": "16.00 GB", "used": "7.45 GB", "free": "8.55 GB", "percent": 46 },
  "storage": { "path": "/KALINE", "total": "512 GB", "used": "124 GB", "available": "388 GB", "percent": 24, "kalineFilesCount": 84 },
  "services": [{ "name": "tailscaled", "active": true, "description": "Rede privada Tailscale" }],
  "presence": { "mode": "presence", "activeWindow": "Kaline", "timeInFocusToday": "0h", "recentEvents": [] }
}
```

## Segurança

- Preferir Tailscale para acesso privado.
- Não expor a Héstia diretamente na internet pública.
- Se usar Cloudflare, garantir CORS permitido para o domínio do app.
- Não colocar service role nem segredos no frontend.

## Configuração via Painel

1. Abrir `/kaline`.
2. Navegar em **Héstia Station**.
3. Editar o campo `BASE_URL` com a URL real.
4. Clicar em **Salvar** para persistir no `localStorage`.
5. Confirmar badge `Loopback Real` e dados reais de CPU/RAM/Storage.

## Comportamento Esperado

| Situação | Badge | Dados |
|---|---|---|
| Héstia responde | Loopback Real (verde) | Reais |
| Héstia offline/timeout | Simulado (âmbar, pulsando) | Mock honesto |

O controle de serviços (ligar/desligar) está desabilitado até existir endpoint `POST` na Héstia.
