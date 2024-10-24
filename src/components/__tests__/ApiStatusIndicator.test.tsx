import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ApiStatusIndicator from '../ApiStatusIndicator';
import { fetchWithRetry } from '../../utils/api';

jest.mock('../../utils/api');

describe('ApiStatusIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', async () => {
    (fetchWithRetry as jest.Mock).mockResolvedValue(true);

    render(<ApiStatusIndicator />);

    expect(screen.getByText(/Stav API:/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getAllByTitle(/Data rozpočtu|Dostupné roky|Datum poslední aktualizace/).length).toBe(3);
    });
  });

  it('shows green indicators when all APIs are available', async () => {
    (fetchWithRetry as jest.Mock).mockResolvedValue(true);

    render(<ApiStatusIndicator />);

    await waitFor(() => {
      const indicators = screen.getAllByTitle(/Data rozpočtu|Dostupné roky|Datum poslední aktualizace/);
      indicators.forEach(indicator => {
        expect(indicator).toHaveClass('bg-green-500');
      });
    });
  });

  it('shows red indicators when APIs are unavailable', async () => {
    (fetchWithRetry as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<ApiStatusIndicator />);

    await waitFor(() => {
      const indicators = screen.getAllByTitle(/Data rozpočtu|Dostupné roky|Datum poslední aktualizace/);
      indicators.forEach(indicator => {
        expect(indicator).toHaveClass('bg-red-500');
      });
    });
  });

  it('handles mixed API availability', async () => {
    (fetchWithRetry as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce(true);

    render(<ApiStatusIndicator />);

    await waitFor(() => {
      const indicators = screen.getAllByTitle(/Data rozpočtu|Dostupné roky|Datum poslední aktualizace/);
      expect(indicators[0]).toHaveClass('bg-green-500');
      expect(indicators[1]).toHaveClass('bg-red-500');
      expect(indicators[2]).toHaveClass('bg-green-500');
    });
  });
});