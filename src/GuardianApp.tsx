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

const STATUS_LABELS: Record<string, string> = {
  requested: 'Solicitado',
  proposed: 'Proposto',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
  completed: 'Concluído',
};

const PROOF_STATUS_LABELS: Record<string, string> = {
  pending_verification: 'Pendente',
  verified: 'Verificado',
  rejected: 'Rejeitado',
};

const StatusBadge = ({ status, type = 'appt' }: { status: string; type?: 'appt' | 'proof' }) => {
  const map = type === 'appt' ? STATUS_LABELS : PROOF_STATUS_LABELS;
  const label = map[status] || status;
  const colorMap: Record<string, string> = {
    requested: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    proposed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    completed: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    pending_verification: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    verified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${colorMap[status] || 'bg-[#252936] text-[#A89F96] border-[#252936]'}`}>
      {label}
    </span>
  );
};

const GuardianAgenda = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const [apptRes, proofRes] = await Promise.all([
      kuanyinClient.getGuardianAppointments(),
      kuanyinClient.getGuardianPaymentProofs(),
    ]);
    setAppointments(apptRes.data || []);
    setProofs(proofRes.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleApptStatus = async (
    id: string,
    status: 'requested' | 'proposed' | 'confirmed' | 'cancelled' | 'completed'
  ) => {
    setUpdatingId(id);
    const res = await kuanyinClient.updateAppointmentStatus(id, status);
    if (res.error) showFeedback(`Erro: ${res.error}`);
    else { showFeedback('Status atualizado.'); await load(); }
    setUpdatingId(null);
  };

  const handleProofStatus = async (
    id: string,
    status: 'verified' | 'rejected'
  ) => {
    setUpdatingId(id);
    const res = await kuanyinClient.updatePaymentProofStatus(id, status);
    if (res.error) showFeedback(`Erro: ${res.error}`);
    else { showFeedback('Comprovante atualizado.'); await load(); }
    setUpdatingId(null);
  };

  if (loading) return <Loader2 className="w-6 h-6 animate-spin text-[#BE185D]" />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#F7EFE7]">Agenda & Solicitações</h2>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg border border-[#252936] text-[#A89F96] hover:text-[#F7EFE7] transition-colors">
          Atualizar
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-[#BE185D]/10 border border-[#BE185D]/20 rounded-xl text-sm text-[#F7EFE7]">
          {feedback}
        </div>
      )}

      {/* Solicitações */}
      <section>
        <h3 className="text-xs font-black text-[#A89F96] uppercase tracking-widest mb-3">
          Solicitações ({appointments.length})
        </h3>
        {appointments.length === 0 ? (
          <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl text-[#A89F96] text-sm">
            Nenhuma solicitação encontrada.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => {
              const client = appt.clients as any;
              const service = appt.services as any;
              return (
                <div key={appt.id} className="p-5 bg-[#10131A] border border-[#252936] rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-bold text-[#F7EFE7]">{client?.name || 'Cliente'}</p>
                      <p className="text-xs text-[#A89F96]">{client?.phone || '—'}</p>
                    </div>
                    <StatusBadge status={appt.status} type="appt" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#A89F96]">
                    <span>Serviço: <span className="text-[#F7EFE7]">{service?.name || '—'}</span></span>
                    <span>Data: <span className="text-[#F7EFE7]">{appt.requested_date || '—'}</span></span>
                    <span>Hora: <span className="text-[#F7EFE7]">{appt.requested_time || '—'}</span></span>
                    {appt.notes && <span className="col-span-2">Obs: <span className="text-[#F7EFE7]">{appt.notes}</span></span>}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {appt.status !== 'confirmed' && (
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => handleApptStatus(appt.id, 'confirmed')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                      >
                        Confirmar
                      </button>
                    )}
                    {appt.status !== 'proposed' && (
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => handleApptStatus(appt.id, 'proposed')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                      >
                        Propor
                      </button>
                    )}
                    {appt.status !== 'completed' && (
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => handleApptStatus(appt.id, 'completed')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                      >
                        Concluir
                      </button>
                    )}
                    {appt.status !== 'cancelled' && (
                      <button
                        disabled={updatingId === appt.id}
                        onClick={() => handleApptStatus(appt.id, 'cancelled')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Comprovantes */}
      <section>
        <h3 className="text-xs font-black text-[#A89F96] uppercase tracking-widest mb-1">
          Comprovantes Pendentes ({proofs.filter((p) => p.status === 'pending_verification').length})
        </h3>
        <p className="text-[10px] text-amber-400 font-bold mb-3">
          Comprovante informado pelo cliente. Verificação manual do Guardião necessária.
        </p>
        {proofs.length === 0 ? (
          <div className="p-6 bg-[#10131A] border border-[#252936] rounded-2xl text-[#A89F96] text-sm">
            Nenhum comprovante encontrado.
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map((proof) => {
              const client = proof.clients as any;
              const appt = proof.appointments as any;
              const service = appt?.services as any;
              return (
                <div key={proof.id} className="p-5 bg-[#10131A] border border-[#252936] rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-bold text-[#F7EFE7]">{client?.name || 'Cliente'}</p>
                      <p className="text-xs text-[#A89F96]">{client?.phone || '—'}</p>
                    </div>
                    <StatusBadge status={proof.status} type="proof" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#A89F96]">
                    <span>Referência: <span className="text-[#F7EFE7]">{proof.reference || '—'}</span></span>
                    <span>Valor: <span className="text-[#F7EFE7]">{proof.amount != null ? `R$ ${Number(proof.amount).toFixed(2)}` : '—'}</span></span>
                    <span>Serviço: <span className="text-[#F7EFE7]">{service?.name || '—'}</span></span>
                    <span>Envio: <span className="text-[#F7EFE7]">{proof.created_at ? proof.created_at.slice(0, 10) : '—'}</span></span>
                    {proof.notes && <span className="col-span-2">Obs: <span className="text-[#F7EFE7]">{proof.notes}</span></span>}
                  </div>

                  {proof.status === 'pending_verification' && (
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={updatingId === proof.id}
                        onClick={() => handleProofStatus(proof.id, 'verified')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                      >
                        Marcar Verificado
                      </button>
                      <button
                        disabled={updatingId === proof.id}
                        onClick={() => handleProofStatus(proof.id, 'rejected')}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Rejeitar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
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
