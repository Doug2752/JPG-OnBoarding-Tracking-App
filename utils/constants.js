// ── CONSTANTS ─────────────────────────────────────────────────

// ── USERS (FLAG 2 — fill passwords from source monolith) ──────
export const USERS = {
  Doug: 'JPG2026',
  Test: 'JPG2026'
};

// ── LOGO PATHS ────────────────────────────────────────────────
export const LOGO_LIGHT = 'jpglogo.png';
export const LOGO_DARK  = 'jpglogo.png';

// ── COLORS ────────────────────────────────────────────────────
export const GOLD        = '#B8860B';
export const GOLD_DARK   = '#7A6010';
export const GOLD_LIGHT  = '#FDF3D0';
export const BG          = '#F5F5F2';   // FIX: was '#B8860B' (gold) — correct to light background
export const DARK        = '#1A1A1A';
export const CHARCOAL    = '#2E2E2E';
export const MID         = '#4A4A4A';
export const BORDER      = '#D8D5CF';
export const STEEL       = '#3A5A78';
export const STEEL_MID   = '#2E4A64';
export const STEEL_LIGHT = '#E8EEF2';
export const GREEN       = '#2E5A4B';
export const GREEN_LIGHT = '#E8F2EE';
export const RED         = '#B02020';

// ── DAYS ──────────────────────────────────────────────────────
export const DAYS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];

// ── MONTHS ────────────────────────────────────────────────────
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── ACTIVITIES ────────────────────────────────────────────────
export const ACTIVITIES = [
  ['None', 0, ''],
  ['Rest', 0, ''],
  ['Running — Outdoor', 600, 'Cardiovascular'],
  ['Running — Treadmill', 580, 'Cardiovascular'],
  ['Walking — Outdoor', 280, 'Cardiovascular'],
  ['Walking — Treadmill', 260, 'Cardiovascular'],
  ['Hiking', 400, 'Cardiovascular'],
  ['Swimming', 500, 'Cardiovascular'],
  ['Weight Training — Full Body', 320, 'Strength'],
  ['Weight Training — Upper Body', 280, 'Strength'],
  ['Weight Training — Lower Body', 300, 'Strength'],
  ['Weight Training — Push', 270, 'Strength'],
  ['Weight Training — Pull', 270, 'Strength'],
  ['Weight Training — Legs', 300, 'Strength'],
  ['Powerlifting', 360, 'Strength'],
  ['Bodyweight Training', 350, 'Strength'],
  ['Kettlebell Training', 480, 'Strength'],
  ['CrossFit / Functional Fitness', 500, 'Strength'],
  ['Basketball', 480, 'Sport'],
  ['Soccer', 520, 'Sport'],
  ['Tennis', 440, 'Sport'],
  ['Pickleball', 380, 'Sport'],
  ['Golf', 240, 'Sport'],
  ['Martial Arts / BJJ', 500, 'Sport'],
  ['Boxing', 560, 'Sport'],
  ['Wrestling', 540, 'Sport'],
  ['Volleyball', 300, 'Sport'],
  ['Softball / Baseball', 280, 'Sport'],
  ['Flag Football', 480, 'Sport'],
  ['Yoga', 200, 'Flexibility'],
  ['Stretching / Mobility Work', 140, 'Flexibility'],
  ['Foam Rolling', 100, 'Flexibility'],
  ['Active Recovery Walk', 200, 'Flexibility'],
  ['Physical Therapy / Rehab Work', 160, 'Flexibility'],
  ['Other — Write In', 0, 'Other']
];

export const ACTIVITY_RATE = {};
ACTIVITIES.forEach(a => { ACTIVITY_RATE[a[0]] = a[1]; });

// ── SUPPLEMENTS ───────────────────────────────────────────────
export const SUPPLEMENTS = {
  'Vitamins': ['Vitamin A','Vitamin B1','Vitamin B2','Vitamin B3','Vitamin B5','Vitamin B6','Vitamin B7 (Biotin)','Vitamin B9 (Folate)','Vitamin B12','Vitamin C','Vitamin D3','Vitamin E','Vitamin K1','Vitamin K2'],
  'Minerals': ['Calcium','Chromium','Copper','Iodine','Iron','Magnesium','Manganese','Phosphorus','Potassium','Selenium','Zinc'],
  'Electrolytes': ['Bicarbonate','Calcium Carbonate','LMNT','Liquid IV','Magnesium Citrate','Nuun','Potassium Chloride','Sodium'],
  'Protein & Amino Acids': ['Arginine','BCAAs','Beta-Alanine','Casein Protein','Citrulline','Collagen Protein','Creatine','Glutamine','HMB','Leucine','Plant Protein','Whey Protein'],
  'Pre-Workout': ['Beetroot Extract','Caffeine','Nitric Oxide Booster','Pre-Workout Blend','Taurine'],
  'Recovery': ['Collagen Peptides','Creatine Monohydrate','L-Glutamine','Omega-3 Fish Oil','Tart Cherry Extract','Turmeric/Curcumin','ZMA'],
  'Herbals & Adaptogens': ['Ashwagandha','Chamomile','Echinacea','Elderberry','Ginseng','Holy Basil','Maca Root','Moringa','Rhodiola Rosea','Valerian Root'],
  'Digestive & Gut Health': ['Aloe Vera','Apple Cider Vinegar','Digestive Enzymes','Fiber Supplement','Prebiotics','Probiotics','Psyllium Husk'],
  'Omega & Fatty Acids': ['CLA','Evening Primrose Oil','Flaxseed Oil','Krill Oil','MCT Oil','Omega-3 Fish Oil'],
  'Sleep & Relaxation': ['5-HTP','GABA','L-Theanine','Magnesium Glycinate','Melatonin','Valerian Root'],
  'Joint & Bone Health': ['Boswellia','Chondroitin','Collagen Type II','Glucosamine','MSM','Turmeric'],
  'Antioxidants': ['Alpha Lipoic Acid','Astaxanthin','CoQ10','NAC','Quercetin','Resveratrol'],
  'Blood Sugar Support': ['Alpha Lipoic Acid','Berberine','Chromium','Cinnamon Extract','Magnesium']
};

// ── NON-NEGOTIABLE CATEGORIES ─────────────────────────────────
export const NON_NEG_CATS = [
  'None',
  'Family & Relationships',
  'Health & Fitness',
  'Faith & Spiritual Practice',
  'Personal Growth & Learning',
  'Work & Career',
  'Home & Household',
  'Community & Service',
  'Sports & Athletic Activity',
  'Other — Write In'
];

// ── PERFORMANCE BANDS ─────────────────────────────────────────
export const PERF_BANDS = [
  { label: 'UNSTOPPABLE',               min: 126, max: 140, avg: '9–10/day', bg: '#1a5c2a', desc: 'Elite execution. Every Foundation operating at its highest level.' },
  { label: 'PERFORMING',                min: 84,  max: 125, avg: '6–8/day',  bg: '#2d7a2d', desc: 'On track. Consistent effort with room for targeted improvement.' },
  { label: 'BUILDING AWARENESS',        min: 42,  max: 83,  avg: '3–5/day',  bg: '#c68b00', desc: 'Progress present but inconsistency is limiting results.' },
  { label: 'NEEDS IMMEDIATE ATTENTION', min: 0,   max: 41,  avg: '1–2/day',  bg: '#b02020', desc: 'Foundational habits require immediate focus and accountability.' }
];

// ── SLEEP BANDS ───────────────────────────────────────────────
export const SLEEP_BANDS = [
  { label: 'SUPERIOR RECOVERY',   minHrs: 112, bg: '#1a5c2a', desc: '≈8+ hrs/night — Excellent. Achievable but difficult to sustain long-term.' },
  { label: 'OPTIMAL RECOVERY',    minHrs: 98,  bg: '#2d7a2d', desc: '≈7–8 hrs/night — Sustainable high-performance sleep level. Maintain this range.' },
  { label: 'APPROACHING OPTIMAL', minHrs: 85,  bg: '#4a9a3a', desc: '≈6–7 hrs/night — Close to sustainable target. Minor improvements yield significant gains.' },
  { label: 'SLIGHT LACK',         minHrs: 71,  bg: '#c8a000', desc: '≈5–6 hrs/night — Improving but not yet optimal. Energy and recovery constrained.' },
  { label: 'LACK OF SLEEP',       minHrs: 57,  bg: '#d06000', desc: '≈4–5 hrs/night — Below optimal. Sustained deficit affecting function and recovery.' },
  { label: 'SEVERE LACK',         minHrs: 0,   bg: '#b02020', desc: '≈4 hrs/night — Critical. Performance and health are at serious risk.' }
];
