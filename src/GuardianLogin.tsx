import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function GuardianLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tenta o login real no Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback de MOCK para que você possa testar a interface sem ter configurado o Supabase ainda
        if (email === 'admin@kuan.com' && password === 'admin') {
          console.log('Login via MOCK bem-sucedido!');
          navigate('/app/dashboard');
          return;
        }
        
        throw error;
      }

      // Login real bem-sucedido
      navigate('/app/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente admin@kuan.com / admin para testar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070A] text-[#F7EFE7] flex flex-col items-center justify-center p-6 selection:bg-[#FF4C1F]/30 relative overflow-hidden">
      
      {/* Background Decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF4C1F] opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden mx-auto mb-6 bg-[#10131A] border border-[#252936]">
            <img 
              src="/brand/kaline-apple.png" 
              alt="Kaline Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '🜂';
              }} 
            />
          </div>
          <h1 className="text-3xl font-serif font-black text-[#F7EFE7] tracking-widest">K∧LINE</h1>
          <p className="text-[#A89F96] mt-2 text-sm uppercase tracking-widest font-bold">Estação de Comando</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#10131A] border border-[#252936] p-8 rounded-3xl shadow-2xl shadow-black/50 backdrop-blur-xl">
          
          {error && (
            <div className="mb-6 p-4 bg-[#1A0B0F] border border-[#7F1D1D] text-[#F87171] rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89F96]" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Seu e-mail de acesso"
                  className="w-full bg-[#0B0D12] border border-[#252936] rounded-xl pl-12 pr-4 py-3.5 text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F] focus:ring-1 focus:ring-[#FF4C1F] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#A89F96] uppercase tracking-wider block mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A89F96]" />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="w-full bg-[#0B0D12] border border-[#252936] rounded-xl pl-12 pr-4 py-3.5 text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F] focus:ring-1 focus:ring-[#FF4C1F] transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-[#FF4C1F] hover:bg-[#E03C12] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF4C1F]/20 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Entrar na Estação
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-[#A89F96] mt-8">
          Acesso restrito aos Guardiões da Estação.
        </p>
      </div>
    </div>
  );
}
