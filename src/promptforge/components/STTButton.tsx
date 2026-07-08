import { useSTT } from '../lib/sttHook';

interface STTButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export default function STTButton({ onTranscript, disabled }: STTButtonProps) {
  const { isListening, isSupported, language, startListening, stopListening, toggleLanguage, error } = useSTT(onTranscript);

  if (!isSupported) {
    return (
      <div className="pf-stt-unsupported" title="Use Chrome ou Edge para reconhecimento de voz">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </div>
    );
  }

  return (
    <div className="pf-stt-wrapper">
      <button
        id="pf-stt-btn"
        className={`pf-stt-btn ${isListening ? 'listening' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        title={isListening ? 'Parar gravação' : 'Falar (Speech-to-Text)'}
      >
        {/* Ripple rings when listening */}
        {isListening && (
          <>
            <span className="pf-stt-ring ring-1" />
            <span className="pf-stt-ring ring-2" />
            <span className="pf-stt-ring ring-3" />
          </>
        )}

        {/* Mic icon */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isListening ? (
            // Stop / square icon when listening
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          ) : (
            <>
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </>
          )}
        </svg>
      </button>

      {/* Language toggle */}
      <button
        id="pf-stt-lang-toggle"
        className="pf-stt-lang"
        onClick={toggleLanguage}
        title="Alternar idioma"
      >
        {language === 'pt-BR' ? '🇧🇷' : '🇺🇸'}
      </button>

      {/* Error toast */}
      {error && (
        <div className="pf-stt-error">{error}</div>
      )}
    </div>
  );
}
