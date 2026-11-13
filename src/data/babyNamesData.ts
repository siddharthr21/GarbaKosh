export interface BabyNameRecord {
  id: string;
  name: string;
  gender: 'boy' | 'girl' | 'neutral';
  origin: string;
  meaning: string;
  pronunciation: string;
  culturalContext: string;
  style: 'Modern' | 'Traditional' | 'Sanskrit Classic' | 'Royal';
  popularityScore: number;
  localizedNames?: Record<string, string>;
  localizedMeanings?: Record<string, string>;
}

export const BABY_NAMES_DATABASE: BabyNameRecord[] = [
  {
    "id": "n1",
    "name": "Aadhya",
    "gender": "girl",
    "origin": "Sanskrit / Indian",
    "meaning": "First power; Beginning; Root of all creation (an epithet of Goddess Durga)",
    "pronunciation": "Aah-dh-yah",
    "culturalContext": "Celebrated across Indian families as a symbol of divine feminine energy.",
    "style": "Sanskrit Classic",
    "popularityScore": 98,
    "localizedNames": {
      "en-US": "Aadhya",
      "kn-IN": "ಆದ್ಯಾ",
      "hi-IN": "आद्या",
      "ta-IN": "ஆத்யா",
      "te-IN": "ఆద్య",
      "ml-IN": "ആദ്യ"
    },
    "localizedMeanings": {
      "en-US": "First power; Beginning; Root of all creation (Goddess Durga)",
      "kn-IN": "ಮೊದಲ ಶಕ್ತಿ; ಆರಂಭ; ಸೃಷ್ಟಿಯ ಮೂಲ (ದುರ್ಗಾ ದೇವಿಯ ಹೆಸರು)",
      "hi-IN": "प्रथम शक्ति; आरंभ; सृष्टि का मूल (देवी दुर्गा)",
      "ta-IN": "முதல் சக்தி; ஆரம்பம்; படைப்பின் வேர் (துர்க்கை அம்மன்)",
      "te-IN": "మొదటి శక్తి; ప్రారంభం; సృష్టికి మూలం (దుర్గా దేవి)",
      "ml-IN": "ആദ്യത്തെ ശക്തി; ആരംഭം; സൃഷ്ടിയുടെ മൂലം (ദുർഗ്ഗാദേവി)"
    }
  },
  {
    "id": "n2",
    "name": "Aarav",
    "gender": "boy",
    "origin": "Sanskrit / Hindi",
    "meaning": "Peaceful; Harmonious sound; Gentle wisdom",
    "pronunciation": "Ah-ruv",
    "culturalContext": "Extremely popular modern Indian name signifying tranquility and clarity.",
    "style": "Modern",
    "popularityScore": 99,
    "localizedNames": {
      "en-US": "Aarav",
      "kn-IN": "ಆರವ್",
      "hi-IN": "आरव",
      "ta-IN": "ஆரவ்",
      "te-IN": "ఆరవ్",
      "ml-IN": "ആരവ്"
    },
    "localizedMeanings": {
      "en-US": "Peaceful; Harmonious sound; Gentle wisdom",
      "kn-IN": "ಶಾಂತಿಯುತ; ಮಧುರವಾದ ಧ್ವನಿ; ಶಾಂತ ಜ್ಞಾನ",
      "hi-IN": "शांत; मधुर ध्वनि; ज्ञानवान",
      "ta-IN": "அமைதியான; இனிய குரல்; மென்மையான ஞானம்",
      "te-IN": "ప్రశాంతమైన; మధురమైన శబ్దం; సున్నితమైన జ్ఞానం",
      "ml-IN": "സമാധാനപൂർണ്ണമായ; മധുരശബ്ദം; സൗമ്യജ്ഞാനം"
    }
  },
  {
    "id": "n3",
    "name": "Ananya",
    "gender": "girl",
    "origin": "Sanskrit / Bengali / Tamil",
    "meaning": "Unique; Matchless; One without equal",
    "pronunciation": "Uh-nun-yah",
    "culturalContext": "Timeless poetic name used across Southern and Northern India.",
    "style": "Traditional",
    "popularityScore": 95,
    "localizedNames": {
      "en-US": "Ananya",
      "kn-IN": "ಅನನ್ಯಾ",
      "hi-IN": "अनन्या",
      "ta-IN": "அனன்யா",
      "te-IN": "అనన్య",
      "ml-IN": "അനന്യ"
    },
    "localizedMeanings": {
      "en-US": "Unique; Matchless; One without equal",
      "kn-IN": "ಅದ್ವಿತೀಯ; ಸಾಟಿಯಿಲ್ಲದ; ಅಪೂರ್ವ ವ್ಯಕ್ತಿತ್ವ",
      "hi-IN": "अद्वितीय; अनुपम; जिसकी कोई बराबरी न हो",
      "ta-IN": "தனித்துவமான; நிகரற்ற; ஈடு இணையற்ற",
      "te-IN": "సాటిలేని; అసమానమైన; ప్రత్యేకమైన",
      "ml-IN": "അതുല്യമായ; സമാനതകളില്ലാത്ത; അദ്വിതീയ"
    }
  },
  {
    "id": "n4",
    "name": "Advik",
    "gender": "boy",
    "origin": "Sanskrit",
    "meaning": "Unique; Singular; One who stands out with virtue",
    "pronunciation": "Uhd-veek",
    "culturalContext": "Modern Sanskrit name favored for short elegant phonetics.",
    "style": "Modern",
    "popularityScore": 92,
    "localizedNames": {
      "en-US": "Advik",
      "kn-IN": "ಅದ್ವಿಕ್",
      "hi-IN": "अद्विक",
      "ta-IN": "அத்விக்",
      "te-IN": "అద్విక్",
      "ml-IN": "അദ്വിക്"
    },
    "localizedMeanings": {
      "en-US": "Unique; Singular; One who stands out with virtue",
      "kn-IN": "ಅನನ್ಯ; ಏಕೈಕ; ಸದ್ಗುಣಗಳಿಂದ ಕಂಗೊಳಿಸುವವನು",
      "hi-IN": "अनोखा; विशिष्ट; गुणों में सबसे आगे",
      "ta-IN": "தனித்தன்மை வாய்ந்த; நல்லொழுக்கம் கொண்டவன்",
      "te-IN": "ప్రత్యేకమైన; విశిష్టమైన సద్గుణాలు కలవాడు",
      "ml-IN": "അദ്വിതീയനായ; വിശിഷ്ട ഗുണങ്ങളുള്ളവൻ"
    }
  },
  {
    "id": "n5",
    "name": "Diya",
    "gender": "girl",
    "origin": "Hindi / Sanskrit",
    "meaning": "Radiant lamp; Brightness; Source of divine light",
    "pronunciation": "Dee-yah",
    "culturalContext": "Symbolizes festival of Diwali and illuminating the family path.",
    "style": "Traditional",
    "popularityScore": 94,
    "localizedNames": {
      "en-US": "Diya",
      "kn-IN": "ದಿಯಾ",
      "hi-IN": "दिया",
      "ta-IN": "தியா",
      "te-IN": "దియా",
      "ml-IN": "ദിയ"
    },
    "localizedMeanings": {
      "en-US": "Radiant lamp; Brightness; Source of divine light",
      "kn-IN": "ಪ್ರಕಾಶಮಾನ ದೀಪ; ಪ್ರಜ್ವಲಿಸುವ ಬೆಳಕು; ದೈವಿಕ ತೇಜಸ್ಸು",
      "hi-IN": "दीपक; प्रकाश की किरण; दैवीय उजाला",
      "ta-IN": "ஒளிரும் விளக்கு; பிரகாசம்; தெய்வீக ஒளி",
      "te-IN": "కాంతిమంతమైన దీపం; ప్రకాశం; దైవిక కాంతి",
      "ml-IN": "പ്രകാശിക്കുന്ന വിളക്ക്; ദിവ്യജ്യോതിസ്സ്"
    }
  },
  {
    "id": "n6",
    "name": "Kabir",
    "gender": "boy",
    "origin": "Arabic / Hindi",
    "meaning": "Great; Powerful; Revered 15th-century mystic poet of love and unity",
    "pronunciation": "Kuh-beer",
    "culturalContext": "Embodies universal compassion, poetic truth, and timeless wisdom.",
    "style": "Royal",
    "popularityScore": 93,
    "localizedNames": {
      "en-US": "Kabir",
      "kn-IN": "ಕಬೀರ್",
      "hi-IN": "कबीर",
      "ta-IN": "கபீர்",
      "te-IN": "కబీర్",
      "ml-IN": "കബീർ"
    },
    "localizedMeanings": {
      "en-US": "Great; Powerful; Revered mystic poet of love and unity",
      "kn-IN": "ಶ್ರೇಷ್ಠ; ಮಹಾನ್; ಪ್ರೀತಿ ಮತ್ತು ಐಕ್ಯತೆಯ ಸಂತ ಕವಿ",
      "hi-IN": "महान; शक्तिशाली; प्रेम और एकता के संत कवि",
      "ta-IN": "சிறந்த; சக்திவாய்ந்த; அன்பு மற்றும் ஒற்றுமையின் கவிஞர்",
      "te-IN": "గొప్పవాడు; శక్తిమంతుడు; ప్రేమ మరియు ఐక్యతను చాటిన సాధువు",
      "ml-IN": "മഹത്തായ; സ്നേഹത്തിന്റെയും ഐക്യത്തിന്റെയും കവി"
    }
  },
  {
    "id": "n7",
    "name": "Mira",
    "gender": "girl",
    "origin": "Sanskrit / Slavic / Latin",
    "meaning": "Ocean, boundless peace, miraculous devotion (revered devotee Mirabai)",
    "pronunciation": "Mee-rah",
    "culturalContext": "Internationally beloved cross-cultural name with deep spiritual grace.",
    "style": "Modern",
    "popularityScore": 96,
    "localizedNames": {
      "en-US": "Mira",
      "kn-IN": "ಮೀರಾ",
      "hi-IN": "मीरा",
      "ta-IN": "மீரா",
      "te-IN": "మీరా",
      "ml-IN": "മീര"
    },
    "localizedMeanings": {
      "en-US": "Ocean, boundless peace, miraculous devotion (Mirabai)",
      "kn-IN": "ಸಾಗರ; ಅಪರಿಮಿತ ಶಾಂತಿ; ಪರಮ ಭಕ್ತಿ (ಮೀರಾಬಾಯಿ)",
      "hi-IN": "समुद्र; असीम शांति; अनन्य भक्ति (मीराबाई)",
      "ta-IN": "கடல்; எல்லையற்ற அமைதி; சிறந்த பக்தி (மீராபாய்)",
      "te-IN": "సముద్రం; అపరిమిత ప్రశాంతత; భక్తి పారవశ్యం",
      "ml-IN": "സമുദ്രം; ശാന്തി; അചഞ്ചലമായ ഭക്തി (മീരാഭായ്)"
    }
  },
  {
    "id": "n8",
    "name": "Reyansh",
    "gender": "boy",
    "origin": "Sanskrit",
    "meaning": "Ray of light; Part of Lord Vishnu; First ray of the morning sun",
    "pronunciation": "Ray-yahnsh",
    "culturalContext": "Modern and vibrant name symbolizing optimism and dawn.",
    "style": "Modern",
    "popularityScore": 97,
    "localizedNames": {
      "en-US": "Reyansh",
      "kn-IN": "ರೇಯಾಂಶ್",
      "hi-IN": "रेयांश",
      "ta-IN": "ரேயான்ஷ்",
      "te-IN": "రేయాన్ష్",
      "ml-IN": "രെയൻഷ്"
    },
    "localizedMeanings": {
      "en-US": "Ray of light; Part of Lord Vishnu; First ray of morning sun",
      "kn-IN": "ಬೆಳಕಿನ ಕಿರಣ; ವಿಷ್ಣುವಿನ ಅಂಶ; ಮುಂಜಾನೆಯ ಮೊದಲ ಸೂರ್ಯಕಿರಣ",
      "hi-IN": "सूर्य की पहली किरण; भगवान विष्णु का अंश",
      "ta-IN": "ஒளிக் கீற்று; விஷ்ணுவின் அம்சம்; விடியலின் முதல் கதிர்",
      "te-IN": "సూర్య కిరణం; విష్ణువు అంశ; ఉదయపు తొలి వెలుగు",
      "ml-IN": "സൂര്യകിരണം; വിഷ്ണു ഭഗവാന്റെ അംശം; പ്രഭാതവെളിച്ചം"
    }
  },
  {
    "id": "n9",
    "name": "Tara",
    "gender": "girl",
    "origin": "Sanskrit / Celtic",
    "meaning": "Star; Shining beacon; Compassionate Buddhist savior deity",
    "pronunciation": "Tah-rah",
    "culturalContext": "Cross-cultural classic celebrated from the Himalayas to Ireland.",
    "style": "Sanskrit Classic",
    "popularityScore": 91,
    "localizedNames": {
      "en-US": "Tara",
      "kn-IN": "ತಾರಾ",
      "hi-IN": "तारा",
      "ta-IN": "தாரா",
      "te-IN": "తారా",
      "ml-IN": "താര"
    },
    "localizedMeanings": {
      "en-US": "Star; Shining beacon; Compassionate deity",
      "kn-IN": "ನಕ್ಷತ್ರ; ಪ್ರಕಾಶಿಸುವ ಜ್ಯೋತಿ; ಕರುಣಾಮಯಿ ದೇವತೆ",
      "hi-IN": "नक्षत्र; चमकता सितारा; करुणामयी देवी",
      "ta-IN": "நட்சத்திரம்; ஒளிரும் விண்மீன்; கருணை தெய்வம்",
      "te-IN": "నక్షత్రం; ప్రకాశవంతమైన తార; దయామయి దేవత",
      "ml-IN": "നക്ഷത്രം; പ്രകാശബിന്ദു; കാരുണ്യമുള്ള ദേവത"
    }
  },
  {
    "id": "n10",
    "name": "Vivaan",
    "gender": "boy",
    "origin": "Sanskrit",
    "meaning": "Full of life; Radiant rays of the morning sun",
    "pronunciation": "Vee-vahn",
    "culturalContext": "Vibrant modern Indian name representing vigor and dynamism.",
    "style": "Modern",
    "popularityScore": 94,
    "localizedNames": {
      "en-US": "Vivaan",
      "kn-IN": "ವಿವಾನ್",
      "hi-IN": "विवान",
      "ta-IN": "விவான்",
      "te-IN": "వివాన్",
      "ml-IN": "വിവാൻ"
    },
    "localizedMeanings": {
      "en-US": "Full of life; Radiant rays of the morning sun",
      "kn-IN": "ಚೈತನ್ಯದಾಯಕ; ಜೀವಕಳೆಯಿಂದ ಕೂಡಿದ; ಪ್ರಕಾಶಮಾನ ಸೂರ್ಯಕಿರಣ",
      "hi-IN": "जीवन से भरपूर; सुबह के सूरज की किरणें",
      "ta-IN": "உயிர்ச்சக்தி நிறைந்த; காலைச் சூரியனின் கிரணங்கள்",
      "te-IN": "జీవకళతో నిండినవాడు; ఉదయపు సూర్య కిరణాలు",
      "ml-IN": "ജീവൻ നിറഞ്ഞവൻ; പ്രഭാത സൂര്യകിരണങ്ങൾ"
    }
  },
  {
    "id": "n11",
    "name": "Isha",
    "gender": "girl",
    "origin": "Sanskrit",
    "meaning": "The ruling power; Lord of all; Protecting deity",
    "pronunciation": "Ee-shah",
    "culturalContext": "Concise sacred name embodying strength and purity.",
    "style": "Sanskrit Classic",
    "popularityScore": 89,
    "localizedNames": {
      "en-US": "Isha",
      "kn-IN": "ಇಶಾ",
      "hi-IN": "ईशा",
      "ta-IN": "இஷா",
      "te-IN": "ఇషా",
      "ml-IN": "ഇഷ"
    },
    "localizedMeanings": {
      "en-US": "The ruling power; Lord of all; Protecting deity",
      "kn-IN": "ಆಡಳಿತ ಶಕ್ತಿ; ಎಲ್ಲರ ಒಡತಿ; ರಕ್ಷಿಸುವ ದೇವತೆ",
      "hi-IN": "शासक शक्ति; सबकी स्वामिनी; रक्षा करने वाली देवी",
      "ta-IN": "ஆளும் சக்தி; அனைத்தையும் காக்கும் தெய்வம்",
      "te-IN": "రక్షించే శక్తి; సర్వాధికారిణి; కాపాడే దేవత",
      "ml-IN": "രക്ഷിക്കുന്ന ശക്തി; സർവ്വനിയന്താവ്; ദേവി"
    }
  },
  {
    "id": "n12",
    "name": "Kian",
    "gender": "boy",
    "origin": "Persian / Celtic",
    "meaning": "Royal grace; Ancient; Enduring heritage",
    "pronunciation": "Kee-ahn",
    "culturalContext": "Sophisticated modern name with global resonance.",
    "style": "Modern",
    "popularityScore": 90,
    "localizedNames": {
      "en-US": "Kian",
      "kn-IN": "ಕಿಯಾನ್",
      "hi-IN": "कियान",
      "ta-IN": "கியான்",
      "te-IN": "కియాన్",
      "ml-IN": "കിയാൻ"
    },
    "localizedMeanings": {
      "en-US": "Royal grace; Ancient; Enduring heritage",
      "kn-IN": "ರಾಜಮನೆತನದ ಕೃಪೆ; ಪ್ರಾಚೀನ ಘನತೆ; ಶಾಶ್ವತ ಪರಂಪರೆ",
      "hi-IN": "शाही कृपा; प्राचीन गौरव; शाश्वत विरासत",
      "ta-IN": "அரச அருள்; பழம்பெரும் பாரம்பரியம்",
      "te-IN": "రాచరిక అనుగ్రహం; పురాతన వైభవం; నిత్య వారసత్వం",
      "ml-IN": "രാജകീയ കൃപ; പൗരാണിക പാരമ്പര്യം"
    }
  },
  {
    "id": "n13",
    "name": "Nila",
    "gender": "girl",
    "origin": "Tamil / Malayalam / Sanskrit",
    "meaning": "Enchanting blue; River Bharathapuzha; Moonlight reflection",
    "pronunciation": "Nee-lah",
    "culturalContext": "Richly rooted in South Indian literature and serene waters.",
    "style": "Traditional",
    "popularityScore": 88,
    "localizedNames": {
      "en-US": "Nila",
      "kn-IN": "ನೀಲಾ",
      "hi-IN": "नीला",
      "ta-IN": "நிலா",
      "te-IN": "నీలా",
      "ml-IN": "നീല"
    },
    "localizedMeanings": {
      "en-US": "Enchanting blue; River Bharathapuzha; Moonlight reflection",
      "kn-IN": "ಸುಂದರ ನೀಲಿ ಬಣ್ಣ; ಭರತಪುಳ ನದಿ; ಚಂದ್ರನ ಬೆಳಕು",
      "hi-IN": "मनमोहक नीला रंग; शांत नदी; चाँदनी का प्रतिबिंब",
      "ta-IN": "நிலா / சந்திரன்; அழகான நீல நிறம்; பாரதப்புழா நதி",
      "te-IN": "మనోహరమైన నీలిరంగు; చంద్రకాంతి; పవిత్ర నది",
      "ml-IN": "ഭാരതപ്പുഴ; ചന്ദ്രിക; മനോഹരമായ നീലനിറം"
    }
  },
  {
    "id": "n14",
    "name": "Aryan",
    "gender": "boy",
    "origin": "Sanskrit",
    "meaning": "Noble; Honorable; Righteous and virtuous",
    "pronunciation": "Ahr-yun",
    "culturalContext": "Ancient Sanskrit term describing dignity and integrity of character.",
    "style": "Traditional",
    "popularityScore": 89,
    "localizedNames": {
      "en-US": "Aryan",
      "kn-IN": "ಆರ್ಯನ್",
      "hi-IN": "आर्यन",
      "ta-IN": "ஆர்யன்",
      "te-IN": "ఆర్యన్",
      "ml-IN": "ആര്യൻ"
    },
    "localizedMeanings": {
      "en-US": "Noble; Honorable; Righteous and virtuous",
      "kn-IN": "ಉದಾತ್ತ; ಗೌರವಾನ್ವಿತ; ಸದ್ಗುಣ ಸಂಪನ್ನ ವ್ಯಕ್ತಿತ್ವ",
      "hi-IN": "कुलीन; श्रेष्ठ; सम्माननीय और धर्मात्मा",
      "ta-IN": "உயர்ந்தவன்; மரியாதைக்குரியவன்; நேர்மையானவன்",
      "te-IN": "ఉదాత్తుడు; గౌరవనీయుడు; సద్గుణవంతుడు",
      "ml-IN": "മഹാനായ; ആദരണീയനായ; ഉത്തമ സ്വഭാവമുള്ളവൻ"
    }
  },
  {
    "id": "n15",
    "name": "Zoya",
    "gender": "girl",
    "origin": "Arabic / Persian / Greek",
    "meaning": "Loving, caring, alive, joyful essence",
    "pronunciation": "Zoh-yah",
    "culturalContext": "Chic, spirited name cherished across multicultural families.",
    "style": "Modern",
    "popularityScore": 93,
    "localizedNames": {
      "en-US": "Zoya",
      "kn-IN": "ಜೋಯಾ",
      "hi-IN": "ज़ोया",
      "ta-IN": "சோயா",
      "te-IN": "జోయా",
      "ml-IN": "സോയ"
    },
    "localizedMeanings": {
      "en-US": "Loving, caring, alive, joyful essence",
      "kn-IN": "ಪ್ರೀತಿಯುಳ್ಳ; ಜೀವಕಳೆ ತುಂಬಿದ; ಆನಂದದ ಸಂಕೇತ",
      "hi-IN": "प्यारी; जिंदादिल; जीवन और आनंद से भरपूर",
      "ta-IN": "அன்பானவள்; மகிழ்ச்சி நிறைந்தவள்; உயிரோட்டமானவள்",
      "te-IN": "ప్రేమపూర్వకమైనది; సంతోషం మరియు జీవకళ గలది",
      "ml-IN": "സ്നേഹമുള്ളവൾ; സന്തോഷവതി; ജീവൻ തുടിക്കുന്നവൾ"
    }
  }
];
