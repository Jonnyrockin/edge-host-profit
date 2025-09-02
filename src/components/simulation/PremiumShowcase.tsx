import { SimulationState } from '../../types/simulation';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';
import { CLOUD_BASELINES, getCloudProviderById } from '../../data/cloud-baselines';

interface PremiumShowcaseProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function PremiumShowcase({ state, onStateChange }: PremiumShowcaseProps) {
  const selectedProvider = getCloudProviderById(state.baselineProvider || 'market-average');
  const baselinePrice = selectedProvider?.pricePerCall || 0.00076;
  const multiplier = state.premiumMultiplier || 8;
  const edgePrice = baselinePrice * multiplier;

  const handleProviderChange = (providerId: string) => {
    const provider = getCloudProviderById(providerId);
    if (provider) {
      const newEdgePrice = provider.pricePerCall * multiplier;
      onStateChange({
        baselineProvider: providerId,
        baselineCloudPrice: provider.pricePerCall,
        pricePerCallBase: newEdgePrice
      });
    }
  };

  const handleMultiplierChange = (value: number[]) => {
    const newMultiplier = value[0];
    const newEdgePrice = baselinePrice * newMultiplier;
    onStateChange({ 
      premiumMultiplier: newMultiplier,
      pricePerCallBase: newEdgePrice
    });
  };

  const handleBaselineChange = (value: number) => {
    const newEdgePrice = value * multiplier;
    onStateChange({ 
      baselineCloudPrice: value,
      pricePerCallBase: newEdgePrice,
      baselineProvider: 'custom' // Mark as custom when manually edited
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Edge AI Premium Positioning</h2>
      </div>
      
      <div className="text-sm text-muted-foreground mb-6">
        Edge AI commands premium pricing due to ultra-low latency, data locality, and compliance benefits.
      </div>

      {/* Premium Comparison Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        
        {/* Baseline Cloud Price */}
        <div className="bg-card/50 border border-border rounded-xl p-4 text-center space-y-3">
          <div className="text-sm text-muted-foreground mb-2">Baseline Cloud Compute</div>
          <div className="text-4xl font-bold text-muted-foreground mb-2">
            ${baselinePrice.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground mb-3">per call</div>
          
          {/* Provider Selection */}
          <div className="space-y-2">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLOUD_BASELINES.map(provider => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Source Link */}
            {selectedProvider?.sourceUrl && (
              <Button variant="ghost" size="sm" asChild className="h-6 text-xs">
                <a href={selectedProvider.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Pricing
                </a>
              </Button>
            )}
          </div>
          
          {/* Manual Override */}
          <div className="pt-2 border-t border-border/30">
            <div className="text-xs text-muted-foreground mb-1">Custom Price Override</div>
            <Input
              type="number"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={baselinePrice}
              onChange={(e) => handleBaselineChange(parseFloat(e.target.value) || 0.00076)}
              className="w-full text-center font-mono text-sm h-8"
              placeholder="Custom price"
            />
          </div>
        </div>

        {/* Arrow and Multiplier */}
        <div className="text-center">
          <ArrowRight className="w-8 h-8 text-primary mx-auto mb-4" />
          <div className="bg-primary/10 rounded-xl p-4">
            <div className="text-sm font-medium text-foreground mb-3">Premium Multiplier</div>
            <div className="text-3xl font-bold text-primary mb-4">
              {multiplier}x
            </div>
            <Slider
              value={[multiplier]}
              onValueChange={handleMultiplierChange}
              min={5}
              max={15}
              step={0.5}
              className="mb-2"
            />
            <div className="text-xs text-muted-foreground">
              5x (standard) to 15x (ultra-premium)
            </div>
          </div>
        </div>

        {/* Edge Price Result */}
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
          <div className="text-sm text-primary font-medium mb-2">Edge AI Premium Price</div>
          <div className="text-4xl font-bold text-primary mb-2">
            ${edgePrice.toFixed(4)}
          </div>
          <div className="text-xs text-primary/80 mb-3">per call</div>
          <div className="bg-primary/20 rounded-lg p-2">
            <div className="text-sm font-semibold text-primary">
              +{((multiplier - 1) * 100).toFixed(0)}% Premium
            </div>
            <div className="text-xs text-primary/80">
              vs. baseline cloud
            </div>
          </div>
        </div>
      </div>

      {/* Provider Details */}
      {selectedProvider && (
        <div className="mt-4 p-3 bg-muted/30 rounded-lg text-center">
          <div className="text-sm font-medium text-foreground mb-1">{selectedProvider.name}</div>
          <div className="text-xs text-muted-foreground mb-1">{selectedProvider.description}</div>
          <div className="text-xs text-muted-foreground">
            Last updated: {selectedProvider.lastUpdated}
            {selectedProvider.id === 'market-average' && ' • Averaged across 5 major providers'}
          </div>
        </div>
      )}

      {/* Value Justification */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="text-xs font-semibold text-success mb-1">Ultra-Low Latency</div>
          <div className="text-xs text-muted-foreground">&lt;25ms vs 100-500ms cloud</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-warning mb-1">Data Locality</div>
          <div className="text-xs text-muted-foreground">Privacy + compliance ready</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-semibold text-primary mb-1">Premium Market</div>
          <div className="text-xs text-muted-foreground">Mission-critical workloads</div>
        </div>
      </div>
    </div>
  );
}