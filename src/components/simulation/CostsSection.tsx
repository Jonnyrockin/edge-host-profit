import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { SimulationState, CalculationResult } from '../../types/simulation';
import { FIBRE_PROVIDERS, ENERGY_PROVIDERS } from '../../data/constants';

interface CostsSectionProps {
  state: SimulationState;
  calculations: CalculationResult;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function CostsSection({ state, calculations, onStateChange }: CostsSectionProps) {
  const fibreProviders = FIBRE_PROVIDERS[state.city] || [];
  const energyProviders = ENERGY_PROVIDERS[state.city] || [];

  const handleCostChange = (key: keyof SimulationState['costs'], value: number) => {
    onStateChange({
      costs: {
        ...state.costs,
        [key]: value
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 lg:col-span-2 relative">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold text-foreground">Costs</div>
          <div className="text-help text-sm mb-3">Expanded monthly operating costs. Common aware.</div>
        </div>
        <div className="absolute top-4 right-4 text-right">
          <div className="text-lg text-warning font-semibold">
            ${Math.round(calculations.opex * 12).toLocaleString()}
          </div>
          <div className="text-xs text-help">Estimated Annual OPEX</div>
        </div>
      </div>

      {/* Connectivity */}
      <div className="mt-2">
        <div className="font-semibold text-foreground">Connectivity</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mt-2">
          <div>
            <div className="text-help text-sm mb-2">Business Fibre Provider</div>
            <Select 
              value={state.connectivityProvider} 
              onValueChange={(value) => onStateChange({ connectivityProvider: value })}
            >
              <SelectTrigger className="bg-input border-input-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fibreProviders.map(provider => (
                  <SelectItem key={provider.name} value={provider.name}>
                    {provider.name} — ${provider.rate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-help text-sm mb-2">Fibre (per/mo)</div>
            <Input
              type="number"
              min="0"
              step="10"
              value={state.costs.fibre}
              onChange={(e) => handleCostChange('fibre', parseFloat(e.target.value) || 0)}
              className="w-30 font-mono bg-input border-input-border"
            />
          </div>
          <div className="col-span-2 flex items-center gap-2 mt-6">
            <Checkbox
              id="link-rate"
              checked={state.linkRate}
              onCheckedChange={(checked) => onStateChange({ linkRate: !!checked })}
            />
            <label htmlFor="link-rate" className="text-help text-sm">
              Link cost to provider rate
            </label>
          </div>
        </div>
      </div>

      {/* Energy */}
      <div className="mt-6">
        <div className="font-semibold text-foreground">Energy</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-3 items-end mt-2">
          <div className="md:col-span-2">
            <div className="text-help text-sm mb-2">Energy Provider</div>
            <Select 
              value={state.energyProvider} 
              onValueChange={(value) => onStateChange({ energyProvider: value })}
            >
              <SelectTrigger className="bg-input border-input-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {energyProviders.map(provider => (
                  <SelectItem key={provider.name} value={provider.name}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-help text-sm mb-2">Green uplift (%)</div>
            <Input
              type="number"
              min="0"
              step="1"
              value={state.greenUplift}
              onChange={(e) => onStateChange({ greenUplift: parseFloat(e.target.value) || 0 })}
              className="w-24 font-mono bg-input border-input-border"
              title="Uplift = usage % from renewables (not a price markup)"
            />
          </div>
          <div>
            <div className="text-help text-sm mb-2">Green premium (%)</div>
            <Input
              type="number"
              min="0"
              step="1"
              value={state.greenPremium}
              onChange={(e) => onStateChange({ greenPremium: parseFloat(e.target.value) || 0 })}
              className="w-24 font-mono bg-input border-input-border"
              title="Premium = price markup due to green sourcing"
            />
          </div>
        </div>
      </div>

      {/* OPEX Lines */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3 items-end mt-6">
        <div>
          <div className="text-help text-sm mb-2">Energy (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="50"
            value={state.costs.energy}
            onChange={(e) => handleCostChange('energy', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Rent (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="50"
            value={state.costs.rent}
            onChange={(e) => handleCostChange('rent', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Staff (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="50"
            value={state.costs.staff}
            onChange={(e) => handleCostChange('staff', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Misc (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="25"
            value={state.costs.misc}
            onChange={(e) => handleCostChange('misc', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Insurance (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="25"
            value={state.costs.insurance}
            onChange={(e) => handleCostChange('insurance', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Maintenance (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="25"
            value={state.costs.maintenance}
            onChange={(e) => handleCostChange('maintenance', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
        <div>
          <div className="text-help text-sm mb-2">Licenses / SaaS (per/mo)</div>
          <Input
            type="number"
            min="0"
            step="25"
            value={state.costs.licenses}
            onChange={(e) => handleCostChange('licenses', parseFloat(e.target.value) || 0)}
            className="w-30 font-mono bg-input border-input-border"
          />
        </div>
      </div>

      {/* Totals */}
      <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-x-6 gap-y-3">
        <div>
          <div className="text-help">Platform fee (HyperEdgeX)</div>
          <div className="px-2 py-1 inline-block bg-secondary border border-border rounded text-secondary-foreground select-none">
            25% (fixed)
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Connectivity Subtotal:
          <span className="text-foreground font-semibold ml-1">
            ${Math.round(calculations.fibreCost).toLocaleString()}
          </span>
        </div>
        <div className="text-lg text-muted-foreground">
          Estimated Monthly OPEX:
          <span className="text-foreground font-semibold ml-1">
            ${Math.round(calculations.opex).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}