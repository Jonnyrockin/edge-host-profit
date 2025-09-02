import { KPIDashboard } from '../components/simulation/KPIDashboard';
import { PresetsSection } from '../components/simulation/PresetsSection';
import { ControlsSection } from '../components/simulation/ControlsSection';
import { DeviceStack } from '../components/simulation/DeviceStack';
import { CostsSection } from '../components/simulation/CostsSection';
import { MathSection } from '../components/simulation/MathSection';
import { PricingPanel } from '../components/simulation/PricingPanel';
import { InferenceProviderSection } from '../components/simulation/InferenceProviderSection';
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
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* KPI Dashboard - Sticky Header */}
        <KPIDashboard state={state} calculations={calculations} onStateChange={updateState} />

        {/* Presets / Host Profile */}
        <PresetsSection 
          state={state}
          onApplyPreset={applyPreset}
        />

        {/* Deployment Scenario */}
        <ControlsSection
          state={state}
          onStateChange={updateState}
          onResetToPreset={resetToPreset}
        />

        {/* Device Stack */}
        <DeviceStack
          devices={state.devices}
          onAddDevice={addDevice}
          onUpdateDevice={updateDevice}
          onRemoveDevice={removeDevice}
        />

        {/* Inference Provider Selection */}
        <InferenceProviderSection
          state={state}
          onStateChange={updateState}
        />

        {/* Costs + Math + Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
          <CostsSection
            state={state}
            calculations={calculations}
            onStateChange={updateState}
          />
          <MathSection
            state={state}
            calculations={calculations}
          />
          <PricingPanel
            state={state}
            calculations={calculations}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;