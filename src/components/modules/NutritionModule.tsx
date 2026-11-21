'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  FOOD_PRESETS,
  PREGNANCY_RECIPES,
  CLINICAL_FOOD_SAFETY_DIRECTORY,
  CRAVING_PHYSIOLOGY,
  calculateMaternalNutritionTargets,
  FoodItemPreset,
  FoodSafetyItem
} from '@/data/nutritionData';
import { getLocalizedFoodItem } from '@/data/localizedFoods';
import { getLocalizedSafetyItem, getLocalizedRecipe } from '@/data/localizedSafetyAndRecipes';
import {
  Apple,
  Plus,
  Trash2,
  Droplets,
  AlertTriangle,
  Sparkles,
  BookOpen,
  ShieldAlert,
  Search,
  Check,
  ChevronRight,
  Heart,
  Flame,
  Dna,
  ShieldCheck,
  Info,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export const NutritionModule: React.FC = () => {
  const {
    profile,
    meals,
    addMealItem,
    deleteMealItem,
    resetMeals,
    waterGlasses,
    incrementWater,
    decrementWater,
    cravings,
    logCraving,
    selectedLanguage,
    t
  } = useApp();

  // Dynamic Clinical RDA calculation
  const clinicalRda = useMemo(() => {
    return calculateMaternalNutritionTargets(
      profile.currentGestationalWeek || 24,
      profile.prePregnancyWeightKg || 62,
      profile.heightCm || 163,
      profile.age || 29,
      Array.isArray(profile.medicalConditions) ? profile.medicalConditions.join(' ') : '',
      Array.isArray(profile.allergies) ? profile.allergies.join(' ') : ''
    );
  }, [
    profile.currentGestationalWeek,
    profile.prePregnancyWeightKg,
    profile.heightCm,
    profile.age,
    profile.medicalConditions,
    profile.allergies
  ]);

  // Search & Filtering State for Real Foods
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNutrientFilter, setSelectedNutrientFilter] = useState<string>('all');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAllSlots, setShowAllSlots] = useState(false);

  // Custom Food Entry
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('220');
  const [manualProtein, setManualProtein] = useState('12');
  const [manualIron, setManualIron] = useState('2.5');
  const [manualCalcium, setManualCalcium] = useState('150');
  const [manualFolate, setManualFolate] = useState('60');

  // Craving logging state
  const [cravingType, setCravingType] = useState<'sweet' | 'spicy' | 'salty' | 'sour' | 'unusual' | 'non-food'>('sweet');
  const [cravingDesc, setCravingDesc] = useState('');
  const [cravingAlert, setCravingAlert] = useState<string | null>(null);

  // Food Safety Tab
  const [safetyTab, setSafetyTab] = useState<'Strictly Avoid' | 'Limit & Caution' | 'Pregnancy Superfood'>('Strictly Avoid');

  // Recipe Modal / Drawer State
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Aggregates
  const totalCalories = meals.reduce((a, b) => a + (b.calories || 0), 0);
  const totalProtein = meals.reduce((a, b) => a + (b.proteinG || 0), 0);
  const totalCarbs = meals.reduce((a, b) => a + (b.carbsG || 0), 0);
  const totalFat = meals.reduce((a, b) => a + (b.fatG || 0), 0);
  const totalFiber = meals.reduce((a, b) => a + (b.fiberG || 0), 0);
  const totalIron = meals.reduce((a, b) => a + (b.ironMg || 0), 0);
  const totalCalcium = meals.reduce((a, b) => a + (b.calciumMg || 0), 0);
  const totalFolate = meals.reduce((a, b) => a + (b.folateMcg || 0), 0);

  // Filtered Food Presets from verified real data
  const filteredFoods = useMemo(() => {
    return FOOD_PRESETS.filter(item => {
      const loc = getLocalizedFoodItem(item, selectedLanguage);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(q) ||
        loc.name.toLowerCase().includes(q) ||
        item.benefits.toLowerCase().includes(q) ||
        loc.benefits.toLowerCase().includes(q) ||
        item.sourceCitation.toLowerCase().includes(q) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(q) || t(tag, tag).toLowerCase().includes(q)));

      const matchesCat =
        selectedCategory === 'all' ||
        item.category === selectedCategory;

      let matchesNutrient = true;
      if (selectedNutrientFilter === 'iron') matchesNutrient = item.ironMg >= 3.0;
      else if (selectedNutrientFilter === 'calcium') matchesNutrient = item.calciumMg >= 200;
      else if (selectedNutrientFilter === 'folate') matchesNutrient = item.folateMcg >= 100;
      else if (selectedNutrientFilter === 'protein') matchesNutrient = item.proteinG >= 14;
      else if (selectedNutrientFilter === 'low-gi') matchesNutrient = item.glycemicIndex === 'Low';
      else if (selectedNutrientFilter === 'dha') matchesNutrient = (item.tags || []).some(tag => tag.includes('DHA') || tag.includes('Omega-3'));

      return matchesSearch && matchesCat && matchesNutrient;
    });
  }, [searchQuery, selectedCategory, selectedNutrientFilter, selectedLanguage, t]);

  const handleAddFoodPreset = (item: FoodItemPreset) => {
    const loc = getLocalizedFoodItem(item, selectedLanguage);
    addMealItem({
      name: loc.name || item.name,
      calories: item.calories,
      proteinG: item.proteinG,
      carbsG: item.carbsG,
      fatG: item.fatG,
      fiberG: item.fiberG,
      ironMg: item.ironMg,
      calciumMg: item.calciumMg,
      folateMcg: item.folateMcg,
      vitaminDiu: item.vitaminDiu,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;
    addMealItem({
      name: manualName.trim(),
      calories: Number(manualCalories) || 200,
      proteinG: Number(manualProtein) || 10,
      carbsG: 28,
      fatG: 6,
      fiberG: 4,
      ironMg: Number(manualIron) || 2,
      calciumMg: Number(manualCalcium) || 100,
      folateMcg: Number(manualFolate) || 50,
      vitaminDiu: 25,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setManualName('');
    setShowManualForm(false);
  };

  const handleLogCraving = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cravingDesc.trim()) return;

    const res = logCraving(cravingType, cravingDesc.trim());
    if (res.isPicaFlagged) {
      setCravingAlert(
        '⚠️ CRITICAL CLINICAL ALERT (PICA DETECTED): Craving non-food substances (soil, clay, chalk, ice obsessively) is a physiological hallmark of severe Iron Deficiency Anemia or Zinc deficiency. Please request an immediate Complete Blood Count (CBC) and serum ferritin test from Dr. ' +
          profile.doctorInfo.name +
          '.'
      );
    } else {
      setCravingAlert(null);
    }
    setCravingDesc('');
  };

  const activeCravingInsight = CRAVING_PHYSIOLOGY[cravingType];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-[#FAF6EE] to-amber-50/50 p-6 rounded-3xl border border-emerald-100 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Apple className="w-3.5 h-3.5" />
              <span>{t('Evidence-Based Maternal Clinical Nutrition', 'Evidence-Based Maternal Clinical Nutrition')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              {t('nutritionTitle', 'Smart Nutrition & Craving Management')}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1 max-w-2xl">
              {t('nutritionSubtitle', 'Authentic nutritional composition compiled from USDA FoodData Central & ICMR-NIN Indian Food Composition Tables. Tailored dynamically to your week of pregnancy and clinical profile.')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 bg-white/90 dark:bg-card/90 backdrop-blur p-3.5 rounded-2xl border border-emerald-200/60 dark:border-border shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-[11px] text-gray-600 dark:text-muted-foreground">
              <span className="font-bold text-gray-900 dark:text-foreground block">{t('Personalized Clinical Targets Active', 'Personalized Clinical Targets Active')}</span>
              {t('Gestational Week', 'Gestational Week')} {profile.currentGestationalWeek} · {t('Trimester', 'Trimester')} {profile.currentGestationalWeek <= 13 ? 1 : profile.currentGestationalWeek <= 27 ? 2 : 3}
            </div>
          </div>
        </div>

        {/* Dynamic Formula Clinical Alert Bar */}
        <div className="mt-4 pt-4 border-t border-emerald-200/50 dark:border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{clinicalRda.trimesterNotes}</span>
          </div>
          {clinicalRda.specialConditionAlerts.length > 0 && (
            <div className="px-2.5 py-1 bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 rounded-lg font-semibold text-[11px] flex items-center gap-1.5 border border-amber-200 dark:border-amber-900/40">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              {clinicalRda.specialConditionAlerts[0]}
            </div>
          )}
        </div>
      </div>

      {/* Top Cards: Daily Nutrient Breakdown & Hydration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Macronutrients Card */}
        <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              {t('Today’s Macronutrients', 'Today’s Macronutrients')}
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
              {t('ACOG/WHO Standards', 'ACOG/WHO Standards')}
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Calories */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-700 dark:text-gray-300">{t('calories', 'Calories')}: {totalCalories} / {clinicalRda.calories} {t('kcal', 'kcal')}</span>
                <span className="text-gray-900 dark:text-foreground font-bold">{Math.round((totalCalories / clinicalRda.calories) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalCalories / clinicalRda.calories) * 100)}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-gray-700 dark:text-gray-300">{t('protein', 'Protein')}: {totalProtein.toFixed(1)} / {clinicalRda.proteinG} g</span>
                <span className="text-gray-900 dark:text-foreground font-bold">{Math.round((totalProtein / clinicalRda.proteinG) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#C47A5A] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalProtein / clinicalRda.proteinG) * 100)}%` }}
                />
              </div>
            </div>

            {/* Macro distribution tiles */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 bg-[#FAF6EE] dark:bg-muted/40 rounded-2xl border border-stone-200 dark:border-border">
                <span className="text-[10px] text-gray-500 dark:text-muted-foreground block font-bold">{t('Complex Carbs', 'Complex Carbs')}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{totalCarbs}g</span>
                <span className="text-[9px] text-gray-400 dark:text-muted-foreground block">{t('Target:', 'Target:')} ~{clinicalRda.carbsG}g</span>
              </div>
              <div className="p-2.5 bg-[#FAF6EE] dark:bg-muted/40 rounded-2xl border border-stone-200 dark:border-border">
                <span className="text-[10px] text-gray-500 dark:text-muted-foreground block font-bold">{t('Healthy Fats', 'Healthy Fats')}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{totalFat}g</span>
                <span className="text-[9px] text-gray-400 dark:text-muted-foreground block">{t('Target:', 'Target:')} ~{clinicalRda.fatG}g</span>
              </div>
              <div className="p-2.5 bg-[#FAF6EE] dark:bg-muted/40 rounded-2xl border border-stone-200 dark:border-border">
                <span className="text-[10px] text-gray-500 dark:text-muted-foreground block font-bold">{t('Dietary Fiber', 'Dietary Fiber')}</span>
                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">{totalFiber}g</span>
                <span className="text-[9px] text-gray-400 dark:text-muted-foreground block">{t('Target:', 'Target:')} ~{clinicalRda.fiberG}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Pregnancy Micronutrients Card */}
        <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-foreground flex items-center gap-2">
              <Dna className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('Essential Micronutrients', 'Essential Micronutrients')}
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              {t('Clinical RDA', 'Clinical RDA')}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Iron */}
            <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/50 flex items-center justify-between">
              <div>
                <span className="font-bold text-rose-950 dark:text-rose-200 block">{t('Dietary Iron (Fe)', 'Dietary Iron (Fe)')}</span>
                <p className="text-[10px] text-rose-700 dark:text-rose-300">{t('Hemoglobin & fetal tissue oxygenation', 'Hemoglobin & fetal tissue oxygenation')}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-rose-900 dark:text-rose-200 text-sm">
                  {totalIron.toFixed(1)} / {clinicalRda.ironMg} mg
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 block">
                  {Math.round((totalIron / clinicalRda.ironMg) * 100)}% {t('of RDA', 'of RDA')}
                </span>
              </div>
            </div>

            {/* Folate */}
            <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-blue-950 block">{t('Natural Folate / B9', 'Natural Folate / B9')}</span>
                <p className="text-[10px] text-blue-700">{t('Neural tube & spine morphogenesis', 'Neural tube & spine morphogenesis')}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-blue-900 text-sm">
                  {totalFolate} / {clinicalRda.folateMcg} mcg
                </span>
                <span className="text-[10px] text-blue-600 block">
                  {Math.round((totalFolate / clinicalRda.folateMcg) * 100)}% {t('of RDA', 'of RDA')}
                </span>
              </div>
            </div>

            {/* Calcium */}
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950 block">{t('Elemental Calcium (Ca)', 'Elemental Calcium (Ca)')}</span>
                <p className="text-[10px] text-amber-700">{t('Fetal skeleton & tooth bud calcification', 'Fetal skeleton & tooth bud calcification')}</p>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-amber-900 text-sm">
                  {totalCalcium} / {clinicalRda.calciumMg} mg
                </span>
                <span className="text-[10px] text-amber-600 block">
                  {Math.round((totalCalcium / clinicalRda.calciumMg) * 100)}% {t('of RDA', 'of RDA')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 border border-blue-200 shadow-card flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-950 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-600" />
              {t('maternalHydration', 'Maternal Hydration')}
            </h3>
            <span className="text-xs font-bold text-blue-700">
              {(waterGlasses * 0.25).toFixed(2)}L / {clinicalRda.waterLiters}L
            </span>
          </div>

          <div className="text-center py-2">
            <div className="text-4xl font-serif font-black text-blue-700">{waterGlasses}</div>
            <span className="text-xs text-blue-600 font-semibold block mt-1">
              {t('glassesLoggedToday', 'Glasses Logged Today')} ({t('Target:', 'Target:')} {clinicalRda.waterGlasses} {t('glasses', 'glasses')})
            </span>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: Math.min(14, clinicalRda.waterGlasses) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-5 rounded-sm transition-all ${
                    i < waterGlasses ? 'bg-blue-500 shadow-xs' : 'bg-blue-100 border border-blue-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={decrementWater}
                className="flex-1 py-2 bg-white dark:bg-card hover:bg-blue-100 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-900/50 transition-colors"
              >
                {t('- 1 Glass', '- 1 Glass')}
              </button>
              <button
                onClick={incrementWater}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                {t('+ Drink 250ml', '+ Drink 250ml')}
              </button>
            </div>
            <p className="text-[11px] text-blue-800 dark:text-blue-300 text-center leading-snug">
              {t('Adequate amniotic fluid volume and prevention of preterm uterine irritability require ~', 'Adequate amniotic fluid volume and prevention of preterm uterine irritability require ~')}{clinicalRda.waterLiters}L.
            </p>
          </div>
        </div>
      </div>

      {/* Main Section: Real Food Database & Meal Diary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Food Diary & Real Food Search (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Meal Diary */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-gray-900 dark:text-foreground">{t('todaysMealDiary', 'Today’s Meal Diary')}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                    {meals.length} {meals.length === 1 ? t('item', 'item') : t('items', 'items')}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground">{t('trackNutrientsSub', 'Track real clinical nutrients across your meals')}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Meal slot selector */}
                <div className="flex items-center gap-1 p-1 bg-[#FAF6EE] dark:bg-muted/40 rounded-xl border border-stone-200 dark:border-border text-xs">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map(type => {
                    const count = meals.filter(m => m.mealType === type).length;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedMealType(type);
                          setShowAllSlots(false);
                        }}
                        className={`px-2.5 py-1.5 rounded-lg capitalize font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                          !showAllSlots && selectedMealType === type
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                        }`}
                      >
                        <span>{t(type, type)}</span>
                        {count > 0 && (
                          <span className={`text-[10px] px-1 rounded-full font-bold ${
                            !showAllSlots && selectedMealType === type ? 'bg-white/20 text-white' : 'bg-stone-200 dark:bg-muted text-stone-700 dark:text-gray-300'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setShowAllSlots(!showAllSlots)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      showAllSlots
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                    }`}
                  >
                    {t('allDay', 'All Day')}
                  </button>
                </div>

                {/* Reset meals button */}
                <button
                  onClick={() => {
                    if (meals.length === 0) return;
                    if (typeof window !== 'undefined' && window.confirm(t("Reset today's meal diary? All logged food items will be cleared.", "Reset today's meal diary? All logged food items will be cleared."))) {
                      resetMeals();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer shrink-0"
                  title={t("Reset today's meals", "Reset today's meals")}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('Reset', 'Reset')}</span>
                </button>
              </div>
            </div>

            {/* List of meals logged */}
            <div className="space-y-2.5">
              {(() => {
                const slotMeals = showAllSlots ? meals : meals.filter(m => m.mealType === selectedMealType);
                if (slotMeals.length === 0) {
                  return (
                    <div className="p-8 text-center bg-[#FAF6EE]/50 dark:bg-muted/20 rounded-2xl border border-dashed border-stone-300 dark:border-border text-gray-500 dark:text-muted-foreground text-xs">
                      {showAllSlots
                        ? t("No meals logged yet today. Choose from the real USDA/ICMR food database below!", "No meals logged yet today. Choose from the real USDA/ICMR food database below!")
                        : `${t('No', 'No')} ${t(selectedMealType)} ${t('items logged yet today. Select any food below to log it directly into', 'items logged yet today. Select any food below to log it directly into')} ${t(selectedMealType)}!`}
                    </div>
                  );
                }
                return slotMeals.map(m => (
                  <div
                    key={m.id}
                    className="p-3.5 bg-[#FFFDF8] dark:bg-card hover:bg-white dark:hover:bg-muted/30 rounded-2xl border border-stone-200 dark:border-border hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-between gap-3 text-xs shadow-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="capitalize px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          {t(m.mealType, m.mealType)}
                        </span>
                        <span className="text-gray-400 dark:text-muted-foreground text-[11px]">{m.time}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-foreground truncate">{t(m.name, m.name)}</h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-600 dark:text-muted-foreground text-[11px] mt-1">
                        <span className="font-semibold text-orange-600 dark:text-orange-400">🔥 {m.calories} {t('kcal', 'kcal')}</span>
                        <span className="font-semibold text-rose-600 dark:text-rose-400">🥩 {m.proteinG}g {t('Pro', 'protein')}</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">🩸 {m.ironMg}mg {t('Fe', 'iron')}</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">🥬 {m.folateMcg}mcg {t('Folate', 'folate')}</span>
                        <span className="font-semibold text-amber-700 dark:text-amber-400">🦴 {m.calciumMg}mg {t('Ca', 'Ca')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMealItem(m.id)}
                      className="text-stone-300 dark:text-stone-500 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                      title={t("Remove food item", "Remove food item")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Real USDA / ICMR-NIN Food Composition Explorer */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    {t('65+ Verified Foods', '65+ Verified Foods')}
                  </span>
                  <h3 className="text-base font-serif font-bold text-gray-900 dark:text-foreground">
                    {t('Clinical Food Composition Database', 'Clinical Food Composition Database')}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">
                  {t('Analytical macronutrients & micronutrients with official USDA / ICMR-NIN source citations.', 'Analytical macronutrients & micronutrients with official USDA / ICMR-NIN source citations.')}
                </p>
              </div>

              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0 cursor-pointer"
              >
                {showManualForm ? t('Hide Manual Form', 'Hide Manual Form') : t('+ Custom Food Entry', '+ Custom Food Entry')}
              </button>
            </div>

            {/* Manual Entry Form */}
            {showManualForm && (
              <form onSubmit={handleManualAdd} className="p-4 bg-[#FAF6EE] dark:bg-muted/40 rounded-2xl border border-stone-300 dark:border-border text-xs space-y-3">
                <div className="font-bold text-gray-900 text-xs">
                  {t('Add Custom Food to', 'Add Custom Food to')} {t(selectedMealType)}:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={manualName}
                      onChange={e => setManualName(e.target.value)}
                      placeholder={t('Meal / Item name', 'Meal / Item name')}
                      className="w-full px-3 py-1.5 bg-white dark:bg-card text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={manualCalories}
                      onChange={e => setManualCalories(e.target.value)}
                      placeholder={t('Calories', 'Calories')}
                      className="w-full px-3 py-1.5 bg-white dark:bg-card text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={manualProtein}
                      onChange={e => setManualProtein(e.target.value)}
                      placeholder={t('Protein (g)', 'Protein (g)')}
                      className="w-full px-3 py-1.5 bg-white dark:bg-card text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={manualIron}
                      onChange={e => setManualIron(e.target.value)}
                      placeholder={t('Iron (mg)', 'Iron (mg)')}
                      className="w-full px-3 py-1.5 bg-white dark:bg-card text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={manualCalcium}
                      onChange={e => setManualCalcium(e.target.value)}
                      placeholder={t('Calcium (mg)', 'Calcium (mg)')}
                      className="w-full px-3 py-1.5 bg-white dark:bg-card text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {t('Log to', 'Log to')} {t(selectedMealType)}
                  </button>
                </div>
              </form>
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400 dark:text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search real foods (e.g. ragi, spinach, salmon, edamame, oats, avocado)...', 'Search real foods (e.g. ragi, spinach, salmon, edamame, oats, avocado)...')}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6EE] dark:bg-muted/40 text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            {/* Nutrient Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-gray-400 font-bold mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> {t('Filter by:', 'Filter by:')}
              </span>
              {[
                { id: 'all', label: t('All Nutrients', 'All Nutrients') },
                { id: 'iron', label: t('🩸 High Iron (Fe >= 3mg)', '🩸 High Iron (Fe >= 3mg)') },
                { id: 'calcium', label: t('🦴 High Calcium (Ca >= 200mg)', '🦴 High Calcium (Ca >= 200mg)') },
                { id: 'folate', label: t('🥬 High Folate (B9 >= 100mcg)', '🥬 High Folate (B9 >= 100mcg)') },
                { id: 'protein', label: t('🥩 High Protein (>= 14g)', '🥩 High Protein (>= 14g)') },
                { id: 'low-gi', label: t('🌿 Low Glycemic Index', '🌿 Low Glycemic Index') },
                { id: 'dha', label: t('🐟 Marine DHA / Omega-3', '🐟 Marine DHA / Omega-3') }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedNutrientFilter(f.id)}
                  className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
                    selectedNutrientFilter === f.id
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
              {[
                { id: 'all', label: t('All Categories', 'All Categories') },
                { id: 'breakfast', label: t('Breakfast Staples', 'Breakfast Staples') },
                { id: 'lunch', label: t('Lunch / Mains', 'Lunch / Mains') },
                { id: 'dinner', label: t('Dinner Mains', 'Dinner Mains') },
                { id: 'snack', label: t('Wholesome Snacks', 'Wholesome Snacks') },
                { id: 'beverage', label: t('Beverages & Broths', 'Beverages & Broths') }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                    selectedCategory === c.id
                      ? 'bg-stone-900 text-white font-bold'
                      : 'bg-[#FAF6EE] text-gray-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Food items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredFoods.map(item => {
                const loc = getLocalizedFoodItem(item, selectedLanguage);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-[#FFFDF8] dark:bg-card hover:bg-white dark:hover:bg-muted/30 rounded-2xl border border-stone-200 dark:border-border hover:border-emerald-400 transition-all flex flex-col justify-between space-y-2 text-xs group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-foreground leading-tight group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                            {loc.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 dark:text-muted-foreground">
                            <span>{loc.serving}</span>
                            <span>•</span>
                            <span
                              className={`font-semibold ${
                                item.glycemicIndex === 'Low'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : item.glycemicIndex === 'Medium'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              GI: {loc.glycemicIndex}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddFoodPreset(item)}
                          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-700 text-emerald-800 dark:text-emerald-300 hover:text-white rounded-xl border border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-700 font-bold transition-all flex items-center gap-1 shrink-0 text-[11px] cursor-pointer"
                          title={`${t('Log to', 'Log to')} ${t(selectedMealType)}`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t(`+ Log to ${selectedMealType}`, `+ Log to ${selectedMealType}`)}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-600 dark:text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                        {loc.benefits}
                      </p>
                    </div>

                    {/* Nutrients chips */}
                    <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-1.5 py-0.5 bg-orange-50 text-orange-800 rounded font-semibold">
                        {item.calories} {t('kcal', 'kcal')}
                      </span>
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-800 rounded font-semibold">
                        {item.proteinG}g {t('Pro', 'Pro')}
                      </span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold">
                        {item.ironMg}mg {t('Fe', 'Fe')}
                      </span>
                      <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-semibold">
                        {item.calciumMg}mg {t('Ca', 'Ca')}
                      </span>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-semibold">
                        {item.folateMcg}mcg {t('Folate', 'Folate')}
                      </span>
                      {item.cholineMg && (
                        <span className="px-1.5 py-0.5 bg-purple-50 text-purple-800 rounded font-semibold">
                          {item.cholineMg}mg {t('Choline', 'Choline')}
                        </span>
                      )}
                    </div>

                    {/* Scientific Source Citation */}
                    <div className="text-[9px] text-stone-400 font-mono flex items-center justify-between pt-0.5">
                      <span className="truncate">{item.sourceCitation}</span>
                      <span className="capitalize text-stone-500 font-sans font-semibold shrink-0 ml-1">
                        {loc.dietType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Craving Physiology & Clinical Food Safety (1 col) */}
        <div className="space-y-6">
          {/* Pregnancy Craving & Pica Diagnostic Module */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-foreground">
                  {t('cravingTrackerTitle', 'Pregnancy Craving & PICA Analyzer')}
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-muted-foreground">
                  {t('Physiological correlates based on blood volume and micronutrient status', 'Physiological correlates based on blood volume and micronutrient status')}
                </p>
              </div>
            </div>

            {cravingAlert && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-2xl text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 animate-pulse">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-semibold">{t('picaWarningBody', cravingAlert)}</p>
              </div>
            )}

            <form onSubmit={handleLogCraving} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">{t('Craving Type', 'Craving Type')}</label>
                <select
                  value={cravingType}
                  onChange={e => setCravingType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF6EE] dark:bg-muted/40 text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs font-medium"
                >
                  <option value="sweet">{t('sweetCraving', 'Sweet (Pastries, Chocolates, Fruit juices)')}</option>
                  <option value="sour">{t('sourCraving', 'Sour & Tangy (Lemon, Pickles, Raw Mango)')}</option>
                  <option value="salty">{t('saltyCraving', 'Salty & Savory (Chips, Salted nuts, Chaat)')}</option>
                  <option value="spicy">{t('spicyCraving', 'Spicy & Pungent (Curries, Chili peppers)')}</option>
                  <option value="unusual">{t('Unusual Food Combinations', 'Unusual Food Combinations (e.g. Ice cream + pickles)')}</option>
                  <option value="non-food">{t('Non-Food Substance (PICA)', 'Non-Food Substance (PICA: Soil, Clay, Chalk, Ice)')}</option>
                </select>
              </div>

              {/* Real physiological insight box */}
              {activeCravingInsight && (
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 text-[11px] space-y-1">
                  <span className="font-bold text-amber-950 dark:text-amber-200 block">{t('Physiological Explanation', 'Physiological Explanation')}:</span>
                  <p className="text-amber-900 dark:text-amber-300">{activeCravingInsight.physiologicalTrigger}</p>
                  <p className="text-amber-800 dark:text-amber-400 font-medium pt-0.5">
                    💡 <span className="font-bold">{t('Recommendation', 'Recommendation')}:</span> {activeCravingInsight.recommendedAction}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-bold mb-1">{t('Specific craving description', 'Specific craving description')}</label>
                <input
                  type="text"
                  value={cravingDesc}
                  onChange={e => setCravingDesc(e.target.value)}
                  placeholder={t('e.g. Sliced green mango with black rock salt', 'e.g. Sliced green mango with black rock salt')}
                  className="w-full px-3 py-2 bg-[#FAF6EE] dark:bg-muted/40 text-gray-900 dark:text-foreground border border-stone-200 dark:border-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-md transition-all text-xs cursor-pointer"
              >
                {t('logCravingBtn', 'Log Craving Pattern')}
              </button>
            </form>

            {/* Recent Cravings */}
            <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-border">
              <span className="text-[10px] font-bold text-stone-400 dark:text-muted-foreground uppercase tracking-wider">
                {t('Recent Logged Cravings:', 'Recent Logged Cravings:')}
              </span>
              {cravings.length === 0 ? (
                <p className="text-[11px] text-gray-400 dark:text-muted-foreground">{t('No cravings logged yet.', 'No cravings logged yet.')}</p>
              ) : (
                cravings.slice(-3).reverse().map(c => (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      c.isPicaFlagged
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60 text-red-950 dark:text-red-200 font-bold'
                        : 'bg-[#FAF6EE] dark:bg-muted/40 border-stone-200 dark:border-border text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    <div>
                      <span className="capitalize text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-card mr-1.5 border border-stone-200 dark:border-border">
                        {t(c.type, c.type)}
                      </span>
                      <span>{c.description}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-muted-foreground">{c.date}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Clinical Food Safety Directory (FDA / ACOG / NHS) */}
          <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-base font-serif font-bold text-gray-900 dark:text-foreground">
                  {t('Pregnancy Food Safety Directory', 'Pregnancy Food Safety Directory')}
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-muted-foreground">
              {t('Evidence-based safety guidance per FDA, CDC, and ACOG standards.', 'Evidence-based safety guidance per FDA, CDC, and ACOG standards.')}
            </p>

            {/* Safety Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#FAF6EE] dark:bg-muted/40 rounded-xl border border-stone-200 dark:border-border text-[11px]">
              {(['Strictly Avoid', 'Limit & Caution', 'Pregnancy Superfood'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setSafetyTab(tab)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-center cursor-pointer ${
                    safetyTab === tab
                      ? tab === 'Strictly Avoid'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : tab === 'Limit & Caution'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-emerald-700 text-white shadow-xs'
                      : 'text-gray-600 dark:text-muted-foreground hover:text-gray-900 dark:hover:text-foreground'
                  }`}
                >
                  {tab === 'Strictly Avoid' ? `🚫 ${t('Avoid', 'Avoid')}` : tab === 'Limit & Caution' ? `⚠️ ${t('Limit', 'Limit')}` : `✅ ${t('Superfood', 'Superfood')}`}
                </button>
              ))}
            </div>

            {/* Safety Directory List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {CLINICAL_FOOD_SAFETY_DIRECTORY.filter(s => s.category === safetyTab).map(rawItem => {
                const item = getLocalizedSafetyItem(rawItem, selectedLanguage);
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FAF6EE]/70 dark:bg-muted/40 rounded-2xl border border-stone-200 dark:border-border space-y-1.5 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-gray-900 dark:text-foreground leading-tight">{item.name}</h5>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.riskLevel === 'Dangerous'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : item.riskLevel === 'Moderate Risk'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {item.pathogenOrRisk}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-600 dark:text-muted-foreground leading-relaxed">
                      {item.clinicalExplanation}
                    </p>
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold pt-0.5">
                      {t('Safe Alternative:', 'Safe Alternative:')} {item.safeAlternative}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Tested Recipes Section */}
      <div className="bg-white dark:bg-card rounded-3xl p-6 border border-stone-200 dark:border-border shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 text-xs font-bold mb-1 border border-amber-200 dark:border-amber-900/40">
              <BookOpen className="w-3 h-3" />
              <span>{t('Tested Maternal Culinary Formulations', 'Tested Maternal Culinary Formulations')}</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-foreground">
              {t('Evidence-Based Pregnancy Recipes', 'Evidence-Based Pregnancy Recipes')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-muted-foreground">
              {t('Curated for targeted clinical nutrient delivery (folate, bioavailable iron, elemental calcium, and DHA omega-3).', 'Curated for targeted clinical nutrient delivery (folate, bioavailable iron, elemental calcium, and DHA omega-3).')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREGNANCY_RECIPES.map(rawRecipe => {
            const recipe = getLocalizedRecipe(rawRecipe, selectedLanguage);
            return (
              <div
                key={recipe.id}
                className="p-4 bg-[#FAF6EE] dark:bg-muted/40 rounded-2xl border border-stone-200 dark:border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-soft transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/60">
                      {recipe.highlightNutrient}
                    </span>
                    <span className="text-gray-500 dark:text-muted-foreground font-medium">{t(recipe.prepTime, recipe.prepTime)}</span>
                  </div>
                  <h4 className="font-serif font-bold text-gray-900 dark:text-foreground text-sm mt-1">{recipe.title}</h4>
                  <p className="text-[11px] text-gray-600 dark:text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {recipe.clinicalRationale}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-gray-500 dark:text-muted-foreground font-bold mb-1 uppercase tracking-wider">
                    {t('Key Ingredients:', 'Key Ingredients:')}
                  </div>
                  <ul className="text-[11px] text-gray-700 dark:text-gray-300 space-y-0.5 pl-3 list-disc">
                    {recipe.ingredients.slice(0, 3).map((ing: string, i: number) => (
                      <li key={i} className="truncate">{ing}</li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedRecipeId(selectedRecipeId === recipe.id ? null : recipe.id)}
                  className="w-full py-2 bg-white dark:bg-card hover:bg-emerald-700 text-emerald-800 dark:text-emerald-300 hover:text-white rounded-xl border border-emerald-200 dark:border-border hover:border-emerald-700 text-xs font-bold transition-all shadow-xs text-center cursor-pointer"
                >
                  {selectedRecipeId === recipe.id ? t('Close Instructions', 'Close Instructions') : t('View Full Recipe', 'View Full Recipe')}
                </button>

                {/* Expanded Recipe Modal/Drawer */}
                {selectedRecipeId === recipe.id && (
                  <div className="mt-2 p-3 bg-white dark:bg-card rounded-xl border border-stone-200 dark:border-border space-y-2 text-xs">
                    <span className="font-bold text-gray-900 dark:text-foreground block">{t('Preparation Steps:', 'Preparation Steps:')}</span>
                    <ol className="list-decimal pl-4 space-y-1.5 text-gray-700 dark:text-gray-300 text-[11px]">
                      {recipe.instructions.map((step: string, idx: number) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
