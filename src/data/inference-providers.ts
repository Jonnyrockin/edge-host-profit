export interface InferenceProvider {
  id: string;
  name: string;
  description: string;
  models: InferenceModel[];
  sourceUrl: string;
}

export interface InferenceModel {
  id: string;
  name: string;
  inputPricePer1M: number;
  outputPricePer1M: number;
  averagePricePer1M?: number;
}

export const INFERENCE_PROVIDERS: InferenceProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI (native)',
    description: 'Models: GPT‑4.x / GPT‑4o / o‑series, Realtime API, etc.',
    sourceUrl: 'https://platform.openai.com/docs/pricing',
    models: [
      {
        id: 'gpt-4o-mini',
        name: 'GPT‑4o mini',
        inputPricePer1M: 0.15,
        outputPricePer1M: 0.60,
        averagePricePer1M: 0.375
      },
      {
        id: 'gpt-4o',
        name: 'GPT‑4o',
        inputPricePer1M: 5.00,
        outputPricePer1M: 15.00,
        averagePricePer1M: 10.00
      }
    ]
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude (native)',
    description: 'Models: Claude Opus 4, Sonnet 4, etc.',
    sourceUrl: 'https://docs.anthropic.com/en/docs/about-claude/models/overview',
    models: [
      {
        id: 'claude-sonnet-4',
        name: 'Claude Sonnet 4',
        inputPricePer1M: 3.00,
        outputPricePer1M: 15.00,
        averagePricePer1M: 9.00
      },
      {
        id: 'claude-haiku-3-5',
        name: 'Claude 3.5 Haiku',
        inputPricePer1M: 1.00,
        outputPricePer1M: 5.00,
        averagePricePer1M: 3.00
      }
    ]
  },
  {
    id: 'aws',
    name: 'AWS Bedrock (cloud channel)',
    description: 'Regional SKUs; 3P models (e.g., Llama, Claude).',
    sourceUrl: 'https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-pricing.html',
    models: [
      {
        id: 'llama3-70b',
        name: 'meta.llama3‑70b (us‑east‑1)',
        inputPricePer1M: 0.60,
        outputPricePer1M: 0.60,
        averagePricePer1M: 0.60
      }
    ]
  },
  {
    id: 'azure',
    name: 'Azure OpenAI (cloud channel)',
    description: 'Regional SKUs; Microsoft-operated.',
    sourceUrl: 'https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service/',
    models: [
      {
        id: 'azure-gpt-4o-mini',
        name: 'GPT‑4o mini (eastus)',
        inputPricePer1M: 0.18,
        outputPricePer1M: 0.72,
        averagePricePer1M: 0.45
      }
    ]
  },
  {
    id: 'google',
    name: 'Google Vertex AI (cloud channel)',
    description: 'Gemini family; regional SKUs.',
    sourceUrl: 'https://cloud.google.com/vertex-ai/generative-ai/pricing',
    models: [
      {
        id: 'gemini-2-5-pro',
        name: 'Gemini 2.5 Pro (us‑central1)',
        inputPricePer1M: 1.25,
        outputPricePer1M: 10.00,
        averagePricePer1M: 5.625
      }
    ]
  }
];

export const getProviderById = (id: string) => INFERENCE_PROVIDERS.find(p => p.id === id);
export const getModelById = (providerId: string, modelId: string) => {
  const provider = getProviderById(providerId);
  return provider?.models.find(m => m.id === modelId);
};