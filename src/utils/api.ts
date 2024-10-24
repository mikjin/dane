import axios from 'axios';
import { API_CONFIG, getApiUrl } from '../config/apiConfig';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const fetchWithRetry = async (
  key: keyof typeof API_CONFIG, 
  options: any = {}, 
  retries = MAX_RETRIES, 
  urlIndex = 0
): Promise<any> => {
  try {
    const apiConfig = getApiUrl(key, urlIndex);
    const headers: Record<string, string> = {
      'Accept': 'application/json, application/ld+json',
      ...options.headers
    };

    const response = await axios.get(apiConfig.url, {
      ...options,
      params: { ...apiConfig.params, ...options.params },
      headers,
      timeout: 5000,
    });

    const processedData = await processApiResponse(response.data, apiConfig.version);
    if (processedData) {
      return processedData;
    }

    if (urlIndex + 1 < API_CONFIG[key].length) {
      return fetchWithRetry(key, options, MAX_RETRIES, urlIndex + 1);
    }

    throw new Error('Invalid data format');
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(key, options, retries - 1, urlIndex);
    }

    if (urlIndex + 1 < API_CONFIG[key].length) {
      return fetchWithRetry(key, options, MAX_RETRIES, urlIndex + 1);
    }

    return null;
  }
};

const processApiResponse = async (data: any, version: string): Promise<any> => {
  try {
    switch (version) {
      case 'v3':
        return processMonitorV3Response(data);
      case 'jsonld':
        return processJsonLdResponse(data);
      default:
        return data;
    }
  } catch (error) {
    console.error("Error processing API response:", error);
    return null;
  }
};

const processMonitorV3Response = (data: any): any => {
  if (!data) return null;

  if (Array.isArray(data)) {
    return data
      .filter(item => item.kapitola?.nazev && item.skutecnost)
      .map(item => ({
        category: item.kapitola.nazev,
        amount: parseFloat(item.skutecnost) || 0,
        details: []
      }))
      .filter(item => item.amount > 0);
  }

  return null;
};

const processJsonLdResponse = (data: any): any => {
  if (!data || !data['@context']) return null;

  return {
    name: data.název?.cs || data.název?.en || 'Unknown',
    description: data.popis?.cs || data.popis?.en || '',
    provider: data.poskytovatel,
    lastUpdate: data.časová_platnost || new Date().toISOString()
  };
};