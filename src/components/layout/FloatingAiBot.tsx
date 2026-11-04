'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  SUPPORTED_LANGUAGES
} from '@/data/aiMedicalKnowledge';
import {
  Bot,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  Radio,
  Loader2,
  MessageSquareHeart,
  ChevronDown
} from 'lucide-react';

interface FloatingAiBotProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const FloatingAiBot: React.FC<FloatingAiBotProps> = ({
  activeTab: propActiveTab,
  setActiveTab: propSetActiveTab
}) => {
  const {
    chatMessages,
    sendUserMessage,
    selectedLanguage,
    setSelectedLanguage,
    profile,
    t
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll inside floating chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, isSending]);

  // Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; ++i) {
            text += event.results[i][0].transcript + ' ';
          }
          const clean = text.trim();
          if (clean) {
            setLiveTranscript(clean);
            setInputVal(clean);
          }
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      } catch (e) {}
    }
  }, [selectedLanguage]);

  const toggleMic = async () => {
    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsListening(false);
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      recognitionRef.current.lang = selectedLanguage;
      setLiveTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      setIsListening(false);
    }
  };

  const speakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking && speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    setSpeakingMessageId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    if (isListening) {
      try { recognitionRef.current?.stop(); } catch (e) {}
      setIsListening(false);
    }

    const textToSend = inputVal.trim();
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);

    try {
      await sendUserMessage(textToSend, selectedLanguage);
    } finally {
      setIsSending(false);
    }
  };

  // Do not show floating bot if user is already on the dedicated Bloom AI tab
  if (propActiveTab === 'bloom-ai') {
    return null;
  }

  const renderFormatted = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);

      const formatted = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} className="italic text-gray-700">{part.slice(1, -1)}</em>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-1.5 py-0.5">
            <span className="text-primary mt-1 text-xs">•</span>
            <span className="flex-1 text-xs">{formatted}</span>
          </div>
        );
      }

      if (!line.trim()) return <div key={idx} className="h-1" />;

      return <p key={idx} className="py-0.5 text-xs">{formatted}</p>;
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-105 group border border-white/20"
          title="Open Bloom AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary" />
          </div>
          <span className="font-bold text-xs tracking-wide">Ask Bloom AI 🌸</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-blush-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-cream-100 via-blush-50 to-lavender-50 border-b border-blush-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blush-500 to-rose-400 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-gray-900">Bloom AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                    Week {profile.currentGestationalWeek || 24}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">24/7 Maternal Clinical Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="text-[11px] bg-white border border-gray-200 rounded-lg px-2 py-1 font-semibold text-gray-700 focus:outline-none"
              >
                {SUPPORTED_LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setIsOpen(false);
                  if (propSetActiveTab) propSetActiveTab('bloom-ai');
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
                title="Full Screen View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Listening Banner */}
          {isListening && (
            <div className="p-2.5 bg-gradient-to-r from-rose-500 to-blush-600 text-white text-xs flex items-center justify-between px-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 animate-spin" />
                <span className="font-semibold text-[11px]">Listening... speak in your language</span>
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="px-2 py-0.5 bg-white text-rose-600 font-bold rounded-md text-[10px] disabled:opacity-50"
              >
                Done
              </button>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
            {chatMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blush-500 to-rose-400 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 space-y-1.5 leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-primary text-white rounded-tr-xs'
                        : 'bg-white text-gray-800 rounded-tl-xs border border-gray-100'
                    }`}
                  >
                    <div>{renderFormatted(msg.text)}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[9px] opacity-75">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className="flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer"
                        >
                          {isSpeaking && speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-500" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3 h-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-1.5 border-t border-black/5 flex flex-wrap gap-1">
                        {msg.suggestedFollowUps.map((fu, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => setInputVal(fu)}
                            className="text-[10px] px-2 py-0.5 bg-gray-50 hover:bg-primary-soft text-gray-700 hover:text-primary rounded-lg border border-gray-200 transition-colors text-left truncate max-w-full"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-2 items-center text-xs text-gray-500 pl-1">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Bloom AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-white border-t border-gray-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {['Week 24 guidance', 'Relieve back pain', 'Safe kicks count', 'Hospital bag'].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInputVal(q)}
                className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-blush-50 text-gray-600 hover:text-primary shrink-0 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isListening ? 'Stop listening' : 'Speak into mic'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type or speak your question...'}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isSending}
              className="p-2 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all disabled:opacity-40 shrink-0 cursor-pointer shadow-xs"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
