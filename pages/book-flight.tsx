import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TravelerDetailsForm from '../components/TravelerDetailsForm';
import type { TravelerFormData } from '../components/TravelerDetailsForm';
import BookingService from '../utils/bookingService';

const BookFlight = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [flightDetails, setFlightDetails] = useState<any>(null);

  useEffect(() => {
    // Get flight details from query params or session storage
    const details = sessionStorage.getItem('selectedFlight');
    if (details) {
      setFlightDetails(JSON.parse(details));
    } else {
      router.push('/search');
    }
  }, [router]);

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
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
    return <div>Loading...</div>;
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
      </div>
    </div>
  );
};

export default BookFlight;
