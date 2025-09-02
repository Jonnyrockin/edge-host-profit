import { SimulationState, CalculationResult, Device } from '../types/simulation';
import { SCENARIOS, FIBRE_PROVIDERS } from '../data/constants';

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
  if (km === 0) return 1;
  if (km <= 100) return 1.05;
  if (km <= 200) return 1.10;
  if (km <= 300) return 1.15;
  return 1.20;
}

export function getSelectedFibreRate(state: SimulationState): number {
  const providers = FIBRE_PROVIDERS[state.city] || [];
  const provider = providers.find(p => p.name === state.connectivityProvider) || providers[0];
  return provider?.rate || 0;
}

export function calculateRevenue(state: SimulationState): CalculationResult {
  const scenario = SCENARIOS[state.scenario as keyof typeof SCENARIOS] || SCENARIOS.Median;
  const util = Math.min(1, Math.max(0, state.util * scenario.util));
  const inventoryIPS = state.devices.reduce((sum, device) => sum + (device.ips || 0) * (device.qty || 1), 0);
  const devicesRows = state.devices.map(d => `${d.qty}× ${d.label}`).join(', ');

  // Price factor calculation - use pricePerCallBase directly as it already includes premium
  const esgMultiplier = state.esgEnabled ? 1.1 : 1.0;
  
  const locationMultiplier = cityPriceFactor(state.city) * 
                           edgeTierMultiplier(state.devices) * 
                           scenario.price * 
                           (1 + (state.rural || 0) / 100) * 
                           (1 + (state.greenUplift || 0) / 100);
  
  const pricePerCall = state.pricePerCallBase * locationMultiplier * esgMultiplier;
  const monthlyCalls = Math.round(inventoryIPS * util * state.secondsInMonth * state.callsPerJob);

  // OPEX calculation
  const fibreCost = state.linkRate ? getSelectedFibreRate(state) : (state.costs.fibre || 0);
  const energyCost = (state.costs.energy || 0) * (1 + (state.greenPremium || 0) / 100);
  const opex = energyCost + 
               (state.costs.rent || 0) + 
               (state.costs.staff || 0) + 
               (state.costs.misc || 0) + 
               (state.costs.insurance || 0) + 
               (state.costs.maintenance || 0) + 
               (state.costs.licenses || 0) + 
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
    energyCost
  };
}