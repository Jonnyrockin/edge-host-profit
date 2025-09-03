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
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Edge AI Premium Positioning</h2>
        </div>
        
        {/* Provider Chip */}
        {selectedProvider && (
          <div className="bg-muted/30 border border-border/50 rounded-full px-2 py-1 flex items-center gap-1.5">
            <div className="text-xs font-medium text-foreground">{selectedProvider.name}</div>
            <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div>
            <div className="text-xs text-muted-foreground">{selectedProvider.lastUpdated}</div>
          </div>
        )}
      </div>

      {/* Premium Comparison Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Baseline Cloud Price */}
        <div className="bg-card border border-border rounded-lg p-3 text-center space-y-2 flex flex-col">
          <div className="text-sm text-muted-foreground">Baseline Cloud Compute</div>
          <div className="text-3xl font-bold text-number-blue">
            ${baselinePrice.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground">per call</div>
          
          {/* Provider Selection */}
          <div className="space-y-2 mt-3">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full text-sm h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-50">
                {CLOUD_BASELINES.map(provider => (
                  <SelectItem key={provider.id} value={provider.id} className="py-3">
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
          
          {/* Manual Override - Moved down to align with bottom elements */}
          <div className="pt-4 border-t border-border/30 mt-auto">
            <div className="text-xs text-muted-foreground mb-1">Custom Override</div>
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

        {/* Premium Multiplier */}
        <div className="bg-card border border-border rounded-lg p-3 flex flex-col justify-between">
          <div className="text-sm font-medium text-foreground mb-3">Premium Multiplier</div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">5.0x</span>
              <span className="text-xs text-muted-foreground">15.0x</span>
            </div>
            <Slider
              value={[multiplier]}
              onValueChange={handleMultiplierChange}
              min={5}
              max={15}
              step={0.5}
              className="w-full"
            />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-number-blue">{multiplier.toFixed(1)}x</div>
            <div className="text-xs text-muted-foreground">Premium Factor</div>
          </div>

          {/* Premium Justification in Multiplier Panel */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-2 mt-3">
            <div className="text-xs font-medium text-foreground mb-1">Why Premium Works</div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>• Performance: 4-20x faster</div>
              <div>• Value: Enables new use cases</div>
              <div>• Market: Mission-critical ready</div>
            </div>
          </div>
        </div>

        {/* Edge Price Result */}
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="text-sm text-muted-foreground mb-1">Edge AI Premium Price</div>
          <div className="text-3xl font-bold text-number-blue">
            ${edgePrice.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground mb-2">per call</div>
          <div className="bg-muted/30 border border-border/50 rounded-lg p-2 mb-3">
            <div className="text-sm font-semibold text-number-blue">
              +{((multiplier - 1) * 100).toFixed(0)}% Premium
            </div>
            <div className="text-xs text-muted-foreground">
              vs. baseline cloud
            </div>
          </div>

          {/* Value Metrics */}
          <div className="grid grid-cols-1 gap-2 text-center pt-2 border-t border-border">
            <div>
              <div className="text-xs font-semibold text-foreground">&lt;25ms Latency</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Local Privacy</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Premium Market</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}