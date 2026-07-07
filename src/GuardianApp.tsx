import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, MessageSquare, Settings, Flame, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { kuanyinClient } from './lib/kuanyinClient';

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

const GuardianDashboard = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kuanyinClient.getGuardianDashboardSummary().then(res => {
      if (!res.error) setSummary(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Resumo do Negócio</h2>
      {loading ? <Loader2 className="w-6 h-6 animate-spin text-[#BE185D]" /> : 
        summary ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
              <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Solicitações Ativas</h3>
              <p className="text-3xl font-black text-[#F7EFE7] mt-2">{summary.activeAppointments || 0}</p>
            </div>
            <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
              <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Comprovantes Pendentes</h3>
              <p className="text-3xl font-black text-[#F7EFE7] mt-2">{summary.pendingProofs || 0}</p>
            </div>
            <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl border-b-4 border-b-[#BE185D]">
              <h3 className="text-xs uppercase tracking-widest text-[#A89F96] font-bold">Status Kuan</h3>
              <p className="text-lg font-bold text-amber-400 mt-2 flex items-center gap-2">
                <Flame className="w-5 h-5" /> Chat planejado
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
            <p className="text-[#A89F96]">Nenhum negócio cadastrado ainda. Configure seu perfil.</p>
          </div>
        )
      }
    </div>
  );
};

const GuardianProfile = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    kuanyinClient.getGuardianBusiness().then(biz => {
      if (biz) {
        setName(biz.name);
        setSlug(biz.slug);
        setDescription(biz.description || '');
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await kuanyinClient.upsertGuardianBusiness({ name, slug, description });
    setSaving(false);
    alert('Perfil salvo!');
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-[#BE185D]" />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Perfil e Onboarding</h2>
      <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl max-w-2xl space-y-4">
        <div>
          <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-1">Nome do Negócio</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:outline-none focus:border-[#BE185D]" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-1">Slug Público (URL)</label>
          <input type="text" value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:outline-none focus:border-[#BE185D]" />
        </div>
        <div>
          <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-1">Descrição Breve</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:outline-none focus:border-[#BE185D] min-h-[100px]" />
        </div>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-[#BE185D] text-white rounded-lg font-bold hover:bg-[#9D174D] transition-colors disabled:opacity-50">
          {saving ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </div>
    </div>
  );
};

const GuardianServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [biz, setBiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    kuanyinClient.getGuardianBusiness().then(b => {
      setBiz(b);
      if (b) {
        kuanyinClient.getServicesByBusinessId(b.id).then(svcs => setServices(svcs));
      }
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    if (!biz || !newName || !newPrice) return;
    await kuanyinClient.createService({ business_id: biz.id, name: newName, price: parseFloat(newPrice), duration_minutes: 60 });
    setNewName('');
    setNewPrice('');
    const svcs = await kuanyinClient.getServicesByBusinessId(biz.id);
    setServices(svcs);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-[#BE185D]" />;
  if (!biz) return <div className="text-[#A89F96]">Configure o Perfil do Negócio primeiro.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Serviços Cadastrados</h2>
      </div>
      
      <div className="p-4 bg-[#10131A] border border-[#252936] rounded-2xl flex gap-2 max-w-2xl">
        <input type="text" placeholder="Nome do Serviço" value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:border-[#BE185D] outline-none" />
        <input type="number" placeholder="Preço (R$)" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-32 bg-[#0B0D12] border border-[#252936] rounded-lg px-4 py-2 text-[#F7EFE7] focus:border-[#BE185D] outline-none" />
        <button onClick={handleCreate} className="px-4 py-2 bg-[#BE185D] text-white rounded-lg font-bold hover:bg-[#9D174D]">Adicionar</button>
      </div>

      <div className="space-y-2 max-w-2xl">
        {services.length === 0 ? (
          <p className="text-[#A89F96] p-4 bg-[#10131A] rounded-2xl border border-[#252936]">Nenhum serviço cadastrado.</p>
        ) : (
          services.map(s => (
            <div key={s.id} className="p-4 bg-[#10131A] border border-[#252936] rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#F7EFE7]">{s.name}</h3>
                <p className="text-sm text-[#A89F96]">R$ {s.price?.toFixed(2) || '0.00'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const GuardianAgenda = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Agenda e Solicitações</h2>
      </div>
      <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
        <p className="text-[#A89F96]">Recurso completo da agenda em construção na Forja. (As solicitações existem no banco, a visualização completa chegará na próxima fundição).</p>
      </div>
    </div>
  );
};

const GuardianConversations = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Conversas</h2>
    </div>
    <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl">
      <p className="text-[#A89F96]">Kuan Chat (Edge Function) pendente de implantação.</p>
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
          <SidebarLink to="/app/agenda" icon={Calendar} label="Agenda & Solicitações" />
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
            <Route path="*" element={<GuardianDashboard />} />
          </Routes>
        </div>
      </main>

    </div>
  );
}
