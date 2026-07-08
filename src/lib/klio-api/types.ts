export type KlioApiStatus = 'not_configured' | 'ok' | 'offline' | 'error';

export type KlioApiEnvelope<T> = {
  status: KlioApiStatus;
  data: T | null;
  error?: string;
  source: 'klio-api';
};

export type KlioChatRequest = {
  message: string;
  facet: 'klio';
  contexts?: Array<{
    id: string;
    titulo?: string;
    conteudo?: string;
    tipo?: string;
  }>;
};

export type KlioChatResponse = {
  text: string;
  model?: string;
  receiptId?: string;
};

export type KlioSttResponse = {
  text: string;
};

export type KlioTtsRequest = {
  text: string;
  voice?: string;
};

export type KlioTtsResponse = {
  audioUrl?: string;
  audioBase64?: string;
};

export type KlioFileRequest = {
  filename: string;
  mimeType: string;
  base64: string;
  prompt?: string;
};

export type KlioFileResponse = {
  text: string;
};
