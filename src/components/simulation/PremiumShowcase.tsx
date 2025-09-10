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
      <div className="bg-zinc-900 border border-gray-700 rounded-lg p-6 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Edge AI Premium Positioning</h2>
            <p className="text-sm text-gray-400">Edge AI commands premium pricing due to ultra-low latency, data locality, and compliance benefits.</p>
          </div>
          
          {/* Provider Info */}
          {selectedProvider && <div className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3">
              <div className="text-sm font-medium text-white">{selectedProvider.name}</div>
              <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
              <div className="text-xs text-gray-400">{selectedProvider.lastUpdated}</div>
            </div>}
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Baseline Cloud Compute */}
        <div className="bg-zinc-800 border border-gray-600 rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-6 text-center">
            Baseline Cloud Compute
            <InfoTooltip content="Baseline pricing gathered from major cloud providers (AWS, Azure, GCP, OpenAI). We apply an 80% forward projection discount based on industry analysis showing compute prices drop 80% year-over-year due to hardware advances and competition." />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              ${baselinePrice.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400">per call</div>
            <div className="text-xs text-gray-500 mt-1">
              ${(baselinePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>
          
          {/* Provider Selection */}
          <div className="space-y-3">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 z-50">
                {CLOUD_BASELINES.map(provider => <SelectItem key={provider.id} value={provider.id} className="text-white hover:bg-gray-700">
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-gray-400">{provider.description}</div>
                    </div>
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
            <div className="pt-3 border-t border-gray-600">
              <div className="text-xs text-gray-400 mb-2">Custom Override</div>
              <Input 
                type="number" 
                min="0.0001" 
                max="0.01" 
                step="0.0001" 
                value={baselinePrice.toFixed(6)} 
                onChange={e => handleBaselineChange(parseFloat(e.target.value) || 0.00076)} 
                className="w-full text-center font-mono bg-gray-700 border-gray-600 text-white" 
                placeholder="0.000152" 
              />
            </div>
          </div>
        </div>

        {/* Premium Multiplier */}
        <div className="bg-zinc-800 border border-gray-600 rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-6 text-center">Premium Multiplier</div>
          
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-400 mb-2">{multiplier.toFixed(1)}x</div>
            <div className="text-sm text-gray-400">Premium Factor</div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">1.0x</span>
              <span className="text-xs text-gray-500">15.0x</span>
            </div>
            <Slider 
              value={[multiplier]} 
              onValueChange={handleMultiplierChange} 
              min={1} 
              max={15} 
              step={0.1} 
              className="w-full" 
            />
          </div>

          {/* Industry Labels */}
          <div className="flex justify-between text-xs">
            {industries.map(industry => <Tooltip key={industry.name}>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-pointer hover:text-blue-400 transition-colors">
                    <div className="font-medium text-white">{industry.name}</div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs p-3 bg-gray-800 border-gray-600">
                  <div className="text-sm">
                    <div className="font-medium mb-1 text-white">{industry.description}</div>
                    <div className="text-gray-400">{industry.subtitle}</div>
                  </div>
                </TooltipContent>
              </Tooltip>)}
          </div>
        </div>

        {/* Edge AI Premium Price */}
        <div className="bg-zinc-800 border border-gray-600 rounded-lg p-6">
          <div className="text-sm text-gray-400 mb-6 text-center">
            Edge AI Premium Price
            <InfoTooltip content="Final edge inference price after applying premium multiplier to the discounted baseline. This reflects the value of ultra-low latency, local processing, and premium service quality." />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              ${edgePrice.toFixed(4)}
            </div>
            <div className="text-sm text-gray-400">per call</div>
            <div className="text-xs text-gray-500 mt-1">
              ${(edgePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <div className="text-lg font-bold text-blue-400">
              +{((multiplier - 1) * 100).toFixed(0)}% Premium
            </div>
            <div className="text-sm text-gray-400">
              vs. baseline cloud
            </div>
          </div>
        </div>
      </div>

        {/* Why Premium Pricing Works */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Why Premium Pricing Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-gray-300">
              <span className="text-blue-400">• Performance Gap:</span> Edge AI delivers 4-20x faster response times than cloud solutions
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400">• Market Positioning:</span> Mission-critical workloads justify premium pricing for guaranteed performance
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400">• Value Creation:</span> Reduced latency enables new use cases impossible with cloud infrastructure
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400">• Cost Comparison:</span> While higher per-call, total solution cost is often lower due to efficiency gains
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>;
}