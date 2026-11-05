/**
 * Pregnancy Calculations Utility
 * Evidence-based clinical gestational timing, due date, and trimester computations
 */

export interface PregnancyTiming {
  gestationalWeek: number;
  gestationalDay: number; // 0 to 6
  month: number;
  trimester: 1 | 2 | 3;
  estimatedDueDate: string; // YYYY-MM-DD
  lastMenstrualPeriod: string; // YYYY-MM-DD
  daysRemaining: number;
  daysElapsed: number;
  progressPercent: number;
}

export function getPregnancyMonth(week: number): number {
  const w = Math.max(1, Math.min(42, Math.round(week)));
  if (w <= 4) return 1;
  if (w <= 8) return 2;
  if (w <= 13) return 3;
  if (w <= 17) return 4;
  if (w <= 21) return 5;
  if (w <= 26) return 6;
  if (w <= 30) return 7;
  if (w <= 35) return 8;
  return 9;
}

export function getPregnancyTrimester(week: number): 1 | 2 | 3 {
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

/**
 * Format a Date object to YYYY-MM-DD in local time
 */
export function formatDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a safe Date object at local midnight
 */
export function parseIsoDate(isoString?: string): Date {
  if (!isoString || typeof isoString !== 'string') return new Date();
  const parts = isoString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(year, month, day);
    if (!isNaN(d.getTime())) return d;
  }
  const parsed = new Date(isoString);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Calculate pregnancy timing from Estimated Due Date (EDD)
 */
export function calculateFromDueDate(eddInput: string): PregnancyTiming {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eddDate = parseIsoDate(eddInput);
  eddDate.setHours(0, 0, 0, 0);

  const diffMs = eddDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // Human pregnancy standard is 280 days (40 weeks) from LMP
  const daysElapsed = Math.max(0, Math.min(280, 280 - daysRemaining));
  const completedWeeks = Math.floor(daysElapsed / 7);
  const gestationalDay = daysElapsed % 7;
  
  // Clinical gestational week is current week (1-indexed, e.g. 24 weeks + 3 days is in Week 25, clamped 1-40)
  const gestationalWeek = Math.max(1, Math.min(40, completedWeeks + (gestationalDay > 0 ? 1 : 0) || 1));

  // Compute LMP: EDD minus 280 days
  const lmpDate = new Date(eddDate);
  lmpDate.setDate(lmpDate.getDate() - 280);

  const month = getPregnancyMonth(gestationalWeek);
  const trimester = getPregnancyTrimester(gestationalWeek);
  const progressPercent = Math.min(100, Math.round((daysElapsed / 280) * 100));

  return {
    gestationalWeek,
    gestationalDay,
    month,
    trimester,
    estimatedDueDate: formatDateToIso(eddDate),
    lastMenstrualPeriod: formatDateToIso(lmpDate),
    daysRemaining,
    daysElapsed,
    progressPercent
  };
}

/**
 * Calculate pregnancy timing from Last Menstrual Period (LMP)
 */
export function calculateFromLmp(lmpInput: string): PregnancyTiming {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lmpDate = parseIsoDate(lmpInput);
  lmpDate.setHours(0, 0, 0, 0);

  // Naegele's rule: EDD = LMP + 280 days
  const eddDate = new Date(lmpDate);
  eddDate.setDate(eddDate.getDate() + 280);

  const diffMs = today.getTime() - lmpDate.getTime();
  const daysElapsed = Math.max(0, Math.min(280, Math.floor(diffMs / (1000 * 60 * 60 * 24))));
  const daysRemaining = Math.max(0, 280 - daysElapsed);

  const completedWeeks = Math.floor(daysElapsed / 7);
  const gestationalDay = daysElapsed % 7;
  const gestationalWeek = Math.max(1, Math.min(40, completedWeeks + (gestationalDay > 0 ? 1 : 0) || 1));

  const month = getPregnancyMonth(gestationalWeek);
  const trimester = getPregnancyTrimester(gestationalWeek);
  const progressPercent = Math.min(100, Math.round((daysElapsed / 280) * 100));

  return {
    gestationalWeek,
    gestationalDay,
    month,
    trimester,
    estimatedDueDate: formatDateToIso(eddDate),
    lastMenstrualPeriod: formatDateToIso(lmpDate),
    daysRemaining,
    daysElapsed,
    progressPercent
  };
}

/**
 * Calculate pregnancy timing from direct Gestational Week input (1 to 40)
 */
export function calculateFromWeek(weekInput: number): PregnancyTiming {
  const week = Math.max(1, Math.min(40, Math.round(weekInput)));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Weeks completed prior to this week
  const daysElapsed = (week - 1) * 7 + 3; // Mid-week point
  const daysRemaining = Math.max(0, 280 - daysElapsed);

  const eddDate = new Date(today);
  eddDate.setDate(today.getDate() + daysRemaining);

  const lmpDate = new Date(today);
  lmpDate.setDate(today.getDate() - daysElapsed);

  const month = getPregnancyMonth(week);
  const trimester = getPregnancyTrimester(week);
  const progressPercent = Math.min(100, Math.round((daysElapsed / 280) * 100));

  return {
    gestationalWeek: week,
    gestationalDay: 3,
    month,
    trimester,
    estimatedDueDate: formatDateToIso(eddDate),
    lastMenstrualPeriod: formatDateToIso(lmpDate),
    daysRemaining,
    daysElapsed,
    progressPercent
  };
}
