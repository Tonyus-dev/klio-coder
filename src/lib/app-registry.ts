// APP_REGISTRY Canônico da Klio Pritaneu V27
// Define os domínios de trabalho, facetas de IA, permissões e status.
import { FACETS } from './facets';

export interface Surface {
  id: string;
  name: string;
  description: string;
  status: 'real' | 'mock' | 'planned';
  path: string;
}

export interface DomainRegistry {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  surfaces: Surface[];
}

export const APP_REGISTRY: Record<string, DomainRegistry> = {

  klio: {
    id: 'klio',
    name: 'Klio',
    icon: 'Code',
    color: FACETS.klio.color,
    description: FACETS.klio.description,
    surfaces: [
      {
        id: 'vibe-code',
        name: 'Vibe Code',
        description: 'Arquitetura, prompts, revisão e implementação assistida.',
        status: 'real',
        path: '/klio'
      }
    ]
  },

  drive: {
    id: 'drive',
    name: 'Drive',
    icon: 'Share2',
    color: '#16A34A', // Mobilidade/Sincronização
    description: 'Gerenciamento de mobilidade e transferência local.',
    surfaces: [
      { id: 'taildrop', name: 'Taildrop Share', description: 'Transferência de arquivos em rede segura', status: 'real', path: '/tailscale' }
    ]
  },
  memory: {
    id: 'memory',
    name: 'Memória',
    icon: 'Layers',
    color: '#8B5CF6', // Violeta
    description: 'Armazenamento de conhecimento e revisões.',
    surfaces: [
      { id: 'jardim', name: 'Jardim de Notas', description: 'Conexão de ideias e pensamentos', status: 'real', path: '/jardim' },
      { id: 'revisao', name: 'Revisão Contínua', description: 'Métrica de repetição espaçada', status: 'real', path: '/revisao' }
    ]
  },
  system: {
    id: 'system',
    name: 'Sistema',
    icon: 'Cpu',
    color: '#F97316', // Hefaístia/Estação
    description: 'Monitoramento, diagnósticos, forja de IA e controle da estação física.',
    surfaces: [
      { id: 'pritaneu', name: 'Hub Pritaneu', description: 'Orquestração de microsserviços', status: 'real', path: '/pritaneu' },
      { id: 'station', name: 'Estação Héstia', description: 'Diagnóstico de hardware e serviços locais', status: 'real', path: '/station' },
      { id: 'forge', name: 'Forja Hefaístia', description: 'Lógica e benchmarks de IA Ollama local', status: 'real', path: '/forge' }
    ]
  }
};
