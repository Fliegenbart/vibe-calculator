import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';

// Confetti component for Easter Egg
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#6366F1', '#00D4AA', '#FF6B35', '#EC4899', '#F59E0B'][Math.floor(Math.random() * 5)],
  }));

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: '100vh', opacity: 0, rotate: 720 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, delay: piece.delay, ease: 'easeIn' }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: piece.color, left: `${piece.x}%` }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export const Dashboard: React.FC = () => {
  const { userProfile, calculate } = useCalculatorStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState<string | null>(null);

  // Easter Egg: Click logo 5 times
  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);

    if (newClicks === 5) {
      setShowConfetti(true);
      setEasterEggMessage('🎉 Du hast das Easter Egg gefunden! Elektrisierend! ⚡');
      setTimeout(() => {
        setShowConfetti(false);
        setEasterEggMessage(null);
        setLogoClicks(0);
      }, 4000);
    }
  };

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
      {/* Confetti Easter Egg */}
      <Confetti show={showConfetti} />

      {/* Easter Egg Message */}
      <AnimatePresence>
        {easterEggMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[101] px-6 py-3 bg-gradient-to-r from-abo-purple to-pink-500 text-white font-bold rounded-full shadow-xl"
          >
            {easterEggMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gradient-to-r from-vibe-secondary via-purple-900 to-vibe-secondary backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-vibe-primary via-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-vibe-primary/30 cursor-pointer select-none"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
                onClick={handleLogoClick}
              >
                <span className="text-white font-black text-xl">⚡</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-black text-white font-display tracking-tight">
                  Benzin? Cringe. 🙅
                </h1>
                <p className="text-xs text-white/60">
                  Check mal, wie viel du mit E sparst
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <motion.span
                className="px-4 py-1.5 bg-gradient-to-r from-vibe-primary to-emerald-400 text-vibe-secondary rounded-full text-xs font-bold shadow-lg shadow-vibe-primary/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔴 LIVE
              </motion.span>
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
      <footer className="mt-12 border-t border-vibe-gray-200 bg-gradient-to-r from-vibe-gray-50 via-white to-vibe-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-xs text-center text-vibe-gray-400">
            * Keine Finanzberatung, nur Mathe. Die Zahlen sind so ehrlich wie dein Tankwart. 😏
          </p>
          <p className="text-[10px] text-center text-vibe-gray-300 mt-2">
            Made with 💚 für die Umwelt • VIBE Autoabo
          </p>
        </div>
      </footer>
    </div>
  );
};
