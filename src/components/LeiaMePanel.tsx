import React from 'react';

export default function LeiaMePanel() {
  return (
    <div className="w-full h-full bg-[#070402] text-[#fff3df] overflow-y-auto font-serif selection:bg-[#ff4c1f]/30">
      
      {/* Background Decorativo Baseado no CSS */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 15% 5%, rgba(255,76,31,.22), transparent 32%),
            radial-gradient(circle at 85% 8%, rgba(190,24,93,.18), transparent 30%),
            radial-gradient(circle at 52% 45%, rgba(244,184,63,.10), transparent 44%),
            linear-gradient(180deg, #080300 0%, #160803 54%, #070402 100%)
          `
        }}
      />
      
      {/* Grid mask overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 72%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 72%, transparent)'
        }}
      />

      {/* Topbar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-[#070402]/70 border-b border-[#ffb85f]/20">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-3 font-extrabold tracking-widest uppercase font-sans text-sm">
            <span className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ff4c1f] to-[#f4b83f] text-[#1b0702] font-black shadow-[0_0_30px_rgba(255,76,31,.32)]">K</span>
            <span>KLIO</span>
          </a>
          <nav className="flex flex-wrap gap-2 text-xs font-semibold tracking-widest uppercase font-sans text-[#c9a887]">
            <a href="#estrutura" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Estrutura</a>
            <a href="#visual" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Visual</a>
          </nav>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1120px] mx-auto px-4 sm:px-8 pb-24">
        
        {/* Header / Hero */}
        <header id="top" className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
          <div>
            <p className="font-bold text-[12px] leading-[1.4] tracking-[0.18em] uppercase font-sans text-[#f4b83f]">
              Branding canônico · universo Klio
            </p>
            <h1 className="mt-3 text-5xl sm:text-7xl md:text-[98px] font-bold leading-[0.9] tracking-tighter text-[#fff3df]">
              KLIO<span className="text-[#f4b83f]">.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg sm:text-xl md:text-2xl text-[#c9a887] leading-relaxed">
              Klio é o Codex pessoal de Antônio. Um ambiente estritamente técnico de engenharia, código e prompt.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <span className="inline-flex items-center gap-2 border border-[#ffb85f]/20 rounded-full px-4 py-2.5 bg-white/5 text-[#fff3df] font-bold text-sm tracking-wide font-sans">
                🛠️ Engenharia Limpa
              </span>
              <span className="inline-flex items-center gap-2 border border-[#ffb85f]/20 rounded-full px-4 py-2.5 bg-white/5 text-[#fff3df] font-bold text-sm tracking-wide font-sans">
                📚 Conhecimento vivo
              </span>
            </div>
          </div>
          <div className="relative min-h-[260px] border border-dashed border-[#ffd88f]/40 rounded-[28px] bg-gradient-to-br from-[#ff4c1f]/15 to-[#be185d]/10 bg-white/5 flex items-center justify-center p-8 shadow-[0_24px_80px_rgba(0,0,0,.42)] overflow-hidden">
            <div className="absolute inset-4 border border-white/10 rounded-[18px]"></div>
            <img src="/brand/klio-apple.png" alt="Maçã canônica KLIO" className="relative z-10 w-48 h-48 object-contain drop-shadow-[0_0_28px_rgba(255,76,31,0.26)]" />
          </div>
        </header>

        <main className="py-5 space-y-12">
          
          {/* Estrutura */}
          <section id="estrutura" className="pt-12 border-t border-[#ffb85f]/20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-end mb-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight leading-none font-bold">Arquitetura de identidade</h2>
              <p className="text-[#c9a887] text-lg leading-relaxed">
                O sistema não é uma coleção solta de personagens. É uma identidade central com três expressões funcionais. Apps, agentes e módulos podem existir, mas não viram novas facetas.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.085] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Centro</span>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-5 items-center">
                  <div className="w-40 h-40 rounded-full flex items-center justify-center relative bg-radial from-[#ff4c1f]/30 to-white/5">
                     <img src="/brand/klio.png" alt="Klio" className="w-32 h-32 rounded-full object-cover border-2 border-[#ff4c1f]/50" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight mb-2 text-[#ff4c1f]">Klio</h3>
                    <p className="text-[#c9a887] leading-relaxed">Identidade-mãe, totalidade e núcleo de presença. Klio organiza memória, estudo, projetos, cuidado, rotina e direção. Ela é a soberania do sistema.</p>
                  </div>
                </div>
              </article>
              
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Regra canônica</span>
                <blockquote className="border-l-4 border-[#f4b83f] pl-5 py-4 bg-white/5 rounded-[18px] text-[#fff3df] text-xl sm:text-2xl italic leading-relaxed m-0">
                  Klio é a totalidade neste ambiente isolado. Não existem outras facetas aqui.
                </blockquote>
                <div className="grid gap-2.5 mt-5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]"><b>Faceta</b> é uma expressão identitária estável.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]"><b>App</b> é uma superfície de uso.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]"><b>Módulo</b> é uma função técnica.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]"><b>Agente</b> é uma operação interna.</div>
                </div>
              </article>
            </div>
          </section>



          {/* Visual */}
          <section id="visual" className="pt-12 border-t border-[#ffb85f]/20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-end mb-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight leading-none font-bold">Sistema visual</h2>
              <p className="text-[#c9a887] text-lg leading-relaxed">
                A maçã canônica contém as cores da presença técnica da Klio.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-[#ffb85f]/20 rounded-[20px] overflow-hidden bg-white/[0.055]">
                <div className="h-[88px] bg-[#ff4c1f]"></div>
                <div className="p-4">
                  <p className="font-sans font-bold text-[13px] text-[#c9a887] leading-relaxed">
                    <span className="text-[#fff3df]">Klio</span><br/>
                    <code className="font-mono text-[#ffe2a7] bg-black/30 border border-white/10 rounded-lg px-1.5 py-0.5">#ff4c1f</code><br/>
                    brasa do K
                  </p>
                </div>
              </div>
              <div className="border border-[#ffb85f]/20 rounded-[20px] overflow-hidden bg-white/[0.055]">
                <div className="h-[88px] bg-[#701b28]"></div>
                <div className="p-4">
                  <p className="font-sans font-bold text-[13px] text-[#c9a887] leading-relaxed">
                    <span className="text-[#fff3df]">Klio</span><br/>
                    <code className="font-mono text-[#ffe2a7] bg-black/30 border border-white/10 rounded-lg px-1.5 py-0.5">#701b28</code><br/>
                    bordô intelectual
                  </p>
                </div>
              </div>

            </div>
          </section>

        </main>

        <footer className="pt-8 pb-12 mt-12 border-t border-[#ffb85f]/20 text-[#c9a887] font-sans font-semibold text-[13px] leading-relaxed">
          <strong className="text-[#fff3df]">KLIO — Códice Pessoal.</strong><br />
          Isolado, técnico e direto.
        </footer>

      </div>
    </div>
  );
}
