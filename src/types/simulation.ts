export interface Device {
  id: string;
  vendor: string;
  label: string;
  ips: number;
  latencyTier: string;
  qty: number;
}

export interface Costs {
  energy: number;
  rent: number;
  staff: number;
  misc: number;
  insurance: number;
  maintenance: number;
  licenses: number;
  fibre: number;
  legal: number;
}

export interface SimulationState {
  city: string;
  rural: number;
  scenario: string;
  util: number;
  callsPerJob: number;
  secondsInMonth: number;
  pricePerCallBase: number;
  devices: Device[];
  costs: Costs;
  connectivityProvider: string;
  linkRate: boolean;
  energyProvider: string;
  greenUplift: number;
  greenPremium: number;
  esgEnabled: boolean;
  esgFile?: string;
  inferenceProvider?: string;
  inferenceModel?: string;
  baseInferencePrice?: number;
  baselineCloudPrice?: number;
  premiumMultiplier?: number;
  baselineProvider?: string;
  onDeviceShift?: number;
  ecosystemMult?: number;
}

export interface CalculationResult {
  util: number;
  inventoryIPS: number;
  devicesRows: string;
  pricePerCall: number;
  monthlyCalls: number;
  gross: number;
  platformFee: number;
  opex: number;
  cashNet: number;
  fibreCost: number;
  energyCost: number;
  adjustedUtil: number;
}

export interface Provider {
  name: string;
  rate?: number;
  green?: boolean;
}

export interface Preset {
  id: string;
  name: string;
  desc: string;
  cfg: {
    devices: Device[];
    util: number;
    callsPerJob: number;
    rural: number;
    costs: Costs;
  };
}