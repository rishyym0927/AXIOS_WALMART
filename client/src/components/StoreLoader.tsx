'use client';

import { useEffect, useState } from 'react';
import { useStoreDesigner } from '@/store/useStoreDesigner';
import { Loader2 } from 'lucide-react';

interface StoreLoaderProps {
  children: React.ReactNode;
}

export default function StoreLoader({ children }: StoreLoaderProps) {
  const { isLoading, error, fetchStoreFromServer } = useStoreDesigner();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch store data on component mount
  useEffect(() => {
    const loadStoreData = async () => {
      try {
        await fetchStoreFromServer();
      } finally {
        setInitialLoadComplete(true);
      }
    };

    loadStoreData();
  }, [fetchStoreFromServer]);

  if (!initialLoadComplete) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-lg font-medium text-gray-700">Loading store layout...</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => fetchStoreFromServer()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Updating...</span>
        </div>
      )}
    </>
  );
}
