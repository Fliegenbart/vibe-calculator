// ============================================
// VEHICLE TYPES
// ============================================

export type DriveType = 'ev' | 'ice' | 'hybrid' | 'phev';
export type FuelType = 'benzin' | 'diesel' | 'strom' | 'hybrid';
export type VehicleClass = 'kleinwagen' | 'kompakt' | 'mittelklasse' | 'suv' | 'limousine' | 'kombi';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  driveType: DriveType;
  vehicleClass: VehicleClass;

  // Anschaffung
  basePrice: number;
  availableSubsidies: Subsidy[];

  // Verbrauch
  consumption: {
    combined: number;      // kWh/100km oder l/100km
    city: number;
    highway: number;
  };

  // E-Auto spezifisch
  evSpecs?: {
    batteryCapacity: number;     // kWh
    rangeWLTP: number;           // km
    chargingSpeedAC: number;     // kW
    chargingSpeedDC: number;     // kW
    thgQuoteEligible: boolean;
  };

  // Verbrenner spezifisch
  iceSpecs?: {
    engineSize: number;          // ccm
    co2Emissions: number;        // g/km
    fuelType: FuelType;
    tankCapacity: number;        // Liter
  };

  // VIBE Autoabo (nur E-Autos)
  vibeAbo?: {
    monthlyRate: number;         // €/Monat
    includedKmPerMonth: number;  // inkl. km/Monat
    excessKmRate: number;        // €/km über Limit
    startFee: number;            // Einmalige Startgebühr
    minDuration: number;         // Mindestlaufzeit in Monaten
  };

  // Leasing (für Verbrenner)
  leasing?: {
    monthlyRate: number;         // €/Monat
    includedKmPerYear: number;   // inkl. km/Jahr
    excessKmRate: number;        // €/km über Limit
    downPayment: number;         // Anzahlung
    duration: number;            // Laufzeit in Monaten
  };

  // Allgemein
  maintenanceCostPerKm: number;
  insuranceClass: number;
  imageUrl?: string;
}

export interface Subsidy {
  id: string;
  name: string;
  amount: number;
  type: 'federal' | 'state' | 'municipal' | 'manufacturer';
  validUntil?: Date;
  conditions?: string;
  region?: string;
}

// ============================================
// USER INPUT TYPES
// ============================================

export interface UserProfile {
  // Step 1: Fahrzeugauswahl
  selectedVehicleClass: VehicleClass | null;
  evVehicle: Vehicle | null;
  iceVehicle: Vehicle | null;
  useCustomVehicles: boolean;
  
  // Step 2: Nutzungsprofil
  annualMileage: number;              // km/Jahr
  holdingPeriodYears: number;         // Jahre
  chargingScenario: ChargingScenario;
  
  // Step 3: Individuelle Anpassungen
  electricityPrice: number;           // €/kWh
  homeChargingPrice: number;          // €/kWh (oft günstiger)
  publicChargingPrice: number;        // €/kWh
  fuelPrice: number;                  // €/Liter
  
  // Finanzierung
  financingType: 'cash' | 'leasing' | 'credit';
  leasingRate?: number;
  creditInterestRate?: number;
  downPayment?: number;
  
  // Location
  postalCode?: string;
  region?: string;
  
  // Extras
  hasWallbox: boolean;
  wallboxCost: number;
  hasSolarPanels: boolean;
  solarSelfConsumptionRate: number;   // 0-1
}

export interface ChargingScenario {
  homeCharging: number;        // Anteil 0-1
  workCharging: number;        // Anteil 0-1
  publicACCharging: number;    // Anteil 0-1
  publicDCCharging: number;    // Anteil 0-1
}

// ============================================
// CALCULATION TYPES
// ============================================

export interface YearlyCosts {
  year: number;
  
  // Laufende Kosten
  energyCost: number;
  maintenanceCost: number;
  insuranceCost: number;
  taxCost: number;
  
  // Einnahmen (nur EV)
  thgQuoteIncome: number;
  
  // Summen
  totalRunningCosts: number;
  cumulativeCosts: number;
}

export interface TCOResult {
  // Fahrzeug-Info
  vehicleType: DriveType;
  vehicleName: string;
  
  // Anschaffung
  purchasePrice: number;
  subsidies: number;
  netPurchasePrice: number;
  wallboxCost: number;
  
  // Laufende Kosten über Haltedauer
  yearlyCosts: YearlyCosts[];
  totalEnergyCost: number;
  totalMaintenanceCost: number;
  totalInsuranceCost: number;
  totalTaxCost: number;
  totalThgIncome: number;
  
  // Wertverlust
  residualValue: number;
  depreciation: number;
  
  // Gesamtkosten
  totalCostOfOwnership: number;
  costPerKm: number;
  costPerMonth: number;
  
  // CO2
  totalCO2Emissions: number;        // kg
}

// VIBE Autoabo TCO Ergebnis
export interface VibeAboTCOResult {
  vehicleName: string;

  // Kosten
  startFee: number;
  totalMonthlyRates: number;
  totalEnergyCost: number;
  excessKmCost: number;
  wallboxCost: number;

  // Gesamtkosten
  totalCostOfOwnership: number;
  costPerKm: number;
  costPerMonth: number;

  // CO2
  totalCO2Emissions: number;

  // Details für Chart
  monthlyData: {
    month: number;
    cumulative: number;
  }[];
}

// Verbrenner-Leasing TCO Ergebnis
export interface IceLeasingTCOResult {
  vehicleName: string;

  // Kosten
  downPayment: number;
  totalMonthlyRates: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalInsuranceCost: number;
  totalTaxCost: number;
  excessKmCost: number;

  // Gesamtkosten
  totalCostOfOwnership: number;
  costPerKm: number;
  costPerMonth: number;

  // CO2
  totalCO2Emissions: number;

  // Details für Chart
  monthlyData: {
    month: number;
    cumulative: number;
  }[];
}

export interface ComparisonResult {
  // VIBE Autoabo (E-Auto)
  vibeAbo: VibeAboTCOResult;

  // Verbrenner-Leasing
  iceLeasing: IceLeasingTCOResult;

  // Ersparnisse (VIBE Abo vs Verbrenner-Leasing)
  savingsTotal: number;
  savingsPerYear: number;
  savingsPerMonth: number;
  savingsPerKm: number;

  // CO2
  co2Savings: number;               // kg
  co2SavingsEquivalent: CO2Equivalent;

  // Empfehlung
  recommendation: 'vibeAbo' | 'iceLeasing';
  recommendationText: string;
}

export interface CO2Equivalent {
  flights: number;           // Flüge nach Mallorca
  trees: number;             // Bäume für ein Jahr
  smartphones: number;       // Jahre Smartphone-Nutzung
  carKm: number;             // km mit Durchschnittsauto
}

// ============================================
// UI STATE TYPES
// ============================================

export type CalculatorStep = 'vehicle' | 'usage' | 'details' | 'result';

export interface CalculatorState {
  currentStep: CalculatorStep;
  userProfile: UserProfile;
  result: ComparisonResult | null;
  isCalculating: boolean;
  errors: Record<string, string>;
}

// ============================================
// API TYPES
// ============================================

export interface EnergyPrices {
  electricity: {
    household: number;       // €/kWh Haushaltsstrom
    publicAC: number;        // €/kWh öffentlich AC
    publicDC: number;        // €/kWh öffentlich DC (Schnellladen)
  };
  fuel: {
    benzin: number;          // €/Liter
    diesel: number;          // €/Liter
    e10: number;             // €/Liter
  };
  lastUpdated: Date;
}

export interface SubsidyResponse {
  federal: Subsidy[];
  state: Subsidy[];
  municipal: Subsidy[];
  total: number;
}

export interface LicensePlateData {
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  engineSize?: number;
  found: boolean;
}

// ============================================
// CHART TYPES
// ============================================

export interface ChartDataPoint {
  month: number;
  year: number;
  label: string;
  vibeAboCumulative: number;
  iceLeasingCumulative: number;
  vibeAboMonthly: number;
  iceLeasingMonthly: number;
  difference: number;
}

export interface CostBreakdownData {
  category: string;
  vibeAbo: number;
  iceLeasing: number;
  savings: number;
}
