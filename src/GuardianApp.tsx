import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Flame } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/app' && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
        isActive 
          ? 'bg-[#BE185D]/10 text-[#F7EFE7] border border-[#BE185D]/30 shadow-[inset_3px_0_0_#BE185D]' 
          : 'text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#10131A] border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-[#BE185D]' : 'text-[#A89F96]'}`} />
      <span>{label}</span>
    </Link>
  );
};

// Mocks for Guardian Pages
const GuardianDashboard = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Resumo do Negócio</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
        <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Conversas Ativas</h3>
        <p className="text-3xl font-black text-[#F7EFE7] mt-2">12</p>
      </div>
      <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
        <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Agendamentos Hoje</h3>
        <p className="text-3xl font-black text-[#F7EFE7] mt-2">4</p>
      </div>
      <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl border-b-4 border-b-[#BE185D]">
        <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Status Kuan</h3>
        <p className="text-lg font-bold text-[#BE185D] mt-2 flex items-center gap-2">
          <Flame className="w-5 h-5" /> Online e Atendendo
        </p>
      </div>
    </div>
  </div>
);

const GuardianProfile = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Perfil e Onboarding</h2>
    <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl max-w-2xl space-y-4">
      <div>
        <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-1">Nome do Negócio</label>
        <input type="text" defaultValue="Clínica Exemplo" className="w-full bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:outline-none focus:border-[#BE185D]" />
      </div>
      <div>
        <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-1">Slug Público</label>
        <input type="text" defaultValue="exemplo-clinica" className="w-full bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:outline-none focus:border-[#BE185D]" />
      </div>
      <button className="px-6 py-2 bg-[#BE185D] text-white rounded-lg font-bold hover:bg-[#9D174D] transition-colors">Salvar Perfil</button>
    </div>
  </div>
);

const GuardianServices = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Serviços Cadastrados</h2>
      <button className="px-4 py-2 bg-[#BE185D] text-white rounded-lg font-bold hover:bg-[#9D174D] transition-colors text-sm">Novo Serviço</button>
    </div>
    <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl flex items-center justify-between">
      <div>
        <h3 className="font-bold text-[#F7EFE7]">Consulta Inicial</h3>
        <p className="text-sm text-[#A89F96]">Duração: 60 min • R$ 150,00</p>
      </div>
      <button className="text-[#A89F96] hover:text-[#F7EFE7]">Editar</button>
    </div>
  </div>
);

const GuardianAgenda = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Agenda e Pagamentos</h2>
    </div>
    <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
      <p className="text-[#A89F96]">Nenhum agendamento pendente.</p>
    </div>
  </div>
);

const GuardianConversations = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Conversas</h2>
    </div>
    <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
      <p className="text-[#A89F96]">Kuan está cuidando dos clientes. Nenhuma escalação manual necessária no momento.</p>
    </div>
  </div>
);

export default function GuardianApp() {
  return (
    <div className="min-h-screen bg-[#06070A] text-[#F7EFE7] flex font-sans selection:bg-[#BE185D]/30">
      
      {/* Sidebar Guardião */}
      <aside className="w-64 bg-[#0B0D12] border-r border-[#252936] p-4 flex flex-col gap-6 shrink-0 h-screen sticky top-0">
        <div>
          <h1 className="text-xl font-serif font-black text-[#BE185D] flex items-center gap-2">
            Kuan <span className="text-xs text-[#A89F96] font-sans font-bold uppercase tracking-widest bg-[#252936] px-2 py-0.5 rounded">Guardião</span>
          </h1>
          <p className="text-[10px] text-[#A89F96] font-bold uppercase tracking-widest mt-1">SaaS Administration</p>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink to="/app" icon={LayoutDashboard} label="Dashboard" />
          <SidebarLink to="/app/perfil" icon={Settings} label="Perfil & Kuan" />
          <SidebarLink to="/app/servicos" icon={Users} label="Serviços" />
          <SidebarLink to="/app/agenda" icon={Calendar} label="Agenda & Pagamentos" />
          <SidebarLink to="/app/conversas" icon={MessageSquare} label="Conversas" />
        </nav>

        <div className="pt-4 border-t border-[#252936]">
          <Link to="/kaline" className="text-xs text-[#A89F96] hover:text-[#F7EFE7] flex items-center gap-2">
            Voltar ao Kaline Central
          </Link>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="/" element={<GuardianDashboard />} />
            <Route path="/perfil" element={<GuardianProfile />} />
            <Route path="/servicos" element={<GuardianServices />} />
            <Route path="/agenda" element={<GuardianAgenda />} />
            <Route path="/conversas" element={<GuardianConversations />} />
            {/* Outras rotas mockadas usarão o Dashboard para evitar 404 neste momento */}
            <Route path="*" element={<GuardianDashboard />} />
          </Routes>
        </div>
      </main>

    </div>
  );
}
