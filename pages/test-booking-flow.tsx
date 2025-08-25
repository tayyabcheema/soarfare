import React, { useState, useEffect } from 'react';
import BookingService from '../utils/bookingService';
import PointsPurchaseModal from '../components/PointsPurchaseModal';

const TestBookingFlow = () => {
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testFlight, setTestFlight] = useState({
    id: 'test-flight-1',
    points: 800,
    price: 1200,
    from: { city: 'New York', code: 'JFK' },
    to: { city: 'London', code: 'LHR' },
    departureTime: '2025-01-15T10:00:00Z',
    arrivalTime: '2025-01-15T22:00:00Z',
    airline: 'British Airways',
    flightNumber: 'BA001'
  });

  useEffect(() => {
    fetchUserPoints();
  }, []);

  const fetchUserPoints = async () => {
    try {
      const response = await BookingService.getUserPoints();
      setCurrentUserPoints(response.points);
    } catch (error) {
      console.error('Error fetching user points:', error);
    }
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    try {
      if (currentUserPoints >= testFlight.points) {
        alert('✅ User has enough points! Proceeding to booking...');
        // Simulate navigation to booking page
        sessionStorage.setItem('selectedFlight', JSON.stringify(testFlight));
      } else {
        setShowPointsModal(true);
      }
    } catch (error) {
      console.error('Error during booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCard = async () => {
    setIsLoading(true);
    try {
      const pointsNeeded = testFlight.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        setShowPointsModal(false);
        alert('✅ Points purchased successfully! Proceeding to booking...');
        sessionStorage.setItem('selectedFlight', JSON.stringify(testFlight));
      }
    } catch (error) {
      console.error('Error processing card payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputNewCard = async () => {
    setIsLoading(true);
    try {
      const pointsNeeded = testFlight.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        setShowPointsModal(false);
        alert('✅ Points purchased successfully! Proceeding to booking...');
        sessionStorage.setItem('selectedFlight', JSON.stringify(testFlight));
      }
    } catch (error) {
      console.error('Error processing new card payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">🧪 Test Booking Flow</h1>
          <p className="text-gray-600">Testing the points validation system</p>
        </div>

        {/* User Points Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User Points</h2>
          <div className="text-3xl font-bold text-blue-600">{currentUserPoints.toLocaleString()}</div>
        </div>

        {/* Test Flight Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Flight</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-semibold">{testFlight.from.city} ({testFlight.from.code}) → {testFlight.to.city} ({testFlight.to.code})</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Airline</p>
              <p className="font-semibold">{testFlight.airline} {testFlight.flightNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Required Points</p>
              <p className="font-semibold text-orange-600">{testFlight.points.toLocaleString()} Points</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-semibold">${testFlight.price.toLocaleString()}</p>
            </div>
          </div>

          {/* Points Status */}
          <div className="mb-4 p-4 rounded-lg bg-gray-50">
            {currentUserPoints >= testFlight.points ? (
              <div className="text-green-600 font-semibold">
                ✅ You have enough points to book this flight!
              </div>
            ) : (
              <div className="text-red-600 font-semibold">
                ❌ You need {testFlight.points - currentUserPoints} more points to book this flight
              </div>
            )}
          </div>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : currentUserPoints >= testFlight.points 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Test Instructions:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Click "Book Now" to test the points validation</li>
            <li>• If you have enough points, it will proceed to booking</li>
            <li>• If you don't have enough points, the purchase modal will appear</li>
            <li>• Use the modal to purchase additional points</li>
            <li>• After purchasing points, you can proceed with booking</li>
          </ul>
        </div>

        {/* Points Purchase Modal */}
        <PointsPurchaseModal
          isOpen={showPointsModal}
          onClose={() => setShowPointsModal(false)}
          onUseCard={handleUseCard}
          onInputNewCard={handleInputNewCard}
          currentPoints={currentUserPoints}
          requiredPoints={testFlight.points}
          pointsNeeded={testFlight.points - currentUserPoints}
          purchaseAmount={Math.ceil((testFlight.points - currentUserPoints) * 3.75)}
        />
      </div>
    </div>
  );
};

export default TestBookingFlow;
