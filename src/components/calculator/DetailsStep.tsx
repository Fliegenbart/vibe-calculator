import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Fuel, Sun, Plug, Settings } from 'lucide-react';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card, Button, Slider } from '@/components/shared';
import { SLIDER_RANGES, DEFAULT_ENERGY_PRICES } from '@/data/defaults';
import { formatCurrency } from '@/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const DetailsStep: React.FC = () => {
  const {
    userProfile,
    setElectricityPrice,
    setFuelPrice,
    setHasWallbox,
    setWallboxCost,
    setHasSolarPanels,
    setSolarSelfConsumptionRate,
    nextStep,
    prevStep,
  } = useCalculatorStore();

  const {
    electricityPrice,
    fuelPrice,
    hasWallbox,
    wallboxCost,
    hasSolarPanels,
    solarSelfConsumptionRate,
  } = userProfile;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h2 className="text-3xl font-bold text-vibe-secondary font-display">
          Feintuning deiner Berechnung
        </h2>
        <p className="mt-2 text-vibe-gray-500">
          Passe die Werte an deine persönliche Situation an – oder nutze unsere Durchschnittswerte.
        </p>
      </motion.div>

      {/* Energy Prices */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-vibe-primary/10">
              <Settings className="w-5 h-5 text-vibe-primary" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Energiepreise
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Electricity Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-ev-green" />
                <span className="font-medium text-vibe-gray-700">Strompreis (Haushalt)</span>
              </div>
              <Slider
                value={electricityPrice}
                onChange={setElectricityPrice}
                min={SLIDER_RANGES.electricityPrice.min}
                max={SLIDER_RANGES.electricityPrice.max}
                step={SLIDER_RANGES.electricityPrice.step}
                formatValue={(v) => `${(v * 100).toFixed(0)} ct/kWh`}
              />
              <button
                onClick={() => setElectricityPrice(DEFAULT_ENERGY_PRICES.electricity.household)}
                className="text-xs text-vibe-primary hover:underline"
              >
                Aktueller Durchschnitt: {(DEFAULT_ENERGY_PRICES.electricity.household * 100).toFixed(0)} ct/kWh
              </button>
            </div>

            {/* Fuel Price */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Fuel className="w-4 h-4 text-ice-orange" />
                <span className="font-medium text-vibe-gray-700">Benzinpreis (Super E10)</span>
              </div>
              <Slider
                value={fuelPrice}
                onChange={setFuelPrice}
                min={SLIDER_RANGES.fuelPrice.min}
                max={SLIDER_RANGES.fuelPrice.max}
                step={SLIDER_RANGES.fuelPrice.step}
                formatValue={(v) => `${v.toFixed(2)} €/l`}
              />
              <button
                onClick={() => setFuelPrice(DEFAULT_ENERGY_PRICES.fuel.benzin)}
                className="text-xs text-vibe-primary hover:underline"
              >
                Aktueller Durchschnitt: {DEFAULT_ENERGY_PRICES.fuel.benzin.toFixed(2)} €/l
              </button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Wallbox */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-vibe-primary/10">
              <Plug className="w-5 h-5 text-vibe-primary" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Wallbox / Ladestation
            </h3>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-vibe-gray-50 rounded-xl mb-4">
            <div>
              <p className="font-medium text-vibe-gray-700">Wallbox einplanen?</p>
              <p className="text-sm text-vibe-gray-500">
                Kosten für Anschaffung und Installation
              </p>
            </div>
            <button
              onClick={() => setHasWallbox(!hasWallbox)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                hasWallbox ? 'bg-vibe-primary' : 'bg-vibe-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  hasWallbox ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Wallbox Cost Slider */}
          {hasWallbox && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <Slider
                value={wallboxCost}
                onChange={setWallboxCost}
                min={500}
                max={3500}
                step={100}
                label="Gesamtkosten Wallbox"
                formatValue={formatCurrency}
              />
              <div className="flex flex-wrap gap-2">
                {[800, 1200, 1500, 2000, 2500].map((cost) => (
                  <button
                    key={cost}
                    onClick={() => setWallboxCost(cost)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                      wallboxCost === cost
                        ? 'bg-vibe-primary text-vibe-dark font-medium'
                        : 'bg-vibe-gray-100 text-vibe-gray-600 hover:bg-vibe-gray-200'
                    }`}
                  >
                    {formatCurrency(cost)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-vibe-gray-500">
                💡 Typische Kosten: 500–1.500 € Gerät + 500–2.000 € Installation
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Solar Panels */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Photovoltaik
            </h3>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between p-4 bg-vibe-gray-50 rounded-xl mb-4">
            <div>
              <p className="font-medium text-vibe-gray-700">Eigene PV-Anlage?</p>
              <p className="text-sm text-vibe-gray-500">
                Günstiger Solarstrom fürs Laden
              </p>
            </div>
            <button
              onClick={() => setHasSolarPanels(!hasSolarPanels)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                hasSolarPanels ? 'bg-yellow-500' : 'bg-vibe-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  hasSolarPanels ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Solar Self Consumption */}
          {hasSolarPanels && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <Slider
                value={solarSelfConsumptionRate}
                onChange={setSolarSelfConsumptionRate}
                min={0.1}
                max={0.8}
                step={0.05}
                label="Eigenverbrauchsanteil beim Laden"
                formatValue={(v) => `${Math.round(v * 100)}%`}
              />
              <p className="text-sm text-vibe-gray-500">
                💡 Mit intelligenter Wallbox und Batteriespeicher sind 50–80% realistisch.
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Summary Preview */}
      <motion.div variants={itemVariants}>
        <Card variant="gradient" padding="lg" className="border border-vibe-primary/30">
          <h3 className="text-lg font-semibold text-vibe-gray-700 mb-4">
            Deine Einstellungen
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-vibe-gray-500">Strompreis</p>
              <p className="font-semibold">{(electricityPrice * 100).toFixed(0)} ct/kWh</p>
            </div>
            <div>
              <p className="text-vibe-gray-500">Benzinpreis</p>
              <p className="font-semibold">{fuelPrice.toFixed(2)} €/l</p>
            </div>
            <div>
              <p className="text-vibe-gray-500">Wallbox</p>
              <p className="font-semibold">{hasWallbox ? formatCurrency(wallboxCost) : 'Keine'}</p>
            </div>
            <div>
              <p className="text-vibe-gray-500">PV-Anlage</p>
              <p className="font-semibold">
                {hasSolarPanels ? `${Math.round(solarSelfConsumptionRate * 100)}% Eigenverbrauch` : 'Keine'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          ← Zurück
        </Button>
        <Button size="lg" onClick={nextStep}>
          Jetzt berechnen 🚀
        </Button>
      </motion.div>
    </motion.div>
  );
};
