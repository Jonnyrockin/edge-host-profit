import { CalculationResult, SimulationState } from '../../types/simulation';
import { Button } from '../ui/button';
import { SCENARIOS } from '../../data/constants';
import { InfoTooltip } from '../ui/info-tooltip';

interface KPIDashboardProps {
  state: SimulationState;
  calculations: CalculationResult;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function KPIDashboard({ state, calculations, onStateChange }: KPIDashboardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 md:p-6 mb-6 sticky top-0 z-40 backdrop-blur-glass">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">
          Host Revenue Simulation{' '}
          <span className="text-help font-normal">
            (<span>{state.scenario}</span>)
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Object.keys(SCENARIOS).map(scenario => (
              <Button
                key={scenario}
                variant={state.scenario === scenario ? "default" : "secondary"}
                size="sm"
                onClick={() => onStateChange({ scenario })}
                className={state.scenario === scenario ? "bg-slider-blue text-white" : ""}
              >
                {scenario}
              </Button>
            ))}
          </div>
          <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono">
            V5c
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-4">
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="flex items-center gap-1">
            <div className="text-help text-sm">Util (effective)</div>
            <InfoTooltip content="Actual utilization rate combining base utilization with scenario multipliers. Higher rates = more revenue." />
          </div>
          <div className="text-2xl font-semibold">{Math.round(calculations.util * 100)}%</div>
          <div className="text-help text-xs">Live</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="flex items-center gap-1">
            <div className="text-help text-sm">Monthly Calls</div>
            <InfoTooltip content="Total AI inference calls per month calculated from: Device IPS × Calls per job × Utilization rate × Seconds in month. Higher utilization means more calls and revenue." />
          </div>
          <div className="text-2xl font-semibold">{calculations.monthlyCalls.toLocaleString()}</div>
          <div className="text-help text-xs">{state.devices.length} device rows</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="flex items-center gap-1">
            <div className="text-help text-sm">Gross (per/mo)</div>
            <InfoTooltip content={`Monthly gross revenue before fees and expenses. Calculated as: ${calculations.monthlyCalls.toLocaleString()} calls × $${calculations.pricePerCall.toFixed(4)} per call = $${Math.round(calculations.gross).toLocaleString()}`} />
          </div>
          <div className="text-2xl font-semibold">${Math.round(calculations.gross).toLocaleString()}</div>
          <div className="text-help text-xs">${calculations.pricePerCall.toFixed(4)} /call</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Platform fee (25%)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.platformFee).toLocaleString()}</div>
          <div className="text-help text-xs">fee = 25% of gross</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">OPEX (per/mo)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.opex).toLocaleString()}</div>
          <div className="text-help text-xs">energy + rent + staff + misc + lic + fibre</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="flex items-center gap-1">
            <div className="text-help text-sm">Cash Net (per/mo)</div>
            <InfoTooltip content="Final monthly profit after platform fees and operational expenses. Your actual take-home revenue." />
          </div>
          <div className="text-2xl font-semibold">${Math.round(calculations.cashNet).toLocaleString()}</div>
          <div className="text-help text-xs">after 25% platform fee + OPEX</div>
        </div>
      </div>
    </div>
  );
}