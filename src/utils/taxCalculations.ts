import { BudgetItem, BudgetItemDetail } from '../types/budget';
import { fetchWithRetry } from './api';
import { budgetData as fallbackBudgetData, availableYears as fallbackYears } from '../data/budgetData';

export interface TaxDistributionItem extends BudgetItem {
  percentage: number;
}

export async function calculateTaxDistribution(
  taxAmount: number, 
  year: number
): Promise<{ distribution: TaxDistributionItem[], isLiveData: boolean, lastUpdateDate: string }> {
  try {
    const budgetItems = await fetchWithRetry('budgetData', { 
      params: { 
        rok: year,
        vztahRozpoctovy: year >= new Date().getFullYear() ? 'schválený' : 'skutečnost'
      } 
    });

    if (budgetItems?.error || !budgetItems || !Array.isArray(budgetItems)) {
      throw new Error('Using fallback data');
    }

    const totalBudget = budgetItems.reduce((sum: number, item: any) => 
      sum + parseFloat(item.skutecnost || '0'), 0);

    if (totalBudget <= 0) {
      throw new Error('Invalid budget total');
    }

    const distribution = budgetItems
      .filter(item => item.kapitola?.nazev && parseFloat(item.skutecnost || '0') > 0)
      .map(item => {
        const amount = parseFloat(item.skutecnost || '0');
        return {
          category: item.kapitola.nazev,
          amount: (taxAmount * amount) / totalBudget,
          percentage: (amount / totalBudget) * 100,
          details: item.details || []
        };
      })
      .sort((a, b) => b.amount - a.amount);

    if (distribution.length === 0) {
      throw new Error('No valid distribution data');
    }

    return { 
      distribution, 
      isLiveData: true,
      lastUpdateDate: new Date().toLocaleDateString('cs-CZ')
    };
  } catch (error) {
    const fallbackData = fallbackBudgetData[year] || fallbackBudgetData[Object.keys(fallbackBudgetData)[0]];
    const totalBudget = fallbackData.reduce((sum, item) => sum + item.amount, 0);
    const distribution = fallbackData.map(item => ({
      ...item,
      amount: (taxAmount * item.amount) / totalBudget,
      percentage: (item.amount / totalBudget) * 100,
      details: item.details.map(detail => ({
        ...detail,
        amount: (taxAmount * item.amount * detail.percentage) / (totalBudget * 100)
      }))
    }));

    return { 
      distribution, 
      isLiveData: false, 
      lastUpdateDate: 'Neznámé datum' 
    };
  }
}

export async function getAvailableYears(): Promise<number[]> {
  try {
    const response = await fetchWithRetry('yearlyBudget');
    if (response?.error || !response || !Array.isArray(response)) {
      throw new Error('Invalid years data');
    }

    const apiYears = response
      .map((item: any) => parseInt(item.rok || item.year))
      .filter((year: number) => !isNaN(year));

    const nextYear = new Date().getFullYear() + 1;
    const years = [...new Set([...apiYears, nextYear])]
      .sort((a: number, b: number) => b - a);

    return years.length > 0 ? years : fallbackYears;
  } catch (error) {
    return fallbackYears;
  }
}

export async function getLastUpdateDate(): Promise<string> {
  try {
    const response = await fetchWithRetry('budgetData');
    if (response?.error || !response) {
      throw new Error('Cannot fetch last update date');
    }
    return new Date().toLocaleDateString('cs-CZ');
  } catch (error) {
    return 'Neznámé datum';
  }
}