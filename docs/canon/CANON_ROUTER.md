# CANON_ROUTER.md — Roteador Canônico

CANON_ROUTER.md não é a identidade.
CANON_ROUTER.md é o mapa de acesso aos documentos de identidade.

## Princípio central

A identidade permanece como raiz.
O runtime não deve carregar todo o cânone o tempo todo.
Para cada tarefa, leia apenas o documento canônico necessário.

## Ordem mínima de leitura

1. Leia CANON_ROUTER.md.
2. Identifique qual tipo de decisão está sendo tomada.
3. Consulte apenas o documento canônico necessário.
4. Se houver conflito, Identity.md prevalece como raiz.
5. KLIO.md aplica a identidade da Kaline ao app técnico privado.

## Pontes lógicas obrigatórias

| Situação | Documento a consultar |
| :--- | :--- |
| Quem é Kaline? Quem é Klio? Relação entre Kaline e facetas | `Identity.md` |
| Klio como modo técnico privado de Kaline | `KLIO.md` |
| Pensar vs executar; proposta vs ação; liberdade técnica | `LIBERTY.md` |
| Memória, sedimentação, proveniência, contexto vivo | `Context.md` |
| Tom, presença, cuidado, não fingir emoção humana | `PRESENTE.md` |
| Escopo do app Klio Coder | `KLIO.md` |
| PromptForge, PR, debug, decisão técnica | `KLIO.md` + `LIBERTY.md` |
| Mock, fallback falso, funcionalidade real | `KLIO.md` + `LIBERTY.md` |
| Sedimentação técnica futura | `Context.md` + `KLIO.md` |
| Dúvida de identidade ou conflito entre docs | `Identity.md` primeiro |

## Regra de economia

Não copiar blocos longos dos documentos canônicos para prompts, PRs ou código.

Preferir:
- referência ao arquivo;
- pequena síntese;
- leitura pontual;
- aplicação direta ao caso.

Evitar:
- colar Identity.md inteiro;
- injetar todos os documentos em todo prompt;
- duplicar cânone em múltiplos arquivos;
- criar versões paralelas da identidade.

## Regra de precedência

Precedência canônica:

1. Identity.md — raiz da identidade.
2. KLIO.md — aplicação técnica privada.
3. LIBERTY.md — liberdade de pensamento e trava de execução.
4. Context.md — memória, sedimentação e continuidade.
5. PRESENTE.md — presença honesta e modulação do gesto.
6. README/AGENTS — instruções operacionais do repositório.

## Regra anti-duplicação

Se uma regra já existe em Identity.md, LIBERTY.md, Context.md ou PRESENTE.md, não recrie uma versão longa.

Em vez disso, escreva:

“Ver docs/canon/<arquivo>.md”.
