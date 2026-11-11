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
import { audioRecorder } from '@/utils/audioRecorder';

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
    gnaniApiKey,
    groqApiKey,
    geminiApiKey,
    openaiApiKey,
    aiServerStatus,
    profile,
    t
  } = useApp();

  const isAiConnected = Boolean(
    gnaniApiKey ||
    groqApiKey ||
    geminiApiKey ||
    openaiApiKey ||
    aiServerStatus?.configured
  );

  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [synthesizingId, setSynthesizingId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Helper to sanitize text for speech synthesis
  const sanitizeForVoice = (text: string): string => {
    if (!text) return '';
    let cleaned = text
      .split('---FOLLOW_UPS---')[0]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#*`~_>\-\[\]\(\)]/g, ' ')
      .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleaned.length <= 500) return cleaned;
    const match = cleaned.slice(0, 500).match(/(.*[.?!।\n])\s+/);
    if (match && match[1] && match[1].length > 100) {
      return match[1].trim();
    }
    const wordBound = cleaned.slice(0, 480).lastIndexOf(' ');
    if (wordBound > 100) return cleaned.slice(0, wordBound).trim() + '.';
    return cleaned.slice(0, 450).trim() + '.';
  };

  // Auto-scroll inside floating chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, isSending]);

  // Pre-load speech synthesis voices for natural regional multi-language playback
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Clean up active listeners on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const handleVoiceFinish = async () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    let recordedBlob: Blob | null = null;
    let duration = 0;
    try {
      const res = await audioRecorder.stop();
      recordedBlob = res.blob;
      duration = res.durationSec;
    } catch (e) {
      console.warn('Error stopping audio recorder in bot:', e);
    }

    let finalPrompt = inputVal.trim() || liveTranscript.trim();

    // If SpeechRecognition was silent, transcribe the recorded WAV directly via Gnani Prisma STT!
    if (!finalPrompt && recordedBlob && duration >= 0.3) {
      setIsTranscribing(true);
      try {
        const formData = new FormData();
        formData.append('audio', recordedBlob, 'voice_input.wav');
        formData.append('language', selectedLanguage);
        if (gnaniApiKey) formData.append('apiKey', gnaniApiKey);

        const res = await fetch('/api/ai/gnani/stt', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          if (data.transcript && data.transcript.trim()) {
            finalPrompt = data.transcript.trim();
            setInputVal(finalPrompt);
            setLiveTranscript(finalPrompt);
          }
        }
      } catch (sttErr) {
        console.warn('Gnani STT transcription error in bot:', sttErr);
      } finally {
        setIsTranscribing(false);
      }
    }

    if (finalPrompt) {
      setInputVal('');
      setLiveTranscript('');
      setIsSending(true);
      try {
        const reply = await sendUserMessage(finalPrompt, selectedLanguage);
        if (reply && autoSpeak) {
          speakText(reply.text, reply.id);
        }
      } finally {
        setIsSending(false);
      }
    }
  };

  const toggleMic = async () => {
    if (isListening) {
      await handleVoiceFinish();
      return;
    }

    try {
      await audioRecorder.start((vol) => setVoiceVolume(vol));
      setIsListening(true);
      setLiveTranscript('');

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = selectedLanguage;
          rec.onresult = (event: any) => {
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
          rec.onerror = (event: any) => {
            console.warn('SpeechRecognition error in bot:', event.error);
          };
          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.warn('SpeechRecognition parallel start notice:', e);
        }
      }
    } catch (err: any) {
      console.warn('Microphone permission error in bot:', err);
      setIsListening(false);
    }
  };

  const fallbackSpeechSynthesis = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      setSynthesizingId(null);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch (e) {}

    const cleanText = sanitizeForVoice(text);
    if (!cleanText) {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      setSynthesizingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const targetLang = selectedLanguage.toLowerCase().replace('_', '-');
    const langPrefix = targetLang.split('-')[0];
    let matchingVoice =
      voices.find((v) => v.lang.toLowerCase().replace('_', '-') === targetLang) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (!matchingVoice) {
      matchingVoice = voices.find((v) => v.lang.includes('IN')) || voices[0];
    }
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    const resetState = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      setSynthesizingId(null);
    };

    utterance.onend = resetState;
    utterance.onerror = resetState;

    setSpeakingMessageId(msgId);
    setSynthesizingId(null);
    setIsSpeaking(true);

    try {
      window.speechSynthesis.speak(utterance);
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          resetState();
        }
      }, 25000);
    } catch (err) {
      resetState();
    }
  };

  const speakText = async (text: string, msgId: string) => {
    if ((isSpeaking || synthesizingId) && speakingMessageId === msgId) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      setSynthesizingId(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }

    const clean = sanitizeForVoice(text);
    if (!clean) return;

    setSpeakingMessageId(msgId);
    setSynthesizingId(msgId);
    setIsSpeaking(false);

    // Call Gnani Timbre Neural Indic Voice
    try {
      const res = await fetch('/api/ai/gnani/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(gnaniApiKey ? { 'x-gnani-key': gnaniApiKey } : {})
        },
        body: JSON.stringify({
          text: clean,
          language: selectedLanguage,
          apiKey: gnaniApiKey
        })
      });

      if (res.ok) {
        const audioBuffer = await res.arrayBuffer();
        const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;

        audio.onended = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          setSynthesizingId(null);
          URL.revokeObjectURL(audioUrl);
        };
        audio.onerror = () => {
          setSynthesizingId(null);
          fallbackSpeechSynthesis(clean, msgId);
        };

        setSynthesizingId(null);
        setIsSpeaking(true);
        await audio.play().catch((playErr) => {
          console.warn('Playback error, using fallback:', playErr);
          fallbackSpeechSynthesis(clean, msgId);
        });
        return;
      }
    } catch (e) {
      console.warn('Gnani voice unavailable, falling back:', e);
    }

    setSynthesizingId(null);
    fallbackSpeechSynthesis(clean, msgId);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isSending) return;

    const isVoiceInput = isListening || Boolean(liveTranscript);
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    }

    const textToSend = inputVal.trim();
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);

    try {
      const reply = await sendUserMessage(textToSend, selectedLanguage);
      if ((isVoiceInput || autoSpeak) && reply) {
        speakText(reply.text, reply.id);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleFollowUpClick = async (question: string) => {
    if (isSending) return;
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      setIsListening(false);
    }
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);
    try {
      const reply = await sendUserMessage(question, selectedLanguage);
      if (autoSpeak && reply) {
        speakText(reply.text, reply.id);
      }
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
          return <strong key={pIdx} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={pIdx} className="italic text-foreground/90">{part.slice(1, -1)}</em>;
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
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 px-4 py-3 bg-gradient-to-r from-purple-600 via-primary to-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-105 group border border-white/20"
          title="Open Gnani AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary" />
          </div>
          <span className="font-bold text-xs tracking-wide">Ask Gnani AI 🌸</span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] bg-white dark:bg-card rounded-3xl shadow-2xl border border-blush-200 dark:border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-r from-cream-100 via-blush-50 to-lavender-50 dark:from-muted/40 dark:via-card dark:to-muted/20 border-b border-blush-100 dark:border-border flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blush-500 to-rose-400 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-gray-900 dark:text-foreground">Gnani AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full font-bold">
                    Week {profile.currentGestationalWeek || 24}
                  </span>
                  {isAiConnected && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-purple-600 text-white rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Gnani Active
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 dark:text-muted-foreground">Indic Voice & Clinical AI (Gnani.ai)</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={e => setSelectedLanguage(e.target.value)}
                className="text-[11px] bg-white dark:bg-muted border border-gray-200 dark:border-border rounded-lg px-2 py-1 font-semibold text-gray-700 dark:text-foreground focus:outline-none"
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
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-muted rounded-lg transition-colors"
                title="Full Screen View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-muted rounded-lg transition-colors cursor-pointer"
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
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50 dark:bg-muted/20">
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
                        : 'bg-white dark:bg-card text-gray-800 dark:text-foreground rounded-tl-xs border border-gray-100 dark:border-border'
                    }`}
                  >
                    <div>{renderFormatted(msg.text)}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/10 text-[9px] opacity-75">
                      <span>{msg.timestamp}</span>

                      {!isUser && (
                        <button
                          onClick={() => speakText(msg.text, msg.id)}
                          className="flex items-center gap-1 font-bold text-primary hover:underline cursor-pointer"
                        >
                          {synthesizingId === msg.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-primary" />
                              <span>Loading voice...</span>
                            </>
                          ) : isSpeaking && speakingMessageId === msg.id ? (
                            <>
                              <VolumeX className="w-3 h-3 text-rose-500 animate-pulse" />
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
                            onClick={() => handleFollowUpClick(fu)}
                            className="text-[10px] px-2 py-0.5 bg-muted/60 dark:bg-muted hover:bg-primary-soft text-foreground hover:text-primary rounded-lg border border-border transition-colors text-left truncate max-w-full cursor-pointer"
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
                <span>Gnani AI is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-1.5 bg-white dark:bg-card border-t border-gray-100 dark:border-border flex items-center gap-1.5 overflow-x-auto text-[11px]">
            {(() => {
              const quickPromptsByLang: Record<string, string[]> = {
                'kn-IN': ['ಆಹಾರ ಕ್ರಮ', 'ಬೆನ್ನು ನೋವು ಪರಿಹಾರ', 'ಮಗುವಿನ ಚಲನೆ', 'ಆಸ್ಪತ್ರೆ ಬ್ಯಾಗ್'],
                'hi-IN': ['आहार सलाह', 'पीठ दर्द में आराम', 'शिशु की हलचल', 'अस्पताल बैग'],
                'ta-IN': ['சத்தான உணவு', 'முதுகு வலி தீர்வு', 'குழந்தை அசைவு', 'மருத்துவமனை பை'],
                'te-IN': ['పోషకాహారం', 'నడుము నొప్పి నివారణ', 'శిశువు కదలికలు', 'హాస్పిటల్ బ్యాగ్'],
                'ml-IN': ['പോഷകാഹാരം', 'നടുവേദന പരിഹാരം', 'കുഞ്ഞിന്റെ ചലനം', 'ഹോസ്പിറ്റൽ ബാഗ്'],
                'en-US': ['Week 24 guidance', 'Relieve back pain', 'Safe kicks count', 'Hospital bag']
              };
              const prompts = quickPromptsByLang[selectedLanguage] || quickPromptsByLang['en-US'];
              return prompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleFollowUpClick(q)}
                  className="px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-muted hover:bg-blush-50 dark:hover:bg-primary/20 text-gray-600 dark:text-gray-300 hover:text-primary shrink-0 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ));
            })()}
          </div>

          {/* Live Voice Listening Banner */}
          {isListening && (
            <div className="px-3 py-2 bg-gradient-to-r from-rose-600 to-blush-600 text-white flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2 truncate">
                {/* Audio Visualizer Waves */}
                <div className="flex items-center gap-0.5 h-3.5 shrink-0">
                  {[0.4, 0.9, 0.6, 1.0, 0.7, 0.3].map((f, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-white rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(3, Math.min(14, 14 * (voiceVolume * f + 0.25)))}px` }}
                    />
                  ))}
                </div>
                <span className="font-semibold truncate">
                  {isTranscribing
                    ? 'Transcribing audio with Gnani AI...'
                    : liveTranscript
                    ? `"${liveTranscript}"`
                    : 'Listening to your voice... Speak now'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleVoiceFinish}
                disabled={isTranscribing || isSending}
                className="px-2.5 py-0.5 bg-white text-rose-600 font-bold rounded-lg text-[11px] shrink-0 disabled:opacity-60 hover:bg-rose-50 cursor-pointer flex items-center gap-1"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin text-rose-600" />
                    <span>Transcribing...</span>
                  </>
                ) : (
                  <span>Done & Send</span>
                )}
              </button>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-card border-t border-gray-100 dark:border-border flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-muted/80 text-gray-700 dark:text-gray-200'
              }`}
              title={isListening ? 'Stop listening' : 'Speak into mic'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                autoSpeak
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 ring-1 ring-rose-200 dark:ring-rose-800'
                  : 'bg-gray-100 dark:bg-muted text-gray-400 dark:text-gray-500'
              }`}
              title={autoSpeak ? 'Auto-voice answers: ON (Tap to turn OFF)' : 'Auto-voice answers: OFF (Tap to turn ON)'}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder={isListening ? 'Listening...' : 'Type or speak your question...'}
              className="flex-1 bg-gray-50 dark:bg-muted/50 border border-gray-200 dark:border-border rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
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
