import { useState, useEffect, useMemo } from 'react';
import { HostNode, HostDashboardState } from '../types/host-dashboard';
import { calculateFleetMetrics } from '../utils/host-calculations';

// Sample nodes for demo
const SAMPLE_NODES: HostNode[] = [
  {
    id: 'node-1',
    label: 'Supermicro A30',
    location: 'Mission District, San Francisco, CA',
    city: 'San Francisco',
    ruralKm: 0,
    ips: 125,
    utilization: 85,
    pricePerCallBase: 0.005,
    latencyTier: '<25ms',
    status: 'ONLINE',
    cpuCores: 32,
    gpuModel: 'NVIDIA A30',
    memory: '128GB DDR4 ECC',
    costs: {
      energy: 120,
      bandwidth: 850,
      maintenance: 200,
      misc: 100
    },
    uptime: 99.8,
    nodeType: 'INFERENCE'
  },
  {
    id: 'node-2',
    label: 'Supermicro node-001',
    location: 'The Beaches, Toronto, CA',
    city: 'Toronto',
    ruralKm: 15,
    ips: 100,
    utilization: 78,
    pricePerCallBase: 0.005,
    latencyTier: '25-50ms',
    status: 'ONLINE',
    cpuCores: 24,
    gpuModel: 'NVIDIA RTX 6000',
    memory: '64GB DDR4',
    costs: {
      energy: 100,
      bandwidth: 750,
      maintenance: 150,
      misc: 80
    },
    uptime: 98.5,
    nodeType: 'INFERENCE'
  },
  {
    id: 'node-3',
    label: 'Supermicro node-001',
    location: 'Kreuzberg, Berlin, DE',
    city: 'Berlin',
    ruralKm: 0,
    ips: 156,
    utilization: 92,
    pricePerCallBase: 0.005,
    latencyTier: '<25ms',
    status: 'WARNING',
    cpuCores: 48,
    gpuModel: 'NVIDIA A100 80GB',
    memory: '256GB DDR5 ECC',
    costs: {
      energy: 180,
      bandwidth: 900,
      maintenance: 300,
      misc: 150
    },
    uptime: 97.2,
    nodeType: 'INFERENCE'
  },
  {
    id: 'node-4',
    label: 'Dell node-001',
    location: 'Yorkville, Toronto, CA',
    city: 'Toronto',
    ruralKm: 8,
    ips: 312,
    utilization: 63,
    pricePerCallBase: 0.005,
    latencyTier: '<25ms',
    status: 'ONLINE',
    cpuCores: 64,
    gpuModel: 'NVIDIA RTX A6000',
    memory: '512GB DDR5',
    costs: {
      energy: 250,
      bandwidth: 1200,
      maintenance: 400,
      misc: 200
    },
    uptime: 99.9,
    nodeType: 'INFERENCE'
  },
  {
    id: 'node-5',
    label: 'Supermicro node-002',
    location: 'Ames, Iowa, USA',
    city: 'Iowa',
    ruralKm: 150,
    ips: 80,
    utilization: 55,
    pricePerCallBase: 0.08,
    latencyTier: '25-50ms',
    status: 'ONLINE',
    cpuCores: 24,
    gpuModel: 'NVIDIA T4',
    memory: '64GB DDR4',
    costs: {
      energy: 90,
      bandwidth: 600,
      maintenance: 120,
      misc: 60
    },
    uptime: 96.5,
    nodeType: 'INFERENCE'
  },
  {
    id: 'node-6',
    label: 'Supermicro SYS-221GE',
    location: 'Downtown, Vancouver, CA',
    city: 'Vancouver',
    ruralKm: 0,
    ips: 420,
    utilization: 88,
    pricePerCallBase: 0.005,
    latencyTier: '<25ms',
    status: 'ONLINE',
    cpuCores: 48,
    gpuModel: 'NVIDIA H100 2-GPU',
    memory: '256GB DDR5',
    costs: {
      energy: 300,
      bandwidth: 1100,
      maintenance: 450,
      misc: 220
    },
    uptime: 99.2,
    nodeType: 'MEMORY'
  },
  {
    id: 'node-7',
    label: 'Supermicro AS-2025HS-TNR',
    location: 'Queen Street West, Toronto, CA',
    city: 'Toronto',
    ruralKm: 5,
    ips: 290,
    utilization: 76,
    pricePerCallBase: 0.005,
    latencyTier: '<25ms',
    status: 'ONLINE',
    cpuCores: 24,
    gpuModel: '2× RTX 6000 Ada',
    memory: '128GB DDR5',
    costs: {
      energy: 220,
      bandwidth: 950,
      maintenance: 300,
      misc: 180
    },
    uptime: 98.8,
    nodeType: 'MEMORY'
  }
];

export function useHostDashboard() {
  const [state, setState] = useState<HostDashboardState>(() => {
    const saved = localStorage.getItem('hostDashboardState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // If parsing fails, use default
      }
    }
    return {
      nodes: SAMPLE_NODES,
      selectedScenario: 'Median',
      currentYear: new Date().getFullYear()
    };
  });

  useEffect(() => {
    localStorage.setItem('hostDashboardState', JSON.stringify(state));
  }, [state]);

  const fleetMetrics = useMemo(() => {
    return calculateFleetMetrics(state.nodes, state.selectedScenario, state.currentYear);
  }, [state.nodes, state.selectedScenario, state.currentYear]);

  const updateScenario = (scenario: string) => {
    setState(prev => ({ ...prev, selectedScenario: scenario }));
  };

  const updateNode = (nodeId: string, updates: Partial<HostNode>) => {
    setState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  };

  const addNode = (node: HostNode) => {
    setState(prev => ({
      ...prev,
      nodes: [...prev.nodes, node]
    }));
  };

  const removeNode = (nodeId: string) => {
    setState(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId)
    }));
  };

  return {
    state,
    fleetMetrics,
    updateScenario,
    updateNode,
    addNode,
    removeNode
  };
}
