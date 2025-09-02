import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Upload } from 'lucide-react';
import { SimulationState } from '../../types/simulation';
import { CITY_OPTIONS, SCENARIOS } from '../../data/constants';
import { ruralFactorFromKm } from '../../utils/calculations';

interface ControlsSectionProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
  onResetToPreset: () => void;
}

export function ControlsSection({ state, onStateChange, onResetToPreset }: ControlsSectionProps) {
  const handleRuralClick = (km: number) => {
    const ruralFactor = ruralFactorFromKm(km) - 1;
    onStateChange({ rural: ruralFactor });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onStateChange({ esgFile: file.name });
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-4">
      <div className="text-lg font-semibold text-foreground">Deployment Scenario</div>
      <div className="text-help text-sm mb-3">Tune assumptions (persisted in localStorage).</div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <div>
          <div className="text-help text-sm mb-2">Scenario</div>
          <Select value={state.scenario} onValueChange={(value) => {
            const scenario = SCENARIOS[value as keyof typeof SCENARIOS];
            onStateChange({ 
              scenario: value,
              callsPerJob: scenario?.callsPerJob || state.callsPerJob
            });
          }}>
            <SelectTrigger className="bg-input border-input-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(SCENARIOS).map(scenario => (
                <SelectItem key={scenario} value={scenario}>{scenario}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
          <div className="text-xs text-muted-foreground mt-1">
            Scenario: {SCENARIOS[state.scenario as keyof typeof SCENARIOS]?.callsPerJob || 'N/A'}
          </div>
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
      
      {/* Rural Offset and ESG Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 pt-4 border-t border-border">
        <div>
          <div className="text-help text-sm mb-2">Rural offset presets</div>
          <div className="grid grid-cols-6 gap-1">
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
        </div>
        
        <div>
          <div className="text-help text-sm mb-2">ESG Compliance</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="esg-enabled"
                checked={state.esgEnabled}
                onCheckedChange={(checked) => onStateChange({ esgEnabled: !!checked })}
              />
              <Label htmlFor="esg-enabled" className="text-sm">Enable ESG (+10% premium)</Label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="esg-file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('esg-file')?.click()}
                className="flex items-center gap-1 border-input-border hover:border-glass-border"
              >
                <Upload className="h-3 w-3" />
                Upload ESG Cert
              </Button>
              {state.esgFile && (
                <span className="text-xs text-help">{state.esgFile}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}