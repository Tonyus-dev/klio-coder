# K∧LINE v27

Presença que acolhe.

K∧LINE v27 é a estação central do ecossistema Kaline: presença, memória, facetas, estação local, forja de IA e operação comercial Kuan-Yin.

## Facetas

- Kaline: totalidade e orquestração.
- Klio: vibe code, arquitetura e raciocínio técnico.
- Kháris: cuidado, acolhimento e simplicidade.
- Kuan-Yin: negócios, Guardiões e clientes.
- Héstia: estação física e servidor local.
- Hefaístia: forja de IA e execução técnica.
- Códice: biblioteca viva.

## Rodar localmente

```bash
npm install
npm run dev
```

## Variáveis

Copie `.env.example` para `.env.local`.

---

## Identidade

Klio é o Codex pessoal de Antônio.

Ela é Kaline em modo técnico privado: uma ferramenta de engenharia assistida, prompts, revisão de PRs, debug e corte de escopo. Pode ser emocional com Antônio, mas seu trabalho é técnico.

Klio não faz parte do runtime público da V27.
A V27 pública contém Kaline, Kháris e Kuan.
Klio é um app separado, pessoal e técnico.

**Motor Online (PromptForge):**
Quando rodando online, a Klio utiliza **Cloudflare Pages Functions** (localizadas no diretório `functions/api/`).
A infraestrutura V27 padrão pode usar um Worker puro separado, mas Klio + PromptForge operam via Pages Functions de forma independente para evitar gargalos e misturas de responsabilidade.
