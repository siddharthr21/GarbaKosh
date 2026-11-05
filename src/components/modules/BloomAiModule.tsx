'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  SUPPORTED_LANGUAGES,
  SUGGESTED_PROMPTS,
  SuggestedPrompt,
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
  CheckCircle,
  HelpCircle,
  Radio,
  Loader2,
  Key,
  Settings2,
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';

export const BloomAiModule: React.FC = () => {
  const {
    profile,
    chatMessages,
    sendUserMessage,
    clearChat,
    selectedLanguage,
    setSelectedLanguage,
    geminiApiKey,
    setGeminiApiKey,
    grokApiKey,
    setGrokApiKey,
    triggerEmergencyModal,
    t
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pregnancy' | 'Labour' | 'Newborn' | 'Postpartum'>('All');
  const [isSending, setIsSending] = useState(false);
  const [micErrorNotice, setMicErrorNotice] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [grokKeyInput, setGrokKeyInput] = useState(grokApiKey || '');
  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey || '');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testKeyStatus, setTestKeyStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestApiKey = async () => {
    if (!grokKeyInput.trim() && !geminiKeyInput.trim()) {
      setTestKeyStatus({ success: false, message: 'Please enter an xAI Grok API Key or Gemini Key to test.' });
      return;
    }
    setIsTestingKey(true);
    setTestKeyStatus(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Hello, confirm you are active and working.',
          grokApiKey: grokKeyInput.trim(),
          geminiApiKey: geminiKeyInput.trim(),
          gestationalWeek: profile.currentGestationalWeek || 24,
          language: 'en-US',
          test: true
        })
      });
      if (res.ok) {
        const data = await res.json();
        setTestKeyStatus({
          success: true,
          message: data.message || `Connected! Verified with ${data.source || 'AI Engine'}.`
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setTestKeyStatus({
          success: false,
          message: data.error || `Test failed (HTTP ${res.status}). Please check key validity.`
        });
      }
    } catch (e: any) {
      setTestKeyStatus({ success: false, message: 'Network connection error while testing key.' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isSending]);

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

  // Speech Recognition (Speech-to-Text) Listener
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

        recognition.onstart = () => {
          setIsListening(true);
          setMicErrorNotice(null);
        };

        recognition.onresult = (event: any) => {
          let interim = '';
          let finalized = '';

          for (let i = 0; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalized += transcript + ' ';
            } else {
              interim += transcript;
            }
          }

          const currentText = (finalized + interim).trim();
          if (currentText) {
            setLiveTranscript(currentText);
            setInputVal(currentText);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setMicErrorNotice('Microphone permission was denied. Please allow microphone access in your browser settings.');
          } else if (event.error === 'no-speech') {
            // silence timeout
          } else {
            setMicErrorNotice(`Speech recognition notice: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.error('Failed to initialize speech recognition:', e);
      }
    }
  }, [selectedLanguage]);

  const toggleSpeechRecognition = async () => {
    setMicErrorNotice(null);

    // If currently listening, stop it
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // Check if SpeechRecognition is available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser version. You can type directly in any language.');
      return;
    }

    // Request microphone permission first
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (micErr) {
      console.warn('Microphone permission check failed:', micErr);
      setMicErrorNotice('Please grant microphone permission in your browser to speak with Bloom AI.');
      return;
    }

    try {
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLanguage;
        recognitionRef.current = recognition;
      } else {
        recognitionRef.current.lang = selectedLanguage;
      }

      setLiveTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      console.error('Error starting speech recognition:', e);
      if (e?.name === 'InvalidStateError') {
        // Recognition was already running, stop and restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
            setIsListening(true);
          }, 300);
        } catch (restartErr) {}
      } else {
        setMicErrorNotice('Unable to start speech listener. You can type directly.');
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

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.95;

    // Pick best matching voice if available (match full locale or language prefix)
    const voices = window.speechSynthesis.getVoices();
    const targetLang = selectedLanguage.toLowerCase().replace('_', '-');
    const langPrefix = targetLang.split('-')[0];
    const matchingVoice =
      voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang) ||
      voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

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

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsListening(false);
    }

    const messageText = inputVal.trim();
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);

    try {
      await sendUserMessage(messageText, selectedLanguage);
    } finally {
      setIsSending(false);
    }
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      const cleanLine = isBullet ? line.trim().replace(/^[•\-]\s*/, '') : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*|\*.*?\*)/g);

      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={pIdx} className="italic text-gray-700">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
            <span className="text-primary font-bold mt-1 text-xs">•</span>
            <span className="flex-1">{formattedParts}</span>
          </div>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="py-0.5">
          {formattedParts}
        </p>
      );
    });
  };

  const handleFollowUpClick = async (question: string) => {
    if (question.startsWith('Call Dr.') || question.startsWith('Call Doctor')) {
      window.location.href = `tel:${profile.doctorInfo.phone}`;
      return;
    }
    if (question.startsWith('Call Hospital') || question.startsWith('Emergency')) {
      window.location.href = `tel:${profile.doctorInfo.emergencyContact.split(' ')[0]}`;
      return;
    }
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
      setIsListening(false);
    }
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);
    try {
      await sendUserMessage(question, selectedLanguage);
    } finally {
      setIsSending(false);
    }
  };

  const getLocalizedPrompts = (lang: string): SuggestedPrompt[] => {
    switch (lang) {
      case 'kn-IN':
        return [
          { category: 'Pregnancy', question: 'ಬೆಳಗಿನ ವಾಕರಿಕೆ ಮತ್ತು ವಾಂತಿಯನ್ನು ಕಡಿಮೆ ಮಾಡುವುದು ಹೇಗೆ?' },
          { category: 'Pregnancy', question: 'ಗರ್ಭಧಾರಣೆಯ ೨ನೇ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಉತ್ತಮ ಮಲಗುವ ಭಂಗಿ ಯಾವುದು?' },
          { category: 'Labour', question: 'ಹೆರಿಗೆ ನೋವಿನ ೫-೧-೧ ಗೋಲ್ಡನ್ ನಿಯಮ ಎಂದರೇನು?' },
          { category: 'Newborn', question: 'ನವಜಾತ ಶಿಶುವಿಗೆ ಮೊದಲ ಎದೆಹಾಲುಣಿಸುವ ಸರಿಯಾದ ವಿಧಾನ' },
          { category: 'Postpartum', question: 'ಹೆರಿಗೆಯ ನಂತರದ ಮಾನಸಿಕ ಮತ್ತು ದೈಹಿಕ ಚೇತರಿಕೆ' },
        ];
      case 'hi-IN':
        return [
          { category: 'Pregnancy', question: 'मॉर्निंग सिकनेस और मतली से राहत पाने के घरेलू उपाय क्या हैं?' },
          { category: 'Pregnancy', question: 'गर्भावस्था में सोने की सबसे सुरक्षित स्थिति कौन सी है?' },
          { category: 'Labour', question: 'प्रसव संकुचन का 5-1-1 नियम क्या है?' },
          { category: 'Newborn', question: 'नवजात शिशु को सही तरीके से स्तनपान कैसे कराएं?' },
          { category: 'Postpartum', question: 'प्रसवोत्तर रिकवरी और भावनात्मक स्वास्थ्य का ख्याल' },
        ];
      case 'ta-IN':
        return [
          { category: 'Pregnancy', question: 'கர்ப்பகால வாந்தி மற்றும் குமட்டலைத் தவிர்ப்பது எப்படி?' },
          { category: 'Pregnancy', question: 'கர்ப்ப காலத்தில் தூங்குவதற்கு சிறந்த நிலை எது?' },
          { category: 'Labour', question: 'பிரசவ சுருக்கங்களின் 5-1-1 விதி என்றால் என்ன?' },
          { category: 'Newborn', question: 'பிறந்த குழந்தைக்கு தாய்ப்பால் கொடுப்பதற்கான சரியான வழி' },
          { category: 'Postpartum', question: 'பிரசவத்திற்குப் பிந்தைய உடல் மற்றும் மன நலம்' },
        ];
      case 'te-IN':
        return [
          { category: 'Pregnancy', question: 'గర్భధారణ సమయంలో వాంతులు మరియు వికారాన్ని ఎలా తగ్గించాలి?' },
          { category: 'Pregnancy', question: 'గర్భధారణలో పడుకోవడానికి ఉత్తమమైన భంగిమ ఏది?' },
          { category: 'Labour', question: 'కాన్పు నొప్పుల 5-1-1 గోల్డెన్ నియమం అంటే ఏమిటి?' },
          { category: 'Newborn', question: 'నవజాత శిశువుకు పాలిచ్చే సరైన పద్ధతి ఏమిటి?' },
          { category: 'Postpartum', question: 'ప్రసవానంతర మానసిక మరియు శారీరక రికవరీ' },
        ];
      case 'ml-IN':
        return [
          { category: 'Pregnancy', question: 'ഗർഭകാലത്തെ ഓക്കാനവും ഛർദ്ദിയും എങ്ങനെ കുറയ്ക്കാം?' },
          { category: 'Pregnancy', question: 'ഗർഭകാലത്ത് കിടക്കാൻ ഏറ്റവും അനുയോജ്യമായ രീതി ഏതാണ്?' },
          { category: 'Labour', question: 'പ്രസവവേദനയുടെ 5-1-1 സുവർണ്ണ നിയമം എന്താണ്?' },
          { category: 'Newborn', question: 'നവജാതശിശുവിന് മുലപ്പാൽ കൊടുക്കുന്ന ശരിയായ രീതി' },
          { category: 'Postpartum', question: 'പ്രസവാനന്തര ആരോഗ്യവും മാനസിക സമാധാനവും' },
        ];
      default:
        return SUGGESTED_PROMPTS;
    }
  };

  const currentPrompts = getLocalizedPrompts(selectedLanguage);
  const filteredPrompts =
    selectedCategory === 'All'
      ? currentPrompts
      : currentPrompts.filter(p => p.category === selectedCategory);

  const selectedLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner with Medical Disclaimer */}
      <div className="bg-gradient-to-r from-cream-100 via-blush-50 to-lavender-50 rounded-3xl p-5 border border-blush-200/60 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blush-500 to-rose-400 flex items-center justify-center text-white shadow-md shadow-blush-200 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{t('aiAssistantTitle', 'Bloom AI Pregnancy Companion')}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {t('week', 'Week')} {profile.currentGestationalWeek || 24}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Live Clinical AI
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {t('aiAssistantSubtitle', '24/7 intelligent maternal guidance with voice listener and 6-language translation.')}
              </p>
            </div>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-600 shrink-0">{t('lang', 'Language')}:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-white text-gray-800 border border-gray-200 rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-blush-400 focus:outline-none shadow-2xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>

            {/* AI Engine Configuration Button (Grok / Gemini / Dynamic) */}
            <button
              onClick={() => {
                setGrokKeyInput(grokApiKey || '');
                setGeminiKeyInput(geminiApiKey || '');
                setTestKeyStatus(null);
                setShowApiModal(true);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                grokApiKey
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : geminiApiKey
                  ? 'bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100'
                  : 'bg-primary-soft text-primary border border-primary/30 hover:bg-primary/20'
              }`}
              title="Configure xAI Grok API Key or Live AI Settings"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {grokApiKey ? 'xAI Grok: Active' : geminiApiKey ? 'Gemini Live: Active' : 'AI Engine: Live Dynamic'}
              </span>
            </button>

            <button
              onClick={clearChat}
              className="px-3 py-2 bg-white text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3 bg-white/70 rounded-2xl border border-blush-100 text-[11px] text-gray-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Clinical Safety Guarantee:</strong> Bloom AI answers are tailored to your 24-week gestation. Emergency red flag detection is active 24/7. Not a substitute for direct OB/GYN physical examination.
          </p>
        </div>
      </div>

      {/* Mic Permission Warning Notice if any */}
      {micErrorNotice && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{micErrorNotice}</span>
          </div>
          <button
            onClick={() => setMicErrorNotice(null)}
            className="text-[10px] font-bold text-amber-800 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Active Voice Listener Wave Banner */}
      {isListening && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-500 via-blush-600 to-rose-600 text-white shadow-lg space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <span className="font-bold text-xs uppercase tracking-wider">
                Listening in {selectedLangObj.native} ({selectedLangObj.name})... Speak Now
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="px-3 py-1 bg-white text-rose-600 font-bold rounded-xl text-xs transition-all hover:bg-rose-50 disabled:opacity-50"
              >
                Done & Send
              </button>
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className="p-1.5 bg-black/20 hover:bg-black/30 rounded-xl transition-all"
                title="Cancel Voice Listener"
              >
                <MicOff className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-black/20 rounded-2xl text-xs font-mono text-white/95 min-h-[44px] flex items-center">
            {liveTranscript ? (
              <span>"{liveTranscript}"</span>
            ) : (
              <span className="text-white/60 italic flex items-center gap-2">
                <Radio className="w-4 h-4 animate-spin" />
                Listening to your microphone... start speaking your question...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggested Questions Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-gray-500 font-bold text-[11px] shrink-0 uppercase tracking-wider mr-1">
            Browse Topics:
          </span>
          {(['All', 'Pregnancy', 'Labour', 'Newborn', 'Postpartum'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Suggested Prompt Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredPrompts.slice(0, 4).map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleFollowUpClick(p.question)}
              className="text-left text-xs bg-white hover:bg-blush-50 text-gray-700 hover:text-blush-700 px-3 py-2 rounded-2xl border border-gray-200 shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate max-w-xs">{p.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Conversation Box */}
      <div className="bg-white rounded-3xl p-5 border border-blush-100 shadow-2xs space-y-4">
        <div className="h-[460px] overflow-y-auto pr-2 space-y-4">
          {chatMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isEmergency = msg.isEmergencyAlert;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isEmergency
                        ? 'bg-rose-500 text-white'
                        : 'bg-gradient-to-tr from-blush-500 to-rose-400 text-white shadow-2xs'
                    }`}
                  >
                    {isEmergency ? <AlertTriangle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 space-y-2 text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white rounded-tr-xs'
                      : isEmergency
                      ? 'bg-rose-50 border border-rose-200 text-rose-950 rounded-tl-xs shadow-xs'
                      : 'bg-muted/40 text-gray-900 rounded-tl-xs border border-gray-100'
                  }`}
                >
                  {/* Emergency Header if alert */}
                  {isEmergency && msg.emergencyTitle && (
                    <div className="flex items-center gap-1.5 font-bold text-rose-700 text-xs pb-1 border-b border-rose-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{msg.emergencyTitle}</span>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="space-y-1">
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Message Footer: Timestamp, Voice TTS playback button */}
                  <div className="flex items-center justify-between pt-1 border-t border-black/5 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className="flex items-center gap-1 hover:opacity-100 font-bold text-primary transition-opacity cursor-pointer"
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
                            <span>Listen in voice</span>
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
                            className="px-2.5 py-1 rounded-xl bg-white text-gray-700 hover:text-primary hover:bg-primary-soft border border-gray-200 text-xs font-semibold transition-colors text-left cursor-pointer shadow-2xs"
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

          {/* Thinking / Sending Indicator */}
          {isSending && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blush-500 to-rose-400 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-muted/40 border border-gray-100 text-xs text-gray-600 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Bloom AI is consulting clinical knowledge & evidence-based guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Speech Recognition and Send */}
        <form onSubmit={handleSend} className="pt-3 border-t border-gray-100 flex items-center gap-2">
          {/* Voice Input Mic Button */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            className={`p-3 rounded-2xl transition-all shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse shadow-md ring-4 ring-rose-200'
                : 'bg-cream-100 hover:bg-cream-200 text-gray-700 shadow-2xs'
            }`}
            title={isListening ? 'Voice listener active - click to stop' : 'Click to speak with voice listener in your language'}
          >
            {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={
              isListening
                ? `Listening to your voice in ${selectedLangObj.native}...`
                : t('aiInputPlaceholder', 'Ask about baby kicks, nutrition, safe exercises, labor 5-1-1 rule...')
            }
            className="flex-1 bg-gray-50 border border-gray-200 focus:border-blush-400 focus:ring-2 focus:ring-blush-200 rounded-2xl px-4 py-3 text-xs md:text-sm text-gray-900 focus:outline-none transition-all shadow-2xs"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isSending}
            className="p-3 bg-gradient-to-r from-blush-500 to-rose-500 hover:from-blush-600 hover:to-rose-600 text-white rounded-2xl transition-all shadow-md shadow-blush-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            title={t('aiSend', 'Send Message')}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Gemini Live API Key Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-blush-100 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Live AI Engine Configuration</h3>
                  <p className="text-xs text-gray-500">xAI Grok & Multi-Provider Maternal Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Connect your <strong>xAI Grok API key</strong> to unlock live generative reasoning tailored directly to your questions in English, Kannada, Hindi, Tamil, Telugu, and Malayalam.
            </p>

            {/* Grok API Key Section */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>xAI Grok API Key:</span>
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <input
                type="password"
                value={grokKeyInput}
                onChange={e => setGrokKeyInput(e.target.value)}
                placeholder="xai-..."
                className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://console.x.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Get Grok Key at console.x.ai</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-500">grok-2-latest • High-IQ obstetric reasoning</span>
              </div>
            </div>

            {/* Alternative: Gemini API Key Section */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Alternative: Google Gemini API Key:
              </label>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={e => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <span>Get Free Gemini Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-400">Zero cost fallback</span>
              </div>
            </div>

            {testKeyStatus && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                  testKeyStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {testKeyStatus.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{testKeyStatus.message}</span>
              </div>
            )}

            {keySavedToast && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Live AI configuration saved and connected successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isTestingKey}
                className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isTestingKey ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {(grokApiKey || geminiApiKey) && (
                  <button
                    type="button"
                    onClick={() => {
                      setGrokApiKey('');
                      setGeminiApiKey('');
                      setGrokKeyInput('');
                      setGeminiKeyInput('');
                      setTestKeyStatus(null);
                      alert('Custom API keys cleared. Dynamic live AI will continue.');
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear Keys
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setGrokApiKey(grokKeyInput.trim());
                    setGeminiApiKey(geminiKeyInput.trim());
                    setKeySavedToast(true);
                    setTimeout(() => {
                      setKeySavedToast(false);
                      setShowApiModal(false);
                    }, 1200);
                  }}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save & Connect Live AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
