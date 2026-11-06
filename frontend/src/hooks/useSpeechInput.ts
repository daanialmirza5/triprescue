import { useCallback, useEffect, useRef, useState } from 'react';

/** The slice of the Web Speech API this hook uses (not in TypeScript's DOM lib). */
interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function recognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const ERROR_MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access was blocked. Allow it in your browser to speak your report.',
  'service-not-allowed': 'Microphone access was blocked. Allow it in your browser to speak your report.',
  'no-speech': "Didn't catch that - try again, or type your report.",
  'audio-capture': 'No microphone was found.',
  network: 'Speech recognition needs a network connection.',
};

/** Browser speech-to-text for short reports. `supported` is false where the
 * Web Speech API is missing (e.g. Firefox), so callers can hide the control. */
export function useSpeechInput(onTranscript: (text: string) => void, lang = 'en-IN') {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const callback = useRef(onTranscript);
  callback.current = onTranscript;
  const supported = recognitionCtor() !== null;

  const stop = useCallback(() => recognition.current?.stop(), []);

  const start = useCallback(() => {
    const Ctor = recognitionCtor();
    if (!Ctor || recognition.current) return;
    const r = new Ctor();
    r.lang = lang;
    r.interimResults = false;
    r.continuous = false;
    r.onresult = (event) => {
      const text = Array.from(event.results, (result) => result[0]?.transcript ?? '').join(' ').trim();
      if (text) callback.current(text);
    };
    r.onerror = (event) => setError(ERROR_MESSAGES[event.error] ?? 'Speech recognition stopped unexpectedly.');
    r.onend = () => {
      recognition.current = null;
      setListening(false);
    };
    setError(null);
    recognition.current = r;
    setListening(true);
    try {
      r.start();
    } catch {
      recognition.current = null;
      setListening(false);
      setError('Speech recognition could not start.');
    }
  }, [lang]);

  useEffect(() => () => recognition.current?.stop(), []);

  return { supported, listening, error, start, stop };
}
