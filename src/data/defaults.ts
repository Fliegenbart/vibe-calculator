import { UserProfile, ChargingScenario, EnergyPrices } from '@/types';

// ============================================
// AKTUELLE DURCHSCHNITTSPREISE (Stand: 2024)
// ============================================

export const DEFAULT_ENERGY_PRICES: EnergyPrices = {
  electricity: {
    household: 0.32,      // €/kWh Haushaltsstrom
    publicAC: 0.45,       // €/kWh öffentlich AC
    publicDC: 0.59,       // €/kWh öffentlich DC (Schnellladen)
  },
  fuel: {
    benzin: 1.75,         // €/Liter Super E10
    diesel: 1.65,         // €/Liter Diesel
    e10: 1.72,            // €/Liter E10
  },
  lastUpdated: new Date(),
};

// ============================================
// LADE-SZENARIEN
// ============================================

export const CHARGING_SCENARIOS: Record<string, ChargingScenario> = {
  homeOnly: {
    homeCharging: 1.0,
    workCharging: 0,
    publicACCharging: 0,
    publicDCCharging: 0,
  },
  homePrimary: {
    homeCharging: 0.7,
    workCharging: 0.1,
    publicACCharging: 0.15,
    publicDCCharging: 0.05,
  },
  mixed: {
    homeCharging: 0.4,
    workCharging: 0.2,
    publicACCharging: 0.25,
    publicDCCharging: 0.15,
  },
  publicOnly: {
    homeCharging: 0,
    workCharging: 0.2,
    publicACCharging: 0.5,
    publicDCCharging: 0.3,
  },
};

export const CHARGING_SCENARIO_LABELS: Record<string, { title: string; description: string }> = {
  homeOnly: {
    title: 'Nur Zuhause',
    description: '100% Wallbox – optimal für Eigenheimbesitzer',
  },
  homePrimary: {
    title: 'Hauptsächlich Zuhause',
    description: '70% Wallbox, gelegentlich unterwegs laden',
  },
  mixed: {
    title: 'Gemischt',
    description: '40% Zuhause, 60% öffentlich – für Mieter oder Vielfahrer',
  },
  publicOnly: {
    title: 'Nur öffentlich',
    description: 'Keine Wallbox – Laden an öffentlichen Stationen',
  },
};

// ============================================
// STANDARD USER PROFILE
// ============================================

export const DEFAULT_USER_PROFILE: UserProfile = {
  // Fahrzeugauswahl
  selectedVehicleClass: null,
  evVehicle: null,
  iceVehicle: null,
  useCustomVehicles: false,

  // Nutzungsprofil
  annualMileage: 15000,
  holdingPeriodYears: 5,
  chargingScenario: CHARGING_SCENARIOS.homePrimary,

  // Energiepreise
  electricityPrice: DEFAULT_ENERGY_PRICES.electricity.household,
  homeChargingPrice: DEFAULT_ENERGY_PRICES.electricity.household,
  publicChargingPrice: DEFAULT_ENERGY_PRICES.electricity.publicAC,
  fuelPrice: DEFAULT_ENERGY_PRICES.fuel.benzin,

  // Finanzierung
  financingType: 'cash',
  leasingRate: undefined,
  creditInterestRate: 5.9,
  downPayment: 0,

  // Location
  postalCode: undefined,
  region: undefined,

  // Extras
  hasWallbox: true,
  wallboxCost: 1500,
  hasSolarPanels: false,
  solarSelfConsumptionRate: 0.3,

  // Erweiterter Modus
  isCompanyCar: false,
  taxBracket: 0.35,
  livesInCity: false,
  monthlyParkingCost: 100,
  hasEmployerCharging: false,
  priceForecast: 'moderate',
};

// ============================================
// KOSTENFAKTOREN
// ============================================

export const COST_FACTORS = {
  // Kfz-Steuer (E-Autos bis 2030 befreit)
  evTaxExemptionUntil: 2030,
  
  // Kfz-Steuer Verbrenner (vereinfacht: Hubraum + CO2)
  taxBasePerCcm: 2.0,           // €/100ccm (Benzin)
  taxCO2Base: 95,               // g/km Freibetrag
  taxCO2CostPerGram: 2.0,       // €/g über Freibetrag
  
  // Versicherung (Basiswerte, vereinfacht)
  insuranceBasePerClass: 45,    // € pro Typklasse/Jahr
  insuranceMinimum: 350,        // € Minimum/Jahr
  
  // THG-Quote
  thgQuoteAnnual: 300,          // € Durchschnitt/Jahr
  
  // Wartung (Faktoren relativ zu ICE)
  evMaintenanceFactor: 0.6,     // E-Autos ~40% günstiger
  
  // Wertverlust (% vom Kaufpreis)
  depreciation: {
    year1: 0.25,
    year2: 0.15,
    year3: 0.10,
    year4: 0.08,
    year5: 0.07,
    yearPlus: 0.05,
  },
  
  // EV-spezifischer Wertverlust (etwas höher wegen Batterie-Unsicherheit)
  evDepreciationBonus: 0.02,
  
  // Wallbox
  wallboxInstallationMin: 500,
  wallboxInstallationMax: 2500,
  wallboxDeviceMin: 400,
  wallboxDeviceMax: 2000,
};

// ============================================
// CO2-EQUIVALENTE
// ============================================

export const CO2_EQUIVALENTS = {
  flightMallorca: 500,          // kg CO2 pro Flug (hin und zurück)
  treePerYear: 25,              // kg CO2 pro Baum pro Jahr
  smartphonePerYear: 70,        // kg CO2 pro Jahr Smartphone-Nutzung
  averageCarPerKm: 0.15,        // kg CO2 pro km Durchschnittsauto
};

// ============================================
// UI CONSTRAINTS
// ============================================

export const SLIDER_RANGES = {
  annualMileage: {
    min: 5000,
    max: 50000,
    step: 1000,
    default: 15000,
  },
  holdingPeriod: {
    min: 1,
    max: 10,
    step: 1,
    default: 5,
    options: [3, 5, 8, 10],
  },
  electricityPrice: {
    min: 0.15,
    max: 0.60,
    step: 0.01,
    default: 0.32,
  },
  fuelPrice: {
    min: 1.20,
    max: 2.50,
    step: 0.05,
    default: 1.75,
  },
};

// ============================================
// PREIS-PROGNOSEN (für Szenario-Analyse)
// ============================================

export const PRICE_FORECASTS = {
  conservative: {
    electricityGrowth: 0.02,    // 2% p.a.
    fuelGrowth: 0.03,           // 3% p.a.
  },
  moderate: {
    electricityGrowth: 0.03,    // 3% p.a.
    fuelGrowth: 0.05,           // 5% p.a. (CO2-Steuer)
  },
  aggressive: {
    electricityGrowth: 0.04,    // 4% p.a.
    fuelGrowth: 0.08,           // 8% p.a. (starke CO2-Bepreisung)
  },
};

// ============================================
// VIBE AUTOABO KONFIGURATION
// ============================================

export const VIBE_ABO = {
  // Alle inklusiven Leistungen (vollständige Liste)
  included: [
    { id: 'vehicle', label: 'Fahrzeugkosten & Finanzierung', icon: 'car' },
    { id: 'registration', label: 'Anmeldekosten & Vertragsgebühren', icon: 'file' },
    { id: 'liability', label: 'Haftpflichtversicherung', icon: 'shield' },
    { id: 'kasko', label: 'Vollkaskoversicherung', icon: 'shield' },
    { id: 'tires', label: 'Saisonale Bereifung & Ersatz bei Verschleiß', icon: 'tire' },
    { id: 'tireChange', label: 'Reifenwechsel & Einlagerung', icon: 'wrench' },
    { id: 'maintenance', label: 'Service, Wartung & Verschleißreparaturen', icon: 'tool' },
    { id: 'workshop', label: 'Werkstattorganisation & Schadensmanagement', icon: 'building' },
    { id: 'fines', label: 'Verwaltung von Verkehrsstrafen', icon: 'file' },
    { id: 'km', label: '15.000 Freikilometer pro Jahr', icon: 'route' },
    { id: 'cable', label: 'Typ-2 Ladekabel', icon: 'plug' },
  ],

  // Kompakte Liste für UI (nur Labels)
  includedShort: [
    'Vollkasko & Haftpflicht',
    'Wartung & Service',
    'Reifen & Wechsel',
    'Zulassung & Steuern',
    '15.000 km/Jahr',
    'Typ-2 Ladekabel',
  ],

  // Was zahlt der Kunde zusätzlich?
  excluded: [
    'Strom/Energie',
    'Wallbox (optional)',
  ],

  // Standard-Konditionen
  defaults: {
    includedKmPerMonth: 1250,     // 15.000 km/Jahr
    excessKmRate: 0.20,           // €/km über Limit
    startFee: 199,                // Einmalige Startgebühr
    minDuration: 1,               // Mindestlaufzeit in Monaten
  },

  // Hauptvorteile (Value Propositions)
  benefits: [
    { id: 'flex', label: 'Maximale Flexibilität', description: 'Ab 1 Monat Laufzeit, jederzeit kündbar' },
    { id: 'cost', label: 'Volle Kostenkontrolle', description: 'Ein Preis, alles drin – keine versteckten Kosten' },
    { id: 'risk', label: 'Kein Risiko', description: 'Kein Technologie- und Restwertrisiko' },
    { id: 'simple', label: 'Rundum Sorglos', description: 'Wir kümmern uns um alles' },
  ],

  // Vergleich: Was beim Verbrenner-Leasing EXTRA bezahlt werden muss
  leasingComparison: [
    { item: 'Versicherung (Haftpflicht + Kasko)', vibeIncluded: true, leasingIncluded: false },
    { item: 'Kfz-Steuer', vibeIncluded: true, leasingIncluded: false },
    { item: 'Wartung & Inspektion', vibeIncluded: true, leasingIncluded: false },
    { item: 'Verschleißreparaturen', vibeIncluded: true, leasingIncluded: false },
    { item: 'Reifenwechsel & Einlagerung', vibeIncluded: true, leasingIncluded: false },
    { item: 'Saisonreifen', vibeIncluded: true, leasingIncluded: false },
    { item: 'Zulassungskosten', vibeIncluded: true, leasingIncluded: false },
    { item: 'TÜV / HU', vibeIncluded: true, leasingIncluded: false },
    { item: 'Restwertrisiko', vibeIncluded: true, leasingIncluded: false },
  ],
};
