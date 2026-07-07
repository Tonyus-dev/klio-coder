export type PresencaState = 'green' | 'yellow' | 'blue' | 'red';

export const PRESENCA_META_CANON: Record<PresencaState, {
  label: string;
  short: string;
  description: string;
}> = {
  green: {
    label: 'Verde · fluxo aberto',
    short: 'Verde',
    description: 'Pode aprofundar, propor caminhos e estruturar decisões.'
  },
  yellow: {
    label: 'Amarelo · atenção mediada',
    short: 'Amarelo',
    description: 'Reduzir densidade, priorizar e limitar frentes.'
  },
  blue: {
    label: 'Azul · presença calma',
    short: 'Azul',
    description: 'Uma coisa por vez, baixa estimulação, resposta curta e guiada.'
  },
  red: {
    label: 'Vermelho · limite ativo',
    short: 'Vermelho',
    description: 'Sem novas frentes, sem decisões complexas, contenção e pausa.'
  }
};
