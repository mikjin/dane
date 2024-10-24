import { budgetData } from '../data/budgetData';

const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function setCache(key: string, data: any): void {
  const item = {
    value: data,
    expiry: new Date().getTime() + CACHE_EXPIRATION,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getCache(key: string): any | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date().getTime();

  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export function clearCache(): void {
  localStorage.clear();
  console.log('Cache cleared');
}

// Inicializace cache pro každý rok
export function initializeCache(): void {
  Object.entries(budgetData).forEach(([year, data]) => {
    const cacheKey = `budgetData_${year}`;
    if (!getCache(cacheKey)) {
      setCache(cacheKey, data);
    }
  });
}