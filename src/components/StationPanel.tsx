import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Settings, 
  Server, 
  Terminal, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { fetchHestiaStatus, getHestiaUrl, setHestiaUrl, HestiaStatus } from '../lib/station/hestia-client';
import { RuntimeEnvelope } from '../lib/runtime-status';

export default function StationPanel() {
  const [hestiaUrl, setHestiaUrlState] = useState<string>(() => getHestiaUrl());
  const [envelope, setEnvelope] = useState<RuntimeEnvelope<HestiaStatus> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const loadStatus = async () => {
    setLoading(true);
    const data = await fetchHestiaStatus(hestiaUrl);
    setEnvelope(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, [hestiaUrl]);

  const handleSaveAndTest = () => {
    setHestiaUrl(hestiaUrl);
    loadStatus();
  };

  const toggleService = (_svcName: string) => {
    // Toggle real de serviços requer endpoint POST na Héstia.
    // Desabilitado até existir endpoint real.
  };

  if (!envelope) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Aguardando Héstia Station...</p>
      </div>
    );
  }

  const isMock = envelope.status === 'mock';
  const isOffline = envelope.status === 'offline';
  const statusData = envelope.data;

  if (isOffline || !statusData) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-[#A89F96]">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Serviço offline</h2>
        <p>Nenhum dado real disponível no momento.</p>
        <button onClick={loadStatus} className="mt-6 px-4 py-2 border border-[#252936] rounded hover:bg-[#10131A]">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="hestia-station-view">
      {/* Header Banner */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(234,179,8,0.06)]">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${!isMock ? 'bg-emerald-400 text-[#10B981]' : 'bg-[#EAB308] text-[#EAB308] animate-pulse'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
              {!isMock ? 'Loopback Real' : 'Héstia não respondeu. Exibindo simulação local.'}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none flex items-center gap-2">
            Héstia Station
          </h1>
          <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
            Corpo físico da Klio. Servidor local físico de armazenamento `/Klio`, monitoramento de processos nativos e controle de serviços do sistema.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto z-10 shrink-0">
          <div className="flex items-center bg-[#10131A] border border-[#252936] rounded-xl px-3 py-2 text-xs">
            <span className="text-[#A89F96] font-mono text-[9px] mr-2">BASE_URL:</span>
            <input 
              type="text" 
              value={hestiaUrl} 
              onChange={(e) => setHestiaUrlState(e.target.value)}
              className="bg-transparent text-[#F7EFE7] font-semibold font-mono text-[11px] focus:outline-none w-36" 
            />
            <button 
              onClick={handleSaveAndTest}
              title="Salvar e testar"
              className="ml-2 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 rounded transition-colors"
            >
              Salvar
            </button>
            <button 
              onClick={loadStatus}
              className="ml-1 text-[#A89F96] hover:text-[#EAB308] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <a 
            href={hestiaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#EAB308] text-black text-[10px] font-black rounded-xl hover:bg-amber-500 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.2)]"
          >
            Abrir Console Local <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {isMock && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-400/90 font-medium leading-relaxed">
            Aviso: os dados apresentados abaixo são decorativos (Modo Simulado). 
          </p>
        </div>
      )}

      {/* Grid of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hardware Status */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#EAB308]" /> Hardware & Carga
            </h3>
            {isMock && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Simulado</span>}
          </div>
          
          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Uptime:</span>
              <span className="text-[#F7EFE7] font-bold">{statusData.uptime}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Uso de CPU:</span>
              <span className="text-[#F7EFE7] font-bold">{statusData.cpu}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Memória RAM:</span>
                <span className="text-[#F7EFE7] font-bold">{statusData.memory.percent}%</span>
              </div>
              <div className="w-full bg-[#10131A] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#EAB308] h-full rounded-full transition-all duration-500"
                  style={{ width: `${statusData.memory.percent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-[#A89F96]/50 text-right">{statusData.memory.used} / {statusData.memory.total}</p>
            </div>
          </div>
        </div>

        {/* Storage status */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#EAB308]" /> Volumes & /Klio
            </h3>
            {isMock && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Simulado</span>}
          </div>

          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Diretório de Escrita:</span>
              <span className="text-[#EAB308] font-bold">{statusData.storage.path}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Notas Localizadas:</span>
              <span className="text-[#F7EFE7] font-bold">{statusData.storage.KlioFilesCount} arquivos</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Espaço Ocupado:</span>
                <span className="text-[#F7EFE7] font-bold">{statusData.storage.percent}%</span>
              </div>
              <div className="w-full bg-[#10131A] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#EAB308] h-full rounded-full transition-all duration-500"
                  style={{ width: `${statusData.storage.percent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-[#A89F96]/50 text-right">{statusData.storage.used} / {statusData.storage.total} total</p>
            </div>
          </div>
        </div>

        {/* Presence / Chameleon */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#EAB308]" /> Presença & Atividade
            </h3>
            {isMock && <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Simulado</span>}
          </div>

          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Modo Atual:</span>
              <span className="text-[#A89F96] font-bold uppercase tracking-wider flex items-center gap-1">
                {statusData.presence.mode}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Tempo Focado Hoje:</span>
              <span className="text-[#F7EFE7] font-bold">{statusData.presence.timeInFocusToday}</span>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] text-[#A89F96]/70">Janela Registrada:</span>
              <span className="text-xs text-[#F7EFE7] block bg-[#10131A] p-2 rounded border border-[#252936] truncate font-semibold">
                {statusData.presence.activeWindow}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Management */}
      <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] p-5 space-y-4 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#F7EFE7] flex items-center gap-2">
          <Settings className="w-4.5 h-4.5 text-[#EAB308]" /> Controle de Serviços Locais (Systemd)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statusData.services.map((svc) => (
            <div 
              key={svc.name} 
              className="p-4 bg-[#10131A] border border-[#252936] rounded-2xl flex flex-col justify-between h-28"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#F7EFE7] uppercase tracking-tight">{svc.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                    svc.active && !isMock
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : svc.active && isMock
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#0B0D12] text-[#A89F96] border border-[#252936]'
                  }`}>
                    {svc.active ? (isMock ? 'Simulado' : 'Ativo') : 'Parado'}
                  </span>
                </div>
                <p className="text-[10px] text-[#A89F96] leading-tight">{svc.description}</p>
              </div>

              <button 
                onClick={() => toggleService(svc.name)}
                disabled={true}
                title="Controle real de serviços ainda não configurado."
                className="w-full py-1 text-[10px] font-black rounded-lg uppercase tracking-wider border border-[#252936] text-[#A89F96] opacity-40 cursor-not-allowed"
              >
                {isMock ? 'Simulado' : 'Indisponível'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-3 shadow-md">
        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#EAB308]" /> Registros e Eventos Recentes de Presença
        </h3>

        <div className="bg-[#10131A] border border-[#252936] rounded-xl p-4 font-mono text-xs space-y-2 h-44 overflow-y-auto no-scrollbar">
          {statusData.presence.recentEvents.map((ev, i) => (
            <div key={i} className="flex items-start gap-2 border-b border-[#252936]/20 pb-1.5 last:border-0 last:pb-0">
              <span className="text-[#A89F96]/50 font-bold text-[10px] shrink-0">[{ev.time}]</span>
              <span className={`text-[10px] font-medium leading-relaxed ${
                ev.level === 'success' ? (isMock ? 'text-amber-400' : 'text-emerald-400') :
                ev.level === 'warn' ? 'text-amber-400' : 'text-[#A89F96]'
              }`}>
                {ev.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
