import React from 'react';
import { useTaxContext } from '../context/TaxContext';

const TaxCalculator: React.FC = () => {
  const { taxContribution, setTaxContribution, selectedYear, setSelectedYear, availableYears, calculateDistribution, isLoading, error } = useTaxContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateDistribution();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface-container rounded-material shadow-material p-6">
      <div>
        <label htmlFor="tax-amount" className="block text-sm font-medium text-secondary">
          Roční odvod na daních (Kč)
        </label>
        <div className="mt-1">
          <input
            type="number"
            name="tax-amount"
            id="tax-amount"
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-material-sm"
            placeholder="Např. 100000"
            value={taxContribution}
            onChange={(e) => setTaxContribution(Number(e.target.value))}
            min="0"
            step="1000"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-secondary">
          Rok
        </label>
        <select
          id="year"
          name="year"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-material-sm"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-material-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Načítání...' : 'Přepočítat'}
      </button>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </form>
  );
};

export default TaxCalculator;