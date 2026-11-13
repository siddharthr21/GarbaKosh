import { NextRequest, NextResponse } from 'next/server';
import { MULTILINGUAL_AI_RESPONSES } from '@/data/multilingualAiKnowledge';
import { WEEKS_DATA } from '@/data/pregnancyJourneyData';
import { SupportedLanguageCode } from '@/data/translations';

interface ChatRequestBody {
  message: string;
  apiKey?: string;
  gnaniApiKey?: string;
  groqApiKey?: string;
  grokApiKey?: string;
  geminiApiKey?: string;
  openaiApiKey?: string;
  openrouterApiKey?: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  gestationalWeek?: number;
  userRole?: 'mother' | 'partner';
  language?: string;
  motherName?: string;
  test?: boolean;
}

// 1. Emergency Red Flags Requiring Immediate Clinical Escalation
const EMERGENCY_PATTERNS = [
  {
    regex: /(heavy bleeding|bleed|soaked pad|clots|hemorrhage|haemorrhage|blood in urine|ರಕ್ತಸ್ರಾವ|ರಕ್ತ|खून|रक्तस्राव|இரத்தப்போக்கு|రక్తస్రావం|രക്തസ്രാവം)/i,
    title: '🚨 CRITICAL MEDICAL ALERT: IMMEDIATE ATTENTION FOR BLEEDING',
    warning: 'Heavy or persistent vaginal bleeding (soaking through a pad in under an hour, or passing large clots) can indicate placental abruption, placenta previa, or an obstetric emergency.',
    action: 'Proceed immediately to your nearest hospital maternity triage or call emergency medical services (112 / 108 / 911) right away. Do not insert anything vaginally.'
  },
  {
    regex: /(severe headache|blurred vision|flashing spots|flashing lights|sudden swelling face|high bp|preeclampsia|epigastric pain|ತೀವ್ರ ತಲೆನೋವು|कंधे या पेट में तेज दर्द|कपकपी|తీవ్రమైన తలనొప్పి|കഠിനമായ തലവേദന)/i,
    title: '⚠️ CRITICAL: POSSIBLE PREECLAMPSIA SIGNS',
    warning: 'Persistent severe headache accompanied by vision changes (flashing lights, blurriness) or sudden facial/hand swelling can indicate dangerous blood pressure elevation.',
    action: 'Check your blood pressure immediately and contact your maternity emergency triage right away for prompt clinical evaluation.'
  },
  {
    regex: /(not moving|no kicks|stopped moving|reduced movement|cannot feel baby|no fetal movement|ಮಗು ಚಲಿಸುತ್ತಿಲ್ಲ|ಕಿಕ್ ಇಲ್ಲ|हलचल बंद|किक नहीं|அசைவு இல்லை|కదలికలు లేవు|കുഞ്ഞ് അനങ്ങുന്നില്ല)/i,
    title: '🚨 URGENT: FETAL MOVEMENT EVALUATION',
    warning: 'At 24+ weeks, a significant reduction or cessation of your baby’s active kicks warrants prompt clinical fetal monitoring via CTG or ultrasound.',
    action: 'Drink a tall glass of ice-cold water, lie on your left side in a quiet room for 30 minutes. If 10 movements are not felt within 2 hours, proceed to maternity triage immediately.'
  },
  {
    regex: /(water broke|leaking fluid|gush of water|broken water|green fluid|brown fluid|meconium|ಉದೆ ನೀರು|पानी की थैली|பனிக்குடம்|ఉమ్మనీరు|പനിനീർ)/i,
    title: '⚠️ NOTICE: POSSIBLE RUPTURE OF MEMBRANES (WATER BREAKING)',
    warning: 'Leaking amniotic fluid requires sterile clinical assessment to prevent intrauterine infection.',
    action: 'Note fluid color and odor, use a clean maternity pad, and contact your delivery hospital triage immediately. If fluid is green or dark brown, proceed to the hospital without delay.'
  },
  {
    regex: /(harm myself|kill myself|suicide|end it all|hurt baby|cannot do this anymore|hear voices|ಆತ್ಮಹತ್ಯೆ|खुदकुशी|தற்கொலை|ఆత్మహత్య|ആത്മഹത്യ)/i,
    title: '❤️ WE ARE HERE FOR YOU - CRISIS SUPPORT',
    warning: 'Please know that you are not alone. Perinatal emotional distress and postpartum depression are treatable medical conditions.',
    action: 'Please call or text the Suicide & Crisis Lifeline (988), the Tele-MANAS National Mental Health Helpline (14416 in India), or emergency services (112 / 108) right away.'
  }
];

function buildSystemPrompt(params: {
  motherName: string;
  gestationalWeek: number;
  userRole: string;
  language: string;
}): string {
  const languageNames: Record<string, string> = {
    'kn-IN': 'Kannada (ಕನ್ನಡ)',
    'hi-IN': 'Hindi (हिंदी)',
    'ta-IN': 'Tamil (தமிழ்)',
    'te-IN': 'Telugu (తెలుగు)',
    'ml-IN': 'Malayalam (മലയാളം)',
    'en-US': 'English'
  };
  const langName = languageNames[params.language] || 'English';
  const trimester =
    params.gestationalWeek <= 13 ? '1st Trimester' :
    params.gestationalWeek <= 27 ? '2nd Trimester' : '3rd Trimester';

  return `You are Gnani AI (ಜ್ಞಾನಿ AI / ज्ञानी AI / ஞானி AI / జ్ఞాని AI / ജ്ഞാനി AI), an intelligent, empathetic, culturally conscious Indic maternal, fetal, and pediatric health companion for GarbhSarthi (GarbaKosh), powered by Gnani.ai Indic conversational & voice intelligence.

Current Context:
- Expecting Mother: ${params.motherName}
- Gestational Week: Week ${params.gestationalWeek} (${trimester})
- User Perspective: ${params.userRole === 'partner' ? 'Partner/Spouse supporting the mother' : 'Expecting Mother'}
- Target Response Language: ${params.language} (${langName})

Guidelines:
1. Answer the EXACT question asked by the user thoughtfully, thoroughly, and medically accurately.
2. DO NOT use canned, repetitive, or generic templates. Provide genuine, actionable, step-by-step guidance tailored to the user's gestational week (${params.gestationalWeek}).
3. Language fluency:
   - If language is 'kn-IN', write entirely in natural, fluent Kannada script (ಕನ್ನಡ).
   - If language is 'hi-IN', write entirely in natural, fluent Hindi script (हिंदी).
   - If language is 'ta-IN', write entirely in natural, fluent Tamil script (தமிழ்).
   - If language is 'te-IN', write entirely in natural, fluent Telugu script (తెలుగు).
   - If language is 'ml-IN', write entirely in natural, fluent Malayalam script (മലയാളം).
   - If language is 'en-US' or English, write in warm, clear English.
4. Structure your response with clean GitHub-flavored markdown:
   - Use bold titles and headings
   - Use bullet points (•) for actionable steps
   - Use comparison tables where helpful
   - Highlight warnings or foods to avoid with ⚠️
   - Highlight beneficial tips with ✨
5. Include culturally relevant Indian obstetric practices where appropriate (e.g. Garbh Sanskar music, nutritious foods like ragi, tender coconut, safe herbs, partner support).
6. At the very end of your response, provide exactly 3 contextually relevant follow-up questions tailored specifically to the user's question, separated by "---FOLLOW_UPS---", like this:
---FOLLOW_UPS---
• [Specific follow-up question 1]
• [Specific follow-up question 2]
• [Specific follow-up question 3]`;
}

function getDefaultFollowUps(lang: string, week: number): string[] {
  switch (lang) {
    case 'kn-IN':
      return [
        `ವಾರ ${week}ರಲ್ಲಿ ಮಗುವಿನ ಬೆಳವಣಿಗೆ`,
        'ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಆಹಾರ ಕ್ರಮ',
        'ಬೆನ್ನುನೋವಿಗೆ ಸರಳ ಮನೆಮದ್ದು'
      ];
    case 'hi-IN':
      return [
        `सप्ताह ${week} में शिशु का विकास`,
        'गर्भावस्था में संतुलित आहार',
        'पीठ दर्द से राहत के उपाय'
      ];
    case 'ta-IN':
      return [
        `வாரம் ${week}-ல் குழந்தையின் வளர்ச்சி`,
        'கர்ப்பகால சத்தான உணவுகள்',
        'முதுகுவலிக்கான தீர்வுகள்'
      ];
    case 'te-IN':
      return [
        `వారం ${week}లో శిశువు ఎదుగుదల`,
        'గర్భిణీలకు మంచి ఆహారం',
        'నడుము నొప్పి నివారణ చిట్కాలు'
      ];
    case 'ml-IN':
      return [
        `ആഴ്ച ${week}-ൽ കുഞ്ഞിന്റെ വളർച്ച`,
        'ഗർഭകാല പോഷകാഹാരങ്ങൾ',
        'നടുവേദനയ്ക്കുള്ള പരിഹാരങ്ങൾ'
      ];
    default:
      return [
        `Tell me more about Week ${week}`,
        'Safe nutrition and foods for this trimester',
        'Relief tips for back and pelvic comfort'
      ];
  }
}

function parseAiResponse(raw: string, lang = 'en-US', week = 24): { answer: string; followUps: string[] } {
  if (!raw) return { answer: '', followUps: getDefaultFollowUps(lang, week) };
  const parts = raw.split('---FOLLOW_UPS---');
  const answer = parts[0].trim();
  let followUps: string[] = [];

  if (parts.length > 1) {
    const rawFollowUps = parts[1].trim().split('\n');
    followUps = rawFollowUps
      .map(line => line.replace(/^[•\-\*\d\.\s]+/, '').trim())
      .filter(line => line.length > 3 && line.length < 120)
      .slice(0, 3);
  }

  if (followUps.length === 0) {
    followUps = getDefaultFollowUps(lang, week);
  }

  return { answer, followUps };
}

// 1. Call Groq Cloud API (Ultra-Fast LPU Inference)
async function callGroqAPI(
  groqKey: string,
  systemPrompt: string,
  userMessage: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; model: string; error?: string } | null> {
  const models = [
    'openai/gpt-oss-120b',
    'qwen/qwen3.8-27b',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'openai/gpt-oss-20b',
    'mixtral-8x7b-32768'
  ];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: userMessage }
  ];

  let lastError = '';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey.trim()}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const choice = data.choices?.[0]?.message;
        const content = choice?.content || choice?.reasoning;
        if (content && content.trim().length > 0) {
          return { text: content.trim(), model };
        }
      } else {
        const errText = await res.text();
        lastError = `Groq HTTP ${res.status}: ${errText.substring(0, 150)}`;
      }
    } catch (e: any) {
      lastError = `Groq error: ${e?.message || e}`;
    }
  }
  return lastError ? { text: '', model: '', error: lastError } : null;
}

// 2. Call Google Gemini API
async function callGeminiAPI(
  geminiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; model: string; error?: string } | null> {
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  const contents = [
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
    }
  ];

  let lastError = '';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1200
            }
          })
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText && candidateText.trim().length > 0) {
          return { text: candidateText.trim(), model };
        }
      } else {
        const errText = await res.text();
        lastError = `Gemini HTTP ${res.status}: ${errText.substring(0, 150)}`;
      }
    } catch (e: any) {
      lastError = `Gemini error: ${e?.message || e}`;
    }
  }
  return lastError ? { text: '', model: '', error: lastError } : null;
}

// 3. Call OpenAI API
async function callOpenAIAPI(
  openAiKey: string,
  systemPrompt: string,
  userMessage: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; model: string; error?: string } | null> {
  const models = ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: userMessage }
  ];

  let lastError = '';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey.trim()}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return { text: content.trim(), model };
        }
      } else {
        const errText = await res.text();
        lastError = `OpenAI HTTP ${res.status}: ${errText.substring(0, 150)}`;
      }
    } catch (e: any) {
      lastError = `OpenAI error: ${e?.message || e}`;
    }
  }
  return lastError ? { text: '', model: '', error: lastError } : null;
}

// 4. Call OpenRouter API
async function callOpenRouterAPI(
  openRouterKey: string,
  systemPrompt: string,
  userMessage: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; model: string; error?: string } | null> {
  const models = [
    'meta-llama/llama-3.3-70b-instruct',
    'openai/gpt-4o-mini',
    'google/gemini-2.0-flash-exp:free'
  ];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: userMessage }
  ];

  let lastError = '';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey.trim()}`,
          'HTTP-Referer': 'https://garbhsarthi.app',
          'X-Title': 'GarbhSarthi Pregnancy Sanctuary'
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return { text: content.trim(), model };
        }
      } else {
        const errText = await res.text();
        lastError = `OpenRouter HTTP ${res.status}: ${errText.substring(0, 150)}`;
      }
    } catch (e: any) {
      lastError = `OpenRouter error: ${e?.message || e}`;
    }
  }
  return lastError ? { text: '', model: '', error: lastError } : null;
}

// 5. Call xAI Grok API
async function callGrokAPI(
  grokKey: string,
  systemPrompt: string,
  userMessage: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; model: string; error?: string } | null> {
  const models = ['grok-2-latest', 'grok-beta', 'grok-2'];

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-4).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: userMessage }
  ];

  let lastError = '';

  for (const model of models) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokKey.trim()}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1200
        })
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content && content.trim().length > 0) {
          return { text: content.trim(), model };
        }
      } else {
        const errText = await res.text();
        lastError = `xAI Grok HTTP ${res.status}: ${errText.substring(0, 150)}`;
      }
    } catch (e: any) {
      lastError = `xAI Grok error: ${e?.message || e}`;
    }
  }
  return lastError ? { text: '', model: '', error: lastError } : null;
}

// Call Gnani AI Platform (Vachana Timbre & Prisma Indic AI Engine)
async function callGnaniAPI(
  gnaniKey: string
): Promise<{ text: string; model: string; error?: string } | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': gnaniKey.trim()
      },
      signal: controller.signal,
      body: JSON.stringify({
        text: 'Gnani AI connectivity check',
        model: 'timbre-v2.5',
        language: 'en-IN',
        voice: 'Nalini',
        audio_config: { container: 'wav' }
      })
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { text: 'OK', model: 'vachana-timbre-prisma' };
    } else {
      const errText = await res.text();
      return { text: '', model: '', error: `Gnani HTTP ${res.status}: ${errText.substring(0, 150)}` };
    }
  } catch (e: any) {
    return { text: '', model: '', error: `Gnani error: ${e?.message || e}` };
  }
}

// Topic-Tailored Clinical Fallback (if completely offline or using Speech/Voice Engine)
function generateOfflineClinicalSynthesis(
  question: string,
  motherName: string,
  gestationalWeek: number,
  language: string,
  userRole: string
): { answer: string; followUps: string[] } {
  const q = question.toLowerCase();
  const langKey = (language in MULTILINGUAL_AI_RESPONSES ? language : 'en-US') as SupportedLanguageCode;

  // -------------------------------------------------------------
  // 1. Week & Fetal Growth/Size Inquiries (e.g., Week 24, Baby weight, how big is baby)
  // -------------------------------------------------------------
  const weekRegex = /(?:week|wk|ವಾರ|सप्ताह|வாரம்|వారం|ആഴ്ച)\s*([0-9]{1,2})|([0-9]{1,2})\s*(?:st|nd|rd|th)?\s*(?:week|wk|ನೇ ವಾರ|वें सप्ताह|வது வாரம்|వ వారం|ാം ആഴ്ച)/i;
  const isGrowthQuery = /(how big|baby size|baby weight|baby length|fetal growth|fruit size|fruit|ಮಗುವಿನ ಗಾತ್ರ|ಮಗುವಿನ ತೂಕ|ಮಗುವಿನ ಬೆಳವಣಿಗೆ|ಬೆಳವಣಿಗೆ|शिशु का आकार|वजन|विकास|குழந்தை வளர்ச்சி|எடை|శిశువు బరువు|ఎదుగుదల|കുഞ്ഞിന്റെ വളർച്ച|തൂക്കം)/i.test(q);
  const weekMatch = q.match(weekRegex);

  let targetWeek = Math.max(1, Math.min(40, gestationalWeek));
  if (weekMatch) {
    const parsed = parseInt(weekMatch[1] || weekMatch[2], 10);
    if (!isNaN(parsed)) {
      targetWeek = Math.max(1, Math.min(40, parsed));
    }
  }

  if (weekMatch || isGrowthQuery) {
    const weekIndex = Math.max(0, Math.min(39, targetWeek - 1));
    const wk = WEEKS_DATA[weekIndex];

    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${wk.week}ನೇ ವಾರದಲ್ಲಿ** (${wk.trimester}ನೇ ತ್ರೈಮಾಸಿಕ) ಮಗುವಿನ ಬೆಳವಣಿಗೆಯ ವಿವರಗಳು:\n\n• **ಮಗುವಿನ ಗಾತ್ರ:** ${wk.fruitEmoji} ${wk.babySizeFruit}\n• **ಅಳತೆ & ತೂಕ:** ಉದ್ದ ಸುಮಾರು **${wk.babyLengthCm} cm**, ತೂಕ ಸುಮಾರು **${wk.babyWeightG} ಗ್ರಾಂ**\n• **ಮಗುವಿನ ಬೆಳವಣಿಗೆ:** ${wk.babyDevelopment}\n• **ತಾಯಿಯಲ್ಲಿನ ಬದಲಾವಣೆಗಳು:** ${wk.motherChanges}\n• **ಪೌಷ್ಟಿಕ ಆಹಾರ ಸಲಹೆ:** ${wk.nutritionTip}\n• **ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮ:** ${wk.safeExerciseTip}`,
        followUps: [
          `${wk.week}ನೇ ವಾರದ ಮುಖ್ಯ ಲಕ್ಷಣಗಳು`,
          'ಗರ್ಭಾವಸ್ಥೆಯ ಆಹಾರ ಪಟ್ಟಿ',
          'ಮಗುವಿನ ಕಿಕ್ ಎಣಿಕೆ ಮಾಡುವುದು ಹೇಗೆ?'
        ]
      };
    }

    if (langKey === 'hi-IN') {
      return {
        answer: `नमस्ते ${motherName}! 🌸 गर्भावस्था के **${wk.week}वें सप्ताह** (${wk.trimester}rd तिमाही) में शिशु के विकास का विवरण:\n\n• **शिशु का आकार:** ${wk.fruitEmoji} ${wk.babySizeFruit}\n• **लंबाई व वजन:** लंबाई लगभग **${wk.babyLengthCm} सेमी**, वजन लगभग **${wk.babyWeightG} ग्राम**\n• **शिशु का विकास:** ${wk.babyDevelopment}\n• **माँ के शारीरिक बदलाव:** ${wk.motherChanges}\n• **पोषण सलाह:** ${wk.nutritionTip}\n• **सुरक्षित व्यायाम:** ${wk.safeExerciseTip}`,
        followUps: [
          `${wk.week}वें सप्ताह के मुख्य लक्षण`,
          'गर्भावस्था में सुरक्षित आहार',
          'शिशु की हलचल कब महसूस होती है?'
        ]
      };
    }

    return {
      answer: `Hello ${motherName}! 🌸 Here is your fetal development update for **Week ${wk.week}** (Trimester ${wk.trimester}):\n\n• **Baby Size:** ${wk.fruitEmoji} ${wk.babySizeFruit}\n• **Measurements:** Length ~**${wk.babyLengthCm} cm**, Weight ~**${wk.babyWeightG} grams**\n• **Milestones:** ${wk.headline} — ${wk.babyDevelopment}\n• **Maternal Changes:** ${wk.motherChanges}\n• **Clinical Nutrition Tip:** ${wk.nutritionTip}\n• **Safe Activity Guidance:** ${wk.safeExerciseTip}`,
      followUps: [
        `What symptoms are normal in Week ${wk.week}?`,
        'Safe exercises for this trimester',
        'When should I schedule my next scan?'
      ]
    };
  }

  // -------------------------------------------------------------
  // 2. Multilingual Clinical Knowledge Base (MULTILINGUAL_AI_RESPONSES)
  // -------------------------------------------------------------
  function scoreKeywords(text: string, keywords: string[]): number {
    let score = 0;
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (text === kwLower) {
        score += 100;
      } else if (text.includes(kwLower)) {
        score += 25 + kwLower.length;
      } else {
        const parts = kwLower.split(/\s+/).filter((p) => p.length >= 3);
        for (const part of parts) {
          if (text.includes(part)) {
            score += 8 + part.length;
          }
        }
      }
    }
    return score;
  }

  const langResponses = MULTILINGUAL_AI_RESPONSES[langKey] || MULTILINGUAL_AI_RESPONSES['en-US'];
  let bestItem: any = null;
  let highestScore = 0;

  for (const item of langResponses) {
    const s = scoreKeywords(q, item.keywords);
    if (s > highestScore) {
      highestScore = s;
      bestItem = item;
    }
  }

  // Cross-language keyword fallback if score is low
  if (highestScore < 10 && langKey !== 'en-US') {
    for (const item of MULTILINGUAL_AI_RESPONSES['en-US']) {
      const s = scoreKeywords(q, item.keywords);
      if (s > highestScore) {
        highestScore = s;
        const targetList = MULTILINGUAL_AI_RESPONSES[langKey] || [];
        const idx = MULTILINGUAL_AI_RESPONSES['en-US'].indexOf(item);
        if (targetList[idx]) {
          bestItem = targetList[idx];
        }
      }
    }
  }

  if (bestItem && highestScore >= 8) {
    const greeting =
      langKey === 'kn-IN'
        ? `ನಮಸ್ಕಾರ ${motherName}! 🌸\n\n`
        : langKey === 'hi-IN'
        ? `नमस्ते ${motherName}! 🌸\n\n`
        : langKey === 'ta-IN'
        ? `வணக்கம் ${motherName}! 🌸\n\n`
        : langKey === 'te-IN'
        ? `నమస్కారం ${motherName}! 🌸\n\n`
        : langKey === 'ml-IN'
        ? `നമസ്കാരം ${motherName}! 🌸\n\n`
        : `Hello ${motherName}! 🌸\n\n`;

    return {
      answer: `${greeting}${bestItem.response}`,
      followUps: bestItem.followUps
    };
  }

  // -------------------------------------------------------------
  // 3. Papaya, Pineapple, Caffeine & Specific Food Safety
  // -------------------------------------------------------------
  const isPapayaPineapple = /(papaya|pineapple|caffeine|coffee|tea|kesar|saffron|raw egg|fish|alcohol|smoke|dry fruit|ಪರಂಗಿ|ಅನಾನಸ್|ಕೇಸರಿ|ಕಾಫಿ|पपीता|अनानास|केसर|பப்பாளி|அன்னாசி|బొప్పాయి|అనాస|പപ്പായ)/i.test(q);
  if (isPapayaPineapple) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಆಹಾರ ಸುರಕ್ಷತೆಯ ಕುರಿತು ಪ್ರಮುಖ ಮಾರ್ಗದರ್ಶನ:\n\n• **ಹಸಿ ಪರಂಗಿಕಾಯಿ (Raw Papaya):** ಹಸಿ ಅಥವಾ ಅರೆಬೆಂದ ಪರಂಗಿಕಾಯಿಯಲ್ಲಿ ಲೇಟೆಕ್ಸ್ ಮತ್ತು ಪಪೈನ್ ಹೆಚ್ಚಾಗಿರುತ್ತದೆ, ಇದು ಗರ್ಭಾಶಯದ ಸಂಕೋಚನವನ್ನು ಪ್ರಚೋದಿಸಬಹುದು. ಆದ್ದರಿಂದ ಇದನ್ನು ಸೇವಿಸಬೇಡಿ. ಚೆನ್ನಾಗಿ ಹಣ್ಣಾದ ಪರಂಗಿ ಹಣ್ಣನ್ನು ವೈದ್ಯರ ಸಲಹೆಯಂತೆ ಅತ್ಯಲ್ಪ ಪ್ರಮಾಣದಲ್ಲಿ ಸೇವಿಸಬಹುದು.\n• **ಅನಾನಸ್ (Pineapple):** ಅನಾನಸ್‌ನಲ್ಲಿ ಬ್ರೋಮೆಲೈನ್ ಇರುತ್ತದೆ. ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದಲ್ಲಿ ಸೇವಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.\n• **ಕೆಫೀನ್ (ಕಾಫಿ/ಟೀ):** ದಿನಕ್ಕೆ ಗರಿಷ್ಠ ೨೦೦ ಮಿಗ್ರಾಂ (೧-೨ ಕಪ್) ಮಾತ್ರ ಸೀಮಿತಗೊಳಿಸಿ.\n• **ಕೇಸರಿ (Kesar):** ಬೆಚ್ಚಗಿನ ಹಾಲಿನಲ್ಲಿ ೧-೨ ಎಸಳು ಕೇಸರಿ ಸುವಾಸನೆಗಾಗಿ ಮಾತ್ರ ಸುರಕ್ಷಿತ, ಅತಿಯಾಗಿ ಬೇಡ.`,
        followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ಸುರಕ್ಷಿತ ಹಣ್ಣುಗಳು', 'ಎಳನೀರು ಕುಡಿಯಲು ಸೂಕ್ತ ಸಮಯ', 'ಕಬ್ಬಿಣಾಂಶ ಹೆಚ್ಚಿಸುವ ಆಹಾರಗಳು']
      };
    }
    if (langKey === 'hi-IN') {
      return {
        answer: `नमस्ते ${motherName}! 🌸 गर्भावस्था में खान-पान की सुरक्षा के महत्वपूर्ण नियम:\n\n• **कच्चा पपीता (Raw Papaya):** कच्चे या अधपके पपीते में लेटेक्स और पपेन होता है जो गर्भाशय में संकुचन पैदा कर सकता है। इसे गर्भावस्था में बिल्कुल न खाएं।\n• **अनानास (Pineapple):** अनानास में ब्रोमेलैन होता है, इसलिए इसका अधिक मात्रा में सेवन करने से बचें।\n• **कैफीन (चाय/कॉफ़ी):** दिन में २०० मिलीग्राम (१-२ कप) से अधिक कैफीन न लें।\n• **केसर (Kesar):** गुनगुने दूध में १-२ रेशे केसर स्वाद और सुगंध के लिए सुरक्षित है।`,
        followUps: ['गर्भावस्था में कौन से फल खाएं?', 'नारियल पानी पीने के फायदे', 'आयरन बढ़ाने वाले आहार']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Key clinical guidelines on pregnancy food safety:\n\n• **Raw/Unripe Papaya:** Strictly avoid unripe or semi-ripe papaya. It contains concentrated latex and papain, which can trigger uterine contractions. Fully ripe yellow papaya in tiny occasional amounts is generally fine, but many mothers prefer avoiding it entirely.\n• **Pineapple:** Contains bromelain, which in massive medicinal doses could soften the cervix. Fresh culinary slices in moderate portions are safe, but avoid large quantities or concentrated extracts.\n• **Caffeine:** Limit strictly to under 200mg daily (about 1 mug of brewed coffee or 2 cups of tea) to prevent elevated fetal heart rate.\n• **Saffron (Kesar):** 1–2 strands in warm milk for flavor is safe; avoid large medicinal doses.`,
      followUps: ['What fruits are most beneficial in pregnancy?', 'Safe herbal teas for pregnancy', 'Essential foods for 2nd trimester']
    };
  }

  // -------------------------------------------------------------
  // 4. Travel, Flying & Commuting Safety
  // -------------------------------------------------------------
  const isTravel = /(travel|flight|fly|flying|plane|car|driving|train|bus|journey|trip|commute|ಪ್ರಯಾಣ|ವಿಮಾನ|कार|यात्रा|सफर|பயணம்|ప్రయాణం|യാത്ര)/i.test(q);
  if (isTravel) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪ್ರಯಾಣದ ಸುರಕ್ಷತಾ ನಿಯಮಗಳು:\n\n• **ಸುರಕ್ಷಿತ ಸಮಯ:** ೨ನೇ ತ್ರೈಮಾಸಿಕ (೧೪ ರಿಂದ ೨೮ ವಾರಗಳು) ಪ್ರಯಾಣಕ್ಕೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಸಮಯ.\n• **ವಿಮಾನ ಪ್ರಯಾಣ:** ಬಹುತೇಕ ವಿಮಾನಯಾನ ಸಂಸ್ಥೆಗಳು ೩೬ನೇ ವಾರದವರೆಗೆ (ಅವಳಿ ಮಕ್ಕಳಿದ್ದರೆ ೩೨ ವಾರ) ಅನುಮತಿಸುತ್ತವೆ. ೨೮ ವಾರದ ನಂತರ ವೈದ್ಯರ ಫಿಟ್‌ನೆಸ್ ಪ್ರಮಾಣಪತ್ರ ಅಗತ್ಯ.\n• **ಕಾರು ಪ್ರಯಾಣ:** ಸೀಟ್‌ಬೆಲ್ಟ್ ಅನ್ನು ಹೊಟ್ಟೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ತೊಡೆಯ ಮೇಲೆ ಸರಿಯಾಗಿ ಧರಿಸಿ.\n• **ರಕ್ತಪರಿಚಲನೆ:** ಪ್ರತಿ ೧-೨ ಗಂಟೆಗೊಮ್ಮೆ ಎದ್ದು ನಡೆದಾಡಿ, ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.`,
        followUps: ['ವಿಮಾನ ಪ್ರಯಾಣಕ್ಕೆ ವೈದ್ಯರ ಅನುಮತಿ ಪತ್ರ', 'ಕಾರಿನಲ್ಲಿ ಸೀಟ್‌ಬೆಲ್ಟ್ ಧರಿಸುವ ವಿಧಾನ', 'ಪ್ರಯಾಣದಲ್ಲಿ ತುರ್ತು ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Clinical guidelines for safe travel during pregnancy:\n\n• **Golden Window:** The second trimester (Weeks 14–28) is the safest and most comfortable travel window.\n• **Air Travel:** Most airlines permit domestic flying up to 36 weeks (32 weeks for twins). An OB/GYN fitness-to-fly certificate is usually required after 28 weeks.\n• **Seatbelt Safety:** Position the lap belt low across your pelvic bones, well below your belly bump.\n• **Venous Thromboembolism (DVT) Prevention:** On journeys over 2 hours, wear compression socks, flex your ankles every 30 minutes, and take a 10-minute walk every 2 hours.\n• **Hydration:** Sip water steadily and carry your antenatal records and Dr. Sunita's emergency contact.`,
      followUps: ['Safe seatbelt positioning tips', 'OB/GYN travel clearance checklist', 'Managing motion sickness while pregnant']
    };
  }

  // -------------------------------------------------------------
  // 5. Scans, Tests & Medical Screenings (Ultrasound, NT, OGTT)
  // -------------------------------------------------------------
  const isScan = /(scan|ultrasound|nt scan|anomaly|tiffa|ogtt|glucose test|blood test|screening|ಸ್ಕ್ಯಾನ್|ತಪಾಸಣೆ|ರಕ್ತ ಪರೀಕ್ಷೆ|जांच|सोनोग्राफी|ஸ்கேன்|పరీక్ష|സ്കാൻ)/i.test(q);
  if (isScan) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ ಪ್ರಮುಖ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ತಪಾಸಣೆಗಳು:\n\n• **೧೧-೧೩ ವಾರಗಳು:** NT ಸ್ಕ್ಯಾನ್ ಮತ್ತು ಡಬಲ್ ಮಾರ್ಕರ್ ರಕ್ತ ಪರೀಕ್ಷೆ (ವರ್ಣತಂತು ದೋಷಗಳ ತಪಾಸಣೆ).\n• **೧೮-೨೨ ವಾರಗಳು:** ಅನೋಮಲಿ / ಟಿಫಾ (TIFFA) ಸ್ಕ್ಯಾನ್ — ಮಗುವಿನ ಅಂಗಾಂಗಗಳು, ಹೃದಯ, ಮೆದುಳು ಮತ್ತು ಜರಾಯು (Placenta) ಸಂಪೂರ್ಣ ತಪಾಸಣೆ.\n• **೨೪-೨೮ ವಾರಗಳು:** OGTT ಗ್ಲೂಕೋಸ್ ಟೆಸ್ಟ್ (ಗರ್ಭಧಾರಣೆಯ ಮಧುಮೇಹ ತಪಾಸಣೆ).\n• **೩೨-೩೬ ವಾರಗಳು:** ಮಗುವಿನ ಬೆಳವಣಿಗೆ ಮತ್ತು ಆಮ್ನಿಯೋಟಿಕ್ ದ್ರವದ (AFI) ಸ್ಕ್ಯಾನ್.`,
        followUps: ['ಟಿಫಾ ಸ್ಕ್ಯಾನ್‌ನಲ್ಲಿ ಏನು ಪರಿಶೀಲಿಸುತ್ತಾರೆ?', 'OGTT ಗ್ಲೂಕೋಸ್ ಪರೀಕ್ಷೆಗೆ ತಯಾರಿ ಹೇಗೆ?', 'ಮಗುವಿನ ತೂಕ ತಿಳಿಯುವ ಸ್ಕ್ಯಾನ್']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Essential antenatal screening roadmap:\n\n• **Weeks 11–13:** Nuchal Translucency (NT) Scan + First Trimester Maternal Serum Screening (Double Marker) for chromosomal health.\n• **Weeks 18–22:** Detailed Level II Anatomy / TIFFA Scan to examine fetal cardiac chambers, brain ventricles, spine, kidneys, and placental attachment.\n• **Weeks 24–28:** Oral Glucose Tolerance Test (OGTT) for gestational diabetes screening.\n• **Weeks 32–36:** Third Trimester Growth & Umbilical Artery Doppler Scan to verify amniotic fluid index (AFI) and placental blood flow.`,
      followUps: ['What happens during the TIFFA anomaly scan?', 'How to prepare for the OGTT glucose test?', 'Normal amniotic fluid index range']
    };
  }

  // -------------------------------------------------------------
  // 6. Constipation, Acidity & Heartburn
  // -------------------------------------------------------------
  const isDigestion = /(constipat|heartburn|acid|gas|bloat|piles|hemorrhoid|ಮಲಬದ್ಧತೆ|ಉರಿ|ಅಸಿಡಿಟಿ|गैस|कब्ज|एसिडिटी|மலச்சிக்கல்|நெஞ்செரிச்சல்|మలబద్ధకం|కడుపులో మంట|മലബന്ധം|നെഞ്ചെരിച്ചിൽ)/i.test(q);
  if (isDigestion) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಅಸಿಡಿಟಿ ಮತ್ತು ಮಲಬದ್ಧತೆಗೆ ಪರಿಹಾರಗಳು:\n\n• **ಅಸಿಡಿಟಿಗೆ:** ಸ್ವಲ್ಪ ಸ್ವಲ್ಪವೇ ಊಟ ಮಾಡಿ, ಊಟವಾದ ತಕ್ಷಣ ಮಲಗಬೇಡಿ (ಕನಿಷ್ಠ ೪೫ ನಿಮಿಷ ನಡಿಗೆ ಅಥವಾ ಕುಳಿತುಕೊಳ್ಳಿ). ತಣ್ಣನೆಯ ಹಾಲು ಅಥವಾ ಎಳನೀರು ಕುಡಿಯಿರಿ.\n• **ಮಲಬದ್ಧತೆಗೆ:** ದಿನಕ್ಕೆ ೮-೧೦ ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ. ನಾರಿನಂಶವಿರುವ ಆಹಾರ (ರಾಗಿ, ಓಟ್ಸ್, ಪಾಲಕ್, ಸೇಬು, ಪೇರಳೆ) ಸೇವಿಸಿ.\n• **ಎಚ್ಚರಿಕೆ:** ವೈದ್ಯರ ಅನುಮತಿಯಿಲ್ಲದೆ ಯಾವುದೇ ಜೀರ್ಣಕಾರಿ ಮಾತ್ರೆಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ.`,
        followUps: ['ಅಸಿಡಿಟಿಗೆ ನೈಸರ್ಗಿಕ ಮನೆಮದ್ದುಗಳು', 'ನಾರಿನಂಶ ಹೆಚ್ಚಿರುವ ಭಾರತೀಯ ಆಹಾರಗಳು', 'ಎಳನೀರಿನ ಪ್ರಯೋಜನಗಳು']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Managing pregnancy reflux & bowel regularity:\n\n• **Heartburn Relief:** Progesterone relaxes the lower esophageal sphincter. Eat smaller, frequent meals every 2.5 hours. Avoid lying down for at least 45 minutes after meals. Elevate your head 6 inches with extra pillows.\n• **Constipation Relief:** Aim for 28–30g dietary fiber daily (oats, chia seeds, prunes, lentils, raw vegetables). Drink 2.5–3 liters of water.\n• **Quick Soothers:** Cold milk, tender coconut water, and fennel seeds (saunf) offer gentle natural relief. Avoid self-medicating with antacids without your doctor's clearance.`,
      followUps: ['Safe antacids during pregnancy', 'High-fiber Indian meal plan', 'Immediate relief for severe heartburn']
    };
  }

  // -------------------------------------------------------------
  // 7. Exercise, Walking & Prenatal Yoga
  // -------------------------------------------------------------
  const isExercise = /(exercise|walk|walking|yoga|squat|kegel|gym|workout|stretch|fit|physical activity|ವ್ಯಾಯಾಮ|ನಡಿಗೆ|ಯೋಗ|व्यायाम|टहलना|உடற்பயிற்சி|వ్యాయామం|നടത്തം)/i.test(q);
  if (isExercise) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯ ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮ ಮಾರ್ಗದರ್ಶನ:\n\n• **ದೈನಂದಿನ ನಡಿಗೆ:** ದಿನಕ್ಕೆ ೨೦-೩೦ ನಿಮಿಷಗಳ ಕಾಲ ಆರಾಮದಾಯಕ ವೇಗದಲ್ಲಿ ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ನಡಿಗೆ ಮಾಡಿ.\n• **ಕೆಗೆಲ್ ವ್ಯಾಯಾಮ:** ಪೆಲ್ವಿಕ್ ಸ್ನಾಯುಗಳನ್ನು ಬಲಪಡಿಸಲು ಮತ್ತು ಸುಲಭ ಹೆರಿಗೆಗೆ ಕೆಗೆಲ್ (Kegel) ವ್ಯಾಯಾಮಗಳು ಅತ್ಯುತ್ತಮ.\n• **ಬೆಕ್ಕಿನ-ಹಸುವಿನ ಭಂಗಿ (Cat-Cow Pose):** ಬೆನ್ನು ಮತ್ತು ಸೊಂಟದ ಒತ್ತಡ ನಿವಾರಿಸಲು ದಿನಕ್ಕೆ ೧೦ ಬಾರಿ ಮಾಡಿ.\n• **ಮುನ್ನೆಚ್ಚರಿಕೆ:** ಭಾರ ಎತ್ತುವುದು, ಜಿಗಿಯುವುದು ಅಥವಾ ಬೆನ್ನಿನ ಮೇಲೆ ನೇರವಾಗಿ ಮಲಗುವ ವ್ಯಾಯಾಮಗಳನ್ನು ತಪ್ಪಿಸಿ.`,
        followUps: ['ಸುಲಭ ಹೆರಿಗೆಗೆ ಕೆಗೆಲ್ ವ್ಯಾಯಾಮ ಮಾಡುವುದು ಹೇಗೆ?', 'ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ನಡಿಗೆ ಸಲಹೆಗಳು', 'ಯಾವ ವ್ಯಾಯಾಮಗಳನ್ನು ತಪ್ಪಿಸಬೇಕು?']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Safe prenatal exercise guidelines for Week ${gestationalWeek}:\n\n• **Brisk Walking:** 25–30 minutes of daily low-impact walking improves circulation, stabilizes blood glucose, and enhances mood.\n• **Pelvic Floor (Kegels):** Perform 3 sets of 10 contractions daily to support bladder control and perineal elasticity for labor.\n• **Prenatal Yoga:** Gentle Cat-Cow stretches, butterfly pose (Baddha Konasana), and modified squats open pelvic outlets.\n• **The Talk Test:** You should always be able to hold a conversation comfortably without becoming breathless.\n• **Safety:** Stop immediately if you experience dizziness, vaginal spotting, or pelvic pain.`,
      followUps: ['Step-by-step Kegel instructions', 'Squats for labor preparation', 'Exercises to avoid in this trimester']
    };
  }

  // -------------------------------------------------------------
  // 8. General Nutrition, Diet & Hydration
  // -------------------------------------------------------------
  const isNutrition = /(food|eat|diet|nutrition|coconut|ragi|calcium|iron|protein|meal|snack|ಊಟ|ಆಹಾರ|ತಿನ್ನ|ಎಳನೀರು|खाना|डाइट|உணவு|ఆహారం|ഭക്ഷണം)/i.test(q);
  if (isNutrition) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಪೌಷ್ಟಿಕ ಆಹಾರದ ಪ್ರಮುಖ ಸಲಹೆಗಳು:\n\n• **ಕಬ್ಬಿಣಾಂಶ & ಫೋಲಿಕ್ ಆಸಿಡ್:** ಪಾಲಕ್, ದಾಳಿಂಬೆ, ಖರ್ಜೂರ, ಹೆಸರುಕಾಳು ಮತ್ತು ಬೆಲ್ಲ.\n• **ಕ್ಯಾಲ್ಸಿಯಂ & ಪ್ರೋಟೀನ್:** ರಾಗಿ ಗಂಜಿ/ಮುದ್ದೆ, ಮೊಸರು, ಪನ್ನೀರ್, ಬಾದಾಮಿ ಮತ್ತು ಮೊಟ್ಟೆ.\n• **ಜಲಾಂಶ:** ದಿನಕ್ಕೆ ೨.೫ ಲೀಟರ್ ನೀರು ಮತ್ತು ಮುಂಜಾನೆ ಎಳನೀರು ಸೇವನೆ.\n• **ವಿಟಮಿನ್ ಸಿ:** ಕಬ್ಬಿಣಾಂಶ ದೇಹದಲ್ಲಿ ಸರಿಯಾಗಿ ಹೀರಿಕೊಳ್ಳಲು ನೆಲ್ಲಿಕಾಯಿ ಅಥವಾ ನಿಂಬೆ ರಸ ಸೇವಿಸಿ.`,
        followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ರಾಗಿ ಉಪಯೋಗಗಳು', 'ಎಳನೀರು ಕುಡಿಯಲು ಸೂಕ್ತ ಸಮಯ', 'ಕಬ್ಬಿಣದಂಶ ಹೆಚ್ಚಿಸುವ ವಿಧಾನ']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Clinical nutrition priorities for Week ${gestationalWeek}:\n\n• **Protein Target:** Aim for 60–75g protein daily (lentils, paneer, Greek yogurt, eggs, almonds) to support fetal tissue expansion.\n• **Iron & Vitamin C Synergy:** Pair iron sources (spinach, dates, beetroot) with Vitamin C (citrus, amla) for optimal absorption; avoid tea/coffee within 1 hour of iron meals.\n• **Calcium Density:** 1,000mg/day via fortified curd, ragi, sesame, and dairy to preserve maternal bone density while fetal skeleton mineralizes.\n• **Electrolyte Hydration:** 2.5–3L fluids including fresh tender coconut water to maintain adequate amniotic fluid levels.`,
      followUps: ['Best iron-rich snack combinations', 'Daily meal plan template', 'Safe dairy and cheese choices']
    };
  }

  // -------------------------------------------------------------
  // 9. Back Pain, Cramps & Physical Aches
  // -------------------------------------------------------------
  const isPain = /(pain|back|ache|spine|hurt|cramp|sciatica|leg cramp|ನೋವು|ಬೆನ್ನು|ಸೊಂಟ|ಕಾಲು|दर्द|पीठ|कमर|வலி|முதுகு|నొప్పి|నడుము|വേദന|നടു)/i.test(q);
  if (isPain) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಬೆನ್ನು ಮತ್ತು ಸೊಂಟದ ನೋವಿಗೆ ಪರಿಹಾರಗಳು:\n\n• **ಮಲಗುವ ಭಂಗಿ:** ಎಡ ಮಗ್ಗುಲಿಗೆ ಮಲಗಿ, ಮೊಣಕಾಲುಗಳ ನಡುವೆ ಗರ್ಭಧಾರಣೆಯ ದಿಂಬನ್ನು (Pregnancy Pillow) ಇಟ್ಟುಕೊಳ್ಳಿ.\n• **ಶಾಖ ಚಿಕಿತ್ಸೆ:** ಬೆನ್ನಿನ ಕೆಳಭಾಗಕ್ಕೆ ಉಗುರುಬೆಚ್ಚಗಿನ ನೀರಿನ ಶಾಖ ನೀಡಿ. ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಎತ್ತಬೇಡಿ.\n• **ಕ್ಯಾಲ್ಸಿಯಂ & ಮೆಗ್ನೀಸಿಯಮ್:** ರಾತ್ರಿ ಕಾಲು ಸೆಳೆತವಿದ್ದರೆ ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ವೈದ್ಯರು ನೀಡಿದ ಕ್ಯಾಲ್ಸಿಯಂ ಮಾತ್ರೆಗಳನ್ನು ತಪ್ಪದೇ ತೆಗೆದುಕೊಳ್ಳಿ.`,
        followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಮಲಗುವ ಭಂಗಿ', 'ಪೆಲ್ವಿಕ್ ನೋವಿಗೆ ಮನೆಮದ್ದು', 'ಕಾಲು ಸೆಳೆತ ತಪ್ಪಿಸಲು ಸಲಹೆಗಳು']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Managing musculoskeletal aches at Week ${gestationalWeek}:\n\n• **Spinal Alignment:** As your center of gravity shifts forward, avoid standing swayed-back. Wear supportive flat footwear with arch support.\n• **Side Sleeping (SOS):** Lie on your left side with a contoured pillow between your knees and a wedge beneath your abdomen to unload lumbar vertebrae.\n• **Warm Therapy:** Apply a warm compress (never scalding hot) to the lower back for 15 minutes.\n• **Nocturnal Leg Cramps:** Ensure adequate magnesium and hydration; gently dorsiflex your toes toward your shin if a calf cramp strikes.`,
      followUps: ['Safe stretching routine for back pain', 'Maternity support belt recommendations', 'When to seek medical review for pain']
    };
  }

  // -------------------------------------------------------------
  // 10. Swelling, Preeclampsia & BP
  // -------------------------------------------------------------
  const isSwelling = /(swell|feet|ankle|edema|preeclampsia|high bp|blood pressure|proteinuria|ಊತ|ಕಾಲು|ಹಿಮ್ಮಡಿ|ರಕ್ತದೊತ್ತಡ|सूजन|पैरों|रक्तचाप|வீக்கம்|கால்|வாపు|కాళ్ళ|നീര്)/i.test(q);
  if (isSwelling) {
    if (langKey === 'kn-IN') {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಪಾದಗಳ ಊತ ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ:\n\n• **ಉಪಶಮನ:** ವಿಶ್ರಾಂತಿ ಪಡೆಯುವಾಗ ಪಾದಗಳನ್ನು ದಿಂಬಿನ ಮೇಲೆ ಎತ್ತರಿಸಿ ಇರಿಸಿ. ದೀರ್ಘಕಾಲ ನಿಲ್ಲುವುದು ಅಥವಾ ಕಾಲುಗಳ ಮೇಲೆ ಕಾಲು ಹಾಕಿ ಕುಳಿತುಕೊಳ್ಳುವುದನ್ನು ತಪ್ಪಿಸಿ.\n• **ಜಲಾಂಶ:** ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ. ಉಪ್ಪಿನ ಪ್ರಮಾಣವನ್ನು ಮಿತಿಗೊಳಿಸಿ.\n• **ಎಚ್ಚರಿಕೆ:** ಮುಖ ಅಥವಾ ಕೈಗಳಲ್ಲಿ ಹಠಾತ್ ಊತ ಮತ್ತು ತಲೆನೋವು ಕಂಡುಬಂದರೆ ತಕ್ಷಣ ರಕ್ತದೊತ್ತಡ ತಪಾಸಣೆ ಮಾಡಿಸಿಕೊಳ್ಳಿ.`,
        followUps: ['ಕಾಲು ಊತ ಯಾವಾಗ ಕಡಿಮೆಯಾಗುತ್ತದೆ?', 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ರಕ್ತದೊತ್ತಡ ತಪಾಸಣೆ', 'ಆರಾಮದಾಯಕ ಪಾದರಕ್ಷೆಗಳು']
      };
    }
    return {
      answer: `Hello ${motherName}! 🌸 Ankle and foot swelling (physiological dependent edema) at Week ${gestationalWeek}:\n\n• **Venous Elevation:** Elevate your feet above heart level for 20 minutes when resting to facilitate lymphatic and venous return.\n• **Hydration Balance:** Drinking 2.5–3L water paradoxically encourages the body to flush retained fluid and excess sodium.\n• **Preeclampsia Red Flags:** If swelling appears suddenly in your face, eyelids, or hands, or is accompanied by a severe persistent headache or visual disturbances, check blood pressure and seek immediate clinical evaluation.`,
      followUps: ['Graduated compression socks benefits', 'Differentiating normal swelling from preeclampsia', 'Low sodium seasoning ideas']
    };
  }

  // -------------------------------------------------------------
  // 11. Comprehensive Contextual Fallback (Week & Trimester Tailored)
  // -------------------------------------------------------------
  const weekIdx = Math.max(0, Math.min(39, gestationalWeek - 1));
  const currentWk = WEEKS_DATA[weekIdx];

  if (langKey === 'kn-IN') {
    return {
      answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** (${currentWk.trimester}ನೇ ತ್ರೈಮಾಸಿಕ) ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ:\n\n• **ಪ್ರಸ್ತುತ ಮಗುವಿನ ಸ್ಥಿತಿ:** ${currentWk.fruitEmoji} ಮಗು ಈಗ **${currentWk.babySizeFruit}** ಗಾತ್ರದಲ್ಲಿದೆ (ಉದ್ದ ~${currentWk.babyLengthCm} cm, ತೂಕ ~${currentWk.babyWeightG}g).\n• **ಆರೋಗ್ಯ ರಕ್ಷಣೆ:** ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ, ಎಡ ಮಗ್ಗುಲಿಗೆ ಮಲಗಿ ಮತ್ತು ದಿನಕ್ಕೆ ೨.೫ ಲೀಟರ್ ನೀರು ಸೇವಿಸಿ.\n• **ವೈದ್ಯರ ಸಲಹೆ:** ${currentWk.weeklyAdvice}\n• **ನೆನಪಿಡಿ:** ಯಾವುದೇ ಹಠಾತ್ ನೋವು, ರಕ್ತಸ್ರಾವ ಅಥವಾ ಮಗುವಿನ ಚಲನೆ ಕಡಿಮೆಯಾದರೆ ತಕ್ಷಣ ನಿಮ್ಮ ಸ್ತ್ರೀರೋಗ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      followUps: [
        `${gestationalWeek}ನೇ ವಾರದ ಮಗುವಿನ ಬೆಳವಣಿಗೆ`,
        'ಆಸ್ಪತ್ರೆ ಬ್ಯಾಗ್ ತಯಾರಿ ಹೇಗೆ?',
        'ಗರ್ಭಾವಸ್ಥೆಯ ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮಗಳು'
      ]
    };
  }

  if (langKey === 'hi-IN') {
    return {
      answer: `नमस्ते ${motherName}! 🌸 गर्भावस्था के **${gestationalWeek}वें सप्ताह** (${currentWk.trimester}rd तिमाही) के लिए नैदानिक सलाह:\n\n• **शिशु की वर्तमान स्थिति:** ${currentWk.fruitEmoji} शिशु अब **${currentWk.babySizeFruit}** के आकार का है (लंबाई ~${currentWk.babyLengthCm} सेमी, वजन ~${currentWk.babyWeightG} ग्राम)।\n• **दैनिक देखभाल:** पर्याप्त आराम करें, बाईं करवट सोएं और प्रतिदिन २.५ लीटर पानी पिएं।\n• **सप्ताहिक सलाह:** ${currentWk.weeklyAdvice}\n• **सावधानी:** अचानक तेज सिरदर्द, रक्तस्राव या शिशु की हलचल में कमी महसूस होने पर तुरंत अपनी डॉक्टर से संपर्क करें।`,
      followUps: [
        `${gestationalWeek}वें सप्ताह का विकास`,
        'अस्पताल बैग की तैयारी',
        'गर्भावस्था के सुरक्षित व्यायाम'
      ]
    };
  }

  return {
    answer: `Hello ${motherName}! 🌸 Regarding your query at **Week ${gestationalWeek}** (Trimester ${currentWk.trimester}):\n\n• **Baby Status:** ${currentWk.fruitEmoji} Baby is currently the size of a **${currentWk.babySizeFruit}** (~${currentWk.babyLengthCm} cm, ~${currentWk.babyWeightG}g).\n• **Core Maternal Care:** Prioritize restful left-side sleeping (SOS position), 2.5L+ hydration, and a balanced diet rich in iron, calcium, and protein.\n• **Clinical Focus for This Week:** ${currentWk.weeklyAdvice}\n• **Safety Standard:** If you ever experience persistent abdominal pain, fluid leakage, or reduced fetal movement, contact Dr. Sunita or your maternity triage immediately.\n\nFeel free to ask more specific questions about safe foods, travel, sleeping postures, scans, kicks, or hospital bags!`,
    followUps: [
      `Fetal milestones in Week ${gestationalWeek}`,
      'Hospital bag packing checklist',
      'Safe exercises for this stage of pregnancy'
    ]
  };
}

// GET Endpoint: Check configured AI providers and connection health
export async function GET() {
  const DEFAULT_GNANI_KEY =
    process.env.GNANI_API_KEY ||
    process.env.NEXT_PUBLIC_GNANI_API_KEY ||
    'vach_1ytE2CY5X2P8OG75LB2LoKExoXdn3zYsCnjFDaGsK4f83KNfy9P46d54x65TsbmRKLIIkxknsvFJVj8W1VWZfQcKRJnvjGi8_de3ef9b7ebb582a7792bb89f2e87dce2';
  const hasGnani = Boolean(DEFAULT_GNANI_KEY);
  const hasGroq = Boolean(process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);
  const hasGrok = Boolean(process.env.XAI_API_KEY || process.env.GROK_API_KEY);

  const activeProvider = hasGnani
    ? 'gnani'
    : hasGroq
    ? 'groq'
    : hasGemini
    ? 'gemini'
    : hasOpenAI
    ? 'openai'
    : hasOpenRouter
    ? 'openrouter'
    : hasGrok
    ? 'grok'
    : null;

  return NextResponse.json({
    configured: Boolean(activeProvider),
    serverProviders: {
      gnani: hasGnani,
      groq: hasGroq,
      gemini: hasGemini,
      openai: hasOpenAI,
      openrouter: hasOpenRouter,
      grok: hasGrok
    },
    activeProvider,
    providerDisplayName:
      activeProvider === 'gnani'
        ? 'Gnani AI (Vachana Speech & Indic AI)'
        : activeProvider === 'groq'
        ? 'Groq Cloud LPU'
        : activeProvider === 'gemini'
        ? 'Google Gemini'
        : activeProvider === 'openai'
        ? 'OpenAI'
        : activeProvider === 'openrouter'
        ? 'OpenRouter'
        : activeProvider === 'grok'
        ? 'xAI Grok'
        : null
  });
}

// POST Endpoint: Handle Chat & Key Validation
export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const {
      message = '',
      apiKey = '',
      gnaniApiKey: bodyGnaniKey = '',
      groqApiKey: bodyGroqKey = '',
      geminiApiKey: bodyGeminiKey = '',
      openaiApiKey: bodyOpenAIKey = '',
      openrouterApiKey: bodyOpenRouterKey = '',
      grokApiKey: bodyGrokKey = '',
      history = [],
      gestationalWeek = 24,
      userRole = 'mother',
      language = 'en-US',
      motherName = 'Priya',
      test = false
    } = body;

    const cleanInput = (message || '').trim();
    if (!cleanInput && !test) {
      return NextResponse.json(
        { error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    // Auto-detect key provider if generic key is provided
    let autoGnani = '';
    let autoGroq = '';
    let autoGemini = '';
    let autoOpenAI = '';
    let autoOpenRouter = '';
    let autoGrok = '';

    const genericKey = (apiKey || req.headers.get('x-api-key') || '').trim();
    if (genericKey) {
      if (genericKey.startsWith('vach_')) autoGnani = genericKey;
      else if (genericKey.startsWith('gsk_')) autoGroq = genericKey;
      else if (genericKey.startsWith('AIzaSy')) autoGemini = genericKey;
      else if (genericKey.startsWith('sk-or-v1-')) autoOpenRouter = genericKey;
      else if (genericKey.startsWith('xai-')) autoGrok = genericKey;
      else if (genericKey.startsWith('sk-')) autoOpenAI = genericKey;
      else autoGnani = genericKey;
    }

    const DEFAULT_GNANI_KEY =
      process.env.GNANI_API_KEY ||
      process.env.NEXT_PUBLIC_GNANI_API_KEY ||
      'vach_1ytE2CY5X2P8OG75LB2LoKExoXdn3zYsCnjFDaGsK4f83KNfy9P46d54x65TsbmRKLIIkxknsvFJVj8W1VWZfQcKRJnvjGi8_de3ef9b7ebb582a7792bb89f2e87dce2';

    const effectiveGnaniKey = (
      bodyGnaniKey ||
      req.headers.get('x-gnani-key') ||
      autoGnani ||
      DEFAULT_GNANI_KEY
    ).trim();

    // Effective keys combining body, headers, auto-detection, and server environment
    const effectiveGroqKey = (
      bodyGroqKey ||
      req.headers.get('x-groq-key') ||
      autoGroq ||
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY ||
      ''
    ).trim();

    const effectiveGeminiKey = (
      bodyGeminiKey ||
      req.headers.get('x-gemini-key') ||
      autoGemini ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ''
    ).trim();

    const effectiveOpenAIKey = (
      bodyOpenAIKey ||
      req.headers.get('x-openai-key') ||
      autoOpenAI ||
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      ''
    ).trim();

    const effectiveOpenRouterKey = (
      bodyOpenRouterKey ||
      req.headers.get('x-openrouter-key') ||
      autoOpenRouter ||
      process.env.OPENROUTER_API_KEY ||
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      ''
    ).trim();

    const effectiveGrokKey = (
      bodyGrokKey ||
      req.headers.get('x-grok-key') ||
      autoGrok ||
      process.env.XAI_API_KEY ||
      process.env.GROK_API_KEY ||
      ''
    ).trim();

    // ---------------------------------------------------------
    // TEST CONNECTION MODE: Verify key and return diagnostic
    // ---------------------------------------------------------
    if (test) {
      // 1. Test Gnani AI (Vachana Speech & Indic Engine)
      if (effectiveGnaniKey && (bodyGnaniKey || genericKey.startsWith('vach_') || (!bodyGroqKey && !bodyGeminiKey && !bodyOpenAIKey))) {
        const gnaniTest = await callGnaniAPI(effectiveGnaniKey);
        if (gnaniTest && gnaniTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'Gnani AI',
            model: gnaniTest.model,
            message: `Connected successfully to Gnani AI (Vachana Timbre & Prisma Indic AI Engine)!`
          });
        }
        if (gnaniTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'Gnani AI',
            error: gnaniTest.error
          }, { status: 400 });
        }
      }

      // 2. Test Groq
      if (effectiveGroqKey) {
        const groqTest = await callGroqAPI(
          effectiveGroqKey,
          'You are an AI connectivity tester. Respond with: OK',
          'ping'
        );
        if (groqTest && groqTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'Groq Cloud LPU',
            model: groqTest.model,
            message: `Connected successfully to Groq Cloud (${groqTest.model})!`
          });
        }
        if (groqTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'Groq Cloud LPU',
            error: groqTest.error
          }, { status: 400 });
        }
      }

      // 2. Test Gemini
      if (effectiveGeminiKey) {
        const geminiTest = await callGeminiAPI(
          effectiveGeminiKey,
          'You are an AI connectivity tester. Respond with: OK',
          'ping'
        );
        if (geminiTest && geminiTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'Google Gemini',
            model: geminiTest.model,
            message: `Connected successfully to Google Gemini (${geminiTest.model})!`
          });
        }
        if (geminiTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'Google Gemini',
            error: geminiTest.error
          }, { status: 400 });
        }
      }

      // 3. Test OpenAI
      if (effectiveOpenAIKey) {
        const openAiTest = await callOpenAIAPI(
          effectiveOpenAIKey,
          'You are an AI connectivity tester. Respond with: OK',
          'ping'
        );
        if (openAiTest && openAiTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'OpenAI',
            model: openAiTest.model,
            message: `Connected successfully to OpenAI (${openAiTest.model})!`
          });
        }
        if (openAiTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'OpenAI',
            error: openAiTest.error
          }, { status: 400 });
        }
      }

      // 4. Test OpenRouter
      if (effectiveOpenRouterKey) {
        const openRouterTest = await callOpenRouterAPI(
          effectiveOpenRouterKey,
          'You are an AI connectivity tester. Respond with: OK',
          'ping'
        );
        if (openRouterTest && openRouterTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'OpenRouter',
            model: openRouterTest.model,
            message: `Connected successfully to OpenRouter (${openRouterTest.model})!`
          });
        }
        if (openRouterTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'OpenRouter',
            error: openRouterTest.error
          }, { status: 400 });
        }
      }

      // 5. Test xAI Grok
      if (effectiveGrokKey) {
        const grokTest = await callGrokAPI(
          effectiveGrokKey,
          'You are an AI connectivity tester. Respond with: OK',
          'ping'
        );
        if (grokTest && grokTest.text) {
          return NextResponse.json({
            success: true,
            provider: 'xAI Grok',
            model: grokTest.model,
            message: `Connected successfully to xAI Grok (${grokTest.model})!`
          });
        }
        if (grokTest?.error) {
          return NextResponse.json({
            success: false,
            provider: 'xAI Grok',
            error: grokTest.error
          }, { status: 400 });
        }
      }

      return NextResponse.json({
        success: false,
        error: 'No active AI API key was found or provided. Please enter a valid Groq, Gemini, or OpenAI API key.'
      }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 1. Mandatory Obstetric Red Flag Emergency Triage
    // ---------------------------------------------------------
    for (const emergency of EMERGENCY_PATTERNS) {
      if (emergency.regex.test(cleanInput)) {
        return NextResponse.json({
          success: true,
          isEmergencyAlert: true,
          emergencyTitle: emergency.title,
          emergencyWarning: emergency.warning,
          emergencyAction: emergency.action,
          response: `${emergency.title}\n\n⚠️ **WARNING:** ${emergency.warning}\n\n🚨 **IMMEDIATE ACTION REQUIRED:**\n${emergency.action}`,
          followUps: [
            'Call Doctor immediately',
            'Call Hospital Emergency Triage',
            'Find nearest maternity hospital'
          ],
          source: 'clinical-emergency-triage'
        });
      }
    }

    const systemPrompt = buildSystemPrompt({
      motherName,
      gestationalWeek,
      userRole,
      language
    });

    // ---------------------------------------------------------
    // 2. Gnani Indic Clinical Intelligence (Default Active Provider)
    // ---------------------------------------------------------
    const hasExplicitExternalKey = Boolean(bodyGroqKey || bodyGeminiKey || bodyOpenAIKey || bodyOpenRouterKey || bodyGrokKey);
    if (!hasExplicitExternalKey) {
      const clinicalSynthesis = generateOfflineClinicalSynthesis(
        cleanInput,
        motherName,
        gestationalWeek,
        language,
        userRole
      );
      if (clinicalSynthesis && clinicalSynthesis.answer) {
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: clinicalSynthesis.answer,
          followUps: clinicalSynthesis.followUps,
          source: effectiveGnaniKey ? 'gnani-indic-ai' : 'offline-clinical-synthesis'
        });
      }
    }

    // ---------------------------------------------------------
    // 3. Cloud LLM Inference Engine (Groq / Gemini / OpenAI)
    // ---------------------------------------------------------
    if (effectiveGroqKey) {
      const groqRes = await callGroqAPI(effectiveGroqKey, systemPrompt, cleanInput, history);
      if (groqRes && groqRes.text) {
        const parsed = parseAiResponse(groqRes.text, language, gestationalWeek);
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: parsed.answer,
          followUps: parsed.followUps,
          source: `groq-lpu:${groqRes.model}`
        });
      }
    }

    // ---------------------------------------------------------
    // 3. Fallback Engine: Google Gemini
    // ---------------------------------------------------------
    if (effectiveGeminiKey) {
      const geminiRes = await callGeminiAPI(effectiveGeminiKey, systemPrompt, cleanInput, history);
      if (geminiRes && geminiRes.text) {
        const parsed = parseAiResponse(geminiRes.text, language, gestationalWeek);
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: parsed.answer,
          followUps: parsed.followUps,
          source: `gemini-live:${geminiRes.model}`
        });
      }
    }

    // ---------------------------------------------------------
    // 4. Fallback Engine: OpenAI
    // ---------------------------------------------------------
    if (effectiveOpenAIKey) {
      const openAiRes = await callOpenAIAPI(effectiveOpenAIKey, systemPrompt, cleanInput, history);
      if (openAiRes && openAiRes.text) {
        const parsed = parseAiResponse(openAiRes.text, language, gestationalWeek);
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: parsed.answer,
          followUps: parsed.followUps,
          source: `openai:${openAiRes.model}`
        });
      }
    }

    // ---------------------------------------------------------
    // 5. Fallback Engine: OpenRouter
    // ---------------------------------------------------------
    if (effectiveOpenRouterKey) {
      const openRouterRes = await callOpenRouterAPI(effectiveOpenRouterKey, systemPrompt, cleanInput, history);
      if (openRouterRes && openRouterRes.text) {
        const parsed = parseAiResponse(openRouterRes.text, language, gestationalWeek);
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: parsed.answer,
          followUps: parsed.followUps,
          source: `openrouter:${openRouterRes.model}`
        });
      }
    }

    // ---------------------------------------------------------
    // 6. Fallback Engine: xAI Grok
    // ---------------------------------------------------------
    if (effectiveGrokKey) {
      const grokRes = await callGrokAPI(effectiveGrokKey, systemPrompt, cleanInput, history);
      if (grokRes && grokRes.text) {
        const parsed = parseAiResponse(grokRes.text, language, gestationalWeek);
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: parsed.answer,
          followUps: parsed.followUps,
          source: `grok-live:${grokRes.model}`
        });
      }
    }

    // ---------------------------------------------------------
    // 7. Topic-Tailored Clinical Fallback (Offline Mode)
    // ---------------------------------------------------------
    const offlineFallback = generateOfflineClinicalSynthesis(
      cleanInput,
      motherName,
      gestationalWeek,
      language,
      userRole
    );

    return NextResponse.json({
      success: true,
      isEmergencyAlert: false,
      response: offlineFallback.answer,
      followUps: offlineFallback.followUps,
      source: effectiveGnaniKey ? 'gnani-indic-ai' : 'offline-clinical-synthesis'
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing medical chat.' },
      { status: 500 }
    );
  }
}
