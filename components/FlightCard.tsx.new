import React, { useState, useEffect } from 'react';
import PointsPurchaseModal from './PointsPurchaseModal';
import BookingService from '../utils/bookingService';

interface Flight {
  id: number | string;
  airline: string;
  airlineCode: string;
  logo: string;
  from: { city: string; code: string; name: string };
  to: { city: string; code: string; name: string };
  flightType: string;
  duration: string;
  points: number;
  price: number;
  class: string;
  refundable: string;
  fareSourceCode?: string;
  departureTime?: string;
  arrivalTime?: string;
  flightNumber?: string;
  stops?: number;
  isReturn?: boolean;
  returnFlight?: {
    from: { city: string; code: string; name: string };
    to: { city: string; code: string; name: string };
    departureTime: string;
    arrivalTime: string;
    flightNumber: string;
    duration: string;
    stops: number;
  };
  multiCitySegments?: Array<{
    from: { city: string; code: string; name: string };
    to: { city: string; code: string; name: string };
    departureTime: string;
    arrivalTime: string;
    flightNumber: string;
    duration: string;
    stops: number;
  }>;
  tripType?: 'single' | 'round' | 'multi';
}

interface FlightCardProps {
  flight: Flight;
  onBookNow?: (flight: Flight) => void;
  onShowMore?: (flight: Flight) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({
  flight,
  onBookNow = () => {},
  onShowMore = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await BookingService.getUserPoints();
        setCurrentUserPoints(response.points);
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    };
    fetchUserPoints();
  }, []);

  const getPassengersFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      adults: parseInt(urlParams.get('adults') || '1', 10),
      children: parseInt(urlParams.get('children') || '0', 10),
      infants: parseInt(urlParams.get('infants') || '0', 10)
    };
  };

  const saveFlightAndNavigate = (flightDetails: Flight) => {
    const passengers = getPassengersFromUrl();
    const flightWithPassengers = {
      ...flightDetails,
      passengers
    };
    sessionStorage.setItem('selectedFlight', JSON.stringify(flightWithPassengers));
    window.location.href = '/book-flight';
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    try {
      if (!flight.fareSourceCode) {
        const response = await BookingService.getFareSourceCode(flight.id.toString());
        flight.fareSourceCode = response.fareSourceCode;
      }

      if (currentUserPoints >= flight.points) {
        saveFlightAndNavigate(flight);
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
      const pointsNeeded = flight.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        saveFlightAndNavigate(flight);
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
      const pointsNeeded = flight.points - currentUserPoints;
      const purchaseResponse = await BookingService.purchasePoints(pointsNeeded);
      
      if (purchaseResponse.success) {
        setCurrentUserPoints(purchaseResponse.data.points.newTotal);
        saveFlightAndNavigate(flight);
        setShowPointsModal(false);
      }
    } catch (error) {
      console.error('Error processing new card payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const departureTime = formatTime(flight.departureTime || '');
  const arrivalTime = formatTime(flight.arrivalTime || '');
  const departureDate = formatDate(flight.departureTime || '');
  const arrivalDate = formatDate(flight.arrivalTime || '');

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
    onShowMore(flight);
  };

  const renderFlightSegment = (
    from: { city: string; code: string; name: string },
    to: { city: string; code: string; name: string },
    departureTime: string,
    arrivalTime: string,
    duration: string,
    stops: number,
    flightNumber?: string,
    title?: string
  ) => (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0">
      {title && <div className="text-sm font-semibold text-gray-700 mb-2">{title}</div>}
      <div className="flex items-center justify-between">
        {/* From */}
        <div className="text-left flex-1">
          <div className="font-bold text-lg text-gray-900 mb-1">{from.city}</div>
          <div className="text-xs text-gray-500 mb-1">{from.code} - {from.name}</div>
          <div className="text-sm font-semibold text-gray-800">{formatTime(departureTime)}</div>
        </div>

        {/* Flight Path */}
        <div className="flex flex-col items-center mx-6 flex-shrink-0">
          <div className="text-xs font-medium text-gray-600 mb-1">{duration}</div>
          <div className="flex items-center relative">
            <div className="w-12 h-0.5 bg-gray-300"></div>
            {stops > 0 && (
              <div className="w-2 h-2 bg-orange-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border border-white"></div>
            )}
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="w-0 h-0 border-l-[4px] border-l-gray-400 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent ml-1"></div>
          </div>
          <div className="text-xs text-orange-600 font-medium mt-1">
            {stops === 0 ? 'Non-stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
          </div>
          {flightNumber && <div className="text-xs text-gray-500 mt-1">{flightNumber}</div>}
        </div>

        {/* To */}
        <div className="text-right flex-1">
          <div className="font-bold text-lg text-gray-900 mb-1">{to.city}</div>
          <div className="text-xs text-gray-500 mb-1">{to.code} - {to.name}</div>
          <div className="text-sm font-semibold text-gray-800">{formatTime(arrivalTime)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch">
        {/* Left: Airline Info */}
        <div className="flex items-center space-x-6 p-4 lg:p-6 w-full lg:w-64 lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden p-2">
            {flight.logo && flight.logo.includes('travelpack.com') ? (
              <img 
                src={flight.logo} 
                alt={flight.airlineCode}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <svg className={`w-6 h-6 text-gray-600 ${flight.logo && flight.logo.includes('travelpack.com') ? 'hidden' : ''}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-gray-900 text-lg mb-2">{flight.airline}</div>
            {(flight.isReturn || flight.multiCitySegments) && (
              <div 
                className="text-sm text-gray-500 flex items-center cursor-pointer hover:text-gray-700 transition-colors"
                onClick={handleShowMore}
              >
                Show more 
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Center: Route Info */}
        <div className="flex-1 flex items-center justify-left p-4 lg:px-2 lg:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full max-w-lg space-y-4 md:space-y-0">
            {/* Outbound Flight */}
            <div className="text-left flex-1 w-full md:w-auto">
              <div className="font-bold text-xl lg:text-2xl text-gray-900 mb-1">{flight.from.city}</div>
              <div className="text-xs lg:text-sm text-gray-500 mb-1">{flight.from.code} - {flight.from.name}</div>
              {departureTime && (
                <div className="text-base lg:text-lg font-semibold text-gray-800">{departureTime}</div>
              )}
              {flight.tripType === 'round' && (
                <div className="text-xs text-blue-600 mt-1">Outbound</div>
              )}
            </div>

            {/* Flight Path with duration and stops */}
            <div className="flex flex-col items-center mx-4 lg:mx-8 flex-shrink-0">
              <div className="text-xs lg:text-sm font-medium text-gray-600 mb-2">{flight.duration}</div>
              <div className="flex items-center relative">
                <div className="w-12 lg:w-16 h-0.5 bg-gray-300"></div>
                {(flight.stops || 0) > 0 && (
                  <div className="w-3 h-3 bg-orange-500 rounded-full absolute left-1/2 transform -translate-x-1/2 border-2 border-white"></div>
                )}
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="w-0 h-0 border-l-[6px] border-l-gray-400 border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent ml-1"></div>
              </div>
              <div className="text-xs text-orange-600 font-medium mt-2">
                {(flight.stops || 0) === 0 ? 'Non-stop' : `${flight.stops} Stop${(flight.stops || 0) > 1 ? 's' : ''}`}
              </div>
              {flight.tripType === 'round' && flight.returnFlight && (
                <div className="text-xs text-green-600 mt-1">+ Return</div>
              )}
              {flight.tripType === 'multi' && flight.multiCitySegments && (
                <div className="text-xs text-purple-600 mt-1">+ {flight.multiCitySegments.length - 1} more</div>
              )}
            </div>

            {/* To */}
            <div className="text-left md:text-right flex-1 w-full md:w-auto">
              <div className="font-bold text-xl lg:text-2xl text-gray-900 mb-1">{flight.to.city}</div>
              <div className="text-xs lg:text-sm text-gray-500 mb-1">{flight.to.code} - {flight.to.name}</div>
              {arrivalTime && (
                <div className="text-base lg:text-lg font-semibold text-gray-800">{arrivalTime}</div>
              )}
              {flight.tripType === 'round' && (
                <div className="text-xs text-blue-600 mt-1">Outbound</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Price & Book Button */}
        <div className="bg-orange/30 lg:rounded-r-2xl p-4 lg:pl-16 lg:pr-16 text-center w-full lg:min-w-[340px] flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-orange-100">
          <div className="text-xl lg:text-2xl font-bold text-gray mb-1">
            {flight.points.toLocaleString()} Points
          </div>
          {flight.price > 0 && (
            <div className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">
              ${flight.price.toLocaleString()}
            </div>
          )}
          <button 
            className={`${isLoading ? 'bg-gray-400' : 'bg-orange hover:bg-orange-600'} text-white py-2.5 lg:py-3 rounded-xl font-semibold transition-colors`}
            onClick={handleBookNow}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </button>
        </div>

        {/* Points Purchase Modal */}
        <PointsPurchaseModal
          isOpen={showPointsModal}
          onClose={() => setShowPointsModal(false)}
          onUseCard={handleUseCard}
          onInputNewCard={handleInputNewCard}
          currentPoints={currentUserPoints}
          requiredPoints={flight.points}
          pointsNeeded={flight.points - currentUserPoints}
          purchaseAmount={195} // This should be calculated based on your points-to-dollars conversion
        />
      </div>

      {/* Expanded Details */}
      {isExpanded && (flight.isReturn || flight.multiCitySegments) && (
        <div className="border-t border-gray-200 p-4 lg:p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Return Flight Details */}
            {flight.isReturn && flight.returnFlight && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Return Flight Details</h4>
                {renderFlightSegment(
                  flight.returnFlight.from,
                  flight.returnFlight.to,
                  flight.returnFlight.departureTime,
                  flight.returnFlight.arrivalTime,
                  flight.returnFlight.duration,
                  flight.returnFlight.stops,
                  flight.returnFlight.flightNumber,
                  "Return Journey"
                )}
              </div>
            )}

            {/* Multi-City Flight Details */}
            {flight.multiCitySegments && flight.multiCitySegments.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Multi-City Flight Details</h4>
                {flight.multiCitySegments.map((segment, index) => (
                  <div key={index}>
                    {renderFlightSegment(
                      segment.from,
                      segment.to,
                      segment.departureTime,
                      segment.arrivalTime,
                      segment.duration,
                      segment.stops,
                      segment.flightNumber,
                      `Segment ${index + 1}`
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
