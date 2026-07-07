import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, FileText, CheckCircle2, Clock, XCircle, Upload, AlertCircle } from 'lucide-react';

// Tipagens baseadas no modelo fornecido
type AppointmentStatus = 'proposed' | 'confirmed' | 'cancelled';
type OrderStatus = 'quoted' | 'confirmed' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending_verification' | 'confirmed' | 'rejected';

interface Appointment {
  id: string;
  service_name: string;
  starts_at: string;
  price: number | null;
  status: AppointmentStatus;
  client_response?: 'accepted' | 'refused';
}

interface Payment {
  id: string;
  order_id: string;
  status: PaymentStatus;
}

interface Order {
  id: string;
  description: string;
  status: OrderStatus;
  price: number | null;
}

interface PortalData {
  client_name?: string;
  appointments: Appointment[];
  orders: Order[];
  payments: Payment[];
}

const STATUS_MAP = {
  appointments: {
    proposed: { label: 'Aguardando sua resposta', color: 'bg-amber-900/50 text-amber-400 border-amber-900' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-900/50 text-emerald-400 border-emerald-900' },
    cancelled: { label: 'Cancelado', color: 'bg-red-900/50 text-red-400 border-red-900' },
  },
  orders: {
    quoted: 'Orçamento',
    confirmed: 'Confirmado',
    delivered: 'Entregue',
    cancelled: 'Cancelado',
  },
  payments: {
    pending_verification: { label: 'Aguardando verificação', color: 'bg-amber-900/50 text-amber-400 border-amber-900' },
    confirmed: { label: 'Confirmado', color: 'bg-emerald-900/50 text-emerald-400 border-emerald-900' },
    rejected: { label: 'Não aceito', color: 'bg-red-900/50 text-red-400 border-red-900' },
  }
};

const formatMoney = (val: number | null) => 
  val == null ? '' : ` · R$ ${val.toFixed(2).replace('.', ',')}`;

const formatDate = (dateStr: string) => 
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dateStr));

export default function ClientPortal() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Para fins de mock, se não houver token mas estivermos no ambiente de dev, vamos gerar dados fake.
    // Em produção, deve redirecionar ou mostrar erro.
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token && import.meta.env.PROD) {
          throw new Error('invalid_token');
        }

        // Simulação de chamada de API
        // const res = await fetch(`/api/kuan-yin/client-portal/${token}`);
        
        // MOCK DATA
        setTimeout(() => {
          setData({
            client_name: 'Visitante',
            appointments: [
              {
                id: '1',
                service_name: 'Sessão Inicial',
                starts_at: new Date(Date.now() + 86400000).toISOString(),
                price: 150.00,
                status: 'proposed'
              },
              {
                id: '2',
                service_name: 'Retorno',
                starts_at: new Date(Date.now() - 86400000).toISOString(),
                price: 0,
                status: 'confirmed'
              }
            ],
            orders: [
              {
                id: 'o1',
                description: 'Pacote Mensal',
                price: 450.00,
                status: 'quoted'
              }
            ],
            payments: [
              {
                id: 'p1',
                order_id: 'o1',
                status: 'pending_verification'
              }
            ]
          });
          setLoading(false);
        }, 1000);

      } catch (err: any) {
        if (err.message === 'invalid_token') {
          setError('Link inválido ou expirado. Peça um novo link a Kuan.');
        } else {
          setError('Não consegui carregar seus dados agora. Tente novamente em instantes.');
        }
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  const handleRespondAppointment = async (id: string, response: 'accepted' | 'refused') => {
    // API real: await fetch(`/api/appointments/${id}/respond`, ...)
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        appointments: prev.appointments.map(app => 
          app.id === id ? { ...app, client_response: response, status: response === 'accepted' ? 'confirmed' : 'cancelled' } : app
        )
      };
    });
  };

  const handleSendProof = async (orderId: string, amount: number, ref: string) => {
    // API real: await fetch(`/api/payment-proof`, ...)
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        payments: [
          ...prev.payments,
          { id: Math.random().toString(), order_id: orderId, status: 'pending_verification' }
        ]
      };
    });
    alert('Comprovante enviado com sucesso!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060408] text-[#F8E8F4] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#BE185D]/20 border-t-[#BE185D] rounded-full animate-spin mb-4"></div>
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
            <h1 className="font-bold text-[#DB2777] leading-tight text-sm uppercase tracking-widest">{slug?.replace(/-/g, ' ') || 'Kuan-Yin'}</h1>
            <p className="text-xs text-[#AB7DA0] font-medium">
              {data?.client_name ? `Olá, ${data.client_name}` : 'Seu atendimento'}
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

        {data?.appointments && data.appointments.length > 0 && (
          <section className="bg-[#130618] border border-[#2E0D3A] rounded-2xl overflow-hidden shadow-xl shadow-black/50 transition-all">
            <div className="bg-[#1A0822] px-5 py-3 border-b border-[#2E0D3A] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#AB7DA0]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#AB7DA0]">Agendamentos</h2>
            </div>
            
            <div className="divide-y divide-[#2E0D3A]">
              {data.appointments.map(appt => (
                <div key={appt.id} className="p-5 hover:bg-[#1A0822]/50 transition-colors">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-bold text-[15px]">{appt.service_name}</h3>
                      <p className="text-sm text-[#AB7DA0] mt-1 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> 
                        {formatDate(appt.starts_at)}{formatMoney(appt.price)}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_MAP.appointments[appt.status].color}`}>
                      {STATUS_MAP.appointments[appt.status].label}
                    </span>
                  </div>

                  {appt.status === 'proposed' && !appt.client_response && (
                    <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-[#2E0D3A]/50">
                      <button 
                        onClick={() => handleRespondAppointment(appt.id, 'accepted')}
                        className="flex-1 bg-[#BE185D] hover:bg-[#9D174D] text-white py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#BE185D]/20"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Confirmar horário
                      </button>
                      <button 
                        onClick={() => handleRespondAppointment(appt.id, 'refused')}
                        className="flex-1 bg-transparent border border-[#2E0D3A] text-[#AB7DA0] hover:text-[#F8E8F4] hover:bg-[#2E0D3A] py-2.5 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Recusar
                      </button>
                    </div>
                  )}

                  {appt.client_response === 'accepted' && (
                    <p className="text-sm text-[#6EE7B7] mt-3 font-medium bg-[#064E3B]/20 p-2 rounded-lg border border-[#064E3B]/50 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Confirmado! O profissional finalizará em breve.
                    </p>
                  )}
                  {appt.client_response === 'refused' && (
                    <p className="text-sm text-[#F87171] mt-3 font-medium">
                      Você recusou este horário. Kuan tentará outra opção.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {data?.orders && data.orders.length > 0 && (
          <section className="bg-[#130618] border border-[#2E0D3A] rounded-2xl overflow-hidden shadow-xl shadow-black/50 transition-all">
            <div className="bg-[#1A0822] px-5 py-3 border-b border-[#2E0D3A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#AB7DA0]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#AB7DA0]">Meus Pedidos</h2>
            </div>

            <div className="divide-y divide-[#2E0D3A]">
              {data.orders.map(order => {
                const orderPayments = data.payments.filter(p => p.order_id === order.id);
                const hasConfirmed = orderPayments.some(p => p.status === 'confirmed');
                const hasPending = orderPayments.some(p => p.status === 'pending_verification');

                return (
                  <div key={order.id} className="p-5">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-[15px]">{order.description}</h3>
                        <p className="text-sm text-[#AB7DA0] mt-1">
                          {STATUS_MAP.orders[order.status]}{formatMoney(order.price)}
                        </p>
                      </div>
                    </div>

                    {orderPayments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {orderPayments.map(payment => (
                          <span key={payment.id} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_MAP.payments[payment.status].color}`}>
                            Pagamento: {STATUS_MAP.payments[payment.status].label}
                          </span>
                        ))}
                      </div>
                    )}

                    {!hasConfirmed && order.status !== 'cancelled' && (
                      <ProofForm 
                        orderPrice={order.price || 0} 
                        hasPending={hasPending} 
                        onSubmit={(amt, ref) => handleSendProof(order.id, amt, ref)} 
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

function ProofForm({ orderPrice, hasPending, onSubmit }: { orderPrice: number, hasPending: boolean, onSubmit: (amt: number, ref: string) => void }) {
  const [amount, setAmount] = useState(orderPrice.toString());
  const [ref, setRef] = useState('');
  
  return (
    <div className="bg-[#0B0610] p-4 rounded-xl border border-[#2E0D3A] mt-2">
      <p className="text-xs text-[#AB7DA0] uppercase tracking-wider font-bold mb-3">Enviar Comprovante (Pix)</p>
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
          <label className="text-[10px] uppercase text-gray-500 font-bold ml-1">Referência / Código</label>
          <input 
            type="text" 
            placeholder="Ex: Banco Nu, código..."
            value={ref}
            onChange={e => setRef(e.target.value)}
            className="w-full bg-[#130618] border border-[#2E0D3A] rounded-lg px-4 py-2.5 text-sm text-[#F8E8F4] focus:outline-none focus:border-[#BE185D] focus:ring-1 focus:ring-[#BE185D] transition-all" 
          />
        </div>
        <button 
          onClick={() => onSubmit(Number(amount), ref)}
          className="w-full bg-white/5 hover:bg-white/10 border border-[#2E0D3A] hover:border-[#BE185D]/50 text-[#F8E8F4] py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {hasPending ? 'Enviar outro comprovante' : 'Anexar comprovante'}
        </button>
      </div>
    </div>
  );
}
