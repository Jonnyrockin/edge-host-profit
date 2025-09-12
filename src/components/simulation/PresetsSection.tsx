import { Button } from '../ui/button';
import { SimulationState } from '../../types/simulation';
import { PRESETS } from '../../data/constants';
interface PresetsSectionProps {
  state: SimulationState;
  onApplyPreset: (presetId: string) => void;
}
export function PresetsSection({
  state,
  onApplyPreset
}: PresetsSectionProps) {
  return (
    <div className="bg-card border border-border p-panel-padding rounded-2xl w-full">
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
  );
}