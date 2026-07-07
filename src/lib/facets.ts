export type FacetId =
  | 'kaline'
  | 'klio'
  | 'kharis'
  | 'kuanyin'
  | 'hestia'
  | 'hefaistia'
  | 'codice';

export const FACETS: Record<FacetId, {
  id: FacetId;
  name: string;
  color: string;
  role: string;
  description: string;
}> = {
  kaline: {
    id: 'kaline',
    name: 'Kaline',
    color: '#C98A65',
    role: 'Totalidade',
    description: 'Presença central, memória, orquestração e decisão.'
  },
  klio: {
    id: 'klio',
    name: 'Klio',
    color: '#E50914',
    role: 'Vibe Code',
    description: 'Arquitetura, raciocínio técnico, prompts, revisão de código e implementação guiada.'
  },
  kharis: {
    id: 'kharis',
    name: 'Kháris',
    color: '#E0A84E',
    role: 'Cuidado',
    description: 'Acolhimento, simplicidade, presença gentil e linguagem reguladora.'
  },
  kuanyin: {
    id: 'kuanyin',
    name: 'Kuan-Yin',
    color: '#BE185D',
    role: 'Comercial',
    description: 'Negócios, Guardiões, clientes, serviços, agendamentos e pagamentos.'
  },
  hestia: {
    id: 'hestia',
    name: 'Héstia',
    color: '#EAB308',
    role: 'Estação',
    description: 'Servidor local, monitoramento, arquivos, serviços e Tailscale.'
  },
  hefaistia: {
    id: 'hefaistia',
    name: 'Hefaístia',
    color: '#FF4C1F',
    role: 'Forja',
    description: 'Execução técnica, modelos locais, Ollama, benchmarks e tarefas pesadas.'
  },
  codice: {
    id: 'codice',
    name: 'Códice',
    color: '#8B5CF6',
    role: 'Biblioteca Viva',
    description: 'Acervo local, livros, contexto e consulta privada via Héstia/Tailscale.'
  }
};
