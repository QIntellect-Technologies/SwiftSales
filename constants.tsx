import { Truck, ShieldCheck, Activity, Building2, HeartPulse, Stethoscope, Thermometer, Box, FileText, Zap, Layers, Cpu, MapPin, Clock, Users } from 'lucide-react';
import { NavItem, Product, Service, License, Partner } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Services', path: '/services' },

  { label: 'Portfolio', path: '/portfolio' },
  // { label: 'Partners', path: '/partners' },
  { label: 'Contact', path: '/contact' },
];

export const STATS = [
  { label: 'Districts Served', value: '100+' },
  { label: 'Local Pharmacies', value: '250+' },
  { label: 'Daily Deliveries', value: '1,500+' },
  { label: 'Avg. Delivery Time', value: '4 Hrs' },
];

export const MILESTONES = [
  { year: '2012', title: 'Swift Sales Launch', description: 'Launched Swift Sales as a dedicated wholesale distributor with a focused founding team.' },
  { year: '2015', title: 'Scaling Operations', description: 'Expanded operations significantly and secured key distribution partnerships with leading companies.' },
  { year: '2018', title: 'Resilience through COVID', description: 'Navigated global market challenges and economic shifts, focusing on resilience and adaptation.' },
  { year: '2021', title: 'The Comeback', description: 'Regained strong momentum, strengthening our foundation and expanding our dedicated workforce.' },
  { year: '2024', title: 'Group Expansion', description: 'Successfully evolved into a group of companies, broadening our impact across the distribution sector.' },
  { year: '2026', title: 'Future Vision', description: 'Projected significant organizational growth, driven by modern systems and operational excellence.' },
  { year: 'Beyond', title: 'Continuous Evolution', description: 'Our journey never ends. We remain committed to refining our systems and expanding our reach for decades to come.' },
];

export const DISTRIBUTORS = [
  {
    id: 'dist1',
    name: 'Shrooq Pharma',
    role: 'Manufacturer',
    description: 'A leading manufacturer of specialized antibiotics and antimalarials, ensuring high-quality reliable supply.',
    collaboration: 'Exclusive sole distribution agreement for the Rahim Yar Khan territory.',
    initiatives: ['Antibiotic Stewardship', 'Rural Access'],
    color: 'blue',
    products: [
      { id: 'sq1', name: 'SAFE-ONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/shrooq_safe_one.png', desc: 'Broad-spectrum cephalosporin antibiotic for severe infections.', dosage: '1g / 500mg', temp: 'Ambient' },
      { id: 'sq2', name: 'MAXLUM', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/shrooq_maxlum.png', desc: 'First-line treatment for acute uncomplicated malaria.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'sq3', name: 'CIZIDIM', generic: 'Ceftazidime', form: 'Injection', category: 'Antibiotic', image: '/images/products/shrooq_cizidim.png', desc: 'Third-generation cephalosporin for bacterial infections.', dosage: '1g', temp: 'Ambient' },
      { id: 'sq4', name: 'DOME-ONE', generic: 'Domperidone', form: 'Tablet', category: 'Gastroenterology', image: '/images/products/shrooq_dome_one.png', desc: 'Relief from nausea and vomiting, increases gastric motility.', dosage: '10mg', temp: 'Ambient' },
      { id: 'sq5', name: 'FOMEN', generic: 'Famotidine', form: 'Tablet', category: 'Gastroenterology', image: '/images/products/shrooq_fomen.png', desc: 'H2 blocker used to treat ulcers and GERD.', dosage: '20mg / 40mg', temp: 'Ambient' },
      { id: 'sq6', name: 'LEFEXY', generic: 'Levofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/shrooq_lefexy.png', desc: 'Quinolone antibiotic for respiratory and urinary infections.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sq7', name: 'ISOCEF', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/shrooq_isocef.png', desc: 'Oral cephalosporin for bacterial infections.', dosage: '400mg', temp: 'Ambient' },
      { id: 'sq8', name: 'M.CIP', generic: 'Moxifloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/shrooq_mcip.png', desc: 'Fourth-generation fluoroquinolone antibiotic.', dosage: '400mg', temp: 'Ambient' },
      { id: 'sq9', name: 'LEVTROL', generic: 'Levetiracetam', form: 'Tablet', category: 'Neurology', image: '/images/products/shrooq_levtrol.png', desc: 'Antiepileptic drug for seizure control.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sq10', name: 'ESOMALT', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/shrooq_esomalt.png', desc: 'PPI for acid reflux and ulcer treatment.', dosage: '40mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist2',
    name: 'Avant Pharma',
    role: 'Manufacturer',
    description: 'Innovators in gastroenterology and cardiovascular health, providing modern therapeutic solutions.',
    collaboration: 'Strategic partnership for rapid hospital deployment and pharmacy stocking.',
    initiatives: ['Cardiac Care', 'Gastro Health'],
    color: 'teal',
    products: [
      { id: 'av1', name: 'NAVIS', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/avant_navis.png', desc: 'Effective relief from heartburn and acid reflux.', dosage: '40mg', temp: 'Ambient' },
      { id: 'av2', name: 'SEFOX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/avant_sefox.png', desc: 'Potent injectable antibiotic for hospital use.', dosage: '1g', temp: 'Ambient' },
      { id: 'av3', name: 'MESART', generic: 'Telmisartan', form: 'Tablet', category: 'Cardiology', image: '/images/products/avant_mesart.png', desc: 'ARB for hypertension and cardiovascular risk reduction.', dosage: '40mg', temp: 'Ambient' },
      { id: 'av4', name: 'AVECIP', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/avant_avecip.png', desc: 'Broad-spectrum antibiotic for various infections.', dosage: '500mg', temp: 'Ambient' },
      { id: 'av5', name: 'SECLO', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/Seclo.png', desc: 'Proton pump inhibitor for gastric protection.', dosage: '20mg', temp: 'Ambient' },
      { id: 'av6', name: 'GABAVANT', generic: 'Gabapentin', form: 'Capsule', category: 'Neurology', image: '/images/products/Gabavant.png', desc: 'Treatment for neuropathic pain and seizures.', dosage: '300mg', temp: 'Ambient' },
      { id: 'av7', name: 'LEFLO', generic: 'Levofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/lEFLO.png', desc: 'Highly effective antibiotic for respiratory issues.', dosage: '500mg', temp: 'Ambient' },
      { id: 'av8', name: 'UTRIAXON', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/Utriaxon.png', desc: 'Cephalosporin injection for severe bacterial infections.', dosage: '1g', temp: 'Ambient' },
      { id: 'av9', name: 'AVEPRAM', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/AVEPRAM.png', desc: 'Acid suppressor for GERD management.', dosage: '40mg', temp: 'Ambient' },
      { id: 'av10', name: 'MULTIWIN', generic: 'Multivitamins', form: 'Tablet', category: 'Supplement', image: '/images/products/Multiwin.png', desc: 'Daily nutritional support for immune health.', dosage: 'Daily', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist3',
    name: 'Swiss IQ Bioceutics',
    role: 'Manufacturer',
    description: 'Swiss-standard quality control bringing premium bioceuticals and supplements to the market.',
    collaboration: 'Authorized channel partner for premium supplement lines.',
    initiatives: ['Quality Control', 'Bio-Standards'],
    color: 'rose',
    products: [
      { id: 'sw1', name: 'POLYTAX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/POLYTAX.png', desc: 'High-grade ceftriaxone for clinical use.', dosage: '1g', temp: 'Ambient' },
      { id: 'sw2', name: 'ROCEREX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/AOCEREX.png', desc: 'Sterile powder for injection, antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sw3', name: 'BIOPRAZOLE', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/BIOPRAZOLE.png', desc: 'Advanced formula for acid control.', dosage: '40mg', temp: 'Ambient' },
      { id: 'sw4', name: 'CIPROBAY', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/CIPROBAY.png', desc: 'Trustworthy antibiotic for systemic infections.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sw5', name: 'SUPERIXIME', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/SUPERUXIME.png', desc: 'Oral cephalosporin for easy compliance.', dosage: '400mg', temp: 'Ambient' },
      { id: 'sw6', name: 'NEUSEC', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/NEUSEC.png', desc: 'Gastric acid reducer.', dosage: '40mg', temp: 'Ambient' },
      { id: 'sw7', name: 'SWISFER', generic: 'Iron Complex', form: 'Syrup', category: 'Supplement', image: '/images/products/SWISFER.png', desc: 'Iron supplement for anemia correction.', dosage: '120ml', temp: 'Ambient' },
      { id: 'sw8', name: 'BIO-CAL D', generic: 'Calcium + Vit D', form: 'Tablet', category: 'Supplement', image: '/images/products/BIO-CAL D.png', desc: 'Bone health support supplement.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sw9', name: 'SWIS-CID', generic: 'Antacid', form: 'Syrup', category: 'Gastroenterology', image: '/images/products/ANTACID.png', desc: 'Rapid relief syrup for acidity and heartburn.', dosage: '120ml', temp: 'Ambient' },
      { id: 'sw10', name: 'AIREX', generic: 'Montelukast', form: 'Tablet', category: 'Respiratory', image: '/images/products/AIREX.png', desc: 'Airway management and allergy relief.', dosage: '10mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist4',
    name: 'Triafa Pharmaceutical',
    role: 'Manufacturer',
    description: 'A trusted provider of specialized antibiotics, gastroenterology therapies, and neurological support.',
    collaboration: 'Strategic distribution channel for the southern district.',
    initiatives: ['Patient Access', 'Safety Standards'],
    color: 'teal',
    products: [
      { id: 'tr1', name: 'DRONCEF', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/DEONCEF.png', desc: 'Potent antibacterial injection.', dosage: '1g', temp: 'Ambient' },
      { id: 'tr2', name: 'MERAZ', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/MERAZ.png', desc: 'Control of gastric acid secretion.', dosage: '40mg', temp: 'Ambient' },
      { id: 'tr3', name: 'TRISPAN', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/TRISPAN.png', desc: 'Third-gen cephalosporin.', dosage: '400mg', temp: 'Ambient' },
      { id: 'tr4', name: 'CEZOTUM', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/CEZOTUM.png', desc: 'Intravenous/Intramuscular antibiotic.', dosage: '1g', temp: 'Ambient' },
      { id: 'tr5', name: 'ACIPRAZ', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/ACEPRAZ.png', desc: 'Proton pump inhibitor.', dosage: '20mg', temp: 'Ambient' },
      { id: 'tr6', name: 'GABAPEX', generic: 'Gabapentin', form: 'Capsule', category: 'Neurology', image: '/images/products/GABAPEX.png', desc: 'Nerve pain medication.', dosage: '300mg', temp: 'Ambient' },
      { id: 'tr7', name: 'BANXIN', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/BANXIN.png', desc: 'Fluoroquinolone antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'tr8', name: 'GLAYFER', generic: 'Iron Supplement', form: 'Syrup', category: 'Supplement', image: '/images/products/GLAYFER.png', desc: 'Hematinic syrup for blood health.', dosage: '120ml', temp: 'Ambient' },
      { id: 'tr9', name: 'TRICID', generic: 'Antacid', form: 'Syrup', category: 'Gastroenterology', image: '/images/products/TRICID.png', desc: 'Suspension for acidity relief.', dosage: '120ml', temp: 'Ambient' },
      { id: 'tr10', name: 'AMVART', generic: 'Amlodipine / Valsartan', form: 'Tablet', category: 'Cardiology', image: '/images/products/AMVART.png', desc: 'Combination therapy for hypertension.', dosage: '5/160mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist5',
    name: 'Star Laboratories',
    role: 'Manufacturer',
    description: 'Specialists in institutional supply and hospital-grade anti-infectives with a focus on sterile manufacturing.',
    collaboration: 'Primary partner for government hospital tenders and large-scale bulk supply.',
    initiatives: ['Sterile Safety', 'Institutional Reach'],
    color: 'indigo',
    products: [
      { id: 'sl1', name: 'ROCETREX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/star_rocetrex_real_1769926290067.png', desc: 'Sterile ceftriaxone sodium.', dosage: '1g', temp: 'Ambient' },
      { id: 'sl2', name: 'SEGAZOLE', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/star_segazole_real_1769926303723.png', desc: 'Treatment for GERD and ulcers.', dosage: '40mg', temp: 'Ambient' },
      { id: 'sl3', name: 'ARTEMAX', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/star_artemax_real_1769926318383.png', desc: 'Complete malaria therapy.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'sl4', name: 'STAFLOX', generic: 'Levofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/star_staflox_real_1769926341247.png', desc: 'Broad-spectrum antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sl5', name: 'STARCIP', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/star_starcip_real_1769926356356.png', desc: 'Treatment for bacterial infections.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sl6', name: 'REYAN', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/star_reyan_real_v2_1769926391834.png', desc: 'Oral antibiotic therapy.', dosage: '400mg', temp: 'Ambient' },
      { id: 'sl7', name: 'CLARISTA', generic: 'Clarithromycin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/star_clarista_real_1769926406233.png', desc: 'Macrolide antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sl8', name: 'AMICIN', generic: 'Amikacin', form: 'Injection', category: 'Antibiotic', image: '/images/products/star_amicin_real_1769926424059.png', desc: 'Aminoglycoside antibiotic injection.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sl9', name: 'MECALAMIN', generic: 'Mecobalamin', form: 'Tablet', category: 'Neurology', image: '/images/products/star_mecalamin_real_1769926444588.png', desc: 'Vitamin B12 analog for nerve health.', dosage: '500mcg', temp: 'Ambient' },
      { id: 'sl10', name: 'MONTIL', generic: 'Montelukast', form: 'Tablet', category: 'Respiratory', image: '/images/products/star_montil_real_1769926458776.png', desc: 'Asthma and allergy controller.', dosage: '10mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist6',
    name: 'Ospheric Pharma',
    role: 'Manufacturer',
    description: 'Specialists in high-potency anti-infectives and advanced diabetic care solutions.',
    collaboration: 'Strategic partner for specialized hospital distribution and government procurement.',
    initiatives: ['Patient Compliance', 'Precision Dosing'],
    color: 'sky',
    products: [
      { id: 'op1', name: 'GEMTONIX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/ospheric_gemtonix_real_1769926834881.png', desc: 'Broad spectrum injectable.', dosage: '1g', temp: 'Ambient' },
      { id: 'op2', name: 'DESYRE', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/ospheric_desyre_real_1769926849537.png', desc: 'GERD relief capsule.', dosage: '40mg', temp: 'Ambient' },
      { id: 'op3', name: 'GRAYPIME', generic: 'Cefepime', form: 'Injection', category: 'Antibiotic', image: '/images/products/ospheric_graypime_real_1769926862719.png', desc: 'Fourth-generation cephalosporin.', dosage: '1g', temp: 'Ambient' },
      { id: 'op4', name: 'LIZOBACT', generic: 'Linezolid', form: 'Tablet', category: 'Antibiotic', image: '/images/products/ospheric_lizobact_real_1769926884669.png', desc: 'For resistant bacterial infections.', dosage: '600mg', temp: 'Ambient' },
      { id: 'op5', name: 'E-MEPRA', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/ospheric_emepra_real_1769926898422.png', desc: 'Gastric protection.', dosage: '40mg', temp: 'Ambient' },
      { id: 'op6', name: 'CIPROZAT', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/ospheric_ciprozat_real_1769926912484.png', desc: 'Effective against gram-negative bacteria.', dosage: '500mg', temp: 'Ambient' },
      { id: 'op7', name: 'LEVENX', generic: 'Levofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/levenx_1769927299589.png', desc: 'Respiratory tract infections.', dosage: '500mg', temp: 'Ambient' },
      { id: 'op8', name: 'DEXGEN', generic: 'Duloxetine', form: 'Capsule', category: 'Neurology', image: '/images/products/dexgen_1769927323007.png', desc: 'For depression and nerve pain.', dosage: '30mg', temp: 'Ambient' },
      { id: 'op9', name: 'EMPAXO', generic: 'Empagliflozin', form: 'Tablet', category: 'Endocrinology', image: '/images/products/empaxo_1769927342967.png', desc: 'Type 2 diabetes management.', dosage: '10mg', temp: 'Ambient' },
      { id: 'op10', name: 'HEBIFER', generic: 'Iron Supplement', form: 'Syrup', category: 'Supplement', image: '/images/products/hebifer_1769927363746.png', desc: 'Iron deficiency treatment.', dosage: '120ml', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist7',
    name: 'Pinnacle Biotec',
    role: 'Manufacturer',
    description: 'A global biotechnology leader specializing in biosimilars and life-saving injectable medications.',
    collaboration: 'Critical logistics partner for temperature-sensitive biotechnology delivery across the region.',
    initiatives: ['Bio-Innovation', 'Cold Chain Integrity'],
    color: 'emerald',
    products: [
      { id: 'pb1', name: 'LIKZONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/likzone_1769927442664.png', desc: 'Antibiotic injection.', dosage: '1g', temp: 'Ambient' },
      { id: 'pb2', name: 'MONEPRA', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/monepra_1769927460676.png', desc: 'Acid reflux therapy.', dosage: '40mg', temp: 'Ambient' },
      { id: 'pb3', name: 'PALZON', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/palzon_1769927480359.png', desc: 'Injectable cephalosporin.', dosage: '500mg', temp: 'Ambient' },
      { id: 'pb4', name: 'PALXIME', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/palxime_1769927499688.png', desc: 'Oral antibiotic.', dosage: '400mg', temp: 'Ambient' },
      { id: 'pb5', name: 'DAYSITA-M', generic: 'Sitagliptin / Metformin', form: 'Tablet', category: 'Endocrinology', image: '/images/products/daysita_m_1769927526872.png', desc: 'Combination diabetes therapy.', dosage: '50/500mg', temp: 'Ambient' },
      { id: 'pb6', name: 'DRUGAB', generic: 'Pregabalin', form: 'Capsule', category: 'Neurology', image: '/images/products/drugab_1769927545709.png', desc: 'Neuropathic pain relief.', dosage: '75mg', temp: 'Ambient' },
      { id: 'pb7', name: 'PALFLOX', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/palflox_1769927564147.png', desc: 'Systemic antibacterial.', dosage: '500mg', temp: 'Ambient' },
      { id: 'pb8', name: 'RUMAXOL', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/rumaxol_1769927586121.png', desc: 'Heartburn relief.', dosage: '20mg', temp: 'Ambient' },
      { id: 'pb9', name: 'EMPAXO', generic: 'Empagliflozin', form: 'Tablet', category: 'Endocrinology', image: '/images/products/empaxo_1769927605450.png', desc: 'Diabetes care.', dosage: '25mg', temp: 'Ambient' },
      { id: 'pb10', name: 'VALDOSAR', generic: 'Amlodipine / Valsartan', form: 'Tablet', category: 'Cardiology', image: '/images/products/valdosar_1769927625695.png', desc: 'BP control combination.', dosage: '5/160mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist8',
    name: 'Siza International',
    role: 'Manufacturer',
    description: 'Renowned for high-quality generic manufacturing and diverse therapeutic portfolios.',
    collaboration: 'Long-standing partnership ensuring reliable supply of essential medicines to pharmacies.',
    initiatives: ['Generic Accessibility', 'Standardized Packaging'],
    color: 'teal',
    products: [
      { id: 'si1', name: 'ULCENIL', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/ulcenil_1769927644854.png', desc: 'Ulcer healing capsule.', dosage: '40mg', temp: 'Ambient' },
      { id: 'si2', name: 'EZUMAC', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/ezumac_1769927664642.png', desc: 'Acid suppressor.', dosage: '20mg', temp: 'Ambient' },
      { id: 'si3', name: 'LUMEZA', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/lumeza_1769927685264.png', desc: 'Malaria treatment.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'si4', name: 'GLOSIFLOX', generic: 'Moxifloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/glosiflox_1769927706610.png', desc: 'Respiratory fluoroquinolone.', dosage: '400mg', temp: 'Ambient' },
      { id: 'si5', name: 'XIVAL', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/xival_1769927727098.png', desc: 'Oral cephalosporin.', dosage: '400mg', temp: 'Ambient' },
      { id: 'si6', name: 'VOTEC', generic: 'Levofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/votec_1769927748473.png', desc: 'Antibacterial tablet.', dosage: '500mg', temp: 'Ambient' },
      { id: 'si7', name: 'VEPROX', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/veprox_1769927767384.png', desc: 'Potent antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'si8', name: 'TORAX', generic: 'Cough Syrup', form: 'Syrup', category: 'Respiratory', image: '/images/products/torax_1769927801551.png', desc: 'Soothing cough relief.', dosage: '120ml', temp: 'Ambient' },
      { id: 'si9', name: 'RHEUMATIN', generic: 'Diclofenac', form: 'Tablet', category: 'Pain Relief', image: '/images/products/rheumatin_1769927820417.png', desc: 'Anti-inflammatory analgesic.', dosage: '50mg', temp: 'Ambient' },
      { id: 'si10', name: 'FERRUX', generic: 'Iron', form: 'Syrup', category: 'Supplement', image: '/images/products/ferrux_1769927839757.png', desc: 'Iron supplement.', dosage: '120ml', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist9',
    name: 'Glitz Pharma',
    role: 'Manufacturer',
    description: 'Expertise in neuro-psychiatric medications and chronic pain management solutions.',
    collaboration: 'Specialized distribution agreement for CNS-focused therapeutic lines.',
    initiatives: ['Neuro Wellness', 'Doctor-Led Training'],
    color: 'purple',
    products: [
      { id: 'gp1', name: 'GLIXIM', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/glixim_1769927857587.png', desc: 'Bacterial infection treatment.', dosage: '400mg', temp: 'Ambient' },
      { id: 'gp2', name: 'ESOGIP', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/esogip_1769927876143.png', desc: 'PPI capsule.', dosage: '40mg', temp: 'Ambient' },
      { id: 'gp3', name: 'QUTIA', generic: 'Quetiapine', form: 'Tablet', category: 'Neurology', image: '/images/products/qutia_1769927896591.png', desc: 'Atypical antipsychotic.', dosage: '100mg', temp: 'Ambient' },
      { id: 'gp4', name: 'GABOZ', generic: 'Gabapentin', form: 'Capsule', category: 'Neurology', image: '/images/products/gaboz_1769927914556.png', desc: 'Nerve pain control.', dosage: '300mg', temp: 'Ambient' },
      { id: 'gp5', name: 'P GAB', generic: 'Pregabalin', form: 'Capsule', category: 'Neurology', image: '/images/products/p_gab_1769927933408.png', desc: 'Anticonvulsant/analgesic.', dosage: '75mg', temp: 'Ambient' },
      { id: 'gp6', name: 'PRACIT', generic: 'Venlafaxine', form: 'Tablet', category: 'Neurology', image: '/images/products/pracit_1769927952967.png', desc: 'Antidepressant (SNRI).', dosage: '75mg', temp: 'Ambient' },
      { id: 'gp7', name: 'RAZE', generic: 'Risperidone', form: 'Tablet', category: 'Neurology', image: '/images/products/raze_1769927968223.png', desc: 'Antipsychotic medication.', dosage: '2mg', temp: 'Ambient' },
      { id: 'gp8', name: 'LAMEPIL', generic: 'Lamotrigine', form: 'Tablet', category: 'Neurology', image: '/images/products/lamepil_1769927986830.png', desc: 'Mood stabilizer.', dosage: '100mg', temp: 'Ambient' },
      { id: 'gp9', name: 'DEPFREE', generic: 'Duloxetine', form: 'Capsule', category: 'Neurology', image: '/images/products/depfree_1769928006155.png', desc: 'Depression & pain relief.', dosage: '30mg', temp: 'Ambient' },
      { id: 'gp10', name: 'OZIP', generic: 'Olanzapine', form: 'Tablet', category: 'Neurology', image: '/images/products/ozip_1769928026426.png', desc: 'Antipsychotic.', dosage: '10mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist10',
    name: 'Acumen Pharmaceuticals',
    role: 'Manufacturer',
    description: 'A research-driven company focused on high-efficacy antibiotics and cardiology interventions.',
    collaboration: 'Exclusive hospital supply partner for critical care injectable lines.',
    initiatives: ['Clinical Research', 'Hospital Safety'],
    color: 'blue',
    products: [
      { id: 'ap1', name: 'BACTOWIN', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/bactowin_1769928047683.png', desc: 'Injectable antibiotic.', dosage: '1g', temp: 'Ambient' },
      { id: 'ap2', name: 'NAVIX', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/navix_1769928067431.png', desc: 'Acid reflux relief.', dosage: '40mg', temp: 'Ambient' },
      { id: 'ap3', name: 'REMEP', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/remep_1769928087367.png', desc: 'Gastric protection.', dosage: '20mg', temp: 'Ambient' },
      { id: 'ap4', name: 'BETAPIME', generic: 'Cefepime', form: 'Injection', category: 'Antibiotic', image: '/images/products/betapime_1769928106789.png', desc: 'Advanced cephalosporin.', dosage: '1g', temp: 'Ambient' },
      { id: 'ap5', name: 'J-ZIT', generic: 'Azithromycin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/j_zit_1769928125852.png', desc: 'Macrolide antibiotic.', dosage: '500mg', temp: 'Ambient' },
      { id: 'ap6', name: 'SELMOXI', generic: 'Moxifloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/selmoxi_1769928144007.png', desc: 'Effective antibiotic.', dosage: '400mg', temp: 'Ambient' },
      { id: 'ap7', name: 'LUMEZA', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/lumeza_1769928162995.png', desc: 'Malaria cure.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'ap8', name: 'NEWVIT IQ', generic: 'Multivitamin', form: 'Syrup', category: 'Supplement', image: '/images/products/newvit_iq_1769928182630.png', desc: 'Brain & body support.', dosage: '120ml', temp: 'Ambient' },
      { id: 'ap9', name: 'AULTADEX', generic: 'Duloxetine', form: 'Capsule', category: 'Neurology', image: '/images/products/aultadex_1769928202766.png', desc: 'SNRI for pain/depression.', dosage: '60mg', temp: 'Ambient' },
      { id: 'ap10', name: 'AYTIMAX', generic: 'Atorvastatin', form: 'Tablet', category: 'Cardiology', image: '/images/products/aytimax_1769928221693.png', desc: 'Lipid lowering agent.', dosage: '20mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist11',
    name: 'Serving Health Pakistan',
    role: 'Manufacturer',
    description: 'Leaders in dermatological care and specialized topical treatments for chronic skin conditions.',
    collaboration: 'Direct partnership for skin clinics and pharmaceutical dispensaries across Pakistan.',
    initiatives: ['Skin Safety', 'Topical Innovation'],
    color: 'orange',
    products: [
      { id: 'sh1', name: 'PROCORT', generic: 'Corticosteroid', form: 'Cream', category: 'Dermatology', image: '/images/products/procort_1769928242324.png', desc: 'Topical steroid cream.', dosage: '15g', temp: 'Ambient' },
      { id: 'sh2', name: 'FUSICARE', generic: 'Fusidic Acid', form: 'Cream', category: 'Dermatology', image: '/images/products/fusicare_1769928264947.png', desc: 'Antibacterial cream.', dosage: '15g', temp: 'Ambient' },
      { id: 'sh3', name: 'GK', generic: 'Skincare', form: 'Cream', category: 'Dermatology', image: '/images/products/gk_1769928285991.png', desc: 'General skincare.', dosage: '50g', temp: 'Ambient' },
      { id: 'sh4', name: 'IVERSAV', generic: 'Ivermectin', form: 'Tablet', category: 'Dermatology', image: '/images/medicine_tablet_box.png', desc: 'Anti-parasitic.', dosage: '6mg', temp: 'Ambient' },
      { id: 'sh5', name: 'TERBINASAV', generic: 'Terbinafine', form: 'Tablet', category: 'Dermatology', image: '/images/products/terbinasav_1769928307248.png', desc: 'Antifungal tablet.', dosage: '250mg', temp: 'Ambient' },
      { id: 'sh6', name: 'ACNEEZ', generic: 'Anti-Acne', form: 'Gel', category: 'Dermatology', image: '/images/products/acneez_1769928332548.png', desc: 'Acne treatment gel.', dosage: '20g', temp: 'Ambient' },
      { id: 'sh7', name: 'NOURISHME', generic: 'Skin Serum', form: 'Liquid', category: 'Dermatology', image: '/images/products/nourishme_1769928359408.png', desc: 'Nourishing serum.', dosage: '30ml', temp: 'Ambient' },
      { id: 'sh8', name: 'ITRALOX', generic: 'Itraconazole', form: 'Capsule', category: 'Dermatology', image: '/images/products/itralox_1769928378825.png', desc: 'Antifungal capsule.', dosage: '100mg', temp: 'Ambient' },
      { id: 'sh9', name: 'MELANEEZ', generic: 'Whitening Cream', form: 'Cream', category: 'Dermatology', image: '/images/products/melaneez_1769928400673.png', desc: 'Skin brightening.', dosage: '30g', temp: 'Ambient' },
      { id: 'sh10', name: 'FLOTIZOL', generic: 'Antifungal', form: 'Cream', category: 'Dermatology', image: '/images/products/flotizol_1769928420257.png', desc: 'Topical antifungal.', dosage: '15g', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist12',
    name: 'Swiss Pharmaceuticals',
    role: 'Manufacturer',
    description: 'Swiss-standard manufacturing quality brought to local healthcare markets.',
    collaboration: 'Technical partnership for manufacturing precision and high-grade formulations.',
    initiatives: ['Swiss Excellence', 'Global Standards'],
    color: 'red',
    products: [
      { id: 'sp1', name: 'STRACEF', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/stracef_1769928442136.png', desc: 'Antibiotic injection.', dosage: '1g', temp: 'Ambient' },
      { id: 'sp2', name: 'SANAMIDOL', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/sanamidol_1769928460231.png', desc: 'Acid relief.', dosage: '40mg', temp: 'Ambient' },
      { id: 'sp3', name: 'SWISSMETHER', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/swissmether_1769928482184.png', desc: 'Malaria therapy.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'sp4', name: 'SWICEF', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/swicef_1769928503299.png', desc: 'Third-gen ceph.', dosage: '400mg', temp: 'Ambient' },
      { id: 'sp5', name: 'LEPITAM', generic: 'Levetiracetam', form: 'Tablet', category: 'Neurology', image: '/images/products/lepitam_1769928522291.png', desc: 'Seizure control.', dosage: '500mg', temp: 'Ambient' },
      { id: 'sp6', name: 'KAIRDON', generic: 'Risperidone', form: 'Tablet', category: 'Neurology', image: '/images/products/kairdon_1769928544266.png', desc: 'Antipsychotic.', dosage: '2mg', temp: 'Ambient' },
      { id: 'sp7', name: 'PAX CR', generic: 'Paroxetine', form: 'Tablet', category: 'Neurology', image: '/images/products/pax_cr_1769928562561.png', desc: 'SSRI antidepressant.', dosage: '25mg', temp: 'Ambient' },
      { id: 'sp8', name: 'SCRODOP', generic: 'Duloxetine', form: 'Capsule', category: 'Neurology', image: '/images/products/scrodop_1769928582055.png', desc: 'Nerve pain/depression.', dosage: '30mg', temp: 'Ambient' },
      { id: 'sp9', name: 'VITAGLOBIN', generic: 'Multivitamin', form: 'Syrup', category: 'Supplement', image: '/images/products/vitaglobin_1769928610766.png', desc: 'Hematinic syrup.', dosage: '120ml', temp: 'Ambient' },
      { id: 'sp10', name: 'D-ABS', generic: 'Diclofenac', form: 'Tablet', category: 'Pain Relief', image: '/images/products/d_abs_1769928629823.png', desc: 'Pain management.', dosage: '50mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist13',
    name: 'Curatech Pharma',
    role: 'Manufacturer',
    description: 'A forward-thinking company focused on precision formulations and pediatric care solutions.',
    collaboration: 'Key partner for pediatric and general practice therapeutic distribution.',
    initiatives: ['Child Healthcare', 'Formulation Excellence'],
    color: 'sky',
    products: [
      { id: 'cp1', name: 'CURAXONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/curaxone_1769928651362.png', desc: 'Potent injectable.', dosage: '1g', temp: 'Ambient' },
      { id: 'cp2', name: 'EMT', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/emt_1769928675871.png', desc: 'PPI.', dosage: '40mg', temp: 'Ambient' },
      { id: 'cp3', name: 'CURAZOLE', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', image: '/images/products/curazole_1769928697172.png', desc: 'Acid reflux.', dosage: '40mg', temp: 'Ambient' },
      { id: 'cp4', name: 'CURASPAN', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', image: '/images/products/curaspan_1769928717182.png', desc: 'Oral antibiotic.', dosage: '400mg', temp: 'Ambient' },
      { id: 'cp5', name: 'TECHMOX', generic: 'Moxifloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/techmox_1769928736529.png', desc: 'Broad spectrum.', dosage: '400mg', temp: 'Ambient' },
      { id: 'cp6', name: 'CURAFLOXIN', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/curafloxin_1769928755842.png', desc: 'Antibacterial.', dosage: '500mg', temp: 'Ambient' },
      { id: 'cp7', name: 'MELATHER', generic: 'Artemether / Lumefantrine', form: 'Tablet', category: 'Antimalarial', image: '/images/products/melather_1769928774135.png', desc: 'Malaria drug.', dosage: '80/480mg', temp: 'Ambient' },
      { id: 'cp8', name: 'ZICURE', generic: 'Azithromycin', form: 'Tablet', category: 'Antibiotic', image: '/images/products/zicure_1769928795428.png', desc: 'Macrolide.', dosage: '500mg', temp: 'Ambient' },
      { id: 'cp9', name: 'FERIFER-F', generic: 'Iron + Folic Acid', form: 'Tablet', category: 'Supplement', image: '/images/products/ferifer_f_1769928816077.png', desc: 'Blood support.', dosage: '1 Tab', temp: 'Ambient' },
      { id: 'cp10', name: 'FEXOZIN', generic: 'Fexofenadine', form: 'Tablet', category: 'Respiratory', image: '/images/products/fexozin_1769928835393.png', desc: 'Antihistamine.', dosage: '120mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist14',
    name: 'Araf Pharma',
    role: 'Manufacturer',
    description: 'Specialists in psychiatric care and mental health therapeutic interventions.',
    collaboration: 'Strategic partner for mental health institutes and specialized psychiatry clinics.',
    initiatives: ['Mental Health Support', 'Intervention Excellence'],
    color: 'indigo',
    products: [
      { id: 'ar1', name: 'ZALTER', generic: 'Olanzapine', form: 'Tablet', category: 'Neurology', image: '/images/products/zalter_1769928859614.png', desc: 'Antipsychotic.', dosage: '10mg', temp: 'Ambient' },
      { id: 'ar2', name: 'ZAXINE XR', generic: 'Venlafaxine', form: 'Capsule', category: 'Neurology', image: '/images/products/zaxine_xr_1769928878051.png', desc: 'Antidepressant.', dosage: '75mg', temp: 'Ambient' },
      { id: 'ar3', name: 'ZITRIGINE', generic: 'Lamotrigine', form: 'Tablet', category: 'Neurology', image: '/images/products/zitrigine_1769928900494.png', desc: 'Mood stabilizer.', dosage: '100mg', temp: 'Ambient' },
      { id: 'ar4', name: 'MIZIO', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/mizio_1769928921142.png', desc: 'Injection.', dosage: '1g', temp: 'Ambient' },
      { id: 'ar5', name: 'EZONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', image: '/images/products/ezone_1769928940105.png', desc: 'Antibiotic.', dosage: '1g', temp: 'Ambient' },
      { id: 'ar6', name: 'FALRAF', generic: 'Pregabalin', form: 'Capsule', category: 'Neurology', image: '/images/products/falraf_1769928960773.png', desc: 'Nerve pain.', dosage: '75mg', temp: 'Ambient' },
      { id: 'ar7', name: 'NETLO', generic: 'Escitalopram', form: 'Tablet', category: 'Neurology', image: '/images/products/netlo_1769928980650.png', desc: 'SSRI.', dosage: '10mg', temp: 'Ambient' },
      { id: 'ar8', name: 'TAZAP', generic: 'Mirtazapine', form: 'Tablet', category: 'Neurology', image: '/images/products/tazap_1769928999120.png', desc: 'Antidepressant.', dosage: '30mg', temp: 'Ambient' },
      { id: 'ar9', name: 'ZEEBON', generic: 'Supplements', form: 'Tablet', category: 'Supplement', image: '/images/products/zeebon_1769929019616.png', desc: 'General health.', dosage: 'Daily', temp: 'Ambient' },
      { id: 'ar10', name: 'ZANZIA', generic: 'Olanzapine', form: 'Tablet', category: 'Neurology', image: '/images/products/zanzia_1769929039128.png', desc: 'Psychiatry.', dosage: '5mg', temp: 'Ambient' }
    ]
  },
  {
    id: 'dist15',
    name: 'Qurrum Pharma',
    role: 'Manufacturer',
    description: 'A nutritional science leader dedicated to supplements and pediatric growth formulations.',
    collaboration: 'Strategic partner for wellness centers and pediatric nutrition networks.',
    initiatives: ['Nutritional Literacy', 'Growth Excellence'],
    color: 'emerald',
    products: [
      { id: 'qp1', name: 'XEEBON', generic: 'Multivitamin', form: 'Tablet', category: 'Supplement', image: '/images/products/xeebon_1769929058845.png', desc: 'Daily vitamin.', dosage: 'Daily', temp: 'Ambient' },
      { id: 'qp2', name: 'EXTENZE', generic: 'Multivitamin', form: 'Syrup', category: 'Supplement', image: '/images/products/extenze_1769929077060.png', desc: 'Liquid vitality.', dosage: '120ml', temp: 'Ambient' },
      { id: 'qp3', name: 'HURMA', generic: 'Supplement', form: 'Tablet', category: 'Supplement', image: '/images/products/hurma_1769929095328.png', desc: 'Women health.', dosage: 'Daily', temp: 'Ambient' },
      { id: 'qp4', name: 'MAXISURE', generic: 'Nutrition', form: 'Powder', category: 'Supplement', image: '/images/products/maxisure_1769929118547.png', desc: 'Nutritional drink.', dosage: '400g', temp: 'Ambient' },
      { id: 'qp5', name: 'MEGA-3', generic: 'Omega 3', form: 'Capsule', category: 'Supplement', image: '/images/products/mega_3_1769929133257.png', desc: 'Fish oil.', dosage: '1000mg', temp: 'Ambient' },
      { id: 'qp6', name: 'OVASITOL', generic: 'Inositol', form: 'Sachet', category: 'Supplement', image: '/images/products/ovasitol_1769929152724.png', desc: 'Fertility support.', dosage: '4g', temp: 'Ambient' },
      { id: 'qp7', name: 'EVEX', generic: 'Vitamin E', form: 'Capsule', category: 'Supplement', image: '/images/products/evex_1769929173372.png', desc: 'Antioxidant.', dosage: '400IU', temp: 'Ambient' },
      { id: 'qp8', name: 'ACT-C', generic: 'Vitamin C', form: 'Tablet', category: 'Supplement', image: '/images/products/act_c_1769929190304.png', desc: 'Immune boost.', dosage: '500mg', temp: 'Ambient' },
      { id: 'qp9', name: 'ARTHROMAX', generic: 'Joint Care', form: 'Tablet', category: 'Supplement', image: '/images/products/arthromax_1769929211402.png', desc: 'Joint mobility.', dosage: 'Daily', temp: 'Ambient' },
      { id: 'qp10', name: 'BIOCART', generic: 'Cartilage Support', form: 'Tablet', category: 'Supplement', image: '/images/products/biocart_1769929234850.png', desc: 'Cartilage health.', dosage: 'Daily', temp: 'Ambient' }
    ]
  }
];

export const TOP_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'CardioVas',
    category: 'Cardiology',
    description: 'Advanced beta-blockers and ACE inhibitors for comprehensive heart health management.',
    image: '/images/cardiology.png'
  },
  {
    id: 'p2',
    name: 'ImmunoShield',
    category: 'Immunology',
    description: 'Next-generation immunomodulators designed for autoimmune disorders.',
    image: '/images/immunology.png'
  },
  {
    id: 'p3',
    name: 'NeuroCalm',
    category: 'Neurology',
    description: 'Specialized CNS treatments focusing on epilepsy and neuropathic pain.',
    image: '/images/neurology.png'
  },
  {
    id: 'p4',
    name: 'DermaCare Kit',
    category: 'Dermatology',
    description: 'Clinical-grade topical solutions for chronic skin conditions.',
    image: '/images/dermatology.png'
  },
  {
    id: 'p5',
    name: 'RespiraFlow',
    category: 'Respiratory',
    description: 'Inhalers and nebulizers for asthma and COPD management.',
    image: '/images/respiratory.png'
  },
  {
    id: 'p6',
    name: 'OrthoFlex',
    category: 'Orthopedics',
    description: 'Joint support supplements and pain management solutions.',
    image: '/images/orthopedics.png'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Metro Delivery',
    description: 'Rapid, same-day delivery service covering every district in the city.',
    icon: Truck
  },
  {
    id: 's2',
    title: 'Local Cold Chain',
    description: 'Temperature-controlled vans ensuring safe vaccine transport across town.',
    icon: Thermometer
  },
  {
    id: 's3',
    title: 'City Compliance',
    description: 'Expertise in local municipal health regulations and safety standards.',
    icon: ShieldCheck
  },
  {
    id: 's4',
    title: 'Pharmacy Stock',
    description: 'Automated restocking systems for local pharmacies to prevent shortages.',
    icon: Box
  }
];

export const LICENSES: License[] = [
  {
    id: 'l1',
    name: 'Good Distribution Practice (GDP)',
    authority: 'Health Authority',
    year: '2024',
    description: 'Certified for high standards in local medicine distribution.'
  },
  {
    id: 'l2',
    name: 'City Health Permit',
    authority: 'Municipal Council',
    year: '2024',
    description: 'Authorized to operate pharmaceutical logistics within city limits.'
  },
  {
    id: 'l3',
    name: 'Cold Chain Certified',
    authority: 'Logistics Board',
    year: '2024',
    description: 'Verified capability to handle temperature-sensitive city deliveries.'
  }
];

export const PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'BioGen Labs',
    type: 'Manufacturer',
    logoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p2',
    name: 'Apex Health Systems',
    type: 'Manufacturer',
    logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0833860?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p3',
    name: 'City Logistics Inc.',
    type: 'Logistics',
    logoUrl: 'https://images.unsplash.com/photo-1566576912902-192f16a1ba36?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p4',
    name: 'MediTech Solutions',
    type: 'Research',
    logoUrl: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p5',
    name: 'CryoSafe Containers',
    type: 'Technology',
    logoUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p6',
    name: 'EuroGenerics',
    type: 'Manufacturer',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p7',
    name: 'SecureChain Block',
    type: 'Technology',
    logoUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'p8',
    name: 'City Aid Alliance',
    type: 'Logistics',
    logoUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=200'
  }
];

export const SOLE_DISTRIBUTORS = [
  {
    id: 'sd1',
    name: 'Shrooq Pharma',
    logoUrl: '/images/products/shrooq_isocef.png'
  },
  {
    id: 'sd2',
    name: 'Avant Pharma',
    logoUrl: '/images/products/avant_navis.png'
  },
  {
    id: 'sd3',
    name: 'Swiss IQ Bioceutics',
    logoUrl: '/images/products/POLYTAX.png'
  },
  {
    id: 'sd4',
    name: 'Star Laboratories',
    logoUrl: '/images/products/star_rocetrex_real_1769926290067.png'
  },
  {
    id: 'sd5',
    name: 'Ospheric Pharma',
    logoUrl: '/images/products/ospheric_gemtonix_real_1769926834881.png'
  }
];

export const LEADERSHIP = [
  {
    id: 'ejaz',
    name: 'Malik Muhammad Ejaz',
    role: 'CEO & Founder',
    quote: 'Integrity and timely delivery are the cornerstones of our success.',
    bio: 'The visionary leader behind Swift Sales, dedicated to transforming distribution through excellence.',
    bioExtended: 'With over two decades of experience, I have led the company from a simple delivery service to the city\'s most trusted partner.',
    img: '/Team Images/Malik Muhammad Ejaz.jpeg',
    signature: 'Malik Muhammad Ejaz'
  },
  {
    id: 'abdul',
    name: 'Abdul Hameed',
    role: 'Warehouse Audit Manager',
    quote: 'Dedication to service is our priority.',
    bio: 'A vital part of our operational excellence and client support.',
    bioExtended: 'Contributing to the seamless workflow and growth of Swift Sales.',
    img: '/Team Images/Abdul Hameed.jpeg',
    signature: 'Abdul Hameed'
  },
  {
    id: 'wajhat',
    name: 'Malik Wajahat',
    role: 'Director Sales',
    quote: 'Driving sales with passion and vision.',
    bio: 'Leading the sales team to achieve new milestones and expand our reach.',
    bioExtended: 'My focus is on building strong client relationships and delivering results.',
    img: '/Team Images/Malik Wajahat - Sales Head.jpeg',
    signature: 'Malik Wajahat'
  },
  {
    id: 'naveed',
    name: 'Naveed Anjum',
    role: 'Accounts Manager',
    quote: 'Efficiency and organization are key to operational success.',
    bio: 'Ensuring all operations are managed with precision and transparency.',
    bioExtended: 'Maintaining high standards in management to foster company growth and trust.',
    img: '/Team Images/Naveed Anjum - Manager.jpeg',
    signature: 'Naveed Anjum'
  },
  {
    id: 'asad',
    name: 'Asad Ullah',
    role: 'Manager IT',
    quote: 'Empowering operations through technological efficiency.',
    bio: 'Managing IT systems to ensure seamless business workflow.',
    bioExtended: 'Dedicated to implementing tech solutions that drive productivity.',
    img: '/Team Images/Asad Ullah.jpeg',
    signature: 'Asad Ullah'
  },
  {
    id: 'tahseen',
    name: 'Tahseen Ahmad',
    role: 'Warehouse Manager',
    quote: 'Managing inventory with meticulous dedication.',
    bio: 'Responsible for the overall management of warehouse operations.',
    bioExtended: 'Ensuring timely dispatch and safest storage of all products.',
    img: '/Team Images/Tahseen Ahmad.png',
    signature: 'Tahseen Ahmad'
  },
  {
    id: 'ahmed',
    name: 'M. Ahmad',
    role: 'Data Entry Operator',
    quote: 'Supporting the foundation of reliable supply chains.',
    bio: 'Responsible for internal operations assistance and data integrity.',
    bioExtended: 'Working to ensure that every record and operation is handled with care.',
    img: '/Team Images/M. Ahmed - Assistant Manager.jpeg',
    signature: 'M. Ahmad'
  },
  {
    id: 'sadeem',
    name: 'Malik Sadeem',
    role: 'Admin',
    quote: 'A productive environment is built on strong management.',
    bio: 'Overseeing administrative and operational coordination.',
    bioExtended: 'Supporting every department to maintain a seamless office workflow.',
    img: '/Team Images/Malika Sadeem - Faculty Manager.jpeg',
    signature: 'Malik Sadeem'
  },
  {
    id: 'ismail',
    name: 'M. Ismail',
    role: 'Assistant Manager Warehouse',
    quote: 'Every box handled with professional care.',
    bio: 'Assisting in warehouse logistics and stock organization.',
    bioExtended: 'Maintaining order and efficiency within our distribution hub.',
    img: '/Team Images/M. Ismail - Story BOY.jpeg',
    signature: 'M. Ismail'
  },
  {
    id: 'zohaib',
    name: 'M. Zohaib',
    role: 'Stock In,Out',
    quote: 'Efficiency in every stock movement.',
    bio: 'Managing stock visibility and inventory accuracy.',
    bioExtended: 'A healthy flow of stock ensures a strong team and a successful mission.',
    img: '/Team Images/M. Zohaib - Cook.jpeg',
    signature: 'M. Zohaib'
  },
  {
    id: 'sageer',
    name: 'Sagheer Ahmed',
    role: 'Stock In,Out',
    quote: 'Precision in every stock movement.',
    bio: 'Responsible for tracking and managing stock inventory.',
    bioExtended: 'Ensuring records are accurate to prevent any supply chain delays.',
    img: '/Team Images/Sagheer Ahmed.jpeg',
    signature: 'Sagheer Ahmed'
  }
];

