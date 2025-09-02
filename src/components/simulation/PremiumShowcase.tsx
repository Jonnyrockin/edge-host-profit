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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
        
        {/* Baseline Cloud Price */}
        <div className="bg-card/50 border border-border rounded-lg p-3 text-center space-y-2">
          <div className="text-sm text-muted-foreground">Baseline Cloud Compute</div>
          <div className="text-3xl font-bold text-muted-foreground">
            ${baselinePrice.toFixed(4)}
          </div>
          <div className="text-xs text-muted-foreground">per call</div>
          
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full text-sm h-8">
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
              <Button variant="ghost" size="sm" asChild className="h-5 text-xs">
                <a href={selectedProvider.sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Pricing
                </a>
              </Button>
            )}
          </div>
          
          {/* Manual Override */}
          <div className="pt-2 border-t border-border/30">
            <div className="text-xs text-muted-foreground mb-1">Custom Override</div>
            <Input
              type="number"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={baselinePrice}
              onChange={(e) => handleBaselineChange(parseFloat(e.target.value) || 0.00076)}
              className="w-full text-center font-mono text-sm h-7"
              placeholder="Custom price"
            />
          </div>
        </div>

        {/* Arrow and Multiplier */}
        <div className="text-center">
          <ArrowRight className="w-6 h-6 text-primary mx-auto mb-3" />
          
          {/* Premium Multiplier */}
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col">
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
          </div>
        </div>

        {/* Edge Price Result */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
          <div className="text-sm text-primary font-medium mb-1">Edge AI Premium Price</div>
          <div className="text-3xl font-bold text-primary mb-1">
            ${edgePrice.toFixed(4)}
          </div>
          <div className="text-xs text-primary/80 mb-2">per call</div>
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

      {/* Compact Premium Justification */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-3 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-foreground mb-2">Why Premium Pricing Works</div>
            <div className="text-xs text-muted-foreground space-y-0.5">
              <div>• <strong>Performance:</strong> 4-20x faster than cloud</div>
              <div>• <strong>Value Creation:</strong> Enables new use cases</div>
              <div>• <strong>Market Position:</strong> Mission-critical premium</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs font-semibold text-success">&lt;25ms</div>
              <div className="text-xs text-muted-foreground">Latency</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-warning">Local</div>
              <div className="text-xs text-muted-foreground">Privacy</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-primary">Premium</div>
              <div className="text-xs text-muted-foreground">Market</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}