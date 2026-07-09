# K∧LINE Ledger / Mnemósine Ledger

## 1. Definição

O K∧LINE Ledger é o registro append-only de eventos aprováveis da K∧LINE.

Ele permite que facetas diferentes compartilhem contexto sem se misturarem, sem fingirem memória e sem conversarem em loop.

## 2. Facetas participantes

- Kaline — identidade central / organização pessoal / presença ampla.
- Klio — faceta técnica privada / prompts / PRs / debug / decisões técnicas.
- Kháris — cuidado / rituais / presença sensível.
- Kuan — comercial / guardiões / clientes / negócios.

Todas são facetas de Kaline, mas cada app mantém seu próprio escopo.

## 3. Regra de ouro

Mensagem é append-only.
Memória é derivada.
Resumo é derivado.
Sedimento é derivado.
Handoff é evento aprovado ou aprovável.

## 4. Modelo de evento

Documentar como referência futura, sem implementar:

```ts
type KlineEvent = {
  id: string;
  sourceFacet: 'kaline' | 'klio' | 'kharis' | 'kuan';
  targetFacet?: 'kaline' | 'klio' | 'kharis' | 'kuan' | 'all';
  sourceApp: 'kaline-v27' | 'klio-coder' | 'kharis' | 'kuan-yin';
  kind:
    | 'message'
    | 'decision'
    | 'memory_candidate'
    | 'context_note'
    | 'handoff'
    | 'warning'
    | 'task';
  content: string;
  visibility: 'private' | 'shared' | 'facet_only';
  status: 'draft' | 'candidate' | 'approved' | 'discarded' | 'archived';
  createdAt: string;
  deviceId?: string;
  runtime?: 'online' | 'local';
};
```

## 5. Handoff entre facetas

Exemplos:

Klio → Kaline:
"Antônio decidiu não usar Electron no MVP. Klio Coder será PWA com runtime Online/Local."

Kaline → Klio:
"Antônio está em semana de baixa energia. Evitar abrir três frentes técnicas ao mesmo tempo."

Kháris → Klio:
"Hoje usar respostas mais curtas e com menos carga cognitiva."

Kuan → Klio:
"Não misturar escopo comercial no app técnico."

## 6. Limites de segurança

A V27 pública não vira programadora.
A Klio não vira faceta comercial.
A Kuan não acessa contexto técnico privado sem evento aprovado.
A Kháris não recebe debug técnico bruto.
Kaline pode receber sínteses aprovadas, não logs técnicos crus.

## 7. Online / Local

Online escreve primeiro no Supabase.
Local escreve primeiro no IndexedDB.
A sincronização futura replica eventos, não respostas finais.

## 8. Decisão arquitetural

A Klio não terá uma memória isolada.
A Kaline não terá uma memória isolada.
A K∧LINE terá um Ledger comum, com escopo, faceta, visibilidade e aprovação.
