import { CalculationResult, SimulationState } from '../../types/simulation';

interface PricingPanelProps {
  state: SimulationState;
  calculations: CalculationResult;
}

export function PricingPanel({ state, calculations }: PricingPanelProps) {
  // Calculate pricing with ESG premium if enabled
  const basePrice = calculations.pricePerCall;
  const esgMultiplier = state.esgEnabled ? 1.1 : 1.0;
  const finalPrice = basePrice * esgMultiplier;
  
  // Pricing for 1 million calls
  const priceFor1M = finalPrice * 1000000;
  
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-lg font-semibold text-foreground mb-3">Pricing Overview</div>
      <div className="text-help text-sm mb-4">
        Current pricing with geo location and rural premiums applied.
      </div>
      
      <div className="space-y-4">
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="text-help text-sm">Single AI Inference Token</div>
          <div className="text-2xl font-semibold text-number-blue">
            ${finalPrice.toFixed(6)}
          </div>
          {state.esgEnabled && (
            <div className="text-xs text-warning">+10% ESG premium applied</div>
          )}
        </div>
        
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="text-help text-sm">1 Million Calls</div>
          <div className="text-2xl font-semibold text-number-blue">
            ${Math.round(priceFor1M).toLocaleString()}
          </div>
          <div className="text-xs text-help">
            Based on {state.city} location {state.rural > 0 && `+ rural premium`}
          </div>
        </div>
        
        {state.esgEnabled && (
          <div className="text-xs text-success bg-success/10 rounded p-2">
            ✓ ESG Compliance enabled - customers pay 10% premium for green computing
          </div>
        )}
      </div>
    </div>
  );
}