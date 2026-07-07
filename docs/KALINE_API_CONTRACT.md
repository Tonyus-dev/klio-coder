# Kaline API Contract

A Kaline API é o backend intermediário entre o frontend e qualquer provedor de IA, STT, TTS ou leitura de arquivo.

**O frontend nunca deve armazenar chaves de provedor.**

## Base URL

Configurada via `VITE_KALINE_API_URL`. Se vazia, o client retorna `not_configured` sem fazer fetch.

## Envelope de Resposta

Todas as respostas usam o tipo `KalineApiEnvelope<T>`:

```typescript
type KalineApiEnvelope<T> = {
  status: 'not_configured' | 'ok' | 'offline' | 'error';
  data: T | null;
  error?: string;
  source: 'kaline-api';
};
```

## Endpoints Esperados

### GET /health

Retorna estado básico da API.

**Saída:**
```json
{ "ok": true }
```

---

### POST /chat

**Entrada:**
```json
{
  "message": "texto do usuário",
  "facet": "kaline",
  "contexts": [
    { "id": "kaline_identity", "titulo": "Identidade", "conteudo": "..." }
  ]
}
```

**Facets válidos:** `kaline` | `klio` | `kharis` | `kuanyin`

**Saída:**
```json
{
  "text": "resposta da Kaline",
  "model": "opcional",
  "receiptId": "opcional"
}
```

---

### POST /stt

Transcrição de áudio. Recebe áudio em base64.

**Entrada:**
```json
{ "audioBase64": "..." }
```

**Saída:**
```json
{ "text": "transcrição do áudio" }
```

---

### POST /tts

Síntese de voz.

**Entrada:**
```json
{ "text": "texto a sintetizar", "voice": "opcional" }
```

**Saída:**
```json
{ "audioUrl": "url opcional", "audioBase64": "base64 opcional" }
```

---

### POST /file

Leitura e análise de arquivo (PDF, imagem, etc.).

**Entrada:**
```json
{
  "filename": "documento.pdf",
  "mimeType": "application/pdf",
  "base64": "...",
  "prompt": "instruções opcionais"
}
```

**Saída:**
```json
{ "text": "conteúdo extraído ou análise" }
```

---

## Regras de Segurança

- Sem chave de IA no frontend.
- Sem OpenRouter direto no browser.
- Sem Gemini direto no browser.
- Toda ação persistente exige recibo (`receiptId`).
- Respostas sempre usam envelope de status.
- Se `VITE_KALINE_API_URL` estiver vazia, retornar `not_configured` sem erro.

## Client TypeScript

O client está em `src/lib/kaline-api/client.ts` e é importável via:

```typescript
import { kalineApiClient } from '../lib/kaline-api';

const result = await kalineApiClient.chat({
  message: 'olá',
  facet: 'kaline',
});

if (result.status === 'not_configured') {
  // API ainda não configurada
}
```
