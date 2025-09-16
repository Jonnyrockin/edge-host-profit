// Host Revenue Simulator MVP - Calculation Engine

import { SimulatorConfig, SimulatorResults, ValidationResult } from '../types/simulator';
import { 
  CITIES, 
  INDUSTRY_UPLIFTS, 
  LATENCY_MULTIPLIERS, 
  ESG_TIERS, 
  HARDWARE_CATALOG, 
  SIMULATOR_SCENARIOS,
  OPEX_DEFAULTS,
  SECONDS_IN_MONTH,
  HOURS_IN_MONTH
} from '../data/simulator-data';

export function calculateDynamicCallsPerJob(
  baseCPJ: number,
  agenticRate: number, // 0-1
  yearFactor: number,
  complexityFactor: number,
  hybridOverhead: number
): number {
  return baseCPJ + (agenticRate * yearFactor * complexityFactor * 6) + hybridOverhead;
}

export function calculateSimulatorResults(config: SimulatorConfig): SimulatorResults {
  // Get market context data
  const city = CITIES.find(c => c.name === config.selectedCity);
  const industry = INDUSTRY_UPLIFTS.find(i => i.name === config.selectedIndustry);
  const latencyMult = LATENCY_MULTIPLIERS.find(l => l.category === config.selectedLatencyCategory);
  const esgTier = ESG_TIERS.find(e => e.name === config.selectedESGTier);
  const scenario = SIMULATOR_SCENARIOS.find(s => s.name === config.selectedScenario);
  
  if (!city || !industry || !latencyMult || !esgTier || !scenario) {
    return createEmptyResults();
  }
  
  // Calculate hardware totals
  let totalIPS = 0;
  let totalPowerKW = 0;
  let nodeCount = 0;
  
  config.selectedNodes.forEach(selectedNode => {
    const hardware = HARDWARE_CATALOG.find(h => h.id === selectedNode.hardwareId);
    if (hardware && selectedNode.quantity > 0) {
      totalIPS += hardware.ips * selectedNode.quantity;
      totalPowerKW += hardware.powerConsumptionKW * selectedNode.quantity;
      nodeCount += selectedNode.quantity;
    }
  });
  
  // Calculate calls per job
  let callsPerJob: number;
  if (config.isDynamicCallsEnabled) {
    const yearFactor = Math.max(config.currentYear - 2025, 0);
    const agenticRate = config.agenticAdoption / 100; // Convert percentage to decimal
    callsPerJob = calculateDynamicCallsPerJob(
      scenario.baseCPJ,
      agenticRate,
      yearFactor,
      config.complexityFactor,
      config.hybridOverhead
    );
  } else {
    callsPerJob = config.manualCallsPerJob;
  }
  
  // Calculate monthly calls
  const utilization = scenario.utilization;
  const monthlyCallsTotal = Math.round(totalIPS * callsPerJob * utilization * SECONDS_IN_MONTH);
  
  // Calculate price per call
  const basePrice = city.baselinePricePerCall;
  const industryMultiplier = industry.multiplier;
  const latencyMultiplier = latencyMult.multiplier;
  const scenarioMultiplier = scenario.priceMultiplier;
  const esgMultiplier = 1 + (esgTier.uplift / 100);
  
  const pricePerCall = basePrice * industryMultiplier * latencyMultiplier * scenarioMultiplier * esgMultiplier;
  
  // Calculate financial results
  const grossRevenue = monthlyCallsTotal * pricePerCall;
  const platformFee = grossRevenue * OPEX_DEFAULTS.platformFeeRate;
  
  // Calculate OPEX
  const energyCost = totalPowerKW * HOURS_IN_MONTH * config.energyPricePerKWh;
  const totalOPEX = energyCost + 
                   OPEX_DEFAULTS.rentPerMonth + 
                   (OPEX_DEFAULTS.staffPerNode * nodeCount) + 
                   OPEX_DEFAULTS.miscPerMonth;
  
  const netRevenue = grossRevenue - platformFee - totalOPEX;
  
  // Validation
  const hasValidInputs = totalIPS > 0 && callsPerJob > 0;
  const hasPricePositive = pricePerCall > 0;
  const hasAtLeastOneNode = nodeCount >= 1;
  
  return {
    totalIPS,
    totalPowerKW,
    callsPerJob,
    monthlyCallsTotal,
    pricePerCall,
    grossRevenue,
    platformFee,
    energyCost,
    totalOPEX,
    netRevenue,
    hasValidInputs,
    hasPricePositive,
    hasAtLeastOneNode
  };
}

export function getValidationResults(results: SimulatorResults): ValidationResult {
  return {
    inputs: results.hasValidInputs ? 'green' : 'red',
    price: results.hasPricePositive ? 'green' : 'red', 
    nodes: results.hasAtLeastOneNode ? 'green' : 'red'
  };
}

function createEmptyResults(): SimulatorResults {
  return {
    totalIPS: 0,
    totalPowerKW: 0,
    callsPerJob: 0,
    monthlyCallsTotal: 0,
    pricePerCall: 0,
    grossRevenue: 0,
    platformFee: 0,
    energyCost: 0,
    totalOPEX: 0,
    netRevenue: 0,
    hasValidInputs: false,
    hasPricePositive: false,
    hasAtLeastOneNode: false
  };
}