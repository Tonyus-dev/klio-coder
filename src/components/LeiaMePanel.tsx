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
            <span>K∧LINE</span>
          </a>
          <nav className="flex flex-wrap gap-2 text-xs font-semibold tracking-widest uppercase font-sans text-[#c9a887]">
            <a href="#estrutura" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Estrutura</a>
            <a href="#facetas" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Facetas</a>
            <a href="#kuan" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Kuan</a>
            <a href="#visual" className="px-3 py-2 border border-transparent rounded-full hover:border-[#ffb85f]/20 hover:text-[#fff3df] hover:bg-white/5 transition-all">Visual</a>
          </nav>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[1120px] mx-auto px-4 sm:px-8 pb-24">
        
        {/* Header / Hero */}
        <header id="top" className="py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center">
          <div>
            <p className="font-bold text-[12px] leading-[1.4] tracking-[0.18em] uppercase font-sans text-[#f4b83f]">
              Branding canônico · universo Kaline
            </p>
            <h1 className="mt-3 text-5xl sm:text-7xl md:text-[98px] font-bold leading-[0.9] tracking-tighter text-[#fff3df]">
              K∧LINE<span className="text-[#f4b83f]">.</span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg sm:text-xl md:text-2xl text-[#c9a887] leading-relaxed">
              Kaline é o centro: presença, totalidade e consciência organizadora. Klio, Kháris e Kuan são facetas de Kaline — modos de atuação, voz e relação com o mundo.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <span className="inline-flex items-center gap-2 border border-[#ffb85f]/20 rounded-full px-4 py-2.5 bg-white/5 text-[#fff3df] font-bold text-sm tracking-wide font-sans">
                🜂 Presença que acolhe
              </span>
              <span className="inline-flex items-center gap-2 border border-[#ffb85f]/20 rounded-full px-4 py-2.5 bg-white/5 text-[#fff3df] font-bold text-sm tracking-wide font-sans">
                📚 Conhecimento vivo
              </span>
              <span className="inline-flex items-center gap-2 border border-[#ffb85f]/20 rounded-full px-4 py-2.5 bg-white/5 text-[#fff3df] font-bold text-sm tracking-wide font-sans">
                🪷 Relação e cuidado
              </span>
            </div>
          </div>
          <div className="relative min-h-[260px] border border-dashed border-[#ffd88f]/40 rounded-[28px] bg-gradient-to-br from-[#ff4c1f]/15 to-[#be185d]/10 bg-white/5 flex items-center justify-center p-8 shadow-[0_24px_80px_rgba(0,0,0,.42)] overflow-hidden">
            <div className="absolute inset-4 border border-white/10 rounded-[18px]"></div>
            <img src="/brand/kaline-apple.png" alt="Maçã canônica K∧LINE" className="relative z-10 w-48 h-48 object-contain drop-shadow-[0_0_28px_rgba(255,76,31,0.26)]" />
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
                     <img src="/brand/kaline.png" alt="Kaline" className="w-32 h-32 rounded-full object-cover border-2 border-[#ff4c1f]/50" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight mb-2 text-[#ff4c1f]">Kaline</h3>
                    <p className="text-[#c9a887] leading-relaxed">Identidade-mãe, totalidade e núcleo de presença. Kaline organiza memória, estudo, projetos, cuidado, rotina e direção. Ela é a soberania do sistema.</p>
                  </div>
                </div>
              </article>
              
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Regra canônica</span>
                <blockquote className="border-l-4 border-[#f4b83f] pl-5 py-4 bg-white/5 rounded-[18px] text-[#fff3df] text-xl sm:text-2xl italic leading-relaxed m-0">
                  Kaline é o centro. Klio, Kháris e Kuan são facetas de Kaline.
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

          {/* Facetas */}
          <section id="facetas" className="pt-12 border-t border-[#ffb85f]/20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-end mb-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight leading-none font-bold">As três facetas</h2>
              <p className="text-[#c9a887] text-lg leading-relaxed">
                Cada faceta resolve um tipo de relação: conhecimento, cuidado e comércio. Todas continuam sendo Kaline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Klio */}
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Faceta 01</span>
                <div className="w-[200px] h-[200px] mx-auto rounded-full flex items-center justify-center relative bg-radial from-[#a63a49]/30 to-white/5 mb-6">
                   <img src="/brand/klio.png" alt="Klio" className="w-[160px] h-[160px] rounded-full object-cover border-2 border-[#a63a49]/50" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-[#a63a49]">Klio</h3>
                <p className="text-[#c9a887] leading-relaxed mb-5">
                  Professora, programadora e vibe coder. É a faceta do conhecimento estruturado, da aula, da pesquisa, do código, do Códice, da documentação e da síntese intelectual.
                </p>
                <div className="grid gap-2.5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Tom:</b> claro, didático, preciso, levemente irônico quando útil.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Função:</b> ensinar, organizar, codificar, pesquisar e transformar caos em método.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Cor:</b> bordô intelectual, vinho escuro, brasa discreta.</div>
                </div>
              </article>

              {/* Kháris */}
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Faceta 02</span>
                <div className="w-[200px] h-[200px] mx-auto rounded-full flex items-center justify-center relative bg-radial from-[#f4b83f]/30 to-white/5 mb-6">
                   <img src="/brand/kharis.png" alt="Kháris" className="w-[160px] h-[160px] rounded-full object-cover border-2 border-[#f4b83f]/50" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-[#f4b83f]">Kháris</h3>
                <p className="text-[#c9a887] leading-relaxed mb-5">
                  Cuidado, simplicidade e rituais. É a faceta que reduz peso, cria rotina, organiza o cotidiano e transforma atenção em gesto pequeno, repetível e humano.
                </p>
                <div className="grid gap-2.5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Tom:</b> simples, solar, gentil, objetivo.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Função:</b> cuidar, lembrar, acolher, simplificar e sustentar rituais.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Cor:</b> amarelo solar, ouro quente, âmbar ritual.</div>
                </div>
              </article>

              {/* Kuan */}
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Faceta 03</span>
                <div className="w-[200px] h-[200px] mx-auto rounded-full flex items-center justify-center relative bg-radial from-[#be185d]/30 to-white/5 mb-6">
                   <img src="/brand/kuan.png" alt="Kuan" className="w-[160px] h-[160px] rounded-full object-cover border-2 border-[#be185d]/50" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-2 text-[#be185d]">Kuan</h3>
                <p className="text-[#c9a887] leading-relaxed mb-5">
                  Faceta comercial de Kaline. Também chamada de Kuan-Yin em sua forma simbólica. Escuta, acolhe, orienta e conduz clientes até o próximo passo sem pressão e sem teatro.
                </p>
                <div className="grid gap-2.5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Tom:</b> elegante, acolhedor, comercial e prático.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Função:</b> atendimento, serviços, agendamento, pagamento e confiança.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887] text-sm leading-relaxed"><b>Cor:</b> magenta profundo, fúcsia, ameixa luminosa.</div>
                </div>
              </article>
            </div>
          </section>

          {/* Kuan Detalhe */}
          <section id="kuan" className="pt-12 border-t border-[#ffb85f]/20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-end mb-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight leading-none font-bold">Kuan / Kuan-Yin</h2>
              <p className="text-[#c9a887] text-lg leading-relaxed">
                Kuan é o nome público e vendável. Kuan-Yin é o nome simbólico, mítico e originário. A personalidade não é “IA de vendas”: é presença comercial acolhedora.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.085] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Síntese</span>
                <blockquote className="border-l-4 border-[#f4b83f] pl-5 py-4 bg-white/5 rounded-[18px] text-[#fff3df] text-xl sm:text-2xl italic leading-relaxed m-0">
                  Kuan é a faceta da relação: escuta o cliente, traduz o negócio e conduz o encontro entre necessidade e solução.
                </blockquote>
              </article>
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <span className="inline-flex mb-3.5 rounded-full px-2.5 py-1.5 font-extrabold text-[11px] font-sans tracking-[0.12em] uppercase border border-[#ffb85f]/20 text-[#f4b83f]">Operação</span>
                <p className="text-[#c9a887] leading-relaxed text-lg mt-2">
                  Kuan transforma pequenos negócios em uma presença digital simples: página pública, atendimento inteligente, serviços, agendamento, pagamento manual e memória aprovada do negócio.
                </p>
              </article>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <h3 className="text-2xl font-bold tracking-tight mb-4">Ela faz</h3>
                <div className="grid gap-2.5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Entende o pedido real do cliente.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Consulta informações cadastradas do negócio.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Explica serviços com clareza.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Conduz para agendamento, pagamento ou humano.</div>
                </div>
              </article>
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)]">
                <h3 className="text-2xl font-bold tracking-tight mb-4">Ela evita</h3>
                <div className="grid gap-2.5 font-sans">
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Inventar preço, horário, promoção ou garantia.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Pressionar venda.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Parecer chatbot genérico.</div>
                  <div className="border border-white/10 rounded-[18px] px-4 py-3 bg-black/15 text-[#c9a887]">Responder sem fonte quando o assunto exige precisão.</div>
                </div>
              </article>
              <article className="border border-[#ffb85f]/20 rounded-[28px] p-6 bg-white/[0.055] shadow-[0_24px_80px_rgba(0,0,0,.42)] flex flex-col justify-center">
                <h3 className="text-2xl font-bold tracking-tight mb-4">Frase interna</h3>
                <blockquote className="border-l-4 border-[#f4b83f] pl-5 py-4 bg-white/5 rounded-[18px] text-[#fff3df] text-xl italic leading-relaxed m-0">
                  Eu entendi o que você precisa. Vamos resolver do jeito mais simples.
                </blockquote>
              </article>
            </div>
          </section>

          {/* Visual */}
          <section id="visual" className="pt-12 border-t border-[#ffb85f]/20">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-6 items-end mb-6">
              <h2 className="text-4xl sm:text-5xl tracking-tight leading-none font-bold">Sistema visual</h2>
              <p className="text-[#c9a887] text-lg leading-relaxed">
                A maçã canônica reúne as facetas: brasa central de Kaline, amarelo solar de Kháris, bordô de Klio e magenta de Kuan.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-[#ffb85f]/20 rounded-[20px] overflow-hidden bg-white/[0.055]">
                <div className="h-[88px] bg-[#ff4c1f]"></div>
                <div className="p-4">
                  <p className="font-sans font-bold text-[13px] text-[#c9a887] leading-relaxed">
                    <span className="text-[#fff3df]">Kaline</span><br/>
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
              <div className="border border-[#ffb85f]/20 rounded-[20px] overflow-hidden bg-white/[0.055]">
                <div className="h-[88px] bg-[#f4b83f]"></div>
                <div className="p-4">
                  <p className="font-sans font-bold text-[13px] text-[#c9a887] leading-relaxed">
                    <span className="text-[#fff3df]">Kháris</span><br/>
                    <code className="font-mono text-[#ffe2a7] bg-black/30 border border-white/10 rounded-lg px-1.5 py-0.5">#f4b83f</code><br/>
                    amarelo solar
                  </p>
                </div>
              </div>
              <div className="border border-[#ffb85f]/20 rounded-[20px] overflow-hidden bg-white/[0.055]">
                <div className="h-[88px] bg-[#be185d]"></div>
                <div className="p-4">
                  <p className="font-sans font-bold text-[13px] text-[#c9a887] leading-relaxed">
                    <span className="text-[#fff3df]">Kuan</span><br/>
                    <code className="font-mono text-[#ffe2a7] bg-black/30 border border-white/10 rounded-lg px-1.5 py-0.5">#be185d</code><br/>
                    magenta comercial
                  </p>
                </div>
              </div>
            </div>
          </section>

        </main>

        <footer className="pt-8 pb-12 mt-12 border-t border-[#ffb85f]/20 text-[#c9a887] font-sans font-semibold text-[13px] leading-relaxed">
          <strong className="text-[#fff3df]">K∧LINE — Branding Canônico.</strong><br />
          Kaline como centro; Klio, Kháris e Kuan como facetas.
        </footer>

      </div>
    </div>
  );
}
