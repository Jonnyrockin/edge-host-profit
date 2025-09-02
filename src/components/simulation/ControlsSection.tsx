import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SimulationState } from '../../types/simulation';
import { CITY_OPTIONS } from '../../data/constants';

interface ControlsSectionProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
  onResetToPreset: () => void;
}

export function ControlsSection({ state, onStateChange, onResetToPreset }: ControlsSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-4">
      <div className="text-lg font-semibold text-foreground">Controls</div>
      <div className="text-help text-sm mb-3">Tune assumptions (persisted in localStorage).</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        <div>
          <div className="text-help text-sm mb-2">City</div>
          <Select value={state.city} onValueChange={(value) => onStateChange({ city: value })}>
            <SelectTrigger className="bg-input border-input-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="text-help text-sm mb-2">Utilization (%)</div>
          <Slider
            value={[Math.round(state.util * 100)]}
            onValueChange={([value]) => onStateChange({ util: value / 100 })}
            min={10}
            max={100}
            step={1}
            className="mb-2"
          />
          <div className="text-sm text-foreground">{Math.round(state.util * 100)}%</div>
        </div>
        
        <div>
          <div className="text-help text-sm mb-2">Calls per Job</div>
          <Input
            type="number"
            min="1"
            step="1"
            value={state.callsPerJob}
            onChange={(e) => onStateChange({ callsPerJob: Math.max(1, parseInt(e.target.value) || 1) })}
            className="w-20 font-mono bg-input border-input-border"
          />
        </div>
        
        <div>
          <div className="text-help text-sm mb-2">Base price per call ($)</div>
          <Input
            type="number"
            min="0"
            step="0.0001"
            value={state.pricePerCallBase}
            onChange={(e) => onStateChange({ pricePerCallBase: Math.max(0, parseFloat(e.target.value) || 0) })}
            className="w-28 font-mono bg-input border-input-border"
          />
        </div>
        
        <div>
          <Button 
            variant="outline" 
            onClick={onResetToPreset}
            className="border-input-border hover:border-glass-border"
          >
            Reset to preset
          </Button>
        </div>
      </div>
    </div>
  );
}