import axios from 'axios';
import { fetchWithRetry, sanitizeData, convertJsonLdToUsableData } from '../api';
import { API_CONFIG } from '../../config/apiConfig';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchWithRetry', () => {
    it('should fetch data successfully on first try', async () => {
      const mockData = [{ kapitola: { nazev: 'Test' }, skutecnost: '1000' }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchWithRetry('budgetData', { params: { year: 2023 } });
      expect(result).toEqual([{ category: 'Test', amount: 1000, details: [] }]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockData = [{ kapitola: { nazev: 'Test' }, skutecnost: '1000' }];
      mockedAxios.get
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockData });

      const result = await fetchWithRetry('budgetData', { params: { year: 2023 } });
      expect(result).toEqual([{ category: 'Test', amount: 1000, details: [] }]);
      expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('should throw an error after max retries', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(fetchWithRetry('budgetData', { params: { year: 2023 } })).rejects.toThrow('Network error');
      expect(mockedAxios.get).toHaveBeenCalledTimes(3); // Assuming MAX_RETRIES is 3
    });

    it('should handle CKAN API response', async () => {
      const mockData = {
        success: true,
        result: {
          records: [
            { chapter_name: 'Test CKAN', amount: '2000' }
          ]
        }
      };
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await fetchWithRetry('budgetData', { params: { year: 2023 } });
      expect(result).toEqual([{ category: 'Test CKAN', amount: 2000, details: [] }]);
    });

    it('should handle RSS response for last update date', async () => {
      const mockRssData = `
        <rss>
          <channel>
            <pubDate>Wed, 02 Oct 2023 15:00:00 GMT</pubDate>
          </channel>
        </rss>
      `;
      mockedAxios.get.mockResolvedValueOnce({ data: mockRssData });

      const result = await fetchWithRetry('lastUpdateDate');
      expect(result).toBe('2. 10. 2023');
    });
  });

  // ... (keep the existing sanitizeData and convertJsonLdToUsableData tests)
});