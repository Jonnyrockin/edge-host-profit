export interface HostNode {
  id: string;
  label: string;
  location: string;
  city: string;
  ruralKm: number;
  ips: number;
  utilization: number; // Base utilization percentage
  pricePerCallBase: number;
  latencyTier: string;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'DEGRADED';
  cpuCores: number;
  gpuModel: string;
  memory: string;
  costs: {
    energy: number;
    bandwidth: number;
    maintenance: number;
    misc: number;
  };
  uptime: number; // Percentage
  lastSeen?: Date;
}

export interface FleetMetrics {
  totalNodes: number;
  onlineNodes: number;
  totalIPS: number;
  avgUtilization: number;
  monthlyInferences: number;
  grossRevenue: number;
  platformFee: number;
  totalOpex: number;
  netRevenue: number;
}

export interface Scenario {
  id: string;
  name: string;
  util: number;
  price: number;
  callsPerJob: number;
}

export const SCENARIOS: Record<string, Scenario> = {
  Conservative: {
    id: 'Conservative',
    name: 'Conservative',
    util: 0.9,
    price: 0.95,
    callsPerJob: 2
  },
  Median: {
    id: 'Median',
    name: 'Median',
    util: 1.0,
    price: 1.00,
    callsPerJob: 5
  },
  Optimistic: {
    id: 'Optimistic',
    name: 'Optimistic',
    util: 1.1,
    price: 1.08,
    callsPerJob: 12
  }
};

export interface HostDashboardState {
  nodes: HostNode[];
  selectedScenario: string;
  currentYear: number;
}
