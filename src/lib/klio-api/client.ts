import type {
  KlioApiEnvelope,
  KlioChatRequest,
  KlioChatResponse,
  KlioSttResponse,
  KlioTtsRequest,
  KlioTtsResponse,
  KlioFileRequest,
  KlioFileResponse,
} from './types';

const getBaseUrl = () =>
  (import.meta.env.VITE_KLIO_API_URL as string | undefined)?.replace(/\/$/, '');

function notConfigured<T>(): KlioApiEnvelope<T> {
  return {
    status: 'not_configured',
    data: null,
    error: 'API da Klio ainda não configurada.',
    source: 'klio-api',
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<KlioApiEnvelope<T>> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return notConfigured<T>();

  try {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    });

    if (!res.ok) {
      return {
        status: 'error',
        data: null,
        error: `Klio API respondeu ${res.status}`,
        source: 'klio-api',
      };
    }

    const data = await res.json();
    return { status: 'ok', data, source: 'klio-api' };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Klio API offline.';
    return { status: 'offline', data: null, error: msg, source: 'klio-api' };
  }
}

export const klioApiClient = {
  health() {
    return request<{ ok: boolean }>('/health');
  },

  chat(payload: KlioChatRequest) {
    return request<KlioChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  stt(base64: string) {
    return request<KlioSttResponse>('/stt', {
      method: 'POST',
      body: JSON.stringify({ audioBase64: base64 }),
    });
  },

  tts(payload: KlioTtsRequest) {
    return request<KlioTtsResponse>('/tts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  file(payload: KlioFileRequest) {
    return request<KlioFileResponse>('/file', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
