export interface BabyProduct {
  id: string;
  category: 'clothing' | 'diapering' | 'skincare' | 'feeding' | 'bedding' | 'gear' | 'bathing' | 'safety';
  name: string;
  stageSuitable: string;
  priceEstimate: string;
  rating: number;
  reviewCount: number;
  isIndependentPick: boolean; // clearly distinguished from sponsored
  isOrganicOrNonToxic: boolean;
  safetyNote: string;
  description: string;
  imageEmoji: string;
}

export const BABY_SHOPPING_PRODUCTS: BabyProduct[] = [
  {
    id: 'p1',
    category: 'clothing',
    name: '100% GOTS Organic Cotton Kimono Bodysuits (5-Pack)',
    stageSuitable: '0 - 3 Months',
    priceEstimate: '$34.00 (₹2,800)',
    rating: 4.9,
    reviewCount: 1240,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Side snaps eliminate having to pull garments over fragile newborn head & healing umbilical stump.',
    description: 'Ultra-soft, nickel-free snaps, fold-over scratch mittens built into cuffs.',
    imageEmoji: '👕'
  },
  {
    id: 'p2',
    category: 'diapering',
    name: 'Plant-Based Hypoallergenic Diapers (Size Newborn / 1)',
    stageSuitable: 'Newborn to 10 lbs',
    priceEstimate: '$28.00 (₹2,200)',
    rating: 4.8,
    reviewCount: 3100,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Free of elemental chlorine, phthalates, synthetic fragrance, and lotions.',
    description: 'Includes wetness indicator line and umbilical cord notch cutout.',
    imageEmoji: '🚼'
  },
  {
    id: 'p3',
    category: 'skincare',
    name: 'Pediatric Dermatologist Colloidal Oatmeal Baby Wash & Cream',
    stageSuitable: 'Newborn+',
    priceEstimate: '$19.00 (₹1,500)',
    rating: 4.9,
    reviewCount: 880,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Tear-free, pH 5.5 neutral formula tested for eczema-prone newborn skin.',
    description: 'Enriched with prebiotics to support natural infant skin barrier colonization.',
    imageEmoji: '🧴'
  },
  {
    id: 'p4',
    category: 'feeding',
    name: 'Anti-Colic Borosilicate Glass Feeding Bottles with Slow-Flow Teat',
    stageSuitable: '0 - 6 Months',
    priceEstimate: '$38.00 (₹3,100)',
    rating: 4.7,
    reviewCount: 1950,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Thermal shock resistant, zero microplastic leaching when warmed or sterilized.',
    description: 'Patented air-free vent prevents vacuum build-up to minimize gas and spit-up.',
    imageEmoji: '🍼'
  },
  {
    id: 'p5',
    category: 'gear',
    name: 'All-Terrain Modular Travel System: Stroller & Infant Car Seat',
    stageSuitable: 'Birth to 45 lbs',
    priceEstimate: '$420.00 (₹35,000)',
    rating: 4.8,
    reviewCount: 940,
    isIndependentPick: true,
    isOrganicOrNonToxic: false,
    safetyNote: 'FMVSS 213 crash-tested side impact protection with anti-rebound load leg.',
    description: 'One-hand compact fold with UPF 50+ canopy and shock-absorbing suspension wheels.',
    imageEmoji: '🛒'
  },
  {
    id: 'p6',
    category: 'bedding',
    name: 'Breathable Dual-Sided Crib Mattress (Washable Core)',
    stageSuitable: 'Infant to Toddler',
    priceEstimate: '$240.00 (₹19,500)',
    rating: 4.9,
    reviewCount: 2200,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Greenguard Gold Certified; air can circulate directly through even if baby turns face-down.',
    description: 'Firm infant side for spinal support; reverses to cushioned toddler comfort.',
    imageEmoji: '🛏️'
  },
  {
    id: 'p7',
    category: 'safety',
    name: 'Smart Non-Wearable HD Baby Monitor with Breathing Movement Tracking',
    stageSuitable: '0 - 24 Months',
    priceEstimate: '$199.00 (₹16,500)',
    rating: 4.6,
    reviewCount: 1450,
    isIndependentPick: true,
    isOrganicOrNonToxic: false,
    safetyNote: 'Zero sensors on baby; uses computer vision to track chest micro-movements.',
    description: 'Cry detection, room temperature & humidity alerts, two-way audio talkback.',
    imageEmoji: '📷'
  },
  {
    id: 'p8',
    category: 'bathing',
    name: 'Ergonomic 3-Stage Tub with Newborn Sling',
    stageSuitable: '0 - 18 Months',
    priceEstimate: '$32.00 (₹2,600)',
    rating: 4.8,
    reviewCount: 4200,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Never leave infant unattended in water for even one second regardless of support sling.',
    description: 'Mesh sling locks into two positions for full head cradling before sit-up phase.',
    imageEmoji: '🛁'
  }
];
