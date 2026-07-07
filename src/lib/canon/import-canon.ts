import { CANONICAL_CONTEXT_SEEDS } from './canonical-contexts';

export function importTotalidadeCanonToLocalStorage(): number {
  if (typeof window === 'undefined') return 0;

  try {
    const rawData = localStorage.getItem('kaline_contexts');
    let contexts: any[] = [];
    
    if (rawData) {
      try {
        contexts = JSON.parse(rawData);
        if (!Array.isArray(contexts)) contexts = [];
      } catch (e) {
        contexts = [];
      }
    }

    let addedCount = 0;

    for (const seed of CANONICAL_CONTEXT_SEEDS) {
      const exists = contexts.some((ctx: any) => ctx.id === seed.id);
      if (!exists) {
        contexts.push({
          id: seed.id,
          titulo: seed.title,
          tipo: seed.scope,
          conteudo: seed.content,
          ativo: true,
          arquivado: false,
          source: seed.source,
          createdAt: new Date().toISOString()
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      localStorage.setItem('kaline_contexts', JSON.stringify(contexts));
    }

    return addedCount;
  } catch (error) {
    console.error('Erro ao importar o cânone da totalidade:', error);
    return 0;
  }
}
