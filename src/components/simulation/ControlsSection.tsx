import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Upload } from 'lucide-react';
import { SimulationState, CalculationResult } from '../../types/simulation';
import { CITY_OPTIONS, SCENARIOS } from '../../data/constants';
import { ruralFactorFromKm } from '../../utils/calculations';
import { InfoTooltip } from '../ui/info-tooltip';
interface ControlsSectionProps {
  state: SimulationState;
  calculations: CalculationResult;
  onStateChange: (updates: Partial<SimulationState>) => void;
  onResetToPreset: () => void;
}
export function ControlsSection({
  state,
  calculations,
  onStateChange,
  onResetToPreset
}: ControlsSectionProps) {
  const handleRuralClick = (km: number) => {
    // Store the full multiplier minus 1 (so 0 = no premium, 1 = 2x premium, etc)
    const ruralFactor = ruralFactorFromKm(km) - 1;
    onStateChange({
      rural: ruralFactor
    });
  };

  // Determine which rural button is active based on current rural value
  const getCurrentRuralKm = () => {
    const currentFactor = state.rural + 1;
    if (currentFactor <= 1.0) return 0;
    if (currentFactor <= 1.5) return 50;
    if (currentFactor <= 2.0) return 100;
    if (currentFactor <= 2.5) return 200;
    if (currentFactor <= 3.0) return 300;
    return 500;
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onStateChange({
        esgFile: file.name
      });
    }
  };
  return <div className="bg-card border border-border p-panel-padding mb-panel rounded-none">
      <div className="text-headline font-semibold text-foreground">Deployment Scenario</div>
      <div className="text-help text-core mb-panel-gap">Configure your edge AI deployment parameters and operational assumptions.</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-lg items-center">
        <div>
          <div className="flex items-center gap-md">
            <div className="text-help text-core mb-md">City</div>
            <InfoTooltip content="Geographic location affects baseline pricing, available connectivity providers, and energy costs." />
          </div>
          <Select value={state.city} onValueChange={value => onStateChange({
          city: value
        })}>
            <SelectTrigger className="bg-input border-input-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex items-center gap-md">
            <div className="text-help text-core mb-md">Utilization (%)</div>
            <InfoTooltip content="Base utilization percentage gets multiplied by scenario factor. Conservative=0.9×, Median=1.0×, Optimistic=1.1×" />
          </div>
          <div className="flex items-center gap-md">
            <Slider value={[Math.round(state.util * 100)]} onValueChange={([value]) => onStateChange({
            util: value / 100
          })} min={10} max={100} step={1} className="flex-1" />
            <div className="text-core text-foreground font-semibold">
              {Math.round(state.util * 100)}% → {Math.round(calculations.util * 100)}%
            </div>
          </div>
        </div>
        
        <div className="ml-5">
          <div className="flex items-center gap-md">
            <div className="text-help text-core mb-md">Calls per Job</div>
            <InfoTooltip content="How many AI inference calls each customer job requires. Complex tasks need more calls." />
          </div>
          <Input type="number" min="1" step="1" value={state.callsPerJob} onChange={e => onStateChange({
          callsPerJob: Math.max(1, parseInt(e.target.value) || 1)
        })} className="w-20 font-mono bg-input border-input-border" />
        </div>
        
        <div>
          <div className="flex items-center gap-md">
            <div className="text-help text-core mb-md">Calls per Day</div>
            <InfoTooltip content="Total AI inference calls processed per day across all jobs and customers." />
          </div>
          <Input type="number" min="1" step="1000" value={state.callsPerDay || 50000} onChange={e => onStateChange({
          callsPerDay: Math.max(1, parseInt(e.target.value) || 50000)
        })} className="w-24 font-mono bg-input border-input-border" />
        </div>
        
        <div>
          <div className="flex items-center gap-md">
            <div className="text-help text-core mb-md">Base price per call ($)</div>
            <InfoTooltip content="Starting price before applying location, rural, and premium multipliers. This sets your baseline pricing strategy." />
          </div>
          <Input type="number" min="0" step="0.0001" value={state.pricePerCallBase} onChange={e => onStateChange({
          pricePerCallBase: Math.max(0, parseFloat(e.target.value) || 0)
        })} className="w-28 font-mono bg-input border-input-border" />
        </div>
      </div>
      
      {/* Rural Offset Section */}
      <div className="mt-xl pt-lg border-t border-border">
        <div className="flex items-center gap-md">
          <div className="text-help text-core mb-md">Rural offset presets</div>
          <InfoTooltip content="Distance from city center adds pricing premium due to higher infrastructure costs and lower competition." />
        </div>
        <div className="grid grid-cols-6 gap-xs">
          {[0, 50, 100, 200, 300, 500].map(km => {
          const isActive = getCurrentRuralKm() === km;
          return <Button key={km} variant="outline" size="sm" onClick={() => handleRuralClick(km)} className={`px-2 py-1 border-input-border hover:border-glass-border text-core ${isActive ? 'bg-slider-blue text-white border-slider-blue' : ''}`} title={km === 0 ? 'City core (no rural premium)' : km === 50 ? '50km: Suburban edge (+50% premium)' : km === 100 ? '100km: Rural edge (2x premium - scarcity)' : km === 200 ? '200km: Agricultural edge (2.5x premium)' : km === 300 ? '300km: Remote rural (3x premium)' : '500km: Deep rural/agriculture (4x premium)'}>
                {km === 0 ? 'Core' : `${km}km`}
              </Button>;
        })}
        </div>
      </div>
    </div>;
}