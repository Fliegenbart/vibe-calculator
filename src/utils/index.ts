import { clsx, type ClassValue } from 'clsx';

// ============================================
// CLASS NAME UTILITY
// ============================================

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ============================================
// NUMBER FORMATTING
// ============================================

export const formatCurrency = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
};

export const formatCurrencyCompact = (value: number): string => {
  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  }
  return formatCurrency(value);
};

export const formatNumber = (
  value: number,
  decimals: number = 0
): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
};

// ============================================
// DISTANCE/TIME FORMATTING
// ============================================

export const formatKm = (km: number): string => {
  return `${formatNumber(km)} km`;
};

export const formatMonths = (months: number): string => {
  if (months === 0) return 'Sofort';
  if (months < 12) return `${months} Monate`;
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return years === 1 ? '1 Jahr' : `${years} Jahre`;
  }
  
  return `${years} ${years === 1 ? 'Jahr' : 'Jahre'} und ${remainingMonths} ${remainingMonths === 1 ? 'Monat' : 'Monate'}`;
};

// ============================================
// CO2 FORMATTING
// ============================================

export const formatCO2 = (kg: number): string => {
  if (kg >= 1000) {
    return `${formatNumber(kg / 1000, 1)} t CO₂`;
  }
  return `${formatNumber(kg)} kg CO₂`;
};

// ============================================
// ENERGY FORMATTING
// ============================================

export const formatConsumption = (
  value: number,
  type: 'ev' | 'ice'
): string => {
  if (type === 'ev') {
    return `${formatNumber(value, 1)} kWh/100km`;
  }
  return `${formatNumber(value, 1)} l/100km`;
};

// ============================================
// DATE FORMATTING
// ============================================

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// ============================================
// VALIDATION
// ============================================

export const isValidPostalCode = (code: string): boolean => {
  return /^\d{5}$/.test(code);
};

export const isValidLicensePlate = (plate: string): boolean => {
  // Deutsches Kennzeichen: 1-3 Buchstaben, 1-2 Buchstaben, 1-4 Ziffern
  const pattern = /^[A-ZÄÖÜ]{1,3}[-\s]?[A-Z]{1,2}[-\s]?\d{1,4}[EH]?$/i;
  return pattern.test(plate.replace(/\s/g, ''));
};

// ============================================
// MISC HELPERS
// ============================================

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ============================================
// COLOR HELPERS
// ============================================

export const getSavingsColor = (savings: number): string => {
  if (savings > 0) return 'text-saving';
  if (savings < 0) return 'text-cost';
  return 'text-vibe-gray-500';
};

export const getSavingsBackground = (savings: number): string => {
  if (savings > 0) return 'bg-green-50';
  if (savings < 0) return 'bg-red-50';
  return 'bg-gray-50';
};
