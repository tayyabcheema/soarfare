import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TravelerDetailsForm from '../components/TravelerDetailsForm';
import type { TravelerFormData } from '../components/TravelerDetailsForm';
import BookingService from '../utils/bookingService';
import { CenteredLoader } from '../components/ui/LoadingSpinner';
import PointsPurchaseModal from '../components/PointsPurchaseModal';

const BookFlight = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState<any>(null);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get flight details from query params or session storage
    const details = sessionStorage.getItem('selectedFlight');
    if (details) {
      const flightData = JSON.parse(details);
      setFlightDetails(flightData);
      
      // Check if user has enough points
      checkUserPoints(flightData);
    } else {
      router.push('/search');
    }
  }, [router]);

  const checkUserPoints = async (flightData: any) => {
    try {
      const response = await BookingService.getUserPoints();
      setCurrentUserPoints(response.points);
      
      if (response.points < flightData.points) {
        setShowPointsModal(true);
      }
    } catch (error) {
      console.error('Error checking user points:', error);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  const handleUseCard = async () => {
    setIsLoading(true);
    try {
      const pointsNeeded = flightDetails.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        setShowPointsModal(false);
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
      const pointsNeeded = flightDetails.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        setShowPointsModal(false);
      }
    } catch (error) {
      console.error('Error processing new card payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTravelerDetailsSubmit = async (formData: TravelerFormData) => {
    try {
      // Save traveler details
      sessionStorage.setItem('travelerDetails', JSON.stringify(formData));

      // Proceed with booking
      const bookingData = {
        ...flightDetails,
        traveler: formData,
      };

      const response = await BookingService.bookFlight(bookingData);

      if (response.success) {
        // Save booking reference and proceed to confirmation
        sessionStorage.setItem('bookingReference', response.data.bookingId);
        router.push('/booking-confirmation');
      } else {
        // Handle booking error
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred during booking. Please try again.');
    }
  };

  if (!flightDetails) {
    return <CenteredLoader size="xl" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">BOOK FLIGHT</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
        </div>

        <TravelerDetailsForm
          onBack={handleBack}
          onSubmit={handleTravelerDetailsSubmit}
        />

        {/* Points Purchase Modal */}
        {flightDetails && (
          <PointsPurchaseModal
            isOpen={showPointsModal}
            onClose={() => setShowPointsModal(false)}
            onUseCard={handleUseCard}
            onInputNewCard={handleInputNewCard}
            currentPoints={currentUserPoints}
            requiredPoints={flightDetails.points}
            pointsNeeded={flightDetails.points - currentUserPoints}
            purchaseAmount={Math.ceil((flightDetails.points - currentUserPoints) * 3.75)}
          />
        )}
      </div>
    </div>
  );
};

export default BookFlight;
