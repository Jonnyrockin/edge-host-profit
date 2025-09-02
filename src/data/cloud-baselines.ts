export interface CloudProvider {
  id: string;
  name: string;
  description: string;
  pricePerCall: number; // USD per inference call
  sourceUrl: string;
  lastUpdated: string;
}

export const CLOUD_BASELINES: CloudProvider[] = [
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    description: 'Claude 3.5 Sonnet',
    pricePerCall: 0.0006, // $0.6 per 1K tokens (80% reduction)
    sourceUrl: 'https://aws.amazon.com/bedrock/pricing/',
    lastUpdated: '2025-01-02'
  },
  {
    id: 'gcp-vertex',
    name: 'Google Cloud Vertex AI',
    description: 'Gemini 1.5 Pro',
    pricePerCall: 0.0001, // $0.1 per 1K tokens (80% reduction)
    sourceUrl: 'https://cloud.google.com/vertex-ai/generative-ai/pricing',
    lastUpdated: '2025-01-02'
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    description: 'GPT-4o',
    pricePerCall: 0.001, // $1 per 1K tokens (80% reduction)
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/',
    lastUpdated: '2025-01-02'
  },
  {
    id: 'openai-direct',
    name: 'OpenAI API',
    description: 'GPT-5 2025',
    pricePerCall: 0.0016, // $1.6 per 1K tokens (80% reduction)
    sourceUrl: 'https://openai.com/api/pricing/',
    lastUpdated: '2025-01-02'
  },
  {
    id: 'anthropic-direct',
    name: 'Anthropic API',
    description: 'Claude 4 Sonnet',
    pricePerCall: 0.0006, // $0.6 per 1K tokens (80% reduction)
    sourceUrl: 'https://console.anthropic.com/settings/billing',
    lastUpdated: '2025-01-02'
  },
  {
    id: 'market-average',
    name: 'Market Average',
    description: 'Weighted average across providers (post-collapse)',
    pricePerCall: 0.00076, // 80% reduced market average
    sourceUrl: '',
    lastUpdated: '2025-01-02'
  }
];

export function getCloudProviderById(id: string): CloudProvider | undefined {
  return CLOUD_BASELINES.find(provider => provider.id === id);
}

export function getMarketAveragePrice(): number {
  const prices = CLOUD_BASELINES
    .filter(p => p.id !== 'market-average')
    .map(p => p.pricePerCall);
  
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}