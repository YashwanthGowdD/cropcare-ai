// Comprehensive mock data for CropCare AI - Smart Farming Assistant

export const MOCK_CROPS = [
  { id: 'tomato', name: 'Tomato', category: 'Vegetable', icon: '🍅' },
  { id: 'rice', name: 'Rice / Paddy', category: 'Grain', icon: '🌾' },
  { id: 'wheat', name: 'Wheat', category: 'Cereal', icon: '🌱' },
  { id: 'cotton', name: 'Cotton', category: 'Fiber', icon: '☁️' },
  { id: 'potato', name: 'Potato', category: 'Tuber', icon: '🥔' },
  { id: 'maize', name: 'Maize / Corn', category: 'Cereal', icon: '🌽' },
  { id: 'sugarcane', name: 'Sugarcane', category: 'Cash Crop', icon: '🎋' },
  { id: 'chilli', name: 'Chilli / Pepper', category: 'Spice', icon: '🌶️' },
  { id: 'apple', name: 'Apple', category: 'Fruit', icon: '🍎' },
  { id: 'soybean', name: 'Soybean', category: 'Legume', icon: '🫘' },
];

export const MOCK_SYMPTOMS = [
  'Yellowing of lower leaves (Chlorosis)',
  'Dark concentric rings / target spots on leaves',
  'White powdery coating on leaf surface',
  'Sudden wilting during midday',
  'Water-soaked lesions on stems and fruits',
  'Stunted plant growth and mosaic patterns',
  'Rust-colored pustules underneath leaves',
  'Curling and crinkling of leaf edges',
  'Black sooty mold on stems and leaves',
  'Premature fruit drop and rot'
];

export const MOCK_DISEASE_PRESETS = {
  tomato_blight: {
    id: 'dis-001',
    diseaseName: 'Tomato Early Blight (Alternaria solani)',
    crop: 'Tomato',
    confidenceScore: 97.4,
    severity: 'Moderate',
    status: 'Action Required',
    detectedDate: 'Today, 10:45 AM',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80',
    description: 'Early blight is a very common fungal disease affecting foliage, stems, and fruits of tomatoes and potatoes. It typically starts on older leaves near the base of the plant and progresses upward.',
    symptoms: [
      'Brown to black spots with concentric rings creating a "target-board" effect',
      'Yellow halos surrounding the necrotic leaf spots',
      'Stem lesions with dark, sunken concentric markings',
      'Premature defoliation exposing fruit to sunscald'
    ],
    possibleCauses: [
      'Alternaria solani fungal pathogen surviving in previous crop debris',
      'Frequent overhead irrigation creating leaf wetness for >8 hours',
      'Warm temperatures (24°C - 29°C) combined with high humidity',
      'Crowded plant canopy with restricted air circulation'
    ],
    preventionMethods: [
      'Practice 3-year crop rotation avoiding Solanaceous family plants',
      'Install drip irrigation instead of overhead sprinklers to keep foliage dry',
      'Stake or cage tomato plants and mulch ground with clean straw',
      'Prune lower 12 inches of foliage after first fruit cluster sets'
    ],
    treatmentRecommendations: [
      'Immediately remove and safely destroy heavily infected lower leaves',
      'Apply preventative copper-based spray or systemic bio-fungicide',
      'Repeat foliar spray every 7-10 days until new healthy growth appears',
      'Balance soil nutrition; avoid excessive nitrogen which spurs susceptible tender growth'
    ],
    recommendedMedicines: [
      'med-001',
      'med-002',
      'med-004'
    ]
  },
  rice_blast: {
    id: 'dis-002',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    crop: 'Rice / Paddy',
    confidenceScore: 95.8,
    severity: 'High',
    status: 'Critical Alert',
    detectedDate: 'Yesterday, 3:20 PM',
    imageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80',
    description: 'Rice blast is one of the most destructive cereal diseases globally, attacking leaves, collars, nodes, and panicles. Left unmanaged, it can reduce yield by up to 50-70%.',
    symptoms: [
      'Spindle-shaped elliptical lesions with gray/whitish centers and dark margins',
      'Lesions enlarge and coalesce, causing entire leaf blades to wither',
      'Rotten neck phase causing empty, bleached panicles (panicle blast)',
      'Blackened, brittle nodal infections leading to stem breakage'
    ],
    possibleCauses: [
      'Airborne conidial spores dispersed by wind and dew droplets',
      'Excessive chemical nitrogen fertilizer applications',
      'Prolonged leaf wetness (>10 hours) and cool night temperatures (18-24°C)',
      'Dense planting in poorly drained clay soils'
    ],
    preventionMethods: [
      'Use certified blast-resistant seed varieties (e.g. Swarna Sub1, MTU 1010)',
      'Treat seeds with Tricyclazole fungicide slurry before sowing',
      'Adopt split nitrogen fertilizer scheduling with balanced potassium',
      'Maintain intermittent flooding rather than continuous deep standing water'
    ],
    treatmentRecommendations: [
      'Spray Tricyclazole 75% WP or Azoxystrobin at early tillering stage',
      'Spray Carbendazim 50% WP during early morning dew clearance',
      'Discontinue nitrogen top-dressing immediately until infection subsides'
    ],
    recommendedMedicines: [
      'med-003',
      'med-005'
    ]
  },
  wheat_rust: {
    id: 'dis-003',
    diseaseName: 'Yellow / Stripe Rust (Puccinia striiformis)',
    crop: 'Wheat',
    confidenceScore: 94.2,
    severity: 'High',
    status: 'Action Required',
    detectedDate: '3 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    description: 'Stripe rust produces characteristic yellow-orange pustules aligned in linear stripes along the leaf veins, drastically reducing photosynthetic capacity and kernel weight.',
    symptoms: [
      'Bright yellow-orange powdery pustules arranged in parallel stripes',
      'Chlorotic streaks turning necrotic as the fungus depletes grain moisture',
      'Yellow dust rubs off readily onto fingers or clothing',
      'Shrinkage of wheat grains and premature ripening'
    ],
    possibleCauses: [
      'Cool temperatures (10-15°C) with persistent fog or light rain',
      'Wind-blown urediniospores travelling long distances across agricultural belts',
      'Susceptible monoculture wheat varieties lacking the Yr-resistance gene'
    ],
    preventionMethods: [
      'Sow recommended stripe rust-resistant cultivars (HD 2967, HD 3086)',
      'Ensure timely sowing before November 25 to evade peak rust conditions',
      'Regular scouting of border rows bordering water canals and shade'
    ],
    treatmentRecommendations: [
      'Foliar spray with Propiconazole 25% EC (1ml per liter water)',
      'Second spray after 15 days if cool humid conditions continue',
      'Enhance plant immunity by foliar application of potassium silicate'
    ],
    recommendedMedicines: [
      'med-001',
      'med-006'
    ]
  },
  cotton_curl: {
    id: 'dis-004',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    crop: 'Cotton',
    confidenceScore: 92.5,
    severity: 'Moderate',
    status: 'Monitoring',
    detectedDate: '5 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80',
    description: 'A devastating begomovirus transmitted exclusively by the whitefly vector (Bemisia tabaci). Causes significant leaf malformation, enations, and boll shedding.',
    symptoms: [
      'Upward and downward curling of leaf margins',
      'Thickening of primary and secondary veins (vein swelling)',
      'Cup-shaped leaf-like outgrowths (enations) under the leaf blades',
      'Stunted plant growth and reduced boll formation'
    ],
    possibleCauses: [
      'High population buildup of whitefly vector during hot dry spells',
      'Presence of weed hosts (Parthenium, Abutilon) along field boundaries',
      'Late sowing leading to vegetative stage coinciding with peak whitefly flights'
    ],
    preventionMethods: [
      'Install yellow sticky traps (15 traps/acre) to monitor and catch whiteflies',
      'Eradicate alternative weed hosts around field margins before sowing',
      'Intercrop with maize, cowpea or sorghum as barrier crops'
    ],
    treatmentRecommendations: [
      'Vector control: Spray Diafenthiuron 50% WP or Spiromesifen 22.9% SC',
      'Apply neem-based azadirachtin 10,000 ppm (2ml/L) as insect repellent',
      'Spray micronutrient zinc and boron to mitigate viral stress'
    ],
    recommendedMedicines: [
      'med-002',
      'med-005',
      'med-007'
    ]
  }
};

export const MOCK_MEDICINES = [
  {
    id: 'med-001',
    name: 'BioNeem Ultra Organic Bio-Fungicide',
    category: 'Bio-Pesticides',
    targetIssues: ['Early Blight', 'Powdery Mildew', 'Aphids', 'Mites'],
    cropCompatibility: ['Tomato', 'Chilli', 'Potato', 'Apple'],
    price: 349,
    originalPrice: 499,
    discount: '30% OFF',
    rating: 4.8,
    reviewsCount: 312,
    inStock: true,
    stockCount: 48,
    volume: '500 ml',
    activeIngredient: 'Cold Pressed Azadirachtin 10,000 PPM',
    manufacturer: 'GreenEarth AgriTech Ltd',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    description: 'Certified 100% organic neem oil based broad spectrum fungicide and insect repellant. Harmless to pollinators like bees and safe for organic export farming.',
    dosage: '2-3 ml per liter of water. Spray thoroughly on both leaf sides every 10 days.',
    precautions: 'Spray during early morning or late evening. Do not mix with sulfur-based sprays.'
  },
  {
    id: 'med-002',
    name: 'Kavach Copper Oxychloride 50 WP',
    category: 'Fungicides',
    targetIssues: ['Late Blight', 'Early Blight', 'Leaf Spot', 'Downy Mildew'],
    cropCompatibility: ['Tomato', 'Potato', 'Grapes', 'Vegetables'],
    price: 420,
    originalPrice: 550,
    discount: '24% OFF',
    rating: 4.7,
    reviewsCount: 184,
    inStock: true,
    stockCount: 32,
    volume: '500 g',
    activeIngredient: 'Copper Oxychloride 50% WP',
    manufacturer: 'Krishi Chem Corp',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    description: 'High-purity protective contact copper fungicide with excellent rain-fastness. Prevents spore germination and creates a protective shield over the foliage.',
    dosage: '2.5g - 3g per liter of clean water. Agitate well before foliar application.',
    precautions: 'Do not spray during peak midday sunlight. Use personal protective gloves.'
  },
  {
    id: 'med-003',
    name: 'BlastCure Tricyclazole 75 WP',
    category: 'Fungicides',
    targetIssues: ['Rice Blast', 'Neck Blast', 'Panicle Blast', 'Sheath Blight'],
    cropCompatibility: ['Rice / Paddy', 'Wheat', 'Maize'],
    price: 680,
    originalPrice: 850,
    discount: '20% OFF',
    rating: 4.9,
    reviewsCount: 426,
    inStock: true,
    stockCount: 19,
    volume: '250 g',
    activeIngredient: 'Tricyclazole 75% WP Systemic',
    manufacturer: 'AgroNova Science',
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
    description: 'Gold-standard systemic fungicide specifically engineered for maximum control over rice blast in vegetative, tillering, and booting stages.',
    dosage: '0.6g per liter of water. Two applications recommended at 15-day intervals.',
    precautions: 'Ensure uniform field water coverage. Do not drain field for 48 hours after spray.'
  },
  {
    id: 'med-004',
    name: 'Trichoderma Viride Bio-Fungicide Powder',
    category: 'Bio-Pesticides',
    targetIssues: ['Root Rot', 'Collar Rot', 'Fusarium Wilt', 'Damping Off'],
    cropCompatibility: ['Tomato', 'Chilli', 'Cotton', 'Legumes', 'Wheat'],
    price: 220,
    originalPrice: 299,
    discount: '26% OFF',
    rating: 4.9,
    reviewsCount: 520,
    inStock: true,
    stockCount: 75,
    volume: '1 kg',
    activeIngredient: 'Trichoderma Viride 1.5% WP (2x10^6 CFU/g)',
    manufacturer: 'Organic AgroBio Labs',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    description: 'Beneficial antagonistic biocontrol fungus that colonizes roots, digests pathogenic fungi mycelium, and stimulates systemic acquired resistance.',
    dosage: 'Soil application: Mix 2 kg with 100 kg farmyard manure per acre. Seed treatment: 10g/kg seed.',
    precautions: 'Never mix with chemical fungicides. Keep in cool, shaded room.'
  },
  {
    id: 'med-005',
    name: 'Sentry Broad-Spectrum Insecticide',
    category: 'Insecticides',
    targetIssues: ['Whiteflies', 'Thrips', 'Stem Borer', 'Aphids', 'Jassids'],
    cropCompatibility: ['Cotton', 'Paddy', 'Chilli', 'Sugarcane', 'Soybean'],
    price: 790,
    originalPrice: 999,
    discount: '21% OFF',
    rating: 4.6,
    reviewsCount: 167,
    inStock: true,
    stockCount: 12,
    volume: '100 ml',
    activeIngredient: 'Diafenthiuron 50% WP',
    manufacturer: 'Syntro Agrochemicals',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    description: 'Unique mode of action providing rapid knockdown of nymph and adult sucking pests while disrupting their ATP synthase enzymes.',
    dosage: '1.25g per liter of water. Ensure thorough drenching of undersides of leaves.',
    precautions: 'Toxic to aquatic organisms. Keep away from water bodies and farm animal sheds.'
  },
  {
    id: 'med-006',
    name: 'Tilt Rust Shield Propiconazole 25 EC',
    category: 'Fungicides',
    targetIssues: ['Stripe Rust', 'Brown Rust', 'Karnal Bunt', 'Powdery Mildew'],
    cropCompatibility: ['Wheat', 'Groundnut', 'Soybean', 'Tea'],
    price: 540,
    originalPrice: 699,
    discount: '23% OFF',
    rating: 4.8,
    reviewsCount: 289,
    inStock: true,
    stockCount: 27,
    volume: '250 ml',
    activeIngredient: 'Propiconazole 25% EC',
    manufacturer: 'BumperHarvest Cropsciences',
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    description: 'Ergosterol biosynthesis inhibitor systemic fungicide providing curative, preventative, and eradicative protection for cereals against devastating rust outbreaks.',
    dosage: '1 ml per liter of water or 200 ml per acre with 200 liters of water.',
    precautions: 'Do not apply within 30 days of harvest. Wear respirator mask during spray.'
  },
  {
    id: 'med-007',
    name: 'AgriZyme Growth Booster & Immunity Tonic',
    category: 'Plant Growth Promoters',
    targetIssues: ['Stunted Growth', 'Nutrient Deficiency', 'Transplant Shock', 'Stress Recovery'],
    cropCompatibility: ['All Crops', 'Cotton', 'Vegetables', 'Fruits', 'Paddy'],
    price: 380,
    originalPrice: 480,
    discount: '21% OFF',
    rating: 4.9,
    reviewsCount: 640,
    inStock: true,
    stockCount: 60,
    volume: '1 Liter',
    activeIngredient: 'Seaweed Extract + Fulvic Acid + Chelated Micronutrients',
    manufacturer: 'NaturaBio Nutrition',
    imageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80',
    description: 'Bio-stimulant derived from cold-pressed Ascophyllum nodosum seaweed. Boosts root development, accelerates recovery from disease trauma, and enhances chlorophyll.',
    dosage: '2.5 ml per liter of water foliar spray, or 1 liter per acre via fertigation.',
    precautions: 'Compatible with most fungicides and insecticides. Shake bottle well before use.'
  },
  {
    id: 'med-008',
    name: 'WeedOut Selective Post-Emergence Herbicide',
    category: 'Herbicides',
    targetIssues: ['Broadleaf Weeds', 'Grasses', 'Cyperus Rotundus'],
    cropCompatibility: ['Wheat', 'Maize', 'Sugarcane'],
    price: 495,
    originalPrice: 620,
    discount: '20% OFF',
    rating: 4.5,
    reviewsCount: 98,
    inStock: false,
    stockCount: 0,
    volume: '500 ml',
    activeIngredient: '2,4-D Ethyl Ester 38% EC',
    manufacturer: 'Krishi Chem Corp',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    description: 'Highly effective selective hormone weedkiller that targets stubborn dicot broadleaf weeds without harming monocot grass crops.',
    dosage: '2-3 ml per liter of water applied using flat fan nozzle spray.',
    precautions: 'Avoid drift onto adjacent vegetable or cotton fields. Extremely sensitive crops.'
  }
];

export const MOCK_EXPERTS = [
  {
    id: 'exp-001',
    name: 'Dr. Anand Swaminathan',
    title: 'Senior Plant Pathologist & Agronomist',
    qualification: 'Ph.D. in Plant Pathology (IARI New Delhi)',
    experience: '16+ Years Experience',
    rating: 4.95,
    reviewCount: 380,
    specializations: ['Cereal Diseases', 'Fungal Pathology', 'Organic Pest Control', 'Soil Health'],
    languages: ['English', 'Hindi', 'Tamil'],
    onlineFee: 299,
    farmVisitFee: 899,
    availableToday: true,
    nextSlot: 'Today, 3:30 PM',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Former ICAR research fellow with over a decade of field diagnostic experience helping smallholder farmers maximize grain yields and transition toward sustainable IPM techniques.',
    verified: true,
    completedConsultations: 1420
  },
  {
    id: 'exp-002',
    name: 'Dr. Sunita Deshmukh',
    title: 'Horticulture & Vegetable Specialist',
    qualification: 'Ph.D. in Horticulture (TNAU Coimbatore)',
    experience: '12+ Years Experience',
    rating: 4.92,
    reviewCount: 290,
    specializations: ['Tomato & Solanaceous Crops', 'Greenhouse Management', 'Drip Fertigation', 'Viral Diseases'],
    languages: ['English', 'Hindi', 'Marathi'],
    onlineFee: 349,
    farmVisitFee: 999,
    availableToday: true,
    nextSlot: 'Today, 5:00 PM',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in high-density vegetable farming, polyhouse crop health, and viral disease containment. Consulted for over 800 progressive vegetable growers across central India.',
    verified: true,
    completedConsultations: 980
  },
  {
    id: 'exp-003',
    name: 'Er. Rajeshwar Verma',
    title: 'Chief Agricultural Officer & Entomologist',
    qualification: 'M.Sc. Agriculture (Entomology, PAU Ludhiana)',
    experience: '14+ Years Experience',
    rating: 4.88,
    reviewCount: 215,
    specializations: ['Cotton Pest Dynamics', 'Locust & Borer Control', 'Integrated Pest Management', 'Drone Spraying'],
    languages: ['English', 'Hindi', 'Punjabi'],
    onlineFee: 249,
    farmVisitFee: 799,
    availableToday: false,
    nextSlot: 'Tomorrow, 10:00 AM',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Renowned expert on cotton bollworms, whitefly resistance management, and precision drone pesticide applications with 14 years of state agriculture department service.',
    verified: true,
    completedConsultations: 1150
  },
  {
    id: 'exp-004',
    name: 'Dr. Meera Nambiar',
    title: 'Organic Farming & Soil Microbiologist',
    qualification: 'Ph.D. in Soil Science (UAS Bangalore)',
    experience: '10+ Years Experience',
    rating: 4.91,
    reviewCount: 178,
    specializations: ['Bio-fertilizers', 'Zero-Budget Natural Farming', 'Composting', 'Spices & Plantation Crops'],
    languages: ['English', 'Malayalam', 'Kannada', 'Hindi'],
    onlineFee: 299,
    farmVisitFee: 950,
    availableToday: true,
    nextSlot: 'Today, 4:15 PM',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneer in regenerative agriculture, biochar soil conditioning, and native microbial inoculants. Dedicated to reducing input costs and restoring soil organic carbon.',
    verified: true,
    completedConsultations: 740
  }
];

export const MOCK_HISTORY = [
  {
    id: 'hist-001',
    cropName: 'Tomato (Roma Variety)',
    fieldLocation: 'Plot 4 - North Ridge',
    uploadDate: '2026-10-28',
    diseaseName: 'Tomato Early Blight',
    severity: 'Moderate',
    status: 'Recovering (75%)',
    statusType: 'success',
    originalImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
    followUpImage: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80',
    treatmentTaken: 'Applied Kavach Copper Oxychloride + BioNeem Ultra spray',
    notes: 'Infection arrested. New flush of dark green leaves emerging after 8 days.',
    expertAssigned: 'Dr. Sunita Deshmukh'
  },
  {
    id: 'hist-002',
    cropName: 'Rice / Paddy (Basmati)',
    fieldLocation: 'Wetland Sector A',
    uploadDate: '2026-10-15',
    diseaseName: 'Rice Blast (Neck Blast)',
    severity: 'High',
    status: 'Under Treatment',
    statusType: 'warning',
    originalImage: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    followUpImage: null,
    treatmentTaken: 'Tricyclazole 75 WP sprayed twice with 10 day interval',
    notes: 'Secondary spread stopped; waiting for panicle emergence check.',
    expertAssigned: 'Dr. Anand Swaminathan'
  },
  {
    id: 'hist-003',
    cropName: 'Wheat (HD 2967)',
    fieldLocation: 'Block B - Canal Side',
    uploadDate: '2026-09-22',
    diseaseName: 'Yellow Stripe Rust',
    severity: 'Severe',
    status: 'Fully Resolved',
    statusType: 'resolved',
    originalImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    followUpImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    treatmentTaken: 'Foliar Propiconazole 25 EC + balanced potash top dress',
    notes: 'Complete recovery. Harvest completed with 22 quintals/acre yield.',
    expertAssigned: 'Er. Rajeshwar Verma'
  },
  {
    id: 'hist-004',
    cropName: 'Cotton (Bt Hybrid)',
    fieldLocation: 'South Sector 2',
    uploadDate: '2026-09-05',
    diseaseName: 'Cotton Leaf Curl Virus',
    severity: 'Moderate',
    status: 'Under Observation',
    statusType: 'warning',
    originalImage: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80',
    followUpImage: null,
    treatmentTaken: 'Diafenthiuron 50 WP vector eradication and yellow sticky traps',
    notes: 'Whitefly counts dropped below economic injury level.',
    expertAssigned: 'Er. Rajeshwar Verma'
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ORD-89412',
    date: '2026-10-30',
    items: [
      { name: 'Kavach Copper Oxychloride 50 WP', quantity: 2, price: 420 },
      { name: 'BioNeem Ultra Organic Bio-Fungicide', quantity: 1, price: 349 }
    ],
    totalAmount: 1189,
    paymentMethod: 'UPI / Razorpay (Demo)',
    status: 'Delivered',
    trackingNumber: 'AGRI-EXP-772190',
    deliveryAddress: 'House 42, Kisan Nagar, Near Gram Panchayat, Pune District, Maharashtra 410501'
  },
  {
    id: 'ORD-88204',
    date: '2026-10-18',
    items: [
      { name: 'BlastCure Tricyclazole 75 WP', quantity: 1, price: 680 },
      { name: 'AgriZyme Growth Booster & Immunity Tonic', quantity: 2, price: 380 }
    ],
    totalAmount: 1440,
    paymentMethod: 'Cash on Delivery (COD)',
    status: 'In Transit',
    trackingNumber: 'AGRI-EXP-654812',
    deliveryAddress: 'House 42, Kisan Nagar, Near Gram Panchayat, Pune District, Maharashtra 410501'
  }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'APT-1042',
    expertId: 'exp-002',
    expertName: 'Dr. Sunita Deshmukh',
    expertTitle: 'Horticulture & Vegetable Specialist',
    type: 'Online Video Call',
    date: '2026-11-04',
    timeSlot: '03:30 PM - 04:00 PM',
    status: 'Confirmed',
    crop: 'Tomato Early Blight',
    farmLocation: 'Kisan Nagar, Pune',
    meetingLink: 'https://meet.cropcare-ai.com/room/apt-1042-secure',
    fee: 349
  },
  {
    id: 'APT-0988',
    expertId: 'exp-001',
    expertName: 'Dr. Anand Swaminathan',
    expertTitle: 'Senior Plant Pathologist',
    type: 'Physical Farm Visit',
    date: '2026-11-08',
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'Scheduled',
    crop: 'Rice Blast & Soil Assessment',
    farmLocation: 'Green Valley Farms, Plot 4, Pune 410501',
    meetingLink: null,
    fee: 899
  }
];

export const MOCK_ADMIN_STATS = {
  totalFarmers: 14820,
  activeFarmersGrowth: '+12.4% this month',
  totalExperts: 184,
  totalOrders: 3940,
  revenue: '₹ 18,45,200',
  totalAppointments: 1290,
  diseaseDetectionsTotal: 34650,
  avgAccuracyScore: '98.4%',
  topDiseases: [
    { name: 'Tomato Early Blight', count: 1240, percentage: 35 },
    { name: 'Rice Blast', count: 980, percentage: 28 },
    { name: 'Wheat Stripe Rust', count: 650, percentage: 19 },
    { name: 'Cotton Leaf Curl', count: 420, percentage: 12 },
    { name: 'Potato Late Blight', count: 210, percentage: 6 }
  ],
  recentRegistrations: [
    { id: 'f-101', name: 'Ramesh Patel', state: 'Maharashtra', district: 'Pune', village: 'Kisan Nagar', crops: 'Tomato, Rice', joined: '2 hours ago' },
    { id: 'f-102', name: 'Gurpreet Singh', state: 'Punjab', district: 'Ludhiana', village: 'Raikot', crops: 'Wheat, Paddy', joined: '5 hours ago' },
    { id: 'f-103', name: 'Kavitha Reddy', state: 'Andhra Pradesh', district: 'Guntur', village: 'Tenali', crops: 'Chilli, Cotton', joined: 'Yesterday' },
    { id: 'f-104', name: 'Manish Verma', state: 'Uttar Pradesh', district: 'Varanasi', village: 'Chakia', crops: 'Potato, Mustard', joined: '2 days ago' }
  ]
};

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
];
