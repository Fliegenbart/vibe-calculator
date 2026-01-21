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
  Plane,
  TreePine,
  Repeat,
  Check,
  Star,
  AlertCircle,
  Shield,
  Wrench,
  Calendar,
  Zap,
  Car,
  FileText,
  CircleDollarSign,
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
      <Card variant="bordered" padding="lg" className="h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-vibe-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-vibe-gray-500">Wähle Fahrzeuge aus</h3>
        <p className="text-sm text-vibe-gray-400 mt-2 max-w-xs">
          Passe die Parameter links an, um den Kostenvergleich zu sehen
        </p>
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
        <Card variant="bordered" padding="md" className="overflow-hidden">
          <div className="grid grid-cols-2 gap-4">
            {/* VIBE Price */}
            <div className="text-center p-4 bg-abo-purple/5 rounded-xl border-2 border-abo-purple/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Repeat className="w-4 h-4 text-abo-purple" />
                <span className="text-xs font-semibold text-abo-purple">VIBE Autoabo</span>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <AnimatedNumber
                  value={vibeAbo.totalCostOfOwnership}
                  className="text-2xl font-bold text-abo-purple"
                />
              </motion.div>
              <p className="text-[10px] text-vibe-gray-500 mt-1">Alles inklusive</p>
            </div>

            {/* ICE Price - grows with USPs */}
            <div className="text-center p-4 bg-ice-orange/5 rounded-xl border-2 border-ice-orange/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Fuel className="w-4 h-4 text-ice-orange" />
                <span className="text-xs font-semibold text-ice-orange">Verbrenner-Leasing</span>
              </div>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <AnimatedNumber
                  value={displayIcePrice}
                  duration={800}
                  className="text-2xl font-bold text-ice-orange"
                />
              </motion.div>
              <motion.p
                className="text-[10px] text-ice-orange mt-1"
                animate={{ opacity: visibleUsps > 0 ? 1 : 0.5 }}
              >
                {visibleUsps > 0 ? `+ ${visibleUsps} Extra-Kosten` : 'Nur Leasing-Rate'}
              </motion.p>
            </div>
          </div>

          {/* USP Animation */}
          <div className="mt-4 pt-4 border-t border-vibe-gray-100">
            <p className="text-xs font-semibold text-vibe-gray-500 mb-3">
              Bei VIBE inklusive – beim Leasing extra:
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="mt-4 p-3 bg-gradient-to-r from-abo-purple/10 to-ev-green/10 rounded-xl border border-abo-purple/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-abo-purple fill-current" />
                    <span className="text-sm font-semibold text-vibe-gray-700">
                      Du sparst mit VIBE:
                    </span>
                  </div>
                  <motion.span
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-xl font-bold text-abo-purple"
                  >
                    {formatCurrency(Math.abs(savingsTotal))}
                  </motion.span>
                </div>
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
      <Card variant="bordered" padding="sm">
        <h4 className="text-sm font-medium text-vibe-gray-600 mb-3">Kostenentwicklung</h4>
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
      <Card variant="bordered" padding="sm" className="bg-gradient-to-br from-green-50 to-white">
        <div className="flex items-center gap-2 mb-3">
          <Leaf className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-vibe-gray-600">CO₂-Ersparnis mit E-Auto</span>
        </div>
        <p className="text-2xl font-bold text-green-600 mb-3">
          {formatCO2(co2Savings)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-white/70 rounded-lg">
            <Plane className="w-5 h-5 mx-auto text-blue-500 mb-1" />
            <p className="text-sm font-bold text-vibe-gray-700">{co2SavingsEquivalent.flights}</p>
            <p className="text-[10px] text-vibe-gray-500">Mallorca-Flüge</p>
          </div>
          <div className="p-2 bg-white/70 rounded-lg">
            <TreePine className="w-5 h-5 mx-auto text-green-500 mb-1" />
            <p className="text-sm font-bold text-vibe-gray-700">{co2SavingsEquivalent.trees}</p>
            <p className="text-[10px] text-vibe-gray-500">Bäume/Jahr</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
