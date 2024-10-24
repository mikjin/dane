import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { fetchWithRetry } from '../utils/api';
import { API_CONFIG } from '../config/apiConfig';
import { useTaxContext } from '../context/TaxContext';

interface ApiStatus {
  name: string;
  isWorking: boolean;
  lastChecked: Date;
}

const ApiStatusIndicator: React.FC = () => {
  const [apiStatuses, setApiStatuses] = useState<Record<string, ApiStatus[]>>({});
  const [isAnyApiWorking, setIsAnyApiWorking] = useState(false);
  const { resetData } = useTaxContext();

  const checkApiStatus = async () => {
    const newStatuses: Record<string, ApiStatus[]> = {};
    let anyWorking = false;

    for (const [key, endpoints] of Object.entries(API_CONFIG)) {
      newStatuses[key] = [];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetchWithRetry(key as keyof typeof API_CONFIG);
          const isWorking = response !== null;
          
          if (isWorking) {
            anyWorking = true;
          }

          newStatuses[key].push({
            name: endpoint.name,
            isWorking,
            lastChecked: new Date()
          });
        } catch {
          newStatuses[key].push({
            name: endpoint.name,
            isWorking: false,
            lastChecked: new Date()
          });
        }
      }
    }

    setApiStatuses(newStatuses);
    setIsAnyApiWorking(anyWorking);
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-secondary">Stav API:</span>
        <div className="flex space-x-1">
          {Object.entries(apiStatuses).map(([group, statuses]) => (
            statuses.map((status, index) => {
              const statusClass = status.isWorking ? 'bg-primary' : 'bg-error';
              const statusText = status.isWorking ? 'Funkční' : 'Nefunkční';
              const title = `${status.name}: ${statusText}`;

              return (
                <div
                  key={`${group}-${index}`}
                  className={`w-2 h-2 rounded-full ${statusClass} transition-colors`}
                  title={title}
                />
              );
            })
          ))}
        </div>
        <button
          onClick={() => {
            resetData();
            checkApiStatus();
          }}
          className="ml-2 p-1 text-secondary hover:text-primary rounded-full hover:bg-gray-100 transition-colors"
          title="Obnovit data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ApiStatusIndicator;