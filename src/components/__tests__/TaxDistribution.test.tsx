import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaxDistribution from '../TaxDistribution';
import { TaxProvider } from '../../context/TaxContext';

jest.mock('../../context/TaxContext', () => ({
  useTaxContext: () => ({
    distribution: [
      { 
        category: 'Ministerstvo A', 
        amount: 50000, 
        percentage: 50, 
        details: ['Detail 1: 25000 Kč', 'Detail 2: 25000 Kč'] 
      },
      { 
        category: 'Ministerstvo B', 
        amount: 50000, 
        percentage: 50, 
        details: ['Detail 3: 30000 Kč', 'Detail 4: 20000 Kč'] 
      },
    ],
    selectedYear: 2023,
    taxContribution: 100000,
    isLoading: false,
    error: null,
    isLiveData: true,
    lastUpdateDate: '1. 1. 2023',
  }),
  TaxProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('TaxDistribution', () => {
  it('renders correctly', () => {
    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    expect(screen.getByText(/Rozdělení vašich daní pro rok 2023/i)).toBeInTheDocument();
    expect(screen.getByText(/Přehled, jak by bylo využito 100 000 Kč z vašich daní/i)).toBeInTheDocument();
    expect(screen.getByText(/Ministerstvo A/i)).toBeInTheDocument();
    expect(screen.getByText(/Ministerstvo B/i)).toBeInTheDocument();
  });

  it('displays correct amounts and percentages', () => {
    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    expect(screen.getByText(/50 000,00 Kč \(50.00%\)/i)).toBeInTheDocument();
  });

  it('shows live data message when data is live', () => {
    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    expect(screen.getByText(/Data jsou aktuální, získaná z portálu MONITOR Státní pokladny/i)).toBeInTheDocument();
  });

  it('expands category details on click', () => {
    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    fireEvent.click(screen.getByText(/Ministerstvo A/i));
    expect(screen.getByText(/Detail 1/i)).toBeInTheDocument();
    expect(screen.getByText(/25000 Kč \(50.00%\)/i)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      distribution: [],
      selectedYear: 2023,
      taxContribution: 100000,
      isLoading: true,
      error: null,
      isLiveData: true,
    }));

    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    expect(screen.getByText(/Načítání dat.../i)).toBeInTheDocument();
  });

  it('handles error state', () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      distribution: [],
      selectedYear: 2023,
      taxContribution: 100000,
      isLoading: false,
      error: 'Chyba při načítání dat',
      isLiveData: false,
    }));

    render(
      <TaxProvider>
        <TaxDistribution />
      </TaxProvider>
    );

    expect(screen.getByText(/Chyba při načítání dat/i)).toBeInTheDocument();
  });
});