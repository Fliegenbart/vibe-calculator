import React, { useMemo } from 'react';
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
  X,
  Star,
  TrendingDown,
  AlertCircle,
  Shield,
  Wrench,
  Calendar,
  Zap,
} from 'lucide-react';
import { VIBE_ABO } from '@/data/defaults';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card } from '@/components/shared';
import { generateChartData } from '@/services/calculator';
import { formatCurrency, formatCO2, cn } from '@/utils';

export const ResultPanel: React.FC = () => {
  const { result, userProfile } = useCalculatorStore();

  const chartData = useMemo(() => {
    if (!result) return [];
    return generateChartData(result).filter((_, i) => i % 6 === 0 || i === 0);
  }, [result]);

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

  const { vibeAbo, iceLeasing, savingsTotal, savingsPerMonth, co2Savings, co2SavingsEquivalent, recommendation } = result;
  const isVibeAboBetter = recommendation === 'vibeAbo';

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      {/* Hero Savings */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`hero-${savingsTotal}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            variant="gradient"
            padding="md"
            className={cn(
              'border-2',
              isVibeAboBetter
                ? 'border-abo-purple/50 bg-gradient-to-br from-abo-purple/5 to-abo-light'
                : 'border-ice-orange/50 bg-gradient-to-br from-ice-orange/5 to-orange-50'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                {isVibeAboBetter ? (
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-abo-purple fill-current" />
                    <span className="text-sm font-semibold text-abo-purple">VIBE Autoabo spart!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-ice-orange" />
                    <span className="text-sm font-semibold text-ice-orange">Verbrenner günstiger</span>
                  </div>
                )}
                <h2 className={cn(
                  "text-3xl font-bold font-display",
                  isVibeAboBetter ? "text-abo-purple" : "text-ice-orange"
                )}>
                  {formatCurrency(Math.abs(savingsTotal))}
                </h2>
                <p className="text-sm text-vibe-gray-500">
                  Ersparnis über {userProfile.holdingPeriodYears} Jahre
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-full",
                isVibeAboBetter ? "bg-abo-purple/10" : "bg-ice-orange/10"
              )}>
                {isVibeAboBetter ? (
                  <Repeat className="w-8 h-8 text-abo-purple" />
                ) : (
                  <Fuel className="w-8 h-8 text-ice-orange" />
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-vibe-gray-200/50 flex justify-between text-sm">
              <span className="text-vibe-gray-500">Pro Monat:</span>
              <span className={cn(
                "font-semibold",
                isVibeAboBetter ? "text-abo-purple" : "text-ice-orange"
              )}>
                {formatCurrency(Math.abs(savingsPerMonth))}
              </span>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* VIBE Value Propositions */}
      <Card variant="bordered" padding="sm" className="bg-gradient-to-r from-abo-purple/5 to-transparent">
        <div className="grid grid-cols-2 gap-2">
          {VIBE_ABO.benefits.map((benefit) => (
            <div key={benefit.id} className="flex items-start gap-2 p-2">
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
            </div>
          ))}
        </div>
      </Card>

      {/* Compact Comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* VIBE Card */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            variant="bordered"
            padding="sm"
            className={cn(
              'border-l-4 border-abo-purple',
              isVibeAboBetter && 'ring-2 ring-abo-purple/20'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-4 h-4 text-abo-purple" />
              <span className="text-xs font-medium text-vibe-gray-500">VIBE Abo</span>
            </div>
            <p className="text-lg font-bold text-abo-purple">
              {formatCurrency(vibeAbo.totalCostOfOwnership)}
            </p>
            <p className="text-xs text-vibe-gray-400 mt-1">
              {formatCurrency(vibeAbo.costPerMonth)}/Monat
            </p>
            {isVibeAboBetter && (
              <div className="mt-2 flex items-center gap-1 text-xs text-abo-purple">
                <Check className="w-3 h-3" />
                <span>Empfohlen</span>
              </div>
            )}
          </Card>
        </motion.div>

        {/* ICE Leasing Card */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            variant="bordered"
            padding="sm"
            className={cn(
              'border-l-4 border-ice-orange',
              !isVibeAboBetter && 'ring-2 ring-ice-orange/20'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="w-4 h-4 text-ice-orange" />
              <span className="text-xs font-medium text-vibe-gray-500">Leasing</span>
            </div>
            <p className="text-lg font-bold text-ice-orange">
              {formatCurrency(iceLeasing.totalCostOfOwnership)}
            </p>
            <p className="text-xs text-vibe-gray-400 mt-1">
              {formatCurrency(iceLeasing.costPerMonth)}/Monat
            </p>
            {!isVibeAboBetter && (
              <div className="mt-2 flex items-center gap-1 text-xs text-ice-orange">
                <Check className="w-3 h-3" />
                <span>Günstiger</span>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* Leistungsvergleich - Was ist inklusive? */}
      <Card variant="bordered" padding="sm">
        <h4 className="text-sm font-semibold text-vibe-gray-700 mb-3">Was ist inklusive?</h4>
        <div className="space-y-2">
          {VIBE_ABO.leasingComparison.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-vibe-gray-100 last:border-0">
              <span className="text-xs text-vibe-gray-600 flex-1">{item.item}</span>
              <div className="flex gap-4 shrink-0">
                <div className="w-16 flex justify-center">
                  {item.vibeIncluded ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-abo-purple/10">
                      <Check className="w-3 h-3 text-abo-purple" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-vibe-gray-100">
                      <X className="w-3 h-3 text-vibe-gray-400" />
                    </span>
                  )}
                </div>
                <div className="w-16 flex justify-center">
                  {item.leasingIncluded ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ev-green/10">
                      <Check className="w-3 h-3 text-ev-green" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-ice-orange/10">
                      <X className="w-3 h-3 text-ice-orange" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-4 mt-2 pt-2 border-t border-vibe-gray-200">
          <span className="text-[10px] text-abo-purple font-medium w-16 text-center">VIBE</span>
          <span className="text-[10px] text-ice-orange font-medium w-16 text-center">Leasing</span>
        </div>
      </Card>

      {/* Cost Details Accordion */}
      <Card variant="bordered" padding="sm">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer list-none py-2">
            <span className="text-sm font-medium text-vibe-gray-600">Kostendetails anzeigen</span>
            <svg className="w-4 h-4 text-vibe-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="pt-3 space-y-4">
            {/* VIBE Details */}
            <div>
              <h4 className="text-xs font-semibold text-abo-purple mb-2">VIBE Autoabo</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-vibe-gray-500">Startgebühr</span>
                  <span>{formatCurrency(vibeAbo.startFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vibe-gray-500">Abo-Raten ({userProfile.holdingPeriodYears * 12} Mon.)</span>
                  <span>{formatCurrency(vibeAbo.totalMonthlyRates)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vibe-gray-500">Stromkosten</span>
                  <span>{formatCurrency(vibeAbo.totalEnergyCost)}</span>
                </div>
                {vibeAbo.excessKmCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-vibe-gray-500">Mehrkilometer</span>
                    <span>{formatCurrency(vibeAbo.excessKmCost)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-vibe-gray-100 font-semibold">
                  <span className="text-abo-purple">Gesamt</span>
                  <span className="text-abo-purple">{formatCurrency(vibeAbo.totalCostOfOwnership)}</span>
                </div>
              </div>
            </div>
            {/* ICE Details */}
            <div className="pt-3 border-t border-vibe-gray-100">
              <h4 className="text-xs font-semibold text-ice-orange mb-2">Verbrenner-Leasing</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-vibe-gray-500">Leasing-Raten ({userProfile.holdingPeriodYears * 12} Mon.)</span>
                  <span>{formatCurrency(iceLeasing.totalMonthlyRates)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vibe-gray-500">Kraftstoff</span>
                  <span>{formatCurrency(iceLeasing.totalFuelCost)}</span>
                </div>
                <div className="flex justify-between text-ice-orange">
                  <span>+ Wartung (extra)</span>
                  <span>{formatCurrency(iceLeasing.totalMaintenanceCost)}</span>
                </div>
                <div className="flex justify-between text-ice-orange">
                  <span>+ Versicherung (extra)</span>
                  <span>{formatCurrency(iceLeasing.totalInsuranceCost)}</span>
                </div>
                <div className="flex justify-between text-ice-orange">
                  <span>+ Kfz-Steuer (extra)</span>
                  <span>{formatCurrency(iceLeasing.totalTaxCost)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-vibe-gray-100 font-semibold">
                  <span className="text-ice-orange">Gesamt</span>
                  <span className="text-ice-orange">{formatCurrency(iceLeasing.totalCostOfOwnership)}</span>
                </div>
              </div>
            </div>
          </div>
        </details>
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

      {/* All-Inclusive Hinweis */}
      <Card variant="bordered" padding="sm" className="bg-abo-purple/5 border-abo-purple/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-abo-purple/10 shrink-0">
            <Star className="w-4 h-4 text-abo-purple fill-current" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-abo-purple mb-1">All-Inclusive mit VIBE</h4>
            <p className="text-xs text-vibe-gray-600 leading-relaxed">
              Deine monatliche Abo-Rate deckt alles ab – ohne versteckte Kosten.
              Wir kümmern uns um alles, du fährst einfach los.
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {VIBE_ABO.includedShort.map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/80 rounded text-[10px] text-vibe-gray-600">
                  <Check className="w-2 h-2 text-abo-purple" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
