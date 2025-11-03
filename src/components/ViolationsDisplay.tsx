'use client';

import { ParkingViolation, ViolationSearchResult } from '@/types/violations';

interface ViolationsDisplayProps {
  searchResult: ViolationSearchResult | null;
  isLoading: boolean;
  error: string | null;
}

export default function ViolationsDisplay({ searchResult, isLoading, error }: ViolationsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <h3 className="text-red-800 font-semibold">Error loading violations</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  if (!searchResult) {
    return null;
  }

  const { violations, totalCount, licensePlate } = searchResult;

  if (violations.length === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="h-5 w-5 text-emerald-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <h3 className="text-emerald-800 font-semibold">Great news!</h3>
        </div>
        <p className="text-emerald-700 mt-2">
          No parking violations found for license plate <strong>{licensePlate}</strong>.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 4) return timeStr;
    
    // Format time from HHMM to HH:MM AM/PM
    const hours = parseInt(timeStr.substring(0, 2));
    const minutes = timeStr.substring(2, 4);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800">
          Violations for {licensePlate}
        </h3>
        <p className="text-slate-600 mt-1">
          Found {totalCount} violation{totalCount !== 1 ? 's' : ''} 
          {violations.length < totalCount && ` (showing first ${violations.length})`}
        </p>
      </div>

      <div className="space-y-4">
        {violations.map((violation) => (
          <div key={violation.summons_number} className="border-2 border-gray-300 rounded-xl p-6 hover:shadow-lg hover:border-sky-300 transition-all duration-200 bg-gradient-to-r from-white to-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Ticket Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b-2 border-sky-200 pb-2 text-lg">🎫 Ticket Details</h4>
                <div>
                  <span className="text-sm font-semibold text-slate-700">Ticket Number:</span>
                  <p className="font-mono text-xl font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded mt-1">{violation.summons_number}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-700">Date:</span>
                  <p className="font-bold text-slate-800">{formatDate(violation.issue_date)}</p>
                </div>
                {violation.violation_time && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Time:</span>
                    <p className="font-bold text-slate-800">{formatTime(violation.violation_time)}</p>
                  </div>
                )}
              </div>

              {/* Violation Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b-2 border-indigo-200 pb-2 text-lg">⚠️ Violation</h4>
                <div>
                  <span className="text-sm font-semibold text-slate-700">Code:</span>
                  <p className="font-bold text-indigo-600 text-lg">{violation.violation_code}</p>
                </div>
                {violation.violation_description && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Description:</span>
                    <p className="font-semibold text-slate-800 bg-indigo-50 px-2 py-1 rounded mt-1">{violation.violation_description}</p>
                  </div>
                )}
                {violation.issuing_agency && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Issuing Agency:</span>
                    <p className="font-bold text-slate-800">{violation.issuing_agency}</p>
                  </div>
                )}
              </div>

              {/* Location & Vehicle Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 border-b-2 border-emerald-200 pb-2 text-lg">📍 Location & Vehicle</h4>
                {violation.street_name && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Location:</span>
                    <p className="font-bold text-slate-800">
                      {violation.house_number && `${violation.house_number} `}
                      {violation.street_name}
                    </p>
                  </div>
                )}
                {violation.violation_county && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">County:</span>
                    <p className="font-bold text-slate-800">{violation.violation_county}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {violation.vehicle_make && (
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Make:</span>
                      <p className="font-bold text-slate-800">{violation.vehicle_make}</p>
                    </div>
                  )}
                  {violation.vehicle_year && (
                    <div>
                      <span className="text-sm font-semibold text-slate-700">Year:</span>
                      <p className="font-bold text-slate-800">{violation.vehicle_year}</p>
                    </div>
                  )}
                </div>
                {violation.vehicle_color && (
                  <div>
                    <span className="text-sm font-semibold text-slate-700">Color:</span>
                    <p className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded mt-1">{violation.vehicle_color}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {violations.length < totalCount && (
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            Showing {violations.length} of {totalCount} violations
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Use the API directly for pagination or contact support for more results
          </p>
        </div>
      )}
    </div>
  );
}