'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import ViolationsDisplay from '@/components/ViolationsDisplay';
import { SearchParams, ViolationSearchResult } from '@/types/violations';

export default function Home() {
  const [searchResult, setSearchResult] = useState<ViolationSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (params.licensePlate) {
        queryParams.append('licensePlate', params.licensePlate);
        queryParams.append('state', params.state || 'NY');
      }
      
      if (params.ticketNumber) {
        queryParams.append('ticketNumber', params.ticketNumber);
      }
      
      if (params.borough) {
        queryParams.append('borough', params.borough);
      }
      
      queryParams.append('limit', (params.limit || 50).toString());
      queryParams.append('offset', (params.offset || 0).toString());

      const response = await fetch(`/api/violations?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: ViolationSearchResult = await response.json();
      setSearchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              NYC Parking Violations Lookup
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Search for parking violations by license plate number
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        <ViolationsDisplay 
          searchResult={searchResult} 
          isLoading={isLoading} 
          error={error} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              Data provided by{' '}
              <a 
                href="https://opendata.cityofnewyork.us/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                NYC Open Data
              </a>
            </p>
            <p className="mt-1">
              This application helps you search for parking violations in New York City
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
