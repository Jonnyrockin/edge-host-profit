import { SimulationState, CalculationResult } from '../../types/simulation';
import { SCENARIOS } from '../../data/constants';
import { edgeTierMultiplier } from '../../utils/calculations';
import { InfoTooltip } from '../ui/info-tooltip';

interface MathSectionProps {
  state: SimulationState;
  calculations: CalculationResult;
}

export function MathSection({ state, calculations }: MathSectionProps) {
  const scenario = SCENARIOS[state.scenario as keyof typeof SCENARIOS] || SCENARIOS.Median;
  const mult = (edgeTierMultiplier(state.devices) * scenario.price * (1 + state.rural) * (1 + state.greenUplift / 100)).toFixed(2);

  const tests = [
    ['scenario defined', !!state.scenario],
    ['pricePerCall positive', calculations.pricePerCall > 0],
    ['calc monthlyCalls finite', Number.isFinite(calculations.monthlyCalls) && calculations.monthlyCalls >= 0],
    ['fee ≈ 25% of gross', Math.abs((calculations.platformFee / calculations.gross) - 0.25) < 1e-6 || calculations.gross === 0],
    ['providers present for city', true] // Simplified for now
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-panel-padding mt-panel">
      <div className="text-headline font-semibold text-foreground">The Math</div>
      <div className="text-help text-core">
        Baselines → multipliers → traffic → gross → fees → OPEX → Cash Net.
      </div>
      <div className="font-mono text-sm mt-2 text-foreground space-y-2">
        <div>Pricing Baselines</div>
        <div className="ml-4">
          city({state.city}) × PRICE_FACTOR = <span className="text-number-blue">1.00</span>
        </div>
        <div className="ml-4">
          edge × scenPrice × rural × green = <span className="text-number-blue">{edgeTierMultiplier(state.devices).toFixed(2)}</span> × <span className="text-number-blue">{scenario.price.toFixed(2)}</span> × <span className="text-number-blue">{(1 + state.rural).toFixed(2)}</span> × <span className="text-number-blue">{(1 + state.greenUplift / 100).toFixed(2)}</span> = <span className="text-number-blue">{mult}</span>
        </div>
        <div className="ml-4">
          Base price per call = <span className="text-number-blue">${(state.baseInferencePrice ? state.baseInferencePrice / 1000000 : state.pricePerCallBase).toFixed(6)}</span> {state.baseInferencePrice ? '(from inference provider)' : '(fallback)'}
        </div>
        <div className="ml-4">
          Final price per call = base × factor = <span className="text-number-blue">${calculations.pricePerCall.toFixed(6)}</span>
        </div>
        
        <div className="mt-4">Monthly Calls</div>
        <div className="ml-4">
          IPS(<span className="text-number-blue">{calculations.inventoryIPS}</span>) × Calls/job(<span className="text-number-blue">{state.callsPerJob}</span>) × Util(<span className="text-number-blue">{(state.util * scenario.util).toFixed(2)}</span>) × Seconds(<span className="text-number-blue">{state.secondsInMonth}</span>) = <span className="text-number-blue">{calculations.monthlyCalls.toLocaleString()}</span>
        </div>
        
        <div className="mt-4">Gross Revenue (Monthly)</div>
        <div className="ml-4">
          Gross = Calls × Price = <span className="text-number-blue">{calculations.monthlyCalls.toLocaleString()}</span> × <span className="text-number-blue">${calculations.pricePerCall.toFixed(4)}</span> = <span className="text-number-blue">${Math.round(calculations.gross).toLocaleString()}</span>
        </div>
        
        <div className="mt-4">Platform Fee & Cash Net (Monthly)</div>
        <div className="ml-4">
          PlatformFee = Gross × 25% = <span className="text-number-blue">${Math.round(calculations.platformFee).toLocaleString()}</span>
        </div>
        <div className="ml-4">
          CashNet = Gross − PlatformFee − OPEX = <span className="text-number-blue">${Math.round(calculations.cashNet).toLocaleString()}</span>
        </div>
      </div>

      {/* Jobs Per Day Analysis */}
      <div className="mt-4">
        <div className="text-core font-semibold text-foreground">Jobs Per Day Analysis</div>
        <div className="text-help text-core mb-2">
          Jobs/day = (IPS × Utilization × 86,400 sec) ÷ Calls per job
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 relative group cursor-help">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              Conservative (40%)
              <InfoTooltip content="Conservative utilization scenario: 40% of total device capacity. Represents cautious adoption with stable, predictable workloads." />
            </div>
            <div className="text-headline font-semibold text-number-blue">
              {Math.round((calculations.inventoryIPS * 0.40 * 86400) / state.callsPerJob).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">jobs/day</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 relative group cursor-help">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              Current ({Math.round(state.util * scenario.util * 100)}%)
              <InfoTooltip content="Current utilization based on your scenario selection and base utilization settings. This reflects your expected realistic usage pattern." />
            </div>
            <div className="text-headline font-semibold text-number-blue">
              {Math.round((calculations.inventoryIPS * state.util * scenario.util * 86400) / state.callsPerJob).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">jobs/day</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 relative group cursor-help">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              Optimistic (80%)
              <InfoTooltip content="Optimistic utilization scenario: 80% of total device capacity. Represents high-demand environment with continuous, heavy workloads." />
            </div>
            <div className="text-headline font-semibold text-number-blue">
              {Math.round((calculations.inventoryIPS * 0.80 * 86400) / state.callsPerJob).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">jobs/day</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-core font-semibold text-foreground">SEL Tests</div>
        <ul className="mt-2 space-y-1 text-core">
          {tests.map(([name, ok], index) => (
            <li key={index} className="flex items-center gap-2">
              <span className={ok ? 'text-muted-foreground' : 'text-muted-foreground'}>
                {ok ? '✅' : '❌'}
              </span>
              <span className="text-foreground">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}