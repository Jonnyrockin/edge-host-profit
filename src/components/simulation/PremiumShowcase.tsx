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
      name: "RETAIL",
      description: "Real-time footfall and shopper analytics",
      position: "0%",
      multiplier: 5.5
    },
    {
      name: "SPORTS", 
      description: "Live performance tracking and analysis",
      position: "20%",
      multiplier: 7
    },
    {
      name: "HEALTHCARE",
      description: "Privacy-preserving patient diagnostics",
      position: "40%", 
      multiplier: 8.5
    },
    {
      name: "ROBOTS",
      description: "Autonomous coordination and control",
      position: "60%",
      multiplier: 12
    },
    {
      name: "TRANSIT",
      description: "Fleet management and routing optimization",
      position: "80%",
      multiplier: 13.5
    },
    {
      name: "FINANCIAL",
      description: "Ultra-low latency trading and fraud detection",
      position: "100%",
      multiplier: 15
    }
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white">Premium Value Multiplier</h2>
          <p className="text-sm text-gray-400">Premium pricing for Edge AI due to ultra-low latency, data locality, compliance and SLA</p>
        </div>
        
        {/* Provider Chip */}
        {selectedProvider && (
          <div className="bg-gray-800 border border-gray-600 rounded-full px-3 py-1 flex items-center gap-2">
            <div className="text-xs font-medium text-white">{selectedProvider.name}</div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="text-xs text-gray-400">{selectedProvider.lastUpdated}</div>
          </div>
        )}
      </div>

      {/* Premium Multiplier Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-blue-400 mb-2">{multiplier.toFixed(2)}x</div>
      </div>

      {/* Industry Markers and Slider */}
      <div className="relative mb-8">
        {/* Industry Labels */}
        <div className="flex justify-between mb-4">
          {industries.map((industry) => (
            <div key={industry.name} className="text-center">
              <div className="text-sm font-medium text-white mb-1">{industry.name}</div>
            </div>
          ))}
        </div>

        {/* Slider Track with Visual Enhancement */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">1.0x</span>
            <span className="text-xs text-gray-400">5.0x</span>
          </div>
          <Slider
            value={[multiplier]}
            onValueChange={handleMultiplierChange}
            min={1}
            max={5}
            step={0.05}
            className="w-full"
          />
        </div>
      </div>

      {/* Two Column Layout for Baseline and Edge Price */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Baseline Cloud Price */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mb-4">
            Baseline Cloud Compute ?
            <InfoTooltip content="Baseline pricing gathered from major cloud providers (AWS, Azure, GCP, OpenAI). We apply an 80% forward projection discount based on industry analysis showing compute prices drop 80% year-over-year due to hardware advances and competition." />
          </div>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-400 mb-1">
              ${baselinePrice.toFixed(4)} <span className="text-sm font-normal">per call</span>
            </div>
            <div className="text-sm text-gray-400">
              ${(baselinePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>
          
          {/* Provider Selection */}
          <div className="space-y-4">
            <Select value={state.baselineProvider || 'market-average'} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {CLOUD_BASELINES.map(provider => (
                  <SelectItem key={provider.id} value={provider.id} className="text-white hover:bg-gray-700">
                    <div className="flex flex-col items-start">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs text-gray-400">{provider.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="pt-4 border-t border-gray-600">
              <div className="text-sm text-gray-400 mb-2">Custom Override</div>
              <Input
                type="number"
                min="0.0001"
                max="0.01"
                step="0.0001"
                value={baselinePrice}
                onChange={(e) => handleBaselineChange(parseFloat(e.target.value) || 0.00076)}
                className="w-full text-center font-mono bg-gray-700 border-gray-600 text-white"
                placeholder="0.000152"
              />
            </div>
          </div>
        </div>

        {/* Edge Price Result */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
          <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mb-4">
            Edge AI Premium Price ?
            <InfoTooltip content="Final edge inference price after applying premium multiplier to the discounted baseline. This reflects the value of ultra-low latency, local processing, and premium service quality." />
          </div>
          
          <div className="mb-6">
            <div className="text-4xl font-bold text-blue-400 mb-1">
              ${edgePrice.toFixed(6)} <span className="text-sm font-normal">per call</span>
            </div>
            <div className="text-sm text-gray-400">
              ${(edgePrice * 1000000).toFixed(0)} per million tokens
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 mb-4">
            <div className="text-lg font-bold text-blue-400">
              +{((multiplier - 1) * 100).toFixed(0)}% Premium
            </div>
            <div className="text-sm text-gray-400">
              vs. baseline cloud
            </div>
          </div>

          {/* Value Metrics */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm font-semibold text-white">&lt;25ms Latency</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Local Privacy</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Premium Market</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Mission Critical</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Premium Pricing Works */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
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
  );
}