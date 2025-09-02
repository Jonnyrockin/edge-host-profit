import { Button } from '../ui/button';
import { SimulationState } from '../../types/simulation';
import { PRESETS, SCENARIOS } from '../../data/constants';
import { ruralFactorFromKm } from '../../utils/calculations';

interface PresetsSectionProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
  onApplyPreset: (presetId: string) => void;
}

export function PresetsSection({ state, onStateChange, onApplyPreset }: PresetsSectionProps) {
  const handleRuralClick = (km: number) => {
    const ruralFactor = ruralFactorFromKm(km) - 1;
    onStateChange({ rural: ruralFactor });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Presets */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-lg font-semibold mb-1 text-foreground">Presets</div>
        <div className="text-help mb-3 text-sm">Quick-start configurations (devices, utilization, costs).</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

      {/* Scenarios */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-lg font-semibold mb-1 text-foreground">Scenarios</div>
        <div className="text-help mb-3 text-sm">Compare conservative / median / optimistic outcomes.</div>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(SCENARIOS).map(scenario => (
            <Button
              key={scenario}
              variant={state.scenario === scenario ? "default" : "secondary"}
              size="sm"
              onClick={() => onStateChange({ scenario })}
              className="bg-chip text-chip-foreground rounded px-2 py-1 text-sm"
            >
              {scenario}
            </Button>
          ))}
        </div>
        <div className="text-help text-xs mt-3">Rural offset presets</div>
        <div className="grid grid-cols-6 gap-1 mt-1">
          {[0, 50, 100, 200, 300, 500].map(km => (
            <Button
              key={km}
              variant="outline"
              size="sm"
              onClick={() => handleRuralClick(km)}
              className="px-2 py-1 border-input-border hover:border-glass-border text-sm"
              title={km === 0 ? 'City core (no rural premium)' : `${km}km from core (adds premium)`}
            >
              {km === 0 ? 'Core' : `${km}km`}
            </Button>
          ))}
        </div>
        <div className="text-help text-xs mt-2">
          Latest Edge Price: <span className="text-foreground">—</span> $/call
        </div>
      </div>

      {/* Host Profile */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="text-lg font-semibold mb-1 text-foreground">Host profile</div>
        <div className="text-help mb-2 text-sm">Auto-filled from your current selections.</div>
        <div className="space-y-1 text-sm">
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