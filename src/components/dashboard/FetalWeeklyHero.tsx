'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { WEEKS_DATA, WeekData } from '@/data/pregnancyJourneyData';
import {
  getPregnancyMonth,
  getPregnancyTrimester
} from '@/utils/pregnancyCalculations';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Scale,
  Ruler,
  Brain,
  Eye,
  Activity,
  Layers,
  Info,
  Apple,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface FetalWeeklyHeroProps {
  currentGestationalWeek: number;
  estimatedDueDate?: string;
  onSelectWeek?: (week: number) => void;
}

// International Carnegie & Clinical Developmental Stages (Reference: Open Embryology & Fetal Development Standards)
export interface FetalEvolutionReference {
  week: number;
  carnegieStage: string;
  epochName: string;
  growthFactor: string;
  brainNervousSystem: string;
  cardiovascularVisceral: string;
  sensoryCraniofacial: string;
  pulmonaryMusculoskeletal: string;
}

export const FETAL_EVOLUTION_STANDARDS: Record<number, FetalEvolutionReference> = {
  1: {
    week: 1,
    carnegieStage: 'Pre-Embryonic: Follicular Maturation',
    epochName: 'Cycle Preparation',
    growthFactor: '1x (Oocyte baseline)',
    brainNervousSystem: 'Maternal hormonal cues trigger oocyte meiosis within the dominant graafian follicle.',
    cardiovascularVisceral: 'Uterine spiral arteries undergo initial vascular remodeling under estrogenic influence.',
    sensoryCraniofacial: 'Genetic chromosomal complement prepared in maternal gamete.',
    pulmonaryMusculoskeletal: 'Endometrial functional layer regenerates to prepare receptive nidus.'
  },
  2: {
    week: 2,
    carnegieStage: 'Carnegie Stage 1: Fertilization & Zygote',
    epochName: 'Fertilization & Cleavage',
    growthFactor: '1.2x (Zygote formation)',
    brainNervousSystem: 'Totipotent genetic blueprint established with 46 homologous chromosomes.',
    cardiovascularVisceral: 'Zygote begins mitotic cleavage while traveling through fallopian ampulla.',
    sensoryCraniofacial: 'Cellular differentiation initiates; blastomeres divide without cytoplasmic growth.',
    pulmonaryMusculoskeletal: 'ZP3 glycoprotein in zona pellucida prevents polyspermy.'
  },
  3: {
    week: 3,
    carnegieStage: 'Carnegie Stage 3–5: Blastocyst & Implantation',
    epochName: 'Blastocyst Implantation',
    growthFactor: '5x (Trophoblast expansion)',
    brainNervousSystem: 'Primitive embryonic disc forms epiblast and hypoblast lineages; primitive streak emerges.',
    cardiovascularVisceral: 'Syncytiotrophoblast invades maternal decidua, initiating primordial uteroplacental lacunae.',
    sensoryCraniofacial: 'Gastrulation establishes the three primary germ layers: ectoderm, mesoderm, and endoderm.',
    pulmonaryMusculoskeletal: 'Extraembryonic mesoderm lines the exocoelomic cavity; yolk sac forms.'
  },
  4: {
    week: 4,
    carnegieStage: 'Carnegie Stage 10–12: Neural Tube & Somites',
    epochName: 'Neural Tube Closure',
    growthFactor: '50x (Primitive axis)',
    brainNervousSystem: 'Neural groove deepens and fuses to form the primary neural tube (precursor of brain & spinal cord).',
    cardiovascularVisceral: 'Endocardial tubes fuse into a single primitive cardiac tube; blood circulation begins.',
    sensoryCraniofacial: 'Optic and otic placodes (precursors of retinas and inner ears) emerge on the head fold.',
    pulmonaryMusculoskeletal: 'Somites align longitudinally in paired segments along the dorsal axis.'
  },
  5: {
    week: 5,
    carnegieStage: 'Carnegie Stage 13–15: C-Curve Embryogenesis',
    epochName: 'C-Curved Embryo',
    growthFactor: '150x',
    brainNervousSystem: 'Prosencephalon, mesencephalon, and rhombencephalon primary brain vesicles demarcate.',
    cardiovascularVisceral: 'Bulbus cordis and ventricle undergo primitive cardiac looping; vitelline circulation active.',
    sensoryCraniofacial: 'Pharyngeal (branchial) arches 1 to 4 form; primitive mouth (stomodeum) indents.',
    pulmonaryMusculoskeletal: 'Upper limb buds appear as small paddle-like lateral swellings on the torso.'
  },
  6: {
    week: 6,
    carnegieStage: 'Carnegie Stage 16–17: Organogenesis',
    epochName: 'Organ System Formation',
    growthFactor: '500x',
    brainNervousSystem: 'Cerebral hemispheres expand rapidly; cephalic flexure produces distinct head tilt.',
    cardiovascularVisceral: 'Interatrial and interventricular septa begin partitioning internal cardiac chambers.',
    sensoryCraniofacial: 'Retinal pigment accumulates in optic cups; primitive lens pits form distinct dark spots.',
    pulmonaryMusculoskeletal: 'Digital rays faintly appear in upper paddle buds; lower limb buds sprout.'
  },
  7: {
    week: 7,
    carnegieStage: 'Carnegie Stage 18–19: Cranial Expansion',
    epochName: 'Digit Outgrowth',
    growthFactor: '1,000x',
    brainNervousSystem: 'Neurogenesis accelerates; neuroblasts migrate along radial glial scaffolding.',
    cardiovascularVisceral: 'Primitive aortic arches remodel into permanent carotid and systemic vessels; liver produces RBCs.',
    sensoryCraniofacial: 'Eyelid folds form over developing corneas; auricular hillocks coalesce into outer ear pinnae.',
    pulmonaryMusculoskeletal: 'Elbow and wrist joints clearly differentiate; hands brought toward midline.'
  },
  8: {
    week: 8,
    carnegieStage: 'Carnegie Stage 20–23: End of Embryonic Period',
    epochName: 'Embryo to Fetus Transition',
    growthFactor: '2,500x',
    brainNervousSystem: 'Peripheral nervous system connects to early muscle groups; involuntary reflexive twitches occur.',
    cardiovascularVisceral: 'Four distinct cardiac chambers, mitral and tricuspid valves established; physiological gut herniation occurs.',
    sensoryCraniofacial: 'Digits fully separate as apoptosis removes interdigital webbing; primitive nose tip formed.',
    pulmonaryMusculoskeletal: 'Embryonic caudal tail fully regresses; chondrification centers lay cartilage bone templates.'
  },
  9: {
    week: 9,
    carnegieStage: 'Early Fetal Period: Cephalic Refinement',
    epochName: 'Fetal Transition',
    growthFactor: '4,000x',
    brainNervousSystem: 'Brain electrical activity detectable; cerebral cortex initiates early cellular stratification.',
    cardiovascularVisceral: 'Fetal circulation routes oxygenated blood through ductus venosus directly to inferior vena cava.',
    sensoryCraniofacial: 'Eyelids fuse shut to shield delicate optical corneas; external ear pinnae migrate upwards.',
    pulmonaryMusculoskeletal: 'Early ossification begins in clavicle and mandible; knees bend and tiny toes separate.'
  },
  10: {
    week: 10,
    carnegieStage: 'Fetal Period: Vital Organ Function',
    epochName: 'Organ Functionality',
    growthFactor: '7,000x',
    brainNervousSystem: 'Synaptic connections multiply; cranial nerves coordinate early swallowing reflex.',
    cardiovascularVisceral: 'Kidneys begin producing dilute urine, contributing to the amniotic fluid reservoir.',
    sensoryCraniofacial: 'Tooth buds for all 20 deciduous baby teeth embed deeply within the maxillary and mandibular arches.',
    pulmonaryMusculoskeletal: 'Intestines complete rotation and retract from the umbilical cord back into the abdominal cavity.'
  },
  11: {
    week: 11,
    carnegieStage: 'Fetal Period: Longitudinal Stretch',
    epochName: 'Rapid Growth',
    growthFactor: '12,000x',
    brainNervousSystem: 'Spinal cord reaches full length of vertebral column; cerebellar hemispheres expand.',
    cardiovascularVisceral: 'Liver accounts for 10% of total fetal weight, actively synthesizing plasma proteins and bile.',
    sensoryCraniofacial: 'Iris stroma differentiates; taste buds form along the papillae of the tongue.',
    pulmonaryMusculoskeletal: 'Diaphragm completes fusion, separating thoracic and abdominal cavities.'
  },
  12: {
    week: 12,
    carnegieStage: 'First Trimester Culmination',
    epochName: 'First Trimester Completion',
    growthFactor: '20,000x',
    brainNervousSystem: 'Corpus callosum begins bridging left and right cerebral hemispheres; grasp reflex appears.',
    cardiovascularVisceral: 'Spleen assumes hematopoiesis; placenta fully assumes hormonal progesterone production.',
    sensoryCraniofacial: 'Facial profile shows distinct human proportions: forehead, bridge of nose, and philtrum.',
    pulmonaryMusculoskeletal: 'Nail beds appear on fingertips and toes; fetal skeletal cartilage progressively calcifies.'
  },
  13: {
    week: 13,
    carnegieStage: 'Second Trimester Gateway',
    epochName: 'Tissue Specialization',
    growthFactor: '30,000x',
    brainNervousSystem: 'Sensory pathways route toward the thalamus; vocal cords complete differentiation in larynx.',
    cardiovascularVisceral: 'Thyroid gland begins synthesizing thyroxine, regulating metabolic growth.',
    sensoryCraniofacial: 'Unique epidermal ridges (individual fingerprints) etch permanently into fingertips.',
    pulmonaryMusculoskeletal: 'Bone marrow begins producing leukocyte precursors; ribs encase thoracic organs.'
  },
  14: {
    week: 14,
    carnegieStage: 'Neuromuscular Integration',
    epochName: 'Active Reflexes',
    growthFactor: '45,000x',
    brainNervousSystem: 'Brain impulses trigger facial squinting, frowning, and grimacing practice movements.',
    cardiovascularVisceral: 'Cardiovascular system circulates up to 30 liters of blood daily through the placenta.',
    sensoryCraniofacial: 'Fine lanugo hair covers the scalp and shoulders, anchoring protective vernix caseosa.',
    pulmonaryMusculoskeletal: 'Neck elongates, elevating chin off the chest; arms reach proportional length to body.'
  },
  15: {
    week: 15,
    carnegieStage: 'Sensory Transduction',
    epochName: 'Light Sensitivity',
    growthFactor: '60,000x',
    brainNervousSystem: 'Peripheral myelin sheaths begin wrapping around peripheral nerve fibers for rapid conduction.',
    cardiovascularVisceral: 'Pancreatic islet cells produce insulin to metabolize circulating maternal glucose.',
    sensoryCraniofacial: 'Photoreceptors differentiate; fetus senses bright external light filtered through abdominal wall.',
    pulmonaryMusculoskeletal: 'Legs lengthen and now exceed arm length; joints articulate fluidly in amniotic fluid.'
  },
  16: {
    week: 16,
    carnegieStage: 'Quickening Window',
    epochName: 'Quickening Readiness',
    growthFactor: '85,000x',
    brainNervousSystem: 'Auditory ossicles (malleus, incus, stapes) in middle ear initiate calcification.',
    cardiovascularVisceral: 'Fetal heart volume doubles; vascular capillary networks saturate subcutaneous tissue.',
    sensoryCraniofacial: 'Eyes demonstrate slow conjugate tracking movements behind closed fused lids.',
    pulmonaryMusculoskeletal: 'Coordinated kicks, somersaults, and thumb-sucking occur continuously in the womb.'
  },
  17: {
    week: 17,
    carnegieStage: 'Adipose Differentiation',
    epochName: 'Brown Fat Deposition',
    growthFactor: '110,000x',
    brainNervousSystem: 'Myelination of spinal tracts accelerates; cerebral cortex begins laminar organization.',
    cardiovascularVisceral: 'Umbilical cord thickens with gelatinous Wharton jelly, preventing vessel compression.',
    sensoryCraniofacial: 'Sweat glands develop across the dermal palmar and plantar surfaces.',
    pulmonaryMusculoskeletal: 'Brown adipose tissue (BAT) accumulates around neck, chest, and kidneys for thermoregulation.'
  },
  18: {
    week: 18,
    carnegieStage: 'Auditory Awakening',
    epochName: 'Acoustic Perception',
    growthFactor: '140,000x',
    brainNervousSystem: 'Cochlea reaches adult size; acoustic nerve impulses transmit external sounds to temporal cortex.',
    cardiovascularVisceral: 'Fetal blood pressure regulation centers mature within the medulla oblongata.',
    sensoryCraniofacial: 'Baby clearly hears mother’s heartbeat, digestive sounds, and muffled maternal voice.',
    pulmonaryMusculoskeletal: 'Ossification of inner ear bones allows bone-conducted acoustic vibration.'
  },
  19: {
    week: 19,
    carnegieStage: 'Vernix Caseosa Synthesis',
    epochName: 'Vernix Shield',
    growthFactor: '180,000x',
    brainNervousSystem: 'Sensory cortex regions for smell, taste, hearing, vision, and touch specialize.',
    cardiovascularVisceral: 'Renal output increases to ~10ml/hour of sterile urine back into the amniotic pool.',
    sensoryCraniofacial: 'Scalp hair follicles develop distinct growth patterns and whorls.',
    pulmonaryMusculoskeletal: 'Cheesy, lipid-rich vernix caseosa coats entire skin surface, preventing maceration in amniotic fluid.'
  },
  20: {
    week: 20,
    carnegieStage: 'Mid-Pregnancy Milestone (50%)',
    epochName: 'Halfway Milestone',
    growthFactor: '230,000x',
    brainNervousSystem: 'Motor neurons establish mature neuromuscular junctions with skeletal muscle fibers.',
    cardiovascularVisceral: 'Level II anatomical scan visualizes four chambers, outflow tracts, and kidney parenchyma.',
    sensoryCraniofacial: 'Eyebrows and eyelashes emerge along the orbital margins.',
    pulmonaryMusculoskeletal: 'Definite maternal sensation of fetal movements (quickening) reliably noted.'
  },
  21: {
    week: 21,
    carnegieStage: 'Digestive Maturation',
    epochName: 'Amniotic Swallowing',
    growthFactor: '280,000x',
    brainNervousSystem: 'Sleep-wake cycles emerge; periods of quiet sleep alternate with active movement.',
    cardiovascularVisceral: 'Bone marrow assumes primary role in erythrocyte (red blood cell) production.',
    sensoryCraniofacial: 'Baby swallows amniotic fluid daily, extracting water, electrolytes, and saccharides.',
    pulmonaryMusculoskeletal: 'Lower digestive tract begins accumulating meconium (amniotic debris and bile).'
  },
  22: {
    week: 22,
    carnegieStage: 'Craniofacial Perfection',
    epochName: 'Sensory Integration',
    growthFactor: '340,000x',
    brainNervousSystem: 'Limbic system structures (hippocampus, amygdala) mature, initiating primitive emotional memory.',
    cardiovascularVisceral: 'Liver metabolizes bilirubin; spleen maintains immunological filtration.',
    sensoryCraniofacial: 'Facial contours match newborn appearance; lips, philtrum, and nose bridges fully defined.',
    pulmonaryMusculoskeletal: 'Grip reflex strengthens; baby grasps umbilical cord and opposite hand.'
  },
  23: {
    week: 23,
    carnegieStage: 'Inner Ear Balance',
    epochName: 'Vestibular Maturation',
    growthFactor: '400,000x',
    brainNervousSystem: 'Vestibular system in inner ear senses maternal movement, posture, and spatial orientation.',
    cardiovascularVisceral: 'Pulmonary blood vessel branches multiply throughout lung parenchyma.',
    sensoryCraniofacial: 'Skin remains translucent pink due to dense capillary networks beneath the dermis.',
    pulmonaryMusculoskeletal: 'Fetus startled by loud external percussive sounds exhibits Moro reflex.'
  },
  24: {
    week: 24,
    carnegieStage: 'Viability Threshold Milestone',
    epochName: 'Viability Gateway',
    growthFactor: '480,000x',
    brainNervousSystem: 'Brain weight increases fourfold; cortical surface begins grooving into primitive sulci and gyri.',
    cardiovascularVisceral: 'Capillary beds expand around terminal pulmonary sacs for prospective gas exchange.',
    sensoryCraniofacial: 'Taste buds fully functional; baby swallows more in response to sweet amniotic flavors.',
    pulmonaryMusculoskeletal: 'Type II pneumocytes in lungs begin synthesizing pulmonary surfactant (dipalmitoylphosphatidylcholine).'
  },
  25: {
    week: 25,
    carnegieStage: 'Capillary Network Maturation',
    epochName: 'Capillary Expansion',
    growthFactor: '560,000x',
    brainNervousSystem: 'Spinal reflex pathways fully functional; withdrawal reflex to noxious tactile stimulus present.',
    cardiovascularVisceral: 'Blood vessel walls thicken and develop muscular tunica media for blood pressure control.',
    sensoryCraniofacial: 'Vocal cords fully developed; practice breathing motions cause silent amniotic fluid movement.',
    pulmonaryMusculoskeletal: 'Spinal structures, including 33 vertebrae, ligaments, and vertebral discs, align.'
  },
  26: {
    week: 26,
    carnegieStage: 'Eyelid Separation Milestone',
    epochName: 'Eyes Open',
    growthFactor: '650,000x',
    brainNervousSystem: 'Optic nerve pathways establish cortical connections in the occipital visual cortex.',
    cardiovascularVisceral: 'Pulmonary surfactant production increases steadily within prospective alveolar air spaces.',
    sensoryCraniofacial: 'Eyelids unseal and open for the first time; blinking reflex actively operational.',
    pulmonaryMusculoskeletal: 'Regular rhythmic practice breathing movements train intercostal and diaphragmatic muscles.'
  },
  27: {
    week: 27,
    carnegieStage: 'Second Trimester Culmination',
    epochName: 'Trimester 2 Gateway',
    growthFactor: '750,000x',
    brainNervousSystem: 'Brain surface exhibits complex secondary convolutions; REM (rapid eye movement) sleep registered.',
    cardiovascularVisceral: 'Cardiac autonomic regulation demonstrates accelerations with fetal body movements.',
    sensoryCraniofacial: 'Baby recognizes and rhythmically responds to parents’ familiar voices and soothing music.',
    pulmonaryMusculoskeletal: 'Fetal hiccups occur frequently as the diaphragm spasms during practice breathing.'
  },
  28: {
    week: 28,
    carnegieStage: 'Third Trimester Milestone',
    epochName: 'Third Trimester Gateway',
    growthFactor: '870,000x',
    brainNervousSystem: 'Billions of new synaptic connections form daily; brain mass expands exponentially.',
    cardiovascularVisceral: 'Body temperature regulation centers in hypothalamus initiate autonomic control.',
    sensoryCraniofacial: 'Eye pupils dilate and constrict in response to light variations through the uterine wall.',
    pulmonaryMusculoskeletal: 'Fetal weight surpasses 1.0 kg; adipose fat begins smoothing skin creases.'
  },
  29: {
    week: 29,
    carnegieStage: 'Rapid Skeletal Mineralization',
    epochName: 'Calcium Deposition',
    growthFactor: '1,000,000x',
    brainNervousSystem: 'Cerebral cortex assumes control over basic body functions from brainstem centers.',
    cardiovascularVisceral: 'Red blood cell production shifts almost entirely to the bone marrow.',
    sensoryCraniofacial: 'Hair on scalp thickens; eyes blink frequently during active wakeful periods.',
    pulmonaryMusculoskeletal: 'Fetus absorbs ~250mg of maternal elemental calcium daily into hardening bones.'
  },
  30: {
    week: 30,
    carnegieStage: 'Amniotic Volume Peak',
    epochName: 'Surfactant Maturation',
    growthFactor: '1,150,000x',
    brainNervousSystem: 'Brain shows distinct adult-like EEG brainwave patterns between deep and active REM sleep.',
    cardiovascularVisceral: 'Amniotic fluid volume reaches its biological peak (~800ml), cushioned for fetal movement.',
    sensoryCraniofacial: 'Toenails grow to the edges of the nail beds; eyebrow contours distinct.',
    pulmonaryMusculoskeletal: 'Subcutaneous white fat increases to 8% of total body weight, insulating internal organs.'
  },
  31: {
    week: 31,
    carnegieStage: 'Neurological Processing',
    epochName: 'Sensory Processing',
    growthFactor: '1,300,000x',
    brainNervousSystem: 'All 5 primary senses functional; baby tracks sound sources with head turns.',
    cardiovascularVisceral: 'Kidneys excrete up to 500ml of sterile urine daily into amniotic fluid.',
    sensoryCraniofacial: 'Lanugo hair begins shedding from face and shoulders into the amniotic fluid.',
    pulmonaryMusculoskeletal: 'Reproductive organs complete descent (testes in males; ovaries at pelvic brim in females).'
  },
  32: {
    week: 32,
    carnegieStage: 'Vertex Presentation Transition',
    epochName: 'Cephalic Turning',
    growthFactor: '1,500,000x',
    brainNervousSystem: 'Thermoregulation circuits refine; baby practices sustained thermal homeostasis.',
    cardiovascularVisceral: 'Placental transfer of maternal immunoglobulin G (IgG) antibodies accelerates for newborn immunity.',
    sensoryCraniofacial: 'Fingernails extend past the fingertips; skin transitions from translucent red to soft opaque pink.',
    pulmonaryMusculoskeletal: 'Majority of babies settle into the cephalic (head-down) vertex presentation.'
  },
  33: {
    week: 33,
    carnegieStage: 'Immune Shield Transfer',
    epochName: 'Maternal Immunity',
    growthFactor: '1,700,000x',
    brainNervousSystem: 'Cranial bones (frontal, parietal, occipital) remain pliable with unossified sutures and fontanelles.',
    cardiovascularVisceral: 'Amniotic fluid begins gradual physiological resorption as fetus occupies majority of uterine cavity.',
    sensoryCraniofacial: 'Pupillary light reflex fully coordinated; baby turns toward sustained light sources.',
    pulmonaryMusculoskeletal: 'Active kicks give way to strong rolling and stretching movements against uterine wall.'
  },
  34: {
    week: 34,
    carnegieStage: 'Surfactant Critical Mass',
    epochName: 'Surfactant Milestone',
    growthFactor: '1,900,000x',
    brainNervousSystem: 'Central nervous system sufficiently mature that neonatal outcomes closely mirror full-term infants.',
    cardiovascularVisceral: 'Lecithin/sphingomyelin (L/S) ratio in amniotic fluid approaches 2.0 (predictive of lung maturity).',
    sensoryCraniofacial: 'Vernix coating reaches maximum thickness, shielding skin from prolonged moisture.',
    pulmonaryMusculoskeletal: 'Skeleton fully calcified; skull remains flexible to facilitate pelvic birth canal passage.'
  },
  35: {
    week: 35,
    carnegieStage: 'Late Preterm Maturation',
    epochName: 'Adipose Storage',
    growthFactor: '2,100,000x',
    brainNervousSystem: 'Cerebral cortex undergoes dense synaptogenesis; reflexes (rooting, suckling, swallowing) integrated.',
    cardiovascularVisceral: 'Kidneys fully functional; liver stores glycogen and iron reserves for immediate postpartum life.',
    sensoryCraniofacial: 'Cheeks plump up with buccal fat pads (Bichat fat pads) designed for active breastfeeding latch.',
    pulmonaryMusculoskeletal: 'Body fat increases to ~15% of total mass, filling out skin folds and limbs.'
  },
  36: {
    week: 36,
    carnegieStage: 'Late Preterm Gateway',
    epochName: 'Pelvic Engagement',
    growthFactor: '2,300,000x',
    brainNervousSystem: 'Coordinated suck-swallow-breathe sequence practiced during amniotic fluid intake.',
    cardiovascularVisceral: 'Immune antibody titers against pertussis, tetanus, and influenza reach peak maternal transfer.',
    sensoryCraniofacial: 'Facial profile smooth and round; ear cartilage stiffens with springy recoil.',
    pulmonaryMusculoskeletal: 'Fetal head descends into maternal pelvic brim (lightening), easing maternal diaphragmatic pressure.'
  },
  37: {
    week: 37,
    carnegieStage: 'Early Term Milestone',
    epochName: 'Early Term Status',
    growthFactor: '2,500,000x',
    brainNervousSystem: 'Sleep cycles well organized into 40-minute rhythms; alertness states present.',
    cardiovascularVisceral: 'Lungs synthesize sufficient surfactant to support spontaneous ambient air breathing without collapse.',
    sensoryCraniofacial: 'Lanugo hair almost completely shed, leaving smooth skin with vernix in skin creases.',
    pulmonaryMusculoskeletal: 'Grasp reflex firm; infant capable of supporting significant fraction of body weight.'
  },
  38: {
    week: 38,
    carnegieStage: 'Full Term Maturation',
    epochName: 'Full Term Readiness',
    growthFactor: '2,700,000x',
    brainNervousSystem: 'Brain growth continues at 1% per day; respiratory neural centers ready for first independent breath.',
    cardiovascularVisceral: 'Circulatory shunts (ductus arteriosus, foramen ovale) ready for immediate pressure-mediated closure at birth.',
    sensoryCraniofacial: 'Vocal cords strong, ready for the first vigorous newborn cry.',
    pulmonaryMusculoskeletal: 'Meconium packed securely within the colon, ready for first postpartum evacuation.'
  },
  39: {
    week: 39,
    carnegieStage: 'Full Term Peak',
    epochName: 'Optimal Maturity',
    growthFactor: '2,900,000x',
    brainNervousSystem: 'Brain and nervous system completely prepared for external atmospheric sensory input.',
    cardiovascularVisceral: 'Adrenal glands produce surging catecholamines in response to Braxton Hicks surges.',
    sensoryCraniofacial: 'Plump facial cheeks with thick buccal pads ensure powerful latch for breastfeeding.',
    pulmonaryMusculoskeletal: 'Average weight reaches 3.2–3.4 kg; head fully engaged in maternal pelvis.'
  },
  40: {
    week: 40,
    carnegieStage: 'Full Term Completion / EDD',
    epochName: 'Birthday Milestone',
    growthFactor: '3,200,000x',
    brainNervousSystem: 'Full complement of 100 billion neurons formed and ready for external neonatal development.',
    cardiovascularVisceral: 'Umbilical cord vessels and placenta prepared for postpartum separation.',
    sensoryCraniofacial: 'Soft, pink, fully formed newborn ready to gaze, hear parents, and bond skin-to-skin.',
    pulmonaryMusculoskeletal: 'Lungs fully primed to take the monumental first breath of atmospheric air.'
  }
};

export const FetalWeeklyHero: React.FC<FetalWeeklyHeroProps> = ({
  currentGestationalWeek,
  estimatedDueDate,
  onSelectWeek
}) => {
  const { updateProfile } = useApp();
  const [selectedWeek, setSelectedWeek] = useState<number>(currentGestationalWeek || 24);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // 0 = Mon, 3 = Thu

  // Sync state if currentGestationalWeek changes (e.g. settings updated)
  useEffect(() => {
    if (currentGestationalWeek && currentGestationalWeek >= 1 && currentGestationalWeek <= 40) {
      setSelectedWeek(currentGestationalWeek);
    }
  }, [currentGestationalWeek]);

  const handleWeekChange = (newWeek: number) => {
    const clamped = Math.max(1, Math.min(40, newWeek));
    setSelectedWeek(clamped);
    if (onSelectWeek) onSelectWeek(clamped);
  };

  // 1-Click Update of Mother's actual current week
  const handleSetAsCurrentWeek = () => {
    updateProfile({ currentGestationalWeek: selectedWeek });
  };

  // Comprehensive weekly clinical data for all 40 weeks
  const currentWeekData: WeekData = useMemo(() => {
    return (
      WEEKS_DATA.find((w) => w.week === selectedWeek) ||
      WEEKS_DATA[Math.min(WEEKS_DATA.length - 1, Math.max(0, selectedWeek - 1))] ||
      WEEKS_DATA[0]
    );
  }, [selectedWeek]);

  // Carnegie & clinical embryological data
  const evolutionRef = useMemo(() => {
    return (
      FETAL_EVOLUTION_STANDARDS[selectedWeek] ||
      FETAL_EVOLUTION_STANDARDS[24]
    );
  }, [selectedWeek]);

  // Trimester & Month
  const selectedMonth = getPregnancyMonth(selectedWeek);
  const selectedTrimester = getPregnancyTrimester(selectedWeek);

  // Biological stage category for high-definition anatomical depiction
  const biologicalStage = useMemo(() => {
    if (selectedWeek <= 3) return 'germinal';
    if (selectedWeek <= 5) return 'early-embryo';
    if (selectedWeek <= 7) return 'organogenesis-embryo';
    if (selectedWeek <= 9) return 'late-embryo';
    if (selectedWeek <= 13) return 'early-fetus';
    if (selectedWeek <= 21) return 'mid-fetus';
    if (selectedWeek <= 27) return 'viable-fetus';
    if (selectedWeek <= 34) return 'maturing-fetus';
    return 'full-term';
  }, [selectedWeek]);

  // Calculate calendar days for this week based on EDD or baseline reference
  const weekCalendarData = useMemo(() => {
    const baseDate = new Date();
    const weekDiff = selectedWeek - (currentGestationalWeek || 24);
    baseDate.setDate(baseDate.getDate() + weekDiff * 7);

    // Compute Monday of that week
    const currentDay = baseDate.getDay();
    const distanceToMonday = (currentDay + 6) % 7;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - distanceToMonday);

    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const startPregDay = (selectedWeek - 1) * 7 + 1;

    return days.map((dayLabel, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      return {
        label: dayLabel,
        pregnancyDay: startPregDay + idx,
        dateNumber: d.getDate(),
        monthName: d.toLocaleString('en-US', { month: 'long' }),
        fullDate: d
      };
    });
  }, [selectedWeek, currentGestationalWeek]);

  const activeDay = weekCalendarData[selectedDayIndex] || weekCalendarData[3];
  const progressPercent = Math.round((selectedWeek / 40) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-4xl bg-card border border-border shadow-card overflow-hidden transition-all duration-300">
      {/* ========================================================= */}
      {/* 1. CLINICAL EVOLUTION HEADER & TRIMESTER SELECTOR         */}
      {/* Clean, calm, professional medical reference bar           */}
      {/* ========================================================= */}
      <div className="bg-stone-900 text-stone-100 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-stone-100 uppercase tracking-wider">
                Fetal Evolution & Developmental Reference
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary-soft font-mono font-bold">
                Week {selectedWeek} of 40 ({progressPercent}%)
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              {evolutionRef.carnegieStage} • Hadlock & WHO Clinical Standards
            </p>
          </div>
        </div>

        {/* Trimester Jump Badges */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleWeekChange(8)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTrimester === 1
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Trimester 1
          </button>

          <button
            type="button"
            onClick={() => handleWeekChange(20)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTrimester === 2
                ? 'bg-primary/20 text-primary-soft border border-primary/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Trimester 2
          </button>

          <button
            type="button"
            onClick={() => handleWeekChange(34)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedTrimester === 3
                ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Trimester 3
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CALM MATERNAL PEACH HERO SECTION                       */}
      {/* Featuring Anatomical Illustration without heartbeat/anim  */}
      {/* ========================================================= */}
      <div className="relative bg-gradient-to-b from-[#FDF3E7] via-[#F9EAD9] to-[#FFF9F3] pt-5 pb-3 px-4 sm:px-8 text-stone-900 overflow-hidden">
        {/* Top Header Bar: Date pill & Navigation arrows */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
          {/* Date pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-xs text-xs font-semibold text-stone-800">
            <span className="text-amber-800 text-sm">📅</span>
            <span>
              {activeDay.dateNumber} {activeDay.monthName}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-primary font-bold">Month {selectedMonth}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              Trimester {selectedTrimester}
            </span>
          </div>

          {/* Quick Week Selectors */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:flex items-center gap-1 bg-white/60 p-1 rounded-full border border-white/60 backdrop-blur-sm mr-1">
              {[4, 8, 12, 16, 20, 24, 28, 32, 36, 40].map((wk) => (
                <button
                  key={wk}
                  type="button"
                  onClick={() => handleWeekChange(wk)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedWeek === wk
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {wk}w
                </button>
              ))}
            </div>

            {/* Prev Week */}
            <button
              type="button"
              onClick={() => handleWeekChange(selectedWeek - 1)}
              disabled={selectedWeek <= 1}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
              title="Previous Week"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Next Week */}
            <button
              type="button"
              onClick={() => handleWeekChange(selectedWeek + 1)}
              disabled={selectedWeek >= 40}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/80 hover:bg-white border border-white/60 shadow-xs flex items-center justify-center text-stone-700 transition-all disabled:opacity-40 cursor-pointer"
              title="Next Week"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-Day Calendar Strip */}
        <div className="relative z-10 grid grid-cols-7 gap-1 sm:gap-2 text-center max-w-md mx-auto mb-3">
          {weekCalendarData.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIndex(idx)}
                className={`py-1 px-1 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected ? 'bg-white/60 backdrop-blur-xs shadow-xs' : 'hover:bg-white/20'
                }`}
              >
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-tight">
                  {item.label}
                </span>

                <span className="text-[9px] text-stone-400 font-mono scale-90">
                  {item.pregnancyDay}d
                </span>

                <div className="relative mt-0.5 flex flex-col items-center">
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-700'
                    }`}
                  >
                    {item.dateNumber}
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-800 mt-0.5" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* STATIC HIGH-DEFINITION ANATOMICAL DEVELOPMENT VIEW        */}
        {/* Calm, medically grounded, beautiful in utero illustration */}
        {/* ========================================================= */}
        <div className="relative z-10 flex flex-col items-center justify-center py-3">
          {/* Developmental Landmark Pill */}
          <div className="mb-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{evolutionRef.epochName}</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-600 font-normal">{evolutionRef.growthFactor}</span>
          </div>

          {/* Calm Anatomical In Utero Container */}
          <div className="relative flex items-center justify-center min-h-[175px] sm:min-h-[200px] select-none my-1">
            {/* Soft ambient womb halo (static, calm) */}
            <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-amber-100/60 via-rose-50/70 to-orange-100/50 blur-xl pointer-events-none" />

            {/* Soft ground shadow */}
            <div className="absolute bottom-1 w-36 h-4 bg-amber-900/10 rounded-full blur-md" />

            {/* Anatomical Developmental Visualizer */}
            <div className="relative transition-all duration-300">
              <ClinicalAnatomicalVisualizer
                week={selectedWeek}
                stage={biologicalStage}
              />
            </div>
          </div>

          {/* Week Title & Clinical Biometrics */}
          <div className="mt-2 text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-800 tracking-tight flex items-center justify-center gap-2">
              <span>Week {selectedWeek}</span>
              <span className="text-sm font-sans font-bold text-stone-600 bg-white/70 px-2.5 py-0.5 rounded-full border border-white/60">
                {currentWeekData.fruitEmoji} {currentWeekData.babySizeFruit}
              </span>
            </h2>

            {/* Biometric Badges (Length & Weight) */}
            <div className="flex items-center justify-center gap-3 text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-white/60 shadow-2xs">
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span>
                  {currentWeekData.babyLengthCm < 1
                    ? `${(currentWeekData.babyLengthCm * 10).toFixed(1)} mm CRL`
                    : `${currentWeekData.babyLengthCm} cm CHL`}
                </span>
              </span>

              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-white/60 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-accent" />
                <span>
                  {currentWeekData.babyWeightG >= 1000
                    ? `${(currentWeekData.babyWeightG / 1000).toFixed(2)} kg EFW`
                    : `${currentWeekData.babyWeightG} g EFW`}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Organic transition dip */}
        <div className="w-full overflow-hidden leading-none mt-2 -mb-2">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-7 sm:h-10 fill-card"
          >
            <path d="M0,0 C300,80 900,80 1200,0 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. FOUR BIOLOGICAL SYSTEMS EVOLUTION MATRIX               */}
      {/* Clear anatomical breakdown based on embryology reference  */}
      {/* ========================================================= */}
      <div className="p-4 sm:p-6 space-y-4 bg-card">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm sm:text-base font-serif font-bold text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span>Anatomical Systems Evolved in Week {selectedWeek}</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono font-semibold text-muted-foreground">
              Carnegie Reference
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* System 1: Brain & Nervous System */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Brain className="w-3.5 h-3.5 text-amber-700" />
                <span>Brain & Nervous System</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-normal">
                {evolutionRef.brainNervousSystem}
              </p>
            </div>

            {/* System 2: Cardiovascular & Internal Organs */}
            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-900">
                <Activity className="w-3.5 h-3.5 text-rose-700" />
                <span>Cardiovascular & Visceral Organs</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-normal">
                {evolutionRef.cardiovascularVisceral}
              </p>
            </div>

            {/* System 3: Sensory & Craniofacial Architecture */}
            <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Eye className="w-3.5 h-3.5 text-sky-700" />
                <span>Sensory & Craniofacial Development</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-normal">
                {evolutionRef.sensoryCraniofacial}
              </p>
            </div>

            {/* System 4: Pulmonary & Musculoskeletal */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pulmonary & Musculoskeletal</span>
              </div>
              <p className="text-stone-700 leading-relaxed font-normal">
                {evolutionRef.pulmonaryMusculoskeletal}
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Clinical Advice Card */}
        <div className="p-4 rounded-3xl bg-[#FFF9F3] border border-[#F5DECC] shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-serif font-bold text-[#8A5A38] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Clinical Advice for Mother • Trimester {selectedTrimester}</span>
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold uppercase">
              Month {selectedMonth}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            {currentWeekData.weeklyAdvice || currentWeekData.nutritionTip || currentWeekData.safeExerciseTip}
          </p>
        </div>

        {/* Quick Week Scrubber Bar (Clean, smooth 1–40 slider) */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/50 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Select gestational week (1 to 40):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="range"
              min={1}
              max={40}
              value={selectedWeek}
              onChange={(e) => handleWeekChange(Number(e.target.value))}
              className="w-full sm:w-44 accent-primary cursor-pointer"
            />
            <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded-lg bg-muted/50 border border-border min-w-[54px] text-center">
              Wk {selectedWeek}
            </span>

            {/* If browsing a different week, show 1-click update button */}
            {selectedWeek !== currentGestationalWeek ? (
              <button
                type="button"
                onClick={handleSetAsCurrentWeek}
                className="px-2.5 py-1 bg-primary text-white rounded-lg text-[11px] font-bold shadow-2xs hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1"
                title={`Set your pregnancy current progress to Week ${selectedWeek}`}
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Set as My Current Week</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                ● Your Current Week
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// CLINICAL ANATOMICAL VISUALIZER (CALM, ACCURATE, STATIC EMBRYOLOGY)
// Renders serene, medical-grade SVG illustrations of each developmental
// stage without artificial heartbeat throbbing or pulsing animations.
// =====================================================================
interface ClinicalAnatomicalVisualizerProps {
  week: number;
  stage: string;
}

const ClinicalAnatomicalVisualizer: React.FC<ClinicalAnatomicalVisualizerProps> = ({
  week,
  stage
}) => {
  // Proportional scale factor based on gestational age
  const scale = 0.74 + (week / 40) * 0.42;

  // 1. WEEKS 1 to 3: The Germinal Blastocyst (Cellular cleavage & implantation)
  if (stage === 'germinal') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="blastocystSphereClean" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FFEBD6" />
            <stop offset="70%" stopColor="#F5C498" />
            <stop offset="100%" stopColor="#D98A55" />
          </radialGradient>
          <radialGradient id="innerCellsClean" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD39B" />
            <stop offset="100%" stopColor="#C46E35" />
          </radialGradient>
        </defs>

        {/* Zona pellucida protective shell */}
        <circle cx="80" cy="80" r="46" fill="none" stroke="#E6A672" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.65" />
        <circle cx="80" cy="80" r="42" fill="url(#blastocystSphereClean)" opacity="0.9" />

        {/* Dividing blastomeres */}
        <circle cx="70" cy="70" r="14" fill="url(#innerCellsClean)" opacity="0.88" />
        <circle cx="90" cy="72" r="12" fill="url(#innerCellsClean)" opacity="0.88" />
        <circle cx="78" cy="88" r="13" fill="url(#innerCellsClean)" opacity="0.88" />
        <circle cx="88" cy="86" r="11" fill="url(#innerCellsClean)" opacity="0.85" />
        <circle cx="68" cy="84" r="10" fill="url(#innerCellsClean)" opacity="0.8" />

        {/* Nucleus */}
        <circle cx="78" cy="78" r="4.5" fill="#E65A4B" opacity="0.85" />
      </svg>
    );
  }

  // 2. WEEKS 4 to 5: Early C-Curve Embryo & Yolk Sac
  if (stage === 'early-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="embryoGradClean4" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFF4E6" />
            <stop offset="40%" stopColor="#F8D3B0" />
            <stop offset="75%" stopColor="#DE9E6E" />
            <stop offset="100%" stopColor="#AB6033" />
          </radialGradient>
          <radialGradient id="yolkSacClean4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF7" stopOpacity="0.85" />
            <stop offset="80%" stopColor="#F5D7B3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DB9F6B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Translucent Yolk Sac */}
        <circle cx="104" cy="98" r="28" fill="url(#yolkSacClean4)" stroke="#E4B484" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.85" />

        {/* C-Shape Curled Embryo Body */}
        <path
          d="M62,48 C85,34 108,50 102,76 C96,98 80,112 64,112 C48,112 40,94 48,80 C54,68 66,70 70,80 C74,88 68,96 60,94"
          fill="url(#embryoGradClean4)"
          stroke="#BA7440"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Somites (segmentation marks) */}
        <path d="M72,52 L76,55" stroke="#BA7440" strokeWidth="1" opacity="0.6" />
        <path d="M78,58 L82,62" stroke="#BA7440" strokeWidth="1" opacity="0.6" />
        <path d="M84,66 L88,71" stroke="#BA7440" strokeWidth="1" opacity="0.6" />

        {/* Primitive cardiac tube center */}
        <circle cx="76" cy="74" r="3.5" fill="#E65A4B" opacity="0.85" />
      </svg>
    );
  }

  // 3. WEEKS 6 to 7: Organogenesis Embryo with Limb Buds & Prominent Head
  if (stage === 'organogenesis-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="bodyGradClean6" cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FFF7EC" />
            <stop offset="30%" stopColor="#F7D4B2" />
            <stop offset="70%" stopColor="#DC9C6E" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Curled embryonic spine */}
        <path
          d="M74,36 C98,34 116,54 112,82 C108,106 88,124 68,124 C50,124 42,110 46,94 C50,80 62,78 70,86 C76,92 72,102 62,102"
          fill="url(#bodyGradClean6)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Large embryonic cranial head */}
        <circle cx="74" cy="48" r="21" fill="url(#bodyGradClean6)" stroke="#B56E3F" strokeWidth="1" />

        {/* Retinal optic pigment placode */}
        <circle cx="64" cy="50" r="3.2" fill="#5A3219" opacity="0.8" />

        {/* Paddle-like arm bud */}
        <path d="M72,70 C64,74 62,82 68,85" stroke="#B56E3F" strokeWidth="2.8" strokeLinecap="round" fill="none" />

        {/* Thoracic cardiac prominence */}
        <circle cx="82" cy="74" r="4.5" fill="#E65A4B" opacity="0.85" />
      </svg>
    );
  }

  // 4. WEEKS 8 to 9: Late Embryonic Period (Webbed digits separating)
  if (stage === 'late-embryo') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="bodyGradClean8" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF8EE" />
            <stop offset="30%" stopColor="#F9D7B7" />
            <stop offset="70%" stopColor="#DC9E70" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Curled back & body */}
        <path
          d="M78,35 C104,35 118,56 114,82 C110,108 92,126 70,126 C52,126 44,112 48,96 C50,84 62,80 72,88 C80,95 78,106 68,106"
          fill="url(#bodyGradClean8)"
          stroke="#BA7442"
          strokeWidth="1.2"
        />

        {/* Head */}
        <circle cx="76" cy="50" r="23" fill="url(#bodyGradClean8)" stroke="#BA7442" strokeWidth="1" />

        {/* Fused eyelid fold */}
        <ellipse cx="66" cy="52" rx="2.8" ry="3.8" fill="#5F3419" opacity="0.65" />

        {/* Arm with separating fingers brought to chest */}
        <path d="M72,70 C62,74 60,82 66,86 C72,89 76,82 76,75" fill="#F8D6B4" stroke="#BA7442" strokeWidth="1" />
        <circle cx="64" cy="85" r="2.2" fill="#FFE2C6" />
        <circle cx="67" cy="87" r="2" fill="#FFE2C6" />

        {/* Folded knee and foot bud */}
        <path d="M88,102 C82,106 72,112 68,108 C64,104 70,96 78,96" fill="#DE9D6E" stroke="#BA7442" strokeWidth="1" />
      </svg>
    );
  }

  // 5. WEEKS 10 to 13: Early Fetus (Facial profile & ribs)
  if (stage === 'early-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="bodyGradClean10" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF9F1" />
            <stop offset="35%" stopColor="#FADBC0" />
            <stop offset="70%" stopColor="#DC9E72" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Spine curvature */}
        <path
          d="M76,45 C98,42 114,60 110,88 C106,112 90,130 68,130 C50,130 42,116 46,100 C50,85 64,84 74,92 C80,98 76,108 66,108"
          fill="url(#bodyGradClean10)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Delicate rib silhouettes */}
        <path d="M82,72 Q88,74 94,72" stroke="#BA7442" strokeWidth="0.8" opacity="0.4" />
        <path d="M82,78 Q88,80 94,78" stroke="#BA7442" strokeWidth="0.8" opacity="0.4" />
        <path d="M80,84 Q86,86 92,84" stroke="#BA7442" strokeWidth="0.8" opacity="0.4" />

        {/* Face profile with nose and chin button */}
        <path
          d="M62,35 C68,26 84,24 94,32 C104,40 102,56 94,64 C86,72 74,70 66,62 C60,56 58,42 62,35 Z"
          fill="url(#bodyGradClean10)"
          stroke="#B56E3F"
          strokeWidth="1"
        />

        {/* Closed eye slit */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />
        <circle cx="76" cy="56" r="4.5" fill="#E87C65" opacity="0.35" />

        {/* Arms and hands */}
        <path d="M78,68 C72,70 65,76 68,82 C71,86 78,85 82,78 Z" fill="#FADBC0" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="70" cy="80" r="3.2" fill="#FFF0DE" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Legs and feet */}
        <path d="M84,105 C78,110 68,116 62,110 C58,104 66,95 76,96 Z" fill="#DC9E72" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="64" cy="112" r="3.5" fill="#FADBC0" stroke="#B56E3F" strokeWidth="0.8" />
      </svg>
    );
  }

  // 6. WEEKS 14 to 21: Mid Fetus (Quickening & Thumb-sucking pose)
  if (stage === 'mid-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="midFetusGradClean" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFF9F2" />
            <stop offset="35%" stopColor="#F9DCBF" />
            <stop offset="70%" stopColor="#D99C70" />
            <stop offset="100%" stopColor="#A86134" />
          </radialGradient>
        </defs>

        {/* Spine and body */}
        <path
          d="M76,40 C100,36 118,56 114,88 C110,116 92,134 68,134 C48,134 40,118 44,98 C48,80 64,80 75,90 C82,97 78,110 66,110"
          fill="url(#midFetusGradClean)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Head */}
        <circle cx="78" cy="46" r="23" fill="url(#midFetusGradClean)" stroke="#B56E3F" strokeWidth="1" />

        {/* Closed eyelid and brow */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.85" />
        <path d="M68,44 Q72,42 76,44" stroke="#8C4F27" strokeWidth="0.8" fill="none" opacity="0.6" />
        <circle cx="74" cy="53" r="5" fill="#E87C65" opacity="0.4" />

        {/* Arm reaching with thumb to mouth */}
        <path d="M78,68 C72,70 64,74 65,80 C68,84 76,82 82,76 Z" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="66" cy="78" r="3.8" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Legs and feet */}
        <path d="M86,106 C80,112 68,118 62,112 C58,106 68,96 78,98 Z" fill="#D99C70" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="64" cy="114" rx="4.8" ry="3.8" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="0.8" />
      </svg>
    );
  }

  // 7. WEEKS 22 to 27: Viable Fetus (Eyelids unsealed, lashes, hearing)
  if (stage === 'viable-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="viableFetusGradClean" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFFBF5" />
            <stop offset="35%" stopColor="#FADEBE" />
            <stop offset="70%" stopColor="#D99A6C" />
            <stop offset="100%" stopColor="#A85F31" />
          </radialGradient>
        </defs>

        {/* Torso */}
        <path
          d="M74,38 C98,34 118,52 115,84 C112,114 94,134 70,134 C50,134 40,118 44,98 C48,80 64,80 75,90 C82,97 78,110 66,110"
          fill="url(#viableFetusGradClean)"
          stroke="#B56E3F"
          strokeWidth="1.2"
        />

        {/* Head */}
        <circle cx="78" cy="46" r="23" fill="url(#viableFetusGradClean)" stroke="#B56E3F" strokeWidth="1" />

        {/* Eyelids and eyelashes */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.2" fill="none" opacity="0.8" />
        <path d="M67,46 L66,43" stroke="#663618" strokeWidth="0.9" />
        <path d="M71,46 L71,42" stroke="#663618" strokeWidth="0.9" />
        <path d="M75,47 L76,43" stroke="#663618" strokeWidth="0.9" />
        <circle cx="74" cy="53" r="5" fill="#E87C65" opacity="0.4" />

        {/* Arms and hands */}
        <path d="M80,68 C74,70 66,77 69,83 C72,87 79,86 84,78 Z" fill="#FADEBE" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="71" cy="80" r="3.5" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Legs and feet */}
        <path d="M86,106 C80,112 68,118 62,112 C58,106 68,96 78,98 Z" fill="#D99A6C" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="64" cy="114" rx="4.5" ry="3.5" fill="#FADEBE" stroke="#B56E3F" strokeWidth="0.8" />
      </svg>
    );
  }

  // 8. WEEKS 28 to 34: Maturing Fetus (Adipose fat deposition, chubby cheeks)
  if (stage === 'maturing-fetus') {
    return (
      <svg
        viewBox="0 0 160 160"
        style={{ transform: `scale(${scale})` }}
        className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
      >
        <defs>
          <radialGradient id="maturingFetusGradClean" cx="38%" cy="28%" r="65%">
            <stop offset="0%" stopColor="#FFFDF7" />
            <stop offset="35%" stopColor="#F9DABE" />
            <stop offset="70%" stopColor="#D89768" />
            <stop offset="100%" stopColor="#A65D2F" />
          </radialGradient>
        </defs>

        {/* Plump body */}
        <path
          d="M74,36 C102,32 122,52 118,86 C114,118 96,136 68,136 C46,136 36,120 42,98 C46,78 64,78 76,88 C84,96 80,110 66,110"
          fill="url(#maturingFetusGradClean)"
          stroke="#B56E3F"
          strokeWidth="1.3"
        />

        {/* Head with scalp hair */}
        <circle cx="78" cy="46" r="24" fill="url(#maturingFetusGradClean)" stroke="#B56E3F" strokeWidth="1" />
        <path d="M68,26 Q86,22 96,36" stroke="#9A6139" strokeWidth="1.8" fill="none" opacity="0.8" />

        {/* Peaceful facial features */}
        <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.3" fill="none" opacity="0.85" />
        <path d="M68,57 Q72,60 76,57" stroke="#9C5226" strokeWidth="1" fill="none" opacity="0.75" />
        <circle cx="74" cy="54" r="6" fill="#E87C65" opacity="0.45" />

        {/* Chubby arms */}
        <path d="M82,68 C74,70 64,78 68,84 C72,88 80,86 86,78 Z" fill="#F9DABE" stroke="#B56E3F" strokeWidth="1" />
        <circle cx="70" cy="81" r="4" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

        {/* Chubby legs */}
        <path d="M88,106 C80,114 66,120 60,112 C56,104 68,94 80,96 Z" fill="#D89768" stroke="#B56E3F" strokeWidth="1" />
        <ellipse cx="62" cy="114" rx="5.2" ry="4.2" fill="#F9DABE" stroke="#B56E3F" strokeWidth="0.8" />
      </svg>
    );
  }

  // 9. WEEKS 35 to 40+: Full Term Ready Baby (Head-down vertex position)
  return (
    <svg
      viewBox="0 0 160 160"
      style={{ transform: `scale(${scale})` }}
      className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-md transition-all duration-300"
    >
      <defs>
        <radialGradient id="fullTermGradClean" cx="38%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#FFFDF8" />
          <stop offset="35%" stopColor="#F9DCBF" />
          <stop offset="70%" stopColor="#DCA479" />
          <stop offset="100%" stopColor="#A86337" />
        </radialGradient>
      </defs>

      {/* Full-term plump newborn curled head down */}
      <path
        d="M74,36 C102,32 122,52 118,86 C114,118 96,136 68,136 C46,136 36,120 42,98 C46,78 64,78 76,88 C84,96 80,110 66,110"
        fill="url(#fullTermGradClean)"
        stroke="#B56E3F"
        strokeWidth="1.3"
      />

      {/* Head with silky baby hair and vernix fold */}
      <circle cx="78" cy="46" r="24.5" fill="url(#fullTermGradClean)" stroke="#B56E3F" strokeWidth="1" />
      <path d="M66,26 Q86,20 98,34" stroke="#8C4F27" strokeWidth="2.2" fill="none" opacity="0.85" />

      {/* Serene sleeping face */}
      <path d="M68,48 Q72,52 76,49" stroke="#663618" strokeWidth="1.3" fill="none" opacity="0.85" />
      <path d="M68,57 Q72,60 76,57" stroke="#9C5226" strokeWidth="1.1" fill="none" opacity="0.8" />
      <circle cx="74" cy="54" r="6.2" fill="#E87C65" opacity="0.5" />

      {/* Plump arms tucked near chin */}
      <path d="M82,68 C74,70 64,78 68,84 C72,88 80,86 86,78 Z" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="1" />
      <circle cx="70" cy="81" r="4" fill="#FFF2E2" stroke="#B56E3F" strokeWidth="0.8" />

      {/* Plump legs and feet ready for delivery */}
      <path d="M88,106 C80,114 66,120 60,112 C56,104 68,94 80,96 Z" fill="#DCA479" stroke="#B56E3F" strokeWidth="1" />
      <ellipse cx="62" cy="114" rx="5.4" ry="4.4" fill="#F9DCBF" stroke="#B56E3F" strokeWidth="0.8" />
    </svg>
  );
};
