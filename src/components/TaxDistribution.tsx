import React, { useState } from 'react';
import { useTaxContext } from '../context/TaxContext';
import { TaxDistributionItem } from '../utils/taxCalculations';
import { dataSources, yearWarnings, dataAccuracyNotes } from '../data/budgetData';
import { Edit2, Save, X } from 'lucide-react';

const DataAccuracyNote: React.FC = () => (
  <div className="mt-2 text-sm text-gray-500">
    <p>{dataAccuracyNotes.general}</p>
    <ul className="mt-1 list-disc list-inside">
      {dataAccuracyNotes.limitations.map((limitation, index) => (
        <li key={index} className="text-xs">{limitation}</li>
      ))}
    </ul>
  </div>
);

const AdContainer: React.FC<{ id: string; className?: string }> = ({ id, className = "" }) => (
  <div id={id} className={`hidden ${className}`} aria-hidden="true" />
);

const TaxDistribution: React.FC = () => {
  const { distribution, selectedYear, taxContribution, isLoading, error, lastUpdateDate, isLiveData, calculateDistribution } = useTaxContext();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, { amount: number, details: { name: string, percentage: number }[] }>>({});

  const toggleExpand = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const startEditing = (category: string, item: TaxDistributionItem) => {
    setEditingCategory(category);
    setEditedValues({
      ...editedValues,
      [category]: {
        amount: item.amount,
        details: item.details.map(detail => ({
          name: detail.name,
          percentage: detail.percentage
        }))
      }
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditedValues({});
  };

  const saveEditing = (category: string) => {
    // Zde by byla logika pro uložení upravených hodnot
    setEditingCategory(null);
    calculateDistribution();
  };

  const updateDetailPercentage = (category: string, detailIndex: number, newPercentage: number) => {
    const currentValues = editedValues[category];
    if (currentValues) {
      const newDetails = [...currentValues.details];
      newDetails[detailIndex] = {
        ...newDetails[detailIndex],
        percentage: Math.min(100, Math.max(0, newPercentage))
      };
      setEditedValues({
        ...editedValues,
        [category]: {
          ...currentValues,
          details: newDetails
        }
      });
    }
  };

  if (isLoading) {
    return <div className="mt-10 text-center">Načítání dat...</div>;
  }

  if (error) {
    return (
      <div className="mt-10 text-center text-red-600">
        <p>{error}</p>
        <p>Zkuste to prosím později nebo kontaktujte podporu, pokud problém přetrvává.</p>
      </div>
    );
  }

  if (distribution.length === 0) {
    return null;
  }

  const yearWarning = yearWarnings[selectedYear];
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
  ];

  return (
    <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
      <AdContainer id="ad-top" className="w-full h-[90px] mx-auto my-4" />

      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Rozdělení vašich daní pro rok {selectedYear}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Přehled, jak by bylo využito {taxContribution.toLocaleString('cs-CZ')} Kč z vašich daní
        </p>
        {yearWarning && (
          <p className="mt-2 text-sm text-yellow-600">{yearWarning}</p>
        )}
        <DataAccuracyNote />
      </div>

      <div className="relative">
        <AdContainer id="ad-sidebar" className="hidden lg:block absolute right-0 w-[160px] h-[600px] -mr-[180px]" />
        
        <div className="border-t border-gray-200">
          <div className="flex h-4">
            {distribution.map((item, index) => (
              <div
                key={item.category}
                className={`${colors[index % colors.length]}`}
                style={{ width: `${item.percentage}%` }}
                title={`${item.category}: ${item.percentage.toFixed(2)}%`}
              />
            ))}
          </div>
          
          <AdContainer id="ad-middle" className="w-full h-[90px] mx-auto my-4" />
          
          <dl>
            {distribution.map((item: TaxDistributionItem, index) => (
              <div key={item.category} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <span className={`w-4 h-4 mr-2 inline-block ${colors[index % colors.length]}`}></span>
                  <span className="cursor-pointer" onClick={() => toggleExpand(item.category)}>
                    {item.category}
                  </span>
                  {editingCategory !== item.category ? (
                    <button
                      onClick={() => startEditing(item.category, item)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="Upravit hodnoty"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="ml-2 flex space-x-1">
                      <button
                        onClick={() => saveEditing(item.category)}
                        className="p-1 text-green-500 hover:text-green-600"
                        title="Uložit změny"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-1 text-red-500 hover:text-red-600"
                        title="Zrušit úpravy"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {editingCategory === item.category ? (
                    <input
                      type="number"
                      value={editedValues[item.category]?.amount || item.amount}
                      onChange={(e) => setEditedValues({
                        ...editedValues,
                        [item.category]: {
                          ...editedValues[item.category],
                          amount: Number(e.target.value)
                        }
                      })}
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                    />
                  ) : (
                    `${item.amount.toLocaleString('cs-CZ', { style: 'currency', currency: 'CZK' })} (${item.percentage.toFixed(2)}%)`
                  )}
                  
                  {expandedCategory === item.category && item.details && (
                    <ul className="mt-2 space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center justify-between text-sm text-gray-600">
                          <span>{detail.name}</span>
                          {editingCategory === item.category ? (
                            <input
                              type="number"
                              value={editedValues[item.category]?.details[idx]?.percentage || detail.percentage}
                              onChange={(e) => updateDetailPercentage(item.category, idx, Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span>
                              {detail.amount.toLocaleString('cs-CZ', { style: 'currency', currency: 'CZK' })} 
                              ({detail.percentage.toFixed(2)}%)
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <AdContainer id="ad-bottom" className="w-full h-[90px] mx-auto my-4" />

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Zdroje dat:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600">
          {dataSources.map((source, index) => (
            <li key={index}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                {source.name} {source.year ? `(${source.year})` : ''}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaxDistribution;