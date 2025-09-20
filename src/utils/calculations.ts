import { SimulationState, CalculationResult, Device } from '../types/simulation';
import { SCENARIOS, FIBRE_PROVIDERS, ENERGY_PROVIDERS } from '../data/constants';

export function calculateDynamicCallsPerJob(
  currentYear: number = new Date().getFullYear(),
  baseCalls: number = 1.5,
  agenticRate: number = 0.8,
  growthRate: number = 2,
  complexityMultiplier: number = 5,
  hybridOverhead: number = 1.5
): number {
  /**
   * Dynamic formula for calls per job, conservative for agentic/hybrid evolution.
   * Based on AI evolution toward multi-step reasoning, tool-calling, and hybrid edge/cloud workflows.
   */
  const yearFactor = Math.max((currentYear - 2025) * growthRate, 0);
  const adjustedAgenticRate = Math.min(agenticRate + (yearFactor * 0.05), 1.0); // Caps at 1.0
  const calls = baseCalls + (adjustedAgenticRate * yearFactor) * complexityMultiplier + hybridOverhead;
  return Math.min(calls, 20); // Conservative cap for realism
}

export function cityPriceFactor(city: string): number {
  return 1.00; // Base factor for all cities
}

export function edgeTierMultiplier(devices: Device[]): number {
  const tiers = devices.map(d => d.latencyTier || '50–100ms');
  const score = tiers.reduce((acc, tier) => {
    if (tier.includes('25')) return acc + 1.15;
    if (tier.includes('50')) return acc + 1.05;
    return acc + 1.00;
  }, 0) / Math.max(1, tiers.length);
  return score;
}

export function ruralFactorFromKm(km: number): number {
  // Rural edge pricing based on scarcity and infrastructure costs
  // Aligned with agricultural edge compute valuations
  if (km === 0) return 1.0;        // Urban core - no premium
  if (km <= 50) return 1.5;        // Suburban edge - 50% premium
  if (km <= 100) return 2.0;       // Rural edge - 2x premium (scarcity)
  if (km <= 200) return 2.5;       // Agricultural edge - 2.5x premium
  if (km <= 300) return 3.0;       // Remote rural - 3x premium
  return 4.0;                      // Deep rural/agriculture - 4x premium
}

export function getSelectedFibreRate(state: SimulationState): number {
  const providers = FIBRE_PROVIDERS[state.city] || [];
  const provider = providers.find(p => p.name === state.connectivityProvider) || providers[0];
  return provider?.rate || 0;
}

export function getSelectedEnergyRate(state: SimulationState): number {
  const providers = ENERGY_PROVIDERS[state.city] || [];
  const provider = providers.find(p => p.name === state.energyProvider) || providers[0];
  return provider?.rate || 0.12; // Default fallback rate per kWh
}

export function calculateRevenue(state: SimulationState): CalculationResult {
  const scenario = SCENARIOS[state.scenario as keyof typeof SCENARIOS] || SCENARIOS.Median;
  const baseUtil = Math.min(1, Math.max(0, state.util * scenario.util));
  
  // Lightweight VLM impact adjustments
  const onDeviceShift = state.onDeviceShift || 0.2; // Conservative: 20% shift to on-device
  const ecosystemMult = state.ecosystemMult || 1.2; // Conservative: 20% ecosystem growth
  
  // Updated utilization: (base_util * (1 - on_device_shift) * ecosystem_mult)
  const adjustedUtil = Math.min(0.9, Math.max(0, baseUtil * (1 - onDeviceShift) * ecosystemMult));
  const util = adjustedUtil; // Use adjusted utilization for calculations
  
  const inventoryIPS = state.devices.reduce((sum, device) => sum + (device.ips || 0) * (device.qty || 1), 0);
  const devicesRows = state.devices.map(d => `${d.qty}× ${d.label}`).join(', ');

  // Price factor calculation - use pricePerCallBase directly as it already includes premium
  const esgMultiplier = state.esgEnabled ? 1.1 : 1.0;
  
  // Calculate rural multiplier correctly (state.rural is already the multiplier, not percentage)
  const ruralMultiplier = 1 + (state.rural || 0);
  
  const locationMultiplier = cityPriceFactor(state.city) * 
                           edgeTierMultiplier(state.devices) * 
                           scenario.price * 
                           ruralMultiplier * 
                           (1 + (state.greenUplift || 0) / 100);
  
  const pricePerCall = state.pricePerCallBase * locationMultiplier * esgMultiplier;
  
  // Calculate dynamic calls per job based on agentic AI evolution
  const currentYear = new Date().getFullYear();
  const dynamicCallsPerJob = state.callsPerJob > 0 ? state.callsPerJob : calculateDynamicCallsPerJob(
    currentYear,
    1.5, // baseCalls
    0.8, // agenticRate (80% adoption in 2025)
    2,   // growthRate (45.8% CAGR approximation)
    scenario.callsPerJob || 5, // complexityMultiplier from scenario
    1.5  // hybridOverhead
  );
  
  const monthlyCalls = Math.round(inventoryIPS * util * state.secondsInMonth * dynamicCallsPerJob);

  // OPEX calculation
  const fibreCost = state.linkRate ? getSelectedFibreRate(state) : (state.costs.fibre || 0);
  
  // Energy cost calculation with provider rates
  const baseEnergyRate = getSelectedEnergyRate(state);
  const monthlyKwh = (state.costs.energy || 0) / 0.12; // Assume previous cost was at $0.12/kWh
  const energyCostFromProvider = monthlyKwh * baseEnergyRate;
  const energyCost = energyCostFromProvider * (1 + (state.greenPremium || 0) / 100);
  
  const opex = energyCost + 
               (state.costs.rent || 0) + 
               (state.costs.staff || 0) + 
               (state.costs.misc || 0) + 
               (state.costs.insurance || 0) + 
               (state.costs.maintenance || 0) + 
               (state.costs.licenses || 0) + 
               (state.costs.legal || 0) +
               fibreCost;

  const gross = monthlyCalls * pricePerCall;
  const platformFee = gross * 0.25;
  const cashNet = gross - platformFee - opex;

  return {
    util,
    inventoryIPS,
    devicesRows,
    pricePerCall,
    monthlyCalls,
    gross,
    platformFee,
    opex,
    cashNet,
    fibreCost,
    energyCost,
    adjustedUtil,
    dynamicCallsPerJob
  };
}