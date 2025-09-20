import { useState, useCallback, useEffect } from 'react';
import { SimulationState, Device } from '../types/simulation';
import { PRESETS, FIBRE_PROVIDERS, ENERGY_PROVIDERS, CATALOG } from '../data/constants';
import { calculateRevenue, getSelectedFibreRate } from '../utils/calculations';

const LS_KEY = 'hex_v5c_state_v2'; // Updated for new pricing model

const defaultState: SimulationState = {
  city: 'Toronto',
  rural: 0,
  scenario: 'Median',
  util: 0.20,  // Conservative 20% utilization aligned with edge AI knowledge
  callsPerJob: 2,
  callsPerDay: 50000,
  jobsPerDay: 25000,
  secondsInMonth: 30 * 24 * 60 * 60,
  pricePerCallBase: 0.008,  // Fixed: More realistic base price (was 0.02)
  devices: [{ id: 'dell-precision-7920', vendor: 'Dell', label: 'Precision 7920 Rack', ips: 60, latencyTier: '50–100ms', qty: 3, tops: 1000, price: 0, cpuCores: '2× Xeon Scalable (2×28)', maxGpus: 'Up to 3× GPUs (RTX6000)', memory: '1.5 TB DDR4', formFactor: '2U', category: 'inference' }],
  costs: { energy: 1600, rent: 900, staff: 700, misc: 200, insurance: 150, maintenance: 120, licenses: 250, fibre: 180, legal: 300 },
  connectivityProvider: 'Bell Business Fibre 1G',
  linkRate: true,
  energyProvider: 'Toronto Hydro (regulated)',
  greenUplift: 0,
  greenPremium: 2,
  esgEnabled: false,
  esgFile: undefined,
  inferenceProvider: 'openai',
  inferenceModel: 'gpt-4o-mini',
  baseInferencePrice: 0.375,
  baselineCloudPrice: 0.00076,
  premiumMultiplier: 8,
  baselineProvider: 'market-average',
};

export function useSimulationState() {
  const [state, setState] = useState<SimulationState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<SimulationState>) => {
    setState(prevState => {
      const newState = { ...prevState, ...updates };
      
      // Handle city change - update providers
      if (updates.city && updates.city !== prevState.city) {
        const fibreProviders = FIBRE_PROVIDERS[updates.city] || [];
        const energyProviders = ENERGY_PROVIDERS[updates.city] || [];
        
        newState.connectivityProvider = fibreProviders[0]?.name || '';
        newState.energyProvider = energyProviders[0]?.name || '';
        
        // Auto-update costs when city changes
        if (newState.linkRate && fibreProviders[0]?.rate) {
          newState.costs = { ...newState.costs, fibre: fibreProviders[0].rate };
        }
        if (energyProviders[0]?.rate) {
          const monthlyKwh = 13333; // Standard business usage
          newState.costs = { ...newState.costs, energy: Math.round(monthlyKwh * energyProviders[0].rate) };
        }
      }
      
      // Handle link rate change
      if (updates.linkRate !== undefined && updates.linkRate) {
        const rate = getSelectedFibreRate(newState);
        newState.costs = { ...newState.costs, fibre: rate };
      }
      
      // Handle energy provider change
      if (updates.energyProvider && updates.energyProvider !== prevState.energyProvider) {
        const energyProviders = ENERGY_PROVIDERS[newState.city] || [];
        const provider = energyProviders.find(p => p.name === updates.energyProvider);
        if (provider?.rate) {
          // Calculate monthly energy cost based on assumed 13,333 kWh usage (from $1600 at $0.12/kWh)
          const monthlyKwh = 13333; 
          newState.costs = { ...newState.costs, energy: Math.round(monthlyKwh * provider.rate) };
        }
      }
      
      return newState;
    });
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setState(prevState => ({
      ...prevState,
      devices: JSON.parse(JSON.stringify(preset.cfg.devices)),
      util: preset.cfg.util,
      callsPerJob: preset.cfg.callsPerJob,
      rural: preset.cfg.rural,
      costs: { ...preset.cfg.costs }
    }));
  }, []);

  const addDevice = useCallback((deviceId: string) => {
    const catalogDevice = CATALOG.find(d => d.id === deviceId);
    if (!catalogDevice) return;

    setState(prevState => {
      const existingDevice = prevState.devices.find(d => d.id === deviceId);
      if (existingDevice) {
        return {
          ...prevState,
          devices: prevState.devices.map(d =>
            d.id === deviceId ? { ...d, qty: d.qty + 1 } : d
          )
        };
      } else {
        return {
          ...prevState,
          devices: [...prevState.devices, { ...catalogDevice, qty: 1 }]
        };
      }
    });
  }, []);

  const updateDevice = useCallback((deviceId: string, updates: Partial<Device>) => {
    setState(prevState => ({
      ...prevState,
      devices: prevState.devices.map(d =>
        d.id === deviceId ? { ...d, ...updates } : d
      )
    }));
  }, []);

  const removeDevice = useCallback((deviceId: string) => {
    setState(prevState => ({
      ...prevState,
      devices: prevState.devices.filter(d => d.id !== deviceId)
    }));
  }, []);

  const resetToPreset = useCallback(() => {
    applyPreset('mid_market_tv');
  }, [applyPreset]);

  const calculations = calculateRevenue(state);

  return {
    state,
    calculations,
    updateState,
    applyPreset,
    addDevice,
    updateDevice,
    removeDevice,
    resetToPreset
  };
}