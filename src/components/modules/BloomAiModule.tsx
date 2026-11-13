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
import { audioRecorder } from '@/utils/audioRecorder';

export const BloomAiModule: React.FC = () => {
  const {
    profile,
    chatMessages,
    sendUserMessage,
    clearChat,
    selectedLanguage,
    setSelectedLanguage,
    gnaniApiKey,
    setGnaniApiKey,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    grokApiKey,
    setGrokApiKey,
    groqApiKey,
    setGroqApiKey,
    aiServerStatus,
    refreshAiServerStatus,
    triggerEmergencyModal,
    t
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [synthesizingId, setSynthesizingId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [voiceVolume, setVoiceVolume] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Pregnancy' | 'Labour' | 'Newborn' | 'Postpartum'>('All');
  const [isSending, setIsSending] = useState(false);
  const [micErrorNotice, setMicErrorNotice] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [gnaniKeyInput, setGnaniKeyInput] = useState(
    gnaniApiKey ||
    'vach_1ytE2CY5X2P8OG75LB2LoKExoXdn3zYsCnjFDaGsK4f83KNfy9P46d54x65TsbmRKLIIkxknsvFJVj8W1VWZfQcKRJnvjGi8_de3ef9b7ebb582a7792bb89f2e87dce2'
  );
  const [groqKeyInput, setGroqKeyInput] = useState(groqApiKey || '');
  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey || '');
  const [openaiKeyInput, setOpenaiKeyInput] = useState(openaiApiKey || '');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testKeyStatus, setTestKeyStatus] = useState<{ success: boolean; message: string } | null>(null);

  const isAiConnected = Boolean(
    gnaniApiKey ||
    groqApiKey ||
    geminiApiKey ||
    openaiApiKey ||
    aiServerStatus?.configured
  );

  const activeAiLabel = gnaniApiKey
    ? 'Gnani AI (Timbre & Prisma)'
    : groqApiKey
    ? 'Groq LPU'
    : geminiApiKey
    ? 'Gemini'
    : openaiApiKey
    ? 'OpenAI'
    : aiServerStatus?.providerDisplayName || 'Gnani AI';

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setTestKeyStatus(null);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'ping',
          gnaniApiKey: gnaniKeyInput.trim(),
          groqApiKey: groqKeyInput.trim(),
          geminiApiKey: geminiKeyInput.trim(),
          openaiApiKey: openaiKeyInput.trim(),
          gestationalWeek: profile.currentGestationalWeek || 24,
          language: selectedLanguage,
          test: true
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setTestKeyStatus({
          success: true,
          message: data.message || `Connected successfully to ${data.provider || 'Gnani AI'} (${data.model || 'active'})!`
        });
        refreshAiServerStatus();
      } else {
        setTestKeyStatus({
          success: false,
          message: data.error || `Connection test failed (HTTP ${res.status}). Please check API key validity.`
        });
      }
    } catch {
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

  const handleVoiceFinish = async () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    // Stop audio recorder and get 16kHz WAV blob
    let recordedBlob: Blob | null = null;
    let duration = 0;
    try {
      const res = await audioRecorder.stop();
      recordedBlob = res.blob;
      duration = res.durationSec;
    } catch (e) {
      console.warn('Error stopping audio recorder:', e);
    }

    // Check if live SpeechRecognition already captured words
    let finalPrompt = inputVal.trim() || liveTranscript.trim();

    // If SpeechRecognition produced nothing, transcribe the recorded WAV directly via Gnani Prisma STT!
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
        console.warn('Gnani STT transcription error:', sttErr);
      } finally {
        setIsTranscribing(false);
      }
    }

    // Send question to Bloom AI and auto-speak answer!
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
    } else {
      setMicErrorNotice('No speech detected. Please tap the microphone and speak your question.');
    }
  };

  const toggleSpeechRecognition = async () => {
    setMicErrorNotice(null);

    // If currently listening, finish and send
    if (isListening) {
      await handleVoiceFinish();
      return;
    }

    try {
      // 1. Start universal 16kHz audio capture with live volume visualizer
      await audioRecorder.start((vol) => setVoiceVolume(vol));
      setIsListening(true);
      setLiveTranscript('');

      // 2. Also start live SpeechRecognition in parallel if available
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
            console.warn('SpeechRecognition notice:', event.error);
          };
          recognitionRef.current = rec;
          rec.start();
        } catch (e) {
          console.warn('SpeechRecognition parallel start notice:', e);
        }
      }
    } catch (err: any) {
      console.warn('Microphone permission error:', err);
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setMicErrorNotice('Microphone access is blocked in your browser. Please tap the lock/tune icon next to localhost:3000 in your address bar and allow Microphone.');
      } else {
        setMicErrorNotice('Unable to access microphone. Please check your browser audio settings.');
      }
      setIsListening(false);
    }
  };

  // Fallback to browser SpeechSynthesis
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
      voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLang) ||
      voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));

    if (!matchingVoice) {
      matchingVoice = voices.find(v => v.lang.includes('IN')) || voices[0];
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

  // Text-to-Speech (TTS) via Gnani Timbre with Web Speech Fallback
  const speakText = async (text: string, msgId: string) => {
    // If currently speaking this message, toggle off
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

    // Stop existing audio
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
    } catch (gnaniErr) {
      console.warn('Gnani Timbre voice unavailable, falling back to browser speech:', gnaniErr);
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
        try { recognitionRef.current.stop(); } catch (err) {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (err) {}
      }
      setIsListening(false);
    }

    const messageText = inputVal.trim();
    setInputVal('');
    setLiveTranscript('');
    setIsSending(true);

    try {
      const reply = await sendUserMessage(messageText, selectedLanguage);
      if ((isVoiceInput || autoSpeak) && reply) {
        speakText(reply.text, reply.id);
      }
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
            <strong key={pIdx} className="font-bold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return (
            <em key={pIdx} className="italic text-foreground/90">
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
                <h1 className="text-xl font-bold text-foreground">{t('aiAssistantTitle', 'Gnani AI Companion')}</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  {t('week', 'Week')} {profile.currentGestationalWeek || 24}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  Powered by Gnani.ai
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t('aiAssistantSubtitle', '24/7 intelligent Indic maternal guidance with Gnani Timbre neural voice & Prisma speech-to-text.')}
              </p>
            </div>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground shrink-0">{t('lang', 'Language')}:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs bg-card text-foreground border border-border rounded-xl px-3 py-2 font-medium focus:ring-2 focus:ring-primary focus:outline-none shadow-2xs"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.native})
                </option>
              ))}
            </select>

            {/* AI Engine Configuration Button */}
            <button
              onClick={() => {
                setGroqKeyInput(groqApiKey || '');
                setGeminiKeyInput(geminiApiKey || '');
                setOpenaiKeyInput(openaiApiKey || '');
                setTestKeyStatus(null);
                setShowApiModal(true);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
                isAiConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 ring-2 ring-emerald-400/20'
                  : 'bg-primary-soft text-primary border border-primary/30 hover:bg-primary/20'
              }`}
              title="Configure Groq Cloud API Key or Live AI Settings"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAiConnected ? `${activeAiLabel}: Active` : 'Configure AI Engine'}
              </span>
            </button>

            <button
              onClick={clearChat}
              className="px-3 py-2 bg-card text-muted-foreground hover:text-foreground border border-border rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
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
            <strong>Clinical Safety Guarantee:</strong> Gnani AI answers are tailored to your 24-week gestation. Emergency red flag detection is active 24/7. Powered by Gnani.ai Indic voice & intelligence. Not a substitute for direct OB/GYN physical examination.
          </p>
        </div>
      </div>

      {/* Suggested Questions Filter Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
          <span className="text-gray-500 font-bold text-[11px] shrink-0 uppercase tracking-wider mr-1">
            {t('quickQuestions', 'Browse Topics')}:
          </span>
          {[
            { id: 'All', key: 'filterAll' },
            { id: 'Pregnancy', key: 'filterPregnancy' },
            { id: 'Labour', key: 'filterLabour' },
            { id: 'Newborn', key: 'filterNewborn' },
            { id: 'Postpartum', key: 'filterPostpartum' }
          ].map(({ id, key }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id as any)}
              className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === id
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {t(key, id)}
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
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200 rounded-tl-xs shadow-xs'
                      : 'bg-card text-foreground rounded-tl-xs border border-border'
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
                        {synthesizingId === msg.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                            <span>Loading voice...</span>
                          </>
                        ) : isSpeaking && speakingMessageId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
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
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Suggested Follow-ups:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((fu, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => handleFollowUpClick(fu)}
                            className="px-2.5 py-1 rounded-xl bg-card hover:bg-muted text-foreground hover:text-primary border border-border text-xs font-semibold transition-colors text-left cursor-pointer shadow-2xs"
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
                <span>Gnani AI is consulting clinical knowledge & evidence-based guidelines...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Mic Permission Warning Notice if blocked */}
        {micErrorNotice && (
          <div className="mb-2 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{micErrorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setMicErrorNotice(null)}
              className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Interactive Active Voice Listener Wave Banner */}
        {isListening && (
          <div className="mb-2 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-blush-600 to-rose-600 text-white shadow-md space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {/* Dynamic Audio Visualizer Waves */}
                <div className="flex items-center gap-0.5 h-4">
                  {[0.3, 0.7, 1.0, 0.5, 0.9, 0.6, 0.8, 0.4].map((factor, idx) => (
                    <span
                      key={idx}
                      className="w-1 bg-white rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(4, Math.min(18, 18 * (voiceVolume * factor + 0.25)))}px`
                      }}
                    />
                  ))}
                </div>
                <span className="font-bold text-xs uppercase tracking-wider">
                  Listening in {selectedLangObj.native} ({selectedLangObj.name})... Speak Now
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleVoiceFinish}
                  disabled={isTranscribing || isSending}
                  className="px-3 py-1 bg-white text-rose-600 font-bold rounded-xl text-xs transition-all hover:bg-rose-50 disabled:opacity-60 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                      <span>Transcribing...</span>
                    </>
                  ) : (
                    <span>Done & Send</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsListening(false);
                    audioRecorder.stop().catch(() => {});
                    if (recognitionRef.current) {
                      try { recognitionRef.current.abort(); } catch (e) {}
                    }
                  }}
                  className="p-1.5 bg-black/20 hover:bg-black/30 rounded-xl transition-all cursor-pointer"
                  title="Cancel Voice Listener"
                >
                  <MicOff className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-black/20 rounded-xl text-xs font-mono text-white/95 min-h-[38px] flex items-center">
              {isTranscribing ? (
                <span className="text-white/90 font-sans flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  Transcribing your audio with Gnani Prisma Indic STT...
                </span>
              ) : liveTranscript ? (
                <span>"{liveTranscript}"</span>
              ) : (
                <span className="text-white/70 italic flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  Listening to your microphone... start speaking your pregnancy question...
                </span>
              )}
            </div>
          </div>
        )}

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

          {/* Auto-Voice Speak Toggle */}
          <button
            type="button"
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`p-3 rounded-2xl transition-all shrink-0 cursor-pointer ${
              autoSpeak
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 ring-2 ring-rose-200 dark:ring-rose-800'
                : 'bg-cream-100 dark:bg-muted text-gray-400 dark:text-gray-500 hover:text-gray-600'
            }`}
            title={autoSpeak ? 'Auto-voice answers: ON (Tap to turn OFF)' : 'Auto-voice answers: OFF (Tap to turn ON)'}
          >
            {autoSpeak ? <Volume2 className="w-5 h-5 text-rose-600" /> : <VolumeX className="w-5 h-5" />}
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
            className="flex-1 bg-card dark:bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl px-4 py-3 text-xs md:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-2xs"
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

      {/* AI Engine Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-blush-100 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-primary to-accent flex items-center justify-center text-white shadow-xs">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Gnani AI & Voice Configuration</h3>
                  <p className="text-xs text-purple-700 font-medium">Gnani.ai Vachana Timbre TTS & Prisma STT Indic Engine</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Server Status Pill */}
            {aiServerStatus?.configured && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Server Connected: {aiServerStatus.providerDisplayName}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 text-emerald-800 font-bold uppercase">
                  Ready
                </span>
              </div>
            )}

            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Gnani AI</strong> provides context-aware obstetric intelligence paired with high-fidelity <strong>Gnani Timbre</strong> neural voice synthesis and <strong>Gnani Prisma</strong> speech recognition across 6 Indian languages.
            </p>

            {/* Gnani AI API Key Section */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/90 via-blush-50/80 to-amber-50/70 border-2 border-purple-300 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Gnani AI API Key (vach_...):</span>
                </label>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  gnaniApiKey || (!gnaniKeyInput && aiServerStatus?.serverProviders?.gnani)
                    ? 'bg-purple-100 text-purple-800'
                    : gnaniKeyInput
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {gnaniApiKey || (!gnaniKeyInput && aiServerStatus?.serverProviders?.gnani)
                    ? 'Active (Gnani.ai)'
                    : gnaniKeyInput
                    ? 'Ready to Save'
                    : 'Optional'}
                </span>
              </div>
              <input
                type="password"
                value={gnaniKeyInput}
                onChange={e => setGnaniKeyInput(e.target.value)}
                placeholder="vach_..."
                className="w-full px-3.5 py-2.5 bg-white border border-purple-400 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://vachana.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-800 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Gnani.ai Portal (vachana.ai)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-purple-700 font-medium">Timbre TTS & Prisma STT</span>
              </div>
            </div>

            {/* Groq API Key Section */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Groq API Key (gsk_...):</span>
                </label>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  groqApiKey || (!groqKeyInput && aiServerStatus?.serverProviders?.groq)
                    ? 'bg-emerald-100 text-emerald-800'
                    : groqKeyInput
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {groqApiKey || (!groqKeyInput && aiServerStatus?.serverProviders?.groq)
                    ? 'Active'
                    : groqKeyInput
                    ? 'Ready to Save'
                    : 'Optional'}
                </span>
              </div>
              <input
                type="password"
                value={groqKeyInput}
                onChange={e => setGroqKeyInput(e.target.value)}
                placeholder={aiServerStatus?.serverProviders?.groq ? '•••••••• (Configured via server .env)' : 'gsk_...'}
                className="w-full px-3.5 py-2.5 bg-white border border-emerald-400 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-800 hover:underline font-bold flex items-center gap-1"
                >
                  <span>Groq Console (console.groq.com)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-emerald-700 font-medium">Ultra-Fast LPU Engine</span>
              </div>
            </div>

            {/* Alternative: Gemini API Key Section */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  Google Gemini API Key:
                </label>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  geminiApiKey || (!geminiKeyInput && aiServerStatus?.serverProviders?.gemini)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {geminiApiKey || (!geminiKeyInput && aiServerStatus?.serverProviders?.gemini) ? 'Active' : 'Optional'}
                </span>
              </div>
              <input
                type="password"
                value={geminiKeyInput}
                onChange={e => setGeminiKeyInput(e.target.value)}
                placeholder={aiServerStatus?.serverProviders?.gemini ? '•••••••• (Configured via server .env)' : 'AIzaSy...'}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold flex items-center gap-1"
                >
                  <span>Get Gemini API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-400">gemini-1.5-flash</span>
              </div>
            </div>

            {/* Alternative: OpenAI API Key Section */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">
                  OpenAI API Key:
                </label>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  openaiApiKey || (!openaiKeyInput && aiServerStatus?.serverProviders?.openai)
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {openaiApiKey || (!openaiKeyInput && aiServerStatus?.serverProviders?.openai) ? 'Active' : 'Optional'}
                </span>
              </div>
              <input
                type="password"
                value={openaiKeyInput}
                onChange={e => setOpenaiKeyInput(e.target.value)}
                placeholder={aiServerStatus?.serverProviders?.openai ? '•••••••• (Configured via server .env)' : 'sk-...'}
                className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex items-center justify-between text-[11px] pt-0.5">
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:underline font-bold flex items-center gap-1"
                >
                  <span>OpenAI Platform</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-400">gpt-4o-mini</span>
              </div>
            </div>

            {testKeyStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                  testKeyStatus.success
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border border-rose-300 text-rose-900'
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
                {(gnaniApiKey || groqApiKey || geminiApiKey || openaiApiKey) && (
                  <button
                    type="button"
                    onClick={() => {
                      setGnaniApiKey('');
                      setGroqApiKey('');
                      setGeminiApiKey('');
                      setOpenaiApiKey('');
                      setGnaniKeyInput('');
                      setGroqKeyInput('');
                      setGeminiKeyInput('');
                      setOpenaiKeyInput('');
                      setTestKeyStatus(null);
                    }}
                    className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Clear Keys
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setGnaniApiKey(gnaniKeyInput.trim());
                    setGroqApiKey(groqKeyInput.trim());
                    setGeminiApiKey(geminiKeyInput.trim());
                    setOpenaiApiKey(openaiKeyInput.trim());
                    refreshAiServerStatus();
                    setKeySavedToast(true);
                    setTimeout(() => {
                      setKeySavedToast(false);
                      setShowApiModal(false);
                    }, 1200);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-primary hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save & Connect Gnani AI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
