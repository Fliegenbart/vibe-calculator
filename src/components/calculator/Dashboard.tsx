import React, { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { InputPanel } from './InputPanel';
import { ResultPanel } from './ResultPanel';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';

// Confetti component for Easter Egg
const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#6366F1', '#00D4AA', '#FF6B35', '#EC4899', '#F59E0B', '#10B981'][Math.floor(Math.random() * 6)],
    size: Math.random() * 8 + 4,
  }));

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
              animate={{ y: '100vh', opacity: 0, rotate: 720, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, delay: piece.delay, ease: 'easeIn' }}
              className="absolute rounded-sm"
              style={{
                backgroundColor: piece.color,
                left: `${piece.x}%`,
                width: piece.size,
                height: piece.size,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Floating emoji background
const FloatingEmojis: React.FC = () => {
  const emojis = ['⚡', '🚗', '🌱', '💨', '🔋', '🌍'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
          }}
          animate={{
            y: [null, '-100vh'],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { userProfile, calculate, result } = useCalculatorStore();
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
    // Erweiterter Modus
    userProfile.isCompanyCar,
    userProfile.taxBracket,
    userProfile.livesInCity,
    userProfile.monthlyParkingCost,
    userProfile.hasEmployerCharging,
    userProfile.priceForecast,
    debouncedCalculate,
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Effects */}
      <FloatingEmojis />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] pointer-events-none" />

      {/* Confetti Easter Egg */}
      <Confetti show={showConfetti} />

      {/* Easter Egg Message */}
      <AnimatePresence>
        {easterEggMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[101] px-8 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-black rounded-2xl shadow-2xl text-lg"
          >
            {easterEggMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={handleLogoClick}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-2xl">⚡</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="font-black text-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                  VIBE Check
                </span>
                <p className="text-xs text-white/50">Benzin ist so 2010 💅</p>
              </div>
            </motion.div>

            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </motion.div>
                <div className="text-right">
                  <p className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-bold">Du sparst</p>
                  <p className="font-black text-2xl text-emerald-400">
                    {Math.round(Math.abs(result.savingsTotal)).toLocaleString('de-DE')} €
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Side by Side */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Panel */}
          <div className="space-y-6">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-black mb-2">
                <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-400 bg-clip-text text-transparent">
                  Pimp deinen Ride 🚀
                </span>
              </h1>
              <p className="text-white/50">Schieb die Regler, check die Zahlen, mind = blown</p>
            </motion.div>
            <InputPanel />
          </div>

          {/* Right: Result Panel - Sticky on Desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-black mb-2">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Reality Check 📊
                </span>
              </h2>
              <p className="text-white/50">Live & ungeschönt – die Wahrheit tut manchmal weh 💀</p>
            </motion.div>
            <ResultPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 px-6 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.p
            className="text-white/30 text-sm mb-2"
            whileHover={{ scale: 1.02 }}
          >
            Alle Angaben ohne Gewähr. Aber hey, wir haben gerechnet! 🧮
          </motion.p>
          <p className="text-white/20 text-xs">
            Made with 💚 und viel ☕ • VIBE Autoabo • Die Zukunft fährt elektrisch ⚡
          </p>
        </div>
      </footer>
    </div>
  );
};
