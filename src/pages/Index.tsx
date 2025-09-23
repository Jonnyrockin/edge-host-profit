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
      <div className="w-full p-8">
        {/* CallToAction - Scrolls away */}
        <CallToAction />
        
        {/* KPI Dashboard - Becomes sticky when CallToAction scrolls out */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Main Layout with Test Panels */}
        <div className="grid grid-cols-14 gap-10 px-24">
          
          {/* Far Left Test Panel */}
          <div className="col-span-2">
            <div className="bg-card border border-border rounded-none p-panel-padding mb-panel">
              <div className="text-headline font-semibold text-foreground">Test Left</div>
            </div>
          </div>
          
          {/* Left Column - All Controls & Panels */}
          <div className="col-span-5 flex flex-col gap-5">
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
            
            <MathSection
              state={state}
              calculations={calculations}
            />
          </div>

          {/* Right Column - Device Stack */}
          <div className="col-span-5 flex flex-col gap-5">
            <DeviceStack
              devices={state.devices}
              state={state}
              calculations={calculations}
              onAddDevice={addDevice}
              onUpdateDevice={updateDevice}
              onRemoveDevice={removeDevice}
            />
            
            <PlatformRevenuePanel />
          </div>
          
          {/* Far Right Test Panel */}
          <div className="col-span-2">
            <div className="bg-card border border-border rounded-none p-panel-padding mb-panel">
              <div className="text-headline font-semibold text-foreground">Test Right</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;