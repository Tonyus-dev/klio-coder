# PR 11 — Kuan-Yin Deployable MVP & Kaline API Contracts

Este PR junta os antigos escopos PR 11, PR 12 e PR 13.

## Entregas

### Parte A — Kuan-Yin Guardian Agenda

- `src/lib/kuanyinClient.ts`: adicionados 4 métodos Guardian:
  - `getGuardianAppointments()` — lista solicitações do negócio com cliente e serviço
  - `updateAppointmentStatus(id, status)` — altera status validando `business_id`
  - `getGuardianPaymentProofs()` — lista comprovantes com agendamento e cliente
  - `updatePaymentProofStatus(id, status)` — verifica pertencimento antes de atualizar

- `src/GuardianApp.tsx`: `GuardianAgenda` substituída por tela funcional com:
  - Listagem de solicitações (cliente, telefone, serviço, data, hora, status, obs)
  - Ações: Confirmar, Propor, Concluir, Cancelar
  - Seção de Comprovantes: referência, valor, serviço, data de envio, status
  - Ações: Marcar Verificado / Rejeitar
  - Aviso obrigatório: "Comprovante informado pelo cliente. Verificação manual do Guardião necessária."
  - Feedback inline com timeout de 3s
  - Botão de Atualizar

### Parte B — Cloudflare/Supabase Deploy Readiness

- `docs/DEPLOY_READINESS.md`: checklist completo com Cloudflare, Supabase, smoke test e deploy gate
- `public/_redirects`: já existia com `/* /index.html 200` (SPA fallback confirmado)
- PWA assets confirmados: `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `manifest.json`, `sw.js`

### Parte C — Kaline API Contract Stub

- `src/lib/kaline-api/types.ts`: tipos TypeScript completos (envelope, chat, stt, tts, file)
- `src/lib/kaline-api/client.ts`: client stub usando `VITE_KALINE_API_URL`, retorna `not_configured` se vazio
- `src/lib/kaline-api/index.ts`: barrel exportando tipos e client

- `docs/KALINE_API_CONTRACT.md`: contrato dos endpoints `/health`, `/chat`, `/stt`, `/tts`, `/file`

## Fora de Escopo

- IA real (OpenRouter, Gemini, etc.)
- Google Calendar
- Pagamento real
- Confirmação automática de pagamento
- Backend novo
- Migrations novas
- Novas dependências

## Notas de Validação

PR não validado por build/lint por ausência de npm no ambiente local.
Execute antes de deploy:

```bash
npm run lint
npm run build
```

O GitHub Actions (`.github/workflows/build.yml`) criado no PR 10 validará automaticamente na nuvem.
