// Host Revenue Simulator MVP - Market Context and Hardware Data

export interface CityData {
  name: string;
  baselinePricePerCall: number; // USD per inference
}

export interface IndustryUplift {
  name: string;
  multiplier: number;
  latencyThresholdMs: number;
}

export interface LatencyMultiplier {
  category: string;
  threshold: string;
  multiplier: number;
}

export interface ESGTier {
  name: string;
  uplift: number; // percentage uplift
}

export interface HardwareNode {
  id: string;
  vendor: string;
  model: string;
  ips: number; // Inferences per second
  powerConsumptionKW: number;
  category: 'inference' | 'memory';
  price?: number; // Optional for CAPEX calculation
}

export interface SimulatorScenario {
  name: string;
  utilization: number;
  priceMultiplier: number;
  baseCPJ: number; // Base calls per job
}

// Market Context Data
export const CITIES: CityData[] = [
  { name: 'New York', baselinePricePerCall: 0.012 },
  { name: 'San Francisco', baselinePricePerCall: 0.015 },
  { name: 'London', baselinePricePerCall: 0.010 },
  { name: 'Singapore', baselinePricePerCall: 0.008 },
  { name: 'Frankfurt', baselinePricePerCall: 0.009 },
  { name: 'Toronto', baselinePricePerCall: 0.011 },
  { name: 'Tokyo', baselinePricePerCall: 0.013 },
  { name: 'Sydney', baselinePricePerCall: 0.014 }
];

export const INDUSTRY_UPLIFTS: IndustryUplift[] = [
  { name: 'Financial', multiplier: 1.7, latencyThresholdMs: 20 },
  { name: 'Healthcare', multiplier: 1.5, latencyThresholdMs: 30 },
  { name: 'Sports/Media', multiplier: 1.4, latencyThresholdMs: 25 },
  { name: 'Retail', multiplier: 1.2, latencyThresholdMs: 40 },
  { name: 'Generic', multiplier: 1.0, latencyThresholdMs: 50 }
];

export const LATENCY_MULTIPLIERS: LatencyMultiplier[] = [
  { category: 'well-below', threshold: '< 20ms', multiplier: 1.3 },
  { category: 'below', threshold: '20-35ms', multiplier: 1.1 },
  { category: 'above', threshold: '35-50ms', multiplier: 0.9 },
  { category: 'far-above', threshold: '> 50ms', multiplier: 0.8 }
];

export const ESG_TIERS: ESGTier[] = [
  { name: 'None', uplift: 0 },
  { name: 'Bronze', uplift: 10 },
  { name: 'Silver', uplift: 15 },
  { name: 'Gold', uplift: 20 },
  { name: 'Certified', uplift: 15 }
];

// Certified Hardware Catalog
export const HARDWARE_CATALOG: HardwareNode[] = [
  {
    id: 'sm-221ge-tnht-lcc',
    vendor: 'Supermicro',
    model: 'SYS-221GE-TNHT-LCC (HGX H100 4×)',
    ips: 180,
    powerConsumptionKW: 2.8,
    category: 'inference',
    price: 85000
  },
  {
    id: 'sm-521gu-tnxr',
    vendor: 'Supermicro', 
    model: 'SYS-521GU-TNXR (HGX H100 4×)',
    ips: 220,
    powerConsumptionKW: 3.5,
    category: 'inference',
    price: 95000
  },
  {
    id: 'sm-as-2025hs-tnr',
    vendor: 'Supermicro',
    model: 'AS-2025HS-TNR (2× RTX 6000 Ada)',
    ips: 120,
    powerConsumptionKW: 1.6,
    category: 'inference',
    price: 45000
  },
  {
    id: 'sm-6049gp-trt',
    vendor: 'Supermicro',
    model: '6049GP-TRT (4× T4)',
    ips: 40,
    powerConsumptionKW: 1.2,
    category: 'inference',
    price: 25000
  },
  {
    id: 'vizrt-rtx6000ada',
    vendor: 'Vizrt',
    model: 'RTX 6000 Ada Workstation',
    ips: 65,
    powerConsumptionKW: 0.9,
    category: 'inference',
    price: 35000
  },
  {
    id: 'jbod-memory-96tb',
    vendor: 'Generic',
    model: '2U JBOD Memory Node (96TB)',
    ips: 0,
    powerConsumptionKW: 0.6,
    category: 'memory',
    price: 15000
  }
];

// Simulator Scenarios
export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    name: 'Conservative',
    utilization: 0.35,
    priceMultiplier: 0.9,
    baseCPJ: 2
  },
  {
    name: 'Median', 
    utilization: 0.55,
    priceMultiplier: 1.0,
    baseCPJ: 4
  },
  {
    name: 'Optimistic',
    utilization: 0.75,
    priceMultiplier: 1.2,
    baseCPJ: 8
  }
];

// OPEX Constants
export const OPEX_DEFAULTS = {
  rentPerMonth: 1200,
  staffPerNode: 250,
  miscPerMonth: 300,
  platformFeeRate: 0.25 // 25% of gross
};

// Calculation Constants
export const SECONDS_IN_MONTH = 30 * 24 * 60 * 60; // 2,592,000
export const HOURS_IN_MONTH = 30 * 24; // 720