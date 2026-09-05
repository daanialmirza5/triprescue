import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useApp } from '@/store/AppContext';
import { suggestedPrompts } from '@/data/mockData';
import * as api from '@/services/api';
import type { ChatMessage } from '@/types';
import { Sparkles, X, Send, Plane, Shield, LifeBuoy, TrendingDown } from 'lucide-react';

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
}

function now() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function AIAssistant({ open, onClose }: AIAssistantProps) {
  const { tripId, trip } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm the TripRescue AI assistant for ${trip.name}. I can analyze your itinerary, explain risks, and help you choose recovery options. What would you like to know?`,
      timestamp: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const streamIn = (assistantId: string, content: string) => {
    const words = content.split(' ');
    let wordIndex = 0;
    const streamInterval = setInterval(() => {
      if (wordIndex >= words.length) {
        clearInterval(streamInterval);
        setStreaming(false);
        return;
      }
      const partial = words.slice(0, wordIndex + 1).join(' ');
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === assistantId);
        if (existing) return prev.map((m) => (m.id === assistantId ? { ...m, content: partial } : m));
        return [...prev, { id: assistantId, role: 'assistant', content: partial, timestamp: now() }];
      });
      wordIndex++;
    }, 25);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: 'user', content: text, timestamp: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    try {
      const answer = await api.askAssistant(tripId, text);
      const assistantId = `msg-${Date.now()}-ai`;
      streamIn(assistantId, answer.content);
    } catch {
      setStreaming(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: "I couldn't reach the TripRescue backend just now. Please check the connection and try again.",
          timestamp: now(),
        },
      ]);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-ink-100/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col glass-strong border-l border-ink-700 animate-slide-in-right">
        <div className="flex items-center justify-between border-b border-ink-700 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-electric-600 shadow-glow-cyan">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink-100">TripRescue AI</div>
              <div className="flex items-center gap-1 text-[10px] text-ink-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
                Online · Context-aware
              </div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-700 hover:text-ink-100" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} streaming={streaming && msg.id === messages[messages.length - 1]?.id} />
          ))}

          {messages.length <= 1 && (
            <div className="space-y-2 pt-2">
              <div className="text-[10px] font-medium text-ink-500 uppercase tracking-wider">Suggested questions</div>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="flex w-full items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 p-2.5 text-left text-xs text-ink-300 transition hover:border-accent-500/40 hover:bg-accent-500/5 hover:text-ink-100"
                >
                  {prompt.includes('delay') ? <Plane className="h-3.5 w-3.5 text-accent-600 shrink-0" /> :
                   prompt.includes('cheapest') ? <TrendingDown className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> :
                   prompt.includes('Pangong') ? <Shield className="h-3.5 w-3.5 text-amber-600 shrink-0" /> :
                   prompt.includes('rank') ? <LifeBuoy className="h-3.5 w-3.5 text-accent-600 shrink-0" /> :
                   <TrendingDown className="h-3.5 w-3.5 text-red-600 shrink-0" />}
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-ink-700 p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask about your trip..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-ink-600 bg-ink-800 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-accent-500/50 focus:outline-none scrollbar-thin"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-accent-500 to-electric-600 text-white transition hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MessageBubble({ message, streaming }: { message: ChatMessage; streaming?: boolean }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-2.5 animate-fade-in-up', isUser && 'flex-row-reverse')}>
      <div className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
        isUser ? 'bg-ink-700 text-ink-300' : 'bg-gradient-to-br from-accent-500 to-electric-600 text-white'
      )}>
        {isUser ? 'A' : <Sparkles className="h-3.5 w-3.5" />}
      </div>
      <div className={cn('flex-1', isUser && 'flex justify-end')}>
        <div className={cn(
          'inline-block max-w-[90%] rounded-xl px-3 py-2 text-xs leading-relaxed',
          isUser ? 'bg-accent-500/15 text-ink-100' : 'bg-ink-900 text-ink-100 border border-ink-700'
        )}>
          {message.content}
          {streaming && <span className="ml-0.5 inline-block h-3 w-0.5 animate-blink bg-accent-500 align-middle" />}
        </div>
        <div className={cn('mt-1 text-[9px] text-ink-500', isUser && 'text-right')}>{message.timestamp}</div>
      </div>
    </div>
  );
}
