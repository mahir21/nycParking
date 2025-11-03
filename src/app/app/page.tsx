'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import SearchForm from '@/components/SearchForm';
import ViolationsDisplay from '@/components/ViolationsDisplay';
import Navigation from '@/components/Navigation';
import { SearchParams, ViolationSearchResult } from '@/types/violations';

export default function App() {
  const { data: session, status } = useSession();
  const [searchResult, setSearchResult] = useState<ViolationSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show app immediately, don't wait for session
  // This ensures the app loads even if there are authentication issues

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

      const response = await fetch(`/api/violations?${queryParams}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch violations');
      }

      const data: ViolationSearchResult = await response.json();
      setSearchResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {session && session.user ? (
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-slate-800">
                  Welcome back, {session.user.firstName || session.user.name || session.user.email || 'User'}! 👋
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  Search for parking violations and manage your monitored vehicles
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  NYC Parking Violations Lookup
                </h1>
                <p className="mt-2 text-lg text-slate-600">
                  Search for parking violations by license plate or ticket number
                </p>
                <div className="mt-4 text-sm text-slate-500">
                  <p>🔓 You can search without an account, or <a href="/auth/signin" className="text-sky-600 hover:underline">sign in</a> for personalized features</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions for Logged-in Users */}
      {session && session.user && (
        <div className="bg-sky-50 border-b border-sky-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-sky-800">
                <span className="font-medium">Logged in as:</span> {session.user.email || 'User'}
              </div>
              <div className="mt-2 sm:mt-0 flex space-x-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-700 bg-sky-100 hover:bg-sky-200"
                >
                  📊 My Dashboard
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200"
                >
                  + Add Plate to Monitor
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Prompt for Non-logged-in Users */}
      {!session && status === 'unauthenticated' && (
        <div className="bg-yellow-50 border-b border-yellow-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="text-center">
              <p className="text-sm text-yellow-800">
                💡 <strong>Want email alerts for new violations?</strong> 
                <a href="/auth/signin" className="ml-1 font-medium text-yellow-900 underline hover:text-yellow-700">
                  Sign in
                </a> or 
                <a href="/auth/signup" className="ml-1 font-medium text-yellow-900 underline hover:text-yellow-700">
                  create an account
                </a> to monitor your license plates automatically.
              </p>
            </div>
          </div>
        </div>
      )}

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
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-slate-500">
            <p>Data provided by NYC Open Data. Real-time parking violation information.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}