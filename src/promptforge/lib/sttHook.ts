// PromptForge — STT Custom Hook
// Uses Web Speech API with pt-BR default and en-US toggle
// Falls back gracefully if not supported

import { useState, useEffect, useRef, useCallback } from 'react';

export type STTLanguage = 'pt-BR' | 'en-US';

export interface STTHookResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  language: STTLanguage;
  startListening: () => void;
  stopListening: () => void;
  toggleLanguage: () => void;
  resetTranscript: () => void;
  error: string | null;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function useSTT(onTranscript?: (text: string) => void): STTHookResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState<STTLanguage>('pt-BR');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const createRecognition = useCallback(() => {
    if (!isSupported) return null;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript(prev => {
          const updated = prev + (prev ? ' ' : '') + finalText;
          onTranscript?.(updated);
          return updated;
        });
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessages: Record<string, string> = {
        'no-speech': 'Nenhuma fala detectada.',
        'audio-capture': 'Microfone não encontrado.',
        'not-allowed': 'Permissão de microfone negada.',
        'network': 'Erro de rede. Verifique sua conexão.',
        'aborted': 'Gravação cancelada.'
      };
      setError(errorMessages[event.error] || `Erro: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setInterimTranscript('');
      setIsListening(prev => {
        // Auto-restart if still supposed to be listening (continuous mode fix)
        if (prev && recognitionRef.current) {
          try { recognitionRef.current.start(); } catch { /* ignore */ }
          return true;
        }
        return false;
      });
    };

    return recognition;
  }, [language, isSupported, onTranscript]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Reconhecimento de voz não suportado neste navegador. Use Chrome ou Edge.');
      return;
    }

    setError(null);

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = createRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError('Falha ao iniciar gravação.');
    }
  }, [isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const toggleLanguage = useCallback(() => {
    if (isListening) stopListening();
    setLanguage(prev => prev === 'pt-BR' ? 'en-US' : 'pt-BR');
  }, [isListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    language,
    startListening,
    stopListening,
    toggleLanguage,
    resetTranscript,
    error
  };
}
