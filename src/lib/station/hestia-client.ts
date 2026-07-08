// Héstia client - Comunicação direta com a estação física local (:4517)
// Suporta fallback para modo simulação de alta fidelidade quando offline.
import { RuntimeEnvelope } from '../runtime-status';

export interface HestiaStatus {
  online: boolean;
  uptime: string;
  load: number[];
  cpu: number;
  memory: {
    total: string;
    used: string;
    free: string;
    percent: number;
  };
  storage: {
    path: string;
    total: string;
    used: string;
    available: string;
    percent: number;
    KlioFilesCount: number;
  };
  services: {
    name: string;
    active: boolean;
    description: string;
  }[];
  presence: {
    mode: 'presence' | 'focus' | 'rest';
    activeWindow: string;
    timeInFocusToday: string;
    recentEvents: { time: string; event: string; level: 'info' | 'warn' | 'success' }[];
  };
}

const DEFAULT_HESTIA_URL = 'http://127.0.0.1:4517';

export function getHestiaUrl(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('Klio_hestia_url');
    if (stored) return stored;
  }
  return (import.meta.env.VITE_HESTIA_URL as string | undefined) || DEFAULT_HESTIA_URL;
}

export function setHestiaUrl(url: string): void {
  if (typeof window === 'undefined') return;
  const clean = url.endsWith('/') ? url.slice(0, -1) : url;
  localStorage.setItem('Klio_hestia_url', clean);
}

export async function fetchHestiaStatus(baseUrl?: string): Promise<RuntimeEnvelope<HestiaStatus>> {
  const url = baseUrl ?? getHestiaUrl();
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(`${url}/api/server/status`, { signal: controller.signal });
    clearTimeout(id);
    if (res.ok) {
      const data = await res.json();
      return {
        status: 'real',
        source: url,
        data: { ...data, online: true }
      };
    }
  } catch (err) {
    // Falhou, usa simulação abaixo
  }

  // Simulação Honesta de Alta Fidelidade (Héstia Offline/Mock)
  return {
    status: 'mock',
    source: 'fallback-local',
    data: {
      online: false,
      uptime: '14h 32m',
      load: [0.45, 0.52, 0.61],
      cpu: 18,
      memory: {
        total: '16.00 GB',
        used: '7.45 GB',
        free: '8.55 GB',
        percent: 46
      },
      storage: {
        path: '/Klio',
        total: '512 GB',
        used: '124 GB',
        available: '388 GB',
        percent: 24,
        KlioFilesCount: 84
      },
      services: [
        { name: 'jellyfin', active: true, description: 'Servidor de mídia de alta fidelidade' },
        { name: 'syncthing', active: true, description: 'Sincronização contínua de diretórios' },
        { name: 'smbd', active: false, description: 'Samba Share ativo em rede local' },
        { name: 'tailscaled', active: true, description: 'Rede privada e segura Tailscale' }
      ],
      presence: {
        mode: 'presence',
        activeWindow: 'Klio Pritaneu v27 - VS Code',
        timeInFocusToday: '4h 12m',
        recentEvents: [
          { time: '05:43', event: 'Daemon local sincronizado com sucesso', level: 'success' },
          { time: '05:01', event: 'Mudança de estado: presença iniciada no desktop', level: 'info' },
          { time: '04:15', event: 'Varredura em /Klio encontrou 3 novas notas', level: 'info' },
          { time: '03:10', event: 'Syncthing relatou conflito de sincronização resolvido', level: 'warn' }
        ]
      }
    }
  };
}
