import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Fuel, Check, Info, Sparkles, ChevronDown, Building2, ParkingCircle, Plug, TrendingUp } from 'lucide-react';
import { Card, Select, Slider, Toggle } from '@/components/shared';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { electricVehicles, iceVehicles } from '@/data/vehicles';
import { SLIDER_RANGES } from '@/data/defaults';
import { formatCurrency, formatKm } from '@/utils';
import { ChargingScenario, PriceForecast } from '@/types';

const chargingPresets: { id: string; label: string; description: string; emoji: string; scenario: ChargingScenario }[] = [
  {
    id: 'homeOnly',
    label: 'Zuhause',
    description: '100% Wallbox',
    emoji: '🏠',
    scenario: { homeCharging: 1.0, workCharging: 0, publicACCharging: 0, publicDCCharging: 0 },
  },
  {
    id: 'homePrimary',
    label: 'Meist Zuhause',
    description: '70% Wallbox',
    emoji: '🏡',
    scenario: { homeCharging: 0.7, workCharging: 0.1, publicACCharging: 0.15, publicDCCharging: 0.05 },
  },
  {
    id: 'mixed',
    label: 'Gemischt',
    description: '40% Wallbox',
    emoji: '🔀',
    scenario: { homeCharging: 0.4, workCharging: 0.2, publicACCharging: 0.25, publicDCCharging: 0.15 },
  },
  {
    id: 'publicPrimary',
    label: 'Unterwegs',
    description: 'Öffentlich',
    emoji: '🛣️',
    scenario: { homeCharging: 0.1, workCharging: 0.1, publicACCharging: 0.4, publicDCCharging: 0.4 },
  },
];

// Section Header Component
const SectionHeader: React.FC<{ title: string; subtitle?: string; emoji?: string }> = ({ title, subtitle, emoji }) => (
  <div className="mb-5">
    <h3 className="text-lg font-bold text-white flex items-center gap-2">
      {emoji && <span>{emoji}</span>}
      {title}
    </h3>
    {subtitle && <p className="text-sm text-white/50 mt-1">{subtitle}</p>}
  </div>
);

// Preisprognose-Optionen
const priceForecastOptions: { id: PriceForecast; label: string; description: string; emoji: string }[] = [
  { id: 'conservative', label: 'Konservativ', description: 'Strom +2%, Benzin +3%', emoji: '📊' },
  { id: 'moderate', label: 'Moderat', description: 'Strom +3%, Benzin +5%', emoji: '📈' },
  { id: 'aggressive', label: 'Aggressiv', description: 'Strom +4%, Benzin +8%', emoji: '🚀' },
];

export const InputPanel: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    // Erweiterter Modus
    setIsCompanyCar,
    setTaxBracket,
    setLivesInCity,
    setMonthlyParkingCost,
    setHasEmployerCharging,
    setPriceForecast,
  } = useCalculatorStore();

  const evOptions = electricVehicles.map((v) => ({
    value: v.id,
    label: `${v.name}`,
    sublabel: `${v.vibeAbo?.monthlyRate ?? 0} €/Monat`,
  }));

  const iceOptions = iceVehicles.map((v) => ({
    value: v.id,
    label: `${v.name}`,
    sublabel: `${v.leasing?.monthlyRate ?? 0} €/Monat`,
  }));

  const selectedChargingPreset = chargingPresets.find(
    (p) =>
      p.scenario.homeCharging === userProfile.chargingScenario.homeCharging &&
      p.scenario.publicDCCharging === userProfile.chargingScenario.publicDCCharging
  )?.id || 'custom';

  return (
    <div className="space-y-6">
      {/* Fahrzeugauswahl */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <SectionHeader
          title="Wähl deine Rides"
          subtitle="E-Auto Abo vs. Verbrenner Leasing"
          emoji="🚗"
        />

        <div className="space-y-5">
          {/* E-Auto */}
          <motion.div
            className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-2xl border border-purple-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">E-Auto Abo ⚡</p>
                <p className="text-xs text-white/50">VIBE All-Inclusive</p>
              </div>
              <Sparkles className="w-4 h-4 text-purple-400 ml-auto" />
            </div>
            <Select
              label=""
              value={userProfile.evVehicle?.id || ''}
              onChange={(id) => {
                const vehicle = electricVehicles.find((v) => v.id === id);
                if (vehicle) setEVVehicle(vehicle);
              }}
              options={evOptions}
            />
          </motion.div>

          {/* Verbrenner */}
          <motion.div
            className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/10 rounded-2xl border border-orange-500/20"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Fuel className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Verbrenner 🦕</p>
                <p className="text-xs text-white/50">Klassisches Leasing</p>
              </div>
            </div>
            <Select
              label=""
              value={userProfile.iceVehicle?.id || ''}
              onChange={(id) => {
                const vehicle = iceVehicles.find((v) => v.id === id);
                if (vehicle) setICEVehicle(vehicle);
              }}
              options={iceOptions}
            />
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          className="mt-5 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl border border-emerald-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-400 mb-2">Beim E-Auto Abo alles dabei:</p>
              <div className="grid grid-cols-2 gap-2">
                {['Versicherung', 'Kfz-Steuer', 'Wartung', 'TÜV', 'Reifen', '15.000 km'].map((item) => (
                  <span key={item} className="text-xs text-white/60 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Nutzung */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <SectionHeader
          title="Wie rollst du?"
          subtitle="Kilometer & Nutzungsdauer"
          emoji="📏"
        />

        <div className="space-y-6">
          <Slider
            label="Jährliche Kilometer"
            value={userProfile.annualMileage}
            onChange={setAnnualMileage}
            min={SLIDER_RANGES.annualMileage.min}
            max={SLIDER_RANGES.annualMileage.max}
            step={SLIDER_RANGES.annualMileage.step}
            formatValue={(v) => formatKm(v)}
          />
          <Slider
            label="Nutzungsdauer"
            value={userProfile.holdingPeriodYears}
            onChange={setHoldingPeriod}
            min={1}
            max={10}
            step={1}
            formatValue={(v) => `${v} ${v === 1 ? 'Jahr' : 'Jahre'}`}
          />
        </div>
      </Card>

      {/* Laden */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <SectionHeader
          title="Wo tankst du Strom?"
          subtitle="Dein Ladeszenario"
          emoji="🔌"
        />

        <div className="grid grid-cols-2 gap-3">
          {chargingPresets.map((preset) => (
            <motion.button
              key={preset.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setChargingScenario(preset.scenario)}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${
                selectedChargingPreset === preset.id
                  ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xl mb-2 block">{preset.emoji}</span>
              <p className={`font-bold text-sm ${
                selectedChargingPreset === preset.id ? 'text-purple-300' : 'text-white'
              }`}>
                {preset.label}
              </p>
              <p className="text-xs text-white/50 mt-0.5">{preset.description}</p>
            </motion.button>
          ))}
        </div>

        {/* Charging Bar */}
        <div className="mt-5 p-4 bg-white/5 rounded-2xl">
          <p className="text-xs text-white/50 mb-3">Ladeverteilung</p>
          <div className="flex h-3 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-emerald-500"
              style={{ width: `${userProfile.chargingScenario.homeCharging * 100}%` }}
              layout
            />
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-cyan-500"
              style={{ width: `${userProfile.chargingScenario.workCharging * 100}%` }}
              layout
            />
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500"
              style={{ width: `${userProfile.chargingScenario.publicACCharging * 100}%` }}
              layout
            />
            <motion.div
              className="bg-gradient-to-r from-orange-500 to-red-500"
              style={{ width: `${userProfile.chargingScenario.publicDCCharging * 100}%` }}
              layout
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-white/40">
            <span>🏠 Zuhause</span>
            <span>🏢 Arbeit</span>
            <span>🔌 AC</span>
            <span>⚡ DC</span>
          </div>
        </div>
      </Card>

      {/* Preise */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <SectionHeader
          title="Energiepreise"
          subtitle="Was zahlst du pro kWh / Liter?"
          emoji="💰"
        />

        <div className="space-y-6">
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
        </div>
      </Card>

      {/* Extras */}
      <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <SectionHeader
          title="Dein Setup"
          subtitle="Hast du schon Equipment?"
          emoji="🔧"
        />

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl">
            <Toggle
              label="Wallbox vorhanden"
              description="Private Ladestation zu Hause"
              checked={userProfile.hasWallbox}
              onChange={(value) => {
                setHasWallbox(value);
                if (value) {
                  setWallboxCost(0);
                } else {
                  setWallboxCost(1500);
                }
              }}
            />
            {!userProfile.hasWallbox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
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

          <div className="p-4 bg-white/5 rounded-2xl">
            <Toggle
              label="Solaranlage vorhanden ☀️"
              description="Eigener Solarstrom zum Laden"
              checked={userProfile.hasSolarPanels}
              onChange={setHasSolarPanels}
            />
            {userProfile.hasSolarPanels && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
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
        </div>
      </Card>

      {/* Erweiterter Modus Toggle */}
      <motion.button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-between hover:border-indigo-500/50 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-white">Erweiterter Modus</p>
            <p className="text-xs text-white/50">Firmenwagen, Parkkosten, Preisprognose...</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: showAdvanced ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-indigo-400" />
        </motion.div>
      </motion.button>

      {/* Erweiterter Modus Content */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Firmenwagen */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <SectionHeader
                title="Firmenwagen?"
                subtitle="0.25% vs 1% Regelung"
                emoji="🏢"
              />

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-500/20">
                  <Toggle
                    label="Dienstwagen / Firmenwagen"
                    description="Geldwerter Vorteil versteuern"
                    checked={userProfile.isCompanyCar}
                    onChange={setIsCompanyCar}
                  />
                  {userProfile.isCompanyCar && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <Slider
                        label="Dein Steuersatz"
                        value={userProfile.taxBracket}
                        onChange={setTaxBracket}
                        min={0.25}
                        max={0.45}
                        step={0.01}
                        formatValue={(v) => `${Math.round(v * 100)}%`}
                      />
                      <div className="mt-3 p-3 bg-emerald-500/10 rounded-xl">
                        <p className="text-xs text-emerald-400">
                          <Building2 className="w-3 h-3 inline mr-1" />
                          E-Auto: nur <strong>0.25%</strong> vom Listenpreis versteuern (Verbrenner: 1%)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>

            {/* Großstadt & Parken */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <SectionHeader
                title="Großstadt-Bonus"
                subtitle="E-Autos parken oft günstiger"
                emoji="🏙️"
              />

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20">
                  <Toggle
                    label="Wohnst du in einer Großstadt?"
                    description="Mit E-Auto Parkvorteilen"
                    checked={userProfile.livesInCity}
                    onChange={setLivesInCity}
                  />
                  {userProfile.livesInCity && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <Slider
                        label="Monatliche Parkkosten"
                        value={userProfile.monthlyParkingCost}
                        onChange={setMonthlyParkingCost}
                        min={50}
                        max={300}
                        step={10}
                        formatValue={(v) => formatCurrency(v)}
                      />
                      <div className="mt-3 p-3 bg-emerald-500/10 rounded-xl">
                        <p className="text-xs text-emerald-400">
                          <ParkingCircle className="w-3 h-3 inline mr-1" />
                          E-Autos: <strong>50% Rabatt</strong> auf Parkgebühren in vielen Städten
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>

            {/* Arbeitgeber-Laden */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <SectionHeader
                title="Laden beim Arbeitgeber"
                subtitle="Kostenloses Laden am Arbeitsplatz"
                emoji="🏭"
              />

              <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                <Toggle
                  label="Arbeitgeber bietet Ladestation"
                  description="Kostenlos oder vergünstigt laden"
                  checked={userProfile.hasEmployerCharging}
                  onChange={setHasEmployerCharging}
                />
                {userProfile.hasEmployerCharging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 p-3 bg-cyan-500/10 rounded-xl"
                  >
                    <p className="text-xs text-cyan-400">
                      <Plug className="w-3 h-3 inline mr-1" />
                      Arbeitsweg-Laden ist <strong>kostenlos</strong> - spart 300-500€/Jahr
                    </p>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Preisprognose */}
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <SectionHeader
                title="Preisentwicklung"
                subtitle="Wie entwickeln sich Energie- & Benzinpreise?"
                emoji="📈"
              />

              <div className="grid grid-cols-3 gap-3">
                {priceForecastOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPriceForecast(option.id)}
                    className={`p-4 rounded-2xl text-center transition-all border-2 ${
                      userProfile.priceForecast === option.id
                        ? 'bg-gradient-to-br from-orange-500/30 to-red-500/20 border-orange-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl mb-2 block">{option.emoji}</span>
                    <p className={`font-bold text-sm ${
                      userProfile.priceForecast === option.id ? 'text-orange-300' : 'text-white'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-[10px] text-white/50 mt-1">{option.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-orange-500/10 rounded-xl">
                <p className="text-xs text-orange-400">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  CO2-Steuer macht Benzin langfristig <strong>deutlich teurer</strong>
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
