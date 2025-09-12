import { Input } from '../ui/input';
import { SimulationState } from '../../types/simulation';
import { InfoTooltip } from '../ui/info-tooltip';

interface JobsPerDayPanelProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function JobsPerDayPanel({ state, onStateChange }: JobsPerDayPanelProps) {
  return (
    <div className="bg-card border border-border rounded-none p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-md">
        <div className="flex items-center gap-md">
          <div className="text-headline font-semibold text-foreground">Jobs Per Day</div>
          <InfoTooltip content="Number of customer jobs processed daily. Each job may require multiple AI inference calls." />
        </div>
        <Input 
          type="number" 
          min="1" 
          step="100" 
          value={state.jobsPerDay || 1000} 
          onChange={e => onStateChange({
            jobsPerDay: Math.max(1, parseInt(e.target.value) || 1000)
          })} 
          className="w-28 font-mono bg-input border-input-border" 
        />
      </div>
      
      <div className="text-help text-core text-sm">
        <strong>What constitutes a job:</strong> A complete customer task that requires AI processing, such as analyzing an image, processing a document, generating content, or making a prediction. Jobs are calculated by taking your total daily inference calls and dividing by calls per job. Complex jobs requiring multiple AI models or processing steps will have higher calls-per-job ratios.
      </div>
    </div>
  );
}