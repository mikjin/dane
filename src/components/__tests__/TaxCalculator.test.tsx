import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaxCalculator from '../TaxCalculator';
import { TaxProvider } from '../../context/TaxContext';

jest.mock('../../context/TaxContext', () => ({
  useTaxContext: () => ({
    taxContribution: 100000,
    setTaxContribution: jest.fn(),
    selectedYear: 2023,
    setSelectedYear: jest.fn(),
    availableYears: [2023, 2022, 2021],
    calculateDistribution: jest.fn(),
    isLoading: false,
    error: null,
  }),
  TaxProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TaxCalculator', () => {
  it('renders correctly', () => {
    render(
      <TaxProvider>
        <TaxCalculator />
      </TaxProvider>
    );

    expect(screen.getByLabelText(/Roční odvod na daních/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rok/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Přepočítat/i })).toBeInTheDocument();
  });

  it('allows input of tax amount', () => {
    render(
      <TaxProvider>
        <TaxCalculator />
      </TaxProvider>
    );

    const input = screen.getByLabelText(/Roční odvod na daních/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '200000' } });
    expect(input.value).toBe('200000');
  });

  it('allows selection of year', () => {
    render(
      <TaxProvider>
        <TaxCalculator />
      </TaxProvider>
    );

    const select = screen.getByLabelText(/Rok/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '2022' } });
    expect(select.value).toBe('2022');
  });

  it('submits form on button click', () => {
    const mockCalculateDistribution = jest.fn();
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      calculateDistribution: mockCalculateDistribution,
      taxContribution: 100000,
      setTaxContribution: jest.fn(),
      selectedYear: 2023,
      setSelectedYear: jest.fn(),
      availableYears: [2023, 2022, 2021],
      isLoading: false,
      error: null,
    }));

    render(
      <TaxProvider>
        <TaxCalculator />
      </TaxProvider>
    );

    const button = screen.getByRole('button', { name: /Přepočítat/i });
    fireEvent.click(button);

    expect(mockCalculateDistribution).toHaveBeenCalled();
  });
});