import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  CalculatorState,
  CalculatorStep,
  VehicleClass,
  Vehicle,
  ChargingScenario,
  PriceForecast,
} from '@/types';
import { DEFAULT_USER_PROFILE, CHARGING_SCENARIOS } from '@/data/defaults';
import { getDefaultEVForClass, getDefaultICEForClass } from '@/data/vehicles';
import { calculateComparison } from '@/services/calculator';

interface CalculatorStore extends CalculatorState {
  // Navigation
  setStep: (step: CalculatorStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  // Vehicle Selection
  setVehicleClass: (vehicleClass: VehicleClass) => void;
  setEVVehicle: (vehicle: Vehicle) => void;
  setICEVehicle: (vehicle: Vehicle) => void;
  
  // Usage Profile
  setAnnualMileage: (km: number) => void;
  setHoldingPeriod: (years: number) => void;
  setChargingScenario: (scenario: ChargingScenario) => void;
  setChargingScenarioPreset: (preset: keyof typeof CHARGING_SCENARIOS) => void;
  
  // Details
  setElectricityPrice: (price: number) => void;
  setFuelPrice: (price: number) => void;
  setHasWallbox: (has: boolean) => void;
  setWallboxCost: (cost: number) => void;
  setHasSolarPanels: (has: boolean) => void;
  setSolarSelfConsumptionRate: (rate: number) => void;
  setFinancingType: (type: 'cash' | 'leasing' | 'credit') => void;
  setPostalCode: (code: string) => void;

  // Erweiterter Modus
  setIsCompanyCar: (isCompanyCar: boolean) => void;
  setTaxBracket: (taxBracket: number) => void;
  setLivesInCity: (livesInCity: boolean) => void;
  setMonthlyParkingCost: (cost: number) => void;
  setHasEmployerCharging: (has: boolean) => void;
  setPriceForecast: (forecast: PriceForecast) => void;

  // Calculation
  calculate: () => void;
  
  // Reset
  reset: () => void;
}

const STEPS: CalculatorStep[] = ['vehicle', 'usage', 'details', 'result'];

const initialState: CalculatorState = {
  currentStep: 'vehicle',
  userProfile: DEFAULT_USER_PROFILE,
  result: null,
  isCalculating: false,
  errors: {},
};

export const useCalculatorStore = create<CalculatorStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Navigation
        setStep: (step) => set({ currentStep: step }),
        
        nextStep: () => {
          const { currentStep } = get();
          const currentIndex = STEPS.indexOf(currentStep);
          if (currentIndex < STEPS.length - 1) {
            const nextStep = STEPS[currentIndex + 1];
            
            // Automatisch berechnen wenn wir zum Result gehen
            if (nextStep === 'result') {
              get().calculate();
            }
            
            set({ currentStep: nextStep });
          }
        },
        
        prevStep: () => {
          const { currentStep } = get();
          const currentIndex = STEPS.indexOf(currentStep);
          if (currentIndex > 0) {
            set({ currentStep: STEPS[currentIndex - 1] });
          }
        },

        // Vehicle Selection
        setVehicleClass: (vehicleClass) => {
          const evVehicle = getDefaultEVForClass(vehicleClass) || null;
          const iceVehicle = getDefaultICEForClass(vehicleClass) || null;
          
          set((state) => ({
            userProfile: {
              ...state.userProfile,
              selectedVehicleClass: vehicleClass,
              evVehicle,
              iceVehicle,
            },
          }));
        },
        
        setEVVehicle: (vehicle) =>
          set((state) => ({
            userProfile: { ...state.userProfile, evVehicle: vehicle },
          })),
        
        setICEVehicle: (vehicle) =>
          set((state) => ({
            userProfile: { ...state.userProfile, iceVehicle: vehicle },
          })),

        // Usage Profile
        setAnnualMileage: (km) =>
          set((state) => ({
            userProfile: { ...state.userProfile, annualMileage: km },
          })),
        
        setHoldingPeriod: (years) =>
          set((state) => ({
            userProfile: { ...state.userProfile, holdingPeriodYears: years },
          })),
        
        setChargingScenario: (scenario) =>
          set((state) => ({
            userProfile: { ...state.userProfile, chargingScenario: scenario },
          })),
        
        setChargingScenarioPreset: (preset) =>
          set((state) => ({
            userProfile: {
              ...state.userProfile,
              chargingScenario: CHARGING_SCENARIOS[preset],
            },
          })),

        // Details
        setElectricityPrice: (price) =>
          set((state) => ({
            userProfile: {
              ...state.userProfile,
              electricityPrice: price,
              homeChargingPrice: price,
            },
          })),
        
        setFuelPrice: (price) =>
          set((state) => ({
            userProfile: { ...state.userProfile, fuelPrice: price },
          })),
        
        setHasWallbox: (has) =>
          set((state) => ({
            userProfile: { ...state.userProfile, hasWallbox: has },
          })),
        
        setWallboxCost: (cost) =>
          set((state) => ({
            userProfile: { ...state.userProfile, wallboxCost: cost },
          })),
        
        setHasSolarPanels: (has) =>
          set((state) => ({
            userProfile: { ...state.userProfile, hasSolarPanels: has },
          })),
        
        setSolarSelfConsumptionRate: (rate) =>
          set((state) => ({
            userProfile: { ...state.userProfile, solarSelfConsumptionRate: rate },
          })),
        
        setFinancingType: (type) =>
          set((state) => ({
            userProfile: { ...state.userProfile, financingType: type },
          })),
        
        setPostalCode: (code) =>
          set((state) => ({
            userProfile: { ...state.userProfile, postalCode: code },
          })),

        // Erweiterter Modus
        setIsCompanyCar: (isCompanyCar) =>
          set((state) => ({
            userProfile: { ...state.userProfile, isCompanyCar },
          })),

        setTaxBracket: (taxBracket) =>
          set((state) => ({
            userProfile: { ...state.userProfile, taxBracket },
          })),

        setLivesInCity: (livesInCity) =>
          set((state) => ({
            userProfile: { ...state.userProfile, livesInCity },
          })),

        setMonthlyParkingCost: (monthlyParkingCost) =>
          set((state) => ({
            userProfile: { ...state.userProfile, monthlyParkingCost },
          })),

        setHasEmployerCharging: (hasEmployerCharging) =>
          set((state) => ({
            userProfile: { ...state.userProfile, hasEmployerCharging },
          })),

        setPriceForecast: (priceForecast) =>
          set((state) => ({
            userProfile: { ...state.userProfile, priceForecast },
          })),

        // Calculation
        calculate: () => {
          const { userProfile } = get();
          
          if (!userProfile.evVehicle || !userProfile.iceVehicle) {
            set({ errors: { vehicle: 'Bitte wähle beide Fahrzeuge aus' } });
            return;
          }

          set({ isCalculating: true });

          try {
            const result = calculateComparison(
              userProfile.evVehicle,
              userProfile.iceVehicle,
              userProfile
            );
            
            set({ result, isCalculating: false, errors: {} });
          } catch (error) {
            console.error('Calculation error:', error);
            set({
              isCalculating: false,
              errors: { calculation: 'Fehler bei der Berechnung' },
            });
          }
        },

        // Reset
        reset: () => set(initialState),
      }),
      {
        name: 'tco-calculator-storage',
        partialize: (state) => ({
          userProfile: state.userProfile,
        }),
      }
    ),
    { name: 'TCO-Calculator' }
  )
);

// Selectors
export const useCurrentStep = () => useCalculatorStore((s) => s.currentStep);
export const useUserProfile = () => useCalculatorStore((s) => s.userProfile);
export const useResult = () => useCalculatorStore((s) => s.result);
export const useIsCalculating = () => useCalculatorStore((s) => s.isCalculating);
