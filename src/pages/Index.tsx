import React from 'react';
import { useSimulationState } from '../hooks/useSimulationState';
import { KPIDashboard } from '../components/simulation/KPIDashboard';
import { ControlsSection } from '../components/simulation/ControlsSection';
import { DeviceStack } from '../components/simulation/DeviceStack';
import { CostsSection } from '../components/simulation/CostsSection';
import { MathSection } from '../components/simulation/MathSection';
import { PresetsSection } from '../components/simulation/PresetsSection';
import { PremiumShowcase } from '../components/simulation/PremiumShowcase';
import { CallToAction } from '../components/simulation/CallToAction';

import { PlatformRevenuePanel } from '../components/simulation/PlatformRevenuePanel';

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
      <div className="w-full p-4">
        {/* CallToAction - Scrolls away */}
        <CallToAction />
        
        {/* KPI Dashboard - Becomes sticky when CallToAction scrolls out */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Main 2-Column Layout - 50% each */}
        <div className="grid grid-cols-12 gap-4">
          
          {/* Left Column - All Controls & Panels */}
          <div className="col-span-6 flex flex-col gap-4">
            <ControlsSection
              state={state}
              calculations={calculations}
              onStateChange={updateState}
              onResetToPreset={resetToPreset}
            />
            
            <PremiumShowcase state={state} onStateChange={updateState} />
            
            <CostsSection
              state={state}
              calculations={calculations}
              onStateChange={updateState}
            />
            
            <ESGPanel state={state} onStateChange={updateState} />
            
            <PlatformRevenuePanel />
            
            <MathSection
              state={state}
              calculations={calculations}
            />
          </div>

          {/* Right Column - Device Stack */}
          <div className="col-span-6 flex flex-col gap-4">
            <DeviceStack
              devices={state.devices}
              state={state}
              calculations={calculations}
              onAddDevice={addDevice}
              onUpdateDevice={updateDevice}
              onRemoveDevice={removeDevice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;