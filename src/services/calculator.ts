import {
  Vehicle,
  UserProfile,
  ComparisonResult,
  CO2Equivalent,
  ChartDataPoint,
  CostBreakdownData,
  VibeAboTCOResult,
  IceLeasingTCOResult,
  TCOResult,
  YearlyCosts,
} from '@/types';
import { COST_FACTORS, CO2_EQUIVALENTS, DEFAULT_ENERGY_PRICES } from '@/data/defaults';

// ============================================
// ENERGIEKOSTEN-BERECHNUNG
// ============================================

/**
 * Berechnet die jährlichen Energiekosten für ein E-Auto
 */
export const calculateEVEnergyCost = (
  vehicle: Vehicle,
  profile: UserProfile
): number => {
  if (!vehicle.evSpecs) return 0;

  const annualKWh = (vehicle.consumption.combined / 100) * profile.annualMileage;
  
  // Gewichteter Durchschnittspreis basierend auf Ladeszenarien
  const { chargingScenario } = profile;
  const weightedPrice =
    chargingScenario.homeCharging * profile.homeChargingPrice +
    chargingScenario.workCharging * profile.homeChargingPrice * 0.8 + // Arbeitgeber oft günstiger
    chargingScenario.publicACCharging * profile.publicChargingPrice +
    chargingScenario.publicDCCharging * DEFAULT_ENERGY_PRICES.electricity.publicDC;

  // Solar-Bonus (wenn vorhanden)
  let effectivePrice = weightedPrice;
  if (profile.hasSolarPanels && chargingScenario.homeCharging > 0) {
    const solarSavings = chargingScenario.homeCharging * profile.solarSelfConsumptionRate * 0.20; // ~20ct Ersparnis
    effectivePrice -= solarSavings;
  }

  return annualKWh * effectivePrice;
};

/**
 * Berechnet die jährlichen Kraftstoffkosten für einen Verbrenner
 */
export const calculateICEFuelCost = (
  vehicle: Vehicle,
  profile: UserProfile
): number => {
  if (!vehicle.iceSpecs) return 0;

  const annualLiters = (vehicle.consumption.combined / 100) * profile.annualMileage;
  return annualLiters * profile.fuelPrice;
};

// ============================================
// WARTUNGSKOSTEN
// ============================================

export const calculateMaintenanceCost = (
  vehicle: Vehicle,
  profile: UserProfile
): number => {
  const baseCost = vehicle.maintenanceCostPerKm * profile.annualMileage;
  
  // E-Autos haben niedrigere Wartungskosten
  if (vehicle.driveType === 'ev') {
    return baseCost * COST_FACTORS.evMaintenanceFactor;
  }
  
  return baseCost;
};

// ============================================
// VERSICHERUNG
// ============================================

export const calculateInsuranceCost = (vehicle: Vehicle): number => {
  const baseCost = vehicle.insuranceClass * COST_FACTORS.insuranceBasePerClass;
  return Math.max(baseCost, COST_FACTORS.insuranceMinimum);
};

// ============================================
// KFZ-STEUER
// ============================================

export const calculateTaxCost = (vehicle: Vehicle, year: number): number => {
  // E-Autos sind bis 2030 von der Kfz-Steuer befreit
  if (vehicle.driveType === 'ev' && year <= COST_FACTORS.evTaxExemptionUntil) {
    return 0;
  }

  if (!vehicle.iceSpecs) return 0;

  // Hubraum-Komponente (vereinfacht für Benziner)
  const ccmTax = Math.ceil(vehicle.iceSpecs.engineSize / 100) * COST_FACTORS.taxBasePerCcm;
  
  // CO2-Komponente
  const co2Excess = Math.max(0, vehicle.iceSpecs.co2Emissions - COST_FACTORS.taxCO2Base);
  const co2Tax = co2Excess * COST_FACTORS.taxCO2CostPerGram;

  return ccmTax + co2Tax;
};

// ============================================
// WERTVERLUST
// ============================================

export const calculateDepreciation = (
  vehicle: Vehicle,
  years: number
): { residualValue: number; depreciation: number } => {
  let residualValue = vehicle.basePrice;
  const { depreciation } = COST_FACTORS;

  for (let year = 1; year <= years; year++) {
    let yearlyDepreciation: number;
    
    switch (year) {
      case 1: yearlyDepreciation = depreciation.year1; break;
      case 2: yearlyDepreciation = depreciation.year2; break;
      case 3: yearlyDepreciation = depreciation.year3; break;
      case 4: yearlyDepreciation = depreciation.year4; break;
      case 5: yearlyDepreciation = depreciation.year5; break;
      default: yearlyDepreciation = depreciation.yearPlus;
    }

    // E-Autos haben aktuell noch etwas höheren Wertverlust
    if (vehicle.driveType === 'ev') {
      yearlyDepreciation += COST_FACTORS.evDepreciationBonus;
    }

    residualValue *= (1 - yearlyDepreciation);
  }

  return {
    residualValue: Math.round(residualValue),
    depreciation: vehicle.basePrice - Math.round(residualValue),
  };
};

// ============================================
// THG-QUOTE
// ============================================

export const calculateTHGIncome = (vehicle: Vehicle): number => {
  if (vehicle.driveType === 'ev' && vehicle.evSpecs?.thgQuoteEligible) {
    return COST_FACTORS.thgQuoteAnnual;
  }
  return 0;
};

// ============================================
// FÖRDERUNGEN
// ============================================

export const calculateSubsidies = (vehicle: Vehicle, _postalCode?: string): number => {
  // Basis: Fahrzeug-spezifische Förderungen
  let total = vehicle.availableSubsidies.reduce((sum, s) => sum + s.amount, 0);
  
  // TODO: PLZ-basierte regionale Förderungen abrufen
  // Hier könnte eine API-Abfrage erfolgen
  
  return total;
};

// ============================================
// CO2-EMISSIONEN
// ============================================

export const calculateCO2Emissions = (
  vehicle: Vehicle,
  profile: UserProfile
): number => {
  if (vehicle.driveType === 'ev') {
    // Deutscher Strommix: ~400g CO2/kWh (sinkt)
    const co2PerKWh = 0.4; // kg
    const annualKWh = (vehicle.consumption.combined / 100) * profile.annualMileage;
    
    // Reduktion bei Solar
    const solarReduction = profile.hasSolarPanels 
      ? profile.chargingScenario.homeCharging * profile.solarSelfConsumptionRate 
      : 0;
    
    return annualKWh * co2PerKWh * (1 - solarReduction) * profile.holdingPeriodYears;
  }

  if (vehicle.iceSpecs) {
    const annualCO2 = (vehicle.iceSpecs.co2Emissions / 1000) * profile.annualMileage; // kg
    return annualCO2 * profile.holdingPeriodYears;
  }

  return 0;
};

export const calculateCO2Equivalent = (co2Savings: number): CO2Equivalent => {
  return {
    flights: Math.round(co2Savings / CO2_EQUIVALENTS.flightMallorca * 10) / 10,
    trees: Math.round(co2Savings / CO2_EQUIVALENTS.treePerYear),
    smartphones: Math.round(co2Savings / CO2_EQUIVALENTS.smartphonePerYear * 10) / 10,
    carKm: Math.round(co2Savings / CO2_EQUIVALENTS.averageCarPerKm),
  };
};

// ============================================
// HAUPT-BERECHNUNG: TCO FÜR EIN FAHRZEUG
// ============================================

export const calculateTCO = (
  vehicle: Vehicle,
  profile: UserProfile
): TCOResult => {
  const years = profile.holdingPeriodYears;
  const totalKm = profile.annualMileage * years;
  
  // Anschaffungskosten
  const subsidies = calculateSubsidies(vehicle, profile.postalCode);
  const netPurchasePrice = vehicle.basePrice - subsidies;
  const wallboxCost = vehicle.driveType === 'ev' && profile.hasWallbox 
    ? profile.wallboxCost 
    : 0;

  // Jährliche Kosten berechnen
  const yearlyCosts: YearlyCosts[] = [];
  let cumulativeCosts = netPurchasePrice + wallboxCost;

  for (let year = 1; year <= years; year++) {
    const currentYear = new Date().getFullYear() + year - 1;
    
    const energyCost = vehicle.driveType === 'ev'
      ? calculateEVEnergyCost(vehicle, profile)
      : calculateICEFuelCost(vehicle, profile);
    
    const maintenanceCost = calculateMaintenanceCost(vehicle, profile);
    const insuranceCost = calculateInsuranceCost(vehicle);
    const taxCost = calculateTaxCost(vehicle, currentYear);
    const thgQuoteIncome = calculateTHGIncome(vehicle);

    const totalRunningCosts = energyCost + maintenanceCost + insuranceCost + taxCost - thgQuoteIncome;
    cumulativeCosts += totalRunningCosts;

    yearlyCosts.push({
      year,
      energyCost,
      maintenanceCost,
      insuranceCost,
      taxCost,
      thgQuoteIncome,
      totalRunningCosts,
      cumulativeCosts,
    });
  }

  // Summen
  const totalEnergyCost = yearlyCosts.reduce((sum, y) => sum + y.energyCost, 0);
  const totalMaintenanceCost = yearlyCosts.reduce((sum, y) => sum + y.maintenanceCost, 0);
  const totalInsuranceCost = yearlyCosts.reduce((sum, y) => sum + y.insuranceCost, 0);
  const totalTaxCost = yearlyCosts.reduce((sum, y) => sum + y.taxCost, 0);
  const totalThgIncome = yearlyCosts.reduce((sum, y) => sum + y.thgQuoteIncome, 0);

  // Wertverlust
  const { residualValue, depreciation } = calculateDepreciation(vehicle, years);

  // Gesamtkosten (ohne Doppelzählung Wertverlust)
  const realTCO = cumulativeCosts - residualValue;

  return {
    vehicleType: vehicle.driveType,
    vehicleName: vehicle.name,
    
    purchasePrice: vehicle.basePrice,
    subsidies,
    netPurchasePrice,
    wallboxCost,
    
    yearlyCosts,
    totalEnergyCost,
    totalMaintenanceCost,
    totalInsuranceCost,
    totalTaxCost,
    totalThgIncome,
    
    residualValue,
    depreciation,
    
    totalCostOfOwnership: realTCO,
    costPerKm: realTCO / totalKm,
    costPerMonth: realTCO / (years * 12),
    
    totalCO2Emissions: calculateCO2Emissions(vehicle, profile),
  };
};

// ============================================
// VIBE AUTOABO TCO-BERECHNUNG
// ============================================

export const calculateVibeAboTCO = (
  vehicle: Vehicle,
  profile: UserProfile
): VibeAboTCOResult | null => {
  if (!vehicle.vibeAbo || !vehicle.evSpecs) return null;

  const { vibeAbo } = vehicle;
  const months = profile.holdingPeriodYears * 12;
  const totalKm = profile.annualMileage * profile.holdingPeriodYears;
  const monthlyKm = profile.annualMileage / 12;

  // Startgebühr
  const startFee = vibeAbo.startFee;

  // Monatliche Abo-Raten
  const totalMonthlyRates = vibeAbo.monthlyRate * months;

  // Mehrkilometer berechnen
  const includedKmTotal = vibeAbo.includedKmPerMonth * months;
  const excessKm = Math.max(0, totalKm - includedKmTotal);
  const excessKmCost = excessKm * vibeAbo.excessKmRate;

  // Energiekosten (Strom zahlt der Kunde selbst)
  const totalEnergyCost = calculateEVEnergyCost(vehicle, profile) * profile.holdingPeriodYears;

  // Wallbox (optional, wenn gewünscht)
  const wallboxCost = profile.hasWallbox ? profile.wallboxCost : 0;

  // Gesamtkosten
  const totalCostOfOwnership = startFee + totalMonthlyRates + excessKmCost + totalEnergyCost + wallboxCost;

  // Monatliche Daten für Charts
  const monthlyData: { month: number; cumulative: number }[] = [];
  let cumulative = startFee + wallboxCost;

  for (let m = 1; m <= months; m++) {
    const monthlyEnergy = totalEnergyCost / months;
    const monthlyExcessKm = monthlyKm > vibeAbo.includedKmPerMonth
      ? (monthlyKm - vibeAbo.includedKmPerMonth) * vibeAbo.excessKmRate
      : 0;
    cumulative += vibeAbo.monthlyRate + monthlyEnergy + monthlyExcessKm;

    monthlyData.push({
      month: m,
      cumulative: Math.round(cumulative),
    });
  }

  // CO2-Emissionen (gleich wie beim EV-Kauf)
  const totalCO2Emissions = calculateCO2Emissions(vehicle, profile);

  return {
    vehicleName: vehicle.name,
    startFee,
    totalMonthlyRates,
    totalEnergyCost,
    excessKmCost,
    wallboxCost,
    totalCostOfOwnership,
    costPerKm: totalCostOfOwnership / totalKm,
    costPerMonth: totalCostOfOwnership / months,
    totalCO2Emissions,
    monthlyData,
  };
};

// ============================================
// VERBRENNER-LEASING TCO-BERECHNUNG
// ============================================

export const calculateIceLeasingTCO = (
  vehicle: Vehicle,
  profile: UserProfile
): IceLeasingTCOResult | null => {
  if (!vehicle.leasing || !vehicle.iceSpecs) return null;

  const { leasing } = vehicle;
  const months = profile.holdingPeriodYears * 12;
  const totalKm = profile.annualMileage * profile.holdingPeriodYears;

  // Anzahlung
  const downPayment = leasing.downPayment;

  // Monatliche Leasing-Raten
  const totalMonthlyRates = leasing.monthlyRate * months;

  // Mehrkilometer berechnen
  const includedKmTotal = leasing.includedKmPerYear * profile.holdingPeriodYears;
  const excessKm = Math.max(0, totalKm - includedKmTotal);
  const excessKmCost = excessKm * leasing.excessKmRate;

  // Kraftstoffkosten
  const totalFuelCost = calculateICEFuelCost(vehicle, profile) * profile.holdingPeriodYears;

  // Wartungskosten (muss der Kunde selbst zahlen beim Leasing)
  const totalMaintenanceCost = calculateMaintenanceCost(vehicle, profile) * profile.holdingPeriodYears;

  // Versicherung (muss der Kunde selbst zahlen beim Leasing)
  const totalInsuranceCost = calculateInsuranceCost(vehicle) * profile.holdingPeriodYears;

  // Kfz-Steuer (muss der Kunde selbst zahlen beim Leasing)
  let totalTaxCost = 0;
  for (let year = 1; year <= profile.holdingPeriodYears; year++) {
    const currentYear = new Date().getFullYear() + year - 1;
    totalTaxCost += calculateTaxCost(vehicle, currentYear);
  }

  // Gesamtkosten
  const totalCostOfOwnership =
    downPayment +
    totalMonthlyRates +
    excessKmCost +
    totalFuelCost +
    totalMaintenanceCost +
    totalInsuranceCost +
    totalTaxCost;

  // Monatliche Daten für Charts
  const monthlyData: { month: number; cumulative: number }[] = [];
  let cumulative = downPayment;

  const monthlyFuel = totalFuelCost / months;
  const monthlyMaintenance = totalMaintenanceCost / months;
  const monthlyInsurance = totalInsuranceCost / months;
  const monthlyTax = totalTaxCost / months;
  const monthlyExcessKm = excessKmCost / months;

  for (let m = 1; m <= months; m++) {
    cumulative +=
      leasing.monthlyRate +
      monthlyFuel +
      monthlyMaintenance +
      monthlyInsurance +
      monthlyTax +
      monthlyExcessKm;

    monthlyData.push({
      month: m,
      cumulative: Math.round(cumulative),
    });
  }

  // CO2-Emissionen
  const totalCO2Emissions = calculateCO2Emissions(vehicle, profile);

  return {
    vehicleName: vehicle.name,
    downPayment,
    totalMonthlyRates,
    totalFuelCost,
    totalMaintenanceCost,
    totalInsuranceCost,
    totalTaxCost,
    excessKmCost,
    totalCostOfOwnership,
    costPerKm: totalCostOfOwnership / totalKm,
    costPerMonth: totalCostOfOwnership / months,
    totalCO2Emissions,
    monthlyData,
  };
};

// ============================================
// VERGLEICHS-BERECHNUNG (VIBE Abo vs Verbrenner-Leasing)
// ============================================

export const calculateComparison = (
  evVehicle: Vehicle,
  iceVehicle: Vehicle,
  profile: UserProfile
): ComparisonResult | null => {
  // VIBE Autoabo berechnen
  const vibeAbo = calculateVibeAboTCO(evVehicle, profile);
  if (!vibeAbo) return null;

  // Verbrenner-Leasing berechnen
  const iceLeasing = calculateIceLeasingTCO(iceVehicle, profile);
  if (!iceLeasing) return null;

  const totalKm = profile.annualMileage * profile.holdingPeriodYears;

  // Ersparnisse (positiv = VIBE Abo günstiger)
  const savingsTotal = iceLeasing.totalCostOfOwnership - vibeAbo.totalCostOfOwnership;
  const savingsPerYear = savingsTotal / profile.holdingPeriodYears;
  const savingsPerMonth = savingsTotal / (profile.holdingPeriodYears * 12);
  const savingsPerKm = savingsTotal / totalKm;

  // CO2-Ersparnis
  const co2Savings = iceLeasing.totalCO2Emissions - vibeAbo.totalCO2Emissions;

  // Empfehlung
  let recommendation: 'vibeAbo' | 'iceLeasing';
  let recommendationText: string;

  if (savingsTotal > 0) {
    recommendation = 'vibeAbo';
    recommendationText = `Mit dem VIBE Autoabo sparst du über ${profile.holdingPeriodYears} Jahre ${Math.round(savingsTotal).toLocaleString('de-DE')} € gegenüber dem Verbrenner-Leasing – und das mit Rundum-Sorglos-Paket, maximaler Flexibilität und null Emissionen!`;
  } else {
    recommendation = 'iceLeasing';
    recommendationText = `Das Verbrenner-Leasing ist ${Math.round(Math.abs(savingsTotal)).toLocaleString('de-DE')} € günstiger. Aber: Beim VIBE Autoabo sind Versicherung, Wartung und Steuer bereits inklusive – und du fährst emissionsfrei!`;
  }

  return {
    vibeAbo,
    iceLeasing,
    savingsTotal,
    savingsPerYear,
    savingsPerMonth,
    savingsPerKm,
    co2Savings,
    co2SavingsEquivalent: calculateCO2Equivalent(co2Savings),
    recommendation,
    recommendationText,
  };
};

// ============================================
// CHART-DATEN GENERIERUNG
// ============================================

export const generateChartData = (result: ComparisonResult): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const { vibeAbo, iceLeasing } = result;

  // Initial point (Start)
  data.push({
    month: 0,
    year: 0,
    label: 'Start',
    vibeAboCumulative: vibeAbo.startFee + vibeAbo.wallboxCost,
    iceLeasingCumulative: iceLeasing.downPayment,
    vibeAboMonthly: 0,
    iceLeasingMonthly: 0,
    difference: (vibeAbo.startFee + vibeAbo.wallboxCost) - iceLeasing.downPayment,
  });

  // Monatliche Datenpunkte
  const months = vibeAbo.monthlyData.length;
  for (let m = 1; m <= months; m++) {
    const vibeAboData = vibeAbo.monthlyData[m - 1];
    const iceLeasingData = iceLeasing.monthlyData[m - 1];

    data.push({
      month: m,
      year: Math.ceil(m / 12),
      label: `Jahr ${Math.ceil(m / 12)}, Monat ${((m - 1) % 12) + 1}`,
      vibeAboCumulative: vibeAboData.cumulative,
      iceLeasingCumulative: iceLeasingData.cumulative,
      vibeAboMonthly: Math.round(vibeAbo.costPerMonth),
      iceLeasingMonthly: Math.round(iceLeasing.costPerMonth),
      difference: vibeAboData.cumulative - iceLeasingData.cumulative,
    });
  }

  return data;
};

export const generateCostBreakdown = (result: ComparisonResult): CostBreakdownData[] => {
  const { vibeAbo, iceLeasing } = result;

  return [
    {
      category: 'Leasing-/Abo-Raten',
      vibeAbo: vibeAbo.startFee + vibeAbo.totalMonthlyRates,
      iceLeasing: iceLeasing.downPayment + iceLeasing.totalMonthlyRates,
      savings: (iceLeasing.downPayment + iceLeasing.totalMonthlyRates) - (vibeAbo.startFee + vibeAbo.totalMonthlyRates),
    },
    {
      category: 'Energie/Kraftstoff',
      vibeAbo: vibeAbo.totalEnergyCost,
      iceLeasing: iceLeasing.totalFuelCost,
      savings: iceLeasing.totalFuelCost - vibeAbo.totalEnergyCost,
    },
    {
      category: 'Wartung',
      vibeAbo: 0, // Im VIBE Abo enthalten
      iceLeasing: iceLeasing.totalMaintenanceCost,
      savings: iceLeasing.totalMaintenanceCost,
    },
    {
      category: 'Versicherung',
      vibeAbo: 0, // Im VIBE Abo enthalten
      iceLeasing: iceLeasing.totalInsuranceCost,
      savings: iceLeasing.totalInsuranceCost,
    },
    {
      category: 'Kfz-Steuer',
      vibeAbo: 0, // Im VIBE Abo enthalten
      iceLeasing: iceLeasing.totalTaxCost,
      savings: iceLeasing.totalTaxCost,
    },
    {
      category: 'Mehrkilometer',
      vibeAbo: vibeAbo.excessKmCost,
      iceLeasing: iceLeasing.excessKmCost,
      savings: iceLeasing.excessKmCost - vibeAbo.excessKmCost,
    },
    {
      category: 'Wallbox (optional)',
      vibeAbo: vibeAbo.wallboxCost,
      iceLeasing: 0,
      savings: -vibeAbo.wallboxCost,
    },
  ];
};
