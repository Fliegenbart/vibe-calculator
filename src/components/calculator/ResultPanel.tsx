import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Fuel,
  Leaf,
  Repeat,
  Check,
  Shield,
  Wrench,
  Calendar,
  Zap,
  Car,
  FileText,
  CircleDollarSign,
  Settings,
  ClipboardList,
  LifeBuoy,
} from 'lucide-react';
import { VIBE_ABO } from '@/data/defaults';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card } from '@/components/shared';
import { generateChartData } from '@/services/calculator';
import { formatCurrency, formatCO2, cn } from '@/utils';

// Animated number component
const AnimatedNumber: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1500, className }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = Math.round(startValue + (value - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{formatCurrency(displayValue)}</span>;
};

// USP items with estimated costs (per year)
const uspItems = [
  { id: 'insurance', label: 'Versicherung', icon: Shield, costPerYear: 900 },
  { id: 'tax', label: 'Kfz-Steuer', icon: FileText, costPerYear: 200 },
  { id: 'maintenance', label: 'Wartung & Service', icon: Wrench, costPerYear: 450 },
  { id: 'tires', label: 'Reifen & Wechsel', icon: Car, costPerYear: 250 },
  { id: 'tuv', label: 'TÜV / HU', icon: FileText, costPerYear: 75 },
  { id: 'wear', label: 'Verschleißreparaturen', icon: Settings, costPerYear: 300 },
  { id: 'registration', label: 'Zulassung & Anmeldung', icon: ClipboardList, costPerYear: 16 },
  { id: 'roadside', label: 'Pannenhilfe', icon: LifeBuoy, costPerYear: 100 },
  { id: 'km', label: '15.000 km inklusive', icon: CircleDollarSign, costPerYear: 0 },
];

export const ResultPanel: React.FC = () => {
  const { result, userProfile } = useCalculatorStore();
  const [, setAnimationPhase] = useState(0);
  const [visibleUsps, setVisibleUsps] = useState<number>(0);
  const [animationKey, setAnimationKey] = useState(0);

  const chartData = useMemo(() => {
    if (!result) return [];
    return generateChartData(result).filter((_, i) => i % 6 === 0 || i === 0);
  }, [result]);

  // Calculate extra costs for each USP
  const extraCosts = useMemo(() => {
    if (!result) return [];
    const years = userProfile.holdingPeriodYears;
    return uspItems.map(usp => ({
      ...usp,
      totalCost: usp.costPerYear * years,
    }));
  }, [result, userProfile.holdingPeriodYears]);

  // Accumulated extra cost based on visible USPs
  const accumulatedExtraCost = useMemo(() => {
    return extraCosts.slice(0, visibleUsps).reduce((sum, usp) => sum + usp.totalCost, 0);
  }, [extraCosts, visibleUsps]);

  // Reset and start animation when result changes
  useEffect(() => {
    if (result) {
      setAnimationPhase(0);
      setVisibleUsps(0);
      setAnimationKey(prev => prev + 1);

      // Start USP animation sequence
      const timer = setTimeout(() => {
        setAnimationPhase(1);

        // Reveal USPs one by one
        uspItems.forEach((_, index) => {
          setTimeout(() => {
            setVisibleUsps(index + 1);
          }, 400 * (index + 1));
        });
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [result?.vibeAbo.totalCostOfOwnership, result?.iceLeasing.totalCostOfOwnership]);

  if (!result) {
    return (
      <Card variant="bordered" padding="lg" className="h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-vibe-gray-50 to-white">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🚗
        </motion.div>
        <h3 className="text-lg font-bold text-vibe-gray-600">Noch kein Auto gewählt!</h3>
        <p className="text-sm text-vibe-gray-400 mt-2 max-w-xs">
          Pick links deine Rides und wir zeigen dir, wo das Geld bleibt 💸
        </p>
        <motion.div
          className="mt-4 text-2xl"
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          👈
        </motion.div>
      </Card>
    );
  }

  const { vibeAbo, iceLeasing, savingsTotal, co2Savings, co2SavingsEquivalent } = result;

  // Display price for ICE that grows with USPs
  const displayIcePrice = iceLeasing.totalMonthlyRates + accumulatedExtraCost;

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      {/* Animated Price Comparison */}
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="bordered" padding="md" className="overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-abo-purple/5 via-transparent to-ice-orange/5 pointer-events-none" />
          <div className="grid grid-cols-2 gap-4 relative">
            {/* VIBE Price */}
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-abo-purple/10 to-purple-500/5 rounded-2xl border-2 border-abo-purple/40 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-1 right-1 text-lg">✨</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Repeat className="w-4 h-4 text-abo-purple" />
                <span className="text-xs font-bold text-abo-purple">E-Auto Abo 🔋</span>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <AnimatedNumber
                  value={vibeAbo.totalCostOfOwnership}
                  className="text-2xl font-black text-abo-purple"
                />
              </motion.div>
              <p className="text-[10px] text-abo-purple/70 mt-1 font-medium">All-in, chill mal 😎</p>
            </motion.div>

            {/* ICE Price - grows with USPs */}
            <motion.div
              className="text-center p-4 bg-gradient-to-br from-ice-orange/10 to-red-500/5 rounded-2xl border-2 border-ice-orange/40 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-1 right-1 text-lg">💨</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Fuel className="w-4 h-4 text-ice-orange" />
                <span className="text-xs font-bold text-ice-orange">Verbrenner 🦕</span>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="space-y-1"
              >
                {/* Base leasing rate */}
                <p className="text-sm text-vibe-gray-600">
                  {formatCurrency(iceLeasing.totalMonthlyRates)}
                </p>
                {/* Extra costs line */}
                <AnimatePresence>
                  {accumulatedExtraCost > 0 && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-sm text-ice-orange font-semibold"
                    >
                      + {formatCurrency(accumulatedExtraCost)} 😬
                    </motion.p>
                  )}
                </AnimatePresence>
                {/* Total */}
                <div className="pt-1 border-t border-ice-orange/30">
                  <AnimatedNumber
                    value={displayIcePrice}
                    duration={800}
                    className="text-2xl font-black text-ice-orange"
                  />
                </div>
              </motion.div>
              <motion.p
                className="text-[10px] text-ice-orange/70 mt-1 font-medium"
                animate={{ opacity: visibleUsps > 0 ? 1 : 0.5 }}
              >
                {visibleUsps > 0 ? 'Autsch, die Realität 💸' : 'Nur Leasing... wait for it'}
              </motion.p>
            </motion.div>
          </div>

          {/* USP Animation */}
          <div className="mt-4 pt-4 border-t border-vibe-gray-100">
            <p className="text-xs font-bold text-vibe-gray-600 mb-3">
              🎁 Bei uns dabei – beim Dino extra bezahlen:
            </p>
            <div className="space-y-2">
              {uspItems.map((usp, index) => {
                const IconComponent = usp.icon;
                const isVisible = index < visibleUsps;
                const totalCost = extraCosts[index]?.totalCost || 0;

                return (
                  <motion.div
                    key={usp.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{
                      opacity: isVisible ? 1 : 0.3,
                      x: isVisible ? 0 : -20,
                      height: 'auto',
                    }}
                    transition={{ duration: 0.3, delay: isVisible ? 0 : 0 }}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg"
                    style={{
                      backgroundColor: isVisible ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: isVisible ? 1 : 0.5 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className={cn(
                          'p-1 rounded',
                          isVisible ? 'bg-abo-purple/10' : 'bg-vibe-gray-100'
                        )}
                      >
                        <IconComponent className={cn(
                          'w-3 h-3',
                          isVisible ? 'text-abo-purple' : 'text-vibe-gray-400'
                        )} />
                      </motion.div>
                      <span className={cn(
                        'text-xs',
                        isVisible ? 'text-vibe-gray-700 font-medium' : 'text-vibe-gray-400'
                      )}>
                        {usp.label}
                      </span>
                      {isVisible && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-1"
                        >
                          <Check className="w-3 h-3 text-abo-purple" />
                        </motion.div>
                      )}
                    </div>
                    {totalCost > 0 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: isVisible ? 1 : 0,
                          scale: isVisible ? 1 : 0.8,
                        }}
                        className="text-xs font-semibold text-ice-orange"
                      >
                        +{formatCurrency(totalCost)}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Total Savings */}
          <AnimatePresence>
            {visibleUsps === uspItems.length && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="mt-4 p-4 bg-gradient-to-r from-abo-purple via-purple-600 to-pink-500 rounded-2xl shadow-lg shadow-abo-purple/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-2xl"
                    >
                      🎉
                    </motion.span>
                    <span className="text-sm font-bold text-white">
                      Boom! Du sparst:
                    </span>
                  </div>
                  <motion.span
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
                    className="text-2xl font-black text-white drop-shadow-lg"
                  >
                    {formatCurrency(Math.abs(savingsTotal))}
                  </motion.span>
                </div>
                <p className="text-[10px] text-white/70 mt-2 text-center">
                  Das sind {Math.round(Math.abs(savingsTotal) / userProfile.holdingPeriodYears / 12)} € pro Monat mehr für die schönen Dinge 🍕🎮✈️
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* THG-Quote Bonus */}
          <AnimatePresence>
            {visibleUsps === uspItems.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, type: 'spring' }}
                className="mt-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-green-300 rounded-xl relative overflow-hidden"
              >
                <div className="absolute -right-2 -top-2 text-3xl opacity-20">🌱</div>
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">Gratis Geld vom Staat 🤑</span>
                  </div>
                  <span className="text-lg font-black text-green-600">
                    +{formatCurrency(300 * userProfile.holdingPeriodYears)}
                  </span>
                </div>
                <p className="text-[10px] text-green-600/80 mt-1">
                  THG-Quote: Weil du CO₂ sparst, kriegst du Cash 💚
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* VIBE Value Propositions */}
      <Card variant="bordered" padding="sm" className="bg-gradient-to-r from-abo-purple/5 to-transparent">
        <div className="grid grid-cols-2 gap-2">
          {VIBE_ABO.benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="flex items-start gap-2 p-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="p-1 rounded bg-abo-purple/10 shrink-0">
                {benefit.id === 'flex' && <Calendar className="w-3 h-3 text-abo-purple" />}
                {benefit.id === 'cost' && <Zap className="w-3 h-3 text-abo-purple" />}
                {benefit.id === 'risk' && <Shield className="w-3 h-3 text-abo-purple" />}
                {benefit.id === 'simple' && <Wrench className="w-3 h-3 text-abo-purple" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-vibe-gray-700">{benefit.label}</p>
                <p className="text-[10px] text-vibe-gray-500 leading-tight">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card variant="bordered" padding="sm" className="relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-abo-purple/10 to-transparent rounded-full blur-2xl" />
        <h4 className="text-sm font-bold text-vibe-gray-700 mb-3">📈 So läuft's über Zeit</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8EC" />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => m === 0 ? '0' : `${Math.floor(m / 12)}J`}
                stroke="#9999A8"
                fontSize={10}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                stroke="#9999A8"
                fontSize={10}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'vibeAboCumulative' ? 'VIBE' : 'Leasing'
                ]}
                labelFormatter={(month) => `Monat ${month}`}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="vibeAboCumulative"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
                name="VIBE"
              />
              <Line
                type="monotone"
                dataKey="iceLeasingCumulative"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={false}
                name="Leasing"
              />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: '10px' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* CO2 Compact */}
      <Card variant="bordered" padding="sm" className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">🌍</div>
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl"
          >
            🌱
          </motion.span>
          <span className="text-sm font-bold text-green-700">Planet sagt Danke!</span>
        </div>
        <p className="text-2xl font-black text-green-600 mb-3">
          {formatCO2(co2Savings)} weniger CO₂
        </p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <motion.div
            className="p-3 bg-white/80 rounded-xl border border-green-200 cursor-pointer"
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <span className="text-2xl block mb-1">✈️</span>
            <p className="text-lg font-black text-vibe-gray-700">{co2SavingsEquivalent.flights}x</p>
            <p className="text-[10px] text-vibe-gray-500 font-medium">Malle-Trips gespart</p>
          </motion.div>
          <motion.div
            className="p-3 bg-white/80 rounded-xl border border-green-200 cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <span className="text-2xl block mb-1">🌳</span>
            <p className="text-lg font-black text-vibe-gray-700">{co2SavingsEquivalent.trees}</p>
            <p className="text-[10px] text-vibe-gray-500 font-medium">Bäume pro Jahr</p>
          </motion.div>
        </div>
        <p className="text-[10px] text-center text-green-600/70 mt-3">
          Flexen mit gutem Gewissen 💚
        </p>
      </Card>
    </div>
  );
};
