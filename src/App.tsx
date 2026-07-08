import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import KlioDashboard from './KlioDashboard';

// Mock Placeholders para a nova arquitetura
const Landing = () => (
  <div className="min-h-screen bg-[#06070A] text-[#F7EFE7] flex flex-col items-center justify-center p-6">
    <h1 className="text-4xl font-serif font-bold text-[#FF4C1F] mb-4">Klio Coder 🪧</h1>
    <p className="text-[#A89F96] text-center max-w-md">
      Ambiente técnico pessoal.
    </p>
    <a href="/klio" className="mt-8 px-6 py-3 bg-[#FF4C1F] text-[#F7EFE7] rounded-xl font-bold hover:bg-[#E03C12] transition-colors">
      Abrir Klio
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

        {/* Dashboard da Klio movido para /klio */}
        <Route path="/klio" element={<KlioDashboard />} />
        
        {/* Rota admin legado caso acesse */}
        <Route path="/admin" element={<Navigate to="/klio" replace />} />
        <Route path="/Klio" element={<Navigate to="/klio" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
