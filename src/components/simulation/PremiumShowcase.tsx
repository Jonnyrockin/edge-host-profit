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

  const industries = [
    {
      name: "Retail AI Analytics",
      description: "Real-time footfall and shopper pattern analysis",
      position: "0%",
      multiplier: 5.5
    },
    {
      name: "Healthcare Diagnostics", 
      description: "Privacy-preserving, high-accuracy inference for patient imaging",
      position: "33%",
      multiplier: 8.5
    },
    {
      name: "Autonomous Fleet",
      description: "Low-latency coordination for self-driving vehicles",
      position: "66%", 
      multiplier: 12
    },
    {
      name: "Financial Trading",
      description: "Ultra-low latency algorithmic trading and fraud detection",
      position: "100%",
      multiplier: 15
    }
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-panel-padding mb-panel">
      <div className="flex items-center justify-between mb-panel-gap">
        <div className="flex items-center gap-md">
          <h2 className="text-headline font-semibold text-foreground">Edge Premium Multiplier</h2>
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

      {/* Full Width Premium Slider with Industry Markers */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/20 border border-primary/20 rounded-xl p-6 mb-6">
        <div className="relative">
          {/* Industry Markers - Above Slider */}
          <div className="relative mb-8">
            {industries.map((industry, index) => (
              <div 
                key={industry.name}
                className="absolute transform -translate-x-1/2"
                style={{ left: industry.position }}
              >
                <div className="bg-white border-2 border-primary/30 rounded-lg p-3 min-w-[160px] shadow-sm">
                  <div className="text-sm font-semibold text-foreground text-center mb-1">
                    {industry.name}
                  </div>
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    {industry.description}
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center bg-primary/10 rounded-full px-2 py-1">
                      <div className="text-xs font-bold text-primary">{industry.multiplier}x</div>
                    </div>
                  </div>
                </div>
                {/* Connector Line */}
                <div className="w-0.5 h-4 bg-primary/40 mx-auto mt-1"></div>
              </div>
            ))}
          </div>

          {/* Premium Multiplier Controls */}
          <div className="bg-white/80 backdrop-blur-sm border border-border/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-foreground">Premium Multiplier</div>
              <div className="text-2xl font-bold text-primary">{multiplier.toFixed(1)}x</div>
            </div>
            
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

            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="text-xs">
                <div className="font-semibold text-foreground">Performance</div>
                <div className="text-muted-foreground">4-20x faster</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">Latency</div>
                <div className="text-muted-foreground">&lt;25ms edge</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">Privacy</div>
                <div className="text-muted-foreground">Local processing</div>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-foreground">Value</div>
                <div className="text-muted-foreground">Mission-critical</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Baseline and Edge Price */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
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

        {/* Edge Price Result */}
        <div className="bg-card border border-border rounded-lg p-panel-gap text-center flex flex-col">
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
          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-border mt-auto">
            <div>
              <div className="text-xs font-semibold text-foreground">&lt;25ms Latency</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Local Privacy</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Premium Market</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Mission Critical</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}