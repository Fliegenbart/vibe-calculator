import React from 'react';
import { motion } from 'framer-motion';
import { Gauge, Calendar, BatteryCharging, Home, MapPin } from 'lucide-react';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card, SelectionCard, Button, Slider } from '@/components/shared';
import { CHARGING_SCENARIO_LABELS, CHARGING_SCENARIOS, SLIDER_RANGES } from '@/data/defaults';
import { formatKm } from '@/utils';

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

const chargingIcons: Record<string, React.ReactNode> = {
  homeOnly: <Home className="w-5 h-5" />,
  homePrimary: <Home className="w-5 h-5" />,
  mixed: <BatteryCharging className="w-5 h-5" />,
  publicOnly: <MapPin className="w-5 h-5" />,
};

export const UsageStep: React.FC = () => {
  const {
    userProfile,
    setAnnualMileage,
    setHoldingPeriod,
    setChargingScenarioPreset,
    nextStep,
    prevStep,
  } = useCalculatorStore();

  const { annualMileage, holdingPeriodYears, chargingScenario } = userProfile;

  // Ermittle das aktuelle Preset
  const currentPreset = Object.entries(CHARGING_SCENARIOS).find(
    ([, scenario]) => JSON.stringify(scenario) === JSON.stringify(chargingScenario)
  )?.[0] || 'homePrimary';

  const holdingPeriodOptions = [3, 5, 8, 10];

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
          Wie nutzt du dein Auto?
        </h2>
        <p className="mt-2 text-vibe-gray-500">
          Diese Angaben helfen uns, die Kosten realistisch zu berechnen.
        </p>
      </motion.div>

      {/* Annual Mileage */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-vibe-primary/10">
              <Gauge className="w-5 h-5 text-vibe-primary" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Jährliche Fahrleistung
            </h3>
          </div>

          <Slider
            value={annualMileage}
            onChange={setAnnualMileage}
            min={SLIDER_RANGES.annualMileage.min}
            max={SLIDER_RANGES.annualMileage.max}
            step={SLIDER_RANGES.annualMileage.step}
            formatValue={formatKm}
          />

          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[8000, 12000, 15000, 20000, 30000].map((km) => (
              <button
                key={km}
                onClick={() => setAnnualMileage(km)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                  annualMileage === km
                    ? 'bg-vibe-primary text-vibe-dark font-medium'
                    : 'bg-vibe-gray-100 text-vibe-gray-600 hover:bg-vibe-gray-200'
                }`}
              >
                {formatKm(km)}
              </button>
            ))}
          </div>

          {/* Context Info */}
          <p className="mt-4 text-sm text-vibe-gray-500">
            💡 Der deutsche Durchschnitt liegt bei ca. 13.000 km/Jahr. Pendler fahren oft 15.000–25.000 km.
          </p>
        </Card>
      </motion.div>

      {/* Holding Period */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-vibe-primary/10">
              <Calendar className="w-5 h-5 text-vibe-primary" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Geplante Haltedauer
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {holdingPeriodOptions.map((years) => (
              <button
                key={years}
                onClick={() => setHoldingPeriod(years)}
                className={`py-4 px-2 rounded-xl border-2 transition-all ${
                  holdingPeriodYears === years
                    ? 'border-vibe-primary bg-vibe-light shadow-vibe'
                    : 'border-vibe-gray-200 hover:border-vibe-gray-300'
                }`}
              >
                <div className="text-2xl font-bold text-vibe-secondary">{years}</div>
                <div className="text-xs text-vibe-gray-500 mt-1">Jahre</div>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm text-vibe-gray-500">
            💡 Die durchschnittliche Haltedauer in Deutschland beträgt 5-7 Jahre.
          </p>
        </Card>
      </motion.div>

      {/* Charging Scenario */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-vibe-primary/10">
              <BatteryCharging className="w-5 h-5 text-vibe-primary" />
            </div>
            <h3 className="text-lg font-semibold text-vibe-gray-700">
              Wo lädst du dein E-Auto?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(CHARGING_SCENARIO_LABELS).map(([key, { title, description }]) => (
              <SelectionCard
                key={key}
                title={title}
                description={description}
                icon={chargingIcons[key]}
                isSelected={currentPreset === key}
                onClick={() => setChargingScenarioPreset(key as keyof typeof CHARGING_SCENARIOS)}
              />
            ))}
          </div>

          {/* Visual Breakdown */}
          {chargingScenario && (
            <div className="mt-6 p-4 bg-vibe-gray-50 rounded-xl">
              <p className="text-sm font-medium text-vibe-gray-600 mb-3">Lade-Mix:</p>
              <div className="flex h-4 rounded-full overflow-hidden">
                {chargingScenario.homeCharging > 0 && (
                  <div
                    className="bg-green-400 transition-all"
                    style={{ width: `${chargingScenario.homeCharging * 100}%` }}
                    title={`Zuhause: ${Math.round(chargingScenario.homeCharging * 100)}%`}
                  />
                )}
                {chargingScenario.workCharging > 0 && (
                  <div
                    className="bg-blue-400 transition-all"
                    style={{ width: `${chargingScenario.workCharging * 100}%` }}
                    title={`Arbeit: ${Math.round(chargingScenario.workCharging * 100)}%`}
                  />
                )}
                {chargingScenario.publicACCharging > 0 && (
                  <div
                    className="bg-yellow-400 transition-all"
                    style={{ width: `${chargingScenario.publicACCharging * 100}%` }}
                    title={`Öffentlich AC: ${Math.round(chargingScenario.publicACCharging * 100)}%`}
                  />
                )}
                {chargingScenario.publicDCCharging > 0 && (
                  <div
                    className="bg-orange-400 transition-all"
                    style={{ width: `${chargingScenario.publicDCCharging * 100}%` }}
                    title={`Schnellladen: ${Math.round(chargingScenario.publicDCCharging * 100)}%`}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-400 rounded-full" />
                  Zuhause
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-400 rounded-full" />
                  Arbeit
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                  Öffentlich AC
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-orange-400 rounded-full" />
                  Schnellladen
                </span>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.div variants={itemVariants} className="flex justify-between pt-4">
        <Button variant="ghost" onClick={prevStep}>
          ← Zurück
        </Button>
        <Button size="lg" onClick={nextStep}>
          Weiter zu den Details
        </Button>
      </motion.div>
    </motion.div>
  );
};
