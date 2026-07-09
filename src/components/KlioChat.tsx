import { KLIO_STORAGE_KEYS } from '../lib/klio-persistence';
import React, { useState, useRef, useEffect } from 'react';
import { promptCacheManager } from '../lib/PromptCacheManager';
import { cacheStatsTracker } from '../lib/CacheStatsTracker';
import { KLIO_FULL_CANON } from '../lib/canon/Klio-canon';
import KittScanner, { KittState } from './KittScanner';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Laptop, 
  Smartphone,
  Network,
  Code, 
  Check, 
  Copy, 
  Layers, 
  Zap, 
  RefreshCw,
  Eye,
  Fingerprint,
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  HelpCircle,
  Leaf,
  Trash2,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Paperclip,
  GitBranch,
  Settings
} from 'lucide-react';

interface Message {
  // coder = Klio, faceta de vibe code da Klio.
  sender: 'user' | 'system' | 'Klio' | 'coder';
  text: string;
  timestamp: string;
  filteredPrompt?: string; // For Qwen 1.5B filter visualization
  codeSnippet?: string; // For Vibe Coder
  proposedSemaphore?: 'green' | 'yellow' | 'blue' | 'red'; // For inline action confirmation
  promptCached?: boolean;
  semanticCached?: boolean;
}

interface Sediment {
  id: string;
  texto: string;
  tipo: 'iconic' | 'echoic' | 'short_term' | 'working' | 'prospective' | 'episodic' | 'semantic' | 'procedural';
  dataCriacao: string;
  status: 'pendente' | 'revisado' | 'arquivado';
}

export const PRESENCA_META = {
  green: {
    label: 'Verde',
    desc: 'Fluxo aberto',
    detail: 'Médio/longo, propor, plano, até 3 caminhos',
    color: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10'
  },
  yellow: {
    label: 'Amarelo',
    desc: 'Atenção mediada',
    detail: 'Curto-médio, menos densidade, até 2 caminhos',
    color: 'bg-amber-500',
    ring: 'ring-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10'
  },
  blue: {
    label: 'Azul',
    desc: 'Presença calma',
    detail: 'Resposta curta, 1 caminho guiado, sem excesso ou menu',
    color: 'bg-blue-500',
    ring: 'ring-blue-500/30',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10'
  },
  red: {
    label: 'Vermelho',
    desc: 'Limite ativo',
    detail: 'Muito curta, 0 opções, sem decisões complexas ou projetos',
    color: 'bg-red-500',
    ring: 'ring-red-500/30',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    text: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10'
  }
};

export default function KlioChat() {
  const [activeMode, setActiveMode] = useState<'Klio' | 'coder'>(() => {
    const saved = localStorage.getItem('Klio_active_dialogue_facet');
    if (saved === 'klio') return 'coder';
    return 'Klio';
  });

  useEffect(() => {
    const valueToSave = activeMode === 'coder' ? 'klio' : activeMode;
    localStorage.setItem('Klio_active_dialogue_facet', valueToSave);
    // Dispatch event so ModoFalaPanel and GuardiaoPanel can update if they are listening
    window.dispatchEvent(new CustomEvent('KlioActiveFacetChanged', { detail: valueToSave }));
  }, [activeMode]);

  const t = activeMode === 'Klio' ? {
    bg: 'bg-[#FF4C1F]', bg10: 'bg-[#FF4C1F]/10', bg15: 'bg-[#FF4C1F]/15', bg5: 'bg-[#FF4C1F]/5',
    border: 'border-[#FF4C1F]', border10: 'border-[#FF4C1F]/10', border15: 'border-[#FF4C1F]/15', border20: 'border-[#FF4C1F]/20', border30: 'border-[#FF4C1F]/30', border35: 'border-[#FF4C1F]/35', border40: 'border-[#FF4C1F]/40', border5: 'border-[#FF4C1F]/5',
    from: 'from-[#FF4C1F]', toHover: 'to-[#FF7A3D]',
    text: 'text-[#FF4C1F]', text60: 'text-[#FF4C1F]/60', hoverText: 'hover:text-[#FF4C1F]', hoverBg: 'hover:bg-[#FF4C1F]/10', hoverBorder: 'hover:border-[#FF4C1F]', hoverBgHover: 'hover:bg-[#FF7A3D]',
    ring30: 'focus:ring-[#FF4C1F]/30', focusBorder: 'focus:border-[#FF4C1F]',
    shadow12: 'shadow-[0_0_12px_rgba(255,76,31,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(239,68,68,0.5)]',
    avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleSelf: 'bg-[#180A06]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'Klio', tagAvatar: 'K', tagImage: '/brand/Klio.png',
    modeName: 'Klio (Conversa)', modeIcon: <span className="text-[#FF4C1F]">K</span>
  } : {
    bg: 'bg-[#E50914]', fill: 'fill-[#E50914]', bg10: 'bg-[#E50914]/10', bg15: 'bg-[#E50914]/15', bg5: 'bg-[#E50914]/5',
    border: 'border-[#E50914]', border10: 'border-[#E50914]/10', border15: 'border-[#E50914]/15', border20: 'border-[#E50914]/20', border30: 'border-[#E50914]/30', border35: 'border-[#E50914]/35', border40: 'border-[#E50914]/40', border5: 'border-[#E50914]/5',
    from: 'from-[#E50914]', toHover: 'to-[#ff4d4d]',
    text: 'text-[#E50914]', text60: 'text-[#E50914]/60', hoverText: 'hover:text-[#E50914]', hoverBg: 'hover:bg-[#E50914]/10', hoverBorder: 'hover:border-[#E50914]', hoverBgHover: 'hover:bg-[#ff4d4d]',
    ring30: 'focus:ring-[#E50914]/30', focusBorder: 'focus:border-[#E50914]',
    shadow12: 'shadow-[0_0_12px_rgba(229,9,20,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(229,9,20,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(229,9,20,0.5)]',
    avatarFrom: 'from-[#1A0303]', avatarTo: 'to-[#2A0606]', bubbleSelf: 'bg-[#1A0303]/95', bubbleOther: 'bg-[#0F0202]/95',
    tagName: 'KLIO', tagAvatar: 'KL', tagImage: '/brand/klio.png',
    modeName: 'Klio — Vibe Code', modeIcon: <span className="text-[#E50914] font-serif">K</span>
  };

  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
  const [isLocalMode, setIsLocalMode] = useState<boolean>(true);
  const [ollamaConnected, setOllamaConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  // Twin Engine State: Online vs Local
  const [runtimeMode, setRuntimeMode] = useState<'online' | 'local'>(() => {
    const legacy = localStorage.getItem('klio_version');
    if (legacy === 'V27') return 'online';
    if (legacy === 'Local') return 'local';
    return (localStorage.getItem('klio_runtime_mode') as 'online' | 'local') || 'online';
  });

  useEffect(() => {
    const handleVersionChange = (e: any) => {
      setRuntimeMode(e.detail);
    };
    window.addEventListener('klioRuntimeModeChanged', handleVersionChange);
    return () => window.removeEventListener('klioRuntimeModeChanged', handleVersionChange);
  }, []);
  const [cloudflareWorkerUrl, setCloudflareWorkerUrl] = useState<string>(() => {
    return localStorage.getItem('Klio_cloudflare_worker_url') || 'https://Klio-worker.workers.dev';
  });
  // Removed openrouterKey state
  // Semaphore (Semáforo) State synced with localStorage
  const [presencaRegime, setPresencaRegime] = useState<'green' | 'yellow' | 'blue' | 'red'>(() => {
    return (localStorage.getItem('Klio_presenca_regime') as any) || 'green';
  });
  const [notaEfemera, setNotaEfemera] = useState<string>(() => {
    return localStorage.getItem('Klio_nota_efemera') || '';
  });

  // User Profile States
  const [userNickname, setUserNickname] = useState<string>(() => {
    return localStorage.getItem('Klio_user_nickname') || 'Ká';
  });
  const [userPronouns, setUserPronouns] = useState<string>(() => {
    return localStorage.getItem('Klio_user_pronouns') || 'ele/dele';
  });
  const [userPhoto, setUserPhoto] = useState<string>(() => {
    return localStorage.getItem('Klio_user_photo') || '';
  });

  // Conversation Context Summary state
  const [threadSummary, setThreadSummary] = useState<{
    summary: string;
    currentGoal: string;
    lastDecision: string;
    openLoops: string;
    toneHint: string;
  }>(() => {
    const stored = localStorage.getItem('Klio_thread_summary');
    return stored ? JSON.parse(stored) : {
      summary: 'Arquitetura do Pritaneu',
      currentGoal: 'Integrar os controles de Semáforo da Klio e resumos contextuais de thread',
      lastDecision: 'Usar localStorage para persistência de estado e modulação local',
      openLoops: 'Criar componente interativo de popover para o Semáforo',
      toneHint: 'Direto, sênior prático, modo Klio'
    };
  });

  // Sidebar dynamic tab: 'sediments' or 'summary'
  const [sidebarTab, setSidebarTab] = useState<'sediments' | 'summary'>('summary');

  // Sync state with localStorage
  useEffect(() => {
    const syncState = () => {
      const currentRegime = (localStorage.getItem('Klio_presenca_regime') as any) || 'green';
      const currentNota = localStorage.getItem('Klio_nota_efemera') || '';
      setPresencaRegime(currentRegime);
      setNotaEfemera(currentNota);

      setUserNickname(localStorage.getItem('Klio_user_nickname') || 'Ká');
      setUserPronouns(localStorage.getItem('Klio_user_pronouns') || 'ele/dele');
      setUserPhoto(localStorage.getItem('Klio_user_photo') || '');

      const legacy = localStorage.getItem('klio_version');
      if (legacy === 'V27') setRuntimeMode('online');
      else if (legacy === 'Local') setRuntimeMode('local');
      else setRuntimeMode((localStorage.getItem('klio_runtime_mode') as 'online' | 'local') || 'online');
      setCloudflareWorkerUrl(localStorage.getItem('Klio_cloudflare_worker_url') || 'https://Klio-worker.workers.dev');

      const storedSum = localStorage.getItem('Klio_thread_summary');
      if (storedSum) {
        setThreadSummary(JSON.parse(storedSum));
      }
    };
    // Initial sync
    syncState();
    // Keep checking changes from global top bar
    const interval = setInterval(syncState, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('Klio_presenca_regime', presencaRegime);
  }, [presencaRegime]);

  useEffect(() => {
    localStorage.setItem('Klio_nota_efemera', notaEfemera);
  }, [notaEfemera]);

  useEffect(() => {
    localStorage.setItem('klio_runtime_mode', runtimeMode);
  }, [runtimeMode]);

  useEffect(() => {
    localStorage.setItem('Klio_cloudflare_worker_url', cloudflareWorkerUrl);
  }, [cloudflareWorkerUrl]);

  // Removed openrouterKey effect
  useEffect(() => {
    localStorage.setItem('Klio_thread_summary', JSON.stringify(threadSummary));
  }, [threadSummary]);
  
  // Pipeline tracking states
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'filtering' | 'generating' | 'done'>('idle');
  const [tempFiltered, setTempFiltered] = useState<string>('');

  // Audio / Speech States (STT & TTS)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Collapsible Setup Panel (Identity & Connection)
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // Collapsible Sediments Panel
  const [showSedimentPanel, setShowSedimentPanel] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [sediments, setSediments] = useState<Sediment[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'Klio',
      text: 'Olá! Sou a Klio, seu assistente técnico privado. Lembre-se: eu crio prompts, organizo a sua intenção e preparo specs. Eu não executo comandos e não gero patches automaticamente. O Coder será um motor separado acionado posteriormente.',
      timestamp: '05:43'
    }
  ]);

  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const timestamp = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: `[Arquivo Anexado: ${file.name}]`,
        timestamp,
      },
      {
        sender: activeMode,
        text: runtimeMode === 'online' ? 'Análise de arquivos não implementada no modo online.' : 'API da Klio ainda não configurada.',
        timestamp,
      },
    ]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load active contexts from localStorage to inspect and show in the prompt UI
  const [activeContexts, setActiveContexts] = useState<any[]>([]);

  // Load active contexts
  const loadActiveContexts = () => {
    try {
      const stored = localStorage.getItem('Klio_contexts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((c: any) => c.ativo && !c.arquivado);
        setActiveContexts(filtered);
      } else {
        // Fallback default
        setActiveContexts([
          { titulo: 'Klio — Voz e modo de falar', tipo: 'identidade' },
          { titulo: 'Ká — Preferências de resposta', tipo: 'memoria_relacional' },
          { titulo: 'Ecossistema Klio — Ontologia geral', tipo: 'identidade' }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load and sync sediments
  const loadSediments = () => {
    try {
      const stored = localStorage.getItem(KLIO_STORAGE_KEYS.localMemoryCandidates);
      if (stored) {
        setSediments(JSON.parse(stored));
      } else {
        // Default initial seed if empty
        const initial = [
          {
            id: 'sed-1',
            texto: 'Ká está focando em arquitetura server-side utilizando Cloudflare Workers e Supabase',
            tipo: 'short_term' as const,
            dataCriacao: new Date().toISOString().split('T')[0],
            status: 'pendente' as const
          }
        ];
        localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(initial));
        setSediments(initial);
      }
    } catch (e) {
      console.warn(e);
    }
  };

const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListen = async () => {
    if (isListening) {
      setIsListening(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    } else {
      setIsListening(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
             let base64data = reader.result as string;
             base64data = base64data.split(',')[1] || '';
             
             try {
                const KlioUrl = import.meta.env.VITE_KLIO_API_URL;
                if (!KlioUrl) {
                   setInput(prev => prev + (runtimeMode === 'online' ? " [Erro: STT online não configurado]" : " [Erro: API da Klio ainda não configurada para STT]"));
                   return;
                }
                const transcription = " [STT via Klio API não configurado] ";
                if (transcription) {
                   setInput(prev => prev + (prev ? ' ' : '') + transcription.trim());
                }
             } catch (e) {
                console.error("STT via Klio API falhou:", e);
                setInput(prev => prev + " [Erro STT: falha na transcrição]");
             }
          };
        };
        
        mediaRecorder.start();
      } catch (err: any) {
        console.error('Falha ao iniciar microfone', err);
        if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
           setInput(prev => prev + " [Acesso ao microfone negado]");
        } else {
           setInput(prev => prev + " [Erro ao iniciar microfone]");
        }
        setIsListening(false);
      }
    }
  };

  // Handle TTS (Speech Synthesis)
  const handleSpeak = (text: string, idx: number, sender: string) => {
    if (speakingMessageIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMessageIdx(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setSpeakingMessageIdx(null);
      utterance.onerror = () => setSpeakingMessageIdx(null);
      
      // Select a natural PT voice if available
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice;
      if (sender === 'coder') {
        selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Vindemiatrix') : v.name.includes('Aoede')));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt-'));
      }
      
      if (selectedVoice) utterance.voice = selectedVoice;
      // Aplicar estilos de voz
      const voiceStyle = localStorage.getItem('Klio_voice_style') || 'direta';
      let basePitch = sender === 'coder' ? 0.9 : 1.1;
      
      if (voiceStyle === 'formal') {
        utterance.pitch = Math.max(0.1, basePitch - 0.2);
        utterance.rate = 0.9;
      } else if (voiceStyle === 'calorosa') {
        utterance.pitch = Math.min(2.0, basePitch + 0.15);
        utterance.rate = 0.95;
      } else {
        utterance.pitch = basePitch;
        utterance.rate = 1.05;
      }
      
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageIdx(idx);
    }
  };

  // Clear TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    loadActiveContexts();
    loadSediments();
    const interval = setInterval(() => {
      loadActiveContexts();
      loadSediments();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMode]);

  // Check Ollama status
  const checkOllama = async () => {
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`);
      if (res.ok) setOllamaConnected(true);
      else setOllamaConnected(false);
    } catch {
      setOllamaConnected(false);
    }
  };

  useEffect(() => {
    checkOllama();
  }, [ollamaUrl]);

  // Real or Simulated fetch pipeline
  const processMessage = async (userText: string) => {
    setLoading(true);

    const isPromptCachingEnabled = localStorage.getItem('Klio_prompt_caching') !== 'false';
    const isSemanticCachingEnabled = localStorage.getItem('Klio_semantic_caching') === 'true';

    const lowerText = userText.toLowerCase();

    // Semantic Caching Pipeline Bypass
    if (isSemanticCachingEnabled) {
      try {
        const storedSed = localStorage.getItem(KLIO_STORAGE_KEYS.localMemoryCandidates);
        const sediments = storedSed ? JSON.parse(storedSed) : [];
        const matchingSediment = sediments.find((s: any) => 
          (s.titulo && lowerText.includes(s.titulo.toLowerCase())) || 
          (s.tags && s.tags.some((t: string) => lowerText.includes(t.toLowerCase())))
        );

        if (!matchingSediment) {
          cacheStatsTracker.recordMiss('semantic');
        }
        if (matchingSediment) {
          setPipelineStep('filtering');
          setTempFiltered(`[Cache local de sessão] Recuperando rascunho local de sessão. Isto não é memória confirmada nem banco vetorial.`);
          cacheStatsTracker.recordHit('semantic', 0.0002);
          await new Promise(r => setTimeout(r, 400));
          
          setPipelineStep('generating');
          await new Promise(r => setTimeout(r, 300));

          let responseText = `**[Rascunho local de sessão]**\n\nEncontrei um candidato local não confirmado relacionado ao pedido.\n\nIsto não é memória técnica confirmada, não é sedimentação real e não é banco vetorial.\n\n**${matchingSediment.titulo}**\n${matchingSediment.conteudo}`;
          if (matchingSediment.tags && matchingSediment.tags.length > 0) {
            responseText += `\n\n*Tags: ${matchingSediment.tags.join(', ')}*`;
          }

          setMessages(prev => [
            ...prev,
            {
              sender: activeMode,
              text: responseText,
              timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              semanticCached: true
            }
          ]);
          setLoading(false);
          setPipelineStep('idle');
          return;
        }
      } catch (e) {
        console.warn('Erro ao ler sedimentos para semantic caching', e);
      }
    }

    setPipelineStep('filtering');
    setTempFiltered('');

    // Load active context strings to form the prompt hierarchy
    let contextBlock = '';
    try {
      const stored = localStorage.getItem('Klio_contexts');
      const parsed = stored ? JSON.parse(stored) : [];
      const active = parsed.filter((c: any) => c.ativo && !c.arquivado);
      if (active.length > 0) {
        contextBlock = active.map((c: any) => `[CONTEXTO ${c.tipo.toUpperCase()}: ${c.titulo}]\n${c.conteudo}`).join('\n\n');
      }
    } catch (e) {
      console.warn('Erro ao ler contextos', e);
    }

    // Parse natural language commands for Semaphore
    let proposedSem: 'green' | 'yellow' | 'blue' | 'red' | undefined = undefined;
    if (lowerText.includes('vermelho') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('energia') || lowerText.includes('limite'))) {
      proposedSem = 'red';
    } else if (lowerText.includes('verde') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('fluxo') || lowerText.includes('foco'))) {
      proposedSem = 'green';
    } else if (lowerText.includes('amarelo') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('atenção'))) {
      proposedSem = 'yellow';
    } else if (lowerText.includes('azul') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('calma') || lowerText.includes('baixo'))) {
      proposedSem = 'blue';
    }

    if (runtimeMode === 'online') {
      // Klio Online: Cloudflare Workers + Klio API. She cannot write code!
      setPipelineStep('filtering');
      await new Promise(r => setTimeout(r, 600));
      
      let filteredText = `[Cloudflare Workers Gateway] Filtered through PromptForge API.`;
      setTempFiltered(filteredText);
      setPipelineStep('generating');

      let responseText = '';
      const KlioUrl = import.meta.env.VITE_KLIO_API_URL || '/api/prompt-forge';

      try {
        const apiRes = await fetch(KlioUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate',
            mode: activeMode === 'coder' ? 'vibecode' : 'code',
            idea: userText
          })
        });

        const data = await apiRes.json();
        
        if (!apiRes.ok) {
          throw new Error(data.error || 'Erro na API');
        }

        responseText = data.prompt || data.content || '[Nenhuma resposta da API]';
      } catch (err: any) {
        console.error('Klio API Error:', err);
        responseText = `[Erro ao conectar ao Klio Online: ${err.message}]`;
      }

      if (proposedSem) {
        const colorLabels = { green: 'Verde (Fluxo Aberto)', yellow: 'Amarelo (Atenção Mediada)', blue: 'Azul (Presença Calma)', red: 'Vermelho (Limite Ativo)' };
        responseText += `\n\n[AÇÃO SUGERIDA]: Identifiquei que você pode querer mudar o Semáforo de presença para o regime ${colorLabels[proposedSem]}. Deseja confirmar?`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: activeMode,
          text: responseText,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          filteredPrompt: filteredText,
          proposedSemaphore: proposedSem,
          promptCached: isPromptCachingEnabled
        }
      ]);
      setLoading(false);
      setPipelineStep('done');
      return;
    }

    // Otherwise, Klio Local: Local Ollama Mode
    const informalFilterPrompt = `Transforme o comando informal do usuário em um prompt ultra-estruturado, técnico, focado em hábitos e disciplina de desenvolvimento para a Klio (Qwen 3B). Retorne APENAS o prompt estruturado final.\nUsuário disse: "${userText}"`;

    let filteredText = `PROMPT_ESTRUTURADO: Analisar engajamento com foco em disciplina de desenvolvimento sob Ollama Local.`;
    let responseText = `Compreendi seu comando pelo fio de presença local (Ollama). Vamos prosseguir com foco mínimo e sem burocracia desnecessária.`;

    if (isLocalMode && ollamaConnected) {
      try {
        const filterRes = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:1.5b',
            prompt: informalFilterPrompt,
            stream: false
          })
        });
        if (filterRes.ok) {
          const filterData = await filterRes.json();
          filteredText = filterData.response.trim();
        }

        setTempFiltered(filteredText);
        setPipelineStep('generating');

        const systemName = 'a Klio Local';
        const customPromptInstructions = 'Responda ao prompt de forma direta, sem condescendência ou empatia artificial.';

        const finalPrompt = `[DIRETIVAS OPERACIONAIS - DESKTOP OLLAMA]
Você é ${systemName}. ${customPromptInstructions}

${KLIO_FULL_CANON}

[SEMÁFORO DE PRESENÇA ATIVO]
Regime atual: ${presencaRegime.toUpperCase()}
Modulação obrigatória de voz:
- VERDE: resposta média/longa, alta profundidade, pode propor, até 3 caminhos/soluções.
- AMARELO: resposta curta-médio, menos densidade, priorizar frentes, até 2 caminhos/soluções.
- AZUL: resposta curta, calma, baixa estimulação, 1 caminho guiado, sem menu, sem palestra.
- VERMELHO: resposta muito curta, contenção ativa, 0 opções novas, sem projetos novos, sem decisões complexas.

Nota de modulação local atual: ${notaEfemera || 'Nenhuma nota ativa.'}

[CONTEXTOS ATIVOS]
${contextBlock || 'Nenhum contexto carregado.'}

[PEDIDO ESTRUTURADO]
${filteredText}

Por favor, responda ao pedido estruturado baseando-se estritamente nos contextos e diretrizes acima. Mantenha a conversa orgânica e fluida, você está interagindo diretamente com o usuário no painel central.`;

        const chatRes = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:latest',
            prompt: finalPrompt,
            stream: false
          })
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          responseText = chatData.response.trim();
        }
      } catch (err) {
        console.warn('Ollama local offline');
        setMessages(prev => [...prev, {
          sender: activeMode,
          text: `Klio Local indisponível: Ollama não respondeu em ${ollamaUrl}. Inicie o Ollama ou altere para o modo Online.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
        return;
      }
    } else {
      console.warn('Ollama local offline');
      setMessages(prev => [...prev, {
        sender: activeMode,
        text: `Klio Local indisponível: Ollama não respondeu em ${ollamaUrl}. Inicie o Ollama ou altere para o modo Online.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setLoading(false);
      return;
    }

    if (proposedSem) {
      const colorLabels = { green: 'Verde (Fluxo Aberto)', yellow: 'Amarelo (Atenção Mediada)', blue: 'Azul (Presença Calma)', red: 'Vermelho (Limite Ativo)' };
      responseText += `\n\n[AÇÃO SUGERIDA]: Identifiquei que você pode querer mudar o Semáforo de presença para o regime ${colorLabels[proposedSem]}. Deseja confirmar?`;
    }

    setMessages(prev => [
      ...prev,
      {
        sender: activeMode,
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        filteredPrompt: filteredText,
        proposedSemaphore: proposedSem,
        promptCached: isPromptCachingEnabled
      }
    ]);

    setPipelineStep('done');
    setLoading(false);

    if (userText.length > 25) {
      saveLocalMemoryCandidate(userText);
    }
  };

  // handleCrossTalk removido para adequar MVP técnico

  const saveLocalMemoryCandidate = (text: string) => {
    try {
      const stored = localStorage.getItem(KLIO_STORAGE_KEYS.localMemoryCandidates);
      const parsed = stored ? JSON.parse(stored) : [];
      if (parsed.some((s: any) => s.texto === text)) return;
      
      const newSed: Sediment = {
        id: `sed-${Date.now()}`,
        texto: `Ká mencionou durante o chat: "${text}"`,
        tipo: 'short_term',
        dataCriacao: new Date().toISOString().split('T')[0],
        status: 'pendente'
      };
      const updated = [newSed, ...parsed];
      localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(updated));
      setSediments(updated);
    } catch (e) {
      console.warn('Erro ao salvar sedimento de conversa', e);
    }
  };

  const markLocalCandidateReviewed = (id: string) => {
    try {
      const updated = sediments.map(s => s.id === id ? { ...s, status: 'revisado' as const } : s);
      localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(updated));
      setSediments(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  
  useEffect(() => {
    const handleFacetChange = (e: any) => {
      const val = e.detail;
      setActiveMode(prev => {
        const next = val === 'klio' ? 'coder' : 'Klio';
        return prev === next ? prev : next;
      });
    };
    window.addEventListener('KlioActiveFacetChanged', handleFacetChange);
    return () => window.removeEventListener('KlioActiveFacetChanged', handleFacetChange);
  }, []);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && (prev[0].text.includes('Olá! Sou a Klio') || prev[0].text.includes('Olá! Sou a Klio') || prev[0].text.includes('Olá! Sou a Kháris'))) {
        return [
          {
            sender: activeMode,
            text: activeMode === 'Klio' 
              ? 'Olá! Sou a Klio, seu assistente técnico privado. Lembre-se: eu crio prompts, organizo a sua intenção e preparo specs. Eu não executo comandos e não gero patches automaticamente. O Coder será um motor separado acionado posteriormente.'
              : 'Olá! Sou o modo Vibe Code da Klio. Neste modo, preparo orientação textual e snippets focados em excelência arquitetural. Nada é executado sem confirmação explícita.',
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });
  }, [activeMode]);

  const discardLocalCandidate = (id: string) => {
    try {
      const updated = sediments.filter(s => s.id !== id);
      localStorage.setItem(KLIO_STORAGE_KEYS.localMemoryCandidates, JSON.stringify(updated));
      setSediments(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  const processCoderMessage = async (userText: string) => {
    setLoading(true);
    let code = ``;
    let answerText = `Aqui está a implementação técnica requisitada, estruturada com foco em performance e manutenibilidade.`;

    if (isLocalMode && ollamaConnected) {
      try {
        const res = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5-coder',
            prompt: `Você é Klio, a faceta de pensamento e programação (modo Coder) da Klio. Responda com linguagem altamente técnica, estruturada, precisa, utilizando jargões apropriados e foco em excelência e arquitetura. Gere o código mínimo e robusto necessário em português para o seguinte pedido:\n"${userText}". Retorne explicação técnica no início, e o bloco de código estruturado.`,
            stream: false
          })
        });

        if (res.ok) {
          const data = await res.json();
          const fullText = data.response.trim();
          const codeMatch = fullText.match(/```(?:javascript|typescript|js|ts)?([\s\S]*?)```/);
          if (codeMatch) {
            code = codeMatch[1].trim();
            answerText = fullText.replace(/```[\s\S]*?```/g, '').trim();
          } else {
            answerText = fullText;
          }
        }
      } catch (err) {
        console.warn('Ollama coder offline');
        setMessages(prev => [...prev, {
          sender: 'coder',
          text: `Vibe Code indisponível: o modelo local qwen2.5-coder não respondeu. Nenhum código foi gerado.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setLoading(false);
        return;
      }
    } else {
      console.warn('Ollama coder offline (not connected)');
      setMessages(prev => [...prev, {
        sender: 'coder',
        text: `Vibe Code indisponível: o modelo local qwen2.5-coder não respondeu. Nenhum código foi gerado.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }]);
      setLoading(false);
      return;
    }

    setMessages(prev => [
      ...prev,
      {
        sender: 'coder',
        text: answerText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: code || undefined
      }
    ]);
    setLoading(false);
  };

  
  const getKittState = (): KittState => {
    if (isListening) return "listening";
    if (loading && pipelineStep === 'filtering') return "radar";
    if (loading && pipelineStep === 'generating') return "thinking";
    return "idle";
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
      setInput('');
      if (activeMode === 'Klio') {
        processMessage(userMsg.text);
      } else {
        processCoderMessage(userMsg.text);
      }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-[#F7EFE7] animate-fade-in h-full flex-1" id="Klio-ai-center">
      {/* LEFT CHAT SECTION (Main Area) */}
      <div className="lg:col-span-12 space-y-4 flex flex-col flex-1 pb-0 transition-all duration-300">
{/* Main Chat Interface */}
        <div className={`bg-[#0B0D12] rounded-[32px] border ${t.border}/15 shadow-2xl flex flex-col flex-1 min-h-[400px] overflow-hidden relative`}>
          
          
          
          
          {/* Chat window viewport */}
          <div className="p-4 pb-[110px] sm:pb-[110px] overflow-y-auto grow space-y-5 no-scrollbar bg-gradient-to-b from-[#090A0D] to-[#040507]">
            {messages.map((m, idx) => {
              const isSelf = m.sender === 'user';
              const mt = m.sender === 'coder' ? {
                border: 'border-[#E50914]', border20: 'border-[#E50914]/20', border35: 'border-[#E50914]/35',
                text: 'text-[#E50914]', bg: 'bg-[#E50914]', fill: 'fill-[#E50914]',
                avatarFrom: 'from-[#1A0303]', avatarTo: 'to-[#2A0606]', bubbleOther: 'bg-[#0F0202]/95', bubbleSelf: 'bg-[#1A0303]/95',
                tagName: 'KLIO', tagAvatar: 'KL', tagImage: '/brand/klio.png', shadow8: 'shadow-[0_0_8px_rgba(229,9,20,0.2)]'
              } : {
                border: 'border-[#FF4C1F]', border20: 'border-[#FF4C1F]/20', border35: 'border-[#FF4C1F]/35',
                text: 'text-[#FF4C1F]', bg: 'bg-[#FF4C1F]', fill: 'fill-[#FF4C1F]',
                avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#180A06]/95',
                tagName: 'Klio', tagAvatar: 'K', tagImage: '/brand/Klio.png', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]'
              };
              
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[88%] ${isSelf ? 'self-end ml-auto flex-row-reverse' : 'self-start flex-row'}`}
                >
                  {/* Avatar inside Bubble list - styled as perfect circles */}
                  {!isSelf ? (
                    <button 
                      onClick={() => setActiveMode(prev => prev === 'Klio' ? 'coder' : 'Klio')}
                      title="Alternar Faceta (Klio / Klio / Kháris)"
                      className={`w-8 h-8 rounded-full border ${mt.border}/40 overflow-hidden bg-gradient-to-tr ${mt.avatarFrom} ${mt.avatarTo} flex items-center justify-center shrink-0 ${mt.shadow8} cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
                    >
                      <img 
                        src={mt.tagImage} 
                        alt={mt.tagName} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                          if ((e.target as any).nextSibling) (e.target as any).nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className={`hidden font-serif font-bold ${mt.text} text-xs`}>{mt.tagAvatar || mt.tagName.charAt(0)}</span>
                    </button>
                  ) : (
                    <div 
                      className={`w-8 h-8 rounded-full border ${t.border}/40 flex items-center justify-center shrink-0 overflow-hidden bg-[#10131A] text-xs font-bold ${t.text} shadow-md`}
                      title={`${userNickname} (${userPronouns})`}
                    >
                      {userPhoto ? (
                        <img src={userPhoto} alt={userNickname} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        userNickname.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  )}

                  <div className="space-y-1 grow max-w-full">
                    {/* Header above bubble with elegant tag and integrated TTS audio widget */}
                    <div className={`flex items-center gap-2 mb-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[9px] font-black ${isSelf ? t.text : mt.text} font-serif tracking-[0.2em] uppercase`}>
                        {isSelf ? 'KÁ' : mt.tagName}
                      </span>
                      {!isSelf && (
                        <button 
                          onClick={() => handleSpeak(m.text, idx, m.sender)}
                          className={`flex items-center gap-2 px-3 py-1 bg-[#160B08] border ${mt.border}/30 rounded-full ${mt.text} hover:${mt.bg}/10 transition-all text-[9px] font-mono select-none shadow-sm`}
                          title="Ouvir Resposta Nativa (TTS)"
                        >
                          {speakingMessageIdx === idx ? (
                            <Pause className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />
                          ) : (
                            <Play className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />
                          )}
                          
                          {/* Equalizer lines faithful to the screenshot's wave lines */}
                          <div className="flex items-end gap-[1.5px] h-2.5 px-0.5">
                            {[1, 2, 3, 4, 5].map((bar) => {
                              const staticHeights = ['h-1', 'h-2', 'h-2.5', 'h-1.5', 'h-2'];
                              const speakAnimations = [
                                'animate-[bounce_0.8s_infinite_100ms]',
                                'animate-[bounce_0.7s_infinite_300ms]',
                                'animate-[bounce_0.9s_infinite_200ms]',
                                'animate-[bounce_0.6s_infinite_400ms]',
                                'animate-[bounce_0.8s_infinite_0ms]',
                              ];
                              return (
                                <div 
                                  key={bar} 
                                  className={`w-[1.5px] ${mt.bg} rounded-full transition-all ${
                                    speakingMessageIdx === idx ? speakAnimations[bar - 1] : staticHeights[bar - 1]
                                  }`} 
                                />
                              );
                            })}
                          </div>

                          <Volume2 className={`w-2.5 h-2.5 ${mt.text}`} />
                        </button>
                      )}
                    </div>

                    {/* Speech Bubble Box with dark background and thin orange borders */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group border ${
                      isSelf 
                        ? `${t.bubbleSelf} ${t.border35} text-[#F7EFE7] rounded-tr-none` 
                        : `${t.bubbleOther} ${t.border}/20 text-[#F7EFE7] rounded-tl-none`
                    }`}>
                      {m.promptCached && (
                        <div className="mb-2 text-[8px] font-bold uppercase tracking-widest text-[#FF4C1F] flex items-center gap-1.5 opacity-80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C1F] animate-pulse"></span>
                          Prompt Caching Ativo
                        </div>
                      )}
                      {m.semanticCached && (
                        <div className="mb-2 text-[8px] font-bold uppercase tracking-widest text-[#3B82F6] flex items-center gap-1.5 opacity-80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                          Rascunho local
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>

                      {/* Proposed Semaphore action trigger */}
                      {m.proposedSemaphore && (
                        <div className={`mt-2.5 p-2.5 ${t.bg}/10 border ${t.border}/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5`}>
                          <span className="text-[10px] text-[#A89F96] leading-tight text-center sm:text-left">
                            Ativar o Semáforo <strong className={`${t.text}`}>{PRESENCA_META[m.proposedSemaphore].label}</strong> agora?
                          </span>
                          <button
                            onClick={() => {
                              const sem = m.proposedSemaphore!;
                              setPresencaRegime(sem);
                              localStorage.setItem('Klio_presenca_regime', sem);
                              // Trigger state update notification or confirmation
                              setMessages(prev => [
                                ...prev,
                                {
                                  sender: 'Klio',
                                  text: `Confirmado. Ativei o Semáforo ${PRESENCA_META[sem].label} (${PRESENCA_META[sem].desc}) conforme solicitado.`,
                                  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                }
                              ]);
                            }}
                            className={`px-2.5 py-1 ${t.bg} ${t.hoverBgHover} text-[#06070A] font-black text-[9px] uppercase tracking-wider rounded-lg transition-all`}
                          >
                            Ativar {PRESENCA_META[m.proposedSemaphore].label}
                          </button>
                        </div>
                      )}

                      {/* Render copyable code blocks if provided by coder */}
                      {m.codeSnippet && (
                        <div className="mt-2.5 bg-[#06070A] rounded-xl border border-[#252936] text-slate-100 p-3 font-mono text-[9px] space-y-2 relative group overflow-x-auto">
                          <div className="flex justify-between items-center text-[#A89F96] border-b border-[#252936] pb-1.5 mb-1 text-[8px]">
                            <span>IMPLEMENTAÇÃO TÉCNICA</span>
                            <button
                              onClick={() => copyToClipboard(m.codeSnippet || '', idx)}
                              className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                              {copiedIndex === idx ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copiar
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="text-emerald-400">{m.codeSnippet}</pre>
                        </div>
                      )}

                    </div>

                    <div className={`flex items-center gap-2 text-[8px] text-[#A89F96]/60 font-mono ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span>{m.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Active processing Pipeline Indicator */}
            {loading && activeMode === 'Klio' && (
              <div className="self-start max-w-[85%] space-y-2 pl-11">
                <div className={`p-3 bg-[#10131A] border ${t.border}/20 rounded-2xl rounded-tl-none text-xs text-[#A89F96]`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.bg} animate-ping`}></span>
                    <span className="font-bold text-[#F7EFE7] uppercase tracking-wider text-[8px] font-mono">
                      Processando...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator for coder */}
            {loading && activeMode === 'coder' && (
              <div className="self-start max-w-[85%] pl-11">
                <div className={`p-3 bg-[#10131A] border ${t.border}/20 rounded-2xl rounded-tl-none text-xs text-[#A89F96] flex items-center gap-2`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${t.bg} animate-bounce`}></span>
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#A89F96]/80">Preparando rascunho textual para revisão humana...</span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Fixed bottom controls tray containing the KITT Progress Meter and message composer */}
          <div className={`absolute bottom-0 left-0 w-full bg-[#090A0D] border-t ${t.border}/10 z-10`}>
            {/* KITT Scanner */}
            <div className="flex justify-center items-center py-2 px-4 select-none bg-[#090A0D]/95">
              <KittScanner 
                state={getKittState()}
                variant={activeMode === 'coder' ? 'ember' : 'ruby'}
                className="w-48 max-w-full"
                height={16}
                segments={8}
              />
            </div>

            {/* Input tray with STT Microphone integrated */}
            <div className={`p-3 border-t ${t.border}/10 bg-[#090A0D] flex gap-2 sm:gap-3 items-center`}>

              {/* Attachment Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-8 h-8 rounded-full border ${t.border}/30 hover:${t.bg}/10 hover:${t.border} flex items-center justify-center ${t.text} transition-all shrink-0`}
                title="Anexar arquivo (Imagem/PDF/Câmera)"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,application/pdf" className="hidden" />

              {/* Middle Message Input fully rounded with branching git icon */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                  placeholder="Mensagem"
                  className={`w-full text-xs pl-5 pr-20 py-3 border ${t.border}/30 rounded-full focus:outline-none focus:ring-1 ${t.ring30} focus:${t.border} text-[#F7EFE7] bg-[#0E0F12] placeholder-[#A89F96]/40`}
                  id="ai-message-input"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'fala' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title={activeMode === 'coder' ? "Modo Voz (Klio)" : "Modo Voz (Klio)"}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title="Consultar Sedimentação (Atalho)"
                    id="chat-input-sediment-shortcut"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'branding' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title="Branding KLIO"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                  </button>
                </div>
              </div>

              {/* Smart Microphone / Send solid orange circle button on the right */}
              <button
                onClick={input.trim() ? handleSend : toggleListen}
                disabled={loading && !!input.trim()}
                className={`w-10 h-10 rounded-full ${t.bg} ${t.hoverBgHover} text-[#06070A] transition-all flex items-center justify-center shrink-0 ${t.shadow12} ${
                  isListening ? `animate-pulse bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]` : ''
                }`}
                id="ai-btn-action"
              >
                {input.trim() ? (
                  <Send className="w-4 h-4" />
                ) : isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
