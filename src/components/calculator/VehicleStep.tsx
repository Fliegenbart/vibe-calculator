import React from 'react';
import { motion } from 'framer-motion';
import { Car, Zap, Fuel } from 'lucide-react';
import { useCalculatorStore } from '@/hooks/useCalculatorStore';
import { Card, SelectionCard, Button } from '@/components/shared';
import { VehicleClass } from '@/types';
import { vehicleClassLabels, vehicleClassDescriptions, getVehiclesByClass } from '@/data/vehicles';
import { formatCurrency } from '@/utils';

const vehicleClassIcons: Record<VehicleClass, React.ReactNode> = {
  kleinwagen: <Car className="w-6 h-6" />,
  kompakt: <Car className="w-6 h-6" />,
  mittelklasse: <Car className="w-6 h-6" />,
  suv: <Car className="w-7 h-7" />,
  limousine: <Car className="w-7 h-7" />,
  kombi: <Car className="w-7 h-7" />,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const VehicleStep: React.FC = () => {
  const { 
    userProfile, 
    setVehicleClass, 
    setEVVehicle, 
    setICEVehicle, 
    nextStep 
  } = useCalculatorStore();
  
  const { selectedVehicleClass, evVehicle, iceVehicle } = userProfile;

  const availableClasses: VehicleClass[] = ['kleinwagen', 'kompakt', 'suv', 'limousine'];

  const handleContinue = () => {
    if (selectedVehicleClass && evVehicle && iceVehicle) {
      nextStep();
    }
  };

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
          Welches Auto passt zu dir?
        </h2>
        <p className="mt-2 text-vibe-gray-500">
          Wähle eine Fahrzeugklasse – wir vergleichen ein passendes E-Auto mit einem Verbrenner.
        </p>
      </motion.div>

      {/* Vehicle Class Selection */}
      <motion.div variants={itemVariants}>
        <Card variant="bordered" padding="lg">
          <h3 className="text-lg font-semibold text-vibe-gray-700 mb-4">
            Fahrzeugklasse wählen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableClasses.map((vehicleClass) => (
              <SelectionCard
                key={vehicleClass}
                title={vehicleClassLabels[vehicleClass]}
                description={vehicleClassDescriptions[vehicleClass]}
                icon={vehicleClassIcons[vehicleClass]}
                isSelected={selectedVehicleClass === vehicleClass}
                onClick={() => setVehicleClass(vehicleClass)}
              />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Selected Vehicles Preview */}
      {selectedVehicleClass && evVehicle && iceVehicle && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* EV Card */}
          <Card variant="gradient" padding="lg" className="border-2 border-ev-green/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-ev-green/20">
                <Zap className="w-5 h-5 text-ev-green" />
              </div>
              <span className="text-sm font-medium text-ev-green">Elektro</span>
            </div>
            
            <h4 className="text-xl font-bold text-vibe-secondary">{evVehicle.name}</h4>
            <p className="text-sm text-vibe-gray-500 mt-1">{evVehicle.brand} {evVehicle.model}</p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Reichweite</span>
                <span className="font-medium">{evVehicle.evSpecs?.rangeWLTP} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Verbrauch</span>
                <span className="font-medium">{evVehicle.consumption.combined} kWh/100km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Listenpreis</span>
                <span className="font-semibold text-vibe-secondary">{formatCurrency(evVehicle.basePrice)}</span>
              </div>
            </div>

            {/* Vehicle Selector Dropdown */}
            <div className="mt-4">
              <select
                value={evVehicle.id}
                onChange={(e) => {
                  const vehicle = getVehiclesByClass(selectedVehicleClass, 'ev')
                    .find((v) => v.id === e.target.value);
                  if (vehicle) setEVVehicle(vehicle);
                }}
                className="w-full p-2 text-sm border border-vibe-gray-200 rounded-lg focus:ring-2 focus:ring-vibe-primary focus:border-transparent"
              >
                {getVehiclesByClass(selectedVehicleClass, 'ev').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} – {formatCurrency(v.basePrice)}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {/* ICE Card */}
          <Card variant="elevated" padding="lg" className="border-2 border-ice-orange/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-ice-orange/20">
                <Fuel className="w-5 h-5 text-ice-orange" />
              </div>
              <span className="text-sm font-medium text-ice-orange">Verbrenner</span>
            </div>
            
            <h4 className="text-xl font-bold text-vibe-secondary">{iceVehicle.name}</h4>
            <p className="text-sm text-vibe-gray-500 mt-1">{iceVehicle.brand} {iceVehicle.model}</p>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">CO₂-Emissionen</span>
                <span className="font-medium">{iceVehicle.iceSpecs?.co2Emissions} g/km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Verbrauch</span>
                <span className="font-medium">{iceVehicle.consumption.combined} l/100km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-vibe-gray-500">Listenpreis</span>
                <span className="font-semibold text-vibe-secondary">{formatCurrency(iceVehicle.basePrice)}</span>
              </div>
            </div>

            {/* Vehicle Selector Dropdown */}
            <div className="mt-4">
              <select
                value={iceVehicle.id}
                onChange={(e) => {
                  const vehicle = getVehiclesByClass(selectedVehicleClass, 'ice')
                    .find((v) => v.id === e.target.value);
                  if (vehicle) setICEVehicle(vehicle);
                }}
                className="w-full p-2 text-sm border border-vibe-gray-200 rounded-lg focus:ring-2 focus:ring-vibe-primary focus:border-transparent"
              >
                {getVehiclesByClass(selectedVehicleClass, 'ice').map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} – {formatCurrency(v.basePrice)}
                  </option>
                ))}
              </select>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div variants={itemVariants} className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedVehicleClass || !evVehicle || !iceVehicle}
        >
          Weiter zum Nutzungsprofil
        </Button>
      </motion.div>
    </motion.div>
  );
};
