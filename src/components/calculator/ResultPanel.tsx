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
  TreePine,
  Plane,
  Sparkles,
  PartyPopper,
  Building2,
  ParkingCircle,
  Plug,
  TrendingUp,
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

// USP item type
interface UspItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  totalCost: number;
}

export const ResultPanel: React.FC = () => {
  const { result, userProfile } = useCalculatorStore();
  const [, setAnimationPhase] = useState(0);
  const [visibleUsps, setVisibleUsps] = useState<number>(0);
  const [animationKey, setAnimationKey] = useState(0);

  const chartData = useMemo(() => {
    if (!result) return [];
    return generateChartData(result).filter((_, i) => i % 6 === 0 || i === 0);
  }, [result]);

  // Build USP items with REAL calculated costs from the result
  const uspItems: UspItem[] = useMemo(() => {
    if (!result) return [];

    const years = userProfile.holdingPeriodYears;
    const annualKm = userProfile.annualMileage;
    const { iceLeasing } = result;

    const tiresTotal = Math.round(annualKm * years * 0.04);
    const tuvTotal = Math.round((years / 2) * 100);
    const registrationTotal = 80;
    const roadsideTotal = 100 * years;

    return [
      { id: 'fuel', label: 'Benzinkosten', icon: Fuel, totalCost: Math.round(iceLeasing.totalFuelCost) },
      { id: 'insurance', label: 'Versicherung', icon: Shield, totalCost: Math.round(iceLeasing.totalInsuranceCost) },
      { id: 'tax', label: 'Kfz-Steuer', icon: FileText, totalCost: Math.round(iceLeasing.totalTaxCost) },
      { id: 'maintenance', label: 'Wartung & Verschleiß', icon: Wrench, totalCost: Math.round(iceLeasing.totalMaintenanceCost) },
      { id: 'tires', label: 'Reifen & Wechsel', icon: Car, totalCost: tiresTotal },
      { id: 'tuv', label: 'TÜV / HU', icon: Settings, totalCost: tuvTotal },
      { id: 'registration', label: 'Zulassung', icon: ClipboardList, totalCost: registrationTotal },
      { id: 'roadside', label: 'Pannenhilfe', icon: LifeBuoy, totalCost: roadsideTotal },
      { id: 'km', label: `${(annualKm / 1000).toFixed(0)}k km inklusive`, icon: CircleDollarSign, totalCost: 0 },
    ];
  }, [result, userProfile.holdingPeriodYears, userProfile.annualMileage]);

  const accumulatedExtraCost = useMemo(() => {
    return uspItems.slice(0, visibleUsps).reduce((sum, usp) => sum + usp.totalCost, 0);
  }, [uspItems, visibleUsps]);

  useEffect(() => {
    if (result) {
      setAnimationPhase(0);
      setVisibleUsps(0);
      setAnimationKey(prev => prev + 1);

      const timer = setTimeout(() => {
        setAnimationPhase(1);
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
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6"
        >
          🚗
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Wähl erst mal deine Rides!</h3>
        <p className="text-white/50 max-w-xs">
          Pick links deine Autos und wir zeigen dir, wo die Kohle bleibt 💸
        </p>
        <motion.div
          className="mt-6 text-3xl"
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          👈
        </motion.div>
      </Card>
    );
  }

  const { vibeAbo, iceLeasing, savingsTotal, co2Savings, co2SavingsEquivalent } = result;
  const displayIcePrice = iceLeasing.totalMonthlyRates + accumulatedExtraCost;

  return (
    <div className="space-y-6">
      {/* Main Comparison Card */}
      <motion.div
        key={animationKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10 pointer-events-none" />

          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6 relative">
            {/* VIBE Price */}
            <motion.div
              className="text-center p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl border border-purple-500/30 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute top-2 right-2"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 rounded-full mb-3">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-purple-300">E-Auto Abo ⚡</span>
              </div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <AnimatedNumber
                  value={vibeAbo.totalCostOfOwnership}
                  className="text-3xl font-black text-white"
                />
              </motion.div>
              <p className="text-xs text-white/50 mt-2">Gesamtkosten</p>
              <p className="text-xs text-purple-400 mt-1">inkl. {formatCurrency(vibeAbo.totalEnergyCost)} Strom ⚡</p>
            </motion.div>

            {/* ICE Price */}
            <motion.div
              className="text-center p-5 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl border border-orange-500/30 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute top-2 right-2 text-lg">🦕</div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/20 rounded-full mb-3">
                <Fuel className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-300">Verbrenner</span>
              </div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="space-y-1"
              >
                <p className="text-sm text-white/40 line-through">
                  {formatCurrency(iceLeasing.totalMonthlyRates)}
                </p>
                <AnimatePresence>
                  {accumulatedExtraCost > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-orange-400 font-bold"
                    >
                      + {formatCurrency(accumulatedExtraCost)} 😬
                    </motion.p>
                  )}
                </AnimatePresence>
                <AnimatedNumber
                  value={displayIcePrice}
                  duration={800}
                  className="text-3xl font-black text-white"
                />
              </motion.div>
              <p className="text-xs text-white/50 mt-2">
                {visibleUsps > 0 ? 'Reale Kosten 💀' : 'Nur Leasing...'}
              </p>
            </motion.div>
          </div>

          {/* USP List */}
          <div className="border-t border-white/10 pt-5 mb-5 relative">
            <p className="text-sm font-bold text-white/70 mb-4 flex items-center gap-2">
              <span>🎁</span> Diese Kosten kommen beim Dino noch dazu:
            </p>

            <div className="space-y-2">
              {uspItems.map((usp, index) => {
                const IconComponent = usp.icon;
                const isVisible = index < visibleUsps;

                return (
                  <motion.div
                    key={usp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: isVisible ? 1 : 0.3,
                      x: isVisible ? 0 : -20,
                    }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      'flex items-center justify-between py-2.5 px-3 rounded-xl transition-all',
                      isVisible ? 'bg-gradient-to-r from-purple-500/20 to-transparent' : 'bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        isVisible ? 'bg-purple-500/30' : 'bg-white/10'
                      )}>
                        <IconComponent className={cn(
                          'w-4 h-4',
                          isVisible ? 'text-purple-300' : 'text-white/40'
                        )} />
                      </div>
                      <span className={cn(
                        'text-sm',
                        isVisible ? 'text-white font-medium' : 'text-white/40'
                      )}>
                        {usp.label}
                      </span>
                      {isVisible && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <Check className="w-4 h-4 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>
                    {usp.totalCost > 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isVisible ? 1 : 0 }}
                        className="text-sm font-bold text-orange-400"
                      >
                        +{formatCurrency(usp.totalCost)}
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Savings Reveal */}
          <AnimatePresence>
            {visibleUsps === uspItems.length && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="p-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      <PartyPopper className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <p className="text-sm text-white/80 font-bold">BOOM! Du sparst:</p>
                      <p className="text-xs text-white/60">über {userProfile.holdingPeriodYears} Jahre</p>
                    </div>
                  </div>
                  <motion.span
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.4 }}
                    className="text-4xl font-black text-white drop-shadow-lg"
                  >
                    {formatCurrency(Math.abs(savingsTotal))}
                  </motion.span>
                </div>
                <p className="text-sm text-white/70 mt-4 text-center">
                  Das sind {formatCurrency(Math.round(Math.abs(savingsTotal) / userProfile.holdingPeriodYears / 12))} pro Monat mehr für Pizza 🍕
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* THG Quote Bonus */}
          <AnimatePresence>
            {visibleUsps === uspItems.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-xl">🤑</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-yellow-300">Gratis Geld vom Staat!</p>
                      <p className="text-xs text-white/50">THG-Quote für E-Auto Fahrer</p>
                    </div>
                  </div>
                  <span className="text-xl font-black text-yellow-400">
                    +{formatCurrency(300 * userProfile.holdingPeriodYears)}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Advanced Features */}
          <AnimatePresence>
            {visibleUsps === uspItems.length && (userProfile.isCompanyCar || userProfile.livesInCity || userProfile.hasEmployerCharging || userProfile.priceForecast !== 'moderate') && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 space-y-2"
              >
                <p className="text-xs text-white/50 font-medium">🔮 Erweiterte Berechnung aktiv:</p>
                <div className="flex flex-wrap gap-2">
                  {userProfile.isCompanyCar && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full"
                    >
                      <Building2 className="w-3 h-3 text-blue-400" />
                      <span className="text-xs text-blue-300">Firmenwagen</span>
                    </motion.div>
                  )}
                  {userProfile.livesInCity && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full"
                    >
                      <ParkingCircle className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-300">Parkbonus</span>
                    </motion.div>
                  )}
                  {userProfile.hasEmployerCharging && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-full"
                    >
                      <Plug className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-cyan-300">Arbeitgeber-Laden</span>
                    </motion.div>
                  )}
                  {userProfile.priceForecast !== 'moderate' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 border border-orange-500/30 rounded-full"
                    >
                      <TrendingUp className="w-3 h-3 text-orange-400" />
                      <span className="text-xs text-orange-300">
                        {userProfile.priceForecast === 'conservative' ? 'Konservativ' : 'Aggressiv'}
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Benefits Grid */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
        <p className="text-sm font-bold text-white/70 mb-4">💪 Warum VIBE ballert:</p>
        <div className="grid grid-cols-2 gap-3">
          {VIBE_ABO.benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              className="p-3 bg-white/5 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center mb-2">
                {benefit.id === 'flex' && <Calendar className="w-4 h-4 text-purple-300" />}
                {benefit.id === 'cost' && <CircleDollarSign className="w-4 h-4 text-purple-300" />}
                {benefit.id === 'risk' && <Shield className="w-4 h-4 text-purple-300" />}
                {benefit.id === 'simple' && <Repeat className="w-4 h-4 text-purple-300" />}
              </div>
              <p className="text-sm font-bold text-white">{benefit.label}</p>
              <p className="text-xs text-white/50 mt-0.5">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5">
        <p className="text-sm font-bold text-white/70 mb-4">📈 So läuft's über Zeit:</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="month"
                tickFormatter={(m) => m === 0 ? '0' : `${Math.floor(m / 12)}J`}
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                stroke="rgba(255,255,255,0.3)"
                fontSize={11}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'vibeAboCumulative' ? 'E-Auto Abo ⚡' : 'Verbrenner 🦕'
                ]}
                labelFormatter={(month) => `Monat ${month}`}
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(15,15,30,0.95)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  fontSize: '12px',
                  color: 'white',
                }}
              />
              <Line
                type="monotone"
                dataKey="vibeAboCumulative"
                stroke="#A855F7"
                strokeWidth={3}
                dot={false}
                name="E-Auto Abo ⚡"
              />
              <Line
                type="monotone"
                dataKey="iceLeasingCumulative"
                stroke="#F97316"
                strokeWidth={3}
                dot={false}
                name="Verbrenner 🦕"
              />
              <Legend
                iconSize={10}
                wrapperStyle={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* CO2 Impact */}
      <Card className="bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-2xl">🌍</span>
          </motion.div>
          <div>
            <p className="text-sm font-bold text-emerald-300">Planet sagt Danke!</p>
            <p className="text-2xl font-black text-white">{formatCO2(co2Savings)} weniger CO₂</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="p-4 bg-white/10 rounded-xl text-center"
            whileHover={{ scale: 1.05, rotate: -2 }}
          >
            <Plane className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{co2SavingsEquivalent.flights}x</p>
            <p className="text-xs text-white/50">Malle-Trips gespart ✈️</p>
          </motion.div>
          <motion.div
            className="p-4 bg-white/10 rounded-xl text-center"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <TreePine className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{co2SavingsEquivalent.trees}</p>
            <p className="text-xs text-white/50">Bäume pro Jahr 🌳</p>
          </motion.div>
        </div>
      </Card>
    </div>
  );
};
