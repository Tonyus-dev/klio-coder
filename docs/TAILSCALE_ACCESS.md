# Tailscale Access — Kaline v27

## Objetivo

Acessar Héstia e Códice de forma privada via rede Tailscale.

## Exemplos de URL

```
http://100.x.y.z:4517
https://hestia.tailnet.ts.net
https://hestia.tailnet.ts.net/api/codice
```

## Requisito de Acesso

O app público em Cloudflare só conseguirá acessar esses endpoints se:

1. O dispositivo do usuário também estiver na Tailnet (ex: celular com Tailscale instalado); **ou**
2. O serviço estiver exposto por Tailscale Serve/Funnel; **ou**
3. Houver um backend intermediário público seguro.

## Recomendação Atual

Para uso pessoal:

1. Instalar Tailscale no servidor Héstia.
2. Instalar Tailscale no dispositivo cliente (celular, notebook).
3. Configurar `VITE_HESTIA_URL` e `VITE_CODICE_URL` com URL da Tailnet.

Alternativamente, usar Tailscale Serve para expor serviços via HTTPS dentro da Tailnet.

## CORS

A Héstia deve permitir a origem do domínio do app.

Exemplo de cabeçalho no servidor Héstia:

```
Access-Control-Allow-Origin: https://kuan-yin.nomosludens.ia.br
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Para desenvolvimento local, pode usar `*` temporariamente.

## Configuração no App

| Serviço | Chave localStorage | Variável de Ambiente |
|---|---|---|
| Héstia | `kaline_hestia_url` | `VITE_HESTIA_URL` |
| Códice | `kaline_codice_url` | `VITE_CODICE_URL` |

Ambas podem ser configuradas via painel sem rebuild.
