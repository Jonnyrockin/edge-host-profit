import { SimulationState, CalculationResult, Device } from '../types/simulation';
import { SCENARIOS, FIBRE_PROVIDERS, ENERGY_PROVIDERS } from '../data/constants';

// Industry multipliers for pricing
const INDUSTRY_MULTIPLIERS = {
  retail: 1.2,
  healthcare: 1.5, 
  financial: 1.7,
  'sports/media': 1.4,
  generic: 1.0
} as const;

function getCallPrice({
  base_price,   // minimum price per inference call (USD)
  latency_ms,   // measured latency in ms
  esg_cert,     // boolean: true if node ESG certified
  industry,     // workload type: 'retail', 'healthcare', etc.
  platform_fee, // platform fee as percent (e.g. 0.25 for 25%)
  opex_monthly, // sum fixed monthly OPEX ($)
  utilization,  // percent node utilization (0-1)
  job_volume    // number of inference calls per month
}: {
  base_price: number;
  latency_ms: number;
  esg_cert: boolean;
  industry: keyof typeof INDUSTRY_MULTIPLIERS;
  platform_fee: number;
  opex_monthly: number;
  utilization: number;
  job_volume: number;
}) {
  // Multiplier for latency and industry
  let latencyMultiplier = latency_ms <= 20 ? 1.7 :
                         latency_ms <= 50 ? 1.2 : 1.0;

  let industryMultiplier = INDUSTRY_MULTIPLIERS[industry] || 1.0;

  let esgPremium = esg_cert ? 1.15 : 1.0;

  // Final price per call
  let pricePerCall = base_price * latencyMultiplier * industryMultiplier * esgPremium;

  // Monthly gross revenue
  let grossRevenue = pricePerCall * job_volume * utilization;

  // Platform fee deduction
  let platformShare = grossRevenue * platform_fee;
  let hostShare     = grossRevenue - platformShare;

  // Net revenue after OPEX
  let netHostRevenue = hostShare - opex_monthly;

  return {
    pricePerCall: pricePerCall,
    grossRevenue: grossRevenue,
    netHostRevenue: netHostRevenue,
    breakdown: {
      platformShare,
      hostShare,
      opex_monthly
    }
  }
}

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

// Helper function to convert latency tier to milliseconds
function getLatencyMs(latencyTier: string): number {
  if (latencyTier.includes('<25') || latencyTier.includes('< 25')) return 20;
  if (latencyTier.includes('25–50') || latencyTier.includes('25-50')) return 35;
  if (latencyTier.includes('50–100') || latencyTier.includes('50-100')) return 75;
  return 100; // Default for unknown tiers
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
  
  // Calculate monthly calls using new formula: Jobs Per Day = Total Daily Calls / Calls Per Job
  const jobsPerDay = Math.round(state.callsPerDay / dynamicCallsPerJob);
  const monthlyCallsFromJobs = state.callsPerDay * 30; // 30 days in month
  
  // Traditional calculation for comparison/fallback
  const monthlyCallsFromUtil = Math.round(inventoryIPS * util * state.secondsInMonth * dynamicCallsPerJob);
  
  // Use the more realistic jobs-based calculation
  const monthlyCalls = Math.min(monthlyCallsFromJobs, monthlyCallsFromUtil);

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

  // Get average latency from devices for pricing
  const avgLatency = state.devices.length > 0 
    ? state.devices.reduce((sum, device) => sum + getLatencyMs(device.latencyTier), 0) / state.devices.length
    : 100;

  // Apply rural multiplier to base price
  const ruralMultiplier = 1 + (state.rural || 0);
  const basePrice = state.pricePerCallBase * ruralMultiplier * scenario.price;

  // Use the new getCallPrice function
  const pricing = getCallPrice({
    base_price: basePrice,
    latency_ms: avgLatency,
    esg_cert: state.esgEnabled,
    industry: 'generic', // Default industry, could be made configurable
    platform_fee: 0.25,
    opex_monthly: opex,
    utilization: util,
    job_volume: monthlyCalls
  });

  return {
    util,
    inventoryIPS,
    devicesRows,
    pricePerCall: pricing.pricePerCall,
    monthlyCalls,
    gross: pricing.grossRevenue,
    platformFee: pricing.breakdown.platformShare,
    opex,
    cashNet: pricing.netHostRevenue,
    fibreCost,
    energyCost,
    adjustedUtil,
    dynamicCallsPerJob,
    jobsPerDay
  };
}