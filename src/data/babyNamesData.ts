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
}

export const BABY_NAMES_DATABASE: BabyNameRecord[] = [
  {
    id: 'n1',
    name: 'Aadhya',
    gender: 'girl',
    origin: 'Sanskrit / Indian',
    meaning: 'First power; Beginning; Root of all creation (an epithet of Goddess Durga)',
    pronunciation: 'Aah-dh-yah',
    culturalContext: 'Celebrated across Indian families as a symbol of divine feminine energy.',
    style: 'Sanskrit Classic',
    popularityScore: 98
  },
  {
    id: 'n2',
    name: 'Aarav',
    gender: 'boy',
    origin: 'Sanskrit / Hindi',
    meaning: 'Peaceful; Harmonious sound; Gentle wisdom',
    pronunciation: 'Ah-ruv',
    culturalContext: 'Extremely popular modern Indian name signifying tranquility and clarity.',
    style: 'Modern',
    popularityScore: 99
  },
  {
    id: 'n3',
    name: 'Ananya',
    gender: 'girl',
    origin: 'Sanskrit / Bengali / Tamil',
    meaning: 'Unique; Matchless; One without equal',
    pronunciation: 'Uh-nun-yah',
    culturalContext: 'Timeless poetic name used across Southern and Northern India.',
    style: 'Traditional',
    popularityScore: 95
  },
  {
    id: 'n4',
    name: 'Advik',
    gender: 'boy',
    origin: 'Sanskrit',
    meaning: 'Unique; Singular; One who stands out with virtue',
    pronunciation: 'Uhd-veek',
    culturalContext: 'Modern Sanskrit name favored for short elegant phonetics.',
    style: 'Modern',
    popularityScore: 92
  },
  {
    id: 'n5',
    name: 'Diya',
    gender: 'girl',
    origin: 'Hindi / Sanskrit',
    meaning: 'Radiant lamp; Brightness; Source of divine light',
    pronunciation: 'Dee-yah',
    culturalContext: 'Symbolizes festival of Diwali and illuminating the family path.',
    style: 'Traditional',
    popularityScore: 94
  },
  {
    id: 'n6',
    name: 'Kabir',
    gender: 'boy',
    origin: 'Arabic / Hindi',
    meaning: 'Great; Powerful; Revered 15th-century mystic poet of love and unity',
    pronunciation: 'Kuh-beer',
    culturalContext: 'Embodies universal compassion, poetic truth, and timeless wisdom.',
    style: 'Royal',
    popularityScore: 93
  },
  {
    id: 'n7',
    name: 'Mira',
    gender: 'girl',
    origin: 'Sanskrit / Slavic / Latin',
    meaning: 'Ocean, boundless peace, miraculous devotion (revered devotee Mirabai)',
    pronunciation: 'Mee-rah',
    culturalContext: 'Internationally beloved cross-cultural name with deep spiritual grace.',
    style: 'Modern',
    popularityScore: 96
  },
  {
    id: 'n8',
    name: 'Reyansh',
    gender: 'boy',
    origin: 'Sanskrit',
    meaning: 'Ray of light; Part of Lord Vishnu; First ray of the morning sun',
    pronunciation: 'Ray-yahnsh',
    culturalContext: 'Modern and vibrant name symbolizing optimism and dawn.',
    style: 'Modern',
    popularityScore: 97
  },
  {
    id: 'n9',
    name: 'Tara',
    gender: 'girl',
    origin: 'Sanskrit / Celtic',
    meaning: 'Star; Shining beacon; Compassionate Buddhist savior deity',
    pronunciation: 'Tah-rah',
    culturalContext: 'Cross-cultural classic celebrated from the Himalayas to Ireland.',
    style: 'Sanskrit Classic',
    popularityScore: 91
  },
  {
    id: 'n10',
    name: 'Vivaan',
    gender: 'boy',
    origin: 'Sanskrit',
    meaning: 'Full of life; Radiant rays of the morning sun',
    pronunciation: 'Vee-vahn',
    culturalContext: 'Vibrant modern Indian name representing vigor and dynamism.',
    style: 'Modern',
    popularityScore: 94
  },
  {
    id: 'n11',
    name: 'Isha',
    gender: 'girl',
    origin: 'Sanskrit',
    meaning: 'The ruling power; Lord of all; Protecting deity',
    pronunciation: 'Ee-shah',
    culturalContext: 'Concise sacred name embodying strength and purity.',
    style: 'Sanskrit Classic',
    popularityScore: 89
  },
  {
    id: 'n12',
    name: 'Kian',
    gender: 'boy',
    origin: 'Persian / Celtic',
    meaning: 'Royal grace; Ancient; Enduring heritage',
    pronunciation: 'Kee-ahn',
    culturalContext: 'Sophisticated modern name with global resonance.',
    style: 'Modern',
    popularityScore: 90
  },
  {
    id: 'n13',
    name: 'Nila',
    gender: 'girl',
    origin: 'Tamil / Malayalam / Sanskrit',
    meaning: 'Enchanting blue; River Bharathapuzha; Moonlight reflection',
    pronunciation: 'Nee-lah',
    culturalContext: 'Richly rooted in South Indian literature and serene waters.',
    style: 'Traditional',
    popularityScore: 88
  },
  {
    id: 'n14',
    name: 'Aryan',
    gender: 'boy',
    origin: 'Sanskrit',
    meaning: 'Noble; Honorable; Righteous and virtuous',
    pronunciation: 'Ahr-yun',
    culturalContext: 'Ancient Sanskrit term describing dignity and integrity of character.',
    style: 'Traditional',
    popularityScore: 89
  },
  {
    id: 'n15',
    name: 'Zoya',
    gender: 'girl',
    origin: 'Arabic / Persian / Greek',
    meaning: 'Loving, caring, alive, joyful essence',
    pronunciation: 'Zoh-yah',
    culturalContext: 'Chic, spirited name cherished across multicultural families.',
    style: 'Modern',
    popularityScore: 93
  }
];
