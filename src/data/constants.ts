import { Device, Provider, Preset } from '../types/simulation';

export const CITY_OPTIONS = ['Toronto', 'New York', 'London', 'Sydney', 'Singapore', 'Portland', 'Atlanta'];

export const FIBRE_PROVIDERS: Record<string, Provider[]> = {
  Toronto: [
    { name: 'Bell Business Fibre 1G', rate: 180 },
    { name: 'Rogers Business Fibre 1G', rate: 200 },
    { name: 'Beanfield 1G', rate: 150 }
  ],
  'New York': [
    { name: 'Verizon Fios Biz 1G', rate: 190 },
    { name: 'Spectrum Biz 1G', rate: 175 },
    { name: 'Crown Castle 1G', rate: 220 }
  ],
  London: [
    { name: 'BT Business 1G', rate: 165 },
    { name: 'Virgin Media O2 1G', rate: 160 },
    { name: 'CityFibre 1G', rate: 155 }
  ],
  Sydney: [
    { name: 'Telstra Biz Fibre 1G', rate: 210 },
    { name: 'Aussie Broadband Biz 1G', rate: 190 },
    { name: 'TPG Biz Fibre 1G', rate: 185 }
  ],
  Singapore: [
    { name: 'Singtel Biz 1G', rate: 200 },
    { name: 'M1 Biz 1G', rate: 180 },
    { name: 'StarHub Biz 1G', rate: 185 }
  ],
  Portland: [
    { name: 'Comcast Biz 1G', rate: 165 },
    { name: 'Ziply Fiber Biz 1G', rate: 150 },
    { name: 'Lumen/Quantum 1G', rate: 185 }
  ],
  Atlanta: [
    { name: "AT&T Biz Fiber 1G", rate: 170 },
    { name: 'Comcast Biz 1G', rate: 165 },
    { name: 'Google Fiber Biz 1G', rate: 160 }
  ]
};

export const ENERGY_PROVIDERS: Record<string, Provider[]> = {
  Toronto: [
    { name: 'Toronto Hydro (regulated)', green: false },
    { name: 'Bullfrog Power (RECs)', green: true },
    { name: 'Hydro One Biz', green: false }
  ],
  'New York': [
    { name: 'Con Edison Biz', green: false },
    { name: 'Green Mountain Energy', green: true }
  ],
  London: [
    { name: 'Octopus Energy Biz', green: true },
    { name: 'British Gas Biz', green: false }
  ],
  Sydney: [
    { name: 'AGL Biz', green: false },
    { name: 'Origin Energy Green', green: true },
    { name: 'Simply Energy', green: false }
  ],
  Singapore: [
    { name: 'SP Group (regulated)', green: false },
    { name: 'Sembcorp Green', green: true }
  ],
  Portland: [
    { name: 'PGE', green: false },
    { name: 'Pacific Power Blue Sky', green: true }
  ],
  Atlanta: [
    { name: 'Georgia Power', green: false },
    { name: 'Green-e RECs', green: true }
  ]
};

export const CATALOG: Device[] = [
  { id: 'sm-h100x4', vendor: 'SuperMicro', label: 'H100 ×4', ips: 120, latencyTier: '<25ms', qty: 1 },
  { id: 'sm-h200x2', vendor: 'SuperMicro', label: 'H200 ×2', ips: 95, latencyTier: '<25ms', qty: 1 },
  { id: 'sm-l40sx4', vendor: 'SuperMicro', label: 'L40S ×4', ips: 70, latencyTier: '25–50ms', qty: 1 },
  { id: 'sm-adax2', vendor: 'SuperMicro', label: 'RTX 6000 Ada ×2', ips: 80, latencyTier: '50–100ms', qty: 1 },
  { id: 'sm-a10x4', vendor: 'SuperMicro', label: 'A10 ×4', ips: 45, latencyTier: '50–100ms', qty: 1 },
  { id: 'vz-edge1', vendor: 'Vizrt', label: 'Vizrt Node – Edge AI', ips: 60, latencyTier: '25–50ms', qty: 1 },
  { id: 'vz-studio', vendor: 'Vizrt', label: 'Vizrt Node – Studio', ips: 85, latencyTier: '50–100ms', qty: 1 }
];

export const SCENARIOS = {
  Conservative: { util: 0.9, price: 0.95, callsPerJob: 2 },
  Median: { util: 1.0, price: 1.00, callsPerJob: 5 },
  Optimistic: { util: 1.1, price: 1.08, callsPerJob: 12 }
};

export const PRESETS: Preset[] = [
  {
    id: 'mid_market_tv',
    name: 'Mid Market TV — Broadcast',
    desc: 'Studio MCR; deterministic 50–100ms; conservative util and pricing (≥3 Vizrt nodes).',
    cfg: {
      devices: [{ id: 'vz-studio', vendor: 'Vizrt', label: 'Vizrt Node — Studio', ips: 85, latencyTier: '50–100ms', qty: 3 }],
      util: 0.45,
      callsPerJob: 2,
      rural: 0,
      costs: { energy: 1600, rent: 900, staff: 700, misc: 200, insurance: 150, maintenance: 120, licenses: 250, fibre: 180, legal: 300 }
    }
  },
  {
    id: 'sm_edge',
    name: 'Supermicro — Edge',
    desc: 'Single row, L40S mix; 25–50ms edge tier.',
    cfg: {
      devices: [{ id: 'sm-l40sx4', vendor: 'SuperMicro', label: 'L40S ×4', ips: 70, latencyTier: '25–50ms', qty: 1 }],
      util: 0.50,
      callsPerJob: 2,
      rural: 0.1,
      costs: { energy: 1800, rent: 1000, staff: 800, misc: 200, insurance: 150, maintenance: 120, licenses: 250, fibre: 200, legal: 350 }
    }
  },
  {
    id: 'mixed',
    name: 'Mixed — Balanced',
    desc: 'One Vizrt + one SM row; blended traffic.',
    cfg: {
      devices: [
        { id: 'vz-studio', vendor: 'Vizrt', label: 'Vizrt Node — Studio', ips: 85, latencyTier: '50–100ms', qty: 1 },
        { id: 'sm-a10x4', vendor: 'SuperMicro', label: 'A10 ×4', ips: 45, latencyTier: '50–100ms', qty: 1 }
      ],
      util: 0.50,
      callsPerJob: 2,
      rural: 0.05,
      costs: { energy: 1700, rent: 900, staff: 700, misc: 200, insurance: 150, maintenance: 120, licenses: 250, fibre: 190, legal: 325 }
    }
  }
];