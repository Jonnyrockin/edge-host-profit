import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { SimulationState } from '../../types/simulation';
import { InfoTooltip } from '../ui/info-tooltip';

interface ESGPanelProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function ESGPanel({ state, onStateChange }: ESGPanelProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onStateChange({ esgFile: file.name });
    }
  };

  return (
    <div className="bg-card border border-border rounded-none p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-md py-2">
        <div className="flex items-center gap-md">
          <div className="text-headline font-semibold text-foreground">ESG Compliance</div>
          <InfoTooltip content="Environmental, Social, and Governance compliance allows you to charge a 10% premium for sustainable computing practices." />
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center space-x-md">
            <Checkbox 
              id="esg-enabled" 
              checked={state.esgEnabled} 
              onCheckedChange={checked => onStateChange({ esgEnabled: !!checked })} 
            />
            <Label htmlFor="esg-enabled" className="text-core">Enable ESG (+10% premium)</Label>
          </div>
          <div className="flex items-center gap-md">
            <input 
              type="file" 
              id="esg-file" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('esg-file')?.click()} 
              className="flex items-center gap-1 border-input-border hover:border-glass-border text-core bg-input hover:bg-muted"
            >
              <Upload className="h-3 w-3" />
              Upload ESG Cert
            </Button>
            {state.esgFile && <span className="text-sm text-core">{state.esgFile}</span>}
          </div>
        </div>
      </div>
      
      <div className="text-help text-core">
        <strong>Approved ESG Documents:</strong> ISO 14001 Environmental Management certificates, B-Corp certification, renewable energy contracts (solar/wind), carbon offset agreements, LEED building certifications, or third-party sustainability audits from accredited providers.
      </div>
    </div>
  );
}