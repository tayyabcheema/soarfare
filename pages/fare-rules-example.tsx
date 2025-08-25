import React, { useState } from 'react';
import Head from 'next/head';
import FareRulesModal from '../components/FareRulesModal';

const FareRulesExample: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [sessionId, setSessionId] = useState('68aa0065ab5aa6834D0AF-F32F-45FE-9224-E6E52EC81D6E-29068aa0065ab5ae');
  const [fareSourceCode, setFareSourceCode] = useState('SWhuQ2JyVkhWclIvNjZhNzBCTHlvdG1CeGdjalRheWJQcXBraFlweVhHa3NNbjdZODJDVkNINkhLemd6eEhJYi91cVZlQUJuVERTQS9ma29BMFc5d0RyM0F1TG9zWlA4bnVRUXI3OG1PWWZDM3NvMm5MY29FQXl4QkZGUXhjVWhtM1hwdGx6UU96QmdsNDljS1RvcTZ3PT0=');

  const handleShowFareRules = () => {
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>Fare Rules API Example - SoarFare</title>
        <meta name="description" content="Example of using the Fare Rules API" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Fare Rules API Example</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Use the Fare Rules API</h2>
                <p className="text-gray-600 mb-4">
                  This example demonstrates how to integrate the fare rules API into your application. 
                  The API requires a session ID and fare source code from a flight search result.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">API Endpoint</h3>
                <code className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded">
                  POST /api/fare-rules
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session ID
                  </label>
                  <input
                    type="text"
                    value={sessionId}
                    onChange={(e) => setSessionId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter session ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Session ID from flight search response
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fare Source Code
                  </label>
                  <input
                    type="text"
                    value={fareSourceCode}
                    onChange={(e) => setFareSourceCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter fare source code"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Fare source code from selected flight
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Request Body Example</h3>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
{`{
  "session_id": "${sessionId}",
  "fare_source_code": "${fareSourceCode}"
}`}
                </pre>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleShowFareRules}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Get Fare Rules
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Integration Notes</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• The API automatically includes the authentication token from localStorage</li>
                  <li>• CORS issues are handled by the proxy endpoint</li>
                  <li>• The response includes detailed fare rules and restrictions</li>
                  <li>• Error handling is built into the utility functions</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Code Example</h3>
                <pre className="text-sm text-green-800 bg-white p-3 rounded border overflow-x-auto">
{`import FareRulesApi from '../utils/fareRulesApi';

// Get fare rules
const response = await FareRulesApi.getFareRules(
  sessionId, 
  fareSourceCode
);

if (response.success) {
  console.log('Fare rules:', response.data);
} else {
  console.error('Error:', response.message);
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FareRulesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        sessionId={sessionId}
        fareSourceCode={fareSourceCode}
        flightInfo={{
          from: 'New York (JFK)',
          to: 'London (LHR)',
          airline: 'British Airways',
          flightNumber: 'BA 178'
        }}
      />
    </>
  );
};

export default FareRulesExample;
