'use client';

import { useState } from 'react';
import { SearchParams } from '@/types/violations';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [licensePlate, setLicensePlate] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [state, setState] = useState('NY');
  const [borough, setBorough] = useState('');
  const [searchType, setSearchType] = useState<'plate' | 'ticket'>('plate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'plate' && licensePlate.trim()) {
      onSearch({
        licensePlate: licensePlate.trim().toUpperCase(),
        state: state.toUpperCase(),
        borough: borough,
        limit: 50,
        offset: 0
      });
    } else if (searchType === 'ticket' && ticketNumber.trim()) {
      onSearch({
        ticketNumber: ticketNumber.trim(),
        borough: borough,
        limit: 50,
        offset: 0
      });
    }
  };

  const states = [
    'NY', 'NJ', 'CT', 'PA', 'FL', 'CA', 'TX', 'MA', 'VA', 'MD',
    'NC', 'GA', 'OH', 'IL', 'MI', 'WA', 'OR', 'AZ', 'CO', 'NV'
  ];

  const nycBoroughs = [
    { value: '', label: 'All Boroughs' },
    { value: 'MANHATTAN', label: 'Manhattan' },
    { value: 'QUEENS', label: 'Queens' },
    { value: 'BROOKLYN', label: 'Brooklyn' },
    { value: 'BRONX', label: 'Bronx' },
    { value: 'STATEN ISLAND', label: 'Staten Island' }
  ];

  return (
    <div className="bg-white shadow-xl rounded-xl p-8 mb-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        🔍 Search Parking Violations
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Search Type Toggle */}
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            onClick={() => setSearchType('plate')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'plate'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isLoading}
          >
            🚗 Search by License Plate
          </button>
          <button
            type="button"
            onClick={() => setSearchType('ticket')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              searchType === 'ticket'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={isLoading}
          >
            🎫 Search by Ticket Number
          </button>
        </div>

        {/* Search Fields */}
        {searchType === 'plate' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="licensePlate" className="block text-sm font-semibold text-gray-800 mb-2">
                  License Plate Number
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  placeholder="Enter license plate (e.g., ABC1234)"
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900 bg-white placeholder-gray-500 shadow-sm hover:border-gray-500 transition-colors"
                  required
                  disabled={isLoading}
                  maxLength={10}
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-gray-800 mb-2">
                  Registration State
                </label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900 bg-white shadow-sm hover:border-gray-500 transition-colors"
                  disabled={isLoading}
                >
                  {states.map((stateCode) => (
                    <option key={stateCode} value={stateCode} className="text-gray-900 font-medium">
                      {stateCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Borough Filter - Always show for all searches */}
            <div>
              <label htmlFor="borough" className="block text-sm font-semibold text-gray-800 mb-2">
                🏙️ Filter by NYC Borough (Optional)
              </label>
              <select
                id="borough"
                value={borough}
                onChange={(e) => setBorough(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900 bg-white shadow-sm hover:border-gray-500 transition-colors"
                disabled={isLoading}
              >
                {nycBoroughs.map((boroughOption) => (
                  <option key={boroughOption.value} value={boroughOption.value} className="text-gray-900 font-medium">
                    {boroughOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="ticketNumber" className="block text-sm font-semibold text-gray-800 mb-2">
                Ticket Number (Summons Number)
              </label>
              <input
                type="text"
                id="ticketNumber"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Enter ticket number (e.g., 1234567890)"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900 bg-white placeholder-gray-500 shadow-sm hover:border-gray-500 transition-colors"
                required
                disabled={isLoading}
                maxLength={15}
              />
            </div>
            
            {/* Borough Filter for ticket search too */}
            <div>
              <label htmlFor="borough" className="block text-sm font-semibold text-gray-800 mb-2">
                🏙️ Filter by NYC Borough (Optional)
              </label>
              <select
                id="borough"
                value={borough}
                onChange={(e) => setBorough(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold text-gray-900 bg-white shadow-sm hover:border-gray-500 transition-colors"
                disabled={isLoading}
              >
                {nycBoroughs.map((boroughOption) => (
                  <option key={boroughOption.value} value={boroughOption.value} className="text-gray-900 font-medium">
                    {boroughOption.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || (searchType === 'plate' ? !licensePlate.trim() : !ticketNumber.trim())}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              🔍 Search {searchType === 'plate' ? 'by License Plate' : 'by Ticket Number'}
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 font-medium">
          <strong>💡 Note:</strong> Search NYC parking violation records by license plate or ticket number. 
          Data may take a few moments to load and includes violations from recent years.
        </p>
        {searchType === 'ticket' && (
          <p className="text-sm text-blue-700 mt-2">
            <strong>Tip:</strong> Ticket numbers are typically 10-digit numbers found on your parking violation summons.
          </p>
        )}
      </div>
    </div>
  );
}