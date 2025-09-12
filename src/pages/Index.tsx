import React from 'react';
import { useSimulationState } from '../hooks/useSimulationState';
import { KPIDashboard } from '../components/simulation/KPIDashboard';
import { ControlsSection } from '../components/simulation/ControlsSection';
import { DeviceStack } from '../components/simulation/DeviceStack';
import { CostsSection } from '../components/simulation/CostsSection';
import { MathSection } from '../components/simulation/MathSection';
import { PricingPanel } from '../components/simulation/PricingPanel';
import { PresetsSection } from '../components/simulation/PresetsSection';
import { PremiumShowcase } from '../components/simulation/PremiumShowcase';
import { CallToAction } from '../components/simulation/CallToAction';
import { ESGPanel } from '../components/simulation/ESGPanel';

const Index = () => {
  const {
    state,
    calculations,
    updateState,
    applyPreset,
    addDevice,
    updateDevice,
    removeDevice,
    resetToPreset
  } = useSimulationState();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-panel md:p-6">
        <CallToAction />
        
        {/* KPI Dashboard - Sticky Header */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Deployment Scenario - 3/4 width */}
          <div className="lg:col-span-3">
            <ControlsSection
              state={state}
              calculations={calculations}
              onStateChange={updateState}
              onResetToPreset={resetToPreset}
            />
          </div>

          {/* Host Profile - 1/4 width */}
          <div className="lg:col-span-1">
            <PresetsSection 
              state={state}
              onApplyPreset={applyPreset}
            />
          </div>
        </div>

        {/* ESG Panel */}
        <ESGPanel state={state} onStateChange={updateState} />

        {/* Premium Positioning Showcase */}
        <PremiumShowcase state={state} onStateChange={updateState} />

        {/* Device Stack */}
        <DeviceStack
          devices={state.devices}
          state={state}
          calculations={calculations}
          onAddDevice={addDevice}
          onUpdateDevice={updateDevice}
          onRemoveDevice={removeDevice}
        />

        {/* Costs */}
        <CostsSection
          state={state}
          calculations={calculations}
          onStateChange={updateState}
        />

        {/* Pricing + Math in two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-panel mt-panel">
          <PricingPanel
            state={state}
            calculations={calculations}
            onStateChange={updateState}
          />
          <MathSection
            state={state}
            calculations={calculations}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;