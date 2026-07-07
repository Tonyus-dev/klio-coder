export type RuntimeStatus = 'real' | 'mock' | 'offline' | 'planned';

export type RuntimeEnvelope<T> = {
  status: RuntimeStatus;
  source: string;
  data: T | null;
};
