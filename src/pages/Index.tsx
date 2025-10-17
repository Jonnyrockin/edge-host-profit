import React, { useState } from 'react';
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
import { HardwareUploadPanel } from '../components/simulation/HardwareUploadPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sidebar } from '../components/layout/Sidebar';
import HostDashboard from './HostDashboard';

const Index = () => {
  const [sidebarSection, setSidebarSection] = useState('dashboard');
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
    <div className="flex min-h-screen bg-background text-foreground w-full">
      {/* Sidebar - Always Visible */}
      <Sidebar activeSection={sidebarSection} onSectionChange={setSidebarSection} />
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="mb-6 bg-muted">
            <TabsTrigger value="simulation" className="text-lg px-6">Revenue Host Simulation</TabsTrigger>
            <TabsTrigger value="host" className="text-lg px-6">Host Dashboard (5+ Nodes)</TabsTrigger>
          </TabsList>

          <TabsContent value="simulation">
            {/* CallToAction - Scrolls away */}
            <CallToAction />
            
            {/* KPI Dashboard - Becomes sticky when CallToAction scrolls out */}
            <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

            {/* Main 2-Column Layout - 50% each */}
            <div className="grid grid-cols-12 gap-5">
              
              {/* Left Column - All Controls & Panels */}
              <div className="col-span-6 flex flex-col gap-5">
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
                
                <PlatformRevenuePanel />
              </div>

              {/* Right Column - Device Stack */}
              <div className="col-span-6 flex flex-col gap-5">
                <DeviceStack
                  devices={state.devices}
                  state={state}
                  calculations={calculations}
                  onAddDevice={addDevice}
                  onUpdateDevice={updateDevice}
                  onRemoveDevice={removeDevice}
                />
                
                <HardwareUploadPanel />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="host">
            <HostDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;