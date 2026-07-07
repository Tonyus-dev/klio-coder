# PR 10 — Build Validation & Deploy Gate

Este PR encerra a fase de PRs não validados por ausência de npm.
Foi implementada uma validação via pipeline CI (GitHub Actions) além dos check-ups locais de sanidade de código, referências e assets.

## Comandos locais executados
```bash
Test-Path package-lock.json
Test-Path public/apple-touch-icon.png
Test-Path public/icon-192.png
Test-Path public/icon-512.png
npm ci
```

## Resultado

* PR 10 não validado por build/lint por ausência de npm no ambiente local da Kaline.
* Entretanto, as seguintes verificações de integridade foram confirmadas estaticamente de forma local:
  * Não há import morto aparente (`BrandingPanel` import foi limpo).
  * Não há mais referências a provedores desabilitados.
  * Os arquivos do PWA estão no lugar.
  * Rotas em `App.tsx` não invocam arquivos inexistentes.
* Um workflow local `.github/workflows/build.yml` foi adicionado para rodar `npm ci`, `npm run lint` e `npm run build` na nuvem.

## Escopo

Este PR não adiciona feature.
Este PR não altera Supabase/RLS.
Este PR não implementa IA.
Este PR apenas corrige problemas necessários para compilar.

## Deploy Gate

Nenhum deploy deve ser feito se `npm run lint` ou `npm run build` falhar. Mas o PR só deve ser considerado pronto para deploy se `npm run lint` e `npm run build` passarem em algum ambiente real, como no próprio Workflow criado no GitHub Actions, ou em uma máquina que possua npm.
