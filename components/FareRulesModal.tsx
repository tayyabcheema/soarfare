import React, { useState, useEffect } from 'react';
import FareRulesApi from '../utils/fareRulesApi';

interface FareRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  fareSourceCode: string;
  flightInfo?: {
    from: string;
    to: string;
    airline: string;
    flightNumber: string;
  };
}

const FareRulesModal: React.FC<FareRulesModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  fareSourceCode,
  flightInfo
}) => {
  const [fareRules, setFareRules] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sessionId && fareSourceCode) {
      fetchFareRules();
    }
  }, [isOpen, sessionId, fareSourceCode]);

  const fetchFareRules = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await FareRulesApi.getFareRules(sessionId, fareSourceCode);
      
      if (response.success) {
        setFareRules(response.data);
      } else {
        setError(response.message || 'Failed to fetch fare rules');
      }
    } catch (err) {
      setError('An error occurred while fetching fare rules');
      console.error('Error fetching fare rules:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Fare Rules</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {flightInfo && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Flight Information</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Route:</strong> {flightInfo.from} → {flightInfo.to}</p>
              <p><strong>Airline:</strong> {flightInfo.airline}</p>
              <p><strong>Flight:</strong> {flightInfo.flightNumber}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading fare rules...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {fareRules && !loading && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Fare Rules Retrieved Successfully</h3>
                  <div className="mt-2 text-sm text-green-700">
                    Session ID: {sessionId.substring(0, 20)}...
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Fare Rules Data</h3>
              <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                {JSON.stringify(fareRules, null, 2)}
              </pre>
            </div>

            {/* You can add more structured display of fare rules here */}
            {fareRules.rules && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Rules Summary</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(fareRules.rules).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FareRulesModal;
