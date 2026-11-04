import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  message: string;
  apiKey?: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  gestationalWeek?: number;
  userRole?: 'mother' | 'partner';
  language?: string;
  motherName?: string;
}

// 1. Emergency Red Flags Requiring Immediate Clinical Escalation
const EMERGENCY_PATTERNS = [
  {
    regex: /(heavy bleeding|bleed|soaked pad|clots|hemorrhage|haemorrhage|blood in urine)/i,
    title: '🚨 CRITICAL MEDICAL ALERT: IMMEDIATE ATTENTION FOR BLEEDING',
    warning: 'Heavy or persistent vaginal bleeding (soaking through a pad in under an hour, or passing large clots) can indicate placental abruption, placenta previa, or an obstetric emergency.',
    action: 'Proceed immediately to your nearest hospital maternity triage or call emergency medical services (112 / 108 / 911) right away. Do not insert anything vaginally.'
  },
  {
    regex: /(severe headache|blurred vision|flashing spots|flashing lights|sudden swelling face|high bp|preeclampsia|epigastric pain)/i,
    title: '⚠️ CRITICAL: POSSIBLE PREECLAMPSIA SIGNS',
    warning: 'Persistent severe headache accompanied by vision changes (flashing lights, blurriness) or sudden facial/hand swelling can indicate dangerous blood pressure elevation.',
    action: 'Check your blood pressure immediately and contact your maternity emergency triage right away for prompt clinical evaluation.'
  },
  {
    regex: /(not moving|no kicks|stopped moving|reduced movement|cannot feel baby|no fetal movement)/i,
    title: '🚨 URGENT: FETAL MOVEMENT EVALUATION',
    warning: 'At 24+ weeks, a significant reduction or cessation of your baby’s active kicks warrants prompt clinical fetal monitoring via CTG or ultrasound.',
    action: 'Drink a tall glass of ice-cold water, lie on your left side in a quiet room for 30 minutes. If 10 movements are not felt within 2 hours, proceed to maternity triage immediately.'
  },
  {
    regex: /(water broke|leaking fluid|gush of water|broken water|green fluid|brown fluid|meconium)/i,
    title: '⚠️ NOTICE: POSSIBLE RUPTURE OF MEMBRANES (WATER BREAKING)',
    warning: 'Leaking amniotic fluid requires sterile clinical assessment to prevent intrauterine infection.',
    action: 'Note fluid color and odor, use a clean maternity pad, and contact your delivery hospital triage immediately. If fluid is green or dark brown, proceed to the hospital without delay.'
  },
  {
    regex: /(harm myself|kill myself|suicide|end it all|hurt baby|cannot do this anymore|hear voices)/i,
    title: '❤️ WE ARE HERE FOR YOU - CRISIS SUPPORT',
    warning: 'Please know that you are not alone. Perinatal emotional distress and postpartum depression are treatable medical conditions.',
    action: 'Please call or text the Suicide & Crisis Lifeline (988), the Tele-MANAS National Mental Health Helpline (14416 in India), or emergency services (112 / 108) right away.'
  }
];

interface TopicContent {
  answer: string;
  followUps: string[];
}

// 2. Comprehensive Multilingual Maternal Clinical Knowledge Base (21 Core Clinical Domains)
const KNOWLEDGE_BASE: Record<string, Record<string, TopicContent>> = {
  greeting: {
    'en-US': {
      answer: `Hello! 🌸 I am Bloom AI, your personal pregnancy, childbirth, and parenthood companion. I'm here 24/7 to provide clinically grounded, culturally conscious guidance tailored to your journey.\n\n✨ **Here are some things you can ask me anytime:**\n• **Symptoms & Comfort:** Nausea, baby kicks, back pain, heartburn, sleeping postures\n• **Nutrition & Safety:** Iron-rich foods, gestational diabetes, foods to avoid, kesar & dry fruits\n• **Labor Preparation:** The 5-1-1 rule, hospital bag packing, birth plan options\n• **Garbh Sanskar:** Calming music, positive mindfulness, partner bonding exercises\n• **Postpartum & Newborn:** Breastfeeding latch, newborn sleep, recovery milestones\n\nHow are you and baby feeling right now? Feel free to type or tap the microphone to speak!`,
      followUps: ['How is my baby developing this week?', 'Best foods for second trimester', 'How to relieve lower back pain?']
    },
    'kn-IN': {
      answer: `ನಮಸ್ಕಾರ! 🌸 ನಾನು ಬ್ಲೂಮ್ ಎಐ, ನಿಮ್ಮ ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಮಗುವಿನ ಆರೈಕೆಯ ವೈಯಕ್ತಿಕ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಮತ್ತು ಮಗುವಿನ ಬೆಳವಣಿಗೆಯ ಪ್ರತಿಯೊಂದು ಹಂತದಲ್ಲೂ ನಿಖರ ಮತ್ತು ಸ್ನೇಹಪರ ಸಲಹೆ ನೀಡಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ.\n\n✨ **ನೀವು ನನ್ನನ್ನು ಕೇಳಬಹುದಾದ ವಿಷಯಗಳು:**\n• ಗರ್ಭಾವಸ್ಥೆಯ ಲಕ್ಷಣಗಳು, ವಾಕರಿಕೆ, ಬೆನ್ನುನೋವು ಮತ್ತು ಮಲಗುವ ಸರಿಯಾದ ಭಂಗಿ\n• ಗರ್ಭಿಣಿಯರಿಗೆ ಪೌಷ್ಟಿಕ ಆಹಾರ, ರಾಗಿ, ಹಣ್ಣುಗಳು ಮತ್ತು ತಪ್ಪಿಸಬೇಕಾದ ಆಹಾರಗಳು\n• ಗರ್ಭ ಸಂಸ್ಕಾರ, ಧ್ಯಾನ ಮತ್ತು ಮನಸ್ಸಿನ ಶಾಂತಿ\n• ಹೆರಿಗೆ ನೋವು (5-1-1 ನಿಯಮ) ಮತ್ತು ಆಸ್ಪತ್ರೆ ಚೀಲದ ಸಿದ್ಧತೆ\n• ನವಜಾತ ಶಿಶುವಿನ ಆರೈಕೆ ಮತ್ತು ಎದೆಹಾಲುಣಿಸುವ ವಿಧಾನ\n\nನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ? ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಮೈಕ್ರೊಫೋನ್ ಒತ್ತಿ ಮಾತನಾಡಿ!`,
      followUps: ['ಈ ವಾರ ಮಗುವಿನ ಬೆಳವಣಿಗೆ ಹೇಗಿದೆ?', 'ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಆಹಾರ ಕ್ರಮ', 'ಬೆನ್ನುನೋವಿಗೆ ಸರಳ ಮನೆಮದ್ದು']
    },
    'hi-IN': {
      answer: `नमस्ते! 🌸 मैं ब्लूम एआई हूँ, आपकी गर्भावस्था, प्रसव और शिशु देखभाल साथी। मैं आपकी गर्भावस्था के हर पड़ाव पर चिकित्सीय रूप से सही और स्नेहपूर्ण मार्गदर्शन के लिए उपलब्ध हूँ।\n\n✨ **आप मुझसे कभी भी पूछ सकती हैं:**\n• **लक्षण और राहत:** मतली, शिशु की किक, पीठ दर्द, एसिडिटी, सोने की सही स्थिति\n• **पोषण और सुरक्षा:** आयरन और कैल्शियम युक्त आहार, क्या खाएं और क्या न खाएं\n• **प्रसव की तैयारी:** 5-1-1 नियम, लेबर दर्द के लक्षण, हॉस्पिटल बैग चेकलिस्ट\n• **गर्भ संस्कार:** ध्यान, सकारात्मक विचार, संगीत और पार्टनर का सहयोग\n• **शिशु देखभाल:** स्तनपान, नवजात की नींद और प्रसवोत्तर देखभाल\n\nआज आप और शिशु कैसा महसूस कर रहे हैं? आप लिखकर या माइक पर बोलकर पूछ सकती हैं!`,
      followUps: ['इस हफ्ते शिशु का विकास कैसा है?', 'दूसरी तिमाही में क्या खाना चाहिए?', 'पीठ दर्द से राहत के उपाय']
    },
    'ta-IN': {
      answer: `வணக்கம்! 🌸 நான் ப்ளூம் AI, உங்கள் கர்ப்பகாலம் மற்றும் குழந்தை பராமரிப்பு தோழி. உங்கள் மற்றும் உங்கள் குழந்தையின் ஆரோக்கியத்திற்கான நம்பகமான வழிகாட்டுதலை வழங்க நான் எப்போதும் தயாராக உள்ளேன்.\n\n✨ **நீங்கள் கேட்கக்கூடிய முக்கிய தகவல்கள்:**\n• கர்ப்பகால அறிகுறிகள், குழந்தையின் அசைவுகள், முதுகுவலி, தூங்கும் நிலை\n• சத்தான உணவுமுறைகள், ராகி, பழங்கள் மற்றும் தவிர்க்க வேண்டியவை\n• பிரசவ தயாரிப்புகள் (5-1-1 விதி), மருத்துவமனை பை பட்டியல்\n• கர்ப்ப சம்ஸ்காரம் மற்றும் மன அமைதிக்கான பயிற்சிகள்\n• பிறந்த குழந்தை பராமரிப்பு மற்றும் தாய்ப்பால் கொடுக்கும் முறைகள்\n\nநீங்கள் இப்போது எப்படி உணர்கிறீர்கள்? தாராளமாக கேளுங்கள்!`,
      followUps: ['இந்த வார குழந்தையின் வளர்ச்சி', 'கர்ப்பகால சத்தான உணவுகள்', 'முதுகுவலிக்கான தீர்வுகள்']
    },
    'te-IN': {
      answer: `నమస్కారం! 🌸 నేను బ్లూమ్ AI, మీ గర్భధారణ మరియు శిశు సంరక్షణ సహాయకురాలిని. మీకు ప్రతి దశలో సరైన వైద్య సలహాలు మరియు సూచనలు అందించడానికి నేను ఇక్కడ ఉన్నాను.\n\n✨ **మీరు నన్ను అడగగల ముఖ్యమైన విషయాలు:**\n• గర్భధారణ లక్షణాలు, వికారం, నడుము నొప్పి, నిద్ర భంగిమలు\n• పౌష్టికాహారం, ఐరన్ మరియు కాల్షియం ఆహారాలు, నివారించాల్సినవి\n• ప్రసవ సన్నాహాలు, 5-1-1 కాన్పు నొప్పుల నియమం\n• గర్భ సంస్కార మరియు మనశ్శాంతి సాధనలు\n• నవజాత శిశువు సంరక్షణ మరియు తల్లిపాలు ఇచ్చే పద్ధతులు\n\nమీరు ప్రస్తుతం ఎలా ఉన్నారు? టైప్ చేయండి లేదా మైక్ ద్వారా మాట్లాడండి!`,
      followUps: ['ఈ వారం శిశువు ఎదుగుదల ఎలా ఉంది?', 'గర్భిణీలకు మంచి ఆహారం', 'నడుము నొప్పి నివారణ చిట్కాలు']
    },
    'ml-IN': {
      answer: `നമസ്കാരം! 🌸 ഞാൻ ബ്ലൂം AI, നിങ്ങളുടെ ഗർഭകാല സുഹൃത്ത്. ആരോഗ്യകരമായ ഗർഭകാലത്തിനും കുഞ്ഞിന്റെ ശരിയായ വളർച്ചയ്ക്കും ആവശ്യമായ ശാസ്ത്രീയ നിർദ്ദേശങ്ങൾ നൽകാൻ ഞാൻ സദാ സജ്ജമാണ്.\n\n✨ **നിങ്ങൾക്ക് ചോദിക്കാവുന്ന പ്രധാന കാര്യങ്ങൾ:**\n• ഗർഭകാല ലക്ഷണങ്ങൾ, കുഞ്ഞിന്റെ അനക്കം, നടുവേദന, ഉറങ്ങേണ്ട രീതി\n• പോഷകാഹാരങ്ങൾ, ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ, ജലാംശം\n• പ്രസവ ലക്ഷണങ്ങൾ, 5-1-1 നിയമം, ഹോസ്പിറ്റൽ ബാഗ് ഒരുക്കൽ\n• ഗർഭ സംസ്കാരം, പ്രാർത്ഥനകൾ, മാനസിക സമാധാനം\n• നവജാതശിശു പരിപാലനവും മുലയൂട്ടലും\n\nഇപ്പോൾ എങ്ങനെയുണ്ട്? ചോദ്യങ്ങൾ ടൈപ്പ് ചെയ്യുകയോ മൈക്കിലൂടെ സംസാരിക്കുകയോ ചെയ്യാം!`,
      followUps: ['ഈ ആഴ്ചയിലെ കുഞ്ഞിന്റെ വളർച്ച', 'ഗർഭകാല പോഷകാഹാരങ്ങൾ', 'നടുവേദനയ്ക്കുള്ള പരിഹാരങ്ങൾ']
    }
  },

  nutrition: {
    'en-US': {
      answer: `A balanced, nutrient-dense diet is the greatest gift you give your growing baby. During pregnancy, focus on nutrient density over merely "eating for two."\n\n✨ **Daily Maternal Nutrition Pillars:**\n• **Iron & Hemoglobin:** Dark leafy greens (spinach, methi), beetroot, pomegranate, dates, lentils, and jaggery. Pair with Vitamin C (lemon water or amla) to maximize iron absorption.\n• **Calcium & Bone Density:** Ragi (finger millet), curd/yogurt, paneer, sesame seeds, and fortified plant milk for baby's skeletal formation.\n• **Protein for Fetal Growth (60–75g/day):** Dal, chana, boiled eggs, tofu, paneer, sprouted moong, and roasted makhana.\n• **DHA & Omega-3:** Walnuts, chia seeds, flaxseed oil, and safe cooked low-mercury fish for fetal brain and retinal development.\n• **Hydration:** 8–10 glasses of clean water daily, plus tender coconut water and chaas (buttermilk).\n\n⚠️ **Foods to Avoid:** Unpasteurized dairy, raw or semi-cooked eggs, raw papaya (contains latex), excess raw pineapple (bromelain), high-mercury fish (shark, swordfish), and excess caffeine (>200mg/day).`,
      followUps: ['Can I eat papaya or pineapple?', 'Best iron-rich Indian recipes', 'Safe daily amount of kesar (saffron)']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಿಣಿಯರ ಆಹಾರ ಕ್ರಮವು ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಇಬ್ಬರ ಬೆಳವಣಿಗೆಗೆ ಶಕ್ತಿ ನೀಡುವಂತಿರಬೇಕು.\n\n✨ **ಮುಖ್ಯ ಪೌಷ್ಟಿಕಾಂಶಗಳು:**\n• **ಕಬ್ಬಿಣದಂಶ (Iron):** ಪಾಲಕ್, ಮೆಂತ್ಯ ಸೊಪ್ಪು, ಬೀಟ್‌ರೂಟ್, ದಾಳಿಂಬೆ, ಖರ್ಜೂರ ಮತ್ತು ಬೆಲ್ಲ.\n• **ಕ್ಯಾಲ್ಸಿಯಂ:** ರಾಗಿ ಮುದ್ದೆ/ರಾಗಿ ಗಂಜಿ, ಮೊಸರು, ಪನೀರ್ ಮತ್ತು ಎಳ್ಳು ಮಗುವಿನ ಮೂಳೆಗಳ ಬಲಕ್ಕೆ ಅತ್ಯುತ್ತಮ.\n• **ಪ್ರೋಟೀನ್:** ತೊಗರಿಬೇಳೆ, ಕಡಲೆಕಾಳು, ಮೊಳಕೆ ಕಾಳುಗಳು ಮತ್ತು ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ.\n• **ನೀರಿನ ಸೇವನೆ:** ದಿನಕ್ಕೆ ೮-೧೦ ಲೋಟ ನೀರು ಮತ್ತು ಎಳನೀರು ಕುಡಿಯಿರಿ.\n\n⚠️ **ತಪ್ಪಿಸಬೇಕಾದ ಆಹಾರಗಳು:** ಹಸಿ ಪರಂಗಿಹಣ್ಣು (ಕಾಯಿ ಪಪ್ಪಾಯಿ), ಅನಾನಸ್, ಹಸಿ ಮೊಟ್ಟೆ, ಅತಿಯಾದ ಕಾಫಿ/ಟೀ ಮತ್ತು ಜಂಕ್ ಫುಡ್.`,
      followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ರಾಗಿ ಉಪಯೋಗಗಳು', 'ಕೇಸರಿ ಹಾಲು ಕುಡಿಯುವುದು ಯಾವಾಗ?', 'ರಕ್ತಹೀನತೆ ಕಡಿಮೆ ಮಾಡಲು ಆಹಾರ']
    },
    'hi-IN': {
      answer: `गर्भावस्था में संतुलित और पौष्टिक आहार शिशु के स्वस्थ शारीरिक व मानसिक विकास की नींव है।\n\n✨ **ज़रूरी पोषक तत्व और आहार:**\n• **आयरन (हीमोग्लोबिन के लिए):** पालक, मेथी, चुकंदर, अनार, खजूर, गुड़ और दालें। साथ में नींबू पानी पिएं ताकि आयरन अच्छी तरह अवशोषित हो।\n• **कैल्शियम (मजबूत हड्डियों के लिए):** रागी, दूध, दही, पनीर, तिल और मखाना।\n• **प्रोटीन:** दालें, पनीर, उबले अंडे, अंकुरित मूंग और सोया।\n• **हाइड्रेशन:** दिन में 8-10 गिलास पानी, नारियल पानी और ताजी छाछ पिएं।\n\n⚠️ **क्या न खाएं:** कच्चा पपीता (पपैन लेटेक्स के कारण), कच्चा अनानास, अधपका अंडा, बाहर का खुला खाना और ज्यादा चाय/कॉफ़ी।`,
      followUps: ['क्या गर्भावस्था में पपीता खा सकते हैं?', 'केसर वाला दूध कब पीना चाहिए?', 'हीमोग्लोबिन बढ़ाने वाले आहार']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் ஆரோக்கியமான சத்தான உணவை உட்கொள்வது குழந்தையின் வளர்ச்சிக்கு மிக அவசியம்.\n\n✨ **முக்கிய ஊட்டச்சத்துக்கள்:**\n• **இரும்புச்சத்து:** பசலைக்கீரை, முருங்கைக்கீரை, பீட்ரூட், மாதுளை, பேரீச்சம்பழம் மற்றும் பருப்பு வகைகள்.\n• **கால்சியம்:** ராகி களி/கஞ்சி, தயிர், பனீர் மற்றும் எள்ளு.\n• **புரதம்:** கொண்டைக்கடலை, சுண்டல், முட்டை மற்றும் பயறு வகைகள்.\n• **திரவங்கள்:** தினமும் 8-10 டம்ளர் தண்ணீர், இளநீர் மற்றும் மோர்.\n\n⚠️ **தவிர்க்க வேண்டியவை:** பப்பாளிக்காய், அன்னாசிப்பழம், பச்சை முட்டை மற்றும் அதிகப்படியான காபி/டீ.`,
      followUps: ['கர்ப்பகாலத்தில் ராகி நன்மைகள்', 'குங்குமப்பூ பால் எப்போது குடிக்கலாம்?', 'இரத்த சோகை தடுக்கும் உணவுகள்']
    },
    'te-IN': {
      answer: `గర్భధారణలో పోషక విలువలున్న ఆహారం తీసుకోవడం వల్ల తల్లి మరియు బిడ్డ ఇద్దరూ ఆరోగ్యంగా ఉంటారు.\n\n✨ **ముఖ్యమైన ఆహార సూత్రాలు:**\n• **ఐరన్:** పాలకూర, బీట్‌రూట్, దానిమ్మ, ఖర్జూరం, పప్పులు మరియు బెల్లం.\n• **కాల్షియం:** రాగులు, పెరుగు, పనీర్ మరియు నువ్వులు ఎముకల బలానికి ఎంతో అవసరం.\n• **ప్రొటీన్:** గుడ్లు, పప్పుధాన్యాలు, మొలకెత్తిన గింజలు మరియు శనగలు.\n• **నీరు:** రోజుకు 8-10 గ్లాసుల నీరు, కొబ్బరి నీళ్లు మరియు మజ్జిగ తాగండి.\n\n⚠️ **నివారించాల్సినవి:** పచ్చి బొప్పాయి, అనాసపండు, పచ్చి గుడ్లు మరియు అధిక కెఫిన్.`,
      followUps: ['రాగి జావ ప్రయోజనాలు', 'కుంకుమపువ్వు పాలు ఎప్పుడు తాగాలి?', 'రక్తహీనత నివారణ ఆహారాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്ത് പോഷകസമൃദ്ധമായ ആഹാരം കഴിക്കുന്നത് കുഞ്ഞിന്റെ ആരോഗ്യകരമായ വളർച്ചയ്ക്ക് അത്യന്താപേക്ഷിതമാണ്.\n\n✨ **പ്രധാന ഭക്ഷണങ്ങൾ:**\n• **ഇരുമ്പ് സത്ത്:** ചീര, മുരിങ്ങയില, ബീറ്റ്റൂട്ട്, മാതളനാരങ്ങ, ഈന്തപ്പഴം, പയറുവർഗ്ഗങ്ങൾ.\n• **കാൽസ്യം:** റാഗി, തൈര്, പനീർ, പാൽ ഉൽപ്പന്നങ്ങൾ.\n• **പ്രോട്ടീൻ:** മുട്ട, ചെറുപയർ, കടല, പരിപ്പ്.\n• **ജലാംശം:** ദിവസവും 8-10 ഗ്ലാസ്സ് വെള്ളം, ഇളനീർ, സംഭാരം.\n\n⚠️ **ഒഴിവാക്കേണ്ടവ:** പച്ച പപ്പായ, കൈതച്ചക്ക (അന്നനാസ്), വേവിക്കാത്ത മുട്ട, അമിതമായ ചായ/കാപ്പി.`,
      followUps: ['റാഗിയുടെ ഗുണങ്ങൾ', 'കുങ്കുമപ്പൂവ് പാലിൽ കഴിക്കാമോ?', 'ഹിമോഗ്ലോബിൻ കൂട്ടാൻ എന്തു കഴിക്കണം?']
    }
  },

  nausea: {
    'en-US': {
      answer: `Morning sickness and nausea affect up to 80% of pregnancies due to rising hCG and progesterone hormones relaxing gastric muscles.\n\n✨ **Evidence-Based Relief Strategies:**\n• **Bedside Cracker Habit:** Keep plain dry crackers or roasted almonds by your bedside; eat 2–3 bites before your feet touch the floor.\n• **Small, Frequent Meals:** Eat small, protein-rich snacks every 2 hours to avoid an empty stomach, which triggers acid surges.\n• **Ginger & Lemon Power:** Fresh ginger tea, ginger lozenges, or inhaling sliced lemon aroma can rapidly soothe the vagus nerve.\n• **Vitamin B6 (Pyridoxine):** 25mg three times daily is clinically proven to reduce nausea (consult your OB/GYN before starting).\n• **Acupressure (P6 Point):** Press gently three finger-widths above your wrist crease on the inner arm for 2–3 minutes.\n\n⚠️ *When to consult your doctor:* If you cannot keep fluids down for over 12 hours, feel faint, or have dark concentrated urine (signs of Hyperemesis Gravidarum).`,
      followUps: ['Is ginger tea safe in early pregnancy?', 'What foods stay down easily?', 'Signs of Hyperemesis Gravidarum']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯ ಆರಂಭದಲ್ಲಿ ಹಾರ್ಮೋನ್ ಬದಲಾವಣೆಗಳಿಂದ ವಾಕರಿಕೆ ಮತ್ತು ವಾಂತಿ ಬರುವುದು ಅತ್ಯಂತ ಸಹಜ.\n\n✨ **ಉಪಶಮನಕ್ಕೆ ಸರಳ ಮನೆಮದ್ದುಗಳು:**\n• **ಹಾಸಿಗೆಯಿಂದ ಏಳುವ ಮುನ್ನ:** ಬೆಳಗ್ಗೆ ಏಳುವ ಮುನ್ನ ಹಾಸಿಗೆಯಲ್ಲೇ ಒಣ ಬಿಸ್ಕೆಟ್ ಅಥವಾ ಹುರಿದ ಬಾದಾಮಿ ತಿನ್ನಿ.\n• **ಸ್ವಲ್ಪ ಸ್ವಲ್ಪವೇ ಊಟ ಮಾಡಿ:** ಹೊಟ್ಟೆ ಖಾಲಿ ಬಿಡಬೇಡಿ, ಪ್ರತಿ ೨ ಗಂಟೆಗೊಮ್ಮೆ ಲಘು ಆಹಾರ ಸೇವಿಸಿ.\n• **ಶುಂಠಿ ಮತ್ತು ನಿಂಬೆಹಣ್ಣು:** ಬಿಸಿ ನೀರಿಗೆ ಸ್ವಲ್ಪ ಶುಂಠಿ ಮತ್ತು ನಿಂಬೆ ರಸ ಹಿಂಡಿ ಕುಡಿಯುವುದು ವಾಕರಿಕೆಯನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸುತ್ತದೆ.\n• ಊಟ ಮಾಡುವಾಗ ಒಮ್ಮೆಲೇ ನೀರು ಕುಡಿಯದೆ, ಊಟದ ನಂತರ ಸ್ವಲ್ಪ ಹೊತ್ತು ಬಿಟ್ಟು ನೀರು ಕುಡಿಯಿರಿ.`,
      followUps: ['ವಾಕರಿಕೆಗೆ ಮನೆಮದ್ದು', 'ಯಾವಾಗ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು?', 'ವಾಂತಿಯ ಸಮಯದಲ್ಲಿ ಶಕ್ತಿ ನೀಡುವ ಪಾನೀಯಗಳು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में जी मिचलाना और उल्टी होना हार्मोनल बदलाव (hCG और प्रोजेस्टेरोन) के कारण पाचन धीमा होने से होता है।\n\n✨ **राहत के असरदार उपाय:**\n• **बिस्तर से उठने से पहले:** सुबह उठते ही बिस्तर पर 2 सादा सूखा बिस्कुट या भुना बादाम खाएं।\n• **खाली पेट न रहें:** हर 2 घंटे में थोड़ा-थोड़ा पौष्टिक खाना खाएं।\n• **अदरक और नींबू:** ताजी अदरक की चाय या नींबू की महक सूंघने से मतली में तुरंत आराम मिलता है।\n• **विटामिन B6:** डॉक्टर की सलाह से 25mg विटामिन B6 लेना बहुत सुरक्षित और असरदार होता है।\n\n⚠️ *डॉक्टर को कब दिखाएं:* अगर 12 घंटे से पानी भी न पच रहा हो या चक्कर आ रहे हों।`,
      followUps: ['मॉर्निंग सिकनेस कब तक रहती है?', 'क्या उल्टी से शिशु पर असर पड़ता है?', 'मतली में क्या खाएं']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் ஏற்படும் வாந்தி மற்றும் மயக்கம் ஹார்மோன் மாற்றங்களால் செரிமானம் தாமதமாவதால் ஏற்படுகிறது.\n\n✨ **எளிய தீர்வுகள்:**\n• காலையில் எழுந்ததும் உலர் பிஸ்கட் அல்லது ரஸ்க் சாப்பிடுங்கள்.\n• வயிறை காலியாக விடாமல் 2 மணி நேரத்திற்கு ஒருமுறை சிறிய அளவில் உணவு உட்கொள்ளுங்கள்.\n• சூடான இஞ்சி தேநீர் அல்லது எலுமிச்சை சாறு அருந்துவது வாந்தியைத் தடுக்கும்.\n• போதுமான அளவு தண்ணீர் மற்றும் இளநீர் அருந்துங்கள்.`,
      followUps: ['மார்னிங் சிக்னஸ் எப்போது குறையும்?', 'வாந்திக்கு எளிய உணவுகள்', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `గర్భధారణ సమయంలో వికారం మరియు వాంతులు హార్మోన్ల మార్పుల వల్ల రావడం చాలా సహజం.\n\n✨ **ఉపశమన చర్యలు:**\n• ఉదయం మంచం దిగే ముందు డ్రై బిస్కెట్లు లేదా బాదం తినండి.\n• కడుపు ఖాళీగా ఉంచకుండా ప్రతి 2 గంటలకొకసారి కొద్దిగా తినండి.\n• అల్లం టీ లేదా నిమ్మరసం వికారాన్ని తక్షణమే తగ్గిస్తాయి.\n• ఎక్కువ నూనె, కారం ఉన్న ఆహారాలు నివారించండి.`,
      followUps: ['వికారం తగ్గడానికి చిట్కాలు', 'వైద్యుడిని ఎప్పుడు సంప్రదించాలి?', 'సురక్షితమైన ఆహారాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ ഓക്കാനവും ഛർദ്ദിയും മാറ്റാൻ ലളിതമായ ചില വഴികൾ നോക്കാം.\n\n✨ **പ്രധാന പരിഹാരങ്ങൾ:**\n• രാവിലെ എഴുന്നേൽക്കുന്നതിന് മുൻപ് ഉണങ്ങിയ ബിസ്ക്കറ്റ് കഴിക്കുക.\n• വയറു ഒഴിഞ്ഞിരിക്കാൻ അനുവദിക്കാതെ ഇടയ്ക്കിടെ ലഘുഭക്ഷണം കഴിക്കുക.\n• ഇഞ്ചി ചായയോ നാരങ്ങാവെള്ളമോ കുടിക്കുന്നത് ഓക്കാനം കുറയ്ക്കും.\n• എണ്ണയിൽ വറുത്തതും എരിവുള്ളതുമായ ഭക്ഷണങ്ങൾ ഒഴിവാക്കുക.`,
      followUps: ['ഛർദ്ദിക്ക് വീട്ടുവൈദ്യം', 'എപ്പോഴാണ് ഡോക്ടറെ കാണേണ്ടത്?', 'കഴിക്കാവുന്ന ഭക്ഷണങ്ങൾ']
    }
  },

  kicks: {
    'en-US': {
      answer: `Feeling your baby move is one of the most magical milestones! First movements ("quickening") usually feel like light flutterings between Weeks 16–22, turning into distinct kicks and rolls by Week 24.\n\n✨ **The Clinical Kick-Counting Protocol (28+ Weeks):**\n• **Timing:** Pick a time when baby is usually active, typically after a meal or in the quiet evening.\n• **Position:** Lie comfortably on your **left side** with your hands resting gently on your abdomen.\n• **The 10-in-2 Benchmark:** Count distinct movements (kicks, rolls, swooshes, hiccups count separately). You should feel **at least 10 movements within 2 hours** (often reached in under 30 minutes).\n• **If Baby Seems Quiet:** Drink a tall glass of ice-cold fruit juice or water, walk for 5 minutes, then lie down on your left side again.\n\n🚨 **URGENT WARNING:** If you notice a distinct decrease, sluggishness, or absence of movements after 24 weeks, proceed to maternity triage immediately for a non-stress test (CTG). Never wait until the next day!`,
      followUps: ['Why does baby kick more at night?', 'Difference between hiccups and kicks', 'When should I be concerned about kicks?']
    },
    'kn-IN': {
      answer: `ಮಗುವಿನ ಒದೆಯುವಿಕೆ (Kicks) ಮಗುವಿನ ಆರೋಗ್ಯ ಮತ್ತು ಚುರುಕುತನದ ಮುಖ್ಯ ಸಂಕೇತವಾಗಿದೆ.\n\n✨ **ಕಿಕ್ ಎಣಿಸುವ ನಿಯಮಗಳು (೨೮ನೇ ವಾರದಿಂದ):**\n• ಊಟವಾದ ನಂತರ ಅಥವಾ ಸಂಜೆ ಶಾಂತವಾಗಿ ಎಡ ಮಗ್ಗುಲಿಗೆ ಮಲಗಿ.\n• ಹೊಟ್ಟೆಯ ಮೇಲೆ ಕೈಯಿಟ್ಟು ಮಗುವಿನ ಚಲನೆಯನ್ನು ಎಣಿಸಿ.\n• ಗುರಿ: **೨ ಗಂಟೆಗಳಲ್ಲಿ ಕನಿಷ್ಠ ೧೦ ಚಲನೆಗಳು** (ಒದೆಯುವುದು, ತಿರುಗುವುದು) ಇರಬೇಕು.\n• ಮಗು ಚಲಿಸದಿದ್ದರೆ ತಣ್ಣೀರು ಕುಡಿದು ಮತ್ತೆ ಗಮನಿಸಿ. ಚಲನೆ ತೀರ ಕಡಿಮೆಯಾದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.`,
      followUps: ['ಮಗು ರಾತ್ರಿ ಹೆಚ್ಚು ಒದೆಯುವುದು ಏಕೆ?', 'ಚಲನೆ ಕಡಿಮೆಯಾದರೆ ಏನು ಮಾಡಬೇಕು?', 'ಹಿಕ್ಕಪ್ಸ್ ಮತ್ತು ಕಿಕ್ಸ್ ವ್ಯತ್ಯಾಸ']
    },
    'hi-IN': {
      answer: `गर्भ में शिशु की हलचल (किक्स) उसके स्वस्थ और सक्रिय होने का सबसे सुंदर प्रमाण है।\n\n✨ **किक काउंट करने का सही तरीका (28वें हफ्ते से):**\n• भोजन के बाद शांत कमरे में बाईं करवट लेट जाएं।\n• पेट पर हाथ रखकर हलचल गिनें।\n• लक्ष्य: **2 घंटे में कम से कम 10 हलचलें** महसूस होनी चाहिए।\n• यदि शिशु शांत लगे, तो ठंडा पानी पिएं और बाईं करवट लेटकर दोबारा ध्यान दें। हलचल न मिलने पर तुरंत अस्पताल जाएं।`,
      followUps: ['रात में शिशु ज्यादा क्यों हिलता है?', 'शिशु की हिचकी और किक में अंतर', 'हलचल कम होने पर क्या करें?']
    },
    'ta-IN': {
      answer: `குழந்தையின் அசைவு குழந்தையின் ஆரோக்கியமான வளர்ச்சியைக் குறிக்கிறது.\n\n✨ **உதைப்பு கணக்கீட்டு முறை (28வது வாரத்திலிருந்து):**\n• உணவு உண்ட பிறகு இடது பக்கமாக படுத்துக் கொள்ளுங்கள்.\n• 2 மணி நேரத்தில் குறைந்தது 10 அசைவுகள் இருப்பதை உறுதி செய்யுங்கள்.\n• அசைவு குறைவாக இருந்தால் குளிர்ந்த நீர் அருந்தி மீண்டும் கவனியுங்கள். மாற்றம் இல்லை எனில் மருத்துவரை உடனே அணுகவும்.`,
      followUps: ['இரவில் குழந்தை அதிகம் உதைப்பது ஏன்?', 'அசைவு குறைந்தால் உடனே செய்ய வேண்டியவை', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `శిశువు కదలికలు వారి చురుకుదనాన్ని తెలుపుతాయి.\n\n✨ **కదలికల లెక్కింపు:**\n• భోజనం తర్వాత ఎడమ వైపు పడుకుని గమనించండి.\n• 2 గంటల్లో కనీసం 10 కదలికలు ఉండాలి.\n• కదలికలు తగ్గితే చల్లని నీరు తాగి మళ్లీ చూడండి. లేదంటే వెంటనే ఆసుపత్రికి వెళ్ళండి.`,
      followUps: ['రాత్రివేళ కదలికలు ఎందుకు ఎక్కువ?', 'కదలికలు తగ్గితే ఏమి చేయాలి?', 'డాక్టర్ సలహాలు']
    },
    'ml-IN': {
      answer: `കുഞ്ഞിന്റെ ചലനങ്ങൾ ഗർഭസ്ഥശിശുവിന്റെ ആരോഗ്യത്തിന്റെ അടയാളമാണ്.\n\n✨ **ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ:**\n• ഭക്ഷണശേഷം ഇടതുവശം ചരിഞ്ഞു കിടന്നു കുഞ്ഞിന്റെ ചലനങ്ങൾ എണ്ണുക.\n• 2 മണിക്കൂറിനുള്ളിൽ കുറഞ്ഞത് 10 ചലനങ്ങൾ ഉണ്ടായിരിക്കണം.\n• ചലനം കുറവാണെങ്കിൽ തണുത്ത വെള്ളം കുടിച്ചു നോക്കുക. കുറവ് തുടർന്നാൽ ഉടൻ ആശുപത്രിയിൽ എത്തുക.`,
      followUps: ['രാത്രിയിൽ കുഞ്ഞ് കൂടുതൽ അനങ്ങുന്നത് എന്തുകൊണ്ട്?', 'ചലനം കുറഞ്ഞാൽ അടിയന്തര നടപടി', 'ഡോക്ടറെ കാണേണ്ട ലക്ഷണങ്ങൾ']
    }
  },

  labor: {
    'en-US': {
      answer: `Preparing for labor gives you tremendous confidence. Understanding the difference between practice contractions (Braxton Hicks) and real labor is key.\n\n✨ **True Labor vs. Braxton Hicks:**\n• **Braxton Hicks:** Irregular, do not increase in intensity, and fade away with a change of position or drinking a warm glass of water.\n• **True Labor:** Progressively stronger, longer, and closer together, felt starting in the lower back and wrapping tightly around the front.\n\n🎯 **The 5-1-1 Rule for Hospital Departure:**\n• Contractions occur every **5 minutes** apart (timed from start of one to start of next)\n• Each contraction lasts at least **1 full minute**\n• This consistent pattern continues for at least **1 uninterrupted hour**\n\n🚨 **Head to the hospital immediately if:**\n• Your water breaks (especially if clear, green, or brown meconium fluid)\n• You experience bright red vaginal bleeding\n• You feel intense, unrelenting continuous abdominal pain`,
      followUps: ['What are the stages of labor?', 'What does losing the mucus plug look like?', 'Partner comfort techniques during surges']
    },
    'kn-IN': {
      answer: `ಹೆರಿಗೆ ನೋವು ಆರಂಭವಾಗುವುದನ್ನು ಗುರುತಿಸುವುದು ಪ್ರತಿಯೊಬ್ಬ ಗರ್ಭಿಣಿ ಮತ್ತು ಸಂಗಾತಿಗೆ ಮುಖ್ಯವಾಗಿದೆ.\n\n✨ **೫-೧-೧ ಸುವರ್ಣ ನಿಯಮ:**\n• ನೋವು ಪ್ರತಿ **೫ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ** ಬರುತ್ತಿರಬೇಕು.\n• ಪ್ರತಿ ನೋವು ಕನಿಷ್ಠ **೧ ನಿಮಿಷ ಕಾಲ** ಇರಬೇಕು.\n• ಈ ಸ್ಥಿತಿಯು ಸತತವಾಗಿ **೧ ಗಂಟೆಯವರೆಗೆ** ಮುಂದುವರಿದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ತೆರಳಿ!\n\n⚠️ ಉದೆ ನೀರು ಒಡೆದರೆ ಅಥವಾ ರಕ್ತಸ್ರಾವವಾದರೆ ಕ್ಷಣವೂ ತಡಮಾಡದೆ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ.`,
      followUps: ['ನಕಲಿ ನೋವು ಮತ್ತು ನೈಜ ನೋವಿನ ವ್ಯತ್ಯಾಸ', 'ಉದೆ ನೀರು ಒಡೆದರೆ ಏನು ಮಾಡಬೇಕು?', 'ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯುವ ಸಮಯ']
    },
    'hi-IN': {
      answer: `सच्ची प्रसव पीड़ा (Labor) और झूठे दर्द (Braxton Hicks) में अंतर समझना बहुत आवश्यक है।\n\n✨ **अस्पताल जाने का 5-1-1 नियम:**\n• संकुचन हर **5 मिनट** के अंतराल पर आएं\n• प्रत्येक संकुचन कम से कम **1 मिनट** तक रहे\n• यह क्रम लगातार **1 घंटे** तक बना रहे\n\n⚠️ यदि पानी की थैली फट जाए, हरा या भूरा तरल निकले, या ब्लीडिंग हो, तो बिना देर किए तुरंत अस्पताल पहुंचें।`,
      followUps: ['लेबर पेन के शुरुआती लक्षण', 'पानी की थैली फटने पर क्या करें?', 'प्रसव के दौरान सांस लेने की तकनीक']
    },
    'ta-IN': {
      answer: `உண்மையான பிரசவ வலியை அடையாளம் காண்பதற்கான வழிமுறைகள்:\n\n✨ **5-1-1 பொன்விதி:**\n• ஒவ்வொரு **5 நிமிடத்திற்கும் ஒருமுறை** சுருக்கங்கள் வருதல்\n• ஒவ்வொரு வலியும் குறைந்தது **1 நிமிடம்** நீடித்தல்\n• தொடர்ந்து **1 மணி நேரம்** இந்த நிலை நீடித்தால் உடனே மருத்துவமனைக்குச் செல்லவும்!\n\n⚠️ பனிக்குட நீர் உடைந்தால் தாமதிக்காமல் கிளம்பவும்.`,
      followUps: ['பிரசவ வலி ஆரம்ப அறிகுறிகள்', 'பனிக்குடம் உடைந்தால் செய்ய வேண்டியவை', 'மருத்துவமனை செல்லும் நேரம்']
    },
    'te-IN': {
      answer: `కాన్పు నొప్పులను గుర్తించడానికి 5-1-1 నియమం పాటించండి.\n\n✨ **5-1-1 నియమం:**\n• ప్రతి **5 నిమిషాలకు ఒకసారి** నొప్పులు రావడం\n• ప్రతి నొప్పి కనీసం **1 నిమిషం** పాటు ఉండటం\n• వరుసగా **1 గంట** పాటు ఇలా జరిగితే వెంటనే ఆసుపత్రికి వెళ్ళండి!\n\n⚠️ ఉమ్మనీరు పగిలినా లేదా బ్లీడింగ్ అయినా వెంటనే బయలుదేరండి.`,
      followUps: ['కాన్పు నొప్పుల లక్షణాలు', 'ఉమ్మనీరు పగిలితే జాగ్రత్తలు', 'ఆసుపత్రికి వెళ్ళే సమయం']
    },
    'ml-IN': {
      answer: `യഥാർത്ഥ പ്രസവവേദന തിരിച്ചറിയാൻ 5-1-1 നിയമം സഹായിക്കും.\n\n✨ **5-1-1 സുവർണ്ണ നിയമം:**\n• വേദന ഓരോ **5 മിനിറ്റിലും** വരിക\n• വേദന **1 മിനിറ്റ്** നീണ്ടുനിൽക്കുക\n• ഇത് തുടർച്ചയായി **1 മണിക്കൂർ** നീണ്ടുനിന്നാൽ ഉടൻ ആശുപത്രിയിലേക്ക് പോകുക!\n\n⚠️ പനിനീർ പൊട്ടിയാൽ ഒട്ടും സമയം കളയാതെ ആശുപത്രിയിൽ എത്തുക.`,
      followUps: ['പ്രസവ ലക്ഷണങ്ങൾ', 'അമ്നിയോട്ടിക് ദ്രാവകം പൊട്ടിയാൽ', 'ആശുപത്രിയിലേക്ക് പോകേണ്ട സമയം']
    }
  },

  hospitalbag: {
    'en-US': {
      answer: `Pack your hospital bag by **Week 35** so you feel completely prepared when labor begins.\n\n✨ **Essential Checklist:**\n• **For Mother:** Prenatal medical file binder, ID & insurance cards, 2 front-opening nursing nightgowns, maternity pads (heavy flow), high-waist disposable cotton briefs, warm non-skid socks, lip balm, and an extra-long 10ft phone charger.\n• **For Baby:** 3 kimono-style organic cotton onesies, 2 swaddles (muslin/cotton), newborn diapers, water wipes, mittens, knit beanie cap, and an approved infant car seat installed in vehicle.\n• **For Partner:** Snacks (nuts, energy bars), change of clothes, camera, toiletries, and emergency contact list.`,
      followUps: ['When should the car seat be installed?', 'What documents are required for admission?', 'Best snacks for labor']
    },
    'kn-IN': {
      answer: `೩೫ನೇ ವಾರಕ್ಕೆ ಆಸ್ಪತ್ರೆ ಬ್ಯಾಗ್ ಸಿದ್ಧಪಡಿಸಿಟ್ಟುಕೊಳ್ಳುವುದು ಅತ್ಯಗತ್ಯ.\n\n✨ **ಮುಖ್ಯ ಸಾಮಗ್ರಿಗಳು:**\n• **ತಾಯಿಗಾಗಿ:** ಆಸ್ಪತ್ರೆ ದಾಖಲೆಗಳು, ಸಡಿಲವಾದ ಕಾಟನ್ ನೈಟಿಗಳು, ಹೆರಿಗೆ ಪ್ಯಾಡ್‌ಗಳು, ಬೆಚ್ಚಗಿನ ಸಾಕ್ಸ್, ಫೋನ್ ಚಾರ್ಜರ್.\n• **ಮಗುವಿಗಾಗಿ:** ನವಜಾತ ಶಿಶುವಿನ ಬಟ್ಟೆಗಳು, ಮೃದುವಾದ ಹೊದಿಕೆ, ಡೈಪರ್‌ಗಳು, ಬೇಬಿ ವೈಪ್ಸ್, ಟೋಪಿ.\n• **ಸಂಗಾತಿಗಾಗಿ:** ಸ್ನ್ಯಾಕ್ಸ್, ನೀರಿನ ಬಾಟಲ್, ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು.`,
      followUps: ['ಆಸ್ಪತ್ರೆಗೆ ಬೇಕಾಗುವ ಮುಖ್ಯ ದಾಖಲೆಗಳು', 'ಕಾರಿನಲ್ಲಿ ಬೇಬಿ ಸೀಟ್ ಬಳಕೆ', 'ಹೆರಿಗೆ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ']
    },
    'hi-IN': {
      answer: `35वें हफ्ते तक हॉस्पिटल बैग पैक कर लेना सबसे समझदारी भरा कदम है।\n\n✨ **ज़रूरी चेकलिस्ट:**\n• **माँ के लिए:** सभी मेडिकल फाइल्स और आईडी, 2 ढीले फीडिंग गाउन, मैटरनिटी पैड्स, सूती अंडरवियर, मोजे, लिप बाम, लंबा चार्जर।\n• **शिशु के लिए:** 3 सूती कपड़े, मुलायम लपेटने की चादर (Swaddle), नवजात डायपर, वाइप्स, टोपी और दस्ताने।\n• **पार्टनर के लिए:** स्नैक्स, कपड़े, जरूरी फोन नंबर।`,
      followUps: ['हॉस्पिटल बैग में क्या रखें?', 'अस्पताल के जरूरी दस्तावेज', 'शिशु के कपड़े और देखभाल']
    },
    'ta-IN': {
      answer: `35வது வாரத்தில் மருத்துவமனை பையை தயார் செய்து வைப்பது மன அமைதி தரும்.\n\n✨ **முக்கிய பொருட்கள்:**\n• **தாய்க்கு:** மருத்துவ ஆவணங்கள், தளர்வான பருத்தி உடைகள், மகப்பேறு பேடுகள், கம்பளி சாக்ஸ், ஃபோன் சார்ஜர்.\n• **குழந்தைக்கு:** பருத்தி உடைகள் (3 செட்), தொப்பி, கையுறைகள், மென்மையான போர்வை, டயப்பர்கள்.\n• **துணைவருக்கு:** தின்பண்டங்கள், தண்ணீர் பாட்டில், அவசர எண்கள்.`,
      followUps: ['மருத்துவமனை பை பட்டியல்', 'குழந்தைக்கான ஆடைகள்', 'அவசர ஆவணங்கள்']
    },
    'te-IN': {
      answer: `35వ వారానికల్లా హాస్పిటల్ బ్యాగ్ సిద్ధం చేసుకోవడం చాలా మంచిది.\n\n✨ **ముఖ్యమైన వస్తువులు:**\n• **తల్లి కోసం:** మెడికల్ రిపోర్టులు, లూజ్ కాటన్ గౌన్లు, ప్రసవానంతర ప్యాడ్లు, సాక్స్, ఫోన్ ఛార్జర్.\n• **బిడ్డ కోసం:** కాటన్ బట్టలు, టోపీ, గ్లౌవ్స్, మృదువైన దుప్పటి, డైపర్లు.\n• **భాగస్వామి కోసం:** స్నాక్స్, వాటర్ బాటిల్, అత్యవసర ఫోన్ నంబర్లు.`,
      followUps: ['హాస్పిటల్ బ్యాగ్ చెక్‌లిస్ట్', 'కావలసిన పత్రాలు', 'శిశువు సంరక్షణ వస్తువులు']
    },
    'ml-IN': {
      answer: `35-ാം ആഴ്ചയോടെ ഹോസ്പിറ്റൽ ബാഗ് തയ്യാറാക്കി വയ്ക്കുന്നത് മനസ്സിന് സമാധാനം നൽകും.\n\n✨ **പ്രധാന വസ്തുക്കൾ:**\n• **അമ്മയ്ക്ക്:** മെഡിക്കൽ രേഖകൾ, അയഞ്ഞ കോട്ടൺ വസ്ത്രങ്ങൾ, മെറ്റേണിറ്റി പാഡുകൾ, സോക്സ്, ഫോൺ ചാർജർ.\n• **കുഞ്ഞിന്:** കോട്ടൺ വസ്ത്രങ്ങൾ, തൊപ്പി, കയ്യുറകൾ, മൃദുവായ പുതപ്പ്, ഡയപ്പർ.\n• **പങ്കാളിക്ക്:** ലഘുഭക്ഷണം, കുടിവെള്ളം, അത്യാവശ്യ ഫോൺ നമ്പറുകൾ.`,
      followUps: ['ഹോസ്പിറ്റൽ ബാഗ് ലിസ്റ്റ്', 'ആശുപത്രിയിൽ വേണ്ട രേഖകൾ', 'കുഞ്ഞിനുള്ള സാധനങ്ങൾ']
    }
  },

  breastfeeding: {
    'en-US': {
      answer: `Breastfeeding is a learned skill for both mother and baby. Patience, skin-to-skin contact, and proper positioning make all the difference.\n\n✨ **Foundations for Successful Nursing:**\n• **The Golden Hour:** Initiate skin-to-skin contact within the first hour of birth. Your newborn’s instinctual stepping and crawling reflexes help them latch naturally.\n• **Colostrum (Liquid Gold):** Your thick, yellowish first milk is rich in antibodies (IgA) and white blood cells that coat baby's gut. A newborn's stomach is only the size of a marble (5–7ml), so small frequent drops are perfect!\n• **Deep Latch Technique:** Point your nipple toward baby's nose, wait for a wide yawn, and bring baby quickly to the breast (not breast to baby). Baby's chin should indent the breast and the lower lip should be flanged outward.\n• **Feeding Frequency:** Nurse on demand, usually 8–12 times per 24 hours (every 2–3 hours).`,
      followUps: ['How to prevent sore or cracked nipples', 'How to know baby is getting enough milk', 'Safe breast milk storage guidelines']
    },
    'kn-IN': {
      answer: `ನವಜಾತ ಶಿಶುವಿಗೆ ಎದೆಹಾಲುಣಿಸುವ ಸುವರ್ಣ ನಿಯಮಗಳು:\n\n✨ **ಮುಖ್ಯ ಸಲಹೆಗಳು:**\n• **ಮೊದಲ ಗಂಟೆ (Golden Hour):** ಜನನದ ಮೊದಲ ಗಂಟೆಯಲ್ಲೇ ಮಗುವನ್ನು ಎದೆಯ ಮೇಲಿಟ್ಟು ಹಾಲುಣಿಸಲು ಪ್ರಯತ್ನಿಸಿ.\n• **ಗಿಣ್ಣುಹಾಲು (Colostrum):** ಮೊದಲ ೨-೩ ದಿನ ಬರುವ ಗಿಣ್ಣುಹಾಲು ಮಗುವಿನ ರೋಗನಿರೋಧಕ ಶಕ್ತಿಗೆ ಅಮೃತ ಸಮಾನ.\n• **ಸರಿಯಾದ ಲ್ಯಾಚಿಂಗ್:** ಮಗು ಸಂಪೂರ್ಣವಾಗಿ ಬಾಯಿ ತೆರೆದು ಮೊಲೆತೊಟ್ಟಿನ ಕಪ್ಪು ಭಾಗವನ್ನು ಬಾಯೊಳಗೆ ತೆಗೆದುಕೊಳ್ಳಬೇಕು.`,
      followUps: ['ಹಾಲು ಸಾಕಾಗುತ್ತಿದೆಯೇ ಎಂದು ತಿಳಿಯುವುದು ಹೇಗೆ?', 'ಮೊಲೆತೊಟ್ಟು ನೋವಾಗದಂತೆ ತಡೆಯುವುದು ಹೇಗೆ?', 'ಎದೆಹಾಲು ಹೆಚ್ಚಿಸುವ ಆಹಾರಗಳು']
    },
    'hi-IN': {
      answer: `स्तनपान माँ और शिशु दोनों के लिए एक सुंदर अनुभव है।\n\n✨ **सफल स्तनपान के नियम:**\n• **गोल्डन ऑवर:** जन्म के पहले घंटे में ही शिशु को सीने से लगाकर पहला दूध पिलाएं।\n• **कोलोस्ट्रम (पहला गाढ़ा दूध):** यह शिशु का पहला प्राकृतिक टीका है जो उसे बीमारियों से बचाता है।\n• **सही लैच (पकड़):** शिशु का मुंह पूरा खुला होना चाहिए और निप्पल का निचला हिस्सा शिशु के मुंह में होना चाहिए।\n• हर 2 से 3 घंटे में शिशु को दूध पिलाएं।`,
      followUps: ['शिशु को दूध पर्याप्त मिल रहा है कैसे जानें?', 'निप्पल के दर्द से कैसे बचें?', 'दूध बढ़ाने वाले घरेलू उपाय']
    },
    'ta-IN': {
      answer: `பிறந்த குழந்தைக்கு தாய்ப்பால் கொடுப்பதற்கான முக்கிய விதிகள்:\n\n✨ **முக்கிய குறிப்புகள்:**\n• பிறந்த முதல் மணி நேரத்திற்குள் தாய்ப்பால் கொடுக்க தொடங்குங்கள்.\n• முதல் சில நாட்கள் சுரக்கும் சீம்பால் குழந்தையின் நோய் எதிர்ப்புச் சக்திக்கு மிக அவசியமானது.\n• குழந்தையின் வாய் முழுமையாகத் திறந்து முலைக்காம்பை சரியாகப் பிடிக்க வேண்டும்.`,
      followUps: ['தாய்ப்பால் சுரப்பை அதிகரிக்க வழிகள்', 'மார்பக வலியைத் தவிர்ப்பது எப்படி?', 'தாய்ப்பால் போதுமானதா என அறிய']
    },
    'te-IN': {
      answer: `నవజాత శిశువుకు తల్లిపాలు ఇవ్వడం ఎంతో ముఖ్యం.\n\n✨ **ముఖ్యమైన సూచనలు:**\n• పుట్టిన మొదటి గంటలోనే పాలు ఇవ్వడానికి ప్రయత్నించండి.\n• మొదటి ముర్రుపాలు బిడ్డకు అత్యుత్తమ రోగనిరోధక శక్తినిస్తాయి.\n• సరైన పద్ధతిలో పాలు ఇస్తే రొమ్ము నొప్పి రాదు.`,
      followUps: ['తల్లిపాలు పెరగడానికి ఆహారాలు', 'నొప్పి రాకుండా పాలు ఇచ్చే విధానం', 'వైద్యుని సలహాలు']
    },
    'ml-IN': {
      answer: `നവജാതശിശുവിന് മുലപ്പാൽ കൊടുക്കുന്നതിനുള്ള പ്രധാന നിയമങ്ങൾ:\n\n✨ **പ്രധാന കാര്യങ്ങൾ:**\n• പ്രസവിച്ച് ആദ്യ മണിക്കൂറിൽ തന്നെ കുഞ്ഞിന് മുലപ്പാൽ കൊടുക്കുക.\n• ആദ്യ ദിവസങ്ങളിലെ കൊളസ്ട്രം കുഞ്ഞിന് രോഗപ്രതിരോധ ശേഷി നൽകുന്നു.\n• കുഞ്ഞിന്റെ വായ പൂർണ്ണമായി തുറന്ന് ശരിയായ രീതിയിൽ മുലയൂട്ടുക.`,
      followUps: ['മുലപ്പാൽ വർദ്ധിക്കാനുള്ള വഴികൾ', 'മുലക്കണ്ണ് വേദന മാറ്റാൻ', 'കുഞ്ഞിന് പാൽ തികയുന്നുണ്ടോ']
    }
  },

  backpain: {
    'en-US': {
      answer: `Lower back pain and pelvic girdle tightness affect over 65% of expecting mothers as the center of gravity shifts forward and the hormone **relaxin** softens pelvic joints.\n\n✨ **Proven, Safe Relief Strategies:**\n• **Side-Sleeping Support:** Sleep strictly on your side with a supportive pillow between your knees and under your belly to keep your pelvis aligned.\n• **Gentle Prenatal Stretches:** Practice gentle Cat-Cow yoga poses, pelvic tilts, and child's pose on hands and knees to decompress the lumbar spine.\n• **Supportive Maternity Band:** A light pelvic support band gently lifts belly weight off the pubic bone and lower back.\n• **Warm Compress:** Apply a warm heating pad (not scalding hot) to your lower back for 15–20 minutes.\n• **Avoid Flat Shoes:** Wear cushioned footwear with mild arch support; avoid both high heels and completely flat ballet flats.\n\n⚠️ *When to consult your doctor:* If the pain is sharp and accompanied by fever, pain during urination, or radiates rhythmically like contractions.`,
      followUps: ['How to do gentle Cat-Cow stretch', 'Best pregnancy pillow positions', 'Signs of pelvic girdle pain (PGP)']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಹೊಟ್ಟೆ ಬೆಳೆದಂತೆ ಮತ್ತು 'ರಿಲ್ಯಾಕ್ಸಿನ್' ಹಾರ್ಮೋನ್‌ನಿಂದ ಕೀಲುಗಳು ಸಡಿಲವಾಗುವುದರಿಂದ ಕೆಳಬೆನ್ನು ನೋವು ಬರುವುದು ಸಾಮಾನ್ಯ.\n\n✨ **ನೋವು ನಿವಾರಣೆಗೆ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ ಉಪಾಯಗಳು:**\n• **ಮಲಗುವ ಭಂಗಿ:** ಮಲಗುವಾಗ ಮೊಣಕಾಲುಗಳ ನಡುವೆ ಮತ್ತು ಹೊಟ್ಟೆಯ ಕೆಳಗೆ ಮೆತ್ತನೆಯ ದಿಂಬನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.\n• **ಲಘು ವ್ಯಾಯಾಮ:** ಕ್ಯಾಟ್-ಕೌ (Cat-Cow) ಯೋಗಾಸನ ಮತ್ತು ನಿಧಾನವಾದ ನಡಿಗೆ ಬೆನ್ನಿನ ಸ್ನಾಯುಗಳಿಗೆ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.\n• **ಬಿಸಿ ನೀರಿನ ಶಾಖ:** ಬೆನ್ನಿಗೆ ಬೆಚ್ಚನೆಯ ನೀರಿನ ಬ್ಯಾಗ್‌ನಿಂದ ೧೫ ನಿಮಿಷಗಳ ಕಾಲ ಶಾಖ ಕೊಡಿ.\n• ಭಾರವಾದ ವಸ್ತುಗಳನ್ನು ಎತ್ತಬೇಡಿ ಮತ್ತು ಕುಳಿತುಕೊಳ್ಳುವಾಗ ಬೆನ್ನಿಗೆ ದಿಂಬಿನ ಆಸರೆ ಇರಲಿ.`,
      followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ಸುರಕ್ಷಿತ ಯೋಗಾಸನಗಳು', 'ಪೆಲ್ವಿಕ್ ಬೆಲ್ಟ್ ಬಳಕೆ ಹೇಗೆ?', 'ಯಾವಾಗ ವೈದ್ಯರನ್ನು ಕಾಣಬೇಕು?']
    },
    'hi-IN': {
      answer: `गर्भावस्था में जैसे-जैसे गर्भस्थ शिशु का वजन बढ़ता है, रीढ़ की हड्डी पर दबाव पड़ने और 'रिलैक्सिन' हार्मोन के कारण पीठ और कमर में दर्द होना आम बात है।\n\n✨ **सुरक्षित और असरदार राहत के उपाय:**\n• **सोने का सही तरीका:** हमेशा करवट लेकर सोएं और दोनों घुटनों के बीच तथा पेट के नीचे तकिया (Pregnancy Pillow) रखें।\n• **हल्की स्ट्रेचिंग:** कैट-काउ पोज और पेल्विक टिल्ट जैसे हल्के योगासन रीढ़ की हड्डी का तनाव कम करते हैं।\n• **सिकाई:** पीठ के निचले हिस्से पर गर्म पानी की थैली से 15-20 मिनट सिकाई करें।\n• **आरामदायक जूते:** बिना हील वाले, आर्च सपोर्ट वाले आरामदायक जूते पहनें।`,
      followUps: ['पीठ दर्द के लिए योग', 'प्रेगनेंसी पिलो कैसे इस्तेमाल करें', 'पेल्विक गर्डल पेन के लक्षण']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் உடல் எடை அதிகரிப்பதாலும், ஹார்மோன் மாற்றங்களாலும் கீழ் முதுகுவலி ஏற்படுவது வழக்கமான ஒன்றாகும்.\n\n✨ **முதுகுவலியைக் குறைக்கும் எளிய வழிகள்:**\n• ஒருக்களித்துப் படுத்து, கால்களுக்கு இடையே தலையணை வைத்துக் கொள்ளவும்.\n• மென்மையான நடைபயிற்சி மற்றும் பூனை-பசு (Cat-Cow) யோகாசனம் செய்யவும்.\n• மிதமான சுடுநீர் ஒத்தடம் கொடுக்கலாம்.\n• அதிக எடையைத் தூக்குவதைத் தவிர்க்கவும்.`,
      followUps: ['முதுகுவலிக்கான யோகா', 'கர்ப்பகால தலையணை அமைப்புகள்', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `గర్భధారణలో బరువు పెరగడం మరియు హార్మోన్ల మార్పుల వల్ల నడుము నొప్పి రావడం చాలా సహజం.\n\n✨ **ఉపశమన చర్యలు:**\n• పడుకునేటప్పుడు కాళ్ళ మధ్యలో దిండు పెట్టుకుని పడుకోండి.\n• తేలికపాటి స్ట్రెచింగ్ మరియు పిల్లి-ఆవు (Cat-Cow) యోగాసనం నడుము కండరాలను సడలిస్తుంది.\n• గోరువెచ్చని నీటితో కాపడం పెట్టండి.\n• ఎక్కువ సమయం ఒకే చోట నిలబడటం లేదా కూర్చోవడం చేయవద్దు.`,
      followUps: ['నడుము నొప్పికి వ్యాయామాలు', 'నిద్రపోయే భంగిమలు', 'డాక్టర్ సలహాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ നടുവേദന ഒഴിവാക്കാൻ ചില ലളിതമായ കാര്യങ്ങൾ ശ്രദ്ധിക്കാം.\n\n✨ **പ്രധാന പരിഹാരങ്ങൾ:**\n• ഉറങ്ങുമ്പോൾ കാൽമുട്ടുകൾക്കിടയിൽ തലയിണ വച്ചു ചരിഞ്ഞു കിടക്കുക.\n• ലളിതമായ സ്ട്രെച്ചിംഗ് വ്യായാമങ്ങളും നടത്തവും ശീലമാക്കുക.\n• ചെറുചൂടുള്ള വെള്ളം കൊണ്ട് നടുവിൽ തടവുക.\n• കനമുള്ള സാധനങ്ങൾ എടുക്കുന്നത് പൂർണ്ണമായും ഒഴിവാക്കുക.`,
      followUps: ['നടുവേദനയ്ക്കുള്ള യോഗ', 'ഗർഭകാല ഉറക്ക രീതികൾ', 'ഡോക്ടറെ കാണേണ്ട ലക്ഷണങ്ങൾ']
    }
  },

  sleep: {
    'en-US': {
      answer: `Getting restful sleep during pregnancy is essential for your immune health and baby’s growth, though belly size and frequent urination can make it challenging.\n\n✨ **The Gold Standard Sleep Guidelines:**\n• **Sleep on Your Left Side (SOS):** Sleeping on your left optimizes blood flow through the inferior vena cava to your placenta and kidneys, maximizing oxygen and nutrient delivery to baby.\n• **The 3-Pillow Technique:** Place one pillow between your knees, one wedge under your belly, and one behind your back to prevent rolling flat onto your spine.\n• **Evening Fluid Tapering:** Drink the majority of your 8–10 glasses of water before 7:00 PM; sip only small amounts before bed to reduce midnight bathroom trips.\n• **Wind-Down Ritual:** Avoid screens 45 minutes before sleep; try warm chamomile or almond milk with a pinch of cardamom, and practice 5-minute deep belly breathing.`,
      followUps: ['What if I accidentally wake up on my back?', 'Best pregnancy pillows for side sleeping', 'Safe relaxation soundscapes in BloomNest']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಉತ್ತಮ ನಿದ್ರೆ ತಾಯಿ ಮತ್ತು ಮಗುವಿನ ಆರೋಗ್ಯಕ್ಕೆ ಅತ್ಯಗತ್ಯ.\n\n✨ **ಉತ್ತಮ ನಿದ್ರೆಯ ನಿಯಮಗಳು:**\n• **ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿ:** ಎಡಕ್ಕೆ ಮಲಗುವುದರಿಂದ ಜರಾಯು (Placenta) ಮತ್ತು ಮಗುವಿಗೆ ರಕ್ತ ಸಂಚಾರ ಅತ್ಯುತ್ತಮವಾಗಿರುತ್ತದೆ.\n• **ದಿಂಬುಗಳ ಬೆಂಬಲ:** ಕಾಲುಗಳ ನಡುವೆ ಮತ್ತು ಬೆನ್ನಿನ ಹಿಂದೆ ದಿಂಬು ಇಟ್ಟುಕೊಂಡು ಮಲಗಿ.\n• **ರಾತ್ರಿಯ ಆಹಾರ:** ಮಲಗುವ ೨ ಗಂಟೆ ಮೊದಲೇ ಲಘು ಊಟ ಮಾಡಿ, ಸಂಜೆ ನಂತರ ಹೆಚ್ಚು ನೀರು ಕುಡಿಯುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ.\n• ಮಲಗುವ ಮುನ್ನ ಬಿಸಿ ಹಾಲಿಗೆ ಸ್ವಲ್ಪ ಏಲಕ್ಕಿ ಹಾಕಿ ಕುಡಿಯುವುದು ಮನಸ್ಸನ್ನು ಶಾಂತಗೊಳಿಸುತ್ತದೆ.`,
      followUps: ['ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗುವುದು ತಪ್ಪೇ?', 'ಗರ್ಭಿಣಿಯರಿಗೆ ಸಂಗೀತ ಚಿಕಿತ್ಸೆ', 'ನಿದ್ರಾಹೀನತೆಗೆ ಪರಿಹಾರ']
    },
    'hi-IN': {
      answer: `गर्भावस्था में अच्छी नींद आपके स्वास्थ्य और शिशु के विकास के लिए बहुत जरूरी है।\n\n✨ **सोने के सर्वोत्तम नियम:**\n• **बाईं करवट (Left Side Sleeping):** बाईं करवट सोने से गर्भाशय और शिशु को रक्त और ऑक्सीजन का प्रवाह सबसे अच्छा मिलता है।\n• **तकियों का सहारा:** घुटनों के बीच और पीठ के पीछे तकिया रखें ताकि पेट पर खिंचाव न पड़े।\n• **शाम के बाद तरल पदार्थ सीमित करें:** दिन में खूब पानी पिएं, लेकिन रात को बार-बार पेशाब जाने से बचने के लिए सोने से पहले कम पिएं।\n• सोने से पहले गुनगुना दूध पिएं और फोन/स्क्रीन से 45 मिनट पहले दूर रहें।`,
      followUps: ['पीठ के बल सोने के नुकसान', 'रात को अच्छी नींद के उपाय', 'शांत संगीत और ध्यान']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் இடது பக்கமாக ஒருக்களித்துப் படுப்பது (Left Side Sleeping) தாய்க்கும் குழந்தைக்கும் ரத்த ஓட்டத்தை அதிகரிக்கும்.\n\n✨ **நல்ல தூக்கத்திற்கான வழிகள்:**\n• கால்களுக்கு நடுவில் தலையணை வைத்து படுக்கவும்.\n• இரவு உணவை எளிமையாகவும், தூங்குவதற்கு 2 மணி நேரம் முன்பும் உட்கொள்ளவும்.\n• படுக்கைக்குச் செல்லும் முன் வெதுவெதுப்பான பால் அருந்துவது நல்லது.`,
      followUps: ['தூக்கமின்மை தீர்வுகள்', 'கர்ப்பகால தலையணைகள்', 'தியானம் மற்றும் இசை']
    },
    'te-IN': {
      answer: `గర్భధారణలో ఎడమ వైపు తిరిగి పడుకోవడం వల్ల మాయ మరియు శిశువుకు రక్తప్రసరణ బాగా జరుగుతుంది.\n\n✨ **మంచి నిద్ర కోసం చిట్కాలు:**\n• మోకాళ్ళ మధ్య దిండు పెట్టుకుని పడుకోవడం వల్ల నడుముపై ఒత్తిడి తగ్గుతుంది.\n• రాత్రి పడుకునే ముందు గోరువెచ్చని పాలు తాగడం మంచిది.\n• పడుకునే ముందు మొబైల్ లేదా టీవీ చూడటం తగ్గించండి.`,
      followUps: ['నిద్రలేమి సమస్యకు చిట్కాలు', 'గర్భధారణ దిండ్లు', 'రిలాక్సేషన్ పద్ధతులు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്ത് ഇടതുവശം ചരിഞ്ഞുറങ്ങുന്നത് കുഞ്ഞിന് കൂടുതൽ രക്തവും ഓക്സിജനും ലഭിക്കാൻ സഹായിക്കുന്നു.\n\n✨ **നല്ല ഉറക്കത്തിനുള്ള വഴികൾ:**\n• കാലുകൾക്കിടയിൽ തലയിണ വച്ചുറങ്ങുക.\n• രാത്രി ലഘുവായ ഭക്ഷണം കഴിക്കുക.\n• ഉറങ്ങുന്നതിനു മുൻപ് ചെറുചൂടുള്ള പാൽ കുടിക്കുന്നത് നല്ലതാണ്.`,
      followUps: ['ഉറക്കക്കുറവ് പരിഹാരങ്ങൾ', 'റിലാക്സേഷൻ സംഗീതം', 'ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ']
    }
  },

  scans: {
    'en-US': {
      answer: `Prenatal ultrasound scans are joyful windows into your baby’s growth, anatomical structure, and gestational health.\n\n✨ **Routine Clinical Ultrasound Timeline:**\n• **8–12 Weeks (Dating & Viability Scan):** Confirms gestational sac, heartbeat, accurate due date (EDD), and single vs twin pregnancy.\n• **11–13 Weeks (NT Scan & Dual Marker):** Measures nuchal translucency fluid at back of baby's neck to screen for chromosomal conditions.\n• **18–22 Weeks (TIFFA / Level-2 Anomaly Scan):** A comprehensive 30–45 minute scan checking brain ventricles, 4-chamber heart, kidneys, spine, limbs, facial features, amniotic fluid volume, and placenta position.\n• **28–32 Weeks (Growth & Well-being Scan):** Checks estimated fetal weight (EFW), baby growth percentiles, amniotic fluid index (AFI), and umbilical artery Doppler blood flow.\n• **36+ Weeks (Presentation Scan):** Confirms cephalic (head-down) position for delivery.\n\n💡 *Tip:* Drink 2 glasses of water 45 minutes before abdominal scans unless instructed otherwise by your radiologist.`,
      followUps: ['What happens in Level 2 Anomaly scan?', 'Normal amniotic fluid index (AFI)', 'How to prepare for ultrasound visit']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯ ಸ್ಕ್ಯಾನಿಂಗ್‌ಗಳು ಮಗುವಿನ ಬೆಳವಣಿಗೆ ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ತಿಳಿಯಲು ಅತ್ಯಂತ ಮುಖ್ಯವಾಗಿವೆ.\n\n✨ **ಪ್ರಮುಖ ಸ್ಕ್ಯಾನ್‌ಗಳ ವಿವರ:**\n• **೮-೧೨ ವಾರಗಳು (Dating Scan):** ಮಗುವಿನ ಹೃದಯ ಬಡಿತ ಮತ್ತು ಸರಿಯಾದ ಹೆರಿಗೆ ದಿನಾಂಕವನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.\n• **೧೮-೨೨ ವಾರಗಳು (Anomaly / TIFFA Scan):** ಮಗುವಿನ ಮೆದುಳು, ಹೃದಯ, ಮೂಳೆಗಳು, ಕಿಡ್ನಿ ಮತ್ತು ಅಂಗಾಂಗಗಳ ಸಮಗ್ರ ತಪಾಸಣೆ.\n• **೨೮-೩೪ ವಾರಗಳು (Growth Scan):** ಮಗುವಿನ ತೂಕ, ಉಮ್ಮಳದ ನೀರು (Amniotic Fluid) ಮತ್ತು ರಕ್ತ ಸಂಚಾರದ ಪರೀಕ್ಷೆ.`,
      followUps: ['ಟಿಫಾ ಸ್ಕ್ಯಾನ್ ವಿವರಗಳು', 'ಉಮ್ಮಳದ ನೀರಿನ ಪ್ರಮಾಣ', 'ಸ್ಕ್ಯಾನ್‌ಗೆ ಮುನ್ನ ಸಿದ್ಧತೆ']
    },
    'hi-IN': {
      answer: `गर्भावस्था में अल्ट्रासाउंड स्कैन शिशु के विकास, अंगों की बनावट और स्वास्थ्य की निगरानी के लिए बहुत महत्वपूर्ण होते हैं।\n\n✨ **प्रमुख स्कैन की समय-सारणी:**\n• **8-12 हफ्ते (डेटिंग स्कैन):** धड़कन की पुष्टि और डिलीवरी की सही तारीख (EDD) तय करना।\n• **11-13 हफ्ते (NT स्कैन):** आनुवंशिक जांच और शुरुआती विकास।\n• **18-22 हफ्ते (लेवल-2 / एनोमली स्कैन):** शिशु के मस्तिष्क, हृदय, रीढ़, चेहरे और सभी अंगों की विस्तृत जांच।\n• **28-32 हफ्ते (ग्रोथ स्कैन):** शिशु का वजन, एमनियोटिक द्रव (पानी) और गर्भनाल का रक्त प्रवाह।`,
      followUps: ['एनोमली स्कैन में क्या देखा जाता है?', 'एमनियोटिक द्रव (AFI) कितना होना चाहिए?', 'अल्ट्रासाउंड की तैयारी कैसे करें']
    },
    'ta-IN': {
      answer: `கர்ப்பகால ஸ்கேன்கள் குழந்தையின் வளர்ச்சி மற்றும் உறுப்புகளின் ஆரோக்கியத்தை அறிய உதவுகிறது.\n\n✨ **முக்கிய ஸ்கேன் அட்டவணை:**\n• **8-12 வாரங்கள் (Dating Scan):** இதயத்துடிப்பு மற்றும் பிரசவ தேதி உறுதி செய்தல்.\n• **18-22 வாரங்கள் (Anomaly Scan):** குழந்தையின் உறுப்புகளின் முழுமையான வளர்ச்சி பரிசோதனை.\n• **28-32 வாரங்கள் (Growth Scan):** குழந்தையின் எடை மற்றும் பனிக்குட நீர் அளவு பரிசோதனை.`,
      followUps: ['அனோமலி ஸ்கேன் முக்கியத்துவம்', 'பனிக்குட நீர் அளவு', 'ஸ்கேன் பரிசோதனை குறிப்புகள்']
    },
    'te-IN': {
      answer: `గర్భధారణలో అల్ట్రాసౌండ్ స్కాన్లు శిశువు ఎదుగుదల మరియు అవయవ నిర్మాణాన్ని తెలుసుకోవడానికి ఎంతో ముఖ్యం.\n\n✨ **ముఖ్యమైన స్కాన్ల వివరాలు:**\n• **8-12 వారాలు:** హృదయ స్పందన మరియు ఖచ్చితమైన డెలివరీ తేదీ నిర్ధారణ.\n• **18-22 వారాలు (అనామలీ స్కాన్):** శిశువు శరీర అవయవాల సమగ్ర పరిశీలన.\n• **28-32 వారాలు:** శిశువు బరువు మరియు ఉమ్మనీరు స్థాయిల తనిఖీ.`,
      followUps: ['అనామలీ స్కాన్ వివరాలు', 'ఉమ్మనీరు ఎంత ఉండాలి?', 'స్కాన్ ముందు జాగ్రత్తలు']
    },
    'ml-IN': {
      answer: `ഗർഭസ്ഥശിശുവിന്റെ വളർച്ച കൃത്യമായി നിരീക്ഷിക്കാൻ സ്കാനിംഗുകൾ അത്യാവശ്യമാണ്.\n\n✨ **പ്രധാന സ്കാനുകൾ:**\n• **8-12 ആഴ്ചകൾ:** കുഞ്ഞിന്റെ ഹൃദയമിടിപ്പും കൃത്യമായ പ്രസവ തിയതിയും അറിയാൻ.\n• **18-22 ആഴ്ചകൾ (അനോമലി സ്കാൻ):** ആന്തരികാവയവങ്ങളുടെ പൂർണ്ണമായ വളർച്ചാ പരിശോധന.\n• **28-32 ആഴ്ചകൾ:** കുഞ്ഞിന്റെ തൂക്കവും മറുപിള്ളയുടെ സ്ഥാനവും ഉറപ്പാക്കാൻ.`,
      followUps: ['അനോമലി സ്കാൻ വിവരങ്ങൾ', 'പനിനീരിന്റെ അളവ്', 'സ്കാനിംഗ് നിർദ്ദേശങ്ങൾ']
    }
  },

  garbhsanskar: {
    'en-US': {
      answer: `**Garbh Sanskar** is the ancient Indian science of nurturing your unborn baby's emotional, intellectual, and physical well-being through maternal positivity, classical music, and spiritual harmony.\n\n✨ **Daily Garbh Sanskar Practices:**\n• **Samvad (Baby Talks):** From Week 20 onward, your baby clearly hears external voices. Talk, sing, or read stories to your baby for 10–15 minutes daily. Partner participation strengthens bonding!\n• **Raga & Sound Therapy:** Gentle Indian classical ragas like **Raga Kalyani, Raga Yaman, or Raga Malkauns** soothe the maternal nervous system and promote peaceful fetal heart rate rhythms.\n• **Positive Reading (Satsang):** Reading uplifting stories, moral epics, or joyful literature releases endorphins that cross the placenta to nurture baby's brain cells.\n• **Mindful Breathing (Pranayama):** Practice gentle Anulom Vilom (alternate nostril breathing) and Bhramari (humming bee breath) to boost oxygenation.`,
      followUps: ['Recommended ragas for pregnancy', 'How partner can participate in Garbh Sanskar', 'Listening to Vedic chants in BloomNest']
    },
    'kn-IN': {
      answer: `**ಗರ್ಭ ಸಂಸ್ಕಾರ** ಎಂಬುದು ಗರ್ಭದಲ್ಲಿರುವ ಮಗುವಿನ ಮಾನಸಿಕ, ಬೌದ್ಧಿಕ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ವಿಕಾಸಕ್ಕಾಗಿ ಆಚರಿಸಲಾಗುವ ಪವಿತ್ರ ಭಾರತೀಯ ಸಂಸ್ಕೃತಿ.\n\n✨ **ದೈನಂದಿನ ಗರ್ಭ ಸಂಸ್ಕಾರ ಅಭ್ಯಾಸಗಳು:**\n• **ಮಗುವಿನೊಂದಿಗೆ ಸಂಭಾಷಣೆ:** ಪ್ರತಿದಿನ ಹೊಟ್ಟೆಯ ಮೇಲೆ ಕೈಯಿಟ್ಟು ಮಗುವಿನೊಂದಿಗೆ ಪ್ರೀತಿಯಿಂದ ಮಾತನಾಡಿ ಅಥವಾ ಕಥೆ ಹೇಳಿ.\n• **ಸಂಗೀತ ಶ್ರವಣ:** ಕಲ್ಯಾಣಿ, ಯಮನ್ ರಾಗಗಳು ಅಥವಾ ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತವನ್ನು ಆಲಿಸುವುದರಿಂದ ಮಗುವಿನ ಮೆದುಳಿನ ಬೆಳವಣಿಗೆ ಉತ್ತಮವಾಗುತ್ತದೆ.\n• **ಸಕಾರಾತ್ಮಕ ಚಿಂತನೆ:** ಸದಾ ಸಂತೋಷವಾಗಿರಿ, ಧಾರ್ಮಿಕ ಮತ್ತು ಸ್ಫೂರ್ತಿದಾಯಕ ಪುಸ್ತಕಗಳನ್ನು ಓದಿ.\n• **ಪ್ರಾಣಾಯಾಮ:** ನಿಧಾನವಾಗಿ ಅನುಲೋಮ-ವಿಲೋಮ ಉಸಿರಾಟದ ಅಭ್ಯಾಸ ಮಾಡಿ.`,
      followUps: ['ಗರ್ಭಿಣಿಯರಿಗೆ ರಾಗ ಚಿಕಿತ್ಸೆ', 'ಗರ್ಭ ಸಂಸ್ಕಾರದಲ್ಲಿ ಪತಿಯ ಪಾತ್ರ', 'ಮನಸ್ಸಿನ ಶಾಂತಿಗೆ ಶ್ಲೋಕಗಳು']
    },
    'hi-IN': {
      answer: `**गर्भ संस्कार** हमारे प्राचीन आयुर्वेद और संस्कृति की वह सुंदर विधा है जो गर्भ में पल रहे शिशु के बौद्धिक, मानसिक और भावनात्मक विकास को पोषित करती है।\n\n✨ **दैनिक गर्भ संस्कार के नियम:**\n• **संवाद (शिशु से बातें):** प्रतिदिन 10-15 मिनट पेट पर हाथ रखकर शिशु से प्यार से बातें करें या अच्छी कहानियां सुनाएं।\n• **मधुर संगीत (राग थेरेपी):** राग कल्याणी, राग यमन या शांत बांसुरी का संगीत सुनने से मां और शिशु दोनों को शांति मिलती है।\n• **सकारात्मक विचार:** हमेशा प्रसन्न रहें, अच्छी प्रेरणादायक पुस्तकें पढ़ें।\n• **प्राणायाम:** अनुलोम-विलोम और भ्रामरी प्राणायाम से शरीर में ऑक्सीजन का स्तर बढ़ता है।`,
      followUps: ['गर्भ संस्कार के लिए संगीत', 'गर्भ में शिशु से बात कैसे करें', 'सकारात्मक चिंतन के लाभ']
    },
    'ta-IN': {
      answer: `**கர்ப்ப சம்ஸ்காரம்** என்பது கருவில் வளரும் குழந்தையின் மன மற்றும் அறிவாற்றல் வளர்ச்சிக்கான பாரம்பரிய இந்திய மருத்துவ முறையாகும்.\n\n✨ **தினசரி பயிற்சிகள்:**\n• **குழந்தையிடம் பேசுதல்:** தினமும் 10 நிமிடங்கள் குழந்தையிடம் அன்பாகப் பேசுங்கள் அல்லது பாடல் பாடுங்கள்.\n• **இசை கேட்டல்:** மென்மையான கர்நாடக சங்கீதம் அல்லது அமைதியான ராகங்கள் கேட்பது நல்லது.\n• **நேர்மறை சிந்தனை:** நல்ல புத்தகங்களை வாசிப்பதும், மகிழ்ச்சியாக இருப்பதும் குழந்தையின் மூளை வளர்ச்சியைத் தூண்டும்.`,
      followUps: ['கர்ப்பகால இசை', 'குழந்தையோடு பேசுவது எப்படி?', 'மன அமைதி வழிகள்']
    },
    'te-IN': {
      answer: `**గర్భ సంస్కార** అనేది గర్భంలో ఉన్న శిశువు యొక్క మానసిక మరియు మేధో వికాసానికి తోడ్పడే అద్భుతమైన విధానం.\n\n✨ **రోజూ చేయవలసిన సాధనలు:**\n• **శిశువుతో మాట్లాడటం:** రోజూ కాసేపు పొట్టపై చేతులుంచి బిడ్డతో ప్రేమగా మాట్లాడండి.\n• **సంగీతం:** శాస్త్రీయ సంగీతం వినడం వల్ల ఒత్తిడి తగ్గి శిశువు చురుగ్గా మారుతుంది.\n• **మంచి పుస్తకాలు చదవడం:** సానుకూల దృక్పథం కలిగించే విషయాలు చదవండి.`,
      followUps: ['గర్భ సంస్కార సంగీతం', 'భర్త పాత్ర మరియు బాధ్యతలు', 'మనశ్శాంతి చిట్కాలు']
    },
    'ml-IN': {
      answer: `**ഗർഭ സംസ്കാരം** കുഞ്ഞിന്റെ ബുദ്ധിപരവും മാനസികവുമായ ഉന്നമനത്തിന് സഹായിക്കുന്ന പരമ്പരാഗത രീതിയാണ്.\n\n✨ **പ്രധാന കാര്യങ്ങൾ:**\n• **കുഞ്ഞിനോട് സംസാരിക്കുക:** ദിവസവും അല്പനേരം കുഞ്ഞിനോട് സംസാരിക്കുകയോ പാട്ടുപാടുകയോ ചെയ്യുക.\n• **ശാന്തമായ സംഗീതം:** രാഗങ്ങളും ശാന്തമായ സംഗീതവും കേൾക്കുക.\n• **പോസിറ്റീവ് ചിന്തകൾ:** നല്ല പുസ്തകങ്ങൾ വായിക്കുകയും സന്തോഷത്തോടെയിരിക്കുകയും ചെയ്യുക.`,
      followUps: ['ഗർഭകാല സംഗീത തെറാപ്പി', 'പങ്കാളിയുടെ പിന്തുണ', 'മനസ്സിനെ ശാന്തമാക്കാൻ']
    }
  },

  diabetes: {
    'en-US': {
      answer: `Gestational Diabetes Mellitus (GDM) occurs when pregnancy placental hormones cause insulin resistance. With proper diet, walking, and monitoring, it is completely manageable!\n\n✨ **Clinical Guidelines for Healthy Blood Sugar:**\n• **OGTT Screening Test:** Done between **24–28 weeks** using a 75g oral glucose tolerance test.\n• **Carbohydrate Quality (Low Glycemic Index):** Replace white rice and refined flour with steel-cut oats, whole ragi, brown rice, millets, quinoa, and barley.\n• **The Plate Method:** 50% non-starchy vegetables (greens, beans, cucumber), 25% protein (dal, paneer, tofu, boiled eggs), 25% complex carbs.\n• **Post-Meal Walking:** A gentle 15-minute walk after every meal helps muscles absorb glucose naturally without requiring extra insulin.\n• **Healthy Snacking:** Almonds, roasted walnuts, roasted makhana (foxnuts), or boiled sprouted chana prevent sudden sugar dips.`,
      followUps: ['Normal blood sugar ranges in pregnancy', 'Low-GI Indian meal plan', 'What happens during glucose tolerance test (OGTT)?']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯ ಮಧುಮೇಹ (Gestational Diabetes) ಹಾರ್ಮೋನ್‌ಗಳ ಬದಲಾವಣೆಯಿಂದ ಬರುತ್ತದೆ, ಆದರೆ ಸರಿಯಾದ ಆಹಾರ ಮತ್ತು ನಡಿಗೆಯಿಂದ ಇದನ್ನು ಸುಲಭವಾಗಿ ನಿಯಂತ್ರಿಸಬಹುದು.\n\n✨ **ಸಕ್ಕರೆ ನಿಯಂತ್ರಣದ ಪ್ರಮುಖ ನಿಯಮಗಳು:**\n• ಬಿಳಿ ಅನ್ನ ಮತ್ತು ಮೈದಾ ಬದಲಿಗೆ ರಾಗಿ, ಸಿರಿಧಾನ್ಯಗಳು ಮತ್ತು ಕೆಂಪಕ್ಕಿ ಬಳಸಿ.\n• ದಿನಕ್ಕೆ ೩ ಬಾರಿ ಹೆಚ್ಚು ತಿನ್ನುವ ಬದಲು, ೫-೬ ಬಾರಿ ಸಣ್ಣ ಪ್ರಮಾಣದಲ್ಲಿ ಊಟ ಮಾಡಿ.\n• ಊಟದ ನಂತರ ೧೫ ನಿಮಿಷಗಳ ಕಾಲ ಲಘು ನಡಿಗೆ ಮಾಡುವುದು ರಕ್ತದಲ್ಲಿನ ಸಕ್ಕರೆ ಮಟ್ಟವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.\n• ಸಿಹಿತಿಂಡಿಗಳು, ಪ್ಯಾಕ್ ಮಾಡಿದ ಹಣ್ಣಿನ ಜ್ಯೂಸ್‌ಗಳಿಂದ ದೂರವಿರಿ.`,
      followUps: ['ರಕ್ತದಲ್ಲಿನ ಸಕ್ಕರೆ ಸಾಮಾನ್ಯ ಮಟ್ಟ', 'ಮಧುಮೇಹಿ ಗರ್ಭಿಣಿಯರ ಡಯಟ್', 'OGTT ಪರೀಕ್ಷೆಯ ವಿವರ']
    },
    'hi-IN': {
      answer: `जेस्टेशनल डायबिटीज (गर्भावस्था में शुगर) प्लेसेंटा के हार्मोन्स के कारण इंसुलिन रेजिस्टेंस से होती है। इसे संतुलित खान-पान और सैर से पूरी तरह नियंत्रित किया जा सकता है।\n\n✨ **शुगर कंट्रोल करने के सुनहरे नियम:**\n• **लो-जीआई आहार:** सफेद चावल और मैदे की जगह रागी, बाजरा, दलिया और साबुत दालें खाएं।\n• **भोजन के बाद टहलें:** खाना खाने के 15-20 मिनट बाद हल्की सैर जरूर करें।\n• **प्रोटीन और फाइबर:** हरी सब्जियां, पनीर, दही और चना अपनी थाली में आधा रखें।\n• मिठाई, कोल्ड ड्रिंक्स और बहुत मीठे फलों से परहेज करें।`,
      followUps: ['शुगर की सामान्य रेंज क्या होनी चाहिए?', 'मधुमेह के लिए भारतीय डाइट चार्ट', 'OGTT टेस्ट की जानकारी']
    },
    'ta-IN': {
      answer: `கர்ப்பகால சர்க்கரை நோய் (GDM) உணவு கட்டுப்பாடு மற்றும் உடற்பயிற்சி மூலம் எளிதாக நிர்வகிக்கக்கூடியது.\n\n✨ **கட்டுப்படுத்தும் முறைகள்:**\n• வெள்ளை அரிசிக்கு பதிலாக ராகி, தினை மற்றும் கைக்குத்தல் அரிசி சாப்பிடவும்.\n• உணவு உண்ட பிறகு 15 நிமிடங்கள் மெதுவாக நடைபயிற்சி மேற்கொள்ளவும்.\n• இனிப்புகள், குளிர்பானங்களைத் தவிர்க்கவும்.`,
      followUps: ['சர்க்கரை அளவு அளவீடுகள்', 'உணவு முறைகள்', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `గర్భధారణ మధుమేహం ఆహార నియమాలు మరియు వ్యాయామంతో చక్కగా నియంత్రించబడుతుంది.\n\n✨ **ముఖ్యమైన చిట్కాలు:**\n• రాగులు, జొన్నలు, పప్పులు ఆహారంలో ఎక్కువగా తీసుకోండి.\n• భోజనం చేసిన తర్వాత 15 నిమిషాలు నడవండి.\n• తీపి పదార్థాలు మరియు ప్యాక్ చేసిన డ్రింక్స్ మానేయండి.`,
      followUps: ['బ్లడ్ షుగర్ సాధారణ స్థాయిలు', 'డైట్ ప్లాన్', 'OGTT టెస్ట్ వివరాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാല പ്രമേഹം ഭക്ഷണ നിയന്ത്രണത്തിലൂടെയും ലഘുവായ നടത്തത്തിലൂടെയും നിയന്ത്രിക്കാം.\n\n✨ **ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ:**\n• വെളുത്ത അരിക്ക് പകരം റാഗി, തിന, തവിടുള്ള അരി ഉപയോഗിക്കുക.\n• ഭക്ഷണശേഷം 15 മിനിറ്റ് നടക്കുക.\n• മധുരപലഹാരങ്ങളും ജങ്ക് ഫുഡും പൂർണ്ണമായും ഒഴിവാക്കുക.`,
      followUps: ['ഷുഗർ നോർമൽ ലെവൽ', 'ഭക്ഷണക്രമം', 'ഡോക്ടറുടെ നിർദ്ദേശങ്ങൾ']
    }
  },

  heartburn: {
    'en-US': {
      answer: `Heartburn (acid reflux) is very common in the 2nd and 3rd trimesters due to progesterone relaxing the lower esophageal sphincter and the growing uterus pressing on the stomach.\n\n✨ **Proven Natural Ways to Ease Heartburn:**\n• **Eat Small, Frequent Meals:** Never overfill your stomach; 5–6 small mini-meals prevent stomach acid from pushing upward.\n• **Cold Milk or Buttermilk:** Sip a few sips of chilled low-fat milk, almond milk, or unsalted buttermilk after meals to instantly coat esophageal lining.\n• **Stay Upright After Meals:** Avoid lying down or slouching for at least 2 hours after eating. Take a gentle 10-minute stroll.\n• **Elevate Head of Bed:** Use an extra pillow or bed wedge to keep your torso elevated 6 inches at night.\n• **Avoid Trigger Foods:** Limit fried foods, spicy curries, citrus juices, chocolate, mint, and carbonated sodas.\n\n⚠️ *Safe medication note:* Discuss calcium carbonate antacids (like Tums) or famotidine with your OB/GYN if lifestyle remedies are insufficient.`,
      followUps: ['Safe antacids during pregnancy', 'Foods that trigger acid reflux', 'Nighttime heartburn remedies']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಎದೆ ಉರಿ (Acidity/Heartburn) ಪ್ರೊಜೆಸ್ಟರಾನ್ ಹಾರ್ಮೋನ್‌ನಿಂದ ಜೀರ್ಣಾಂಗಗಳ ಸ್ನಾಯುಗಳು ಸಡಿಲವಾಗುವುದರಿಂದ ಉಂಟಾಗುತ್ತದೆ.\n\n✨ **ಎದೆ ಉರಿ ನಿವಾರಣೆಗೆ ಸರಳ ಉಪಾಯಗಳು:**\n• ಊಟವಾದ ತಕ್ಷಣ ಮಲಗಬೇಡಿ, ಕನಿಷ್ಠ ೨ ಗಂಟೆಗಳ ಕಾಲ ಕುಳಿತುಕೊಳ್ಳಿ ಅಥವಾ ನಿಧಾನವಾಗಿ ನಡೆಯಿರಿ.\n• ತಣ್ಣನೆಯ ಹಾಲು ಅಥವಾ ಮಜ್ಜಿಗೆಯನ್ನು ಸ್ವಲ್ಪ ಸ್ವಲ್ಪವಾಗಿ ಹೀರಿ ಕುಡಿಯಿರಿ.\n• ಅತಿಯಾದ ಖಾರ, ಎಣ್ಣೆಯುಕ್ತ ಆಹಾರ ಮತ್ತು ಹುಣಸೆಹಣ್ಣು ಬಳಸುವುದನ್ನು ಕಡಿಮೆ ಮಾಡಿ.\n• ರಾತ್ರಿ ಮಲಗುವಾಗ ತಲೆಯ ಭಾಗವನ್ನು ದಿಂಬಿನಿಂದ ಸ್ವಲ್ಪ ಎತ್ತರದಲ್ಲಿಡಿ.`,
      followUps: ['ಎದೆ ಉರಿಗೆ ನೈಸರ್ಗಿಕ ಮನೆಮದ್ದು', 'ಗರ್ಭಿಣಿಯರಿಗೆ ಸುರಕ್ಷಿತ ಆಂಟಾಸಿಡ್', 'ರಾತ್ರಿಯ ಅಸಿಡಿಟಿ ಕಡಿಮೆ ಮಾಡುವುದು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में सीने में जलन और एसिडिटी होना बहुत आम है क्योंकि प्रोजेस्टेरोन हार्मोन पाचन नली को शिथिल कर देता है।\n\n✨ **एसिडिटी से राहत के उपाय:**\n• **ठंडा दूध:** सीने में जलन होते ही 2-3 घूंट ठंडा दूध या छाछ पिएं, इससे तुरंत आराम मिलता है।\n• **खाना खाकर तुरंत न लेटें:** भोजन के बाद कम से कम 2 घंटे तक सीधे बैठें या हल्की सैर करें।\n• **मसालेदार खाने से बचें:** बहुत तला-भुना, ज्यादा मिर्च और खट्टे फलों से रात के समय परहेज करें।\n• सोते समय सिर को तकिए के सहारे 6 इंच ऊपर रखें।`,
      followUps: ['गर्भावस्था में सेफ एंटासिड कौन से हैं?', 'एसिडिटी के लिए घरेलू ड्रिंक्स', 'रात को जलन से कैसे बचें']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் நெஞ்செரிச்சல் ஏற்படுவது ஹார்மோன் மாற்றங்களால் செரிமானம் மெதுவாக நடப்பதால் உண்டாகிறது.\n\n✨ **நிவாரண வழிகள்:**\n• சாப்பிட்டவுடன் படுக்க வேண்டாம்; 2 மணி நேரம் கழித்து தூங்கவும்.\n• குளிர்ந்த பால் அல்லது மோர் அருந்துவது நெஞ்செரிச்சலை உடனடியாகக் குறைக்கும்.\n• காரமான, எண்ணெய் பலகாரங்களைத் தவிர்க்கவும்.\n• தூங்கும்போது தலையை சற்று உயர்த்தி வைக்கவும்.`,
      followUps: ['நெஞ்செரிச்சலுக்கான வீட்டு வைத்தியம்', 'பாதுகாப்பான உணவுகள்', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `గర్భధారణలో ఛాతీలో మంట (ఎసిడిటీ) రావడం సహజం.\n\n✨ **ఉపశమన చిట్కాలు:**\n• భోజనం చేసిన వెంటనే పడుకోవద్దు; కాసేపు కూర్చోండి లేదా నడవండి.\n• చల్లని పాలు లేదా మజ్జిగ తాగడం వల్ల వెంటనే ఉపశమనం లభిస్తుంది.\n• కారం, నూనె పదార్థాలు తగ్గించండి.\n• రాత్రి పడుకునేటప్పుడు తల కొద్దిగా ఎత్తుగా ఉండేలా దిండు పెట్టుకోండి.`,
      followUps: ['ఎసిడిటీ నివారణ చిట్కాలు', 'సురಕ್ಷితమైన పానీయాలు', 'డాక్టర్ సలహాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ നെഞ്ചെരിച്ചിൽ മാറ്റാൻ ലളിതമായ ചില വഴികൾ:\n\n✨ **പ്രധാന നിർദ്ദേശങ്ങൾ:**\n• ഭക്ഷണശേഷം ഉടൻ കിടക്കരുത്; അല്പസമയം ഇരിക്കുകയോ നടക്കുകയോ ചെയ്യുക.\n• തണുത്ത പാലോ സംഭാരമോ കുടിക്കുന്നത് നെഞ്ചെരിച്ചിൽ ഉടൻ കുറയ്ക്കും.\n• എരിവും പുളിയും എണ്ണയും അധികമുള്ള ഭക്ഷണങ്ങൾ ഒഴിവാക്കുക.\n• ഉറങ്ങുമ്പോൾ തല അല്പം ഉയർത്തി വയ്ക്കുക.`,
      followUps: ['നെഞ്ചെരിച്ചിലിനുള്ള വീട്ടുവൈദ്യം', 'രാത്രിയിലെ അസിഡിറ്റി', 'ശ്രദ്ധിക്കേണ്ട ഭക്ഷണങ്ങൾ']
    }
  },

  exercise: {
    'en-US': {
      answer: `Staying active during pregnancy strengthens your pelvic floor, eases backache, reduces gestational diabetes risk, and shortens labor!\n\n✨ **Safe Prenatal Exercises:**\n• **Daily Brisk Walking (20–30 mins):** The safest, most effective aerobic exercise that promotes optimal baby positioning (head down).\n• **Pelvic Floor Kegels:** Squeeze the muscles you use to stop urination for 5 seconds, relax for 5 seconds. Repeat 10–15 times, 3 sets daily.\n• **Prenatal Yoga:** Gentle poses like Butterfly pose (Bhadrasana), Cat-Cow (Marjariasana), and squatting against a wall open pelvic joints.\n• **Pelvic Tilts on Hands & Knees:** Relieves pressure off the sciatic nerve and strengthens abdominal core gently.\n\n⚠️ **Exercise Safety Rules:** Avoid contact sports, hot yoga, lying flat on your back after 16 weeks, and stop immediately if you feel dizzy, breathless, or notice vaginal spotting.`,
      followUps: ['How to do Kegels correctly?', 'Safe yoga poses for second trimester', 'When to stop exercising during pregnancy']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮವು ಸುಲಭ ಹೆರಿಗೆಗೆ ಮತ್ತು ದೇಹದ ಆರೋಗ್ಯಕ್ಕೆ ಅತ್ಯಂತ ಉಪಯುಕ್ತ.\n\n✨ **ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮಗಳು:**\n• **ದೈನಂದಿನ ನಡಿಗೆ:** ದಿನಕ್ಕೆ ೨೦-೩೦ ನಿಮಿಷಗಳ ನಿಧಾನವಾದ ನಡಿಗೆ ಅತ್ಯುತ್ತಮ.\n• **ಕೀಗಲ್ ವ್ಯಾಯಾಮ (Kegel):** ಪೆಲ್ವಿಕ್ ಸ್ನಾಯುಗಳನ್ನು ಬಿಗಿಗೊಳಿಸುವ ಸರಳ ವ್ಯಾಯಾಮ ಹೆರಿಗೆಗೆ ಸಹಕಾರಿ.\n• **ಚಿಟ್ಟೆ ಆಸನ (Butterfly Pose):** ಸೊಂಟ ಮತ್ತು ತೊಡೆಗಳ ಸ್ನಾಯುಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ ಹೆರಿಗೆ ನೋವನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.\n• ಬೆನ್ನಿನ ಮೇಲೆ ಮಲಗಿ ಮಾಡುವ ವ್ಯಾಯಾಮಗಳನ್ನು ಮಾಡಬೇಡಿ.`,
      followUps: ['ಸುಲಭ ಹೆರಿಗೆಗೆ ಯೋಗಾಸನಗಳು', 'ಕೀಗಲ್ ವ್ಯಾಯಾಮ ಮಾಡುವುದು ಹೇಗೆ?', 'ನಡಿಗೆಯ ಪ್ರಯೋಜನಗಳು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में हल्का व्यायाम और योग नॉर्मल डिलीवरी और शरीर को लचीला बनाए रखने में बहुत मददगार होता है।\n\n✨ **सुरक्षित व्यायाम:**\n• **रोजाना 20-30 मिनट की सैर:** यह सबसे सुरक्षित और असरदार व्यायाम है जो शिशु को सही पोजीशन में लाता है।\n• **तितली आसन (बटरफ्लाई पोज):** पेल्विक क्षेत्र की मांसपेशियों को लचीला बनाता है।\n• **कीगल एक्सरसाइज:** पेल्विक फ्लोर की मांसपेशियों को मजबूत करती है, जिससे डिलीवरी में आसानी होती है।\n• **कैट-काउ पोज:** रीढ़ की हड्डी और पीठ दर्द से तुरंत राहत देता है।\n\n⚠️ भारी वजन उठाना या 16वें हफ्ते के बाद पीठ के बल लेटकर व्यायाम करना बिल्कुल न करें।`,
      followUps: ['नॉर्मल डिलीवरी के लिए व्यायाम', 'कीगल एक्सरसाइज कैसे करें?', 'गर्भावस्था में योग के लाभ']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் மிதமான உடற்பயிற்சி செய்வது பிரசவத்தை எளிதாக்கும்.\n\n✨ **பரிந்துரைக்கப்படும் பயிற்சிகள்:**\n• தினமும் 20-30 நிமிடங்கள் நடைபயிற்சி.\n• பட்டாம்பூச்சி ஆசனம் (Butterfly pose) இடுப்பு தசைகளை வலுவாக்கும்.\n• கீகல் பயிற்சிகள் (Kegel exercises) இடுப்புப் பகுதியை சீராக்கும்.\n• அதிக எடையைத் தூக்கக் கூடாது.`,
      followUps: ['எளிதான பிரசவத்திற்கான உடற்பயிற்சி', 'கீகல் பயிற்சி முறை', 'யோகா நன்மைகள்']
    },
    'te-IN': {
      answer: `గర్భధారణలో తేలికపాటి వ్యాయామాలు సుఖ ప్రసవానికి సహాయపడతాయి.\n\n✨ **సురక్షితమైన వ్యాయామాలు:**\n• రోజూ 20-30 నిమిషాలు నడవడం.\n• సీతాకోకచిలుక ఆసనం (Butterfly pose) నడుము కండరాలను బలోపేతం చేస్తుంది.\n• కీగల్ ఎక్సర్‌సైజులు ప్రసవ సమయంలో ఎంతో మేలు చేస్తాయి.`,
      followUps: ['సుఖ ప్రసవానికి వ్యాయామాలు', 'కీగల్ వ్యాయామం ఎలా చేయాలి?', 'నడక ప్రయోజనాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ ലളിതമായ വ്യായാമങ്ങൾ സുഖപ്രസവത്തിന് സഹായിക്കുന്നു.\n\n✨ **പ്രധാന വ്യായാമങ്ങൾ:**\n• ദിവസവും 20-30 മിനിറ്റ് നടത്തം.\n• ബട്ടർഫ്ലൈ പോസ് ഇടുപ്പെല്ലിലെ പേശികൾക്ക് വഴക്കം നൽകുന്നു.\n• കീഗൽ വ്യായാമം പെൽവിക് പേശികളെ ബലപ്പെടുത്തുന്നു.`,
      followUps: ['സുഖപ്രസവത്തിനുള്ള യോഗ', 'കീഗൽ വ്യായാമം ചെയ്യുന്ന വിധം', 'നടത്തത്തിന്റെ ഗുണങ്ങൾ']
    }
  },

  travel: {
    'en-US': {
      answer: `Traveling during pregnancy is generally very safe, especially during the **second trimester (Weeks 14–28)**, when morning sickness has eased and your energy has returned.\n\n✨ **Guidelines for Safe Travel:**\n• **Domestic & International Flights:** Most airlines allow flying up to **36 weeks** for single uncomplicated pregnancies (32 weeks for twins). Carry a medical 'fit-to-fly' certificate from your doctor after 28 weeks.\n• **Aisle Seat & Frequent Stretches:** Walk the aircraft aisle every 60–90 minutes to maintain active venous blood flow and prevent Deep Vein Thrombosis (DVT).\n• **Graduated Compression Socks:** Wearing 15–20 mmHg knee-high compression stockings significantly reduces swollen feet and blood clot risks.\n• **Car Travel:** Always wear your seatbelt correctly—the lap belt snug across your upper thighs/below your belly, and the shoulder strap diagonal between your breasts.\n• **Hydration & Snacks:** Sip water continuously; air cabin humidity is extremely low.`,
      followUps: ['When is the safest time to travel?', 'How to wear seatbelt properly with a bump', 'What medications to carry during travel']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪ್ರಯಾಣ ಮಾಡಲು **೨ನೇ ತ್ರೈಮಾಸಿಕ (೧೪-೨೮ ವಾರಗಳು)** ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಸಮಯ.\n\n✨ **ಪ್ರಯಾಣದ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು:**\n• ವಿಮಾನ ಅಥವಾ ಕಾರು ಪ್ರಯಾಣದಲ್ಲಿ ಸೀಟ್‌ಬೆಲ್ಟ್‌ ಅನ್ನು ಹೊಟ್ಟೆಯ ಕೆಳಭಾಗದಲ್ಲಿ ಸರಿಯಾಗಿ ಧರಿಸಿ.\n• ಪ್ರತಿ ೧-೨ ಗಂಟೆಗೊಮ್ಮೆ ಎದ್ದು ಸ್ವಲ್ಪ ದೂರ ನಡೆಯಿರಿ, ಇದು ರಕ್ತ ಹೆಪ್ಪುಗಟ್ಟುವುದನ್ನು ತಡೆಯುತ್ತದೆ.\n• ಕಾಲಿನಲ್ಲಿ ಊತ ಬರದಂತೆ ಕಂಪ್ರೆಷನ್ ಸಾಕ್ಸ್ (Compression socks) ಧರಿಸಬಹುದು.\n• ವೈದ್ಯಕೀಯ ಫೈಲ್ ಮತ್ತು ತುರ್ತು ಔಷಧಿಗಳನ್ನು ಸದಾ ನಿಮ್ಮ ಬ್ಯಾಗ್‌ನಲ್ಲೇ ಇಟ್ಟುಕೊಳ್ಳಿ.`,
      followUps: ['ವಿಮಾನ ಪ್ರಯಾಣಕ್ಕೆ ವೈದ್ಯರ ಪತ್ರ', 'ಕಾರಿನಲ್ಲಿ ಸೀಟ್‌ಬೆಲ್ಟ್ ಧರಿಸುವ ವಿಧಾನ', 'ಪ್ರಯಾಣದಲ್ಲಿ ಅಗತ್ಯ ವಸ್ತುಗಳು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में यात्रा करने के लिए **दूसरी तिमाही (14 से 28 हफ्ते)** सबसे सुरक्षित और आरामदायक समय मानी जाती है।\n\n✨ **सुरक्षित यात्रा के नियम:**\n• **फ्लाइट यात्रा:** ज्यादातर एयरलाइंस 36वें हफ्ते तक यात्रा की अनुमति देती हैं। 28वें हफ्ते के बाद डॉक्टर का 'Fit to Fly' सर्टिफिकेट साथ रखें।\n• **सैर और खिंचाव:** हवाई जहाज या कार में हर 1-2 घंटे में थोड़ा टहलें और पैरों को घुमाएं ताकि रक्त संचार सही रहे।\n• **सीटबेल्ट का सही तरीका:** लैप बेल्ट को पेट के ऊपर नहीं, बल्कि पेट के नीचे जांघों पर कसें।\n• पानी की बोतल और सूखे मेवे हमेशा अपने पास रखें।`,
      followUps: ['गर्भावस्था में हवाई यात्रा के नियम', 'सीटबेल्ट लगाने का सही तरीका', 'सफर में क्या सावधानियां रखें']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் பயணம் செய்ய 2வது காலாண்டு (14-28 வாரங்கள்) மிகவும் பாதுகாப்பானது.\n\n✨ **பயண குறிப்புகள்:**\n• கார் அல்லது விமான பயணத்தில் சீட்பெல்ட்டை வயிற்றுக்கு கீழே கட்டவும்.\n• நீண்ட பயணங்களில் 1-2 மணி நேரத்திற்கு ஒருமுறை எழுந்து சிறிது தூரம் நடக்கவும்.\n• மருத்துவ ஆவணங்களை எப்போதும் உடன் வைத்திருக்கவும்.`,
      followUps: ['விமான பயண விதிமுறைகள்', 'சீட்பெல்ட் அணியும் முறை', 'பயண அவசர மருந்துகள்']
    },
    'te-IN': {
      answer: `గర్భధారణలో ప్రయాణాలకు రెండవ త్రైమాసికం అత్యంత అనుకూలమైన సమయం.\n\n✨ **ముఖ్య జాగ్రత్తలు:**\n• కారు లేదా విమానంలో సీటు బెల్టును పొట్ట కింద నుంచి ధరించాలి.\n• గంటకోసారి కాసేపు నడవడం వల్ల రక్త ప్రసరణ బాగుంటుంది.\n• వైద్యుల ప్రిస్క్రిప్షన్ మరియు ఫైల్ ఎల్లప్పుడూ దగ్గర ఉంచుకోండి.`,
      followUps: ['విమాన ప్రయాణ నిబంధనలు', 'సీట్ బెల్ట్ ధరించే పద్ధతి', 'ప్రయాణ జాగ్రత్తలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ യാത്രകൾക്ക് ഏറ്റവും അനുയോജ്യമായ സമയം രണ്ടാം ത്രൈമാസമാണ് (14-28 ആഴ്ചകൾ).\n\n✨ **ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ:**\n• സീറ്റ് ബെൽറ്റ് വയറിന് താഴെയായി ശരിയായ രീതിയിൽ ധരിക്കുക.\n• ദീർഘദൂര യാത്രകളിൽ ഇടയ്ക്കിടെ എഴുന്നേറ്റു നടക്കുക.\n• മെഡിക്കൽ രേഖകൾ എപ്പോഴും കൈവശം കരുതുക.`,
      followUps: ['വിമാനയാത്രാ നിർദ്ദേശങ്ങൾ', 'സീറ്റ് ബെൽറ്റ് ധരിക്കേണ്ട വിധം', 'യാത്രാ മുൻകരുതലുകൾ']
    }
  },

  swelling: {
    'en-US': {
      answer: `Mild swelling (physiological edema) in your feet, ankles, and hands is very normal in the second half of pregnancy as your body produces 50% more blood and fluids.\n\n✨ **Safe Comfort Steps:**\n• **Elevate Your Feet:** Rest with your legs elevated above heart level on pillows for 20 minutes, 2–3 times daily.\n• **Stay Well-Hydrated:** Drinking plenty of water actually prompts your kidneys to flush out excess sodium and retained fluids.\n• **Avoid Prolonged Standing:** Avoid standing or sitting cross-legged for extended periods.\n• **Soak in Cool/Warm Water:** Soaking feet in cool water with Epsom salt relieves aching and puffiness.\n\n🚨 **CRITICAL WARNING:** If swelling is **sudden and severe in your face, around your eyes, or in your hands**, accompanied by a persistent headache, visual aura, or right-sided rib pain, contact your doctor immediately to evaluate for **Preeclampsia**.`,
      followUps: ['Normal swelling vs preeclampsia signs', 'How to reduce swollen ankles at work', 'Safe footwear for swollen feet']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ರಕ್ತ ಮತ್ತು ದ್ರವದ ಪ್ರಮಾಣ ಹೆಚ್ಚಾಗುವುದರಿಂದ ಕಾಲು ಮತ್ತು ಹಿಮ್ಮಡಿಗಳಲ್ಲಿ ಸಣ್ಣ ಊತ ಬರುವುದು ಸಾಮಾನ್ಯ.\n\n✨ **ಊತ ಕಡಿಮೆ ಮಾಡಲು ಸಲಹೆಗಳು:**\n• ಮಲಗುವಾಗ ಅಥವಾ ವಿಶ್ರಾಂತಿ ಪಡೆಯುವಾಗ ಕಾಲುಗಳ ಕೆಳಗೆ ದಿಂಬು ಇಟ್ಟು ಎತ್ತರಿಸಿ.\n• ಹೆಚ್ಚು ನೀರು ಕುಡಿಯಿರಿ ಮತ್ತು ಉಪ್ಪಿನ ಅಂಶವಿರುವ ಆಹಾರವನ್ನು ಮಿತಿಗೊಳಿಸಿ.\n• ಒಂದೇ ಕಡೆ ಹೆಚ್ಚು ಹೊತ್ತು ನಿಲ್ಲಬೇಡಿ ಅಥವಾ ಕಾಲು ಕ್ರಾಸ್ ಮಾಡಿ ಕುಳಿತುಕೊಳ್ಳಬೇಡಿ.\n\n⚠️ ಮುಖ, ಕಣ್ಣುಗಳಲ್ಲಿ ಹಠಾತ್ ಊತ ಮತ್ತು ತೀವ್ರ ತಲೆನೋವು ಬಂದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಭೇಟಿ ಮಾಡಿ (ರಕ್ತದೊತ್ತಡ ಹೆಚ್ಚಿರುವ ಸಾಧ್ಯತೆ).`,
      followUps: ['ಕಾಲು ಊತಕ್ಕೆ ಸರಳ ಪರಿಹಾರ', 'ರಕ್ತದೊತ್ತಡ ಹೆಚ್ಚಾದ ಲಕ್ಷಣಗಳು', 'ಯಾವಾಗ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಬೇಕು?']
    },
    'hi-IN': {
      answer: `गर्भावस्था में पैरों और टखनों में हल्की सूजन (एडिमा) होना सामान्य है क्योंकि शरीर में 50% अधिक तरल पदार्थ बनते हैं।\n\n✨ **सूजन कम करने के उपाय:**\n• **पैरों को ऊपर रखें:** दिन में 2-3 बार पैरों के नीचे तकिया लगाकर दिल के स्तर से ऊपर रखें।\n• **खूब पानी पिएं:** पर्याप्त पानी पीने से शरीर अतिरिक्त नमक को बाहर निकालता है।\n• बहुत देर तक एक ही जगह खड़े न रहें।\n\n🚨 **खतरे की घंटी:** अगर चेहरे पर, आंखों के आसपास अचानक सूजन आए और साथ में तेज सिरदर्द हो, तो तुरंत डॉक्टर से संपर्क करें (प्री-एक्लेम्पसिया का संकेत)।`,
      followUps: ['सूजन कम करने के घरेलू उपाय', 'प्री-एक्लेम्पसिया के लक्षण', 'पैरों की मालिश कैसे करें']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் கால்களில் லேசான வீக்கம் ஏற்படுவது இயல்பான ஒன்று.\n\n✨ **வீக்கத்தைக் குறைக்கும் வழிகள்:**\n• உட்காரும் போது கால்களை தலையணை மீது சற்று உயர்த்தி வைக்கவும்.\n• நிறைய தண்ணீர் குடிக்கவும், உப்பைக் குறைக்கவும்.\n• நீண்ட நேரம் ஒரே இடத்தில் நிற்பதைத் தவிர்க்கவும்.\n\n⚠️ முகத்தில் திடீர் வீக்கம் மற்றும் தலைவலி இருந்தால் உடனே மருத்துவரை அணுகவும்.`,
      followUps: ['கால் வீக்கம் குறைய வழிகள்', 'இரத்த அழுத்த அறிகுறிகள்', 'மருத்துவர் ஆலோசனை']
    },
    'te-IN': {
      answer: `గర్భధారణలో కాళ్ళ వాపు సాధారణంగా కనిపిస్తుంది.\n\n✨ **ఉపశమన చిట్కాలు:**\n• కూర్చున్నప్పుడు లేదా పడుకున్నప్పుడు కాళ్ళ కింద దిండు పెట్టుకోండి.\n• ఉప్పు తగ్గించి పుష్కలంగా నీరు తాగండి.\n• ఎక్కువ సేపు నిలబడటం లేదా కూర్చోవడం చేయవద్దు.\n\n⚠️ ముఖంపై హఠాత్తుగా వాపు వస్తే వెంటనే డాక్టర్‌ను సంప్రదించండి.`,
      followUps: ['కాళ్ళ వాపు నివారణ చిట్కాలు', 'హై బీపీ లక్షణాలు', 'వైద్యుల సలహాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്ത് കാലുകളിലും ഉപ്പൂറ്റിയിലും നേരിയ നീർക്കെട്ടുണ്ടാകുന്നത് സ്വാഭാവികമാണ്.\n\n✨ **പരിഹാരങ്ങൾ:**\n• ഇരിക്കുമ്പോഴും ഉറങ്ങുമ്പോഴും കാൽ അല്പം ഉയർത്തി വയ്ക്കുക.\n• ഉപ്പിന്റെ അളവ് കുറയ്ക്കുകയും ധാരാളം വെള്ളം കുടിക്കുകയും ചെയ്യുക.\n• കൂടുതൽ നേരം ഒരേ നിൽപ്പ് നിൽക്കരുത്.\n\n⚠️ മുഖത്ത് പെട്ടെന്ന് നീര് വരികയും തലവേദന അനുഭവപ്പെടുകയും ചെയ്താൽ ഉടൻ ഡോക്ടറെ കാണുക.`,
      followUps: ['കാലിലെ നീര് മാറ്റാൻ വഴികൾ', 'പ്രീക്ലാംസിയ ലക്ഷണങ്ങൾ', 'ഡോക്ടറെ കാണേണ്ട സമയം']
    }
  }
};

// 3. Fallback Context Generator for Any Query Outside Standard Topics
function generateClinicalSynthesis(
  userQuery: string,
  motherName: string,
  gestationalWeek: number,
  language: string,
  userRole: string
): { answer: string; followUps: string[] } {
  const lower = userQuery.toLowerCase();

  // Detect specific clinical sub-intents
  const isMedicationQuery = /(medicine|tablet|pill|paracetamol|dolo|antibiotic|safe drug|headache pill)/i.test(lower);
  const isDischargeQuery = /(discharge|white discharge|leukorrhea|leak|itch|smell|yeast)/i.test(lower);
  const isPartnerQuery = /(partner|husband|dad|father|role|support|help her)/i.test(lower);
  const isBabyDevelopment = /(size|weight|developing|hearing|lung|brain|eyes|milestone|week)/i.test(lower);

  if (language === 'kn-IN') {
    if (isMedicationQuery) {
      return {
        answer: `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಯಾವುದೇ ಮಾತ್ರೆ ಅಥವಾ ಔಷಧಿಯನ್ನು ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ತೆಗೆದುಕೊಳ್ಳಬಾರದು.\n\n✨ **ಮುಖ್ಯ ವೈದ್ಯಕೀಯ ಮಾರ್ಗದರ್ಶಿ:**\n• **ಜ್ವರ ಅಥವಾ ತಲೆನೋವಿಗೆ:** ಪ್ಯಾರಸಿಟಮಾಲ್ (Paracetamol) ಸಾಮಾನ್ಯವಾಗಿ ಸುರಕ್ಷಿತವೆಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ, ಆದರೆ ನಿಖರವಾದ ಡೋಸ್ ತಿಳಿಯಲು ನಿಮ್ಮ ಸ್ತ್ರೀರೋಗ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.\n• **ತಪ್ಪಿಸಬೇಕಾದ ಮಾತ್ರೆಗಳು:** ಐಬುಪ್ರೊಫೇನ್ (Ibuprofen), ಆಸ್ಪಿರಿನ್ ಮತ್ತು ನೋವುನಿವಾರಕ ಮಾತ್ರೆಗಳನ್ನು ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬಾರದು.\n• ಯಾವುದೇ ಆಂಟಿಬಯೋಟಿಕ್ ಅಥವಾ ಶೀತದ ಸಿರಪ್ ತೆಗೆದುಕೊಳ್ಳುವ ಮುನ್ನ ವೈದ್ಯರ ಅನುಮತಿ ಕಡ್ಡಾಯ.`,
        followUps: ['ತಲೆನೋವಿಗೆ ಸುರಕ್ಷಿತ ಮನೆಮದ್ದು', 'ಗರ್ಭಿಣಿಯರ ವಿಟಮಿನ್ ಮಾತ್ರೆಗಳು', 'ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ']
      };
    }
    return {
      answer: `ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${userQuery}" ಗೆ ಧನ್ಯವಾದಗಳು, ${motherName}! 🌸\n\nಗರ್ಭಾವಸ್ಥೆಯ **${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ** ನಿಮ್ಮ ದೇಹ ಮತ್ತು ಮಗು ದಿನದಿಂದ ದಿನಕ್ಕೆ ಪ್ರಗತಿ ಹೊಂದುತ್ತಿವೆ.\n\n✨ **ವೈದ್ಯಕೀಯ ಸಲಹೆಗಳು:**\n• **ಸ್ವಯಂ ಆರೈಕೆ:** ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ, ಸಮತೋಲಿತ ಪೌಷ್ಟಿಕ ಆಹಾರ ಸೇವಿಸಿ ಮತ್ತು ಎಡ ಮಗ್ಗುಲಿನಲ್ಲಿ ಮಲಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.\n• **ಮನಸ್ಸಿನ ನೆಮ್ಮದಿ:** ಧ್ಯಾನ, ಹಿತವಾದ ಸಂಗೀತ ಮತ್ತು ಸಕಾರಾತ್ಮಕ ಯೋಚನೆಗಳು ಮಗುವಿನ ಬೆಳವಣಿಗೆಗೆ ಶಕ್ತಿ ನೀಡುತ್ತವೆ.\n• **ಮುನ್ನೆಚ್ಚರಿಕೆ:** ಯಾವುದೇ ಹೊಸ ಅಥವಾ ನಿರಂತರ ಅಸ್ವಸ್ಥತೆ ಇದ್ದರೆ ನಿಮ್ಮ ವೈದ್ಯರ ಸಲಹೆ ಪಡೆಯಿರಿ.\n\nನಿಮಗೆ ಇನ್ನಷ್ಟು ವಿವರವಾದ ಮಾಹಿತಿ ಬೇಕೇ?`,
      followUps: ['ಈ ವಾರದ ಮಗುವಿನ ಬೆಳವಣಿಗೆ', 'ಪೌಷ್ಟಿಕ ಆಹಾರದ ವಿವರ', 'ಸುರಕ್ಷಿತ ವ್ಯಾಯಾಮಗಳು']
    };
  }

  if (language === 'hi-IN') {
    if (isMedicationQuery) {
      return {
        answer: `नमस्ते ${motherName}! 🌸 गर्भावस्था में कोई भी दवा डॉक्टर की सलाह के बिना कभी नहीं लेनी चाहिए।\n\n✨ **दवाओं से जुड़े महत्वपूर्ण नियम:**\n• **सिरदर्द या बुखार:** आमतौर पर पैरासिटामोल (Paracetamol/Dolo) डॉक्टर द्वारा सुरक्षित मानी जाती है, लेकिन सही मात्रा डॉक्टर से ही पूछें।\n• **बिल्कुल न लें:** ब्रूफेन (Ibuprofen), एस्पिरिन या अन्य पेनकिलर्स से प्लेसेंटा और शिशु को नुकसान पहुंच सकता है।\n• सर्दी-खांसी में भाप लें, गुनगुना पानी पिएं और कोई भी कफ सिरप बिना पूछे न लें।`,
        followUps: ['सिरदर्द के घरेलू उपाय', 'गर्भावस्था के जरूरी सप्लीमेंट्स', 'डॉक्टर से परामर्श']
      };
    }
    return {
      answer: `"${userQuery}" के बारे में पूछने के लिए धन्यवाद, ${motherName}! 🌸\n\nगर्भावस्था के **${gestationalWeek}वें हफ्ते** में आपका शरीर शिशु के विकास के अनुरूप कई बदलावों को संभाल रहा है।\n\n✨ **महत्वपूर्ण चिकित्सीय सलाह:**\n• **देखभाल:** रोजाना 8-10 गिलास पानी पिएं, हल्का पौष्टिक आहार लें और बाईं करवट लेकर सोने की आदत बनाएं।\n• **सकारात्मकता:** प्रतिदिन थोड़ा टहलें, शांत संगीत सुनें और पर्याप्त आराम करें।\n• **सावधानी:** किसी भी असामान्य दर्द, ब्लीडिंग या तेज सिरदर्द में तुरंत डॉक्टर से संपर्क करें।\n\nक्या आप इस बारे में और विस्तार से जानना चाहती हैं?`,
      followUps: ['इस हफ्ते शिशु का विकास', 'स्वस्थ आहार चार्ट', 'गर्भावस्था में सुरक्षित योग']
    };
  }

  // Default English High-Quality Medical Synthesis
  if (isMedicationQuery) {
    return {
      answer: `Medication safety during pregnancy requires strict clinical caution, ${motherName}. Many over-the-counter drugs cross the placenta.\n\n✨ **Clinical Guidelines on Medications:**\n• **Mild Pain & Fever:** Paracetamol (Acetaminophen) is considered the safest first-line medication during pregnancy at the lowest effective dose. Always confirm dosage with your OB/GYN.\n• **Strictly Avoid NSAIDs:** Ibuprofen, Advil, Aleve, and Aspirin must be avoided (especially in the 3rd trimester) as they can affect fetal circulation and amniotic fluid volume.\n• **Cold & Cough Remedies:** Saline nasal sprays, steam inhalation, and warm honey-lemon water are safe natural alternatives. Avoid decongestants like pseudoephedrine without prescription.\n• **Supplements:** Continue your daily prenatal vitamin, iron, and folic acid/calcium as prescribed by your obstetrician.`,
      followUps: ['Safe remedies for headache during pregnancy', 'Daily prenatal vitamin timings', 'Questions for my OB/GYN']
    };
  }

  if (isDischargeQuery) {
    return {
      answer: `Vaginal discharge naturally increases during pregnancy due to elevated estrogen and increased blood flow to the cervix.\n\n✨ **Normal vs. Abnormal Discharge:**\n• **Normal Leukorrhea:** Thin, milky white or clear, mild-smelling or odorless, and non-irritating. This is your body's natural defense against ascending bacteria.\n• **Yeast Infection (Candida):** Thick, white, cottage cheese-like texture accompanied by intense vaginal itching or burning. Common during pregnancy and easily treated with safe antifungal suppositories.\n• **Bacterial Vaginosis (BV):** Thin, grayish-white discharge with a distinct fishy odor. Requires clinical antibiotic treatment to prevent premature contractions.\n\n🚨 *Contact your doctor immediately if:* The discharge is watery and leaking continuously (possible amniotic fluid), or contains bright red blood.`,
      followUps: ['How to prevent vaginal yeast infections', 'Difference between fluid leak and discharge', 'Safe feminine hygiene tips']
    };
  }

  if (isPartnerQuery || userRole === 'partner') {
    return {
      answer: `Partners play a transformative role in maternal comfort, emotional stability, and labor outcomes! 🌟\n\n✨ **Top Partner Support Actions at Week ${gestationalWeek}:**\n• **Daily Physical Comfort:** Offer gentle lower-back and foot massages using natural almond or coconut oil after a long day.\n• **Hydration & Nutrition Guardian:** Keep her water bottle filled with fresh room-temperature water or coconut water, and prepare protein-rich snacks.\n• **Labor Advocacy:** Review the birth plan together, learn the 5-1-1 labor surge rules, and practice counter-pressure on her sacrum.\n• **Emotional Reassurance:** Active listening without judgment lowers maternal cortisol, directly protecting baby's developing brain cells.\n• **Garbh Sanskar Bonding:** Talk directly to the baby bump every evening for 5–10 minutes. Baby distinctly recognizes the partner's lower vocal pitch!`,
      followUps: ['How partner can help during labor surges', 'Hospital bag essentials for partner', 'Partner bonding activities']
    };
  }

  if (isBabyDevelopment) {
    return {
      answer: `At **Week ${gestationalWeek}**, your baby is progressing through miraculous developmental leaps! 👶✨\n\n✨ **Fetal Milestones Right Now:**\n• **Anatomical Growth:** Baby measures around 11.5–12 inches long (the size of an ear of sweet corn) and weighs approximately 1.3–1.5 lbs (600–700 grams).\n• **Sensory & Auditory System:** Baby's inner ear bones are fully formed; baby can now clearly hear your voice, heartbeat, blood swooshing, and even external classical music.\n• **Lung Development:** Tiny branches (bronchioles) and alveoli are maturing, and baby is practicing swallowing amniotic fluid and rhythmic breathing movements.\n• **Skin & Vernix:** Baby's translucent skin is developing a protective waxy coating called **vernix caseosa** and fine downy hair (**lanugo**).\n\nKeep nourishing baby with balanced protein, calcium, and restful sleep on your left side!`,
      followUps: ['Baby kick patterns at this week', 'Best foods for baby brain development', 'What to expect at the next ultrasound scan']
    };
  }

  return {
    answer: `Thank you for asking about **"${userQuery}"**, ${motherName}! 🌸\n\nAt **Week ${gestationalWeek}**, maternal physiology is actively adapting to support rapid baby growth. Here is clinically backed guidance:\n\n✨ **Clinical Perspective & Best Practices:**\n• **Physiological Harmony:** Listen closely to your body's signals. Prioritize adequate rest, consistent sleep on your **left side (SOS)**, and steady hydration (8–10 glasses daily).\n• **Nutrition & Energy:** Focus on whole foods, protein-rich snacks, and iron/calcium density to sustain maternal energy and fetal bone/brain formation.\n• **Gentle Movement:** Light daily walking (20 mins) and gentle pelvic floor stretches keep circulation optimal and reduce muscular strain.\n• **When to Consult Your Obstetrician:** Always contact your doctor or maternity triage if you experience sudden sharp pains, vaginal bleeding, leaking fluid, or noticeable changes in baby movement.\n\nWould you like more guidance on nutrition, weekly symptoms, or labor preparation?`,
    followUps: [
      `Safe guidance for Week ${gestationalWeek}`,
      'Best foods to boost energy and hemoglobin',
      'What questions to ask at the next prenatal checkup'
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const {
      message,
      history = [],
      gestationalWeek = 24,
      userRole = 'mother',
      language = 'en-US',
      motherName = 'Mama'
    } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const cleanInput = message.trim();
    const lower = cleanInput.toLowerCase();

    // 1. Red Flag Medical Emergency Check (Top Priority Triage)
    for (const flag of EMERGENCY_PATTERNS) {
      if (flag.regex.test(lower)) {
        return NextResponse.json({
          success: true,
          isEmergencyAlert: true,
          emergencyTitle: flag.title,
          emergencyWarning: flag.warning,
          emergencyAction: flag.action,
          response: `⚠️ **${flag.title}**\n\n${flag.warning}\n\n**URGENT ACTION REQUIRED:**\n${flag.action}\n\n*DISCLAIMER: BloomNest AI is an educational assistant and cannot replace direct physical hospital evaluation.*`,
          followUps: [
            'Call Doctor Emergency Line',
            'Find Nearest Maternity Emergency Room',
            'Notify Partner Immediately'
          ],
          source: 'emergency-triage-filter'
        });
      }
    }

    // 2. Google Gemini Live Generative AI Pipeline
    const clientKey = body.apiKey || req.headers.get('x-gemini-key') || req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const geminiApiKey = clientKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const systemInstruction = `You are Bloom AI (GarbaKosh), an empathetic, expert obstetric, maternal, and pediatric AI companion for Indian mothers and partners.
User Profile: Name: ${motherName}, Gestational Week: ${gestationalWeek} (Account role: ${userRole}).
Language to reply in: ${language} (English, Kannada, Hindi, Tamil, Telugu, or Malayalam).
Provide clinically accurate, supportive, culturally sensitive advice.
Incorporate Indian maternal nutrition (ragi, lentils, coconut water, safe dry fruits), Garbh Sanskar principles, and evidence-based obstetric care.
Always reply naturally, directly, and comprehensively to the exact question asked in the requested language (${language}). Format with neat markdown bullet points and friendly emojis.`;

        // Format history turns for Gemini API
        const contents: any[] = [];
        if (history && history.length > 0) {
          const recent = history.slice(-4);
          for (const item of recent) {
            contents.push({
              role: item.sender === 'user' ? 'user' : 'model',
              parts: [{ text: item.text }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser Question: "${cleanInput}"` }]
        });

        const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
        for (const model of models) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents,
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                  }
                })
              }
            );

            if (geminiRes.ok) {
              const geminiData = await geminiRes.json();
              const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (candidateText && candidateText.trim().length > 10) {
                return NextResponse.json({
                  success: true,
                  isEmergencyAlert: false,
                  response: candidateText.trim(),
                  followUps: [
                    `Tell me more about Week ${gestationalWeek}`,
                    'What safe exercises can I do today?',
                    'Best nutritional guidance for today'
                  ],
                  source: `gemini-live:${model}`
                });
              }
            }
          } catch (modelErr) {
            console.warn(`Model ${model} attempt failed:`, modelErr);
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, attempting fallback pipeline:', geminiError);
      }
    }

    // 3. Free Generative AI Fallback Pipeline (Pollinations API)
    try {
      const freePrompt = `You are Bloom AI, an obstetric and pregnancy clinical assistant. The user is ${motherName} at Week ${gestationalWeek} of pregnancy. Answer the following question in ${language} with clinically accurate, empathetic, and culturally conscious advice using bullet points:\n\n"${cleanInput}"`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      const pollRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(freePrompt)}?model=openai&seed=42`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (pollRes.ok) {
        const text = await pollRes.text();
        if (text && text.trim().length > 30 && !text.includes('Rate limit') && !text.includes('429 Too Many Requests')) {
          return NextResponse.json({
            success: true,
            isEmergencyAlert: false,
            response: text.trim(),
            followUps: [
              `Week ${gestationalWeek} development tips`,
              'Safe prenatal nutrition guide',
              'Hospital bag checklist'
            ],
            source: 'generative-ai-free'
          });
        }
      }
    } catch (pollErr) {
      // Free endpoint timed out or offline, proceed to clinical engine
    }

    // 4. Robust Multilingual Clinical Knowledge Engine
    const langKey = (['en-US', 'kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'].includes(language) ? language : 'en-US');

    // Categorize user query across all 21 domains
    let topicKey: string | null = null;

    if (/^(hi|hello|hey|namaste|vanakkam|namaskara|namaskaram|who are you|help|start|good morning|good evening)/i.test(lower)) {
      topicKey = 'greeting';
    } else if (/(food|eat|diet|nutrition|iron|calcium|ragi|papaya|pineapple|protein|vitamin|caffeine|tea|coffee|kesar|saffron|dry fruit|almond|walnut|curd|paneer|what should i eat)/i.test(lower)) {
      topicKey = 'nutrition';
    } else if (/(nausea|vomit|morning sickness|throw up|sick|sour taste|gagging|hyperemesis)/i.test(lower)) {
      topicKey = 'nausea';
    } else if (/(kick|movement|flutter|active baby|counting|quickening|baby moving|kicks)/i.test(lower)) {
      topicKey = 'kicks';
    } else if (/(labor|labour|contraction|5-1-1|511|water break|dilat|delivery|birth plan)/i.test(lower)) {
      topicKey = 'labor';
    } else if (/(hospital bag|pack|bag|what to bring|checklist|nursing nightgown)/i.test(lower)) {
      topicKey = 'hospitalbag';
    } else if (/(breastfeed|latch|colostrum|breast milk|nursing baby|sore nipple)/i.test(lower)) {
      topicKey = 'breastfeeding';
    } else if (/(back pain|backache|spine|pelvic pain|pgp|sciatica|back hurts|lower back)/i.test(lower)) {
      topicKey = 'backpain';
    } else if (/(sleep|insomnia|tired|pillow|sleeping position|left side|sleeping on back|cannot sleep)/i.test(lower)) {
      topicKey = 'sleep';
    } else if (/(scan|ultrasound|anomaly|tiffa|sonography|doppler|afi|fluid level|nt scan)/i.test(lower)) {
      topicKey = 'scans';
    } else if (/(garbh sanskar|sanskar|mantra|music|raga|spiritual|meditation|pranayama|bonding|baby talk)/i.test(lower)) {
      topicKey = 'garbhsanskar';
    } else if (/(sugar|diabetes|gdm|glucose|ogtt|sweet|insulin|hba1c)/i.test(lower)) {
      topicKey = 'diabetes';
    } else if (/(heartburn|acid|acidity|reflux|gerd|burning chest|indigestion)/i.test(lower)) {
      topicKey = 'heartburn';
    } else if (/(exercise|yoga|kegel|pelvic floor|squat|walk|walking|workout)/i.test(lower)) {
      topicKey = 'exercise';
    } else if (/(travel|fly|flight|plane|flying|trip|drive|car ride)/i.test(lower)) {
      topicKey = 'travel';
    } else if (/(swell|swelling|edema|puffy|feet swollen|ankles swollen)/i.test(lower)) {
      topicKey = 'swelling';
    }

    if (topicKey && KNOWLEDGE_BASE[topicKey]) {
      const topicData = KNOWLEDGE_BASE[topicKey][langKey] || KNOWLEDGE_BASE[topicKey]['en-US'];
      if (topicData) {
        return NextResponse.json({
          success: true,
          isEmergencyAlert: false,
          response: topicData.answer,
          followUps: topicData.followUps,
          source: 'clinical-engine'
        });
      }
    }

    // 5. Intelligent Dynamic Synthesis (Specific Clinical Answer for Any Question)
    const dynamicResponse = generateClinicalSynthesis(cleanInput, motherName, gestationalWeek, langKey, userRole);

    return NextResponse.json({
      success: true,
      isEmergencyAlert: false,
      response: dynamicResponse.answer,
      followUps: dynamicResponse.followUps,
      source: 'clinical-reasoning-engine'
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing medical chat.' },
      { status: 500 }
    );
  }
}
