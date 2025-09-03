import { Button } from '../ui/button';
import { SimulationState } from '../../types/simulation';
import { PRESETS } from '../../data/constants';

interface PresetsSectionProps {
  state: SimulationState;
  onApplyPreset: (presetId: string) => void;
}

export function PresetsSection({ state, onApplyPreset }: PresetsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-panel mb-panel">
      {/* Presets */}
      <div className="bg-card border border-border rounded-2xl p-panel-padding">
        <div className="text-headline font-semibold mb-xs text-foreground">Presets</div>
        <div className="text-help mb-panel-gap text-core">Quick-start configurations (devices, utilization, costs).</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {PRESETS.map(preset => (
            <Button
              key={preset.id}
              variant="outline"
              onClick={() => onApplyPreset(preset.id)}
              className="text-left h-auto p-2 border-input-border hover:border-glass-border"
              title={preset.desc}
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Host Profile */}
      <div className="bg-card border border-border rounded-2xl p-panel-padding">
        <div className="text-headline font-semibold mb-xs text-foreground">Host profile</div>
        <div className="text-help mb-md text-core">Auto-filled from your current selections.</div>
        <div className="space-y-xs text-core">
          <div>
            <span className="text-help">Geo:</span> City: {state.city}
          </div>
          <div>
            <span className="text-help">Inventory:</span> {state.devices.map(d => `${d.qty}× ${d.label}`).join(', ')} • {state.devices.reduce((sum, d) => sum + d.ips * d.qty, 0)} IPS
          </div>
          <div>
            <span className="text-help">Tiers:</span> {state.devices.map(d => d.latencyTier).join(', ')}
          </div>
          <div>
            <span className="text-help">Costs & Deductibles:</span> OPEX ${Math.round(state.costs.energy + state.costs.rent + state.costs.staff + state.costs.misc + state.costs.insurance + state.costs.maintenance + state.costs.licenses + state.costs.fibre).toLocaleString()}/mo
          </div>
        </div>
      </div>
    </div>
  );
}