import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  message: string;
  apiKey?: string;
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

  return `You are GarbhSarthi AI, an intelligent, empathetic, culturally conscious maternal and pediatric health companion for GarbhSarthi (GarbaKosh).

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

// Topic-Tailored Clinical Fallback (if completely offline)
function generateOfflineClinicalSynthesis(
  question: string,
  motherName: string,
  gestationalWeek: number,
  language: string,
  userRole: string
): { answer: string; followUps: string[] } {
  const q = question.toLowerCase();
  const isNutrition = /(food|eat|diet|nutrition|coconut|papaya|pineapple|ragi|calcium|iron|ಊಟ|ಆಹಾರ|ತಿನ್ನ|ಎಳನೀರು|खाना|डाइट|உணவு|ఆహారం|ഭക്ഷണം)/i.test(q);
  const isPain = /(pain|back|ache|spine|hurt|ನೋವು|ಬೆನ್ನು|ಸೊಂಟ|दर्द|पीठ|कमर|வலி|முதுகு|నొప్పి|నడుము|വേദന|നടു)/i.test(q);
  const isSwelling = /(swell|feet|ankle|edema|ಊತ|ಕಾಲು|ಹಿಮ್ಮಡಿ|सूजन|पैरों|வீக்கம்|கால்|వాపు|కాళ్ళ|നീര്|കാലിലെ)/i.test(q);

  if (language === 'kn-IN') {
    if (isNutrition) {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಆಹಾರದ ಕುರಿತು ಮುಖ್ಯ ಸಲಹೆಗಳು:\n\n• **ಪೌಷ್ಟಿಕಾಂಶಗಳು:** ರಾಗಿ ಗಂಜಿ/ಮುದ್ದೆ, ಪಾಲಕ್ ಸೊಪ್ಪು, ದಾಳಿಂಬೆ, ಖರ್ಜೂರ ಮತ್ತು ಎಳನೀರು ಉತ್ತಮ ಪೋಷಕಾಂಶ ಮತ್ತು ಜಲಾಂಶ ನೀಡುತ್ತವೆ.\n• **ಜೀರ್ಣಕ್ರಿಯೆ:** ದಿನಕ್ಕೆ ೮-೧೦ ಲೋಟ ನೀರು ಕುಡಿಯಿರಿ. ಅತಿಯಾದ ಖಾರ, ಎಣ್ಣೆಯುಕ್ತ ಮತ್ತು ಸಂಸ್ಕರಿಸಿದ ಆಹಾರಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ.\n• **ಎಚ್ಚರಿಕೆ:** ಹಸಿ ಪರಂಗಿಕಾಯಿ ಮತ್ತು ಅರೆಬೇಯಿಸಿದ ಆಹಾರವನ್ನು ಸೇವಿಸಬೇಡಿ.`,
        followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ರಾಗಿ ಉಪಯೋಗಗಳು', 'ಎಳನೀರು ಕುಡಿಯಲು ಸೂಕ್ತ ಸಮಯ', 'ಕಬ್ಬಿಣದಂಶ ಹೆಚ್ಚಿಸುವ ವಿಧಾನ']
      };
    }
    if (isSwelling) {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಪಾದಗಳ ಊತ ಸಾಮಾನ್ಯವಾಗಿರುತ್ತದೆ:\n\n• **ಉಪಶಮನ:** ಕುಳಿತಾಗ ಪಾದಗಳನ್ನು ದಿಂಬಿನ ಮೇಲೆ ಎತ್ತರಿಸಿ ಇರಿಸಿ. ದೀರ್ಘಕಾಲ ಒಂದೇ ಕಡೆ ನಿಲ್ಲುವುದನ್ನು ತಪ್ಪಿಸಿ.\n• **ನೀರು & ಉಪ್ಪು:** ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯುವುದರಿಂದ ನೀರಿನ ಶೇಖರಣೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ. ಉಪ್ಪಿನ ಪ್ರಮಾಣವನ್ನು ಮಿತಿಗೊಳಿಸಿ.\n• **ಎಚ್ಚರಿಕೆ:** ಮುಖ ಅಥವಾ ಕೈಗಳಲ್ಲಿ ಹಠಾತ್ ಊತ ಕಂಡುಬಂದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
        followUps: ['ಕಾಲು ಊತ ಯಾವಾಗ ಕಡಿಮೆಯಾಗುತ್ತದೆ?', 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ರಕ್ತದೊತ್ತಡ ತಪಾಸಣೆ', 'ಆರಾಮದಾಯಕ ಪಾದರಕ್ಷೆಗಳು']
      };
    }
    if (isPain) {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ಬೆನ್ನು ಮತ್ತು ಸೊಂಟದ ನೋವಿಗೆ ಪರಿಹಾರಗಳು:\n\n• **ಮಲಗುವ ಭಂಗಿ:** ಎಡಭಾಗಕ್ಕೆ ತಿರುಗಿ ಮಲಗಿ, ಮೊಣಕಾಲುಗಳ ನಡುವೆ ಗರ್ಭಧಾರಣೆಯ ದಿಂಬನ್ನು (pregnancy pillow) ಇಟ್ಟುಕೊಳ್ಳಿ.\n• **ಶಾಖ ಚಿಕಿತ್ಸೆ:** ಬೆನ್ನಿನ ಕೆಳಭಾಗಕ್ಕೆ ಬೆಚ್ಚಗಿನ ನೀರಿನ ಬ್ಯಾಗ್ ಇಟ್ಟುಕೊಳ್ಳಿ. ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಎತ್ತಬೇಡಿ.\n• **ವ್ಯಾಯಾಮ:** ವೈದ್ಯರ ಅನುಮತಿಯೊಂದಿಗೆ ಸೌಮ್ಯವಾದ ನಡಿಗೆ ಅಥವಾ ಬೆಕ್ಕಿನ-ಹಸುವಿನ ಭಂಗಿ (Cat-Cow stretch) ಮಾಡಿ.`,
        followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಮಲಗುವ ಭಂಗಿ', 'ಪೆಲ್ವಿಕ್ ನೋವಿಗೆ ಮನೆಮದ್ದು', 'ವ್ಯಾಯಾಮದ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು']
      };
    }
    return {
      answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಧಾರಣೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ನಿಮ್ಮ ಆರೋಗ್ಯದ ಕುರಿತು ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶನ:\n\n• **ಆರೋಗ್ಯ ರಕ್ಷಣೆ:** ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ, ಸಮತೋಲಿತ ಆಹಾರ ಮತ್ತು ನಿತ್ಯ 2.5 ಲೀಟರ್ ನೀರು ಸೇವನೆ ಮುಖ್ಯ.\n• **ವೈದ್ಯರ ಭೇಟಿ:** ನಿಗದಿತ ದಿನಾಂಕಗಳಲ್ಲಿ ಅಲ್ಟ್ರಾಸೌಂಡ್ ಸ್ಕ್ಯಾನ್ ಮತ್ತು ತಪಾಸಣೆಗಳನ್ನು ಮಾಡಿಸಿಕೊಳ್ಳಿ.`,
      followUps: ['ಈ ವಾರ ಮಗುವಿನ ತೂಕ ಎಷ್ಟು?', 'ಆಸ್ಪತ್ರೆ ಬ್ಯಾಗ್ ಸಿದ್ಧತೆ', 'ಮಗುವಿನ ಬೆಳವಣಿಗೆ ವಿವರ']
    };
  }

  // English default
  if (isNutrition) {
    return {
      answer: `Hello ${motherName}! 🌸 Regarding your nutrition query at **Week ${gestationalWeek}**:\n\n• **Hydration & Electrolytes:** Tender coconut water and fresh chaas (buttermilk) are safe and excellent for replenishing minerals and easing mild heartburn.\n• **Core Nutrients:** Focus on iron (spinach, lentils, dates), calcium (ragi, curd, sesame), and 60-70g protein daily.\n• **Safety:** Avoid unpasteurized juices, raw papaya, excess caffeine, and overly spicy oily foods.`,
      followUps: ['Safe amount of coconut water daily', 'Iron absorption tips with Vitamin C', 'Snack ideas for 2nd trimester']
    };
  }
  if (isSwelling) {
    return {
      answer: `Hello ${motherName}! 🌸 Mild ankle and foot swelling (physiological edema) is very common in **Week ${gestationalWeek}** as maternal blood volume increases:\n\n• **Elevation:** Elevate your feet on a footstool or pillow whenever resting.\n• **Movement:** Avoid standing or sitting cross-legged for prolonged periods. Gentle 20-minute walks promote venous return.\n• **When to Alert Doctor:** Sudden swelling in your face, around eyes, or sudden severe puffiness in hands accompanied by a headache requires immediate blood pressure evaluation.`,
      followUps: ['Compression socks recommendations', 'Signs of preeclampsia to watch for', 'Best resting positions']
    };
  }
  if (isPain) {
    return {
      answer: `Hello ${motherName}! 🌸 Lower back and pelvic tightness at **Week ${gestationalWeek}** often stems from your shifting center of gravity and the relaxing hormone softening ligaments:\n\n• **Sleep Posture:** Sleep on your left side with a supportive pregnancy pillow between knees and under your belly.\n• **Warm Compress:** Apply a warm heating pad to your lower lumbar region for 15 minutes.\n• **Gentle Stretches:** Pelvic tilts and prenatal yoga Cat-Cow poses help relieve nerve pressure.`,
      followUps: ['Safe sleeping positions', 'Pelvic belt benefits', 'Doctor referral for severe pain']
    };
  }

  return {
    answer: `Hello ${motherName}! 🌸 Regarding your query at **Week ${gestationalWeek}**:\n\n• **Clinical Care:** Prioritize restful sleep on your left side and stay hydrated with 2.5L+ fluids daily.\n• **Nutrition:** Focus on iron, calcium, and protein density (lentils, leafy greens, fortified dairy).\n• **Safety:** Contact Dr. Sunita promptly if you experience severe headaches, vision changes, or fluid leakage.`,
    followUps: [
      `Developmental changes in Week ${gestationalWeek}`,
      'Safe exercises for this trimester',
      'Hospital bag checklist'
    ]
  };
}

// GET Endpoint: Check configured AI providers and connection health
export async function GET() {
  const hasGroq = Boolean(process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY);
  const hasGrok = Boolean(process.env.XAI_API_KEY || process.env.GROK_API_KEY);

  const activeProvider = hasGroq
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
      groq: hasGroq,
      gemini: hasGemini,
      openai: hasOpenAI,
      openrouter: hasOpenRouter,
      grok: hasGrok
    },
    activeProvider,
    providerDisplayName:
      activeProvider === 'groq'
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
    let autoGroq = '';
    let autoGemini = '';
    let autoOpenAI = '';
    let autoOpenRouter = '';
    let autoGrok = '';

    const genericKey = (apiKey || req.headers.get('x-api-key') || '').trim();
    if (genericKey) {
      if (genericKey.startsWith('gsk_')) autoGroq = genericKey;
      else if (genericKey.startsWith('AIzaSy')) autoGemini = genericKey;
      else if (genericKey.startsWith('sk-or-v1-')) autoOpenRouter = genericKey;
      else if (genericKey.startsWith('xai-')) autoGrok = genericKey;
      else if (genericKey.startsWith('sk-')) autoOpenAI = genericKey;
      else autoGroq = genericKey; // Default fallback to Groq
    }

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
      // 1. Test Groq
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
    // 2. Primary Engine: Groq Cloud LPU
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
      source: 'offline-clinical-synthesis'
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing medical chat.' },
      { status: 500 }
    );
  }
}
