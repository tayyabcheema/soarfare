import React, { useState } from 'react';
import Head from 'next/head';
import FareRulesApi from '../utils/fareRulesApi';

const TestFareRules: React.FC = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use the actual session ID from your flight search
  const [sessionId, setSessionId] = useState('68abfb690b6886834D0AF-F32F-45FE-9224-E6E52EC81D6E-29068abfb690b68a');
  const [fareSourceCode, setFareSourceCode] = useState('SWhuQ2JyVkhWclIvNjZhNzBCTHlvdG1CeGdjalRheWJQcXBraFlweVhHa3NNbjdZODJDVkNINkhLemd6eEhJYi91cVZlQUJuVERTQS9ma29BMFc5d0RyM0F1TG9zWlA4bnVRUXI3OG1PWWZDM3NvMm5MY29FQXl4QkZGUXhjVWhtM1hwdGx6UU96QmdsNDljS1RvcTZ3PT0=');

  const fetchLatestSessionId = () => {
    // Try to get session ID from localStorage or sessionStorage
    const storedSessionId = localStorage.getItem('latest_session_id') || 
                           sessionStorage.getItem('latest_session_id');
    
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('📝 Updated session ID from storage:', storedSessionId);
    }
  };

  const testFareRules = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('🧪 Testing fare rules API...');
      console.log('📝 Session ID:', sessionId);
      console.log('📝 Fare Source Code:', fareSourceCode);

      const response = await FareRulesApi.getFareRules(sessionId, fareSourceCode);
      
      console.log('📥 Fare rules response:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Error testing fare rules:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Test Fare Rules API - SoarFare</title>
        <meta name="description" content="Test page for Fare Rules API" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Fare Rules API</h1>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Test Parameters</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Session ID:</strong> {sessionId}</p>
                  <p><strong>Fare Source Code:</strong> {fareSourceCode.substring(0, 50)}...</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={fetchLatestSessionId}
                  className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Fetch Latest Session ID
                </button>
                <button
                  onClick={testFareRules}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Fare Rules API'}
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Testing fare rules API...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

              {result && (
                <div className="space-y-4">
                  <div className={`border rounded-lg p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                      API Response
                    </h3>
                    <div className="text-sm">
                      <p><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</p>
                      {result.message && <p><strong>Message:</strong> {result.message}</p>}
                      {result.error && <p><strong>Error:</strong> {result.error}</p>}
                    </div>
                  </div>

                  {result.data && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Response Data</h3>
                      <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Instructions</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• This page tests the fare rules API with the actual session ID from your flight search</li>
                  <li>• Check the browser console for detailed logs</li>
                  <li>• The API should return fare rules data if successful</li>
                  <li>• If there's an error, check the network tab for the actual API call</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestFareRules;
