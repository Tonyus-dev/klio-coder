// Cliente API do Códice
// Conecta a Estação Kaline (Frontend) com o servidor local Héstia (Backend via Tailscale)

export const getCodiceUrl = () => {
  return localStorage.getItem('kaline_codice_url') || 'http://hestia:8080/api/codice';
};

export const setCodiceUrl = (url: string) => {
  // Remove trailing slash se houver
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  localStorage.setItem('kaline_codice_url', cleanUrl);
};

export interface CodiceBook {
  id: string;
  title: string;
  author: string;
  cover_path?: string;
  status: 'unread' | 'reading' | 'read' | 'reference';
}

export interface CodiceContextResult {
  book: string;
  author: string;
  chapter: string;
  location: string;
  excerpt: string;
}

export const fetchCodiceBooks = async (): Promise<CodiceBook[]> => {
  const baseUrl = getCodiceUrl();
  try {
    const res = await fetch(`${baseUrl}/books`);
    if (!res.ok) throw new Error('API do Códice inacessível');
    return await res.json();
  } catch (err) {
    console.warn('Usando mock do Códice (Servidor Inativo)');
    return MOCK_BOOKS;
  }
};

export const searchCodiceBooks = async (query: string): Promise<CodiceBook[]> => {
  if (!query) return fetchCodiceBooks();
  
  const baseUrl = getCodiceUrl();
  try {
    const res = await fetch(`${baseUrl}/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API do Códice inacessível');
    return await res.json();
  } catch (err) {
    const q = query.toLowerCase();
    return MOCK_BOOKS.filter(b => 
      b.title.toLowerCase().includes(q) || 
      b.author.toLowerCase().includes(q)
    );
  }
};

export const getCodiceContext = async (query: string): Promise<CodiceContextResult[]> => {
  const baseUrl = getCodiceUrl();
  try {
    const res = await fetch(`${baseUrl}/context?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API do Códice inacessível');
    return await res.json();
  } catch (err) {
    console.warn('Usando mock de contexto Códice');
    return [
      {
        book: "Teoria da Conduta e Direito Penal",
        author: "Desconhecido",
        chapter: "Capítulo 2",
        location: "Seção 4",
        excerpt: "Este é um trecho simulado retornado pelo Códice. Configure a URL real do Tailscale para buscar textos do seu acervo vivo."
      }
    ];
  }
};

// Dados simulados para você testar a interface antes de ter o servidor Python/Node pronto
const MOCK_BOOKS: CodiceBook[] = [
  { id: '1', title: 'Direito Penal - Parte Geral', author: 'Cleber Masson', status: 'reference' },
  { id: '2', title: 'O Mito de Sísifo', author: 'Albert Camus', status: 'read' },
  { id: '3', title: 'O Senhor dos Anéis: A Sociedade do Anel', author: 'J.R.R. Tolkien', status: 'reading' },
  { id: '4', title: 'Arquitetura Limpa', author: 'Robert C. Martin', status: 'unread' },
];
