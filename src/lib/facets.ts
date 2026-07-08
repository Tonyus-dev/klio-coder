export type FacetId =
  | 'klio'
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
  klio: {
    id: 'klio',
    name: 'Klio',
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
