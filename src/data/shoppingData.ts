export interface BabyProduct {
  id: string;
  category: 'clothing' | 'diapering' | 'skincare' | 'feeding' | 'bedding' | 'gear' | 'bathing' | 'safety';
  name: string;
  brand: string;
  stageSuitable: string;
  priceInr: number;
  mrpInr: number;
  discountPercent: number;
  priceEstimate: string;
  rating: number;
  reviewCount: number;
  isIndependentPick: boolean;
  isOrganicOrNonToxic: boolean;
  safetyNote: string;
  pediatricReason: string;
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  whatsIncluded: string[];
  imageUrl: string;
  galleryImages: string[];
  imageEmoji: string;
  amazonUrl: string;
  flipkartUrl: string;
  deliveryInfo: string;
}

export const BABY_SHOPPING_PRODUCTS: BabyProduct[] = [
  {
    id: 'p1',
    category: 'clothing',
    name: '100% GOTS Certified Organic Cotton Kimono Newborn Bodysuits (5-Pack)',
    brand: 'Mothercare / Organic Brij',
    stageSuitable: '0 - 3 Months (Newborn)',
    priceInr: 1299,
    mrpInr: 1799,
    discountPercent: 28,
    priceEstimate: '₹1,299',
    rating: 4.9,
    reviewCount: 1420,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Side kimono snap buttons eliminate having to pull garments over fragile newborn head and healing umbilical stump.',
    pediatricReason: 'Pediatricians strongly recommend side-snap kimono designs during the first 4 weeks to prevent friction against the healing umbilical cord and eliminate unnecessary head stress.',
    description: 'Crafted from the purest unbleached, GOTS certified organic combed cotton. Features nickel-free YKK side snaps, fold-over scratch mittens built into cuffs, and tagless neckline to prevent infant contact dermatitis.',
    highlights: [
      'GOTS Certified 100% Organic Combed Cotton (Zero pesticides, AZO-free dyes)',
      'Side wrap kimono cut avoids touching healing umbilical stump',
      'Built-in fold-over scratch mittens protect newborn delicate facial skin',
      'Nickel-free snaps and flat-lock seams prevent skin friction and irritation'
    ],
    specifications: {
      'Material': '100% GOTS Certified Organic Combed Cotton (180 GSM)',
      'Closure Type': 'Side Snap Buttons (Nickel-Free YKK)',
      'Age Recommendation': '0 to 3 Months (Up to 6 kg)',
      'Care Instructions': 'Machine wash gentle with mild infant detergent; tumble dry low',
      'Safety Certification': 'GOTS Certified & OEKO-TEX Standard 100'
    },
    whatsIncluded: [
      '5x Organic Kimono Bodysuits (Pastel Sage, Cream, Ochre, Rose, Cloud White)',
      '1x Pediatric Newborn Sizing & Care Guide'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '👕',
    amazonUrl: 'https://www.amazon.in/s?k=organic+cotton+newborn+kimono+bodysuit',
    flipkartUrl: 'https://www.flipkart.com/search?q=organic+cotton+newborn+bodysuits',
    deliveryInfo: 'Free 2-day delivery on Amazon & Flipkart • 10-day replacement'
  },
  {
    id: 'p2',
    category: 'diapering',
    name: 'Pampers Pure Protection Hypoallergenic Diaper Pants with Wetness Indicator (Size NB/Small)',
    brand: 'Pampers Pure',
    stageSuitable: 'Newborn to 5 kg',
    priceInr: 1149,
    mrpInr: 1499,
    discountPercent: 23,
    priceEstimate: '₹1,149',
    rating: 4.8,
    reviewCount: 3890,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Free of elemental chlorine bleaching, fragrance, parabens, and natural rubber latex. Formulated for sensitive infant skin.',
    pediatricReason: 'Dermatologist tested with 0% chlorine and 0% perfumes. Rapid moisture absorption maintains skin dryness below the critical threshold for diaper rash (Candida).',
    description: 'Enhanced plant-based core absorbs moisture in seconds with a color-changing yellow-to-blue wetness line. Cotton-enhanced outer layer provides cloud-like breathability.',
    highlights: [
      '0% Chlorine Bleaching, Fragrance, Parabens, or Natural Rubber Latex',
      'Enriched with shea butter plant-derived liner to protect baby barrier',
      'Smart Color-Changing Wetness Indicator (Turns from yellow to blue)',
      'Up to 12 hours of clinically proven leakage lock protection'
    ],
    specifications: {
      'Size': 'Newborn (Size 1, suitable for babies under 5 kg)',
      'Absorbency Core': 'Premium plant-based fluff pulp & absorbent polymer',
      'Skin Dermatest': 'Clinically tested & hypoallergenic certified',
      'Count': 'Pack of 76 Diapers'
    },
    whatsIncluded: [
      '1x Pack of 76 Pampers Pure Diaper Pants',
      '1x Sample Pack of Pure Water Sensitive Wipes'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🚼',
    amazonUrl: 'https://www.amazon.in/s?k=pampers+pure+protection+newborn',
    flipkartUrl: 'https://www.flipkart.com/search?q=pampers+pure+protection+diapers',
    deliveryInfo: 'Same-day / Next-day Prime delivery available'
  },
  {
    id: 'p3',
    category: 'skincare',
    name: 'Sebamed Baby Gentle Wash pH 5.5 & Protective Facial Cream Combo',
    brand: 'Sebamed Baby',
    stageSuitable: 'Day 1 Newborn+',
    priceInr: 1080,
    mrpInr: 1350,
    discountPercent: 20,
    priceEstimate: '₹1,080',
    rating: 4.9,
    reviewCount: 2150,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Clinically proven 100% soap and alkali free with exact pH 5.5 to support the developing infant acid mantle.',
    pediatricReason: 'An infant’s acid mantle takes several months to mature. Using products with alkaline soap strips lipids and invites eczema. pH 5.5 keeps the skin microbiome resilient.',
    description: 'Tear-free botanical sugar-surfactant formula enriched with chamomile to soothe cradle cap and prevent dryness. Protective facial cream prevents saliva rash and chin chapping.',
    highlights: [
      'Exact pH 5.5 promotes natural biological acid mantle defense',
      '100% Soap, Alkali, Paraben, and Colorant free formula',
      'Tear-free tested ophthalmologically for newborn baths',
      'Enriched with allantoin and natural bisabolol chamomile extract'
    ],
    specifications: {
      'Volume': '400ml Gentle Wash + 50ml Protective Facial Cream',
      'pH Level': 'Strictly pH 5.5 balanced',
      'Origin': 'Made in Germany (Sebapharma)',
      'Recommended Age': 'Safe from Day 1 birth onwards'
    },
    whatsIncluded: [
      '1x 400ml Sebamed Baby Gentle Wash with Pump Dispenser',
      '1x 50ml Sebamed Baby Protective Facial Cream'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-224422e11a62?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🧴',
    amazonUrl: 'https://www.amazon.in/s?k=sebamed+baby+wash+ph+5.5',
    flipkartUrl: 'https://www.flipkart.com/search?q=sebamed+baby+gentle+wash',
    deliveryInfo: 'Fast delivery with temperature-controlled packaging'
  },
  {
    id: 'p4',
    category: 'feeding',
    name: 'Philips Avent Natural Response Anti-Colic Glass Feeding Bottle (240ml, Twin Pack)',
    brand: 'Philips Avent',
    stageSuitable: '0 - 6 Months',
    priceInr: 1899,
    mrpInr: 2499,
    discountPercent: 24,
    priceEstimate: '₹1,899',
    rating: 4.7,
    reviewCount: 2450,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Medical-grade thermal borosilicate glass releases zero microplastics even when sterilized repeatedly at high temperatures.',
    pediatricReason: 'Thermal shock resistant borosilicate glass is impervious to chemical leaching and scratches where bacteria harbor. Natural response teat prevents nipple confusion.',
    description: 'Breast-like teat releases milk only when baby actively drinks, seamlessly combining breast and bottle feeding. Built-in anti-colic valve vents air away from baby’s tummy.',
    highlights: [
      '100% Thermal Shock Resistant Pharmaceutical Borosilicate Glass',
      'Zero Microplastics, BPA, BPS, and Phthalates guaranteed',
      'Natural Response Nipple mimics maternal breast physiology',
      'Anti-colic valve reduces air ingestion, gas, and reflux'
    ],
    specifications: {
      'Capacity': '240ml (8 oz) each bottle',
      'Bottle Material': 'Premium Borosilicate Glass (Resists up to 300°C)',
      'Nipple Material': 'Food-Grade Skin-Soft Silicone (Flow rate 3)',
      'Sterilization': 'Boiling water, steam sterilizer, and dishwasher safe'
    },
    whatsIncluded: [
      '2x 240ml Borosilicate Glass Bottles',
      '2x Natural Response Silicone Teats (0m+)',
      '2x Leak-Proof Protective Dust Caps'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🍼',
    amazonUrl: 'https://www.amazon.in/s?k=philips+avent+natural+response+glass+bottle',
    flipkartUrl: 'https://www.flipkart.com/search?q=philips+avent+glass+feeding+bottle',
    deliveryInfo: 'Prime next-day delivery with fragile handling'
  },
  {
    id: 'p5',
    category: 'gear',
    name: 'LuvLap Sunshine 3-in-1 Multipurpose Baby Stroller & Pram with Reversible Handlebar',
    brand: 'LuvLap',
    stageSuitable: 'Birth to 3 Years (Up to 15 kg)',
    priceInr: 4999,
    mrpInr: 7499,
    discountPercent: 33,
    priceEstimate: '₹4,999',
    rating: 4.6,
    reviewCount: 4890,
    isIndependentPick: true,
    isOrganicOrNonToxic: false,
    safetyNote: 'European standard EN 1888 certified with 5-point safety harness and dual front-wheel swivel locks.',
    pediatricReason: 'A completely flat 180° recline is medically essential for infants under 6 months to protect the airway and spinal alignment during stroller sleep.',
    description: 'Features 3-position recline (180° flat sleeping, resting, upright sitting) with detachable dining tray, all-weather canopy, and mosquito net.',
    highlights: [
      'Reversible Handlebar allows face-to-face bonding or forward exploration',
      '3-Position Seat Recline with 180° full flat bed for newborns',
      'European EN 1888 Safety Certified with 5-point padded harness',
      'Dual Front Swivel Wheels with Shock Absorbers and One-Touch Rear Brake'
    ],
    specifications: {
      'Weight Capacity': 'Suitable from 0 months to 3 years (up to 15 kg)',
      'Frame Material': 'Aviation-Grade Heavy-Duty Powder-Coated Steel',
      'Wheel Suspension': '360° front swivel with spring suspension',
      'Folding Mechanism': 'Compact single-hand fold with safety lock'
    },
    whatsIncluded: [
      '1x LuvLap Sunshine Stroller Pram Frame & Seat',
      '1x Full-Coverage UV Canopy with Peek-a-boo Window',
      '1x Detachable Feeding Tray & 1x Anti-Mosquito Net',
      '1x Bottom Storage Basket'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🛒',
    amazonUrl: 'https://www.amazon.in/s?k=luvlap+sunshine+baby+stroller',
    flipkartUrl: 'https://www.flipkart.com/search?q=luvlap+sunshine+baby+stroller',
    deliveryInfo: 'Free scheduled doorstep delivery with assembly guide'
  },
  {
    id: 'p6',
    category: 'bedding',
    name: 'The White Willow Orthopedic Memory Foam Baby Head Shaping Pillow & Crib Mat',
    brand: 'The White Willow',
    stageSuitable: '0 - 12 Months',
    priceInr: 899,
    mrpInr: 1499,
    discountPercent: 40,
    priceEstimate: '₹899',
    rating: 4.8,
    reviewCount: 1680,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Contoured concave center circle relieves cranial pressure to prevent Flat Head Syndrome (Positional Plagiocephaly).',
    pediatricReason: 'An infant’s skull bones are soft and pliable during the first year. The concave ergonomic recess distributes weight evenly across the occiput, preventing asymmetric flattening.',
    description: 'Breathable 100% natural bamboo outer cover with hypoallergenic BASF German memory foam core. Certified CertiPUR-US without harmful chemical off-gassing.',
    highlights: [
      'Concave Center Cavity cradles infant head and aligns cervical spine',
      '100% Natural Organic Bamboo outer cover is naturally antibacterial',
      'Hypoallergenic BASF German memory foam with micro-ventilation holes',
      'Helps prevent and correct Flat Head Syndrome (Plagiocephaly)'
    ],
    specifications: {
      'Core Material': 'Breathable BASF German Orthopedic Memory Foam',
      'Cover Fabric': 'Eco-Friendly Bamboo Cotton (Machine Washable)',
      'Dimensions': '30 cm x 22 cm x 3 cm (Ergonomic newborn profile)',
      'Certifications': 'CertiPUR-US & OEKO-TEX Standard 100'
    },
    whatsIncluded: [
      '1x Orthopedic Baby Head Shaping Pillow',
      '2x Removable Washable Organic Bamboo Covers'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🛏️',
    amazonUrl: 'https://www.amazon.in/s?k=white+willow+baby+head+shaping+pillow',
    flipkartUrl: 'https://www.flipkart.com/search?q=baby+head+shaping+pillow+memory+foam',
    deliveryInfo: 'Prime delivery with 30-day trial warranty'
  },
  {
    id: 'p7',
    category: 'safety',
    name: 'CubbyCare Smart 1080p Full HD WiFi Baby Monitor with Night Vision & Cry Alert',
    brand: 'TP-Link Tapo / CubbyCare',
    stageSuitable: '0 - 36 Months',
    priceInr: 2499,
    mrpInr: 3999,
    discountPercent: 37,
    priceEstimate: '₹2,499',
    rating: 4.7,
    reviewCount: 3200,
    isIndependentPick: true,
    isOrganicOrNonToxic: false,
    safetyNote: 'Secure 128-bit AES encrypted feed ensures private live nursery streaming only to authorized parent smartphones.',
    pediatricReason: 'Real-time cry detection and nursery temperature monitoring prevent infant hyperthermia, which is an established clinical risk factor in neonatal sleep environments.',
    description: 'Features 360° pan-tilt coverage, instant cry detection push notifications, invisible infrared night vision that won’t disturb sleep, and two-way audio talk.',
    highlights: [
      '1080p Full HD video with 360° Pan & 114° Tilt rotation',
      'AI Infant Cry Detection sends immediate audio-visual phone alert',
      'Invisible 850nm Infrared Night Vision (zero bright red LEDs)',
      'Bank-Grade 128-Bit AES SSL Encryption for absolute privacy'
    ],
    specifications: {
      'Resolution': '1080p Full HD (1920 x 1080) at 30 fps',
      'Audio': 'Full duplex two-way talk with noise cancellation',
      'Connectivity': '2.4 GHz WiFi (iOS and Android compatible)',
      'Storage': 'MicroSD card slot (up to 512GB) + Secure Cloud option'
    },
    whatsIncluded: [
      '1x Smart Pan/Tilt Nursery Camera',
      '1x 3-meter USB Power Cable & Adapter',
      '1x Wall/Crib Mounting Bracket & Screws',
      '1x Quick Start Guide'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '📷',
    amazonUrl: 'https://www.amazon.in/s?k=smart+wifi+baby+monitor+camera+cry+detection',
    flipkartUrl: 'https://www.flipkart.com/search?q=baby+monitor+camera+night+vision',
    deliveryInfo: 'Fast delivery with 1-year manufacturer replacement warranty'
  },
  {
    id: 'p8',
    category: 'bathing',
    name: 'Chicco Baby Moments Bubble Bath Tub with Detachable Non-Slip Newborn Support Cradle',
    brand: 'Chicco',
    stageSuitable: '0 - 18 Months',
    priceInr: 2190,
    mrpInr: 2990,
    discountPercent: 27,
    priceEstimate: '₹2,190',
    rating: 4.8,
    reviewCount: 2980,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Built-in quick drain plug and anti-slip rubber pads ensure maximum stability on wet bathroom surfaces.',
    pediatricReason: 'The ergonomic reclining newborn cradle keeps infant ears and nose comfortably above the water line while supporting the immature cervical spine.',
    description: 'Double-position design adapts across two milestones: reclined newborn support cradle for 0–6 months, and spacious sit-up bath tub for 6–18 months.',
    highlights: [
      'Dual Stage Design: Reclined cradle (0-6m) & Sit-up tub (6-18m)',
      'Soft Rubber Anti-Slip Cushion inserts prevent accidental sliding',
      'Convenient Bottom Quick-Drain Plug with thermal temperature sensor',
      'Built-in accessory compartments for baby soap and sponge'
    ],
    specifications: {
      'Tub Dimensions': '82 cm x 48 cm x 24 cm',
      'Material': 'BPA-Free, Phthalate-Free Heavy Duty Polypropylene',
      'Drainage': 'Rapid drain plug with safety seal',
      'Age Limit': '0 to 18 Months'
    },
    whatsIncluded: [
      '1x Chicco Ergonomic Bath Tub',
      '1x Detachable Newborn Support Hammock',
      '1x Bath Sponge & Water Rinse Cup'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584697964400-2af6a2f6204c?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🛁',
    amazonUrl: 'https://www.amazon.in/s?k=chicco+baby+moments+bath+tub',
    flipkartUrl: 'https://www.flipkart.com/search?q=chicco+baby+bathtub',
    deliveryInfo: 'Doorstep delivery with protective packaging'
  },
  {
    id: 'p9',
    category: 'clothing',
    name: 'SuperBottoms Freesize Waterproof Reusable Cloth Diaper with Certified Organic Bamboo Cotton Insert',
    brand: 'SuperBottoms UNO',
    stageSuitable: '3 Months to 3 Years (5 - 17 kg)',
    priceInr: 899,
    mrpInr: 1299,
    discountPercent: 30,
    priceEstimate: '₹899',
    rating: 4.8,
    reviewCount: 6540,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Zero plastic touching baby skin. Breathable TPU outer layer stops leaks without rash-causing heat trapping.',
    pediatricReason: 'Reusable organic cloth diapers eliminate chemical absorbent gelling agents (SAP) and keep genital temperature cooler, which is healthier for infant reproductive development.',
    description: 'India’s most loved eco-friendly washable diaper. One diaper shell adjusts across 3 years with an intelligent snap grid, saving over ₹40,000 compared to disposables.',
    highlights: [
      'GOTS Certified Organic Bamboo Cotton Pad (12-hour overnight absorbency)',
      'Freesize Design: Grows with baby from 5 kg to 17 kg (3 months to 3 years)',
      'Waterproof yet Breathable TPU outer layer prevents hot moisture buildup',
      'Saves over 4,500 disposable diapers from entering landfills'
    ],
    specifications: {
      'Outer Shell': 'Laminated waterproof breathable TPU polyester',
      'Inner Soaker': '100% Certified Organic Bamboo-Cotton Magic Pad',
      'Fit Adjustment': '3x4 front rise snaps + waist snap closures',
      'Washability': 'Over 300+ machine washes'
    },
    whatsIncluded: [
      '1x SuperBottoms UNO Freesize Waterproof Outer Shell',
      '1x Heavy-Duty Organic Bamboo Cotton Soaker Pad',
      '1x Booster Dry Feel Pad'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🩲',
    amazonUrl: 'https://www.amazon.in/s?k=superbottoms+freesize+cloth+diaper',
    flipkartUrl: 'https://www.flipkart.com/search?q=superbottoms+cloth+diaper',
    deliveryInfo: 'Fast dispatch with diaper wash guide'
  },
  {
    id: 'p10',
    category: 'feeding',
    name: 'Medela Harmony Manual 2-Phase Expression Breast Pump with Flex Breast Shield',
    brand: 'Medela',
    stageSuitable: 'Postpartum Mother',
    priceInr: 2650,
    mrpInr: 3499,
    discountPercent: 24,
    priceEstimate: '₹2,650',
    rating: 4.7,
    reviewCount: 1890,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: '100% BPA-free Swiss engineering mimics natural infant nursing rhythm to encourage efficient milk letdown.',
    pediatricReason: 'Research-backed 2-Phase Expression technology mimics natural infant nursing (fast stimulation suckling followed by slower, deeper extraction) to prevent nipple trauma.',
    description: 'Lightweight, quiet, and ultra-portable. Features the innovative 105° PersonalFit Flex shield that exerts less pressure on milk ducts for 11.8% more milk per session.',
    highlights: [
      'Swiss 2-Phase Expression technology for natural milk letdown',
      '105° PersonalFit Flex Shield adapts smoothly to breast contours',
      'Completely silent and manual: no batteries or motor noise required',
      'Lightweight (only 105 grams) and fits easily into any handbag'
    ],
    specifications: {
      'Pump Mechanism': 'Manual ergonomic swivel handle with 2-phase rhythm',
      'Shield Size': '24mm PersonalFit Flex Shield included (BPA-free)',
      'Bottle Size': '150ml Breast Milk Storage Bottle with travel cap',
      'Origin': 'Designed & Engineered in Switzerland'
    },
    whatsIncluded: [
      '1x Medela Harmony Manual Pump Handle & Diaphragm',
      '1x 24mm PersonalFit Flex Breast Shield',
      '1x 150ml Breast Milk Bottle with Stand & Lid'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🍼',
    amazonUrl: 'https://www.amazon.in/s?k=medela+harmony+manual+breast+pump',
    flipkartUrl: 'https://www.flipkart.com/search?q=medela+harmony+breast+pump',
    deliveryInfo: 'Prime delivery with lactation consultant advice hotline'
  },
  {
    id: 'p11',
    category: 'skincare',
    name: 'The Moms Co. Natural Calming Baby Massage Oil with 10 Nourishing Oils (Sesame, Almond, Avocado)',
    brand: 'The Moms Co.',
    stageSuitable: 'Newborn+',
    priceInr: 449,
    mrpInr: 599,
    discountPercent: 25,
    priceEstimate: '₹449',
    rating: 4.8,
    reviewCount: 5210,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Dermatologically tested Australia-certified toxin-free with zero mineral oil, parabens, or synthetic fragrance.',
    pediatricReason: 'Daily traditional Indian baby massage (Malish) using cold-pressed sesame and almond oils has been clinically shown to promote infant weight gain, bone mineral density, and sleep quality.',
    description: 'Enriched with 10 powerful natural oils including organic sesame, cold-pressed sweet almond, wheat germ, and avocado. Absorbs cleanly without clogging delicate infant pores.',
    highlights: [
      'Australia-Certified Toxin-Free & Cruelty-Free dermatological test',
      '10 Cold-Pressed Natural Seed Oils rich in Vitamin E & Omega-3/6',
      'Strengthens infant bones, joints, and muscular tone through massage',
      'Zero Mineral Oil, Paraffin, Silicones, or Artificial Perfume'
    ],
    specifications: {
      'Volume': '200ml Flip-top Bottle',
      'Key Ingredients': 'Organic Sesame Oil, Sweet Almond Oil, Jojoba Oil, Chamomile',
      'Skin Compatibility': 'Hypoallergenic & clinically tested for newborn skin',
      'Expiry': '24 Months from manufacturing'
    },
    whatsIncluded: [
      '1x 200ml The Moms Co. Natural Baby Massage Oil',
      '1x Step-by-Step Ayurvedic Infant Massage Illustrated Guide'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-224422e11a62?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1608248597359-224422e11a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🪔',
    amazonUrl: 'https://www.amazon.in/s?k=the+moms+co+baby+massage+oil',
    flipkartUrl: 'https://www.flipkart.com/search?q=the+moms+co+natural+baby+massage+oil',
    deliveryInfo: 'Fast dispatch with tamper-proof seal'
  },
  {
    id: 'p12',
    category: 'bedding',
    name: 'Baybee Wooden Rocking Bassinet Crib with Breathable Mesh Canopy & Mosquito Net',
    brand: 'Baybee',
    stageSuitable: '0 - 12 Months',
    priceInr: 7499,
    mrpInr: 9999,
    discountPercent: 25,
    priceEstimate: '₹7,499',
    rating: 4.7,
    reviewCount: 1120,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Smooth rounded edges with non-toxic natural wood stain. Meets ASTM F2194 bassinet safety specifications.',
    pediatricReason: 'Firm sleep surface with 360° breathable mesh canopy adheres to the American Academy of Pediatrics (AAP) Safe Sleep guidelines, drastically reducing SIDS risk.',
    description: 'Convertible swinging mode gently rocks infant to sleep; 360° swivel wheels with safety locks enable smooth room-to-room transit. Includes a detachable full mosquito dome.',
    highlights: [
      'Constructed from New Zealand Pine Wood with non-toxic food-grade polish',
      'Gentle swing rocking motion soothes fussy babies into deep sleep',
      'Lockable 360° rubberized caster wheels protect hardwood floors',
      'Full protective mosquito net canopy protects from insect bites'
    ],
    specifications: {
      'Dimensions': '98 cm x 56 cm x 82 cm',
      'Material': 'Solid New Zealand Pine Wood & High-Density Cotton Mesh',
      'Weight Capacity': 'Up to 15 kg (Birth to 12 months)',
      'Safety Standard': 'ASTM F2194 / EN 1130 Certified'
    },
    whatsIncluded: [
      '1x Solid Wood Bassinet Crib Frame',
      '1x Breathable Firm Crib Mattress Pad',
      '1x Full Dome Mosquito Net Canopy',
      '1x Assembly Tool Set & Manual'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🪵',
    amazonUrl: 'https://www.amazon.in/s?k=baybee+wooden+baby+crib+bassinet',
    flipkartUrl: 'https://www.flipkart.com/search?q=baybee+wooden+baby+cot+crib',
    deliveryInfo: 'Heavy goods scheduled courier with free installation guidance'
  },
  {
    id: 'p13',
    category: 'gear',
    name: 'Ergobaby Omni 360 All-in-One Ergonomic 4-Position Baby Carrier',
    brand: 'Ergobaby / LuvLap',
    stageSuitable: 'Newborn to Toddler (3.2 - 20 kg)',
    priceInr: 4299,
    mrpInr: 5999,
    discountPercent: 28,
    priceEstimate: '₹4,299',
    rating: 4.9,
    reviewCount: 2840,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Acknowledged as a "Hip Healthy" product by the International Hip Dysplasia Institute (IHDI).',
    pediatricReason: 'Maintains baby in the ergonomic "M-position" (knees higher than bottom), which is crucial for healthy hip joint acetabulum development during the first year.',
    description: 'All carry positions: inward facing, front outward, hip, and back carry. Features cushioned lumbar support and crossable padded shoulder straps for long wear without backache.',
    highlights: [
      'Certified "Hip-Healthy" by the International Hip Dysplasia Institute',
      'No infant insert needed: adjusts from newborn (3.2 kg) to toddler (20 kg)',
      'Ergonomic Lumbar Support belt relieves maternal lower-back pressure',
      'Includes UPF 50+ privacy hood for sun protection and nursing discretion'
    ],
    specifications: {
      'Weight Range': '3.2 kg to 20 kg (No extra insert required)',
      'Carry Positions': 'Inward, Forward Outward, Hip Carry, Back Carry',
      'Fabric': '100% Breathable Soft Cotton Canvas with Air Mesh',
      'Waist Belt': 'Adjustable from 26 inches to 55 inches'
    },
    whatsIncluded: [
      '1x Ergobaby Omni 360 Baby Carrier',
      '1x Detachable Storage Pouch',
      '1x UPF 50+ Sun & Nursing Hood'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🦘',
    amazonUrl: 'https://www.amazon.in/s?k=ergobaby+omni+360+baby+carrier',
    flipkartUrl: 'https://www.flipkart.com/search?q=ergonomic+baby+carrier+hip+seat',
    deliveryInfo: 'Prime delivery with 10-day replacement warranty'
  },
  {
    id: 'p14',
    category: 'bedding',
    name: 'Pure Organic Bamboo Muslin Swaddle Blankets (Set of 3, 120 x 120 cm)',
    brand: 'Haus & Kinder / Kicks & Crawl',
    stageSuitable: '0 - 12 Months',
    priceInr: 999,
    mrpInr: 1499,
    discountPercent: 33,
    priceEstimate: '₹999',
    rating: 4.8,
    reviewCount: 3120,
    isIndependentPick: true,
    isOrganicOrNonToxic: true,
    safetyNote: 'Open-weave muslin prevents overheating while keeping newborn secure, reducing the startle (Moro) reflex.',
    pediatricReason: 'Swaddling recreates the comforting snugness of the womb, calming the neurological Moro reflex and improving infant sleep duration.',
    description: 'Generously sized 120 x 120 cm swaddles made from 70% bamboo and 30% organic cotton. Becomes softer with every wash; doubles as nursing cover, stroller shade, or play mat.',
    highlights: [
      'Silky Soft Bamboo-Cotton Blend (Breathable open-weave thermoregulating fabric)',
      'Generous 120 x 120 cm dimensions makes swaddling easy and secure',
      'Multi-purpose: swaddle, nursing cover, stroller blanket, burp cloth',
      'AZO-free non-toxic organic dyes safe for infant skin'
    ],
    specifications: {
      'Dimensions': '120 cm x 120 cm (Extra large newborn size)',
      'Fabric Blend': '70% Viscose from Bamboo, 30% GOTS Organic Cotton',
      'Wash Care': 'Machine wash cold; gets softer with every wash',
      'Pack Size': 'Set of 3 coordinating prints'
    },
    whatsIncluded: [
      '3x Premium Bamboo Muslin Swaddle Blankets',
      '1x Illustrated Step-by-Step Newborn Swaddling Guide'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80'
    ],
    imageEmoji: '🧣',
    amazonUrl: 'https://www.amazon.in/s?k=organic+bamboo+muslin+swaddle+blanket',
    flipkartUrl: 'https://www.flipkart.com/search?q=bamboo+muslin+swaddle+blankets',
    deliveryInfo: 'Fast Prime delivery with gift box packaging'
  }
];
