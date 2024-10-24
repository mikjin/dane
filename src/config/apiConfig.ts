export const API_CONFIG = {
  budgetData: [
    {
      url: 'https://monitor.statnipokladna.cz/api/v3/statni-rozpocet/vydaje-kapitola',
      version: 'v3',
      name: 'Monitor API v3',
      params: {},
      public: true,
      official: true
    },
    {
      url: 'https://opendata.mfcr.cz/api/v3/statni-rozpocet/vydaje-kapitola',
      version: 'v3',
      name: 'OpenData MFČR API',
      params: {},
      public: true,
      official: true
    }
  ],
  yearlyBudget: [
    {
      url: 'https://monitor.statnipokladna.cz/api/v3/ciselniky/statni-rozpocet/rok',
      version: 'v3',
      name: 'Monitor Years API',
      params: {},
      public: true,
      official: true
    }
  ],
  budgetDetails: [
    {
      url: 'https://monitor.statnipokladna.cz/api/v3/statni-rozpocet/vydaje-odvetvovy',
      version: 'v3',
      name: 'Monitor Details API',
      params: {},
      public: true,
      official: true
    }
  ]
};

export interface ApiConfig {
  url: string;
  version: string;
  name: string;
  params: Record<string, any>;
  public: boolean;
  official: boolean;
}

export const getApiUrl = (key: keyof typeof API_CONFIG, index = 0): ApiConfig => {
  const configs = API_CONFIG[key];
  if (!configs || !configs[index]) {
    throw new Error("Invalid API configuration");
  }
  return configs[index];
};