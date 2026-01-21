import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Fuel, Check, Star, AlertTriangle } from 'lucide-react';
import { Card, Select, Slider, Toggle, Section } from '@/components/shared';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { electricVehicles, iceVehicles } from '@/data/vehicles';
import { SLIDER_RANGES } from '@/data/defaults';
import { formatCurrency, formatKm } from '@/utils';
import { ChargingScenario } from '@/types';

const chargingPresets: { id: string; label: string; scenario: ChargingScenario }[] = [
  {
    id: 'homeOnly',
    label: 'Nur Zuhause',
    scenario: { homeCharging: 1.0, workCharging: 0, publicACCharging: 0, publicDCCharging: 0 },
  },
  {
    id: 'homePrimary',
    label: 'Hauptsächlich Zuhause',
    scenario: { homeCharging: 0.7, workCharging: 0.1, publicACCharging: 0.15, publicDCCharging: 0.05 },
  },
  {
    id: 'mixed',
    label: 'Gemischt',
    scenario: { homeCharging: 0.4, workCharging: 0.2, publicACCharging: 0.25, publicDCCharging: 0.15 },
  },
  {
    id: 'publicPrimary',
    label: 'Viel Unterwegs',
    scenario: { homeCharging: 0.1, workCharging: 0.1, publicACCharging: 0.4, publicDCCharging: 0.4 },
  },
];

export const InputPanel: React.FC = () => {
  const {
    userProfile,
    setEVVehicle,
    setICEVehicle,
    setAnnualMileage,
    setHoldingPeriod,
    setChargingScenario,
    setElectricityPrice,
    setFuelPrice,
    setHasWallbox,
    setWallboxCost,
    setHasSolarPanels,
    setSolarSelfConsumptionRate,
  } = useCalculatorStore();

  const evOptions = electricVehicles.map((v) => ({
    value: v.id,
    label: `${v.name} (${v.vibeAbo?.monthlyRate ?? 0} €/Monat)`,
  }));

  const iceOptions = iceVehicles.map((v) => ({
    value: v.id,
    label: `${v.name} (${v.leasing?.monthlyRate ?? 0} €/Monat)`,
  }));

  const selectedChargingPreset = chargingPresets.find(
    (p) =>
      p.scenario.homeCharging === userProfile.chargingScenario.homeCharging &&
      p.scenario.publicDCCharging === userProfile.chargingScenario.publicDCCharging
  )?.id || 'custom';

  return (
    <div className="space-y-6">
      {/* Fahrzeugauswahl */}
      <Card variant="bordered" padding="md">
        <Section title="Fahrzeuge vergleichen">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-abo-light rounded-lg">
                <Zap className="w-5 h-5 text-abo-purple" />
              </div>
              <div className="flex-1">
                <Select
                  label="E-Auto (VIBE Autoabo)"
                  value={userProfile.evVehicle?.id || ''}
                  onChange={(id) => {
                    const vehicle = electricVehicles.find((v) => v.id === id);
                    if (vehicle) setEVVehicle(vehicle);
                  }}
                  options={evOptions}
                />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Fuel className="w-5 h-5 text-ice-orange" />
              </div>
              <div className="flex-1">
                <Select
                  label="Verbrenner (Leasing)"
                  value={userProfile.iceVehicle?.id || ''}
                  onChange={(id) => {
                    const vehicle = iceVehicles.find((v) => v.id === id);
                    if (vehicle) setICEVehicle(vehicle);
                  }}
                  options={iceOptions}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* VIBE All-Inclusive Info */}
        <div className="mt-4 p-3 bg-abo-purple/5 border border-abo-purple/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-abo-purple fill-current" />
            <span className="text-xs font-semibold text-abo-purple">VIBE All-Inclusive</span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> Vollkasko & Haftpflicht
            </span>
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> Kfz-Steuer
            </span>
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> Wartung & Service
            </span>
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> TÜV / HU
            </span>
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> Reifen & Wechsel
            </span>
            <span className="text-[10px] text-vibe-gray-600 flex items-center gap-1">
              <Check className="w-2.5 h-2.5 text-abo-purple shrink-0" /> 15.000 km/Jahr
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-abo-purple/10">
            <div className="flex items-start gap-1.5 text-[10px] text-ice-orange">
              <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>Beim Verbrenner-Leasing: Versicherung, Steuer, Wartung, Reifen extra!</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Nutzungsprofil */}
      <Card variant="bordered" padding="md">
        <Section title="Nutzungsprofil">
          <Slider
            label="Jahreskilometer"
            value={userProfile.annualMileage}
            onChange={setAnnualMileage}
            min={SLIDER_RANGES.annualMileage.min}
            max={SLIDER_RANGES.annualMileage.max}
            step={SLIDER_RANGES.annualMileage.step}
            formatValue={(v) => formatKm(v)}
          />
          <Slider
            label="Haltedauer"
            value={userProfile.holdingPeriodYears}
            onChange={setHoldingPeriod}
            min={1}
            max={10}
            step={1}
            formatValue={(v) => `${v} Jahre`}
          />
        </Section>
      </Card>

      {/* Ladeszenarien */}
      <Card variant="bordered" padding="md">
        <Section title="Ladeszenario">
          <div className="grid grid-cols-2 gap-2">
            {chargingPresets.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setChargingScenario(preset.scenario)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedChargingPreset === preset.id
                    ? 'bg-vibe-primary text-vibe-dark'
                    : 'bg-vibe-gray-100 text-vibe-gray-600 hover:bg-vibe-gray-200'
                }`}
              >
                {preset.label}
              </motion.button>
            ))}
          </div>
          <div className="mt-4 p-3 bg-vibe-gray-50 rounded-lg">
            <div className="flex justify-between text-xs text-vibe-gray-600 mb-2">
              <span>Ladeverteilung</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden">
              <div
                className="bg-ev-green transition-all"
                style={{ width: `${userProfile.chargingScenario.homeCharging * 100}%` }}
                title={`Zuhause: ${Math.round(userProfile.chargingScenario.homeCharging * 100)}%`}
              />
              <div
                className="bg-blue-400 transition-all"
                style={{ width: `${userProfile.chargingScenario.workCharging * 100}%` }}
                title={`Arbeit: ${Math.round(userProfile.chargingScenario.workCharging * 100)}%`}
              />
              <div
                className="bg-yellow-400 transition-all"
                style={{ width: `${userProfile.chargingScenario.publicACCharging * 100}%` }}
                title={`Öffentlich AC: ${Math.round(userProfile.chargingScenario.publicACCharging * 100)}%`}
              />
              <div
                className="bg-orange-500 transition-all"
                style={{ width: `${userProfile.chargingScenario.publicDCCharging * 100}%` }}
                title={`Schnellladen: ${Math.round(userProfile.chargingScenario.publicDCCharging * 100)}%`}
              />
            </div>
            <div className="flex justify-between text-xs text-vibe-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-ev-green" /> Zuhause
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" /> Arbeit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400" /> AC
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> DC
              </span>
            </div>
          </div>
        </Section>
      </Card>

      {/* Energiepreise */}
      <Card variant="bordered" padding="md">
        <Section title="Energiepreise">
          <Slider
            label="Strompreis (Zuhause)"
            value={userProfile.electricityPrice}
            onChange={setElectricityPrice}
            min={SLIDER_RANGES.electricityPrice.min}
            max={SLIDER_RANGES.electricityPrice.max}
            step={SLIDER_RANGES.electricityPrice.step}
            formatValue={(v) => `${v.toFixed(2)} €/kWh`}
          />
          <Slider
            label="Benzinpreis"
            value={userProfile.fuelPrice}
            onChange={setFuelPrice}
            min={SLIDER_RANGES.fuelPrice.min}
            max={SLIDER_RANGES.fuelPrice.max}
            step={SLIDER_RANGES.fuelPrice.step}
            formatValue={(v) => `${v.toFixed(2)} €/l`}
          />
        </Section>
      </Card>

      {/* Extras */}
      <Card variant="bordered" padding="md">
        <Section title="Extras">
          <div className="space-y-4">
            <Toggle
              label="Wallbox vorhanden"
              description="Private Ladestation zu Hause"
              checked={userProfile.hasWallbox}
              onChange={(value) => {
                setHasWallbox(value);
                if (value) {
                  setWallboxCost(0); // Wallbox schon da = keine Kosten
                } else {
                  setWallboxCost(1500); // Neuanschaffung = Standardkosten
                }
              }}
            />
            {!userProfile.hasWallbox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Slider
                  label="Wallbox-Kosten (inkl. Installation)"
                  value={userProfile.wallboxCost}
                  onChange={setWallboxCost}
                  min={500}
                  max={3500}
                  step={100}
                  formatValue={(v) => formatCurrency(v)}
                />
              </motion.div>
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-vibe-gray-100">
            <Toggle
              label="Solaranlage vorhanden"
              description="Eigener Solarstrom für günstigeres Laden"
              checked={userProfile.hasSolarPanels}
              onChange={setHasSolarPanels}
            />
            {userProfile.hasSolarPanels && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Slider
                  label="Eigenverbrauchsanteil"
                  value={userProfile.solarSelfConsumptionRate}
                  onChange={setSolarSelfConsumptionRate}
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  formatValue={(v) => `${Math.round(v * 100)}%`}
                />
              </motion.div>
            )}
          </div>
        </Section>
      </Card>
    </div>
  );
};
