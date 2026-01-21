import React, { useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';

export const Dashboard: React.FC = () => {
  const { userProfile, calculate } = useCalculatorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-calculate on any profile change (debounced)
  const debouncedCalculate = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (userProfile.evVehicle && userProfile.iceVehicle) {
        calculate();
      }
    }, 300);
  }, [userProfile, calculate]);

  useEffect(() => {
    debouncedCalculate();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    userProfile.evVehicle?.id,
    userProfile.iceVehicle?.id,
    userProfile.annualMileage,
    userProfile.holdingPeriodYears,
    userProfile.chargingScenario,
    userProfile.electricityPrice,
    userProfile.fuelPrice,
    userProfile.hasWallbox,
    userProfile.wallboxCost,
    userProfile.hasSolarPanels,
    userProfile.solarSelfConsumptionRate,
    debouncedCalculate,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vibe-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-vibe-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-vibe-primary to-vibe-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-vibe-secondary font-display">
                  TCO-Rechner
                </h1>
                <p className="text-xs text-vibe-gray-500">
                  VIBE Autoabo vs. Verbrenner-Leasing
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-vibe-gray-500">
              <span className="px-3 py-1 bg-vibe-primary/10 text-vibe-primary rounded-full text-xs font-medium">
                Live-Berechnung
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split View */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 xl:col-span-4"
          >
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin">
              <InputPanel />
            </div>
          </motion.div>

          {/* Right Panel - Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 xl:col-span-8"
          >
            <ResultPanel />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-vibe-gray-100 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-xs text-center text-vibe-gray-400">
            * Alle Angaben ohne Gewähr. Die Berechnung basiert auf Durchschnittswerten und kann von tatsächlichen Kosten abweichen.
          </p>
        </div>
      </footer>
    </div>
  );
};
