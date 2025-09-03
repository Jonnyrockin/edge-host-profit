import { CalculationResult, SimulationState } from '../../types/simulation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { INFERENCE_PROVIDERS, getProviderById, getModelById } from '../../data/inference-providers';
import { InfoTooltip } from '../ui/info-tooltip';

interface PricingPanelProps {
  state: SimulationState;
  calculations: CalculationResult;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function PricingPanel({ state, calculations, onStateChange }: PricingPanelProps) {
  const selectedProvider = getProviderById(state.inferenceProvider || 'openai');
  const selectedModel = selectedProvider ? getModelById(state.inferenceProvider || 'openai', state.inferenceModel || selectedProvider.models[0]?.id) : null;

  const handleProviderChange = (providerId: string) => {
    const provider = getProviderById(providerId);
    if (provider) {
      onStateChange({
        inferenceProvider: providerId,
        inferenceModel: provider.models[0]?.id,
        baseInferencePrice: provider.models[0]?.averagePricePer1M || 1.0
      });
    }
  };

  const handleModelChange = (modelId: string) => {
    const model = selectedProvider ? getModelById(selectedProvider.id, modelId) : null;
    if (model) {
      onStateChange({
        inferenceModel: modelId,
        baseInferencePrice: model.averagePricePer1M || 1.0
      });
    }
  };

  // Calculate pricing with ESG premium if enabled
  const basePrice = calculations.pricePerCall;
  const finalPrice = basePrice;
  
  // Pricing for 1 million calls
  const priceFor1M = finalPrice * 1000000;
  
  return (
    <div className="bg-card border border-border rounded-2xl p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-lg">
        <div className="text-headline font-semibold text-foreground">Pricing Overview</div>
        {selectedProvider && (
          <Button variant="ghost" size="sm" asChild>
            <a href={selectedProvider.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Pricing
            </a>
          </Button>
        )}
      </div>
      
      <div className="text-help text-core mb-4">
        Current pricing with geo location and rural premiums applied.
      </div>

      {/* Inference Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <label className="block text-core font-medium mb-2">Provider</label>
            <InfoTooltip content="AI inference provider for processing. Different providers offer varying performance, pricing, and model availability." />
          </div>
          <Select value={state.inferenceProvider || 'openai'} onValueChange={handleProviderChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INFERENCE_PROVIDERS.map(provider => (
                <SelectItem key={provider.id} value={provider.id}>
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-core font-medium mb-2">Model</label>
          <Select 
            value={state.inferenceModel || selectedProvider?.models[0]?.id} 
            onValueChange={handleModelChange}
            disabled={!selectedProvider}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              {selectedProvider?.models.map(model => (
                <SelectItem key={model.id} value={model.id} className="py-2">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Base Inference Pricing */}
      {selectedModel && (
        <div className="bg-muted/50 rounded-lg p-3 mb-4">
          <div className="text-core font-medium mb-2">Base Inference Pricing</div>
          <div className="grid grid-cols-3 gap-4 text-core">
            <div>
              <div className="text-muted-foreground">Input</div>
              <div className="font-mono text-blue-400">${selectedModel.inputPricePer1M}/1M</div>
            </div>
            <div>
              <div className="text-muted-foreground">Output</div>
              <div className="font-mono text-blue-400">${selectedModel.outputPricePer1M}/1M</div>
            </div>
            <div>
              <div className="text-muted-foreground">Average</div>
              <div className="font-mono text-blue-400">${selectedModel.averagePricePer1M}/1M</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Final Pricing with Premiums */}
      <div className="space-y-4">
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="text-help text-core">Single AI Inference Token</div>
          <div className="text-headline font-semibold text-number-blue">
            ${finalPrice < 0.000001 ? finalPrice.toExponential(3) : finalPrice.toFixed(6)}
          </div>
          <div className="text-core text-help">
            Including location, rural, and ESG premiums
          </div>
        </div>
        
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="text-help text-core">1 Million Calls</div>
          <div className="text-headline font-semibold text-number-blue">
            ${Math.round(priceFor1M).toLocaleString()}
          </div>
          <div className="text-core text-help">
            Based on {state.city} location {state.rural > 0 && `+ ${state.rural}% rural premium`}
          </div>
        </div>
        
        {state.esgEnabled && (
          <div className="text-core text-success bg-success/10 rounded p-2">
            ✓ ESG Compliance enabled - customers pay 10% premium for green computing
          </div>
        )}
      </div>
    </div>
  );
}