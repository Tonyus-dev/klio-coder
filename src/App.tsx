import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import KalineDashboard from './KalineDashboard';
import GuardianApp from './GuardianApp';
import GuardianLogin from './GuardianLogin';
import KuanPublicApp from './KuanPublicApp';

// Mock Placeholders para a nova arquitetura
const Landing = () => (
  <div className="min-h-screen bg-[#06070A] text-[#F7EFE7] flex flex-col items-center justify-center p-6">
    <h1 className="text-4xl font-serif font-bold text-[#FF4C1F] mb-4">Kuan by Kaline 🪷</h1>
    <p className="text-[#A89F96] text-center max-w-md">
      A presença digital simples e inteligente para o seu negócio.
      Página pública, agendamento, pagamento e atendimento Kuan.
    </p>
    <a href="/app/login" className="mt-8 px-6 py-3 bg-[#FF4C1F] text-[#F7EFE7] rounded-xl font-bold hover:bg-[#E03C12] transition-colors">
      Entrar como Guardião
    </a>
  </div>
);

// Mocks for Public Pages

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Pública do SaaS */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard original da Kaline movido para /kaline */}
        <Route path="/kaline" element={<KalineDashboard />} />
        
        {/* Rota admin legado caso acesse */}
        <Route path="/admin" element={<Navigate to="/kaline" replace />} />

        {/* Rotas Privadas do SaaS (Guardião) */}
        <Route path="/app/login" element={<GuardianLogin />} />
        <Route path="/app/*" element={<GuardianApp />} />

        {/* Rotas Públicas dos Negócios (Clientes) */}
        <Route path="/g/:slug/*" element={<KuanPublicApp />} />
      </Routes>
    </BrowserRouter>
  );
}
