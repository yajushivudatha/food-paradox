# The Food Paradox Platform

A modern, high-fidelity **B2B (Business-to-NGO) Logistics & Monitoring Hub** that bridges the gap between institutional Food Donors (canteens, hostel messes, hotels, and restaurants) and Redistribution Partners (verified NGO student volunteer groups). 

The platform prioritizes "Time-to-Table" efficiency, FSSAI-compliant safety protocols, real-time geofencing, and quantifiable impact tracking.

---

## 🚀 The Paradox Explained

Over **40% of institutional food prepared** in university messes, star hotels, and canteens is safely edible but systematically discarded due to over-catering buffers. Simultaneously, millions of people live in severe food insecurity just a few kilometers away. 

**The Food Paradox Platform** acts as a live coordination layer that matches, tracks, and routes freshly prepared surplus food safely to target centers within an hour.

---

## 🛠️ Key Platform Features

### 1. Donor Surplus Portal
*   **Rapid Posting**: Seamless interface for university messes, restaurants, and hotels to log surplus items.
*   **FSSAI Digital Hygiene Ledger**: A mandatory compliance checklist (temperature tracking, storage check, sensory check, and hygienic handler confirmation) to enforce food safety protocols prior to listing.
*   **Automatic Shelf-Life Tagging**: Converts servings to estimated kilograms and maps out-of-oven timers.

### 2. Live Volunteer Radar (NGO Portal)
*   **Logistics Interactive Map**: An custom coordinate-mapped SVG SVG vector canvas displaying active "Food Leads" centered around the main NGO distribution hub.
*   **Dynamic Geofencing Slider**: Instantly filters active leads within a 2km to 15km radius.
*   **FSSAI Freshness Timer**: Live countdown clock. Once food reaches its safety threshold, it is automatically de-listed and flagged to prevent any food safety hazards.
*   **One-Click Claims**: Prevents double-collection by locking claimed leads under verified volunteer identities.

### 3. Impact & Carbon Analytics Dashboard
*   **Real-time Metrics**: Tracks total kilograms saved, estimated meals served, and cumulative Greenhouse Gas (CO₂e) avoidance.
*   **Co2e Prevention Index**: Uses standard EPA WARM guidelines (1 kg saved food = 2.5 kg avoided CO₂e methane equivalent).
*   **Scenario Impact Simulator**: Allows institutional admins to model campaigns (e.g., campus-wide drives, star-hotel coalitions, monsoon student push) and preview the resulting reduction of the local Hunger Gap.
*   **Dual-Y-Axis Charting**: Interactive Recharts-powered visualization plotting the historical correlation between biomass rescued and hunger index alleviation.

---

## 📂 Project Architecture & File Structure

```text
/
├── .env.example            # System credentials and app variables template
├── index.html              # HTML shell
├── metadata.json           # Application name, description and permissions metadata
├── package.json            # Client and dev build dependencies
├── tsconfig.json           # TypeScript compilation config
├── vite.config.ts          # Vite asset pipeline configuration
└── src/
    ├── App.tsx             # Main layout, application states, and router tabs
    ├── main.tsx            # App bundle mounting entrypoint
    ├── index.css           # Global Tailwind stylesheet, custom theme & font imports
    ├── types.ts            # Absolute global types and structural interfaces
    ├── data/
    │   └── mockData.ts     # Initial food leads, NGO chapters, and monthly impact baseline
    ├── utils/
    │   └── helpers.ts      # Haversine distance, FSSAI timer calculators, and CO2 multipliers
    └── components/
        ├── DonorPanel.tsx  # Surplus submission with Digital Hygiene validation
        ├── ReceiverPanel.tsx # Volunteer radar mapping, radius slider, and search filter
        ├── InteractiveMap.tsx # High-fidelity custom SVG logistics map layout
        └── ImpactDashboard.tsx # Recharts-powered admin dashboard with campaign simulator
```

---

## 🎨 Design Philosophy & Aesthetics

*   **Social Work Premium Theme**: Designed with deep earth forest greens (`bg-emerald-800`), clean off-whites, and warm stone grays.
*   **Desktop-First High Contrast**: Highly structured cards with spacious layout padding, optimized for high legibility and rapid operations.
*   **Zero-Flicker Transitions**: Utilizes smooth layout transition states and micro-animations via `motion/react`.
*   **Modern Typography**: Styled using standard system **Inter** for UI control sheets paired with **JetBrains Mono** for Live UTC system tickers, distance indexes, and FSSAI safety timers.

---

## 🧪 Operational Formulas Applied

1.  **Biomass Calculation**:
    $$\text{Weight Saved (kg)} = \text{Servings} \times 0.4\,\text{kg}$$
    *(Based on average portion weights for rich carbohydrate & protein dishes)*

2.  **Methane/CO2 Prevention equivalent**:
    $$\text{Carbon Offset (kg } CO_2e) = \text{Weight Saved (kg)} \times 2.5$$
    *(Based on standard EPA landfill methane avoidance models)*

3.  **Distance Index**:
    $$\text{Haversine formula applied over latitude and longitude points to ensure coordinates filter perfectly inside active sliders.}$$

