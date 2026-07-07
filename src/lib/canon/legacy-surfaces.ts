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
    id: 'kaline-chat',
    label: 'Kaline',
    domain: 'kaline',
    description: 'Chat pessoal e continuidade da Kaline.',
    suggestedV27Target: 'KalineChat',
    status: 'imported_context'
  },
  {
    id: 'kaline-presente',
    label: 'Kaline Presente',
    domain: 'kaline',
    description: 'Presença por voz e escuta no domínio pessoal.',
    suggestedV27Target: 'KalineChat / ModoFala futuro',
    status: 'planned'
  },
  {
    id: 'kharis',
    label: 'Kháris',
    domain: 'kharis',
    description: 'Cuidado, acolhimento e comunicação simplificada.',
    suggestedV27Target: 'Faceta Kháris no KalineChat',
    status: 'imported_context'
  },
  {
    id: 'klio',
    label: 'Klio',
    domain: 'klio',
    description: 'No v27: vibe code, arquitetura, prompts e revisão técnica.',
    suggestedV27Target: 'Faceta Klio no KalineChat',
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
    id: 'kuanyin',
    label: 'Kuan-Yin',
    domain: 'kuanyin',
    description: 'Atendimento, Guardiões, clientes, serviços e agendamentos.',
    suggestedV27Target: 'GuardianApp / KuanPublicApp',
    status: 'imported_context'
  },
  {
    id: 'drive',
    label: 'Kaline Drive',
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
    domain: 'kaline',
    description: 'Compromissos e organização.',
    suggestedV27Target: 'AgendaPanel',
    status: 'imported_context'
  },
  {
    id: 'juridico',
    label: 'Jurídico',
    domain: 'kaline',
    description: 'Corpus jurídico curado.',
    suggestedV27Target: 'futuro jurídico',
    status: 'planned'
  },
  {
    id: 'corpore-sano',
    label: 'Corpore Sano',
    domain: 'kaline',
    description: 'Treino, sinais corporais e recuperação.',
    suggestedV27Target: 'futuro',
    status: 'planned'
  }
];
