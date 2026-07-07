import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Settings, Server, ExternalLink, Library, AlertTriangle } from 'lucide-react';
import { getCodiceUrl, setCodiceUrl, searchCodiceBooks, CodiceBook } from '../lib/codiceClient';

export default function CodicePanel() {
  const [books, setBooks] = useState<CodiceBook[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [tailscaleUrl, setTailscaleUrl] = useState(getCodiceUrl());
  const [connectionStatus, setConnectionStatus] = useState<'real' | 'mock' | 'offline'>('mock');
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    loadBooks('');
  }, []);

  const loadBooks = async (query: string) => {
    setLoading(true);
    const results = await searchCodiceBooks(query);
    setBooks(results.data || []);
    const st = results.status as 'real' | 'mock' | 'offline';
    setConnectionStatus(st);
    setIsMock(st !== 'real');
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks(search);
  };

  const handleSaveSettings = () => {
    setCodiceUrl(tailscaleUrl);
    setShowSettings(false);
    loadBooks(search);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'reading': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'read': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'reference': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'reading': return 'Lendo';
      case 'read': return 'Lido';
      case 'reference': return 'Referência';
      default: return 'Não Lido';
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-[#06070A] text-[#F7EFE7]">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-[#252936] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#FF4C1F] flex items-center gap-2">
            <Library className="w-5 h-5" /> Códice
          </h2>
          <p className="text-xs text-[#A89F96] mt-1 font-medium tracking-wide">
            Biblioteca Viva da Estação Kaline
          </p>
          <p className="text-[9px] font-mono text-[#A89F96]/60 mt-1 truncate max-w-xs">
            {getCodiceUrl()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
            connectionStatus === 'real'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : connectionStatus === 'offline'
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {connectionStatus === 'real' ? 'Real' : connectionStatus === 'offline' ? 'Offline' : 'Simulado'}
          </span>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#10131A] border border-[#252936] rounded-lg text-xs font-bold text-[#A89F96] hover:text-[#F7EFE7] transition-colors"
          >
            <Settings className="w-4 h-4" /> Configurar Acesso
          </button>
        </div>
      </div>

      {/* Alerta de Mock Obrigatório */}
      {isMock && (
        <div className="mx-6 mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-400/90 font-medium leading-relaxed">
            Códice em modo simulado. Configure a rota Héstia/Tailscale para consultar seu acervo real.
          </p>
        </div>
      )}

      {/* Configurações (Tailscale) */}
      {showSettings && (
        <div className="mx-6 mt-6 p-6 bg-[#0B0D12] border border-[#252936] rounded-xl">
          <h3 className="text-sm font-bold text-[#F7EFE7] flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-[#FF4C1F]" /> Conexão Héstia (Tailscale Serve)
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={tailscaleUrl}
              onChange={(e) => setTailscaleUrl(e.target.value)}
              placeholder="Ex: https://hestia.tailnet.ts.net/api/codice"
              className="flex-1 bg-[#10131A] border border-[#252936] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#FF4C1F] focus:ring-1 focus:ring-[#FF4C1F]"
            />
            <button 
              onClick={handleSaveSettings}
              className="px-6 py-2.5 bg-[#FF4C1F] hover:bg-[#E03C12] text-[#F7EFE7] rounded-xl text-sm font-bold transition-colors"
            >
              Salvar e Testar
            </button>
          </div>
          <p className="text-xs text-[#A89F96] mt-3">
            O Códice acessará seu acervo no servidor local de forma privada. Não exponha o banco na internet pública.
          </p>
        </div>
      )}

      {/* Área Principal */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Barra de Busca */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="O que você quer encontrar no acervo?"
            className="w-full bg-[#10131A] border border-[#252936] rounded-full pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-[#FF4C1F] focus:ring-1 focus:ring-[#FF4C1F] shadow-lg shadow-black/20 transition-all"
          />
          <Search className="w-5 h-5 text-[#A89F96] absolute left-4 top-1/2 -translate-y-1/2" />
        </form>

        {/* Lista de Livros */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] mb-4 border-b border-[#252936] pb-2">
            Acervo {isMock ? '(Simulado)' : `(${books.length})`}
          </h3>
          
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="w-6 h-6 border-2 border-[#FF4C1F] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {books.map(book => (
                <div key={book.id} className="p-4 bg-[#10131A] border border-[#252936] rounded-2xl hover:border-[#FF4C1F]/50 transition-colors group flex gap-4">
                  <div className="w-16 h-24 bg-[#0B0D12] border border-[#252936] rounded shadow-inner flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-[#A89F96]/30" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <h4 className="font-bold text-sm text-[#F7EFE7] line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-[#A89F96] mt-0.5">{book.author}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusColor(book.status)}`}>
                        {getStatusLabel(book.status)}
                      </span>
                      <button 
                        disabled={!book.cover_path}
                        title={book.cover_path ? 'Abrir no servidor' : 'Disponível no servidor'}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#FF4C1F] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:underline disabled:opacity-30 disabled:cursor-not-allowed disabled:no-underline"
                      >
                        {book.cover_path ? 'Ler' : 'Disponível no servidor'} <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {books.length === 0 && (
                <div className="col-span-full p-8 text-center text-[#A89F96] text-sm">
                  Nenhum livro encontrado.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
