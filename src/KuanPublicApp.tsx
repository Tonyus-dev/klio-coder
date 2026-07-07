import { Routes, Route, Link, useParams } from 'react-router-dom';
import { MessageSquare, Calendar, CreditCard, ChevronLeft, UserCircle } from 'lucide-react';
import ClientPortal from './ClientPortal';

const BusinessStorefront = () => {
  const { slug } = useParams();
  
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7EFE7] text-[#06070A] flex flex-col items-center p-8 shadow-2xl relative">
      <div className="w-24 h-24 rounded-full bg-[#BE185D] text-white flex items-center justify-center text-3xl font-serif font-bold shadow-xl mb-6">
        {slug?.charAt(0).toUpperCase() || 'C'}
      </div>
      
      <h1 className="text-3xl font-serif font-black text-[#BE185D] mb-2 text-center capitalize">
        {slug?.replace(/-/g, ' ') || 'Clínica Exemplo'}
      </h1>
      <p className="text-center text-gray-600 mb-8 font-medium">
        Bem-vindo(a) ao nosso espaço de atendimento digital.
      </p>

      <div className="w-full space-y-4">
        <Link 
          to="chat"
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-[#BE185D]/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#BE185D]/10 text-[#BE185D] flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-[#BE185D] transition-colors">Conversar com Kuan</h3>
              <p className="text-xs text-gray-500">Tirar dúvidas e agendar</p>
            </div>
          </div>
        </Link>

        <Link 
          to="servicos"
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-[#BE185D]/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#BE185D]/10 text-[#BE185D] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-[#BE185D] transition-colors">Nossos Serviços</h3>
              <p className="text-xs text-gray-500">Ver tabela e horários</p>
            </div>
          </div>
        </Link>

        <Link 
          to="portal"
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm border border-gray-100 hover:border-[#BE185D]/30 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#BE185D]/10 text-[#BE185D] flex items-center justify-center">
              <UserCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 group-hover:text-[#BE185D] transition-colors">Meu Atendimento</h3>
              <p className="text-xs text-gray-500">Agendamentos, pagamentos e status</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-auto pt-10 pb-4">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
          Powered by <span className="text-[#BE185D]">Kuan</span>
        </p>
      </div>
    </div>
  );
};

const KuanPublicChat = () => {
  return (
    <div className="max-w-md mx-auto h-screen bg-[#F7EFE7] text-[#06070A] flex flex-col shadow-2xl">
      <header className="p-4 bg-white border-b border-gray-100 flex items-center gap-4">
        <Link to=".." className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full bg-gray-50">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#BE185D]/20">
            <img src="/brand/kuan.png" alt="Kuan" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">Kuan</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#BE185D] font-bold">Assistente do Negócio</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white p-3 rounded-2xl rounded-tl-sm border border-[#BE185D]/20 shadow-sm text-sm">
            Olá! Sou Kuan, assistente digital do negócio. Como posso ajudar você hoje?
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Digite sua mensagem..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D]"
          />
        </div>
      </div>
    </div>
  );
};

export default function KuanPublicApp() {
  return (
    <Routes>
      <Route path="/" element={<BusinessStorefront />} />
      <Route path="/chat" element={<KuanPublicChat />} />
      <Route path="/portal" element={<ClientPortal />} />
      {/* Mocking other routes just rendering Storefront for now */}
      <Route path="*" element={<BusinessStorefront />} />
    </Routes>
  );
}
