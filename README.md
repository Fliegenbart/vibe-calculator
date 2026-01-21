# TCO-Rechner | vibe moves you

Ein moderner, interaktiver Kostenvergleichsrechner für E-Autos vs. Verbrenner.

![TCO-Rechner Preview](./docs/preview.png)

## 🚀 Features

### Kernfunktionen
- **Fahrzeugklassen-Auswahl**: Kleinwagen, Kompakt, SUV, Limousine
- **Realistische Kostenmodelle**: Anschaffung, Energie, Wartung, Versicherung, Steuer, THG-Quote
- **Flexible Lade-Szenarien**: Zuhause, Arbeit, öffentlich, Schnellladen
- **Break-Even-Berechnung**: Wann wird das E-Auto günstiger?
- **CO₂-Visualisierung**: Umrechnung in verständliche Äquivalente

### Geplante Features (Next Level)
- [ ] Kennzeichen-Scan für automatische Fahrzeugdaten
- [ ] Google Maps Integration für Pendler-Check
- [ ] PLZ-basierte Förderungen
- [ ] Dynamic Pricing Forecast
- [ ] Urlaubs-Szenario-Simulator
- [ ] Wallbox-Rechner
- [ ] AI-Fahrzeug-Matching

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

```bash
# Repository klonen
git clone https://github.com/vibe-moves-you/tco-rechner.git
cd tco-rechner

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft unter `http://localhost:5173`

## 🏗 Projektstruktur

```
tco-rechner/
├── src/
│   ├── components/
│   │   ├── calculator/          # Step-Komponenten
│   │   │   ├── VehicleStep.tsx
│   │   │   ├── UsageStep.tsx
│   │   │   ├── DetailsStep.tsx
│   │   │   └── ResultStep.tsx
│   │   ├── layout/              # Header, Footer
│   │   └── shared/              # Wiederverwendbare UI-Komponenten
│   ├── data/
│   │   ├── vehicles.ts          # Fahrzeugdatenbank
│   │   └── defaults.ts          # Standardwerte & Konstanten
│   ├── hooks/
│   │   └── useCalculatorStore.ts # Zustand Store
│   ├── services/
│   │   └── calculator.ts        # TCO-Berechnungslogik
│   ├── types/
│   │   └── index.ts             # TypeScript Interfaces
│   ├── utils/
│   │   └── index.ts             # Helper Functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🧮 Berechnungslogik

### Kostenfaktoren

| Kategorie | E-Auto | Verbrenner |
|-----------|--------|------------|
| Anschaffung | Listenpreis - Förderung + Wallbox | Listenpreis |
| Energie | kWh × Strompreis (Lade-Mix) | Liter × Benzinpreis |
| Wartung | ~60% der Verbrenner-Kosten | Vollkosten |
| Versicherung | Typklassen-basiert | Typklassen-basiert |
| Kfz-Steuer | 0 € bis 2030 | Hubraum + CO₂ |
| THG-Quote | ~300 €/Jahr Einnahme | - |
| Wertverlust | Degressiv (25%, 15%, 10%...) | Degressiv |

### Energiepreis-Berechnung (E-Auto)

```typescript
const weightedPrice = 
  homeCharging * homePrice +
  workCharging * homePrice * 0.8 +
  publicAC * publicACPrice +
  publicDC * publicDCPrice;
```

## 🎨 Design System

### Farben

| Name | Hex | Verwendung |
|------|-----|------------|
| Primary (Electric Mint) | `#00D4AA` | CTAs, E-Auto-Akzente |
| Secondary (Deep Navy) | `#1A1A2E` | Text, dunkle Elemente |
| Accent (Energy Orange) | `#FF6B35` | Verbrenner-Akzente |

### Typografie

- **Display**: Space Grotesk
- **Body**: Outfit
- **Mono**: JetBrains Mono (Zahlen)

## 🔌 API-Integration (geplant)

### Externe Datenquellen

```typescript
// Tankerkönig API für Kraftstoffpreise
GET https://creativecommons.tankerkoenig.de/json/list.php

// BDEW für Strompreise
// (manuell aktualisiert)

// Fahrzeugdaten
// mobile.de / autoscout24 Scraping oder DAT API
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

## 📄 Lizenz

MIT License - siehe [LICENSE](./LICENSE)

## 🤝 Contributing

1. Fork erstellen
2. Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request erstellen

## 📞 Kontakt

**vibe moves you**
- Web: [vibe-moves.de](https://vibe-moves.de)
- Email: hello@vibe-moves.de

---

Made with 💚 and ⚡ for a sustainable future.
