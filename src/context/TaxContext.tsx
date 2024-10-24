import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { calculateTaxDistribution, TaxDistributionItem, getAvailableYears } from '../utils/taxCalculations';
import { budgetData, availableYears as fallbackYears } from '../data/budgetData';
import { clearCache, initializeCache } from '../utils/cache';

interface TaxContextType {
  taxContribution: number;
  distribution: TaxDistributionItem[];
  selectedYear: number;
  availableYears: number[];
  isLoading: boolean;
  error: string | null;
  isLiveData: boolean;
  lastUpdateDate: string;
  setTaxContribution: (amount: number) => void;
  setSelectedYear: (year: number) => void;
  calculateDistribution: () => void;
  resetData: () => void;
}

const defaultContext: TaxContextType = {
  taxContribution: 100000,
  distribution: [],
  selectedYear: new Date().getFullYear(),
  availableYears: fallbackYears,
  isLoading: false,
  error: null,
  isLiveData: false,
  lastUpdateDate: '',
  setTaxContribution: () => {},
  setSelectedYear: () => {},
  calculateDistribution: () => {},
  resetData: () => {}
};

const TaxContext = createContext<TaxContextType>(defaultContext);

export const TaxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [taxContribution, setTaxContribution] = useState<number>(defaultContext.taxContribution);
  const [distribution, setDistribution] = useState<TaxDistributionItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(defaultContext.selectedYear);
  const [availableYears, setAvailableYears] = useState<number[]>(fallbackYears);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveData, setIsLiveData] = useState<boolean>(false);
  const [lastUpdateDate, setLastUpdateDate] = useState<string>('');

  const calculateDistribution = useCallback(() => {
    setIsLoading(true);
    setError(null);
    calculateTaxDistribution(taxContribution, selectedYear)
      .then((result) => {
        setDistribution(result.distribution);
        setIsLiveData(result.isLiveData);
        setLastUpdateDate(result.lastUpdateDate);
      })
      .catch((err) => {
        console.error('Error calculating distribution:', err);
        setError('Nastala chyba při výpočtu distribuce daní. Zobrazují se záložní data.');
        setIsLiveData(false);
        // Použij záložní data
        const fallbackData = budgetData[selectedYear] || budgetData[Object.keys(budgetData)[0]];
        const totalBudget = fallbackData.reduce((sum, item) => sum + item.amount, 0);
        const fallbackDistribution = fallbackData.map(item => ({
          ...item,
          amount: (taxContribution * item.amount) / totalBudget,
          percentage: (item.amount / totalBudget) * 100,
          details: item.details.map(detail => ({
            ...detail,
            amount: (taxContribution * item.amount * detail.percentage) / (totalBudget * 100)
          }))
        }));
        setDistribution(fallbackDistribution);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [taxContribution, selectedYear]);

  const resetData = useCallback(() => {
    clearCache();
    initializeCache();
    calculateDistribution();
  }, [calculateDistribution]);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const years = await getAvailableYears();
        if (years.length > 0) {
          const currentYear = new Date().getFullYear();
          setSelectedYear(years.includes(currentYear) ? currentYear : years[0]);
          setAvailableYears(years);
          setIsLiveData(true);
        }
      } catch (error) {
        console.error('Error fetching available years:', error);
        setError('Nepodařilo se načíst dostupné roky. Používají se záložní data.');
        setAvailableYears(fallbackYears);
        setIsLiveData(false);
      }
    };

    fetchYears();
    initializeCache();
  }, []);

  useEffect(() => {
    calculateDistribution();
  }, [calculateDistribution]);

  const value = {
    taxContribution,
    distribution,
    selectedYear,
    availableYears,
    isLoading,
    error,
    isLiveData,
    lastUpdateDate,
    setTaxContribution,
    setSelectedYear,
    calculateDistribution,
    resetData,
  };

  return <TaxContext.Provider value={value}>{children}</TaxContext.Provider>;
};

export const useTaxContext = () => {
  const context = useContext(TaxContext);
  if (!context) {
    throw new Error('useTaxContext must be used within a TaxProvider');
  }
  return context;
};