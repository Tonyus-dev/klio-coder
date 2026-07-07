export type TruthLayer =
  | 'raw_speech'
  | 'trace'
  | 'recent_context'
  | 'working_summary'
  | 'hypothesis'
  | 'revisable_understanding'
  | 'rule'
  | 'confirmed_memory';

export const TRUTH_LAYER_LABELS: Record<TruthLayer, string> = {
  raw_speech: 'Fala bruta',
  trace: 'Traço',
  recent_context: 'Contexto recente',
  working_summary: 'Síntese de trabalho',
  hypothesis: 'Hipótese',
  revisable_understanding: 'Entendimento revisável',
  rule: 'Regra',
  confirmed_memory: 'Memória confirmada',
};

export const TRUTH_LAYER_BLOCK = `=== CAMADAS DE VERDADE ===
Nunca misture fala bruta, hipótese, sedimento, memória e ação.
Compactar contexto não confirma verdade.
O que apareceu uma vez é traço, não fato permanente.
Sedimento é hipótese em revisão.
Jardim é memória confirmada.
Ação real exige recibo real.`;
