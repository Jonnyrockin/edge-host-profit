import { KPIDashboard } from '../components/simulation/KPIDashboard';
import { PresetsSection } from '../components/simulation/PresetsSection';
import { ControlsSection } from '../components/simulation/ControlsSection';
import { DeviceStack } from '../components/simulation/DeviceStack';
import { CostsSection } from '../components/simulation/CostsSection';
import { MathSection } from '../components/simulation/MathSection';
import { PricingPanel } from '../components/simulation/PricingPanel';
import { PremiumShowcase } from '../components/simulation/PremiumShowcase';
import { useSimulationState } from '../hooks/useSimulationState';

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
        {/* KPI Dashboard - Sticky Header */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Deployment Scenario */}
        <ControlsSection
          state={state}
          calculations={calculations}
          onStateChange={updateState}
          onResetToPreset={resetToPreset}
        />

        {/* Premium Positioning Showcase */}
        <PremiumShowcase state={state} onStateChange={updateState} />

        {/* Presets / Host Profile */}
        <PresetsSection 
          state={state}
          onApplyPreset={applyPreset}
        />

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