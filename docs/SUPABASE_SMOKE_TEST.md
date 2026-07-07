# Supabase Smoke Test — Kuan-Yin

## Pré-requisitos

- Migrations aplicadas em ordem até `0006_production_hardening.sql`
- Variáveis de ambiente configuradas:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## Fluxo Guardião — Setup

1. Criar usuário no Supabase Auth (email/senha).
2. Logar em `/app/login`.
3. Acessar **Perfil & Kuan**.
4. Preencher Nome do Negócio e Slug público (ex: `minha-barbearia`).
5. Salvar Perfil.
6. Acessar **Serviços**.
7. Criar pelo menos um serviço (nome + preço).

## Fluxo Cliente — Solicitação

1. Abrir `/g/minha-barbearia` (substituir pelo slug real).
2. Preencher nome, telefone e selecionar serviço.
3. Clicar em Solicitar Atendimento.
4. Receber link do portal com token.

## Fluxo Cliente — Portal

1. Abrir o link do portal recebido.
2. Ver o agendamento com status `Solicitado`.
3. Clicar em Informar Pagamento.
4. Preencher referência e valor.
5. Enviar comprovante.

## Fluxo Guardião — Agenda

1. Abrir `/app/agenda`.
2. Confirmar que a solicitação apareceu na lista.
3. Alterar status para `confirmed` (Confirmar).
4. Ver comprovante na seção Comprovantes Pendentes.
5. Marcar comprovante como `verified` (Marcar Verificado).
6. Repetir com outro comprovante e usar Rejeitar.

## Critérios de Aceite

- [ ] Nenhum dado de cliente aparece sem token válido.
- [ ] Nenhum comprovante é aceito sem token válido.
- [ ] Guardião não altera dados de outro negócio.
- [ ] Comprovante verificado **não** é tratado como confirmação bancária automática.
- [ ] Status `Pagamento confirmado automaticamente` não aparece em nenhuma tela.
- [ ] Texto "Verificação manual do Guardião necessária." aparece nos comprovantes.

## Notas de Segurança

- RPCs públicas operam via `SECURITY DEFINER` com `search_path = public`.
- Grants explícitos para `anon` em `create_public_appointment_request`, `get_client_portal_by_token`, `send_payment_proof_by_token`.
- Tabelas `clients`, `appointments`, `payment_proofs` não têm SELECT público direto.
