# Códice Live Setup

## Objetivo

Permitir que o `kalinev27` consulte um acervo Códice real servido pela Héstia.

## Variável de Ambiente

```env
VITE_CODICE_URL=http://127.0.0.1:4517/api/codice
```

## Prioridade de URL

1. `localStorage` chave `kaline_codice_url` (configurado pelo painel)
2. `VITE_CODICE_URL` (variável de ambiente no build)
3. `http://127.0.0.1:4517/api/codice` (fallback local)

## Exemplos de URL

```env
VITE_CODICE_URL=http://127.0.0.1:4517/api/codice
VITE_CODICE_URL=http://100.x.y.z:4517/api/codice
VITE_CODICE_URL=https://hestia.seu-tailnet.ts.net/api/codice
```

## Endpoints Obrigatórios

Se `VITE_CODICE_URL=https://hestia.../api/codice`, os endpoints finais serão:

| Endpoint | Descrição |
|---|---|
| `GET /api/codice/books` | Lista todos os livros do acervo |
| `GET /api/codice/search?q=termo` | Busca livros por título ou autor |
| `GET /api/codice/context?q=termo` | Busca trechos e contextos no acervo |

## Formato de Resposta — /books e /search

```json
[
  { "id": "book-id", "title": "Nome do Livro", "author": "Autor", "status": "reference" }
]
```

## Formato de Resposta — /context

```json
[
  { "book": "Nome", "author": "Autor", "chapter": "Cap.", "location": "Seção", "excerpt": "Trecho." }
]
```

## Segurança

- Preferir Tailscale para acesso privado.
- Não expor o acervo privado publicamente.
- Não colocar tokens de autenticação no frontend.
- Autenticação futura será via backend intermediário.

## Configuração via Painel

1. Abrir `/kaline` → **Códice**.
2. Clicar em **Configurar Acesso**.
3. Informar a URL do servidor (ex: `https://hestia.tailnet.ts.net/api/codice`).
4. Clicar em **Salvar e Testar**.
5. Confirmar badge `Real` no cabeçalho do Códice.

## Status de Conectividade

| Badge | Significado |
|---|---|
| Real (verde) | Servidor respondeu com dados reais |
| Simulado (âmbar) | Servidor offline, exibindo mock honesto |
| Offline (vermelho) | Erro de rede, dados não disponíveis |
