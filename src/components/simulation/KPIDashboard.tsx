import { CalculationResult, SimulationState } from '../../types/simulation';
import { Button } from '../ui/button';
import { SCENARIOS } from '../../data/constants';
import { InfoTooltip } from '../ui/info-tooltip';
interface KPIDashboardProps {
  state: SimulationState;
  calculations: CalculationResult;
  onStateChange: (updates: Partial<SimulationState>) => void;
}
export function KPIDashboard({
  state,
  calculations,
  onStateChange
}: KPIDashboardProps) {
  return <div style={{
    backdropFilter: 'blur(35px)'
  }} className="bg-kpi-panel-bg border border-border p-panel-padding mb-panel sticky top-0 z-40 rounded-none bg-slate-300">
      <div className="flex items-center justify-between">
        <h1 className="text-background text-massive-title font-bold">
          Host Revenue Simulation
        </h1>
        <div className="flex items-center gap-md">
          <div className="flex gap-xs">
            {Object.keys(SCENARIOS).map(scenario => <Button key={scenario} variant={state.scenario === scenario ? "default" : "secondary"} size="sm" onClick={() => onStateChange({
            scenario
          })} className={state.scenario === scenario ? "bg-slider-blue text-white" : ""}>
                {scenario}
              </Button>)}
          </div>
          <div className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded font-mono">
            V5c
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-panel-gap mt-lg">
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Util (effective) <InfoTooltip content="Adjusted utilization incorporating lightweight VLM impacts: on-device shift (20% conservative) and ecosystem growth (20% annually). This reflects real demand accounting for edge AI evolution." /></div>
          <div className="text-headline font-semibold text-black">{Math.round(calculations.adjustedUtil * 100)}%</div>
          <div className="text-black text-core">VLM-adjusted</div>
        </div>
        
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Monthly Calls <InfoTooltip content="Total AI inference calls per month calculated from: Device IPS × Calls per job × Utilization rate × Seconds in month. Higher utilization means more calls and revenue." /></div>
          <div className="text-headline font-semibold text-black">{calculations.monthlyCalls.toLocaleString()}</div>
          <div className="text-black text-core">{state.devices.length} device rows</div>
        </div>
        
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Calls/Job (dynamic) <InfoTooltip content="Dynamic calls per job based on agentic AI evolution. Accounts for multi-step reasoning, tool-calling, and hybrid edge/cloud workflows. Increases with AI complexity over time." /></div>
          <div className="text-headline font-semibold text-black">{calculations.dynamicCallsPerJob.toFixed(1)}</div>
          <div className="text-black text-core">Agentic evolution</div>
        </div>
        
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Gross (per/mo) <InfoTooltip content={`Monthly gross revenue before fees and expenses. Calculated as: ${calculations.monthlyCalls.toLocaleString()} calls × $${calculations.pricePerCall.toFixed(6)} per call = $${Math.round(calculations.gross).toLocaleString()}`} /></div>
          <div className="text-headline font-semibold text-black">${Math.round(calculations.gross).toLocaleString()}</div>
          <div className="text-black text-core">${calculations.pricePerCall.toFixed(6)}/call</div>
        </div>
        
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Platform fee (25%)</div>
          <div className="text-headline font-semibold text-black">${Math.round(calculations.platformFee).toLocaleString()}</div>
          <div className="text-black text-core">fee = 25% of gross</div>
        </div>
        
        <div className="bg-kpi-card-bg border border-kpi-card-border rounded-lg p-panel-gap min-h-[86px] flex flex-col text-center">
          <div className="text-black text-core mb-1">Cash Net (per/mo) <InfoTooltip content="Final monthly profit after platform fees and operational expenses. Your actual take-home revenue." /></div>
          <div className="text-headline font-semibold text-black">${Math.round(calculations.cashNet).toLocaleString()}</div>
          <div className="text-black text-core">after 25% platform<br/>fee + OPEX</div>
        </div>
      </div>
    </div>;
}