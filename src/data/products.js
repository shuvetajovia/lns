// Ayurveda Royalty Store Catalog — Mother Nature
// EXACT CATEGORIES: Heritage Rice, Ancient Millets, Native Sweeteners, Essential Minerals, Forest Harvest, Cold Pressed Oils

export const AYURVEDA_CATEGORIES = [
  { 
    id: "all", 
    name: "All", 
    subtitle: "Complete Collection",
    icon: "Crown",
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "heritage-rice", 
    name: "Heritage Rice", 
    subtitle: "Royal Traditional Paddies",
    icon: "Wheat",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "ancient-millets", 
    name: "Ancient Millets", 
    subtitle: "Nutritious Ancestral Grains",
    icon: "Leaf",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "native-sweeteners", 
    name: "Native Sweeteners", 
    subtitle: "Chemical-Free Palm & Cane",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "essential-minerals", 
    name: "Essential Minerals", 
    subtitle: "84 Trace Mineral Salts",
    icon: "ShieldCheck",
    image: "https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "forest-harvest", 
    name: "Forest Harvest", 
    subtitle: "Raw Wild Honey & Nectar",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400"
  },
  { 
    id: "cold-pressed-oils", 
    name: "Cold Pressed Oils", 
    subtitle: "Wood-Pressed Mara Chekku",
    icon: "Droplets",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=400"
  }
];

export const INGREDIENT_SPOTLIGHT = [
  {
    id: "tulsi",
    name: "Tulsi (Holy Basil)",
    sanskrit: "Holy Basil • Queen of Herbs",
    image: "https://images.unsplash.com/photo-1628172935277-c99ebbaadca5?auto=format&fit=crop&q=80&w=600",
    description: "Revered in sacred texts as 'The Incomparable One', Tulsi pacifies Kapha and Vata doshas, bolsters respiratory immunity, and promotes mental tranquility.",
    benefits: ["Adaptogenic stress relief", "Purifies prana & respiration", "Rich in eugenol & antioxidants"]
  },
  {
    id: "turmeric",
    name: "Turmeric (Haridra)",
    sanskrit: "Golden Healer",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600",
    description: "Cold-cured heirloom turmeric containing potent active curcuminoids. Prized across classical treatises for blood cleansing (Rakta Shodhana) and radiant complexion.",
    benefits: ["Potent anti-inflammatory", "Skin glow & wound healing", "Deep cellular detoxification"]
  },
  {
    id: "neem",
    name: "Neem (Nimba)",
    sanskrit: "Sacred Healer (Imperishable)",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=600",
    description: "The village apothecary of India. Cold-milled leaves provide bitter (Tikta) cooling potency to balance Pitta, purify the scalp, and clarify problematic skin.",
    benefits: ["Natural antimicrobial shield", "Soothes inflamed Pitta skin", "Cleanses scalp & follicle roots"]
  },
  {
    id: "amla",
    name: "Amla (Amalaki)",
    sanskrit: "The Nurse Fruit",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&q=80&w=600",
    description: "Celebrated in the Charaka Samhita as the premier Rasayana fruit. Packed with bio-stable Vitamin C, it kindles digestive fire (Agni) without aggravating Pitta.",
    benefits: ["Richest natural Vitamin C", "Enhances Ojas & cellular youth", "Deeply nourishes hair roots"]
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    sanskrit: "Strength of Ten Horses",
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=600",
    description: "Premier Balya (strength-imparting) root of Ayurveda. An adaptogenic wonder that nourishes Mamsa and Asthi dhatus while restoring deep restful sleep.",
    benefits: ["Enhances stamina & resilience", "Soothes agitated nervous system", "Supports hormonal harmony"]
  }
];

export const AYURVEDA_PRODUCTS = [
  // 1. HERITAGE RICE
  {
    id: 1,
    name: "Karuppu Kavuni Royal Black Rice",
    tamilName: "கருப்பு கவுனி அரிசி",
    sanskritName: "Krishna Dhanya",
    slug: "karuppu-kavuni-rice",
    price: 210,
    oldPrice: 250,
    category: "Heritage Rice",
    categoryId: "heritage-rice",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 148,
    weight: "500g",
    isBestSeller: true,
    badge: "ROYAL HARVEST",
    dosha: "Balances Vata & Pitta",
    shortDesc: "Ancient royal heirloom black rice with dense anthocyanin antioxidants and ancestral longevity nourishment.",
    description: "Sourced from chemical-free organic heritage fields of Tamil Nadu, Karuppu Kavuni was historically patronized by the royal Chola and Pandyan dynasties for strength and vitality. Rich in anthocyanins, its whole unpolished grain retains 100% natural fiber and minerals.",
    ayurvedicProperties: {
      rasa: "Madhura (Sweet), Kashaya (Astringent)",
      virya: "Sheeta (Cooling)",
      vipaka: "Madhura (Sweet)",
      doshaEffect: "Pacifies Vata & Pitta gently"
    },
    ingredients: "100% Single-Origin Heirloom Karuppu Kavuni Paddy, traditionally dehusked with whole bran intact.",
    howToUse: "Soak for 4-6 hours. Boil with 1:3 water in a clay pot or pressure cooker for 4 whistles. Ideal for rejuvenating Kavuni Kanji, sweet payasam, or daily nutritious meals.",
    sourcingInfo: "Directly farm-sourced from smallholder organic farmers in Kanchipuram & Thanjavur, Tamil Nadu.",
    variants: [
      { weight: "500g", price: 210, oldPrice: 250 },
      { weight: "1kg", price: 399, oldPrice: 480 },
      { weight: "2kg", price: 760, oldPrice: 920 }
    ],
    stock: 25
  },
  {
    id: 2,
    name: "Bamboo Rice (Moongil Arisi)",
    tamilName: "மூங்கில் அரிசி",
    sanskritName: "Venu Yava",
    slug: "bamboo-rice",
    price: 420,
    oldPrice: 480,
    category: "Heritage Rice",
    categoryId: "heritage-rice",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 90,
    weight: "250g",
    isNewArrival: true,
    badge: "RARE BOTANICAL",
    dosha: "Asthi Strengthening",
    shortDesc: "Rare seeds harvested from dying flowering bamboo once in 40-50 years; exceptional calcium for bones and joints.",
    description: "Documented in classical botanical Nighantus as Venu Yava, this rare harvest is an extraordinary source of plant-based calcium, protein, and silicon that nourishes bone marrow and joint flexibility.",
    ayurvedicProperties: {
      rasa: "Kashaya, Madhura",
      virya: "Sheeta",
      vipaka: "Katu",
      doshaEffect: "Strengthens bones, calms joint inflammation"
    },
    ingredients: "100% Wild Forest Foraged Bamboo Seeds.",
    howToUse: "Soak for 6 hours. Pressure cook 1:2.5 water for 5 whistles. Delicious as nutritious breakfast kheer or therapeutic kanji.",
    sourcingInfo: "Wild-foraged sustainably by tribal communities in Western Ghats.",
    variants: [
      { weight: "250g", price: 420, oldPrice: 480 },
      { weight: "500g", price: 790, oldPrice: 920 }
    ],
    stock: 14
  },
  {
    id: 3,
    name: "Nava Rice Heritage 9-Grain Blend",
    tamilName: "நவ அரிசி",
    sanskritName: "Nava Dhanya",
    slug: "nava-rice",
    price: 180,
    oldPrice: 220,
    category: "Heritage Rice",
    categoryId: "heritage-rice",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 116,
    weight: "500g",
    isBestSeller: true,
    badge: "ANCESTRAL BLEND",
    dosha: "Tridoshic",
    shortDesc: "A master blend of 9 traditional heritage Tamil rice varieties for comprehensive daily vitality.",
    description: "Combines Karuppu Kavuni, Mappillai Samba, Poongar, Kaatuyanam, and Kullakar. Each variety brings unique phytonutrients, trace minerals, and vitamins for holistic body rejuvenation.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Balanced multi-spectrum nourishment"
    },
    ingredients: "100% Blend of 9 Unpolished Heritage Rice Varieties.",
    howToUse: "Soak for 3-4 hours. Cook 1:3 water ratio for 4 whistles.",
    sourcingInfo: "Grown in Kanchipuram and Cauvery delta organic farms.",
    variants: [
      { weight: "500g", price: 180, oldPrice: 220 },
      { weight: "1kg", price: 340, oldPrice: 410 }
    ],
    stock: 30
  },
  {
    id: 4,
    name: "Mappillai Samba Heritage Stamina Grain",
    tamilName: "மாப்பிள்ளை சம்பா அரிசி",
    sanskritName: "Balya Rakta Dhanya",
    slug: "mappillai-samba-rice",
    price: 195,
    oldPrice: 230,
    category: "Heritage Rice",
    categoryId: "heritage-rice",
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 138,
    weight: "500g",
    isBestSeller: true,
    badge: "BALYA RASAYANA",
    dosha: "Vata & Pitta Friendly",
    shortDesc: "Legendary red heritage grain traditionally fed to newly married bridegrooms for physical endurance.",
    description: "A rich red rice packed with natural iron, zinc, and bioflavonoids. Fortifies physical stamina, calms gastric ulcer irritation, and restores endurance after physical exhaustion.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Enhances Ojas, builds bodily strength (Bala)"
    },
    ingredients: "100% Unpolished Red Mappillai Samba Rice.",
    howToUse: "Soak for 4 hours. Cook with 1:3 water.",
    sourcingInfo: "Organically grown by heirloom seed conservators in Tamil Nadu.",
    variants: [
      { weight: "500g", price: 195, oldPrice: 230 },
      { weight: "1kg", price: 370, oldPrice: 440 }
    ],
    stock: 45
  },
  {
    id: 5,
    name: "Kullakar Organic Red Rice",
    tamilName: "குள்ளக்கார் அரிசி",
    sanskritName: "Kullakar Red Paddy",
    slug: "kullakar-rice",
    price: 205,
    oldPrice: 240,
    category: "Heritage Rice",
    categoryId: "heritage-rice",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 42,
    weight: "500g",
    isBestSeller: false,
    badge: "RED GRAIN",
    dosha: "Immunity Fortifier",
    shortDesc: "Ancient indigenous short-duration red rice, rich in zinc and protective flavonoids.",
    description: "Kullakar is one of South India's oldest native paddy varieties. It contains significant amounts of bio-active zinc, iron, and flavonoids in its red outer bran coat.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Rebuilds natural metabolic vitality"
    },
    ingredients: "100% Unpolished Kullakar Red Rice.",
    howToUse: "Soak for 4 hours. Pressure cook 1:3 water for 4 whistles.",
    sourcingInfo: "Cultivated in Kanchipuram heritage farmland.",
    variants: [
      { weight: "500g", price: 205, oldPrice: 240 },
      { weight: "1kg", price: 390, oldPrice: 460 }
    ],
    stock: 20
  },

  // 2. ANCIENT MILLETS
  {
    id: 6,
    name: "Organic Thinai (Foxtail Millet)",
    tamilName: "தினை",
    sanskritName: "Kangani Seed",
    slug: "thinai-foxtail-millet",
    price: 115,
    oldPrice: 140,
    category: "Ancient Millets",
    categoryId: "ancient-millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 75,
    weight: "500g",
    isBestSeller: true,
    badge: "VITALITY SEED",
    dosha: "Tridosha Balancing",
    shortDesc: "Ancient Sangam grain celebrated as the food of Murugan; rich in natural Vitamin B12 and fiber.",
    description: "Mentioned in Sangam literature, Thinai is an ancient wonder seed. Free from synthetic chemicals, it is rich in Vitamin B12, heart-friendly magnesium, and dietary fiber that supports active metabolic health.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Balances Tridosha, strengthens nerves"
    },
    ingredients: "100% Pure Organic Unpolished Foxtail Millet.",
    howToUse: "Soak 30 mins. Cook 1:2.5 water for 15 mins for pongal or upma.",
    sourcingInfo: "Direct from rainfed organic farming clusters.",
    variants: [
      { weight: "500g", price: 115, oldPrice: 140 },
      { weight: "1kg", price: 215, oldPrice: 260 }
    ],
    stock: 40
  },
  {
    id: 7,
    name: "Organic Kuthiraivali (Barnyard Millet)",
    tamilName: "குதிரைவாலி",
    sanskritName: "Shyamaka Grain",
    slug: "kuthiraivali-barnyard-millet",
    price: 135,
    oldPrice: 160,
    category: "Ancient Millets",
    categoryId: "ancient-millets",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 63,
    weight: "500g",
    isBestSeller: false,
    badge: "FIBER RICH",
    dosha: "Kapha Pacifying",
    shortDesc: "Highest dietary fiber among millets; low glycemic index for easy weight control and gut health.",
    description: "Barnyard millet is celebrated for having 6 times more fiber than wheat and white rice. Promotes lasting satiety and assists healthy cholesterol management.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Sheeta",
      vipaka: "Katu",
      doshaEffect: "Alleviates excess Kapha and Medas"
    },
    ingredients: "100% Single-Origin Organic Barnyard Millet.",
    howToUse: "Soak 30 mins. Cook 1:2.5 water for 12 mins.",
    sourcingInfo: "Sourced from traditional dryland farmers.",
    variants: [
      { weight: "500g", price: 135, oldPrice: 160 },
      { weight: "1kg", price: 250, oldPrice: 300 }
    ],
    stock: 35
  },
  {
    id: 8,
    name: "Organic Samai (Little Millet)",
    tamilName: "சாமை",
    sanskritName: "Kuttu Grain",
    slug: "samai-little-millet",
    price: 125,
    oldPrice: 150,
    category: "Ancient Millets",
    categoryId: "ancient-millets",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewsCount: 51,
    weight: "500g",
    isBestSeller: false,
    badge: "LIGHT & NOURISHING",
    dosha: "Easy on Agni",
    shortDesc: "Delicate small grain packed with iron and bio-flavonoids; perfect for infant and family nutrition.",
    description: "Revered in native kitchen traditions for its light, quick-cooking nature and high iron profile that rejuvenates energy levels naturally.",
    ayurvedicProperties: {
      rasa: "Madhura",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Gentle on digestive Agni"
    },
    ingredients: "100% Organic Little Millet.",
    howToUse: "Cook with 1:2 water for 10-12 minutes.",
    sourcingInfo: "Naturally stone-cleaned in Tamil Nadu.",
    variants: [
      { weight: "500g", price: 125, oldPrice: 150 },
      { weight: "1kg", price: 235, oldPrice: 280 }
    ],
    stock: 28
  },
  {
    id: 9,
    name: "Organic Varagu (Kodo Millet)",
    tamilName: "வரகு",
    sanskritName: "Kodrava Grain",
    slug: "varagu-kodo-millet",
    price: 130,
    oldPrice: 160,
    category: "Ancient Millets",
    categoryId: "ancient-millets",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 68,
    weight: "500g",
    isBestSeller: false,
    badge: "ANTIOXIDANT",
    dosha: "Pitta & Kapha Balance",
    shortDesc: "Rich in protective polyphenols and lecithin; supports nervous system and cardiovascular health.",
    description: "Varagu was the ancestral staple of drought-prone regions. Delivers profound antioxidant activity and contains polyphenols that scavenge free radicals.",
    ayurvedicProperties: {
      rasa: "Kashaya, Madhura",
      virya: "Sheeta",
      vipaka: "Katu",
      doshaEffect: "Reduces fat and detoxifies Rakta"
    },
    ingredients: "100% Organic Kodo Millet.",
    howToUse: "Soak 1 hour. Pressure cook 1:3 water for 3 whistles.",
    sourcingInfo: "Direct from traditional millets growers.",
    variants: [
      { weight: "500g", price: 130, oldPrice: 160 },
      { weight: "1kg", price: 245, oldPrice: 300 }
    ],
    stock: 32
  },

  // 3. NATIVE SWEETENERS
  {
    id: 10,
    name: "Pure Palm Jaggery (Karupatti)",
    tamilName: "பனைவெல்லம்",
    sanskritName: "Tala Guda",
    slug: "palm-jaggery",
    price: 340,
    oldPrice: 400,
    category: "Native Sweeteners",
    categoryId: "native-sweeteners",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 168,
    weight: "500g",
    isBestSeller: true,
    badge: "MINERAL RICH",
    dosha: "Tridoshic",
    shortDesc: "Authentic dark palmyra nectar boiled over wood fires. Packed with natural non-heme iron and minerals.",
    description: "Handcrafted from unfermented palmyra sap without sulphur, chemical lime, or artificial clarifiers. An unrefined ancestral sweetener that supports hemoglobin formation and purifies blood channels.",
    ayurvedicProperties: {
      rasa: "Madhura",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Rejuvenates Rakta Dhatu and respiratory prana"
    },
    ingredients: "100% Pure Organic Palmyra Palm Nectar.",
    howToUse: "Add to herbal teas, Sukku Malli coffee, or use as a mineral-dense natural alternative.",
    sourcingInfo: "Direct from traditional palmyra tappers of Tuticorin, Tamil Nadu.",
    variants: [
      { weight: "500g", price: 340, oldPrice: 400 },
      { weight: "1kg", price: 650, oldPrice: 780 }
    ],
    stock: 28
  },
  {
    id: 11,
    name: "Pure Palm Candy (Panangarkandu)",
    tamilName: "பனங்கற்கண்டு",
    sanskritName: "Tala Sharkara",
    slug: "palm-candy",
    price: 380,
    oldPrice: 450,
    category: "Native Sweeteners",
    categoryId: "native-sweeteners",
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 5.0,
    reviewsCount: 105,
    weight: "200g",
    isBestSeller: true,
    badge: "SOOTHING SWEET",
    dosha: "Pitta Pacifier",
    shortDesc: "Crystallized palm nectar; time-tested Ayurvedic remedy for clearing throat irritation and building Ojas.",
    description: "Naturally crystallized from palmyra sap without sulphur bleaching. Renowned across South Indian homes for soothing persistent dry cough, soothing sore vocal cords, and cooling tropical summer body heat.",
    ayurvedicProperties: {
      rasa: "Madhura",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Alleviates throat Pitta and excessive dryness"
    },
    ingredients: "100% Unrefined Palmyra Palm Crystal Sugar.",
    howToUse: "Simmer with warm turmeric milk and crushed black pepper before bed.",
    sourcingInfo: "Naturally crystal-harvested in Tamil Nadu palm groves.",
    variants: [
      { weight: "200g", price: 380, oldPrice: 450 },
      { weight: "500g", price: 890, oldPrice: 1050 }
    ],
    stock: 22
  },
  {
    id: 12,
    name: "Organic Country Sugar (Nattu Sakkarai)",
    tamilName: "நாட்டு சர்க்கரை",
    sanskritName: "Ikshu Sharkara",
    slug: "organic-country-sugar",
    price: 95,
    oldPrice: 120,
    category: "Native Sweeteners",
    categoryId: "native-sweeteners",
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 112,
    weight: "500g",
    isBestSeller: false,
    badge: "EVERYDAY SWEET",
    dosha: "Gentle on Gut",
    shortDesc: "Unrefined golden cane sugar retaining natural molasses and micro-minerals.",
    description: "Produced using non-GMO organic sugarcane juice boiled with herbal clarifying agents (okra stem extract). Free from sulphur and bleaching agents.",
    ayurvedicProperties: {
      rasa: "Madhura",
      virya: "Sheeta",
      vipaka: "Madhura",
      doshaEffect: "Natural substitute for bleached white sugar"
    },
    ingredients: "100% Unrefined Organic Sugarcane Sugar.",
    howToUse: "Use 1:1 in place of white sugar in teas, coffee, porridge, and baking.",
    sourcingInfo: "Direct from organic sugarcane jaggery units in Tamil Nadu.",
    variants: [
      { weight: "500g", price: 95, oldPrice: 120 },
      { weight: "1kg", price: 180, oldPrice: 230 }
    ],
    stock: 50
  },

  // 4. ESSENTIAL MINERALS
  {
    id: 13,
    name: "Saindhava Lavana (Pink Himalayan Rock Salt)",
    tamilName: "இந்து உப்பு",
    sanskritName: "Saindhava Lavana",
    slug: "himalayan-rock-salt",
    price: 85,
    oldPrice: 110,
    category: "Essential Minerals",
    categoryId: "essential-minerals",
    image: "https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1610450531586-4ef35ef50ae3?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 92,
    weight: "500g",
    isNewArrival: true,
    badge: "SUPREME SALT",
    dosha: "Hridya (Heart Friendly)",
    shortDesc: "The only salt celebrated in Ayurvedic treatises as Hridya (gentle on the heart) and Chakshushya (beneficial for vision).",
    description: "Unlike commercial refined iodized table salts loaded with synthetic anti-caking chemicals, Saindhava Lavana contains 84 trace ionic minerals and does not aggravate Pitta or create heavy water retention.",
    ayurvedicProperties: {
      rasa: "Lavana (Salty), slightly sweet post-digestive",
      virya: "Sheeta (Uniquely cooling unlike sea salt)",
      vipaka: "Madhura",
      doshaEffect: "Balances all three doshas without burning Agni"
    },
    ingredients: "100% Pristine Himalayan Mineral Rock Salt Crystals.",
    howToUse: "Use in daily cooking, Ayurvedic Pachana tonics, warm salt water gargles, or Neti pot rituals.",
    sourcingInfo: "Mined from ancient unpolluted sea deposits.",
    variants: [
      { weight: "500g", price: 85, oldPrice: 110 },
      { weight: "1kg", price: 160, oldPrice: 200 }
    ],
    stock: 60
  },

  // 5. FOREST HARVEST
  {
    id: 14,
    name: "Pure Wild Forest Honey (Madhu)",
    tamilName: "சுத்த மலைத்தேன்",
    sanskritName: "Aranya Madhu",
    slug: "wild-forest-honey",
    price: 450,
    oldPrice: 550,
    category: "Forest Harvest",
    categoryId: "forest-harvest",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 5.0,
    reviewsCount: 194,
    weight: "500g",
    isBestSeller: true,
    badge: "YOGAVAHI",
    dosha: "Balances Kapha & Pitta",
    shortDesc: "Raw, unheated multifloral forest honey gathered ethically by indigenous honey hunters from deep floral reserves.",
    description: "In classical Ayurveda, raw honey is designated as Yogavahi—a sublime substance that penetrates deep micro-channels (Srotas) to carry therapeutic herbs without losing its own innate healing virtue. Unheated and unfiltered.",
    ayurvedicProperties: {
      rasa: "Madhura, Kashaya",
      virya: "Ushna (Mild warming)",
      vipaka: "Katu (Pungent)",
      doshaEffect: "Reduces Kapha and Meda (fat), pacifies Vata"
    },
    ingredients: "100% Raw Wild Honey from natural forest bee hives in Eastern Ghats.",
    howToUse: "Take 1 teaspoon in lukewarm water (never boiling) in the morning with lemon, or mix with herbal powders as an Anupana.",
    sourcingInfo: "Sustainably hand-harvested by indigenous tribal collectives with fair compensation.",
    variants: [
      { weight: "250g", price: 240, oldPrice: 290 },
      { weight: "500g", price: 450, oldPrice: 550 },
      { weight: "1kg", price: 850, oldPrice: 1050 }
    ],
    stock: 35
  },

  // 6. COLD PRESSED OILS
  {
    id: 15,
    name: "Wood-Pressed Black Sesame Oil (Mara Chekku)",
    tamilName: "மரச்செக்கு நல்லெண்ணெய்",
    sanskritName: "Tila Taila",
    slug: "wood-pressed-sesame-oil",
    price: 240,
    oldPrice: 280,
    category: "Cold Pressed Oils",
    categoryId: "cold-pressed-oils",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewsCount: 96,
    weight: "500ml",
    isBestSeller: true,
    badge: "VATA SHAMAKA",
    dosha: "Premier Vata Pacifier",
    shortDesc: "Traditional Vaagai-wood cold pressed black sesame oil. The supreme Ayurvedic oil for daily body massage and cooking.",
    description: "Ayurveda designates pure Tila Taila as the greatest among all vegetable oils for relieving Vata afflictions, joint stiffness, and dryness. Pressed in authentic wooden churners (Mara Chekku) with pure palm jaggery, retaining all natural lignans.",
    ayurvedicProperties: {
      rasa: "Madhura, Tikta, Kashaya",
      virya: "Ushna (Warming)",
      vipaka: "Madhura",
      doshaEffect: "Supreme Vata healer, strengthens Asthi Dhatu"
    },
    ingredients: "100% Native Black Sesame Seeds, Palm Jaggery.",
    howToUse: "Warm slightly and perform full-body self-massage (Abhyanga), or use in traditional tempering and cooking.",
    sourcingInfo: "Cold-crushed in Kanchipuram artisan wooden ghani.",
    variants: [
      { weight: "500ml", price: 240, oldPrice: 280 },
      { weight: "1 Litre", price: 460, oldPrice: 540 }
    ],
    stock: 50
  },
  {
    id: 16,
    name: "Virgin Wood-Pressed Coconut Oil (Mara Chekku)",
    tamilName: "மரச்செக்கு தேங்காய் எண்ணெய்",
    sanskritName: "Narikela Taila",
    slug: "wood-pressed-coconut-oil",
    price: 260,
    oldPrice: 310,
    category: "Cold Pressed Oils",
    categoryId: "cold-pressed-oils",
    image: "https://images.unsplash.com/photo-1608248597359-25255476a6d6?auto=format&fit=crop&q=80&w=800",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-25255476a6d6?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewsCount: 120,
    weight: "500ml",
    isBestSeller: true,
    badge: "COOLING PITTA",
    dosha: "Cooling Pitta Healer",
    shortDesc: "Cold-extracted from sun-dried sulfur-free copra in Vaagai wood churners. Unrefined and naturally fragrant.",
    description: "Pure virgin wood-pressed coconut oil retains all natural lauric acid, vitamin E, and antimicrobial fatty acids. Perfect for deep scalp nourishment, infant massage, and light culinary use.",
    ayurvedicProperties: {
      rasa: "Madhura",
      virya: "Sheeta (Deep Cooling)",
      vipaka: "Madhura",
      doshaEffect: "Pacifies severe Pitta and skin heat"
    },
    ingredients: "100% Native Sulfur-Free Dried Coconut Copra.",
    howToUse: "Apply to scalp before bathing or use for gentle baby massage.",
    sourcingInfo: "Direct from certified coconut groves in Pollachi, Tamil Nadu.",
    variants: [
      { weight: "500ml", price: 260, oldPrice: 310 },
      { weight: "1 Litre", price: 490, oldPrice: 590 }
    ],
    stock: 40
  }
];

export const AYURVEDA_STORY = {
  title: "Ancient Wisdom, Thoughtfully Reimagined.",
  subtitle: "Mother Nature • Kanchipuram Roots",
  paragraphs: [
    "Centuries before modern wellness trends, the physician-sages of ancient India unlocked the medicinal alchemy of soil, rainfall, sun, and seasonal rhythms. In the ancient temple town of Kanchipuram, that sacred connection to native grains and Ayurvedic botanicals never truly faded.",
    "At Mother Nature, we believe that true royalty is not measured in luxury, but in the purity of what enters your sanctuary and body. We partner directly with smallholder heritage farmers who protect native seeds, practice non-violent harvesting, and refuse chemical adulteration.",
    "Every grain of Karuppu Kavuni, every drop of wood-pressed tailam, and every pinch of wild forest honey is prepared with strict adherence to classical texts and verified quality."
  ],
  stats: [
    { label: "Native Heirloom Seeds", value: "100% Purity" },
    { label: "Chemical & Sulphur Free", value: "0% Additives" },
    { label: "Direct Farmer Partners", value: "120+ Families" },
    { label: "Classical Formulations", value: "Authentic" }
  ]
};

export const AYURVEDA_REVIEWS = [
  {
    id: 1,
    name: "Rukmini Vasanth",
    location: "Kotturpuram, Chennai",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    verified: true,
    product: "Karuppu Kavuni Rice & Palm Jaggery",
    title: "Feels like stepping into an ancient royal apothecary",
    comment: "The Karuppu Kavuni has an authentic aroma when cooked in our clay pot that reminds me of my grandmother's village kitchen in Kumbakonam. And the Palm Jaggery is deeply dark, earthy, and mineral-dense."
  },
  {
    id: 2,
    name: "Dr. Arvind Vaidyanathan (BAMS)",
    location: "Malleshwaram, Bengaluru",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    verified: true,
    product: "Wood-Pressed Sesame Oil & Thinai",
    title: "Genuine classical preparation without cutting corners",
    comment: "As an Ayurvedic practitioner, finding truly wood-pressed tailams and unpolished native millets with intact bran is rare today. Mother Nature's transparency and quality control are deeply commendable."
  },
  {
    id: 3,
    name: "Meenakshi Sundaram",
    location: "Race Course, Coimbatore",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    rating: 5,
    verified: true,
    product: "Pure Wild Forest Honey & Saindhava Salt",
    title: "Pure ingredients without white sugar or chemicals",
    comment: "Most commercial honey is sugar-syrup fed, but Mother Nature's wild honey is raw, deeply aromatic, and therapeutic. Our entire family is now free from refined sugar and processed salts."
  }
];