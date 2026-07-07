import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, CheckCircle2, Clock, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { kuanyinClient } from './lib/kuanyinClient';

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  requested: { label: 'Em análise', color: 'bg-blue-900/50 text-blue-400 border-blue-900' },
  proposed: { label: 'Proposto', color: 'bg-amber-900/50 text-amber-400 border-amber-900' },
  confirmed: { label: 'Confirmado', color: 'bg-emerald-900/50 text-emerald-400 border-emerald-900' },
  cancelled: { label: 'Cancelado', color: 'bg-red-900/50 text-red-400 border-red-900' },
  completed: { label: 'Concluído', color: 'bg-gray-900/50 text-gray-400 border-gray-900' },
};

const formatMoney = (val: number | null) => 
  val == null ? '' : ` · R$ ${val.toFixed(2).replace('.', ',')}`;

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'A definir';
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateStr));
};

export default function ClientPortal() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [client, setClient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      if (!token) {
        setError('Link inválido ou ausente. Peça um novo link a Kuan.');
        setLoading(false);
        return;
      }
      const res = await kuanyinClient.getClientPortalByToken(token);
      if (res.error) {
        setError(res.error);
      } else {
        setClient(res.client);
        setAppointments(res.appointments || []);
      }
      setLoading(false);
    };

    loadData();
  }, [token]);

  const handleSendProof = async (appointmentId: string, amount: number, ref: string) => {
    if (!client) return;
    const res = await kuanyinClient.sendPaymentProof({
      appointment_id: appointmentId,
      client_id: client.id,
      amount,
      reference: ref
    });
    if (res.error) {
      alert("Erro: " + res.error);
    } else {
      alert('Comprovante enviado com sucesso! O guardião fará a verificação em breve.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060408] text-[#F8E8F4] flex flex-col items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-[#BE185D] mb-4" />
        <p className="text-[#AB7DA0] animate-pulse">Carregando seu portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060408] text-[#F8E8F4] font-sans selection:bg-[#BE185D]/30">
      <header className="sticky top-0 z-50 bg-[#060408]/80 backdrop-blur-xl border-b border-[#2E0D3A] p-4 flex items-center gap-4">
        <Link to=".." className="w-10 h-10 flex items-center justify-center text-[#AB7DA0] hover:text-[#F8E8F4] hover:bg-[#2E0D3A]/50 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#BE185D] to-[#DB2777] p-[2px] shadow-lg shadow-[#BE185D]/20">
            <div className="w-full h-full rounded-full bg-[#060408] flex items-center justify-center font-serif font-bold text-[#F8E8F4]">
              {slug?.charAt(0).toUpperCase() || 'K'}
            </div>
          </div>
          <div>
            <h1 className="font-bold text-[#DB2777] leading-tight text-sm uppercase tracking-widest">{client?.businesses?.name || slug?.replace(/-/g, ' ')}</h1>
            <p className="text-xs text-[#AB7DA0] font-medium">
              {client?.name ? `Olá, ${client.name}` : 'Seu atendimento'}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 flex flex-col gap-6 max-w-2xl mx-auto pt-6 pb-20">
        
        {error && (
          <div className="bg-[#1A0B0F] border border-[#7F1D1D] text-[#F87171] p-4 rounded-xl flex items-start gap-3 shadow-lg shadow-red-900/10">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {appointments.length > 0 ? (
          <section className="bg-[#130618] border border-[#2E0D3A] rounded-2xl overflow-hidden shadow-xl shadow-black/50 transition-all">
            <div className="bg-[#1A0822] px-5 py-3 border-b border-[#2E0D3A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#AB7DA0]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#AB7DA0]">Meus Agendamentos</h2>
            </div>
            
            <div className="divide-y divide-[#2E0D3A]">
              {appointments.map(appt => (
                <div key={appt.id} className="p-5 hover:bg-[#1A0822]/50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-[15px]">{appt.services?.name || 'Atendimento Personalizado'}</h3>
                      <p className="text-sm text-[#AB7DA0] mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 
                        {formatDate(appt.starts_at || appt.requested_date)}{formatMoney(appt.services?.price)}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_MAP[appt.status]?.color || 'border-gray-500 text-gray-500'}`}>
                      {STATUS_MAP[appt.status]?.label || appt.status}
                    </span>
                  </div>

                  {appt.status === 'confirmed' && (
                    <p className="text-sm text-[#6EE7B7] mt-3 font-medium bg-[#064E3B]/20 p-2 rounded-lg border border-[#064E3B]/50 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Horário confirmado pelo negócio!
                    </p>
                  )}

                  {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                    <ProofForm 
                      orderPrice={appt.services?.price || 0} 
                      onSubmit={(amt, ref) => handleSendProof(appt.id, amt, ref)} 
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : (
          !error && <p className="text-[#AB7DA0] text-center mt-10">Nenhum agendamento encontrado.</p>
        )}
      </main>
    </div>
  );
}

function ProofForm({ orderPrice, onSubmit }: { orderPrice: number, onSubmit: (amt: number, ref: string) => void }) {
  const [amount, setAmount] = useState(orderPrice ? orderPrice.toString() : '');
  const [ref, setRef] = useState('');
  
  return (
    <div className="bg-[#0B0610] p-4 rounded-xl border border-[#2E0D3A] mt-4">
      <p className="text-xs text-[#AB7DA0] uppercase tracking-wider font-bold mb-3">Informar Pagamento (Pix / Transf.)</p>
      <div className="space-y-3">
        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Valor Pago (R$)</label>
          <input 
            type="number" 
            step="0.01" 
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-[#130618] border border-[#2E0D3A] rounded-lg px-4 py-2.5 text-sm text-[#F8E8F4] focus:outline-none focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] transition-all" 
          />
        </div>
        <div>
          <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Referência / Código / ID</label>
          <input 
            type="text" 
            placeholder="Ex: Pagamento Nubank id 123..."
            value={ref}
            onChange={e => setRef(e.target.value)}
            className="w-full bg-[#130618] border border-[#2E0D3A] rounded-lg px-4 py-2.5 text-sm text-[#F8E8F4] focus:outline-none focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] transition-all" 
          />
        </div>
        <button 
          onClick={() => {
            if (!amount || !ref) return alert('Preencha o valor e a referência');
            onSubmit(Number(amount), ref);
            setAmount('');
            setRef('');
          }}
          className="w-full bg-white/5 hover:bg-white/10 border border-[#2E0D3A] hover:border-[#BE185D]/50 text-[#F8E8F4] py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Avisar Pagamento
        </button>
      </div>
    </div>
  );
}
