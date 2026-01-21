import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import {
  Fuel,
  Leaf,
  Plane,
  TreePine,
  Share2,
  RefreshCw,
  ArrowRight,
  Repeat,
  Check,
  Star,
} from 'lucide-react';
import { VIBE_ABO } from '@/data/defaults';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card, Button } from '@/components/shared';
import { generateChartData, generateCostBreakdown } from '@/services/calculator';
import { formatCurrency, formatCO2, formatKm, cn } from '@/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
};

export const ResultStep: React.FC = () => {
  const { result, userProfile, reset, prevStep } = useCalculatorStore();

  const chartData = useMemo(() => {
    if (!result) return [];
    // Nur jeden 3. Monat für bessere Lesbarkeit
    return generateChartData(result).filter((_, i) => i % 3 === 0 || i === 0);
  }, [result]);

  const breakdownData = useMemo(() => {
    if (!result) return [];
    return generateCostBreakdown(result);
  }, [result]);

  if (!result) {
    return (
      <div className="text-center py-12">
        <p className="text-vibe-gray-500">Keine Berechnung vorhanden.</p>
        <Button onClick={prevStep} className="mt-4">
          Zurück zur Eingabe
        </Button>
      </div>
    );
  }

  const { vibeAbo, iceLeasing, savingsTotal, co2Savings, co2SavingsEquivalent, recommendation, recommendationText } = result;
  const isVibeAboBetter = recommendation === 'vibeAbo';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Result */}
      <motion.div variants={itemVariants}>
        <Card
          variant="gradient"
          padding="lg"
          className={cn(
            'border-2 text-center',
            isVibeAboBetter
              ? 'border-abo-purple/50 bg-gradient-to-br from-abo-purple/5 to-abo-light'
              : 'border-ice-orange/50'
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            {isVibeAboBetter && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-abo-purple/10 rounded-full mb-4">
                <Star className="w-4 h-4 text-abo-purple fill-current" />
                <span className="text-sm font-semibold text-abo-purple">VIBE Autoabo gewinnt!</span>
              </div>
            )}

            <p className="text-sm font-medium text-vibe-gray-500 uppercase tracking-wider">
              {isVibeAboBetter ? 'Du sparst mit VIBE Autoabo' : 'Verbrenner-Leasing ist günstiger um'}
            </p>

            <div className="mt-4 flex items-center justify-center gap-4">
              {isVibeAboBetter ? (
                <Repeat className="w-12 h-12 text-abo-purple" />
              ) : (
                <Fuel className="w-12 h-12 text-ice-orange" />
              )}
              <div>
                <h2 className={cn(
                  "text-4xl md:text-5xl font-bold font-display",
                  isVibeAboBetter ? "text-abo-purple" : "text-ice-orange"
                )}>
                  {formatCurrency(Math.abs(savingsTotal))}
                </h2>
                <p className="text-lg text-vibe-gray-600">
                  über {userProfile.holdingPeriodYears} Jahre
                </p>
              </div>
            </div>

            {isVibeAboBetter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex flex-wrap justify-center gap-2"
              >
                {VIBE_ABO.benefits.slice(0, 3).map((benefit) => (
                  <span key={benefit.id} className="inline-flex items-center gap-1 px-3 py-1 bg-abo-purple/10 rounded-full text-sm text-abo-purple">
                    <Check className="w-3 h-3" />
                    {benefit.label}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </Card>
      </motion.div>

      {/* Recommendation */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <p className="text-lg text-vibe-gray-700 leading-relaxed">
            {recommendationText}
          </p>
        </Card>
      </motion.div>

      {/* Cost Comparison Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VIBE Autoabo Card */}
        <Card
          variant="elevated"
          padding="lg"
          className={cn(
            'border-l-4 border-abo-purple relative overflow-hidden',
            isVibeAboBetter && 'ring-2 ring-abo-purple/30'
          )}
        >
          {isVibeAboBetter && (
            <div className="absolute top-0 right-0 bg-abo-purple text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
              Empfohlen
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-abo-purple/10">
              <Repeat className="w-5 h-5 text-abo-purple" />
            </div>
            <div>
              <h3 className="font-semibold text-vibe-gray-700">VIBE Autoabo</h3>
              <p className="text-xs text-vibe-gray-500">{vibeAbo.vehicleName} (E-Auto)</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Startgebühr</span>
              <span className="font-medium">{formatCurrency(vibeAbo.startFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Abo-Raten ({userProfile.holdingPeriodYears * 12} Monate)</span>
              <span className="font-medium">{formatCurrency(vibeAbo.totalMonthlyRates)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Stromkosten</span>
              <span className="font-medium">{formatCurrency(vibeAbo.totalEnergyCost)}</span>
            </div>
            {vibeAbo.excessKmCost > 0 && (
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Mehrkilometer</span>
                <span className="font-medium">{formatCurrency(vibeAbo.excessKmCost)}</span>
              </div>
            )}
            {vibeAbo.wallboxCost > 0 && (
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Wallbox</span>
                <span className="font-medium">{formatCurrency(vibeAbo.wallboxCost)}</span>
              </div>
            )}
            <div className="flex justify-between text-abo-purple">
              <span>Wartung, Versicherung, Steuer</span>
              <span className="font-medium">inklusive</span>
            </div>

            <div className="pt-3 mt-3 border-t border-vibe-gray-200 flex justify-between">
              <span className="font-semibold text-vibe-gray-700">Gesamtkosten</span>
              <span className="text-xl font-bold text-abo-purple">
                {formatCurrency(vibeAbo.totalCostOfOwnership)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-abo-purple/5 rounded-lg">
            <p className="text-xs text-vibe-gray-600">
              <span className="font-semibold text-abo-purple">Inklusive: </span>
              {VIBE_ABO.includedShort.slice(0, 4).join(', ')} u.v.m.
            </p>
          </div>
        </Card>

        {/* Verbrenner-Leasing Card */}
        <Card variant="elevated" padding="lg" className="border-l-4 border-ice-orange">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-ice-orange/10">
              <Fuel className="w-5 h-5 text-ice-orange" />
            </div>
            <div>
              <h3 className="font-semibold text-vibe-gray-700">Verbrenner-Leasing</h3>
              <p className="text-xs text-vibe-gray-500">{iceLeasing.vehicleName}</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            {iceLeasing.downPayment > 0 && (
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Anzahlung</span>
                <span className="font-medium">{formatCurrency(iceLeasing.downPayment)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Leasing-Raten ({userProfile.holdingPeriodYears * 12} Monate)</span>
              <span className="font-medium">{formatCurrency(iceLeasing.totalMonthlyRates)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Kraftstoffkosten</span>
              <span className="font-medium">{formatCurrency(iceLeasing.totalFuelCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Wartung & Service</span>
              <span className="font-medium">{formatCurrency(iceLeasing.totalMaintenanceCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Versicherung</span>
              <span className="font-medium">{formatCurrency(iceLeasing.totalInsuranceCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vibe-gray-500">Kfz-Steuer</span>
              <span className="font-medium">{formatCurrency(iceLeasing.totalTaxCost)}</span>
            </div>
            {iceLeasing.excessKmCost > 0 && (
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Mehrkilometer</span>
                <span className="font-medium">{formatCurrency(iceLeasing.excessKmCost)}</span>
              </div>
            )}

            <div className="pt-3 mt-3 border-t border-vibe-gray-200 flex justify-between">
              <span className="font-semibold text-vibe-gray-700">Gesamtkosten</span>
              <span className="text-xl font-bold text-vibe-secondary">
                {formatCurrency(iceLeasing.totalCostOfOwnership)}
              </span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-ice-orange/5 rounded-lg">
            <p className="text-xs text-vibe-gray-600">
              <span className="font-semibold text-ice-orange">Nicht enthalten: </span>
              Wartung, Versicherung, Steuer – muss extra bezahlt werden!
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Timeline Chart */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-vibe-gray-700 mb-6">
            Kostenentwicklung über die Zeit
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8EC" />
                <XAxis
                  dataKey="month"
                  tickFormatter={(m) => m === 0 ? 'Start' : `${Math.floor(m / 12)}J`}
                  stroke="#9999A8"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  stroke="#9999A8"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'vibeAboCumulative' ? 'VIBE Autoabo' : 'Verbrenner-Leasing'
                  ]}
                  labelFormatter={(month) => month === 0 ? 'Startzeitpunkt' : `Monat ${month}`}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="vibeAboCumulative"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={false}
                  name="VIBE Autoabo"
                />
                <Line
                  type="monotone"
                  dataKey="iceLeasingCumulative"
                  stroke="#FF6B35"
                  strokeWidth={3}
                  dot={false}
                  name="Verbrenner-Leasing"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {isVibeAboBetter && (
            <p className="mt-4 text-sm text-abo-purple text-center font-medium">
              Das VIBE Autoabo ist über die gesamte Laufzeit günstiger!
            </p>
          )}
        </Card>
      </motion.div>

      {/* Cost Breakdown Bar Chart */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-vibe-gray-700 mb-6">
            Kostenvergleich nach Kategorie
          </h3>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={breakdownData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8EC" />
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k €`}
                  stroke="#9999A8"
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#9999A8"
                  fontSize={11}
                  width={110}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(Math.abs(value)),
                    name === 'vibeAbo' ? 'VIBE Autoabo' : 'Verbrenner-Leasing'
                  ]}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="vibeAbo" fill="#6366F1" name="VIBE Autoabo" radius={[0, 4, 4, 0]} />
                <Bar dataKey="iceLeasing" fill="#FF6B35" name="Verbrenner-Leasing" radius={[0, 4, 4, 0]} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* CO2 Impact */}
      <motion.div variants={itemVariants}>
        <Card variant="gradient" padding="lg" className="border border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Dein Klimabeitrag mit VIBE Autoabo
            </h3>
          </div>

          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-green-600 font-display">
              {formatCO2(co2Savings)}
            </p>
            <p className="text-vibe-gray-500">weniger CO₂-Emissionen als mit Verbrenner</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <Plane className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-vibe-secondary">
                {co2SavingsEquivalent.flights}
              </p>
              <p className="text-xs text-vibe-gray-500">Flüge nach Mallorca</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <TreePine className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold text-vibe-secondary">
                {co2SavingsEquivalent.trees}
              </p>
              <p className="text-xs text-vibe-gray-500">Bäume für 1 Jahr</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <span className="text-3xl">📱</span>
              <p className="text-2xl font-bold text-vibe-secondary mt-1">
                {co2SavingsEquivalent.smartphones}
              </p>
              <p className="text-xs text-vibe-gray-500">Jahre Smartphone</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-xl">
              <span className="text-3xl">🚗</span>
              <p className="text-2xl font-bold text-vibe-secondary mt-1">
                {formatKm(co2SavingsEquivalent.carKm)}
              </p>
              <p className="text-xs text-vibe-gray-500">Durchschnittsauto</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button variant="outline" onClick={reset} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Neue Berechnung
        </Button>
        <Button variant="secondary" className="gap-2">
          <Share2 className="w-4 h-4" />
          Ergebnis teilen
        </Button>
        <Button size="lg" className="gap-2 bg-abo-purple hover:bg-abo-purple/90">
          VIBE Autoabo anfragen
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={itemVariants}>
        <p className="text-xs text-center text-vibe-gray-400 max-w-2xl mx-auto">
          * Alle Angaben ohne Gewähr. Die Berechnung basiert auf Durchschnittswerten und kann von deinen tatsächlichen Kosten abweichen.
          Leasing-Raten und Abo-Preise sind beispielhafte Kalkulationen. Stand: 2024.
        </p>
      </motion.div>
    </motion.div>
  );
};
