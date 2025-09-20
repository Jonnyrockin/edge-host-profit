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
import { JobsPerDayPanel } from '../components/simulation/JobsPerDayPanel';
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
    <div className="h-screen bg-background text-foreground overflow-hidden">
      <div className="w-full h-full p-4">
        <CallToAction />
        
        {/* KPI Dashboard - Fixed Header */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Main 34" Wide Screen Layout - No Scrolling */}
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)]">
          
          {/* Left Column - Controls & Device Stack */}
          <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              <ControlsSection
                state={state}
                calculations={calculations}
                onStateChange={updateState}
                onResetToPreset={resetToPreset}
              />
            </div>
            
            <div className="flex-1 min-h-0">
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

          {/* Center Column - Costs, ESG, Platform Revenue */}
          <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              <CostsSection
                state={state}
                calculations={calculations}
                onStateChange={updateState}
              />
            </div>
            
            <div className="flex-shrink-0">
              <ESGPanel state={state} onStateChange={updateState} />
            </div>
            
            <div className="flex-shrink-0">
              <PlatformRevenuePanel />
            </div>
          </div>

          {/* Right Column - Presets, Jobs, Premium, Math */}
          <div className="col-span-4 flex flex-col gap-4 overflow-hidden">
            <div className="flex-shrink-0">
              <PresetsSection 
                state={state}
                onApplyPreset={applyPreset}
              />
            </div>
            
            <div className="flex-shrink-0">
              <JobsPerDayPanel state={state} onStateChange={updateState} />
            </div>
            
            <div className="flex-shrink-0">
              <PremiumShowcase state={state} onStateChange={updateState} />
            </div>
            
            <div className="flex-1 min-h-0">
              <MathSection
                state={state}
                calculations={calculations}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;