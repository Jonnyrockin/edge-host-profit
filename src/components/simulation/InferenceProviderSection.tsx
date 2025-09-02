import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { INFERENCE_PROVIDERS, getProviderById, getModelById } from '../../data/inference-providers';
import { SimulationState } from '../../types/simulation';

interface InferenceProviderSectionProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function InferenceProviderSection({ state, onStateChange }: InferenceProviderSectionProps) {
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

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Inference Provider</h3>
        {selectedProvider && (
          <Button variant="ghost" size="sm" asChild>
            <a href={selectedProvider.sourceUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Pricing
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
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
          {selectedProvider && (
            <p className="text-xs text-muted-foreground mt-1">{selectedProvider.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <Select 
            value={state.inferenceModel || selectedProvider?.models[0]?.id} 
            onValueChange={handleModelChange}
            disabled={!selectedProvider}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectedProvider?.models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedModel && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-4 text-sm">
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
    </Card>
  );
}