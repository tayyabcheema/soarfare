import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import BookingService from '../utils/bookingService';

const TestUserPoints: React.FC = () => {
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🧪 Fetching real user data...');

      // Fetch user points
      const pointsResponse = await BookingService.getUserPoints();
      console.log('📊 User points response:', pointsResponse);
      setUserPoints(pointsResponse.points);

      // Fetch user profile
      const profileResponse = await BookingService.getUserProfile();
      console.log('👤 User profile response:', profileResponse);
      setUserProfile(profileResponse);

    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Head>
        <title>Test User Points - SoarFare</title>
        <meta name="description" content="Test page for real user points" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Real User Points</h1>
            
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Mock Data:</strong> Disabled (using real API)</p>
                  <p><strong>API Endpoint:</strong> /api/user/dashboard</p>
                  <p><strong>Authentication:</strong> Token from localStorage</p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={fetchUserData}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Fetching...' : 'Refresh User Data'}
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Fetching user data...</span>
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

              {userPoints !== null && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">User Points</h3>
                    <div className="text-2xl font-bold text-green-800">
                      {userPoints} points
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Real data fetched from API
                    </p>
                  </div>

                  {userProfile && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">User Profile Data</h3>
                      <pre className="bg-gray-50 p-4 rounded text-xs overflow-x-auto">
                        {JSON.stringify(userProfile, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Testing Instructions</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Make sure you are logged in to get real user data</li>
                  <li>• Check the browser console for detailed API logs</li>
                  <li>• The points shown should be your actual user points from the backend</li>
                  <li>• If you see 600 points, it means the API failed and fallback data is being used</li>
                  <li>• Check the network tab to see the actual API calls</li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Next Steps</h3>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Once you confirm real points are working, you can test the fare rules API</li>
                  <li>• Visit <code className="bg-purple-100 px-1 rounded">/test-fare-rules</code> to test with real session data</li>
                  <li>• The fare rules API will use the same authentication token</li>
                  <li>• You can now test the complete booking flow with real user points</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestUserPoints;
