import React from 'react';
import { Calculator } from 'lucide-react';
import TaxCalculator from './components/TaxCalculator';
import TaxDistribution from './components/TaxDistribution';
import ApiStatusIndicator from './components/ApiStatusIndicator';
import { TaxProvider } from './context/TaxContext';

function App() {
  return (
    <TaxProvider>
      <div className="min-h-screen bg-surface py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Calculator className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-2 text-3xl font-normal tracking-tight text-gray-900">
              Kalkulátor rozdělení daní ČR
            </h2>
            <p className="mt-2 text-lg text-secondary">
              Zjistěte, jak jsou vaše daně rozděleny mezi různé státní služby
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <ApiStatusIndicator />
          </div>

          <div className="mt-10">
            <TaxCalculator />
          </div>

          <TaxDistribution />
        </div>
      </div>
    </TaxProvider>
  );
}

export default App;