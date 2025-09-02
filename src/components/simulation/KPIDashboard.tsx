import { CalculationResult, SimulationState } from '../../types/simulation';

interface KPIDashboardProps {
  state: SimulationState;
  calculations: CalculationResult;
}

export function KPIDashboard({ state, calculations }: KPIDashboardProps) {
  return (
    <div className="bg-glass border border-glass-border rounded-2xl p-4 md:p-6 mb-6 sticky top-0 z-40 backdrop-blur-glass">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground">
          Host Revenue Simulation{' '}
          <span className="text-help font-normal">
            (<span>{state.scenario}</span>)
          </span>
        </h1>
        <div className="text-xs bg-chip text-chip-foreground px-2 py-1 rounded font-mono">
          V5c
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-4">
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Util (effective)</div>
          <div className="text-2xl font-semibold">{Math.round(calculations.util * 100)}%</div>
          <div className="text-help text-xs">Live</div>
        </div>
        
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Monthly Calls</div>
          <div className="text-2xl font-semibold">{calculations.monthlyCalls.toLocaleString()}</div>
          <div className="text-help text-xs">{state.devices.length} device rows</div>
        </div>
        
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Gross (per/mo)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.gross).toLocaleString()}</div>
          <div className="text-help text-xs">${calculations.pricePerCall.toFixed(4)} /call</div>
        </div>
        
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Platform fee (25%)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.platformFee).toLocaleString()}</div>
          <div className="text-help text-xs">fee = 25% of gross</div>
        </div>
        
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">OPEX (per/mo)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.opex).toLocaleString()}</div>
          <div className="text-help text-xs">energy + rent + staff + misc + lic + fibre</div>
        </div>
        
        <div className="bg-kpi text-kpi-foreground rounded-xl p-3 min-h-[86px] flex flex-col">
          <div className="text-help text-sm">Cash Net (per/mo)</div>
          <div className="text-2xl font-semibold">${Math.round(calculations.cashNet).toLocaleString()}</div>
          <div className="text-help text-xs">after 25% platform fee + OPEX</div>
        </div>
      </div>
    </div>
  );
}