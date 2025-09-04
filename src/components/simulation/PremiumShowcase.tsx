import { SimulationState } from '../../types/simulation';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { CLOUD_BASELINES, getCloudProviderById } from '../../data/cloud-baselines';
import { InfoTooltip } from '../ui/info-tooltip';

interface PremiumShowcaseProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}

export function PremiumShowcase({ state, onStateChange }: PremiumShowcaseProps) {
  const selectedProvider = getCloudProviderById(state.baselineProvider || 'market-average');
  const rawBaselinePrice = selectedProvider?.pricePerCall || 0.00076;
  const baselinePrice = rawBaselinePrice * 0.2; // Apply 80% discount (20% of original)
  const multiplier = state.premiumMultiplier || 8;
  const edgePrice = baselinePrice * multiplier;

  const handleProviderChange = (providerId: string) => {
    const provider = getCloudProviderById(providerId);
    if (provider) {
      const discountedBaselinePrice = provider.pricePerCall * 0.2; // Apply 80% discount
      const newEdgePrice = discountedBaselinePrice * multiplier;
      onStateChange({
        baselineProvider: providerId,
        baselineCloudPrice: discountedBaselinePrice,
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
    const discountedValue = value * 0.2; // Apply 80% discount to custom input too
    const newEdgePrice = discountedValue * multiplier;
    onStateChange({ 
      baselineCloudPrice: discountedValue,
      pricePerCallBase: newEdgePrice,
      baselineProvider: 'custom' // Mark as custom when manually edited
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-panel-gap">
        <div className="flex items-center gap-md">
          <h2 className="text-headline font-semibold text-foreground">Edge AI Premium Positioning</h2>
        </div>
        
        {/* Provider Chip */}
        {selectedProvider && (
          <div className="bg-muted/30 border border-border/50 rounded-full px-md py-xs flex items-center gap-xs">
            <div className="text-xs font-medium text-foreground">{selectedProvider.name}</div>
            <div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div>
            <div className="text-xs text-muted-foreground">{selectedProvider.lastUpdated}</div>
          </div>
        )}
      </div>

      {/* Premium Comparison Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Baseline Cloud Price */}
        <div className="bg-card border border-border rounded-lg p-panel-gap text-center space-y-md flex flex-col">
          <div className="text-core text-muted-foreground flex items-center justify-center gap-1">
            Baseline Cloud Compute
            <InfoTooltip content="Baseline pricing gathered from major cloud providers (AWS, Azure, GCP, OpenAI). We apply an 80% forward projection discount based on industry analysis showing compute prices drop 80% year-over-year due to hardware advances and competition." />
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline justify-center gap-xs">
              <div className="text-3xl font-bold text-number-blue">
                ${baselinePrice.toFixed(4)}
              </div>
              <div className="text-xs text-number-blue">per call</div>
            </div>
            <div className="text-xs text-muted-foreground">
              ${(baselinePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>
          
          {/* Provider Selection */}
          <div className="space-y-md mt-panel-gap flex-1">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full text-sm h-[4.375rem]">
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
          
          {/* Manual Override - Moved to bottom */}
          <div className="pt-4 border-t border-border/30 mt-auto">
            <div className="text-core text-muted-foreground mb-1">Custom Override</div>
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
          <div className="text-core font-medium text-foreground mb-3">Premium Multiplier</div>
          
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
            <div className="text-headline font-bold text-number-blue">{multiplier.toFixed(1)}x</div>
            <div className="text-core text-muted-foreground">Premium Factor</div>
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
        <div className="bg-card border border-border rounded-lg p-panel-gap text-center">
          <div className="text-core text-muted-foreground mb-1 flex items-center justify-center gap-1">
            Edge AI Premium Price
            <InfoTooltip content="Final edge inference price after applying premium multiplier to the discounted baseline. This reflects the value of ultra-low latency, local processing, and premium service quality." />
          </div>
          <div className="space-y-1 mb-2">
            <div className="flex items-baseline justify-center gap-xs">
              <div className="text-3xl font-bold text-number-blue">
                ${edgePrice.toFixed(6)}
              </div>
              <div className="text-xs text-number-blue">per call</div>
            </div>
            <div className="text-sm text-muted-foreground">
              ${(edgePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>
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