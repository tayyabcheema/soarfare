  // Highlight matched substring in suggestions
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part)
        ? <span key={i} className="font-bold text-orange-500">{part}</span>
        : part
    );
  };
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, FlightSearchData, FlightSearchResponse } from '../lib/api';
import airports from '../airports.js';

type Airport = { name: string; iata: string; city: string; country: string };

interface Passenger {
  adults: number;
  children: number;
  infants: number;
}

interface MultiCitySegment {
  from: string;
  to: string;
  date: string;
  fromQuery: string;
  toQuery: string;
}

interface ValidationErrors {
  general?: string;
  sameAirport?: string;
  pastDate?: string;
  returnBeforeTravel?: string;
  multiCity?: string[];
}

const FlightSearch: React.FC = () => {
  const today = new Date();
  const formatDateDisplay = (date: Date | string) => {
    if (!date) return 'mm/dd/yyyy';
    
    // If it's a string in YYYY-MM-DD format, just format it directly
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          const [year, month, day] = date.split('-').map(Number);
          // Create local date (year, month-1, day)
          const localDate = new Date(year, month - 1, day);
          return localDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }
    
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };
  const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Main state
  const [tripType, setTripType] = useState<'round' | 'single' | 'multi'>('single');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [travelDate, setTravelDate] = useState(formatDateInput(today));
  const [returnDate, setReturnDate] = useState('');
  const [seatClass, setSeatClass] = useState('Economy');
  const [passengers, setPassengers] = useState<Passenger>({ adults: 1, children: 0, infants: 0 });
  const [multiCitySegments, setMultiCitySegments] = useState<MultiCitySegment[]>([]);

  // UI state
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [showPassengerPanel, setShowPassengerPanel] = useState(false);
  const [showMultiCityDropdown, setShowMultiCityDropdown] = useState<{ [key: string]: boolean }>({});
  const [showMultiCityDatePicker, setShowMultiCityDatePicker] = useState<{ [key: string]: boolean }>({});

  // Validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Responsive
  const [isMobile, setIsMobile] = useState(false);

  // Router for navigation
  const router = useRouter();
  const { token } = useAuth();

  // Handle travel date change and validate return date
  const handleTravelDateChange = (newTravelDate: string) => {
    setTravelDate(newTravelDate);
    
    // If it's a round trip and return date exists, validate it
    if (tripType === 'round' && returnDate) {
      const travelDateObj = new Date(newTravelDate);
      const returnDateObj = new Date(returnDate);
      
      // If return date is before or same as travel date, set it to one day after travel
      if (returnDateObj <= travelDateObj) {
        const nextDay = new Date(travelDateObj);
        nextDay.setDate(nextDay.getDate() + 1);
        setReturnDate(formatDateInput(nextDay));
      }
    }
  };

  // Enhanced close all modals function
  const closeAllModals = () => {
    setShowFromDropdown(false);
    setShowToDropdown(false);
    setShowDatePicker(false);
    setShowReturnDatePicker(false);
    setShowPassengerPanel(false);
    setShowMultiCityDropdown({});
    setShowMultiCityDatePicker({});
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter airports based on search query
    const filterAirports = (query: string) => {
    if (!query) return airports.slice(0, 10);
    return airports.filter(airport =>
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.iata.toLowerCase().includes(query.toLowerCase()) ||
      airport.city.toLowerCase().includes(query.toLowerCase()) ||
      airport.country.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10);
  };

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Check same airport
    if (from && to && from === to) {
      newErrors.sameAirport = 'Origin and destination cannot be the same';
    }

    // Check past dates
    const travelDateObj = new Date(travelDate);
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    
    if (travelDateObj < todayObj) {
      newErrors.pastDate = 'Travel date cannot be in the past';
    }

    // Check return date
    if (tripType === 'round' && returnDate) {
      const returnDateObj = new Date(returnDate);
      if (returnDateObj < travelDateObj) {
        newErrors.returnBeforeTravel = 'Return date must be after travel date';
      }
    }

    // Check multi-city segments
    if (tripType === 'multi') {
      const multiErrors: string[] = [];
      multiCitySegments.forEach((segment, index) => {
        if (segment.from === segment.to) {
          multiErrors[index] = `Segment ${index + 1}: Origin and destination cannot be the same`;
        }
      });
      if (multiErrors.length > 0) {
        newErrors.multiCity = multiErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle airport selection
  const handleAirportSelect = (airport: Airport, field: 'from' | 'to', segmentIndex?: number) => {
    const airportString = `${airport.name} (${airport.iata})`;
    
    if (segmentIndex !== undefined) {
      // Multi-city segment
      setMultiCitySegments(prev => prev.map((segment, index) => 
        index === segmentIndex 
          ? { ...segment, [field]: airportString, [`${field}Query`]: '' }
          : segment
      ));
      setShowMultiCityDropdown(prev => ({ ...prev, [`${field}-${segmentIndex}`]: false }));
    } else {
      // Main form
      if (field === 'from') {
        setFrom(airportString);
        setFromQuery('');
        setShowFromDropdown(false);
      } else {
        setTo(airportString);
        setToQuery('');
        setShowToDropdown(false);
      }
    }
  };

  // Multi-city functions
  const addMultiCitySegment = () => {
    if (multiCitySegments.length < 3) {
      const lastSegment = multiCitySegments[multiCitySegments.length - 1];
      const newSegment: MultiCitySegment = {
        from: lastSegment ? lastSegment.to : to,
        to: '',
        date: formatDateInput(today),
        fromQuery: '',
        toQuery: ''
      };
      setMultiCitySegments([...multiCitySegments, newSegment]);
    }
  };

  const removeMultiCitySegment = (index: number) => {
    setMultiCitySegments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle passenger count changes
  const updatePassengerCount = (type: keyof Passenger, increment: boolean) => {
    setPassengers(prev => {
      const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
      if (type === 'adults' && newCount === 0) return prev; // At least 1 adult
      return { ...prev, [type]: newCount };
    });
  };

  // Calendar component
  const Calendar = ({ selectedDate, onDateSelect, minDate, onClose }: {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    minDate?: string;
    onClose: () => void;
  }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || today));
    
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();
      
      const days = [];
      
      // Add empty cells for days before the first day of the month
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    const isDateDisabled = (date: Date | null) => {
      if (!date) return true;
      
      // Create today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Set the comparison date to midnight
      const compareDate = new Date(date);
      compareDate.setHours(0, 0, 0, 0);
      
      // Disable past dates
      if (compareDate < today) return true;
      
      // If minDate is provided, disable dates before or equal to it
      if (minDate) {
        const minDateObj = new Date(minDate);
        minDateObj.setHours(0, 0, 0, 0);
        if (compareDate <= minDateObj) return true;
      }
      
      return false;
    };

    const days = getDaysInMonth(currentMonth);
    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 w-80">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <h3 className="font-semibold text-gray-700">{monthYear}</h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => (
            <button
              key={index}
              onClick={() => {
                if (date && !isDateDisabled(date)) {
                  onDateSelect(formatDateInput(date));
                  onClose();
                }
              }}
              disabled={isDateDisabled(date)}
              className={`
                p-2 text-sm rounded hover:bg-blue-100 transition-colors
                ${!date ? 'invisible' : ''}
                ${isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-100'}
                ${date && formatDateInput(date) === selectedDate ? 'bg-[#0C2442] text-white' : ''}
              `}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Passenger panel component
  const PassengerPanel = () => (
    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-6 z-50 w-80">
      {/* Class Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
        <select
          value={seatClass}
          onChange={(e) => setSeatClass(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD7300] focus:border-transparent"
        >
          <option value="Economy">Economy</option>
          <option value="Business">Business</option>
          <option value="First">First</option>
        </select>
      </div>

      {/* Passenger counts */}
      <div className="space-y-4">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-700">Adults (12+ Years)</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updatePassengerCount('adults', false)}
              disabled={passengers.adults <= 1}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-xl">{passengers.adults}</span>
            <button
              onClick={() => updatePassengerCount('adults', true)}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-700">Children (2 - 11 Years)</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updatePassengerCount('children', false)}
              disabled={passengers.children <= 0}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-xl">{passengers.children}</span>
            <button
              onClick={() => updatePassengerCount('children', true)}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Infants */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-700">Infants (0 - 23 Month)</div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => updatePassengerCount('infants', false)}
              disabled={passengers.infants <= 0}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              −
            </button>
            <span className="w-8 text-center font-medium text-xl">{passengers.infants}</span>
            <button
              onClick={() => updatePassengerCount('infants', true)}
              className="w-10 h-10 rounded-full bg-[#0C2442] text-white flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Extract airport IATA code from airport string
  const extractAirportCode = (airportString: string): string => {
    // Assuming format is "Airport Name (CODE)"
    const match = airportString.match(/\(([A-Z]{3})\)$/);
    return match ? match[1] : airportString;
  };

  // Handle form submission
  const handleSearch = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare search parameters for URL
      const searchParams = new URLSearchParams();
      
      // Basic search data
      searchParams.append('from', extractAirportCode(from));
      searchParams.append('to', extractAirportCode(to));
      searchParams.append('travelDate', travelDate);
      searchParams.append('class', seatClass);
      searchParams.append('adults', passengers.adults.toString());
      searchParams.append('children', passengers.children.toString());
      searchParams.append('infants', passengers.infants.toString());

      // Trip type specific data
      if (tripType === 'single') {
        searchParams.append('tripType', 'single');
      } else if (tripType === 'round') {
        searchParams.append('tripType', 'round');
        searchParams.append('returnDate', returnDate);
      } else if (tripType === 'multi') {
        searchParams.append('tripType', 'multi');
        multiCitySegments.forEach((segment, index) => {
          searchParams.append(`from_mc_${index}`, extractAirportCode(segment.from));
          searchParams.append(`to_mc_${index}`, extractAirportCode(segment.to));
          searchParams.append(`date_mc_${index}`, segment.date);
        });
      }

      // Add airport details for display
      searchParams.append('fromDisplay', from);
      searchParams.append('toDisplay', to);

      // Navigate to search page with parameters
      router.push(`/search?${searchParams.toString()}`);
      
    } catch (error) {
      console.error('Navigation error:', error);
      setErrors({
        general: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Background overlay for modals */}
      {(showFromDropdown || showToDropdown || showDatePicker || showReturnDatePicker || showPassengerPanel || Object.values(showMultiCityDropdown).some(Boolean) || Object.values(showMultiCityDatePicker).some(Boolean)) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={closeAllModals}
        />
      )}

      <div 
        className="bg-[#0C2442] rounded-3xl mx-auto shadow-xl relative z-40 "
        style={{
          width: isMobile ? '90%' : '80%',
          maxWidth: '1400px',
          marginTop: isMobile ? '-12rem' : '-10rem', // revert to original position
          padding: isMobile ? '1.5rem 1rem' : '2rem',
        }}
      >
        {/* Trip Type Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Round Trip', value: 'round' as const },
            { label: 'Single Trip', value: 'single' as const },
            { label: 'Multi City', value: 'multi' as const }
          ].map((type) => (
            <label key={type.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="tripType"
                value={type.value}
                checked={tripType === type.value}
                onChange={(e) => setTripType(e.target.value as 'round' | 'single' | 'multi')}
                className="w-5 h-5 text-[#FD7300] border-white focus:ring-[#FD7300] mr-3"
              />
              <span className="text-white font-medium">{type.label}</span>
            </label>
          ))}
        </div>

        {/* Main Form Fields */}
        <div className={`grid gap-4 lg:gap-6 items-end ${
          isMobile 
            ? 'grid-cols-2' 
            : tripType === 'round' 
              ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-6' 
              : tripType === 'multi'
                ? 'grid-cols-2 sm:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-5'
        }`}>
          {/* From Field */}
          <div className="relative">
            <label className="block text-white font-bold mb-2">From</label>
            <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
              <input
                type="text"
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setShowFromDropdown(e.target.value.length >= 2);
                }}
                onFocus={() => {}}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                placeholder="Origin"
                className="bg-transparent text-white text-lg w-full focus:outline-none focus:ring-0 border-none focus:border-none focus:border-b-0"
                autoComplete="off"
              />
              <svg className="w-4 h-4 text-[#FD7300] ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* From Suggestions Dropdown */}
            {showFromDropdown && fromQuery.length >= 2 && filterAirports(fromQuery).length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm z-50">
                <div className="max-h-60 overflow-y-auto">
                  {filterAirports(fromQuery).map((airport) => (
                    <div
                      key={airport.iata}
                      onMouseDown={() => {
                        handleAirportSelect(airport, 'from');
                        setFromQuery(`${airport.name} (${airport.iata})`);
                        setShowFromDropdown(false);
                      }}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {highlightMatch(airport.name, fromQuery)} {' '}
                          (<span>{highlightMatch(airport.iata, fromQuery)}</span>)
                        </div>
                        <div className="text-sm text-gray-500">
                          {highlightMatch(airport.city, fromQuery)}, {highlightMatch(airport.country, fromQuery)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* To Field */}
          <div className="relative">
            <label className="block text-white font-bold mb-2">To</label>
            <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
              <input
                type="text"
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setShowToDropdown(e.target.value.length >= 2);
                }}
                onFocus={() => {}}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                placeholder="Destination"
                className="bg-transparent text-white text-lg w-full focus:outline-none focus:ring-0 border-none focus:border-none focus:border-b-0"
                autoComplete="off"
              />
              <svg className="w-4 h-4 text-[#FD7300] ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            {/* To Suggestions Dropdown */}
            {showToDropdown && toQuery.length >= 2 && filterAirports(toQuery).length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm z-50">
                <div className="max-h-60 overflow-y-auto">
                  {filterAirports(toQuery).map((airport) => (
                    <div
                      key={airport.iata}
                      onMouseDown={() => {
                        handleAirportSelect(airport, 'to');
                        setToQuery(`${airport.name} (${airport.iata})`);
                        setShowToDropdown(false);
                      }}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {highlightMatch(airport.name, toQuery)} {' '}
                          (<span>{highlightMatch(airport.iata, toQuery)}</span>)
                        </div>
                        <div className="text-sm text-gray-500">
                          {highlightMatch(airport.city, toQuery)}, {highlightMatch(airport.country, toQuery)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Travel Date */}
          <div className="relative">
            <label className="block text-white font-bold mb-2">Travel Date</label>
            <div 
              className="relative cursor-pointer"
              onClick={() => {
                closeAllModals();
                setShowDatePicker(true);
              }}
            >
              <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                <span className="text-white text-lg">
                  {travelDate ? formatDateDisplay(travelDate) : 'mm/dd/yyyy'}
                </span>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {showDatePicker && (
              <Calendar
                selectedDate={travelDate}
                onDateSelect={handleTravelDateChange}
                onClose={() => setShowDatePicker(false)}
              />
            )}
          </div>

          {/* Return Date (only for round trip) */}
          {tripType === 'round' && (
            <div className="relative">
              <label className="block text-white font-bold mb-2">Return Date</label>
              <div 
                className="relative cursor-pointer"
                onClick={() => {
                  closeAllModals();
                  setShowReturnDatePicker(true);
                }}
              >
                <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                  <span className="text-white text-lg">
                    {returnDate ? formatDateDisplay(returnDate) : 'mm/dd/yyyy'}
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {showReturnDatePicker && (
                <Calendar
                  selectedDate={returnDate}
                  onDateSelect={setReturnDate}
                  minDate={travelDate}
                  onClose={() => setShowReturnDatePicker(false)}
                />
              )}
            </div>
          )}

          {/* Seats & Classes (not for multi-city in the main row) */}
          {tripType !== 'multi' && (
            <div className="relative">
              <label className="block text-white font-bold mb-2">Seats & Classes</label>
              <div 
                className="relative cursor-pointer"
                onClick={() => {
                  closeAllModals();
                  setShowPassengerPanel(true);
                }}
              >
                <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-white text-lg min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
                    {seatClass}, {passengers.adults + passengers.children + passengers.infants} Passenger{(passengers.adults + passengers.children + passengers.infants) !== 1 ? 's' : ''}
                  </span>
                  <svg className="w-4 h-4 text-[#FD7300]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {showPassengerPanel && <PassengerPanel />}
            </div>
          )}

          {/* Search Button */}
          <div className={`flex justify-center ${isMobile ? 'col-span-1 mt-4' : ''}`}>
            <button
              onClick={handleSearch}
              disabled={isSubmitting}
              className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-[#FD7300] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FD7300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Multi-City Additional Segments */}
        {tripType === 'multi' && (
          <div className="mt-8 space-y-6">
            {multiCitySegments.map((segment, index) => (
              <div key={index} className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-4'} gap-6 items-end`}>
                {/* From (input field) */}
                <div className="relative">
                  <label className="block text-white font-bold mb-2">From</label>
                  <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                    <input
                      type="text"
                      value={segment.fromQuery || segment.from}
                      onChange={e => {
                        const value = e.target.value;
                        setMultiCitySegments(prev => prev.map((seg, i) => i === index ? { ...seg, fromQuery: value } : seg));
                      }}
                      onFocus={() => setShowMultiCityDropdown(prev => ({ ...prev, [`from-${index}`]: true }))}
                      onBlur={() => setTimeout(() => setShowMultiCityDropdown(prev => ({ ...prev, [`from-${index}`]: false })), 200)}
                      placeholder="Origin"
                      className="bg-transparent text-white text-lg w-full focus:outline-none focus:ring-0 border-none focus:border-none focus:border-b-0"
                      autoComplete="off"
                    />
                    <svg className="w-4 h-4 text-[#FD7300] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {showMultiCityDropdown[`from-${index}`] && filterAirports(segment.fromQuery || '').length > 0 && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm z-50">
                      <div className="max-h-60 overflow-y-auto">
                        {filterAirports(segment.fromQuery || '').map((airport) => (
                          <div
                            key={airport.iata}
                            onMouseDown={() => {
                              setMultiCitySegments(prev => prev.map((seg, i) => i === index ? { ...seg, from: `${airport.name} (${airport.iata})`, fromQuery: '' } : seg));
                              setShowMultiCityDropdown(prev => ({ ...prev, [`from-${index}`]: false }));
                            }}
                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{airport.name} ({airport.iata})</div>
                              <div className="text-sm text-gray-500">{airport.country}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* To (input field) */}
                <div className="relative">
                  <label className="block text-white font-bold mb-2">To</label>
                  <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                    <input
                      type="text"
                      value={segment.toQuery || segment.to}
                      onChange={e => {
                        const value = e.target.value;
                        setMultiCitySegments(prev => prev.map((seg, i) => i === index ? { ...seg, toQuery: value } : seg));
                      }}
                      onFocus={() => setShowMultiCityDropdown(prev => ({ ...prev, [`to-${index}`]: true }))}
                      onBlur={() => setTimeout(() => setShowMultiCityDropdown(prev => ({ ...prev, [`to-${index}`]: false })), 200)}
                      placeholder="Destination"
                      className="bg-transparent text-white text-lg w-full focus:outline-none focus:ring-0 border-none focus:border-none focus:border-b-0"
                      autoComplete="off"
                    />
                    <svg className="w-4 h-4 text-[#FD7300] ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {showMultiCityDropdown[`to-${index}`] && filterAirports(segment.toQuery || '').length > 0 && (
                    <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm z-50">
                      <div className="max-h-60 overflow-y-auto">
                        {filterAirports(segment.toQuery || '').map((airport) => (
                          <div
                            key={airport.iata}
                            onMouseDown={() => {
                              setMultiCitySegments(prev => prev.map((seg, i) => i === index ? { ...seg, to: `${airport.name} (${airport.iata})`, toQuery: '' } : seg));
                              setShowMultiCityDropdown(prev => ({ ...prev, [`to-${index}`]: false }));
                            }}
                            className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{airport.name} ({airport.iata})</div>
                              <div className="text-sm text-gray-500">{airport.country}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="relative">
                  <label className="block text-white font-bold mb-2">Travel Date</label>
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => {
                      closeAllModals();
                      setShowMultiCityDatePicker(prev => ({ ...prev, [`date-${index}`]: true }));
                    }}
                  >
                    <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                      <span className="text-white text-lg">
                        {segment.date ? formatDateDisplay(segment.date) : 'mm/dd/yyyy'}
                      </span>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {showMultiCityDatePicker[`date-${index}`] && (
                    <Calendar
                      selectedDate={segment.date}
                      onDateSelect={(date) => {
                        setMultiCitySegments(prev => prev.map((seg, i) => 
                          i === index ? { ...seg, date } : seg
                        ));
                        setShowMultiCityDatePicker(prev => ({ ...prev, [`date-${index}`]: false }));
                      }}
                      minDate={
                        // First segment should be after main travel date
                        // Subsequent segments should be after previous segment
                        index === 0 
                          ? travelDate 
                          : multiCitySegments[index - 1]?.date || travelDate
                      }
                      onClose={() => setShowMultiCityDatePicker(prev => ({ ...prev, [`date-${index}`]: false }))}
                    />
                  )}
                </div>

                {/* Remove Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => removeMultiCitySegment(index)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Add More Button (now before Search for multi-city) */}
            {multiCitySegments.length < 3 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={addMultiCitySegment}
                  className="flex items-center space-x-2 px-6 py-3 bg-white text-[#0C2442] rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  <span>+</span>
                  <span>Add More</span>
                </button>
              </div>
            )}

            {/* Seats & Classes for Multi-City */}
            <div className="mt-8">
              <div className="relative max-w-xs">
                <label className="block text-white font-bold mb-2">Seats & Classes</label>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => setShowPassengerPanel(true)}
                >
                  <div className="bg-transparent border-b-2 border-white/30 pb-2 min-h-[40px] flex items-center justify-between">
                    <span className="text-white text-lg">
                      {seatClass}, {passengers.adults + passengers.children + passengers.infants} Passenger{(passengers.adults + passengers.children + passengers.infants) !== 1 ? 's' : ''}
                    </span>
                    <svg className="w-4 h-4 text-[#FD7300]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {showPassengerPanel && <PassengerPanel />}
              </div>
            </div>
            {/* Search Button (now at the end for multi-city) */}
            {/* <div className="flex justify-center mt-4">
              <button
                onClick={handleSearch}
                disabled={isSubmitting}
                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-[#FD7300] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FD7300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </div> */}
          </div>
        )}

        {/* Error Messages */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <div className="text-red-700">
              {errors.general && <div>• {errors.general}</div>}
              {errors.sameAirport && <div>• {errors.sameAirport}</div>}
              {errors.pastDate && <div>• {errors.pastDate}</div>}
              {errors.returnBeforeTravel && <div>• {errors.returnBeforeTravel}</div>}
              {errors.multiCity && errors.multiCity.map((error, index) => (
                <div key={index}>• {error}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
