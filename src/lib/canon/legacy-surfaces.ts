export type LegacySurfaceStatus = 'imported_context' | 'planned' | 'ignored';

export type LegacySurface = {
  id: string;
  label: string;
  domain: string;
  description: string;
  suggestedV27Target?: string;
  status: LegacySurfaceStatus;
};

export const TOTALIDADE_LEGACY_SURFACES: LegacySurface[] = [
  {
    id: 'Klio-chat',
    label: 'Klio',
    domain: 'Klio',
    description: 'Chat pessoal e continuidade da Klio.',
    suggestedV27Target: 'KlioChat',
    status: 'imported_context'
  },
  {
    id: 'Klio-presente',
    label: 'Klio Presente',
    domain: 'Klio',
    description: 'Presença por voz e escuta no domínio pessoal.',
    suggestedV27Target: 'KlioChat / ModoFala futuro',
    status: 'planned'
  },

  {
    id: 'klio',
    label: 'Klio',
    domain: 'klio',
    description: 'No v27: vibe code, arquitetura, prompts e revisão técnica.',
    suggestedV27Target: 'Faceta Klio no KlioChat',
    status: 'imported_context'
  },
  {
    id: 'codice',
    label: 'Códice',
    domain: 'memory',
    description: 'Biblioteca viva, leitura, margem e fichamento.',
    suggestedV27Target: 'CodicePanel',
    status: 'imported_context'
  },
  {
    id: 'camara-do-eco',
    label: 'Câmara do Eco',
    domain: 'memory',
    description: 'Transcrição, ata, decisões, pendências e memória de reuniões.',
    suggestedV27Target: 'CavernaEcoPanel',
    status: 'imported_context'
  },

  {
    id: 'drive',
    label: 'Klio Drive',
    domain: 'drive',
    description: 'Veículo, combustível e mobilidade.',
    suggestedV27Target: 'futuro',
    status: 'planned'
  },
  {
    id: 'jardim',
    label: 'Jardim / Mnemósine',
    domain: 'memory',
    description: 'Memórias aprovadas e duráveis.',
    suggestedV27Target: 'MemoryPanel',
    status: 'imported_context'
  },
  {
    id: 'revisao',
    label: 'Revisão',
    domain: 'memory',
    description: 'Aprovar, editar, recusar ou arquivar candidatos à memória.',
    suggestedV27Target: 'MemoryPanel',
    status: 'imported_context'
  },
  {
    id: 'registro-vivo',
    label: 'Registro Vivo',
    domain: 'memory',
    description: 'Captura densa do que está vivo no dia.',
    suggestedV27Target: 'futuro',
    status: 'planned'
  },
  {
    id: 'agenda',
    label: 'Agenda',
    domain: 'Klio',
    description: 'Compromissos e organização.',
    suggestedV27Target: 'AgendaPanel',
    status: 'imported_context'
  },
  {
    id: 'juridico',
    label: 'Jurídico',
    domain: 'Klio',
    description: 'Corpus jurídico curado.',
    suggestedV27Target: 'futuro jurídico',
    status: 'planned'
  },
  {
    id: 'corpore-sano',
    label: 'Corpore Sano',
    domain: 'Klio',
    description: 'Treino, sinais corporais e recuperação.',
    suggestedV27Target: 'futuro',
    status: 'planned'
  }
];
