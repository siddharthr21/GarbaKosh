import { NextRequest, NextResponse } from 'next/server';

interface ChatRequestBody {
  message: string;
  history?: Array<{ sender: 'user' | 'assistant'; text: string }>;
  gestationalWeek?: number;
  userRole?: 'mother' | 'partner';
  language?: string;
  motherName?: string;
}

// Emergency red flags
const EMERGENCY_PATTERNS = [
  {
    regex: /(heavy bleeding|bleed|soaked pad|clots|hemorrhage|haemorrhage)/i,
    title: '🚨 CRITICAL MEDICAL ALERT: IMMEDIATE ATTENTION FOR BLEEDING',
    warning: 'Heavy or persistent vaginal bleeding, especially with large clots or dizziness, is an obstetric emergency.',
    action: 'Proceed immediately to your nearest hospital maternity emergency room or call emergency services (112 / 108 / 911) right away. Do not insert anything vaginally.'
  },
  {
    regex: /(severe headache|blurred vision|flashing spots|flashing lights|sudden swelling face|high bp|preeclampsia)/i,
    title: '⚠️ CRITICAL: POSSIBLE PREECLAMPSIA SIGNS',
    warning: 'Persistent severe headache accompanied by vision changes (flashing lights, blurriness) or sudden facial swelling can indicate dangerous blood pressure elevation.',
    action: 'Check your blood pressure immediately and contact your maternity emergency triage right away.'
  },
  {
    regex: /(not moving|no kicks|stopped moving|reduced movement|cannot feel baby)/i,
    title: '🚨 URGENT: FETAL MOVEMENT EVALUATION',
    warning: 'At 24+ weeks, significant reduction or cessation of your baby’s active kicks warrants prompt clinical fetal monitoring.',
    action: 'Drink a tall glass of ice-cold water, lie on your left side in a quiet room for 30 minutes. If 10 movements are not felt within 2 hours, proceed to maternity triage immediately.'
  },
  {
    regex: /(water broke|leaking fluid|gush of water|broken water|green fluid|brown fluid)/i,
    title: '⚠️ NOTICE: POSSIBLE RUPTURE OF MEMBRANES (WATER BREAKING)',
    warning: 'Leaking amniotic fluid requires sterile clinical assessment to prevent intrauterine infection.',
    action: 'Note fluid color and odor, use a clean maternity pad, and contact your delivery hospital triage immediately. If fluid is green or dark brown, proceed to the hospital at once.'
  },
  {
    regex: /(harm myself|kill myself|suicide|end it all|hurt baby|cannot do this anymore)/i,
    title: '❤️ WE ARE HERE FOR YOU - CRISIS SUPPORT',
    warning: 'Please know that you are not alone. Perinatal emotional distress and postpartum depression are treatable medical conditions.',
    action: 'Please call or text the Suicide & Crisis Lifeline (988), the National Mental Health Helpline (14416 in India), or emergency services (112 / 108) immediately.'
  }
];

// Rich multilingual contextual knowledge base
const MEDICAL_TOPIC_RESPONSES: Record<string, Record<string, { answer: string; followUps: string[] }>> = {
  nausea: {
    'en-US': {
      answer: `Morning sickness and nausea are very common, especially in the 1st and early 2nd trimesters, due to rising hCG and progesterone hormones.\n\n✨ **Safe Evidence-Based Comfort Measures:**\n• **Small, Frequent Meals:** Never keep an empty stomach; eat a light cracker or roasted almonds before getting out of bed.\n• **Natural Ginger Infusion:** Fresh ginger tea or lemon-ginger warm water helps settle gastric motility.\n• **Hydration Timing:** Sip water, tender coconut water, or buttermilk between meals rather than gulping with food.\n• **Vitamin B6 (Pyridoxine):** Shown to significantly reduce pregnancy nausea (discuss dosage with your doctor).\n\n⚠️ *When to contact your doctor:* If you cannot keep fluids down for over 12 hours, have dark urine, or lose weight, rule out Hyperemesis Gravidarum.`,
      followUps: ['Safe foods for first trimester', 'How to stay hydrated with nausea', 'Vitamin B6 dosage']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯ ಆರಂಭದಲ್ಲಿ ಬೆಳಗಿನ ವಾಕರಿಕೆ ಮತ್ತು ವಾಂತಿ (Morning Sickness) hCG ಹಾರ್ಮೋನ್ ಏರಿಕೆಯಿಂದ ಸಾಮಾನ್ಯವಾಗಿದೆ.\n\n✨ **ಆಯುರ್ವೇದ ಮತ್ತು ವೈದ್ಯಕೀಯ ಸಲಹೆಗಳು:**\n• **ಶುಂಠಿ ಮತ್ತು ನಿಂಬೆ ನೀರು:** ಬೆಳಿಗ್ಗೆ ಖಾಲಿ ಹೊಟ್ಟೆಯಲ್ಲಿ ಎದ್ದ ಕೂಡಲೇ ಒಣ ಬಿಸ್ಕತ್ತು ಅಥವಾ ನೆನೆಸಿದ ಬಾದಾಮಿ ತಿನ್ನಿ.\n• **ಕಿರು ಊಟ:** ದಿನದಲ್ಲಿ ಒಮ್ಮೆಗೆ ಹೆಚ್ಚು ತಿನ್ನುವ ಬದಲು, ೨-೩ ಗಂಟೆಗೊಮ್ಮೆ ಸಣ್ಣ ಪ್ರಮಾಣದಲ್ಲಿ ಪೌಷ್ಟಿಕ ಆಹಾರ ಸೇವಿಸಿ.\n• **ಎಳನೀರು ಮತ್ತು ಮಜ್ಜಿಗೆ:** ದೇಹ ನಿರ್ಜಲೀಕರಣವಾಗದಂತೆ ದಿನವಿಡೀ ಸಾಕಷ್ಟು ದ್ರವಾಹಾರ ಸೇವಿಸಿ.\n• **ವಿಶ್ರಾಂತಿ:** ಮಸಾಲೆಯುಕ್ತ, ಎಣ್ಣೆಯುಕ್ತ ಆಹಾರಗಳಿಂದ ದೂರವಿರಿ.`,
      followUps: ['ವಾಕರಿಕೆಗೆ ಸುಲಭ ಮನೆಮದ್ದು', 'ಗರ್ಭಿಣಿಯರಿಗೆ ಉತ್ತಮ ಆಹಾರ', 'ವೈದ್ಯರನ್ನು ಯಾವಾಗ ಸಂಪರ್ಕಿಸಬೇಕು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में मॉर्निंग सिकनेस और उल्टी होना एक सामान्य लक्षण है जो hCG और प्रोजेस्टेरोन हार्मोन के बढ़ने के कारण होता है।\n\n✨ **सुरक्षित और प्रभावी उपाय:**\n• **अदरक और नींबू पानी:** ताजे अदरक की चाय या नींबू-पानी मतली को तुरंत शांत करने में मदद करता है।\n• **खाली पेट न रहें:** सुबह उठने से पहले सूखे क्रैकर्स, भुने चने या बादाम खाएं।\n• **छोटे-छोटे भोजन:** दिन में 3 बड़े भोजन के बजाय 5-6 छोटे, हल्के भोजन करें।\n• **हाइड्रेशन:** दिनभर नारियल पानी, छाछ और नींबू पानी घूंट-घूंट करके पिएं।\n\n⚠️ यदि 12 घंटे से अधिक समय तक पानी भी पेट में न रुके, तो तुरंत अपने डॉक्टर से परामर्श लें।`,
      followUps: ['मॉर्निंग सिकनेस के घरेलू नुस्खे', 'गर्भावस्था में क्या खाएं', 'डॉक्टर को कब दिखाएं']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் காலை நேர வாந்தி மற்றும் குமட்டல் (Morning Sickness) ஹார்மோன் மாற்றங்களால் ஏற்படும் இயல்பான அறிகுறியாகும்.\n\n✨ **பாதுகாப்பான எளிய வழிமுறைகள்:**\n• **இஞ்சி மற்றும் எலுமிச்சை:** இஞ்சி டீ அல்லது சுடுநீரில் எலுமிச்சை சாறு அருந்துவது குமட்டலை குறைக்கும்.\n• **சிறு சிறு உணவுகள்:** ஒரே நேரத்தில் அதிகம் சாப்பிடாமல், 2-3 மணி நேரத்திற்கு ஒருமுறை சிறிய அளவில் சத்தான உணவை உட்கொள்ளுங்கள்.\n• **நீர்ச்சத்து:** இளநீர், மோர் மற்றும் எலுமிச்சை ஜூஸ் போன்றவற்றை நாள் முழுவதும் பருகவும்.\n• காலையில் எழுந்தவுடன் உலர்ந்த பிஸ்கட் அல்லது உலர் திராட்சை சாப்பிடலாம்.`,
      followUps: ['வாந்திக்கு வீட்டு வைத்தியம்', 'கர்ப்பகால சத்தான உணவுகள்', 'மருத்துவரை எப்போது அணுக வேண்டும்']
    },
    'te-IN': {
      answer: `గర్భధారణ ప్రారంభంలో మార్నింగ్ సిక్‌నెస్ మరియు వికారం సాధారణంగా హార్మోన్ల పెరుగుదల వల్ల వస్తుంది.\n\n✨ **ఉపశమన చిట్కాలు:**\n• **అల్లం మరియు నిమ్మరసం:** అల్లం టీ లేదా గోరువెచ్చని నిమ్మ నీరు వికారాన్ని తగ్గిస్తుంది.\n• **చిన్న చిన్న భోజనాలు:** కడుపు ఖాళీగా ఉంచవద్దు; ప్రతి 2-3 గంటలకు తేలికపాటి పౌష్టికాహారం తీసుకోండి.\n• **హైడ్రేషన్:** కొబ్బరి నీళ్లు, మజ్జిగ పుష్కలంగా తాగండి.\n• ఉదయం లేవగానే డ్రై బిస్కెట్లు లేదా బాదం పప్పులు తినడం మంచిది.`,
      followUps: ['వికారానికి ఇంటి చిట్కాలు', 'గర్భధారణలో పోషకాహారం', 'వైద్యుడిని ఎప్పుడు సంప్రదించాలి']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ ആദ്യ മാസങ്ങളിലെ ഓക്കാനവും ഛർദ്ദിയും (Morning Sickness) ഹോർമോൺ വ്യതിയാനങ്ങൾ മൂലമുണ്ടാകുന്ന സാധാരണ ലക്ഷണമാണ്.\n\n✨ **ലളിതമായ ആശ്വാസ മാർഗ്ഗങ്ങൾ:**\n• **ഇഞ്ചി ചായ:** ചെറുചൂടുള്ള ഇഞ്ചി വെള്ളമോ നാരങ്ങാവെള്ളമോ കുടിക്കുന്നത് ഓക്കാനം കുറയ്ക്കും.\n• **ചെറിയ അളവിൽ ഭക്ഷണം:** വയർ ഒഴിഞ്ഞിരിക്കാൻ അനുവദിക്കരുത്; 2-3 മണിക്കൂർ കൂടുമ്പോൾ പോഷകസമൃദ്ധമായ ലഘുഭക്ഷണം കഴിക്കുക.\n• **ധാരാളം ദ്രാവകങ്ങൾ:** ഇളനീർ, സംഭാരം (മോര്) എന്നിവ ധാരാളമായി കുടിക്കുക.`,
      followUps: ['ഛർദ്ദിക്കുള്ള പ്രതിവിധികൾ', 'ഗർഭകാല ഭക്ഷണക്രമം', 'ഡോക്ടറെ കാണേണ്ട സന്ദർഭങ്ങൾ']
    }
  },
  kicks: {
    'en-US': {
      answer: `Baby kicks (Quickening) are one of the most magical milestones! First-time mothers typically feel them between 18–22 weeks, while experienced mothers may notice them around 16–18 weeks.\n\n✨ **Kick Counting & Tracking Routine (From Week 24+):**\n• **Daily Kick Counts:** Choose a consistent time when baby is most active (usually 8:00 PM – 10:00 PM after dinner).\n• **The 10-Movement Goal:** Sit comfortably or lie on your left side. You should feel **10 distinct movements** (swishes, rolls, flutters, kicks) within **2 hours**.\n• **Stimulation Tip:** If baby seems sleepy, drink cold water or fresh fruit juice and gently massage your belly.\n\n🚨 *Alert:* If you feel a noticeable reduction or absence of movements over a 2-hour window, contact maternity triage immediately.`,
      followUps: ['How to do kick counting in BloomNest', 'Normal baby sleep cycles inside womb', 'When do kicks get strongest?']
    },
    'kn-IN': {
      answer: `ಮಗುವಿನ ಮೊದಲ ಚಲನೆ ಅಥವಾ ಒದೆತ (Fetal Kicks) ಗರ್ಭಾವಸ್ಥೆಯ ಅತ್ಯಂತ ಆನಂದದಾಯಕ ಅನುಭವ. ಸಾಮಾನ್ಯವಾಗಿ ೧೮ ರಿಂದ ೨೪ ವಾರಗಳ ನಡುವೆ ಮಗುವಿನ ಚಲನೆ ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಯುತ್ತದೆ.\n\n✨ **ಒದೆತಗಳನ್ನು ಎಣಿಸುವ ವಿಧಾನ:**\n• **ಸಂಜೆಯ ಸಮಯ:** ಊಟದ ನಂತರ ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿ ಮಗುವಿನ ಚಲನೆಯನ್ನು ಗಮನಿಸಿ.\n• **೨ ಗಂಟೆಗಳಲ್ಲಿ ೧೦ ಚಲನೆಗಳು:** ೨ ಗಂಟೆಯೊಳಗೆ ಮಗು ಕನಿಷ್ಠ ೧೦ ಬಾರಿ ಚಲಿಸಬೇಕು.\n• ಮಗು ವಿಶ್ರಾಂತಿಯಲ್ಲಿದ್ದರೆ ತಣ್ಣೀರು ಕುಡಿದು ನಿಧಾನವಾಗಿ ಹೊಟ್ಟೆಯ ಮೇಲೆ ಕೈಯಾಡಿಸಿ.\n\n🚨 *ಎಚ್ಚರಿಕೆ:* ಚಲನೆ ತೀರಾ ಕಡಿಮೆಯಾದರೆ ತಕ್ಷಣವೇ ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.`,
      followUps: ['ಕಿಕ್ ಕೌಂಟರ್ ಬಳಸುವುದು ಹೇಗೆ', 'ಗರ್ಭದಲ್ಲಿ ಮಗುವಿನ ಬೆಳವಣಿಗೆ', 'ತುರ್ತು ಲಕ್ಷಣಗಳು']
    },
    'hi-IN': {
      answer: `गर्भ में शिशु की पहली हलचल (Baby Kicks) 18 से 22 हफ्तों के बीच महसूस होने लगती है। 24 हफ्तों के बाद किक काउंटिंग शुरू करना बहुत जरूरी है।\n\n✨ **किक गिनने का सही नियम:**\n• **शांत समय चुनें:** रात के भोजन के बाद बाईं करवट लेकर लेटें।\n• **2 घंटे में 10 हलचल:** 2 घंटे के भीतर कम से कम 10 स्पष्ट हलचलें (किक, रोल या फड़फड़ाहट) महसूस होनी चाहिए।\n• यदि शिशु शांत लगे, तो ठंडा पानी पिएं या टहलें।\n\n🚨 यदि 2 घंटे में 10 किक महसूस न हों, तो तुरंत अपनी मैटरनिटी यूनिट से संपर्क करें।`,
      followUps: ['किक ट्रैकर कैसे इस्तेमाल करें', 'शिशु की हलचल कम होने पर क्या करें', '24वें हफ्ते में शिशु का आकार']
    },
    'ta-IN': {
      answer: `கருவில் குழந்தையின் அசைவுகள் (Baby Kicks) 18 முதல் 22 வாரங்களில் தொடங்குகிறது. 24 வாரங்களுக்குப் பிறகு குழந்தையின் அசைவுகளைக் கண்காணிப்பது முக்கியமாகும்.\n\n✨ **கிக் கவுண்டிங் வழிகாட்டுதல்:**\n• இரவு உணவிற்குப் பிறகு இடது பக்கமாக ஒருக்களித்துப் படுத்து கவனிக்கவும்.\n• **2 மணி நேரத்தில் 10 அசைவுகள்:** குழந்தை 2 மணி நேரத்திற்குள் 10 முறை அசைய வேண்டும்.\n• அசைவு குறைவாகத் தோன்றினால் குளிர்ந்த நீர் குடித்து வயிற்றை மென்மையாகத் தடவவும்.`,
      followUps: ['கிக் கவுண்டர் பயன்பாடு', 'குழந்தையின் வளர்ச்சி நிலைகள்', 'அவசர சிகிச்சை']
    },
    'te-IN': {
      answer: `శిశువు కదలికలు (Baby Kicks) సాధారణంగా 18-22 వారాల మధ్య తెలుస్తాయి. 24 వారాల నుండి రోజువారీ కిక్ కౌంటింగ్ చేయడం మంచిది.\n\n✨ **కిక్స్ లెక్కించే విధానం:**\n• భోజనం తర్వాత ఎడమ వైపు తిరిగి పడుకోండి.\n• **2 గంటల్లో 10 కదలికలు:** 2 గంటల వ్యవధిలో కనీసం 10 కదలికలను నమోదు చేసుకోవాలి.\n• కదలికలు తగ్గితే చల్లటి నీరు తాగి గమనించండి.`,
      followUps: ['కిక్ కౌంటింగ్ ఎలా చేయాలి', 'శిశువు పెరుగుదల దశలు', 'డాక్టర్ సలహాలు']
    },
    'ml-IN': {
      answer: `കുഞ്ഞിന്റെ ഇളക്കങ്ങൾ (Fetal Movements) 18 മുതൽ 22 ആഴ്ചകൾക്കുള്ളിൽ അനുഭവപ്പെടാൻ തുടങ്ങും. 24 ആഴ്ചകൾക്കു ശേഷം ദിവസവും ശ്രദ്ധിക്കേണ്ടതുണ്ട്.\n\n✨ **കിക്ക് കൗണ്ടിംഗ് നിർദ്ദേശങ്ങൾ:**\n• ഭക്ഷണത്തിനു ശേഷം ഇടതുവശം ചരിഞ്ഞു കിടക്കുക.\n• **2 മണിക്കൂറിൽ 10 ഇളക്കങ്ങൾ:** സാധാരണയായി 2 മണിക്കൂറിനുള്ളിൽ 10 ചലനങ്ങൾ അനുഭവപ്പെടണം.\n• അനക്കം കുറവാണെങ്കിൽ തണുത്ത വെള്ളം കുടിച്ചു നിരീക്ഷിക്കുക.`,
      followUps: ['കിക്ക് കൗണ്ടർ ഉപയോഗം', 'കുഞ്ഞിന്റെ വളർച്ചാ ഘട്ടങ്ങൾ', 'പ്രധാന മുന്നറിയിപ്പുകൾ']
    }
  },
  labor: {
    'en-US': {
      answer: `Recognizing the onset of true labor vs Braxton Hicks contractions is vital as your due date approaches.\n\n✨ **The Golden 5-1-1 Rule for Active Labor:**\n• **5 Minutes Apart:** Contractions arrive consistently every 5 minutes from start of one to start of next.\n• **1 Minute Long:** Each contraction lasts a solid 60 seconds and does not stop when you walk or change posture.\n• **1 Hour Continuous:** This pattern persists non-stop for at least 1 full hour.\n\n✨ **True Labor vs Braxton Hicks:**\n• *Braxton Hicks:* Irregular, mild tightness in lower belly, stops when drinking water or resting.\n• *True Labor:* Starts in lower back and radiates to front, grows steadily stronger, longer, and closer together.\n\n🎒 *Next Steps:* Grab your packed BloomNest hospital bag and notify your birth partner and maternity hospital!`,
      followUps: ['What to pack in hospital bag', 'How to time contractions in BloomNest', 'Comfort measures for early labor']
    },
    'kn-IN': {
      answer: `ನಿಜವಾದ ಹೆರಿಗೆ ನೋವು ಮತ್ತು ಸುಳ್ಳು ನೋವಿನ (Braxton Hicks) ವ್ಯತ್ಯಾಸ ತಿಳಿಯುವುದು ಮುಖ್ಯ.\n\n✨ **ಹೆರಿಗೆ ನೋವಿನ ೫-೧-೧ ನಿಯಮ:**\n• **೫ ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ:** ಪ್ರತಿ ೫ ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ನೋವು ನಿಯಮಿತವಾಗಿ ಬರುತ್ತದೆ.\n• **೧ ನಿಮಿಷದ ಅವಧಿ:** ಪ್ರತಿ ಸಂಕೋಚನವು ಪೂರ್ಣ ೬೦ ಸೆಕೆಂಡುಗಳ ಕಾಲ ಇರುತ್ತದೆ.\n• **೧ ಗಂಟೆ ನಿರಂತರ:** ಈ ಮಾದರಿಯು ಕನಿಷ್ಠ ೧ ಗಂಟೆಗಳ ಕಾಲ ಸತತವಾಗಿ ಮುಂದುವರಿಯುತ್ತದೆ.\n\n✨ ನೀವು ವಿಶ್ರಮಿಸಿದರೂ ನೋವು ಕಡಿಮೆಯಾಗದಿದ್ದರೆ ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ತೆರಳಿ.`,
      followUps: ['ಹೆರಿಗೆ ಚೀಲದಲ್ಲಿ ಏನಿರಬೇಕು', 'ಕಂಟ್ರಾಕ್ಷನ್ ಟೈಮರ್ ಬಳಕೆ', 'ಹೆರಿಗೆ ಸಿದ್ಧತೆಗಳು']
    },
    'hi-IN': {
      answer: `सच्चे प्रसव संकुचन (True Labor) और फॉल्स लेबर (Braxton Hicks) में अंतर समझना बहुत आवश्यक है।\n\n✨ **गोल्डन 5-1-1 नियम:**\n• **5 मिनट का अंतर:** संकुचन हर 5 मिनट में नियमित रूप से आएं।\n• **1 मिनट की अवधि:** प्रत्येक संकुचन कम से कम 60 सेकंड तक चले।\n• **1 घंटा लगातार:** यह क्रम 1 घंटे तक लगातार बना रहे।\n\n✨ यदि पानी की थैली फट जाए (Water Break) या रक्तस्राव हो, तो बिना देर किए सीधे मैटरनिटी अस्पताल जाएं।`,
      followUps: ['हॉस्पिटल बैग चेकलिस्ट', 'संकुचन टाइमर कैसे चलाएं', 'प्रसव के शुरुआती लक्षण']
    },
    'ta-IN': {
      answer: `உண்மையான பிரசவ வலி மற்றும் போலி வலிக்குமான (Braxton Hicks) வேறுபாட்டை அறிவது அவசியம்.\n\n✨ **பிரசவத்தின் 5-1-1 பொன் விதி:**\n• **5 நிமிட இடைவெளி:** வலிகள் ஒவ்வொரு 5 நிமிடங்களுக்கும் ஒருமுறை சீராக வரும்.\n• **1 நிமிட கால அளவு:** வலி 60 வினாடிகள் தொடர்ந்து நீடிக்கும்.\n• **1 மணி நேரம் தொடர்ச்சி:** இந்த சுழற்சி 1 மணி நேரம் தொடர்ந்து நீடிக்கும்.\n\n✨ இந்த நிலையை அடைந்ததும் உடனே பிரசவ வார்டுக்கு செல்லவும்.`,
      followUps: ['மருத்துவமனை பை பட்டியல்', 'பிரசவ வலி டைமர்', 'இயற்கை பிரசவ வழிகாட்டுதல்']
    },
    'te-IN': {
      answer: `కాన్పు నొప్పుల 5-1-1 సువర్ణ నియమం ప్రసవ సమయాన్ని ఖచ్చితంగా గుర్తించడంలో సహాయపడుతుంది.\n\n✨ **5-1-1 నియమం:**\n• ప్రతి 5 నిమిషాలకు ఒకసారి నొప్పులు రావడం.\n• ప్రతి నొప్పి 1 నిమిషం పాటు బలంగా ఉండటం.\n• ఈ క్రమం కనీసం 1 గంట నిరంతరంగా కొనసాగడం.\n\n✨ వెంటనే హాస్పిటల్ బ్యాగ్ సిద్ధం చేసుకుని డెలివరీ ఆసుపత్రికి బయలుదేరండి.`,
      followUps: ['హాస్పిటల్ బ్యాగ్ చెక్‌లిస్ట్', 'నొప్పుల టైమర్', 'ప్రసవ జాగ్రత్తలు']
    },
    'ml-IN': {
      answer: `യഥാർത്ഥ പ്രസവവേദന തിരിച്ചറിയാൻ 5-1-1 സുവർണ്ണ നിയമം ഓർക്കുക.\n\n✨ **5-1-1 നിയമം:**\n• ഓരോ 5 മിനിറ്റിലും വേദന ആവർത്തിക്കുക.\n• ഓരോ വേദനയും 1 മിനിറ്റ് (60 സെക്കൻഡ്) നീണ്ടുനിൽക്കുക.\n• ഈ ക്രമം 1 മണിക്കൂർ തുടർച്ചയായി നിൽക്കുക.\n\n✨ ഈ ലക്ഷണങ്ങൾ കണ്ടാൽ ഒട്ടും വൈകാതെ പ്രസവാശുപത്രിയിലെത്തുക.`,
      followUps: ['ഹോസ്പിറ്റൽ ബാഗ് ലിസ്റ്റ്', 'പ്രസവ ലക്ഷണങ്ങൾ', 'വേദന നിയന്ത്രണ വഴികൾ']
    }
  },
  nutrition: {
    'en-US': {
      answer: `Healthy maternal nutrition directly builds your baby’s brain, bones, and organs while keeping your energy balanced.\n\n✨ **Key Daily Nutritional Priorities:**\n• **Iron & Hemoglobin:** Dark green leafy vegetables (spinach, methi), lentils, beetroot, pomegranate, and jaggery. Take iron supplements with Vitamin C (orange or lemon) for absorption; avoid taking with dairy/tea.\n• **Calcium & Vitamin D:** 1,000–1,200 mg daily from milk, yogurt (curd), paneer, sesame seeds (til), and ragi.\n• **DHA & Choline:** Walnuts, chia seeds, eggs, or algae DHA supplements for baby's neural development.\n• **Hydration:** Aim for 8–10 glasses (2.5 to 3 liters) of fluids daily (water, coconut water, buttermilk).\n\n🚫 *Foods to Avoid:* Unpasteurized milk/cheese, raw papaya, excessive caffeine (>200mg/day), raw sprouts, and unwashed vegetables.`,
      followUps: ['Best Indian pregnancy recipes', 'Iron-rich vegetarian diet plan', 'Gestational diabetes guidelines']
    },
    'kn-IN': {
      answer: `ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಪೌಷ್ಟಿಕ ಆಹಾರವು ಮಗುವಿನ ಮೆದುಳು ಮತ್ತು ಮೂಳೆಗಳ ಬೆಳವಣಿಗೆಗೆ ಅತ್ಯಗತ್ಯ.\n\n✨ **ದೈನಂದಿನ ಪೋಷಕಾಂಶಗಳು:**\n• **ಕಬ್ಬಿಣಾಂಶ (Iron):** ರಾಗಿ ಮುದ್ದೆ, ಪಾಲಕ್ ಸೊಪ್ಪು, ಮೆಂತ್ಯ, ಬೀಟ್‌ರೂಟ್, ದಾಳಿಂಬೆ ಮತ್ತು ಬೆಲ್ಲ.\n• **ಕ್ಯಾಲ್ಸಿಯಂ:** ಹಾಲು, ಗಟ್ಟಿ ಮೊಸರು, ಪನ್ನೀರ್ ಮತ್ತು ಎಳ್ಳು.\n• **ಪ್ರೋಟೀನ್:** ತೊಗರಿಬೇಳೆ, ಕಡಲೆಕಾಳು, ಹೆಸರುಕಾಳು ಮತ್ತು ಮೊಳಕೆಕಾಳುಗಳು.\n• **ದ್ರವಾಹಾರ:** ದಿನಕ್ಕೆ ೮-೧೦ ಲೋಟ ನೀರು ಮತ್ತು ಎಳನೀರು ಕುಡಿಯಿರಿ.`,
      followUps: ['ರಾಗಿ ಮತ್ತು ಬೇಳೆ ಆಹಾರ ಕ್ರಮ', 'ಗರ್ಭಿಣಿಯರ ಡಯಟ್ ಚಾರ್ಟ್', 'ತಪ್ಪಿಸಬೇಕಾದ ಆಹಾರಗಳು']
    },
    'hi-IN': {
      answer: `गर्भावस्था में संतुलित और पौष्टिक आहार मां और शिशु दोनों के स्वस्थ विकास के लिए अनिवार्य है।\n\n✨ **प्रमुख पोषक तत्व:**\n• **आयरन और हीमोग्लोबिन:** पालक, मेथी, चुकंदर, अनार, दालें और गुड़। आयरन की गोलियां नींबू पानी के साथ लें।\n• **कैल्शियम और प्रोटीन:** दूध, दही, पनीर, रागी, चना, मूंग दाल और बादाम।\n• **हाइड्रेशन:** दिनभर में 8-10 गिलास पानी, नारियल पानी और ताजा छाछ पिएं।\n• **कच्चा पपीता और अनानास** के अत्यधिक सेवन से बचें।`,
      followUps: ['शाकाहारी भारतीय डाइट चार्ट', 'आयरन बढ़ाने वाले खाद्य पदार्थ', 'गर्भावस्था में क्या न खाएं']
    },
    'ta-IN': {
      answer: `கர்ப்ப காலத்தில் சத்தான சரிவிகித உணவு தாய்க்கும் சேய்க்கும் மிகவும் அவசியமாகும்.\n\n✨ **முக்கிய சத்துக்கள்:**\n• **இரும்புச்சத்து:** பசலைக்கீரை, முருங்கைக்கீரை, மாதுளை, பேரீச்சம்பழம் மற்றும் பருப்பு வகைகள்.\n• **கால்சியம் & புரதம்:** பால், தயிர், பன்னீர், கேழ்வரகு (ராகி), சுண்டல்.\n• **நீர்ச்சத்து:** நாள் ஒன்றுக்கு 8-10 டம்ளர் தண்ணீர் மற்றும் இளநீர் அருந்தவும்.`,
      followUps: ['ராகி உணவு முறைகள்', 'கர்ப்பகால உணவு அட்டவணை', 'தவிர்க்க வேண்டியவை']
    },
    'te-IN': {
      answer: `గర్భిణీ స్త్రీలకు పోషకాహారం శిశువు ఎదుగుదలకు అత్యంత ప్రాముఖ్యమైనది.\n\n✨ **ముఖ్యమైన ఆహారాలు:**\n• **ఐరన్:** పాలకూర, బీట్‌రూట్, దానిమ్మ, ఖర్జూరం, తోటకూర.\n• **కాల్షియం:** పాలు, పెరుగు, రాగులు, పనీర్.\n• **ప్రోటీన్:** పప్పు ధాన్యాలు, శనగలు, గుడ్లు.\n• రోజుకు కనీసం 8-10 గ్లాసుల నీరు, కొబ్బరి నీళ్లు తాగండి.`,
      followUps: ['గర్భిణీ డైట్ చార్ట్', 'ఐరన్ పెంచే ఆహారాలు', 'నివారించాల్సిన ఆహారాలు']
    },
    'ml-IN': {
      answer: `ഗർഭകാലത്തെ സന്തുലിതമായ പോഷകാഹാരം കുഞ്ഞിന്റെ ആരോഗ്യകരമായ വളർച്ചയ്ക്ക് അത്യന്താപേക്ഷിതമാണ്.\n\n✨ **പ്രധാന പോഷകങ്ങൾ:**\n• **ഇരുമ്പ് (Iron):** ചീര, മുരിങ്ങയില, ഈന്തപ്പഴം, മാതളനാരങ്ങ, പയറുവർഗ്ഗങ്ങൾ.\n• **കാൽസ്യം:** പാൽ, തൈര്, റാഗി, മുട്ട.\n• ദിവസവും കുറഞ്ഞത് 8-10 ഗ്ലാസ് വെള്ളവും ഇളനീരും കുടിക്കുക.`,
      followUps: ['ഗർഭകാല ഭക്ഷണരീതികൾ', 'റാഗിയുടെ ഗുണങ്ങൾ', 'ഒഴിവാക്കേണ്ട ഭക്ഷണങ്ങൾ']
    }
  }
};

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

    // 1. Red Flag Medical Emergency Check
    for (const flag of EMERGENCY_PATTERNS) {
      if (flag.regex.test(lower)) {
        return NextResponse.json({
          success: true,
          isEmergencyAlert: true,
          emergencyTitle: flag.title,
          emergencyWarning: flag.warning,
          emergencyAction: flag.action,
          response: `⚠️ **${flag.title}**\n\n${flag.warning}\n\n**URGENT ACTION:** ${flag.action}\n\n*DISCLAIMER: BloomNest AI cannot replace physical in-person emergency hospital triage.*`,
          followUps: [
            'Call Doctor Emergency Line',
            'Find Nearest Maternity Emergency Room',
            'Connect with Partner Immediately'
          ],
          source: 'emergency-triage-filter'
        });
      }
    }

    // 2. Check for Gemini API key
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (geminiApiKey) {
      try {
        const systemPrompt = `You are Bloom AI / GarbaKosh, a warm, compassionate, clinically sound pregnancy and parenthood companion designed for Indian mothers and partners.
The user is ${motherName}, currently in Week ${gestationalWeek} of pregnancy (Account role: ${userRole}).
Language requested: ${language}.
Provide supportive, evidence-based obstetric/pediatric guidance with clear actionable steps, home comfort remedies, and when to seek medical evaluation.
Honor traditional Indian maternal practices like Garbh Sanskar, ayurvedic nourishment (ragi, lentils, methi, dry fruits, seemantham/godh bharai customs) without promoting unsafe folklore.
Always reply naturally, directly, and fluently in the requested language (${language}). Keep formatting neat with markdown bullet points and friendly emojis.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemPrompt}\n\nConversation Context: Prior messages = ${JSON.stringify(history.slice(-4))}\n\nUser asked: "${cleanInput}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            return NextResponse.json({
              success: true,
              isEmergencyAlert: false,
              response: candidateText,
              followUps: [
                'Tell me more about Week ' + gestationalWeek,
                'What safe exercises can I do today?',
                'Nutrition advice for today'
              ],
              source: 'gemini-1.5-flash'
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to clinical reasoning engine:', geminiError);
      }
    }

    // 3. Robust Multilingual Clinical Knowledge Engine
    const langKey = (['en-US', 'kn-IN', 'hi-IN', 'ta-IN', 'te-IN', 'ml-IN'].includes(language) ? language : 'en-US');

    // Determine topic
    let topicKey = 'general';
    if (/(nausea|vomit|morning sickness|throw up|sick|sour taste)/i.test(lower)) {
      topicKey = 'nausea';
    } else if (/(kick|movement|flutter|active baby|counting|quickening)/i.test(lower)) {
      topicKey = 'kicks';
    } else if (/(labor|labour|contraction|5-1-1|water break|hospital bag|dilat)/i.test(lower)) {
      topicKey = 'labor';
    } else if (/(food|eat|diet|nutrition|iron|calcium|ragi|papaya|protein|vitamin)/i.test(lower)) {
      topicKey = 'nutrition';
    }

    if (MEDICAL_TOPIC_RESPONSES[topicKey] && MEDICAL_TOPIC_RESPONSES[topicKey][langKey]) {
      const topicData = MEDICAL_TOPIC_RESPONSES[topicKey][langKey];
      return NextResponse.json({
        success: true,
        isEmergencyAlert: false,
        response: topicData.answer,
        followUps: topicData.followUps,
        source: 'clinical-engine'
      });
    }

    // Default intelligent week-specific response in target language
    const weekResponses: Record<string, string> = {
      'en-US': `Hello ${motherName}! 🌸 At Week ${gestationalWeek}, your baby is growing rapidly, developing sensitive hearing, opening eyelids, and practicing rhythmic breathing movements.\n\n✨ **Guidance for Your Current Stage:**\n• **Rest & Posture:** Rest on your left side to maximize maternal-fetal oxygenation.\n• **Gentle Movement:** 20–30 minutes of prenatal walking or pelvic floor Kegel exercises helps maintain hip flexibility.\n• **Hydration & Fiber:** Drink plenty of water and enjoy seasonal fruits, tender coconut water, and high-fiber oats or ragi to prevent constipation.\n\nHow are you feeling today? You can ask me about safe movements, nutrition, hospital preparations, or contraction timing!`,
      'kn-IN': `ನಮಸ್ಕಾರ ${motherName}! 🌸 ಗರ್ಭಾವಸ್ಥೆಯ ${gestationalWeek}ನೇ ವಾರದಲ್ಲಿ ನಿಮ್ಮ ಮಗು ಶಬ್ದಗಳನ್ನು ಆಲಿಸಲು ಪ್ರಾರಂಭಿಸುತ್ತದೆ ಮತ್ತು ವೇಗವಾಗಿ ಬೆಳೆಯುತ್ತಿದೆ.\n\n✨ **ಈ ವಾರದ ಪ್ರಮುಖ ಸಲಹೆಗಳು:**\n• ಮಲಗುವಾಗ ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿ ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.\n• ಪ್ರತಿದಿನ ೨೦-೩೦ ನಿಮಿಷಗಳ ಲಘು ನಡಿಗೆ ಮತ್ತು ಪೆಲ್ವಿಕ್ ವ್ಯಾಯಾಮ ಮಾಡಿ.\n• ಎಳನೀರು, ಮಜ್ಜಿಗೆ ಮತ್ತು ಹಸಿರು ತರಕಾರಿಗಳನ್ನು ಆಹಾರದಲ್ಲಿ ಹೆಚ್ಚಾಗಿ ಬಳಸಿ.\n\nನೀವು ಹೇಗಿದ್ದೀರಿ? ಯಾವುದೇ ಆರೋಗ್ಯದ ಸಂದೇಹಗಳು, ಆಹಾರ ಅಥವಾ ಹೆರಿಗೆ ಸಿದ್ಧತೆಯ ಬಗ್ಗೆ ಕೇಳಿ!`,
      'hi-IN': `नमस्ते ${motherName}! 🌸 गर्भावस्था के ${gestationalWeek}वें हफ्ते में आपका शिशु तेजी से विकसित हो रहा है और आपकी आवाज को सुनने लगा है।\n\n✨ **इस हफ्ते के लिए खास सलाह:**\n• हमेशा बाईं करवट लेकर सोने की आदत डालें, जिससे शिशु को पर्याप्त ऑक्सीजन मिलती रहे।\n• प्रतिदिन 20-30 मिनट की हल्की सैर और पेल्विक फ्लोर व्यायाम करें।\n• नारियल पानी, मौसमी फल और हरी पत्तेदार सब्जियां अपनी डाइट में शामिल करें।\n\nआप कैसा महसूस कर रही हैं? आप मुझसे पोषण, शिशु की हलचल या प्रसव की तैयारी से जुड़ा कोई भी सवाल पूछ सकती हैं!`,
      'ta-IN': `வணக்கம் ${motherName}! 🌸 கர்ப்பத்தின் ${gestationalWeek}-வது வாரத்தில் உங்கள் குழந்தை விரைவாக வளர்ந்து வருகிறது.\n\n✨ **இந்த வாரத்திற்கான முக்கிய குறிப்புகள்:**\n• இடது பக்கமாக படுத்து தூங்குவது ரத்த ஓட்டத்தை சீராக்கும்.\n• தினமும் 20-30 நிமிடங்கள் மிதமான நடைபயிற்சி மேற்கொள்ளவும்.\n• இளநீர், சத்தான பழங்கள் மற்றும் கீரைகளை உணவில் சேர்த்துக் கொள்ளவும்.\n\nஉங்களுக்கு ஏதேனும் சந்தேகங்கள் இருந்தால் தாராளமாக கேளுங்கள்!`,
      'te-IN': `నమస్కారం ${motherName}! 🌸 గర్భధారణ ${gestationalWeek}వ వారంలో మీ శిశువు శబ్దాలను వింటూ వేగంగా ఎదుగుతోంది.\n\n✨ **ఈ వారపు ముఖ్యమైన సూచనలు:**\n• నిద్రపోయేటప్పుడు ఎడమ వైపు తిరిగి పడుకోండి.\n• రోజూ 20-30 నిమిషాలు తేలికపాటి నడక చేయండి.\n• కొబ్బరి నీళ్లు, ఆకుకూరలు, పండ్లు ఆహారంలో భాగం చేసుకోండి.\n\nమీరు ఏవైనా సందేహాలుంటే నన్ను అడగవచ్చు!`,
      'ml-IN': `നമസ്കാരം ${motherName}! 🌸 ഗർഭത്തിന്റെ ${gestationalWeek}-ാം ആഴ്ചയിൽ നിങ്ങളുടെ കുഞ്ഞ് വളരെ വേഗത്തിൽ വളരുകയാണ്.\n\n✨ **ഈ ആഴ്ചയിലെ പ്രധാന നിർദ്ദേശങ്ങൾ:**\n• ഇടതുവശം ചരിഞ്ഞു കിടന്നു വിശ്രമിക്കുക.\n• ദിവസവും 20-30 മിനിറ്റ് ലഘുവായ നടത്തം ശീലമാക്കുക.\n• ധാരാളം വെള്ളം കുടിക്കുകയും ഇളനീരും ഇലക്കറികളും കഴിക്കുകയും ചെയ്യുക.\n\nഎന്തെങ്കിലും സംശയങ്ങളുണ്ടെങ്കിൽ ചോദിക്കാവുന്നതാണ്!`
    };

    const finalAnswer = weekResponses[langKey] || weekResponses['en-US'];

    return NextResponse.json({
      success: true,
      isEmergencyAlert: false,
      response: finalAnswer,
      followUps: [
        'Safe prenatal exercises for Week ' + gestationalWeek,
        'Best foods to boost hemoglobin',
        'Hospital bag checklist'
      ],
      source: 'clinical-engine'
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing medical chat.' },
      { status: 500 }
    );
  }
}
