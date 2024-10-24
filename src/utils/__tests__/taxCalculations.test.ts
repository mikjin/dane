import { calculateTaxDistribution, getAvailableYears, getLastUpdateDate, getCategoryDetails } from '../taxCalculations';
import { fetchWithRetry } from '../api';

jest.mock('../api');

describe('Tax Calculations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calculates tax distribution correctly', async () => {
    (fetchWithRetry as jest.Mock).mockResolvedValueOnce([
      { category: 'Ministerstvo A', amount: 1000 },
      { category: 'Ministerstvo B', amount: 2000 },
    ]);

    const result = await calculateTaxDistribution(3000, 2023);

    expect(result.distribution).toHaveLength(2);
    expect(result.distribution[0].category).toBe('Ministerstvo A');
    expect(result.distribution[0].amount).toBe(1000);
    expect(result.distribution[1].category).toBe('Ministerstvo B');
    expect(result.distribution[1].amount).toBe(2000);
    expect(result.isLiveData).toBe(true);
  });

  it('fetches available years correctly', async () => {
    (fetchWithRetry as jest.Mock).mockResolvedValueOnce([
      { year: '2023' },
      { year: '2022' },
    ]);

    const years = await getAvailableYears();

    expect(years).toEqual([2023, 2022]);
  });

  it('gets last update date correctly', async () => {
    (fetchWithRetry as jest.Mock).mockResolvedValueOnce('15. 3. 2024');

    const lastUpdateDate = await getLastUpdateDate();

    expect(lastUpdateDate).toBe('15. 3. 2024');
  });

  it('fetches category details correctly', async () => {
    const mockDetails = [
      { name: 'Detail 1', amount: 500 },
      { name: 'Detail 2', amount: 500 },
    ];
    (fetchWithRetry as jest.Mock).mockResolvedValueOnce(mockDetails);

    const details = await getCategoryDetails(2023, 'Ministerstvo A');

    expect(details).toEqual(mockDetails);
  });

  it('handles errors in calculateTaxDistribution', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const result = await calculateTaxDistribution(3000, 2023);

    expect(result.distribution).toBeDefined();
    expect(result.distribution.length).toBeGreaterThan(0);
    expect(result.isLiveData).toBe(false);
  });

  it('handles errors in getAvailableYears', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const years = await getAvailableYears();

    expect(years).toBeDefined();
    expect(years.length).toBeGreaterThan(0);
  });

  it('handles errors in getLastUpdateDate', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const lastUpdateDate = await getLastUpdateDate();

    expect(lastUpdateDate).toBe('Neznámé datum');
  });

  it('handles errors in getCategoryDetails', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const details = await getCategoryDetails(2023, 'Ministerstvo A');

    expect(details).toEqual([]);
  });
});