// Host Revenue Simulator MVP Types

export interface SimulatorConfig {
  // Market Context
  selectedCity: string;
  selectedIndustry: string;
  selectedLatencyCategory: string;
  selectedESGTier: string;
  
  // Hardware Configuration
  selectedNodes: SelectedNode[];
  
  // Workload Modeling
  isDynamicCallsEnabled: boolean;
  manualCallsPerJob: number;
  agenticAdoption: number; // 0-100%
  currentYear: number; // 2025-2030
  complexityFactor: number; // 1.0-3.0
  hybridOverhead: number;
  
  // Scenario
  selectedScenario: string;
  
  // Energy pricing
  energyPricePerKWh: number;
}

export interface SelectedNode {
  hardwareId: string;
  quantity: number;
}

export interface SimulatorResults {
  // Calculated Values
  totalIPS: number;
  totalPowerKW: number;
  callsPerJob: number;
  monthlyCallsTotal: number;
  pricePerCall: number;
  
  // Financial Results
  grossRevenue: number;
  platformFee: number;
  energyCost: number;
  totalOPEX: number;
  netRevenue: number;
  
  // Validation Flags
  hasValidInputs: boolean;
  hasPricePositive: boolean;
  hasAtLeastOneNode: boolean;
}

export interface ValidationResult {
  inputs: 'green' | 'yellow' | 'red';
  price: 'green' | 'yellow' | 'red';
  nodes: 'green' | 'yellow' | 'red';
}