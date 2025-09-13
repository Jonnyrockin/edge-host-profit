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
    <div className="border border-green-200 rounded-none p-panel-padding mb-panel bg-green-50">
      <div className="flex items-center justify-between mb-md py-2">
        <div className="flex items-center gap-md">
          <div className="text-headline font-semibold text-gray-800">ESG Compliance</div>
          <InfoTooltip content="Environmental, Social, and Governance compliance allows you to charge a 10% premium for sustainable computing practices." />
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center space-x-md">
            <Checkbox 
              id="esg-enabled" 
              checked={state.esgEnabled} 
              onCheckedChange={checked => onStateChange({ esgEnabled: !!checked })} 
            />
            <Label htmlFor="esg-enabled" className="text-gray-700">Enable ESG (+10% premium)</Label>
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
              className="flex items-center gap-1 border-green-600 hover:border-green-700 text-green-700 bg-white hover:bg-green-50"
            >
              <Upload className="h-3 w-3" />
              Upload ESG Cert
            </Button>
            {state.esgFile && <span className="text-sm text-gray-600">{state.esgFile}</span>}
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-700">
        <strong>Approved ESG Documents:</strong> ISO 14001 Environmental Management certificates, B-Corp certification, renewable energy contracts (solar/wind), carbon offset agreements, LEED building certifications, or third-party sustainability audits from accredited providers.
      </div>
    </div>
  );
}