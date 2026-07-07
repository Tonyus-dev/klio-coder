# Deploy Readiness — Kaline v27

## Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22
- **SPA fallback:** `public/_redirects` com `/* /index.html 200`

### Variáveis de ambiente (públicas, sem segredos)

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL pública do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon pública do Supabase |
| `VITE_KALINE_API_URL` | URL do backend Kaline API (quando existir) |
| `VITE_HESTIA_URL` | URL da Héstia Station |
| `VITE_HEFAISTIA_URL` | URL da Hefaístia Forge |
| `VITE_CODICE_URL` | URL do Códice |

**Não adicionar ao frontend:**
- `OPENROUTER_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Supabase

Aplicar migrations em ordem:

1. `0001_kaline_core.sql`
2. `0002_kuanyin_commercial.sql`
3. `0003_memory_codice_eco.sql`
4. `0004_rls_policies.sql`
5. `0005_kuanyin_rpc_rls.sql`

---

## Smoke Test Obrigatório (após deploy)

- [ ] Criar conta Guardião
- [ ] Logar em `/app/login`
- [ ] Criar perfil do negócio
- [ ] Criar serviço
- [ ] Acessar `/g/:slug`
- [ ] Solicitar atendimento
- [ ] Abrir portal pelo token recebido
- [ ] Enviar referência de pagamento
- [ ] Voltar ao painel do Guardião `/app/agenda`
- [ ] Ver solicitação na lista
- [ ] Alterar status (Confirmar / Propor / Concluir / Cancelar)
- [ ] Ver comprovante na seção de Comprovantes
- [ ] Marcar comprovante como Verificado ou Rejeitar

---

## Deploy Gate

Não fazer deploy se:

- [ ] GitHub Actions falhar
- [ ] `npm run lint` falhar
- [ ] `npm run build` falhar
- [ ] Migrations não aplicarem sem erro
- [ ] Rota `/g/:slug` não carregar
- [ ] Rota `/app/login` não carregar
- [ ] Rota `/app/agenda` não carregar

---

## Notas

- A Kaline API (`VITE_KALINE_API_URL`) pode estar vazia no primeiro deploy. O app degrada graciosamente retornando `not_configured`.
- O SPA fallback (`public/_redirects`) já existe no repositório.
- PWA assets (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `manifest.json`, `sw.js`) já existem em `public/`.
