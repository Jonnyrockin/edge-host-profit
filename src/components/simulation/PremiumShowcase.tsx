import { SimulationState } from '../../types/simulation';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import { CLOUD_BASELINES, getCloudProviderById } from '../../data/cloud-baselines';
import { InfoTooltip } from '../ui/info-tooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
interface PremiumShowcaseProps {
  state: SimulationState;
  onStateChange: (updates: Partial<SimulationState>) => void;
}
export function PremiumShowcase({
  state,
  onStateChange
}: PremiumShowcaseProps) {
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
  const industries = [{
    name: "RETAIL",
    description: "Retail pays the lowest premium as most analytics can tolerate higher latency (e.g., shopper trends) and often rely on batch insights rather than real-time AI.",
    subtitle: "Competitive differentiation is driven by cost savings over ultra-fast responsiveness.",
    position: "0%",
    multiplier: 1.5
  }, {
    name: "SPORTS",
    description: "Sports analytics value real-time insights for coaching or media, activating premium only for live event edge processing and enhanced fan engagement.",
    subtitle: "Premium rises for direct, live scenarios, but bulk of data can be post-processed.",
    position: "20%",
    multiplier: 2.2
  }, {
    name: "HEALTHCARE",
    description: "Healthcare pays higher premiums to ensure privacy, regulatory compliance, and timely diagnostics (e.g., AI imaging and alerts).",
    subtitle: "Avoiding regulatory fines and supporting life-critical decisions justifies increased spend.",
    position: "40%",
    multiplier: 3.1
  }, {
    name: "ROBOTS",
    description: "Robotics demands low-latency, distributed compute for coordination and obstacle avoidance, especially in real-time industrial settings.",
    subtitle: "Premium is paid for reliable performance and uptime, with direct safety implications.",
    position: "60%",
    multiplier: 3.8
  }, {
    name: "TRANSIT",
    description: "Transit (autonomous vehicles, control systems) incurs an even greater premium for sub-second decisioning and 24/7 reliability.",
    subtitle: "Mistakes or delays result in costly service disruptions or safety risks, making high-speed compute essential.",
    position: "80%",
    multiplier: 4.5
  }, {
    name: "FINANCIAL",
    description: "Finance pays the highest premium for compute, with ultra-low latency being mission-critical for algorithmic trading, fraud prevention, and regulatory processing.",
    subtitle: "Every millisecond in compute translates directly to significant profit or loss.",
    position: "100%",
    multiplier: 5.0
  }];
    return <TooltipProvider>
      <div className="bg-card border border-border p-4 mb-6 rounded-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-headline font-semibold text-foreground mb-2">Edge Premium Multiplier</h2>
            <p className="text-help text-core">Premium pricing for Edge AI due to ultra-low latency, data<br />locality, compliance and SLA.</p>
          </div>
          
          {/* Large Premium Multiplier Display - moved up */}
          <div className="text-right">
            <div className="text-6xl font-bold text-white">{multiplier.toFixed(2)}x</div>
          </div>
        </div>


        {/* Slider controls - moved up */}
        <div className="text-center mb-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">1.0x</span>
              <span className="text-xs text-muted-foreground">5.0x</span>
            </div>
            <Slider value={[multiplier]} onValueChange={handleMultiplierChange} min={1} max={5} step={0.1} className="w-full" />
          </div>
          {/* Industry Labels */}
          <div className="flex justify-between text-base text-muted-foreground mb-4">
            {industries.slice(0, 6).map(industry => <Tooltip key={industry.name}>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-pointer hover:text-primary transition-colors">
                    <div className="font-medium text-foreground">{industry.name}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-5">
                  <div className="text-lg">
                    <div className="font-medium mb-1">{industry.description}</div>
                    <div className="text-muted-foreground">{industry.subtitle}</div>
                  </div>
                </TooltipContent>
              </Tooltip>)}
          </div>
        </div>

        {/* Two Column Layout - Baseline vs Edge Premium */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Baseline Cloud Compute */}
          <div className="bg-background border border-border rounded-none p-6">
            <div className="text-sm text-muted-foreground mb-4 text-center">
              Baseline Cloud Compute 
              <InfoTooltip content="Baseline pricing gathered from major cloud providers (AWS, Azure, GCP, OpenAI). We apply an 80% forward projection discount based on industry analysis showing compute prices drop 80% year-over-year due to hardware advances and competition." />
            </div>
            
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-2">
                ${baselinePrice.toFixed(4)}
              </div>
              <div className="text-sm text-muted-foreground">per call</div>
              <div className="text-xs text-muted-foreground mt-1">
                ${(baselinePrice * 1000000).toFixed(0)} per million tokens
              </div>
            </div>
            
            {/* Provider Selection */}
            <div className="space-y-3">
              <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  {CLOUD_BASELINES.map(provider => <SelectItem key={provider.id} value={provider.id}>
                      <div className="flex flex-col items-start">
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-xs text-muted-foreground">{provider.description}</div>
                      </div>
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Edge AI Premium Price */}
          <div className="bg-background border border-border rounded-none p-6">
            <div className="text-sm text-muted-foreground mb-4 text-center">
              Edge AI Premium Price 
              <InfoTooltip content="Final edge inference price after applying premium multiplier to the discounted baseline. This reflects the value of ultra-low latency, local processing, and premium service quality." />
            </div>
            
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-white mb-2">
                ${edgePrice.toFixed(6)}
              </div>
              <div className="text-sm text-muted-foreground">per call</div>
              <div className="text-xs text-muted-foreground mt-1">
                ${(edgePrice * 1000000).toFixed(0)} per million tokens
              </div>
            </div>

            <div className="bg-primary/20 border border-primary/30 rounded-none p-4 text-center">
              <div className="text-lg font-bold text-white">
                +{((multiplier - 1) * 100).toFixed(0)}% Premium
              </div>
              <div className="text-sm text-muted-foreground">
                vs. baseline cloud
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>;
}