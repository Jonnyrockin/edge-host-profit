import { HostNode, FleetMetrics, Scenario, SCENARIOS } from '../types/host-dashboard';

const SECONDS_IN_MONTH = 30 * 24 * 60 * 60; // 2,592,000
const PLATFORM_FEE = 0.25; // 25% platform fee

export function calculateDynamicCallsPerJob(
  currentYear: number = new Date().getFullYear(),
  baseCalls: number = 1.5,
  agenticRate: number = 0.8,
  growthRate: number = 2,
  complexityMultiplier: number = 5,
  hybridOverhead: number = 1.5
): number {
  const yearFactor = Math.max((currentYear - 2025) * growthRate, 0);
  const adjustedAgenticRate = Math.min(agenticRate + (yearFactor * 0.05), 1.0);
  const calls = baseCalls + (adjustedAgenticRate * yearFactor) * complexityMultiplier + hybridOverhead;
  return Math.min(calls, 20); // Conservative cap
}

export function ruralFactorFromKm(km: number): number {
  if (km === 0) return 1.0;     // Urban core - no premium
  if (km <= 50) return 1.5;     // Suburban edge - 50% premium
  if (km <= 100) return 2.0;    // Rural edge - 2x premium
  if (km <= 200) return 2.5;    // Agricultural edge - 2.5x
  if (km <= 300) return 3.0;    // Remote rural - 3x
  return 4.0;                   // Deep rural - 4x premium
}

export function calculateNodeRevenue(
  node: HostNode,
  scenarioData: Scenario,
  currentYear: number
): {
  adjustedUtil: number;
  monthlyInferences: number;
  grossRevenue: number;
  platformFee: number;
  opex: number;
  netRevenue: number;
  hourlyRevenue: number;
  dailyRevenue: number;
} {
  // Step 1: Adjust Utilization for VLM Impact
  const baseUtil = (node.utilization / 100) * scenarioData.util;
  const onDeviceShift = 0.2; // 20% conservative shift to on-device processing
  const ecosystemMult = 1.2; // 20% ecosystem growth multiplier
  const adjustedUtil = Math.min(0.9, Math.max(0, baseUtil * (1 - onDeviceShift) * ecosystemMult));

  // Step 2: Calculate Dynamic Calls Per Job
  const dynamicCallsPerJob = calculateDynamicCallsPerJob(
    currentYear,
    1.5,
    0.8,
    2,
    scenarioData.callsPerJob || 5,
    1.5
  );

  // Step 3: Calculate Monthly Inferences
  const monthlyInferences = Math.round(
    node.ips * adjustedUtil * SECONDS_IN_MONTH * dynamicCallsPerJob
  );

  // Step 4: Calculate Price with Rural Premium
  const ruralMultiplier = ruralFactorFromKm(node.ruralKm);
  const locationMultiplier = scenarioData.price * ruralMultiplier;
  const pricePerCall = node.pricePerCallBase * locationMultiplier;

  // Step 5: Calculate Revenue
  const grossRevenue = monthlyInferences * pricePerCall;
  const platformFee = grossRevenue * PLATFORM_FEE;
  const opex = Object.values(node.costs).reduce((sum, cost) => sum + cost, 0);
  const netRevenue = grossRevenue - platformFee - opex;

  const hourlyRevenue = netRevenue / (30 * 24);
  const dailyRevenue = netRevenue / 30;

  return {
    adjustedUtil,
    monthlyInferences,
    grossRevenue,
    platformFee,
    opex,
    netRevenue,
    hourlyRevenue,
    dailyRevenue
  };
}

export function calculateFleetMetrics(
  nodes: HostNode[],
  selectedScenario: string,
  currentYear: number
): FleetMetrics {
  const scenarioData = SCENARIOS[selectedScenario] || SCENARIOS.Median;
  
  const onlineNodes = nodes.filter(n => n.status === 'ONLINE').length;
  const totalIPS = nodes.reduce((sum, node) => sum + node.ips, 0);
  
  let totalInferences = 0;
  let totalGross = 0;
  let totalFee = 0;
  let totalOpex = 0;
  let totalNet = 0;
  let totalUtil = 0;

  nodes.forEach(node => {
    const revenue = calculateNodeRevenue(node, scenarioData, currentYear);
    totalInferences += revenue.monthlyInferences;
    totalGross += revenue.grossRevenue;
    totalFee += revenue.platformFee;
    totalOpex += revenue.opex;
    totalNet += revenue.netRevenue;
    totalUtil += revenue.adjustedUtil;
  });

  return {
    totalNodes: nodes.length,
    onlineNodes,
    totalIPS,
    avgUtilization: nodes.length > 0 ? totalUtil / nodes.length : 0,
    monthlyInferences: totalInferences,
    grossRevenue: totalGross,
    platformFee: totalFee,
    totalOpex,
    netRevenue: totalNet
  };
}
