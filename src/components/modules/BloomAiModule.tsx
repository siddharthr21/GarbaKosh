'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  SUPPORTED_LANGUAGES,
  SUGGESTED_PROMPTS,
  MEDICAL_DISCLAIMER
} from '@/data/aiMedicalKnowledge';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Bot,
  User,
  ShieldCheck,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  FileText
} from 'lucide-react';

export const BloomAiModule: React.FC = () => {
  const {
    profile,
    chatMessages,
    sendUserMessage,
    clearChat,
    selectedLanguage,
    setSelectedLanguage,
    triggerEmergencyModal
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pregnancy' | 'Labour' | 'Newborn' | 'Postpartum'>('All');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Speech Recognition (Speech-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLanguage;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputVal(prev => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [selectedLanguage]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser version. You can type directly.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = selectedLanguage;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech (TTS)
  const speakText = (text: string, msgId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isSpeaking && speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
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

    const messageText = inputVal.trim();
    setInputVal('');
    setIsSending(true);

    try {
      await sendUserMessage(messageText, selectedLanguage);
    } finally {
      setIsSending(false);
    }
  };

  const handleFollowUpClick = (question: string) => {
    if (question.startsWith('Call Dr.')) {
      window.location.href = `tel:${profile.doctorInfo.phone}`;
      return;
    }
    if (question.startsWith('Call Hospital')) {
      window.location.href = `tel:${profile.doctorInfo.emergencyContact.split(' ')[0]}`;
      return;
    }
    setInputVal(question);
  };

  const filteredPrompts =
    selectedCategory === 'All'
      ? SUGGESTED_PROMPTS
      : SUGGESTED_PROMPTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Medical Disclaimer */}
      <div className="bg-gradient-to-r from-cream-100 via-blush-50 to-lavender-50 rounded-3xl p-5 border border-blush-200/60 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blush-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-blush-200 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">Bloom AI Companion</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Context: Week {profile.currentGestationalWeek}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Warm, evidence-grounded answers for pregnancy, labor, newborn care, and postpartum recovery.
              </p>
            </div>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 shrink-0">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-white text-gray-800 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blush-400 focus:outline-none"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>

            <button
              onClick={clearChat}
              className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-white transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visible Medical Disclaimer Box */}
        <div className="p-3 bg-white/80 rounded-2xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Safety Notice:</strong> Bloom AI provides informational education and emotional support. It never replaces your gynecologist, midwife, or pediatrician. For acute emergencies, call 112 / 911 / 108 immediately.
          </p>
        </div>
      </div>

      {/* Suggested Topic Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px] shrink-0">Topics:</span>
          {(['All', 'Pregnancy', 'Labour', 'Newborn', 'Postpartum'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blush-500 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-blush-50 hover:text-blush-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs scrollbar-thin">
          {filteredPrompts.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleFollowUpClick(p.question)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-blush-50 border border-blush-100 text-gray-700 hover:text-blush-600 text-left transition-all shrink-0 shadow-2xs font-medium"
            >
              {p.question}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl p-4 md:p-6 border border-blush-100 shadow-sm flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-blush-100">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blush-500 to-rose-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-4 space-y-2 text-xs md:text-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-blush-500 to-rose-500 text-white rounded-tr-xs shadow-xs'
                      : msg.isEmergencyAlert
                      ? 'bg-red-50 border-2 border-red-500 text-red-950 rounded-tl-xs shadow-md'
                      : 'bg-gradient-to-br from-cream-50 to-blush-50/30 border border-blush-100 text-gray-800 rounded-tl-xs'
                  }`}
                >
                  {/* Emergency Alert Header inside message if flagged */}
                  {msg.isEmergencyAlert && (
                    <div className="flex items-center gap-2 text-red-700 font-extrabold pb-1 border-b border-red-200">
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      <span>{msg.emergencyTitle || 'CRITICAL CLINICAL ALERT'}</span>
                    </div>
                  )}

                  {/* Message Body with Markdown-like bold formatting */}
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {msg.text.split('\n').map((line, lidx) => (
                      <p key={lidx} className={line.startsWith('•') ? 'pl-2 py-0.5' : 'py-0.5'}>
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Message Footer: Timestamp, Voice TTS playback button */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className="flex items-center gap-1 hover:opacity-100 font-bold text-blush-600 transition-opacity"
                        title="Read message aloud"
                      >
                        {isSpeaking && speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                            <span>Stop voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Suggested Follow-Ups */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-black/5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-gray-500 block">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((fu, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => handleFollowUpClick(fu)}
                            className="px-2.5 py-1 rounded-xl bg-white text-gray-700 hover:text-blush-600 hover:bg-blush-50 border border-gray-200 text-xs font-semibold transition-colors text-left"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Speech Recognition and Send */}
        <form onSubmit={handleSend} className="pt-3 border-t border-gray-100 flex items-center gap-2">
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl transition-all shrink-0 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md'
                : 'bg-cream-100 hover:bg-cream-200 text-gray-700'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to speak in your language'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isListening
                ? 'Listening to your voice...'
                : `Ask Bloom AI about pregnancy, symptoms, baby care in ${selectedLanguage.split('-')[0].toUpperCase()}...`
            }
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-blush-400 focus:ring-2 focus:ring-blush-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isSending}
            className="p-3 bg-gradient-to-r from-blush-500 to-rose-500 hover:from-blush-600 hover:to-rose-600 text-white rounded-2xl transition-all shadow-md shadow-blush-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
