import type {
  KalineApiEnvelope,
  KalineChatRequest,
  KalineChatResponse,
  KalineSttResponse,
  KalineTtsRequest,
  KalineTtsResponse,
  KalineFileRequest,
  KalineFileResponse,
} from './types';

const getBaseUrl = () =>
  (import.meta.env.VITE_KALINE_API_URL as string | undefined)?.replace(/\/$/, '');

function notConfigured<T>(): KalineApiEnvelope<T> {
  return {
    status: 'not_configured',
    data: null,
    error: 'API da Kaline ainda não configurada.',
    source: 'kaline-api',
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<KalineApiEnvelope<T>> {
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
        error: `Kaline API respondeu ${res.status}`,
        source: 'kaline-api',
      };
    }

    const data = await res.json();
    return { status: 'ok', data, source: 'kaline-api' };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Kaline API offline.';
    return { status: 'offline', data: null, error: msg, source: 'kaline-api' };
  }
}

export const kalineApiClient = {
  health() {
    return request<{ ok: boolean }>('/health');
  },

  chat(payload: KalineChatRequest) {
    return request<KalineChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  stt(base64: string) {
    return request<KalineSttResponse>('/stt', {
      method: 'POST',
      body: JSON.stringify({ audioBase64: base64 }),
    });
  },

  tts(payload: KalineTtsRequest) {
    return request<KalineTtsResponse>('/tts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  file(payload: KalineFileRequest) {
    return request<KalineFileResponse>('/file', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
