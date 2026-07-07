import { Routes, Route, Link, useParams } from 'react-router-dom';
import { MessageSquare, Calendar, UserCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { kuanyinClient } from './lib/kuanyinClient';
import ClientPortal from './ClientPortal';

const BusinessStorefront = () => {
  const { slug } = useParams();
  const [biz, setBiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      kuanyinClient.getBusinessBySlug(slug).then(res => {
        setBiz(res);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-[#F7EFE7] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#BE185D]" /></div>;
  
  if (!biz) return (
    <div className="min-h-screen bg-[#F7EFE7] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-serif font-black text-[#06070A] mb-4">Negócio não encontrado</h1>
      <p className="text-gray-600 mb-8">Verifique a URL e tente novamente.</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7EFE7] text-[#06070A] flex flex-col items-center p-8 shadow-2xl relative">
      <div className="w-24 h-24 rounded-full bg-[#BE185D] text-white flex items-center justify-center text-3xl font-serif font-bold shadow-xl mb-6">
        {biz.name.charAt(0).toUpperCase()}
      </div>
      
      <h1 className="text-3xl font-serif font-black text-[#BE185D] mb-2 text-center capitalize">
        {biz.name}
      </h1>
      <p className="text-center text-gray-600 mb-8 font-medium">
        {biz.description || 'Bem-vindo(a) ao nosso espaço de atendimento digital.'}
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
              <p className="text-xs text-gray-500">Tirar dúvidas</p>
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
              <h3 className="font-bold text-gray-900 group-hover:text-[#BE185D] transition-colors">Solicitar Atendimento</h3>
              <p className="text-xs text-gray-500">Ver serviços e agendar</p>
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

const KuanServicesView = () => {
  const { slug } = useParams();
  const [biz, setBiz] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  
  // form
  const [selectedService, setSelectedService] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [portalLink, setPortalLink] = useState('');

  useEffect(() => {
    if (slug) {
      kuanyinClient.getBusinessBySlug(slug).then(res => {
        setBiz(res);
        if (res) {
          kuanyinClient.getServicesByBusinessId(res.id).then(s => setServices(s));
        }
      });
    }
  }, [slug]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!biz || !selectedService || !name || !phone) return;
    setSubmitting(true);
    
    const res = await kuanyinClient.createAppointmentRequest({
      business_id: biz.id,
      service_id: selectedService,
      name,
      phone
    });

    setSubmitting(false);
    if (res.portalToken) {
      setPortalLink(`/g/${slug}/portal?token=${res.portalToken}`);
    } else {
      alert("Erro ao solicitar atendimento.");
    }
  };

  if (portalLink) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#F7EFE7] p-8 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-6">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitação Enviada!</h2>
        <p className="text-gray-600 mb-8">Sua solicitação de atendimento foi registrada.</p>
        <Link to={portalLink} className="w-full block text-center px-6 py-4 bg-[#BE185D] text-white rounded-xl font-bold">
          Acessar Meu Portal
        </Link>
        <p className="text-xs text-gray-500 mt-4">Guarde o link do portal para acompanhar o status.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F7EFE7] text-[#06070A] flex flex-col shadow-2xl">
      <header className="p-4 bg-white border-b border-gray-100 flex items-center gap-4">
        <Link to=".." className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-full bg-gray-50">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-bold text-gray-900 leading-tight">Solicitar Atendimento</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Serviço Desejado</label>
            <select value={selectedService} onChange={e => setSelectedService(e.target.value)} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#BE185D]">
              <option value="" disabled>Selecione um serviço...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - R$ {s.price?.toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Seu Nome</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#BE185D]" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Seu Telefone / WhatsApp</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#BE185D]" />
          </div>
          
          <button type="submit" disabled={submitting || !selectedService} className="w-full mt-4 px-6 py-4 bg-[#BE185D] text-white rounded-xl font-bold disabled:opacity-50">
            {submitting ? 'Enviando...' : 'Solicitar Atendimento'}
          </button>
        </form>
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
            <p className="text-[10px] uppercase tracking-widest text-[#BE185D] font-bold">Assistente</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex justify-start">
          <div className="max-w-[85%] bg-white p-3 rounded-2xl rounded-tl-sm border border-[#BE185D]/20 shadow-sm text-sm">
            O chat inteligente será liberado em breve. Por enquanto, utilize o botão "Nossos Serviços" para solicitar atendimento.
          </div>
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
      <Route path="/servicos" element={<KuanServicesView />} />
      <Route path="/portal" element={<ClientPortal />} />
      <Route path="*" element={<BusinessStorefront />} />
    </Routes>
  );
}
