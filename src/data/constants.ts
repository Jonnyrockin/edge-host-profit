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
    { name: 'Toronto Hydro Business', rate: 0.12, green: false },
    { name: 'Bullfrog Power Business', rate: 0.14, green: true },
    { name: 'Hydro One Business', rate: 0.13, green: false }
  ],
  'New York': [
    { name: 'Con Edison Business', rate: 0.18, green: false },
    { name: 'Green Mountain Energy Biz', rate: 0.21, green: true },
    { name: 'PSEG Long Island Biz', rate: 0.19, green: false }
  ],
  London: [
    { name: 'British Gas Business', rate: 0.22, green: false },
    { name: 'Octopus Energy Business', rate: 0.25, green: true },
    { name: 'EDF Energy Business', rate: 0.23, green: false }
  ],
  Sydney: [
    { name: 'AGL Business', rate: 0.28, green: false },
    { name: 'Origin Energy Green Biz', rate: 0.32, green: true },
    { name: 'Simply Energy Business', rate: 0.26, green: false }
  ],
  Singapore: [
    { name: 'SP Group Business', rate: 0.20, green: false },
    { name: 'Sembcorp Green Business', rate: 0.23, green: true },
    { name: 'Keppel Electric Business', rate: 0.21, green: false }
  ],
  Portland: [
    { name: 'PGE Business', rate: 0.10, green: false },
    { name: 'Pacific Power Blue Sky Biz', rate: 0.12, green: true },
    { name: 'NW Natural Business', rate: 0.11, green: false }
  ],
  Atlanta: [
    { name: 'Georgia Power Business', rate: 0.11, green: false },
    { name: 'Green-e RECs Business', rate: 0.14, green: true },
    { name: 'Sawnee EMC Business', rate: 0.12, green: false }
  ]
};

export const CATALOG: Device[] = [
  { 
    id: 'sm-210gp-dnr', 
    vendor: 'SuperMicro', 
    label: 'SYS-210GP-DNR', 
    ips: 616, 
    latencyTier: '<25ms', 
    qty: 1,
    tops: 3700,
    price: 50000,
    cpuCores: '2× Xeon Ice Lake (2×40)',
    maxGpus: 'Up to 6× GPUs (A100, A30)',
    memory: '2 TB DDR4',
    formFactor: '2U 2-Node'
  },
  { 
    id: 'sm-220he-hyper', 
    vendor: 'SuperMicro', 
    label: '220HE Hyper-E', 
    ips: 416, 
    latencyTier: '<25ms', 
    qty: 1,
    tops: 2500,
    price: 45000,
    cpuCores: '2× Xeon Ice Lake (2×28)',
    maxGpus: 'Up to 4× GPUs (A100)',
    memory: '4 TB DDR4',
    formFactor: '2U Short'
  },
  { 
    id: 'sm-741ge-tnrt', 
    vendor: 'SuperMicro', 
    label: '741GE-TNRT', 
    ips: 966, 
    latencyTier: '<25ms', 
    qty: 1,
    tops: 5800,
    price: 40000,
    cpuCores: '2× Xeon 4th Gen (2×56)',
    maxGpus: 'Up to 4× GPUs (RTX Ada)',
    memory: '8 TB DDR5',
    formFactor: '4U/Tower'
  },
  { 
    id: 'dell-r750xa', 
    vendor: 'Dell', 
    label: 'PowerEdge R750xa', 
    ips: 416, 
    latencyTier: '25–50ms', 
    qty: 1,
    tops: 2496,
    price: 40000,
    cpuCores: '2× Xeon Scalable (up to 32×2)',
    maxGpus: 'Up to 4× GPUs (A100)',
    memory: '2 TB DDR4/5',
    formFactor: '2U'
  },
  { 
    id: 'hpe-dl380a-gen11', 
    vendor: 'HPE', 
    label: 'ProLiant DL380a Gen11', 
    ips: 500, 
    latencyTier: '<25ms', 
    qty: 1,
    tops: 3000,
    price: 45000,
    cpuCores: '2× Xeon Gen4 (2×56)',
    maxGpus: 'Up to 4× GPUs (H100)',
    memory: '3 TB DDR5',
    formFactor: '2U'
  },
  { 
    id: 'sm-1019gp-tt', 
    vendor: 'SuperMicro', 
    label: '1019GP-TT (1U)', 
    ips: 80, 
    latencyTier: '50–100ms', 
    qty: 1,
    tops: 484,
    price: 15000,
    cpuCores: '1× Xeon Cascade (up to 28)',
    maxGpus: 'Up to 2× GPUs (L4)',
    memory: '1.5 TB DDR4',
    formFactor: '1U Short'
  },
  { 
    id: 'dell-precision-7920', 
    vendor: 'Dell', 
    label: 'Precision 7920 Rack', 
    ips: 166, 
    latencyTier: '50–100ms', 
    qty: 1,
    tops: 1000,
    price: 6000,
    cpuCores: '2× Xeon Scalable (2×28)',
    maxGpus: 'Up to 3× GPUs (RTX6000)',
    memory: '1.5 TB DDR4',
    formFactor: '2U'
  },
  { 
    id: 'hp-z8-g4', 
    vendor: 'HP', 
    label: 'Z8 G4 Workstation', 
    ips: 241, 
    latencyTier: '50–100ms', 
    qty: 1,
    tops: 1450,
    price: 8000,
    cpuCores: '2× Xeon Scalable (2×28)',
    maxGpus: '2× GPUs (RTX Ada)',
    memory: '3 TB DDR4',
    formFactor: 'Tower 5U'
  },
  { 
    id: 'dell-precision-7960', 
    vendor: 'Dell', 
    label: 'Precision 7960 Rack', 
    ips: 233, 
    latencyTier: '25–50ms', 
    qty: 1,
    tops: 1400,
    price: 6000,
    cpuCores: '1× Xeon W-3400 (up to 56)',
    maxGpus: '2× GPUs (RTX Ada)',
    memory: '2 TB DDR5',
    formFactor: '2U'
  },
  { 
    id: 'hp-z8-fury-g5', 
    vendor: 'HP', 
    label: 'Z8 Fury G5', 
    ips: 971, 
    latencyTier: '<25ms', 
    qty: 1,
    tops: 5828,
    price: 50000,
    cpuCores: '1× Xeon W9 (56 cores)',
    maxGpus: '4× GPUs (Ada RTX 6000)',
    memory: '2 TB DDR5',
    formFactor: 'Tower 5U'
  }
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
      devices: [{ id: 'sm-1019gp-tt', vendor: 'SuperMicro', label: '1019GP-TT (1U)', ips: 80, latencyTier: '50–100ms', qty: 3, tops: 484, price: 15000, cpuCores: '1× Xeon Cascade (up to 28)', maxGpus: 'Up to 2× GPUs (L4)', memory: '1.5 TB DDR4', formFactor: '1U Short' }],
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
      devices: [{ id: 'dell-precision-7960', vendor: 'Dell', label: 'Precision 7960 Rack', ips: 233, latencyTier: '25–50ms', qty: 1, tops: 1400, price: 6000, cpuCores: '1× Xeon W-3400 (up to 56)', maxGpus: '2× GPUs (RTX Ada)', memory: '2 TB DDR5', formFactor: '2U' }],
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
        { id: 'dell-precision-7920', vendor: 'Dell', label: 'Precision 7920 Rack', ips: 166, latencyTier: '50–100ms', qty: 1, tops: 1000, price: 6000, cpuCores: '2× Xeon Scalable (2×28)', maxGpus: 'Up to 3× GPUs (RTX6000)', memory: '1.5 TB DDR4', formFactor: '2U' },
        { id: 'hp-z8-g4', vendor: 'HP', label: 'Z8 G4 Workstation', ips: 241, latencyTier: '50–100ms', qty: 1, tops: 1450, price: 8000, cpuCores: '2× Xeon Scalable (2×28)', maxGpus: '2× GPUs (RTX Ada)', memory: '3 TB DDR4', formFactor: 'Tower 5U' }
      ],
      util: 0.50,
      callsPerJob: 2,
      rural: 0.05,
      costs: { energy: 1700, rent: 900, staff: 700, misc: 200, insurance: 150, maintenance: 120, licenses: 250, fibre: 190, legal: 325 }
    }
  }
];