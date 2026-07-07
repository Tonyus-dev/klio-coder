export type KalineApiStatus = 'not_configured' | 'ok' | 'offline' | 'error';

export type KalineApiEnvelope<T> = {
  status: KalineApiStatus;
  data: T | null;
  error?: string;
  source: 'kaline-api';
};

export type KalineChatRequest = {
  message: string;
  facet: 'kaline' | 'klio' | 'kharis' | 'kuanyin';
  contexts?: Array<{
    id: string;
    titulo?: string;
    conteudo?: string;
    tipo?: string;
  }>;
};

export type KalineChatResponse = {
  text: string;
  model?: string;
  receiptId?: string;
};

export type KalineSttResponse = {
  text: string;
};

export type KalineTtsRequest = {
  text: string;
  voice?: string;
};

export type KalineTtsResponse = {
  audioUrl?: string;
  audioBase64?: string;
};

export type KalineFileRequest = {
  filename: string;
  mimeType: string;
  base64: string;
  prompt?: string;
};

export type KalineFileResponse = {
  text: string;
};
