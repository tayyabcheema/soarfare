import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FlightCard from '../components/FlightCard';
import FlightSearchSkeleton from '../components/FlightSearchSkeleton';
import SEO from '../components/SEO';
import airports from '../airports.js';
import { FlightSearchData, FlightSearchResponse } from '../lib/api';
import { apiClient } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const DatePickerModal = ({ selectedDate, onDateSelect, minDate, onClose }: {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    minDate?: string;
    onClose: () => void;
}) => {
    const formatDateInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));
    
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        
        if (compareDate < today) return true;
        
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
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-25 z-40"
                onClick={onClose}
            ></div>
            
            <div className="absolute top-full left-0 z-50 mt-1">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-80">
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

                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

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
                                    ${date && formatDateInput(date) === selectedDate ? 'bg-orange text-white' : ''}
                                `}
                            >
                                {date?.getDate()}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

// DatePickerDropdown component (without overlay for multi-city)
const DatePickerDropdown = ({ selectedDate, onDateSelect, minDate, onClose }: {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    minDate?: string;
    onClose: () => void;
}) => {
    const formatDateInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || new Date()));
    
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        
        if (compareDate < today) return true;
        
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
        <div className="absolute top-full left-0 z-50 mt-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-80">
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

                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (date && !isDateDisabled(date)) {
                                    onDateSelect(formatDateInput(date));
                                }
                            }}
                            disabled={isDateDisabled(date)}
                            className={`
                                p-2 text-sm rounded hover:bg-blue-100 transition-colors
                                ${!date ? 'invisible' : ''}
                                ${isDateDisabled(date) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-100'}
                                ${date && formatDateInput(date) === selectedDate ? 'bg-orange text-white' : ''}
                            `}
                        >
                            {date?.getDate()}
                        </button>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

// Processed flight interface
interface ProcessedFlight {
    id: string;
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
    fareSourceCode: string;
    departureTime: string;
    arrivalTime: string;
    flightNumber: string;
    stops: number;
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
    tripType: 'single' | 'round' | 'multi';
}

interface FilterSection {
    title: string;
    options: { label: string; count: number }[];
    selectedValues: string[];
    onFilterChange: (value: string, isChecked: boolean) => void;
}

const FilterSection: React.FC<FilterSection> = ({ title, options, selectedValues, onFilterChange }) => (
    <div className="bg-white rounded-lg p-4 border shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
            {options.map((option) => (
                <label key={option.label} className="flex items-center justify-between space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option.label)}
                            onChange={(e) => onFilterChange(option.label, e.target.checked)}
                            className="rounded border-gray-300 text-orange focus:ring-orange"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                    </div>
                    <span className="text-xs text-gray-500">({option.count})</span>
                </label>
            ))}
        </div>
    </div>
);

const Search = () => {
    const router = useRouter();
    const { token } = useAuth();
    
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);
    
    const [apiFlightResults, setApiFlightResults] = useState<FlightSearchResponse | null>(null);
    const [searchResults, setSearchResults] = useState<ProcessedFlight[]>([]);
    const [filteredResults, setFilteredResults] = useState<ProcessedFlight[]>([]);
    const [displayedResults, setDisplayedResults] = useState<ProcessedFlight[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(10);
    
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [leftThumb, setLeftThumb] = useState(0);
    const [rightThumb, setRightThumb] = useState(100);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    const [tripType, setTripType] = useState<'round' | 'single' | 'multi'>('single');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [selectedFromAirport, setSelectedFromAirport] = useState({
        name: '',
        city: '',
        iata: '',
        country: ''
    });
    const [selectedToAirport, setSelectedToAirport] = useState({
        name: '',
        city: '',
        iata: '',
        country: ''
    });
    const [travelDate, setTravelDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [seatClass, setSeatClass] = useState('Economy');
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });

    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [showTravelDatePicker, setShowTravelDatePicker] = useState(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
    const [showPassengerPanel, setShowPassengerPanel] = useState(false);

    const [multiCitySegments, setMultiCitySegments] = useState([
        { 
            from: '', 
            to: '', 
            date: '', 
            fromQuery: '', 
            toQuery: '',
            selectedFromAirport: { name: '', city: '', iata: '', country: '' },
            selectedToAirport: { name: '', city: '', iata: '', country: '' },
            showFromDropdown: false,
            showToDropdown: false,
            showDatePicker: false
        },
        { 
            from: '', 
            to: '', 
            date: '', 
            fromQuery: '', 
            toQuery: '',
            selectedFromAirport: { name: '', city: '', iata: '', country: '' },
            selectedToAirport: { name: '', city: '', iata: '', country: '' },
            showFromDropdown: false,
            showToDropdown: false,
            showDatePicker: false
        }
    ]);

    const [selectedStops, setSelectedStops] = useState<string[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [selectedRefundable, setSelectedRefundable] = useState<string[]>([]);

    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const passengerDropdownRef = useRef<HTMLDivElement>(null);
    const multiCityRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Helper functions
    const findAirportByCode = (code: string) => {
        return airports.find(airport => airport.iata === code);
    };

    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        return `${day} ${month}`;
    };

    const getDayName = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const getPassengerCount = () => {
        return passengers.adults + passengers.children + passengers.infants;
    };

    const getPassengerText = () => {
        const total = getPassengerCount();
        return total < 10 ? `0${total}` : `${total}`;
    };

    // Process API flight results
    const processApiFlights = (apiResponse: FlightSearchResponse): ProcessedFlight[] => {
        if (!apiResponse?.data?.flights?.AirSearchResponse?.AirSearchResult?.FareItineraries) {
            return [];
        }

        const { FareItineraries } = apiResponse.data.flights.AirSearchResponse.AirSearchResult;
        const { airlines, airports: airportData } = apiResponse.data;

        return FareItineraries.map((fareItineraryWrapper: any, index: number) => {
            try {
                const fareItinerary = fareItineraryWrapper.FareItinerary;
                
                if (!fareItinerary.OriginDestinationOptions || fareItinerary.OriginDestinationOptions.length === 0) {
                    return null;
                }

                const firstOriginDestination = fareItinerary.OriginDestinationOptions[0];
                const originDestinationOption = firstOriginDestination.OriginDestinationOption;
                
                if (!originDestinationOption || originDestinationOption.length === 0) {
                    return null;
                }

                const departureAirportLocationCode = originDestinationOption[0].FlightSegment.DepartureAirportLocationCode;
                const arrivalAirportLocationCode = originDestinationOption[originDestinationOption.length - 1].FlightSegment.ArrivalAirportLocationCode;
                const departureDateTime = originDestinationOption[0].FlightSegment.DepartureDateTime;
                const arrivalDateTime = originDestinationOption[originDestinationOption.length - 1].FlightSegment.ArrivalDateTime;

                let totalDuration = 0;
                originDestinationOption.forEach((segment: any) => {
                    const journeyDuration = segment.FlightSegment.JourneyDuration || 0;
                    totalDuration += journeyDuration;
                });

                const hours = Math.floor(totalDuration / 60);
                const minutes = totalDuration % 60;
                const duration = `${hours}h ${minutes}m`;

                const firstSegment = originDestinationOption[0].FlightSegment;
                const marketingAirlineCode = firstSegment.MarketingAirlineCode;
                const operatingAirlineCode = firstSegment.OperatingAirline?.Code || marketingAirlineCode;

                let price = 0;
                try {
                    if (fareItinerary.AirItineraryFareInfo?.ItinTotalFares?.TotalFare?.Amount) {
                        price = parseFloat(fareItinerary.AirItineraryFareInfo.ItinTotalFares.TotalFare.Amount);
                    } else if (fareItinerary.AirItineraryFareInfo?.TotalFare?.Amount) {
                        price = parseFloat(fareItinerary.AirItineraryFareInfo.TotalFare.Amount);
                    }
                } catch (e) {
                    // Price parsing failed, keep as 0
                }
                
                const departureAirport = airportData[departureAirportLocationCode];
                const arrivalAirport = airportData[arrivalAirportLocationCode];
                const airline = airlines[operatingAirlineCode] || airlines[marketingAirlineCode];

                const totalStops = Math.max(0, originDestinationOption.length - 1);
                let flightType = 'Non-stop';
                if (totalStops === 1) flightType = '1 stop';
                else if (totalStops === 2) flightType = '2 stops';
                else if (totalStops > 2) flightType = `${totalStops} stops`;

                const points = Math.floor(price / 3);
                
                // Get and format the fareSourceCode
                const rawFareSourceCode = fareItinerary.AirItineraryFareInfo?.FareSourceCode || '';
                const fareSourceCode = rawFareSourceCode.trim();
                
                // Create a unique flight ID that includes the index
                const flightId = `flight-${index}`;
                
                // Store the fareSourceCode in localStorage immediately
                if (fareSourceCode) {
                    localStorage.setItem(`fareSourceCode_${flightId}`, fareSourceCode);
                }

                let isRefundable = "As per rules";
                try {
                    isRefundable = fareItinerary.AirItineraryFareInfo?.IsRefundable === "Yes" ? "Yes" : "No";
                } catch (e) {
                    isRefundable = "As per rules";
                }

                const cabinClassText = firstSegment.CabinClassText || firstSegment.CabinClass || 'Economy';

                let returnFlight = undefined;
                let multiCitySegments = undefined;
                let isReturn = false;
                let currentTripType: 'single' | 'round' | 'multi' = tripType;

                if (fareItinerary.OriginDestinationOptions.length > 1) {
                    if (fareItinerary.OriginDestinationOptions.length === 2 && tripType === 'round') {
                        isReturn = true;
                        currentTripType = 'round';
                        const returnOriginDestination = fareItinerary.OriginDestinationOptions[1];
                        const returnOption = returnOriginDestination.OriginDestinationOption;
                        
                        if (returnOption && returnOption.length > 0) {
                            const returnDepartureCode = returnOption[0].FlightSegment.DepartureAirportLocationCode;
                            const returnArrivalCode = returnOption[returnOption.length - 1].FlightSegment.ArrivalAirportLocationCode;
                            const returnDepartureTime = returnOption[0].FlightSegment.DepartureDateTime;
                            const returnArrivalTime = returnOption[returnOption.length - 1].FlightSegment.ArrivalDateTime;
                            
                            let returnDuration = 0;
                            returnOption.forEach((segment: any) => {
                                returnDuration += segment.FlightSegment.JourneyDuration || 0;
                            });
                            const returnHours = Math.floor(returnDuration / 60);
                            const returnMinutes = returnDuration % 60;
                            const returnDurationStr = `${returnHours}h ${returnMinutes}m`;
                            
                            const returnStops = Math.max(0, returnOption.length - 1);
                            
                            returnFlight = {
                                from: {
                                    city: airportData[returnDepartureCode]?.city || returnDepartureCode,
                                    code: returnDepartureCode,
                                    name: airportData[returnDepartureCode]?.name || returnDepartureCode
                                },
                                to: {
                                    city: airportData[returnArrivalCode]?.city || returnArrivalCode,
                                    code: returnArrivalCode,
                                    name: airportData[returnArrivalCode]?.name || returnArrivalCode
                                },
                                departureTime: returnDepartureTime,
                                arrivalTime: returnArrivalTime,
                                flightNumber: returnOption[0].FlightSegment.FlightNumber,
                                duration: returnDurationStr,
                                stops: returnStops
                            };
                        }
                    } else if (fareItinerary.OriginDestinationOptions.length > 2 || tripType === 'multi') {
                        currentTripType = 'multi';
                        multiCitySegments = fareItinerary.OriginDestinationOptions.map((originDest: any) => {
                            const segmentOption = originDest.OriginDestinationOption;
                            if (segmentOption && segmentOption.length > 0) {
                                const segDepartureCode = segmentOption[0].FlightSegment.DepartureAirportLocationCode;
                                const segArrivalCode = segmentOption[segmentOption.length - 1].FlightSegment.ArrivalAirportLocationCode;
                                const segDepartureTime = segmentOption[0].FlightSegment.DepartureDateTime;
                                const segArrivalTime = segmentOption[segmentOption.length - 1].FlightSegment.ArrivalDateTime;
                                
                                let segDuration = 0;
                                segmentOption.forEach((segment: any) => {
                                    segDuration += segment.FlightSegment.JourneyDuration || 0;
                                });
                                const segHours = Math.floor(segDuration / 60);
                                const segMinutes = segDuration % 60;
                                const segDurationStr = `${segHours}h ${segMinutes}m`;
                                
                                const segStops = Math.max(0, segmentOption.length - 1);
                                
                                return {
                                    from: {
                                        city: airportData[segDepartureCode]?.city || segDepartureCode,
                                        code: segDepartureCode,
                                        name: airportData[segDepartureCode]?.name || segDepartureCode
                                    },
                                    to: {
                                        city: airportData[segArrivalCode]?.city || segArrivalCode,
                                        code: segArrivalCode,
                                        name: airportData[segArrivalCode]?.name || segArrivalCode
                                    },
                                    departureTime: segDepartureTime,
                                    arrivalTime: segArrivalTime,
                                    flightNumber: segmentOption[0].FlightSegment.FlightNumber,
                                    duration: segDurationStr,
                                    stops: segStops
                                };
                            }
                            return null;
                        }).filter(Boolean);
                    }
                }

                const processedFlight = {
                    id: `flight-${index}`,
                    airline: airline || operatingAirlineCode,
                    airlineCode: operatingAirlineCode,
                    logo: `https://www.travelpack.com/public/imagedb/logos/airlines/${operatingAirlineCode}.gif`,
                    from: {
                        city: departureAirport?.city || departureAirportLocationCode,
                        code: departureAirportLocationCode,
                        name: departureAirport?.name || departureAirportLocationCode
                    },
                    to: {
                        city: arrivalAirport?.city || arrivalAirportLocationCode,
                        code: arrivalAirportLocationCode,
                        name: arrivalAirport?.name || arrivalAirportLocationCode
                    },
                    flightType,
                    duration,
                    points,
                    price,
                    class: cabinClassText,
                    refundable: isRefundable,
                    fareSourceCode,
                    departureTime: departureDateTime,
                    arrivalTime: arrivalDateTime,
                    flightNumber: firstSegment.FlightNumber,
                    stops: totalStops,
                    isReturn,
                    returnFlight,
                    multiCitySegments,
                    tripType: currentTripType
                };

                return processedFlight;
            } catch (error) {
                return null;
            }
        }).filter(Boolean) as ProcessedFlight[];
    };

    // Calculate price range from flights
    const calculatePriceRange = (flights: ProcessedFlight[]) => {
        if (flights.length === 0) return { min: 0, max: 100000 };
        
        const prices = flights.map(flight => flight.price);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        
        return { min, max };
    };

    // Update filter options based on API results
    const updateFilterOptions = (flights: ProcessedFlight[]) => {
        const range = calculatePriceRange(flights);
        setPriceRange(range);
        setMinPrice(range.min);
        setMaxPrice(range.max);
        setLeftThumb(0);
        setRightThumb(100);
    };

    // Parse URL parameters and populate form
    const parseUrlParams = () => {
        const { query } = router;
        
        if (Object.keys(query).length === 0) {
            setIsInitialLoading(false);
            return;
        }

        const fromCode = query.from as string;
        const toCode = query.to as string;
        const fromDisplay = query.fromDisplay as string || '';
        const toDisplay = query.toDisplay as string || '';
        const queryTripType = query.tripType as 'round' | 'single' | 'multi' || 'single';

        const fromAirport = findAirportByCode(fromCode);
        const toAirport = findAirportByCode(toCode);

        if (fromAirport) {
            setSelectedFromAirport(fromAirport);
            setFrom(fromDisplay || fromAirport.city);
        }

        if (toAirport) {
            setSelectedToAirport(toAirport);
            setTo(toDisplay || toAirport.city);
        }

        const queryTravelDate = query.travelDate as string || '';
        const queryReturnDate = query.returnDate as string || '';
        const queryClass = query.class as string || 'Economy';

        setTravelDate(queryTravelDate);
        setReturnDate(queryReturnDate);
        setSeatClass(queryClass);
        setTripType(queryTripType);

        const adults = parseInt(query.adults as string) || 1;
        const children = parseInt(query.children as string) || 0;
        const infants = parseInt(query.infants as string) || 0;
        
        setPassengers({
            adults,
            children,
            infants
        });

        if (queryTripType === 'multi') {
            const segments = [];
            let index = 0;
            while (query[`from_mc_${index}`]) {
                const segmentFromCode = query[`from_mc_${index}`] as string;
                const segmentToCode = query[`to_mc_${index}`] as string;
                const segmentDate = query[`date_mc_${index}`] as string;
                
                const segmentFromAirport = findAirportByCode(segmentFromCode);
                const segmentToAirport = findAirportByCode(segmentToCode);

                segments.push({
                    from: segmentFromAirport?.city || segmentFromCode,
                    to: segmentToAirport?.city || segmentToCode,
                    date: segmentDate,
                    fromQuery: '',
                    toQuery: '',
                    selectedFromAirport: segmentFromAirport || { name: '', city: '', iata: '', country: '' },
                    selectedToAirport: segmentToAirport || { name: '', city: '', iata: '', country: '' },
                    showFromDropdown: false,
                    showToDropdown: false,
                    showDatePicker: false
                });
                index++;
            }
            if (segments.length >= 2) {
                setMultiCitySegments(segments);
            }
        }

        setIsInitialLoading(false);
    };

    // Perform flight search API call
    const performFlightSearch = async () => {
        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);

        try {
            const searchData: FlightSearchData = {
                travel_date: travelDate,
                from: selectedFromAirport.iata,
                to: selectedToAirport.iata,
                class: seatClass,
                adults: passengers.adults,
                childs: passengers.children,
                infants: passengers.infants,
            };

            if (tripType === 'single') {
                searchData.flight_type = 2;
            } else if (tripType === 'round') {
                searchData.flight_type = 1;
                searchData.return_date = returnDate;
            } else if (tripType === 'multi') {
                searchData.flight_type = 3;
                searchData.from_mc = multiCitySegments.map(segment => {
                    return segment.selectedFromAirport.iata || segment.from;
                });
                searchData.to_mc = multiCitySegments.map(segment => {
                    return segment.selectedToAirport.iata || segment.to;
                });
                searchData.travel_date_mc = multiCitySegments.map(segment => segment.date);
            }

            const response = await apiClient.searchFlights(searchData, token || undefined);

            if (response.success === 1 && response.data) {
                if (response.session_data) {
                    localStorage.setItem('flight_session_id', response.session_data.session_id);
                    if (response.session_data.trawex_session_id) {
                        localStorage.setItem('trawex_session_id', response.session_data.trawex_session_id);
                    }
                }

                setApiFlightResults(response);
                
                const processedFlights = processApiFlights(response);
                
                // Store fareSourceCodes in localStorage and set search results
                const validFlights = processedFlights.filter(flight => flight && flight.fareSourceCode);
                validFlights.forEach(flight => {
                    localStorage.setItem(`fareSourceCode_${flight.id}`, flight.fareSourceCode);
                });

                setSearchResults(validFlights);
                setFilteredResults(validFlights);
                setCurrentPage(1);
                updateFilterOptions(validFlights);
                
            } else {
                setSearchError('Failed to search flights. Please try again.');
            }
        } catch (error) {
            setSearchError('An unexpected error occurred. Please check your connection and try again.');
        } finally {
            setIsSearching(false);
        }
    };

    // Initialize page: parse params and trigger search
    useEffect(() => {
        if (router.isReady) {
            parseUrlParams();
        }
    }, [router.isReady, router.query]);

    // Airport search functionality
    const filteredFromAirports = airports.filter((airport: any) =>
        airport.city.toLowerCase().includes(fromQuery.toLowerCase()) ||
        airport.name.toLowerCase().includes(fromQuery.toLowerCase()) ||
        airport.iata.toLowerCase().includes(fromQuery.toLowerCase())
    ).slice(0, 5);

    const filteredToAirports = airports.filter((airport: any) =>
        airport.city.toLowerCase().includes(toQuery.toLowerCase()) ||
        airport.name.toLowerCase().includes(toQuery.toLowerCase()) ||
        airport.iata.toLowerCase().includes(toQuery.toLowerCase())
    ).slice(0, 5);

    // Handle airport selection
    const handleFromAirportSelect = (airport: any) => {
        setSelectedFromAirport(airport);
        setFrom(airport.city);
        setFromQuery('');
        setShowFromDropdown(false);
    };

    const handleToAirportSelect = (airport: any) => {
        setSelectedToAirport(airport);
        setTo(airport.city);
        setToQuery('');
        setShowToDropdown(false);
    };

    // Multi-city specific functions
    const getFilteredAirportsForSegment = (query: string) => {
        return airports.filter((airport: any) =>
            airport.city.toLowerCase().includes(query.toLowerCase()) ||
            airport.name.toLowerCase().includes(query.toLowerCase()) ||
            airport.iata.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    };

    const updateMultiCitySegment = (index: number, field: string, value: any) => {
        setMultiCitySegments(prev => 
            prev.map((segment, i) => 
                i === index ? { ...segment, [field]: value } : segment
            )
        );
    };

    const handleMultiCityFromAirportSelect = useCallback((index: number, airport: any) => {
        setMultiCitySegments(prev => 
            prev.map((segment, i) => 
                i === index ? { 
                    ...segment, 
                    selectedFromAirport: airport,
                    from: airport.city,
                    fromQuery: `${airport.city} (${airport.iata})`,
                    showFromDropdown: false
                } : segment
            )
        );
    }, []);

    const handleMultiCityToAirportSelect = useCallback((index: number, airport: any) => {
        console.log('🚀 TO Airport Selection:', { index, airport: airport.city, iata: airport.iata });
        
        setMultiCitySegments(prev => {
            console.log('📋 Current segments before update:', prev[index]);
            
            const newSegments = prev.map((segment, i) => 
                i === index ? { 
                    ...segment, 
                    selectedToAirport: airport,
                    to: airport.city,
                    toQuery: `${airport.city} (${airport.iata})`,
                    showToDropdown: false
                } : segment
            );
            
            console.log('✅ Updated segment:', newSegments[index]);
            
            // Auto-fill next origin from current destination (cascading logic)
            if (index < newSegments.length - 1) {
                newSegments[index + 1] = {
                    ...newSegments[index + 1],
                    selectedFromAirport: airport,
                    from: airport.city,
                    fromQuery: `${airport.city} (${airport.iata})`
                };
                console.log('🔗 Auto-filled next segment:', newSegments[index + 1]);
            }
            
            return newSegments;
        });
    }, []);

    const handleMultiCityDateSelect = useCallback((index: number, date: string) => {
        setMultiCitySegments(prev => {
            const newSegments = [...prev];
            newSegments[index] = { ...newSegments[index], date, showDatePicker: false };
            
            // Cascade date validation: ensure subsequent dates are >= current date
            for (let i = index + 1; i < newSegments.length; i++) {
                if (newSegments[i].date && newSegments[i].date < date) {
                    newSegments[i] = { ...newSegments[i], date };
                }
            }
            
            return newSegments;
        });
    }, []);

    const toggleMultiCityDropdown = (index: number, dropdownType: 'from' | 'to' | 'date') => {
        setMultiCitySegments(prev => 
            prev.map((segment, i) => {
                if (i === index) {
                    // Close all other dropdowns for this segment
                    const updatedSegment = {
                        ...segment,
                        showFromDropdown: false,
                        showToDropdown: false,
                        showDatePicker: false
                    };
                    
                    // Toggle the specific dropdown
                    if (dropdownType === 'from') {
                        updatedSegment.showFromDropdown = !segment.showFromDropdown;
                        updatedSegment.fromQuery = segment.selectedFromAirport.city || '';
                    } else if (dropdownType === 'to') {
                        updatedSegment.showToDropdown = !segment.showToDropdown;
                        updatedSegment.toQuery = segment.selectedToAirport.city || '';
                    } else if (dropdownType === 'date') {
                        updatedSegment.showDatePicker = !segment.showDatePicker;
                    }
                    
                    return updatedSegment;
                } else {
                    // Close all dropdowns for other segments
                    return {
                        ...segment,
                        showFromDropdown: false,
                        showToDropdown: false,
                        showDatePicker: false
                    };
                }
            })
        );
    };

    // Handle passenger updates
    const updatePassengers = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
        setPassengers(prev => {
            const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            if (type === 'adults' && newCount < 1) return prev;
            return { ...prev, [type]: newCount };
        });
    };

    // Handle trip type change
    const handleTripTypeChange = (type: 'round' | 'single' | 'multi') => {
        setTripType(type);
        
        if (type === 'multi') {
            setMultiCitySegments([
                { 
                    from: '', 
                    to: '', 
                    date: '', 
                    fromQuery: '', 
                    toQuery: '',
                    selectedFromAirport: { name: '', city: '', iata: '', country: '' },
                    selectedToAirport: { name: '', city: '', iata: '', country: '' },
                    showFromDropdown: false,
                    showToDropdown: false,
                    showDatePicker: false
                },
                { 
                    from: '', 
                    to: '', 
                    date: '', 
                    fromQuery: '', 
                    toQuery: '',
                    selectedFromAirport: { name: '', city: '', iata: '', country: '' },
                    selectedToAirport: { name: '', city: '', iata: '', country: '' },
                    showFromDropdown: false,
                    showToDropdown: false,
                    showDatePicker: false
                }
            ]);
        }
    };

    // Add multi-city segment
    const addMultiCitySegment = () => {
        setMultiCitySegments([...multiCitySegments, { 
            from: '', 
            to: '', 
            date: '', 
            fromQuery: '', 
            toQuery: '',
            selectedFromAirport: { name: '', city: '', iata: '', country: '' },
            selectedToAirport: { name: '', city: '', iata: '', country: '' },
            showFromDropdown: false,
            showToDropdown: false,
            showDatePicker: false
        }]);
    };

    // Remove multi-city segment
    const removeMultiCitySegment = (index: number) => {
        if (multiCitySegments.length > 2) {
            setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
        }
    };

    // Handle new search (when form is modified and re-submitted)
    const handleSearch = () => {
        if (!selectedFromAirport.iata || !selectedToAirport.iata || !travelDate) {
            return;
        }

        if (tripType === 'round' && !returnDate) {
            return;
        }

        if (tripType === 'multi') {
            const validSegments = multiCitySegments.filter(segment => 
                segment.selectedFromAirport.iata && segment.selectedToAirport.iata && segment.date
            );
            if (validSegments.length < 2) {
                return;
            }
        }

        performFlightSearch();
    };

    // Generate filter options from current results
    const generateFilterOptions = () => {
        if (searchResults.length === 0) {
            return {
                stopOptions: [],
                classOptions: [],
                airlineOptions: [],
                refundableOptions: []
            };
        }

        // Count occurrences
        const stopCounts: { [key: string]: number } = {};
        const classCounts: { [key: string]: number } = {};
        const airlineCounts: { [key: string]: number } = {};
        const refundableCounts: { [key: string]: number } = {};

        searchResults.forEach(flight => {
            stopCounts[flight.flightType] = (stopCounts[flight.flightType] || 0) + 1;
            classCounts[flight.class] = (classCounts[flight.class] || 0) + 1;
            airlineCounts[flight.airline] = (airlineCounts[flight.airline] || 0) + 1;
            refundableCounts[flight.refundable] = (refundableCounts[flight.refundable] || 0) + 1;
        });

        return {
            stopOptions: Object.entries(stopCounts).map(([label, count]) => ({ label, count })),
            classOptions: Object.entries(classCounts).map(([label, count]) => ({ label, count })),
            airlineOptions: Object.entries(airlineCounts).map(([label, count]) => ({ label, count })),
            refundableOptions: Object.entries(refundableCounts).map(([label, count]) => ({ label, count }))
        };
    };

    const { stopOptions, classOptions, airlineOptions, refundableOptions } = generateFilterOptions();

    // Price slider handlers
    const handleMouseDownLeft = () => setIsDraggingLeft(true);
    const handleMouseDownRight = () => setIsDraggingRight(true);
    const handleMouseUp = () => {
        setIsDraggingLeft(false);
        setIsDraggingRight(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingLeft && !isDraggingRight) return;
        const slider = e.currentTarget;
        const rect = slider.getBoundingClientRect();
        const position = ((e.clientX - rect.left) / rect.width) * 100;
        const clampedPosition = Math.max(0, Math.min(100, position));

        if (isDraggingLeft && clampedPosition < rightThumb) {
            setLeftThumb(clampedPosition);
            setMinPrice(Math.round(priceRange.min + (clampedPosition / 100) * (priceRange.max - priceRange.min)));
        }
        if (isDraggingRight && clampedPosition > leftThumb) {
            setRightThumb(clampedPosition);
            setMaxPrice(Math.round(priceRange.min + (clampedPosition / 100) * (priceRange.max - priceRange.min)));
        }
    };

    // Filter flights based on current filters
    const applyFilters = () => {
        if (!searchResults.length) return;

        let filtered = searchResults.filter(flight => {
            // Price filter
            if (flight.price < minPrice || flight.price > maxPrice) {
                return false;
            }

            // Stops filter
            if (selectedStops.length > 0 && !selectedStops.includes(flight.flightType)) {
                return false;
            }

            // Class filter
            if (selectedClasses.length > 0 && !selectedClasses.includes(flight.class)) {
                return false;
            }

            // Airlines filter
            if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
                return false;
            }

            // Refundable filter
            if (selectedRefundable.length > 0 && !selectedRefundable.includes(flight.refundable)) {
                return false;
            }

            return true;
        });

        setFilteredResults(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    // Update displayed results based on pagination
    const updateDisplayedResults = () => {
        const endIndex = currentPage * resultsPerPage;
        setDisplayedResults(filteredResults.slice(0, endIndex));
    };

    // Load more results
    const loadMoreResults = () => {
        setCurrentPage(prev => prev + 1);
    };

    // Check if there are more results to load
    const hasMoreResults = currentPage * resultsPerPage < filteredResults.length;

    // Filter handlers
    const handleFilterChange = (category: string, value: string, isChecked: boolean) => {
        switch (category) {
            case 'stops':
                if (isChecked) {
                    setSelectedStops([...selectedStops, value]);
                } else {
                    setSelectedStops(selectedStops.filter(item => item !== value));
                }
                break;
            case 'class':
                if (isChecked) {
                    setSelectedClasses([...selectedClasses, value]);
                } else {
                    setSelectedClasses(selectedClasses.filter(item => item !== value));
                }
                break;
            case 'airlines':
                if (isChecked) {
                    setSelectedAirlines([...selectedAirlines, value]);
                } else {
                    setSelectedAirlines(selectedAirlines.filter(item => item !== value));
                }
                break;
            case 'refundable':
                if (isChecked) {
                    setSelectedRefundable([...selectedRefundable, value]);
                } else {
                    setSelectedRefundable(selectedRefundable.filter(item => item !== value));
                }
                break;
        }
    };

    // Clear all filters
    const handleClearAllFilters = () => {
        setSelectedStops([]);
        setSelectedClasses([]);
        setSelectedAirlines([]);
        setSelectedRefundable([]);
        setMinPrice(priceRange.min);
        setMaxPrice(priceRange.max);
        setLeftThumb(0);
        setRightThumb(100);
    };

    // Handle book now click
    const handleBookNow = (flight: any) => {
        localStorage.setItem('selected_fare_source_code', flight.fareSourceCode || '');
        localStorage.setItem('selected_flight_details', JSON.stringify(flight));
    };

    // Auto-apply filters when any filter changes
    useEffect(() => {
        if (searchResults.length > 0) {
            applyFilters();
        }
    }, [selectedStops, selectedClasses, selectedAirlines, selectedRefundable, minPrice, maxPrice, searchResults]);

    // Update displayed results when filtered results or page changes
    useEffect(() => {
        updateDisplayedResults();
    }, [filteredResults, currentPage]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
                setShowFromDropdown(false);
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
                setShowToDropdown(false);
            }
            if (passengerDropdownRef.current && !passengerDropdownRef.current.contains(event.target as Node)) {
                setShowPassengerPanel(false);
            }
            
            // Handle multi-city dropdowns
            multiCityRefs.current.forEach((ref, index) => {
                if (ref && !ref.contains(event.target as Node)) {
                    setMultiCitySegments(prev => 
                        prev.map((segment, i) => 
                            i === index ? {
                                ...segment,
                                showFromDropdown: false,
                                showToDropdown: false,
                                showDatePicker: false
                            } : segment
                        )
                    );
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show loading skeleton if initial loading or searching
    if (isInitialLoading || isSearching) {
        return (
            <>
                <SEO
                    title="Search Flights"
                    description="Find the best flight deals and travel options with SoarFare. Start your journey today!"
                    keywords="search flights, flight deals, travel options, book flights, affordable travel"
                    image="/search.jpg"
                />
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="pt-20 md:pt-24 px-4 lg:px-6">
                        <div className="max-w-screen-2xl mx-auto">
                            <FlightSearchSkeleton />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Show error state
    if (searchError) {
        return (
            <>
                <SEO
                    title="Search Flights"
                    description="Find the best flight deals and travel options with SoarFare. Start your journey today!"
                    keywords="search flights, flight deals, travel options, book flights, affordable travel"
                    image="/search.jpg"
                />
                <Header />
                <div className="min-h-screen bg-gray-50">
                    <div className="pt-20 md:pt-24 px-4 lg:px-6">
                        <div className="max-w-screen-2xl mx-auto">
                            <div className="bg-white rounded-lg p-8 text-center">
                                <div className="text-red-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Failed</h2>
                                <p className="text-gray-600 mb-6">{searchError}</p>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="bg-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <SEO
                title="Search Flights"
                description="Find the best flight deals and travel options with SoarFare. Start your journey today!"
                keywords="search flights, flight deals, travel options, book flights, affordable travel"
                image="/search.jpg"
            />
            <Header />
            
            <div className="min-h-screen bg-gray-50">
                <div className=" bg-white pt-24 md:pt-28 px-4 lg:px-6">
                    {/* Search Bar Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-screen-2xl mx-auto">
                        {/* Trip Type Toggle */}
                        <div className="mb-6 flex justify-center">
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                {[
                                    { label: 'One Way', value: 'single' as const },
                                    { label: 'Return', value: 'round' as const },
                                    { label: 'Multi City', value: 'multi' as const }
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => handleTripTypeChange(type.value)}
                                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                                            tripType === type.value
                                                ? 'bg-orange text-white'
                                                : 'text-gray-600 hover:text-gray-800'
                                        }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Single/Return Trip Form */}
                        {tripType !== 'multi' && (
                            <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-stretch md:items-end gap-4">
                                {/* From */}
                                <div className="relative flex-1 min-w-[200px]" ref={fromDropdownRef}>
                                    <div 
                                        className="cursor-pointer bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200 hover:border-orange transition-colors h-[60px] md:h-[70px] flex flex-col justify-center" 
                                        onClick={() => {
                                            setShowFromDropdown(!showFromDropdown);
                                            setFromQuery(selectedFromAirport.city);
                                        }}
                                    >
                                        <label className="text-xs font-medium text-gray-600 mb-1">From</label>
                                        <div className="font-bold text-gray-900 text-base md:text-lg">{selectedFromAirport.city || from || 'Origin'}</div>
                                        <div className="text-xs text-gray-500 truncate">{selectedFromAirport.name || 'Origin'}</div>
                                    </div>
                                    
                                    {/* From Dropdown */}
                                    {showFromDropdown && (
                                        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                                            <div className="p-3">
                                                <input
                                                    type="text"
                                                    value={fromQuery}
                                                    onChange={(e) => setFromQuery(e.target.value)}
                                                    placeholder="Search airports..."
                                                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredFromAirports.map((airport: any) => (
                                                    <div
                                                        key={airport.iata}
                                                        className="p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                                        onClick={() => handleFromAirportSelect(airport)}
                                                    >
                                                        <div className="font-medium text-gray-900">{airport.city}</div>
                                                        <div className="text-sm text-gray-500">{airport.name} ({airport.iata})</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Swap Button */}
                                <div className="flex justify-center items-center px-2">
                                    <button
                                        onClick={() => {
                                            const tempFrom = selectedFromAirport;
                                            const tempFromCity = from;
                                            setSelectedFromAirport(selectedToAirport);
                                            setFrom(to);
                                            setSelectedToAirport(tempFrom);
                                            setTo(tempFromCity);
                                        }}
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange hover:text-orange transition-colors bg-white"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* To */}
                                <div className="relative flex-1 min-w-[200px]" ref={toDropdownRef}>
                                    <div 
                                        className="cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center" 
                                        onClick={() => {
                                            setShowToDropdown(!showToDropdown);
                                            setToQuery(selectedToAirport.city);
                                        }}
                                    >
                                        <label className="text-xs font-medium text-gray-600 mb-1">To</label>
                                        <div className="font-bold text-gray-900 text-lg">{selectedToAirport.city || to || 'Destination'}</div>
                                        <div className="text-xs text-gray-500 truncate">{selectedToAirport.name || 'Destination'}</div>
                                    </div>
                                    
                                    {/* To Dropdown */}
                                    {showToDropdown && (
                                        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                                            <div className="p-3">
                                                <input
                                                    type="text"
                                                    value={toQuery}
                                                    onChange={(e) => setToQuery(e.target.value)}
                                                    placeholder="Search airports..."
                                                    className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredToAirports.map((airport: any) => (
                                                    <div
                                                        key={airport.iata}
                                                        className="p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                                        onClick={() => handleToAirportSelect(airport)}
                                                    >
                                                        <div className="font-medium text-gray-900">{airport.city}</div>
                                                        <div className="text-sm text-gray-500">{airport.name} ({airport.iata})</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Travel Date */}
                                <div className="relative flex-1 min-w-[150px]">
                                    <div 
                                        className="cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center" 
                                        onClick={() => setShowTravelDatePicker(!showTravelDatePicker)}
                                    >
                                        <label className="text-xs font-medium text-gray-600 mb-1">Travel Date</label>
                                        <div className="font-bold text-gray-900 text-lg">{travelDate ? formatDateDisplay(travelDate) : '--'}</div>
                                        <div className="text-xs text-gray-500">{travelDate ? getDayName(travelDate) : 'Day'}</div>
                                    </div>
                                    {showTravelDatePicker && (
                                        <DatePickerModal
                                            selectedDate={travelDate}
                                            onDateSelect={(date) => {
                                                setTravelDate(date);
                                                setShowTravelDatePicker(false);
                                            }}
                                            onClose={() => setShowTravelDatePicker(false)}
                                        />
                                    )}
                                </div>

                                {/* Return Date (conditional) */}
                                {tripType === 'round' && (
                                    <div className="relative flex-1 min-w-[150px]">
                                        <div 
                                            className="cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center"
                                            onClick={() => setShowReturnDatePicker(!showReturnDatePicker)}
                                        >
                                            <label className="text-xs font-medium text-gray-600 mb-1">Return Date</label>
                                            <div className="font-bold text-gray-900 text-lg">
                                                {returnDate ? formatDateDisplay(returnDate) : '--'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {returnDate ? getDayName(returnDate) : 'Day'}
                                            </div>
                                        </div>
                                        {showReturnDatePicker && (
                                            <DatePickerModal
                                                selectedDate={returnDate}
                                                onDateSelect={(date) => {
                                                    setReturnDate(date);
                                                    setShowReturnDatePicker(false);
                                                }}
                                                minDate={travelDate}
                                                onClose={() => setShowReturnDatePicker(false)}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Seats & Classes */}
                                <div className="relative flex-1 min-w-[150px]" ref={passengerDropdownRef}>
                                    <div 
                                        className="cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center" 
                                        onClick={() => setShowPassengerPanel(!showPassengerPanel)}
                                    >
                                        <label className="text-xs font-medium text-gray-600 mb-1">Seats & Classes</label>
                                        <div className="font-bold text-gray-900 text-lg">{getPassengerText()}</div>
                                        <div className="text-xs text-gray-500">{seatClass}</div>
                                    </div>
                                    
                                    {/* Passenger Panel */}
                                    {showPassengerPanel && (
                                        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 w-80">
                                            <div className="space-y-4">
                                                {/* Adults */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">Adults</div>
                                                        <div className="text-sm text-gray-500">12+ years</div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updatePassengers('adults', false)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                            disabled={passengers.adults <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{passengers.adults}</span>
                                                        <button
                                                            onClick={() => updatePassengers('adults', true)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Children */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">Children</div>
                                                        <div className="text-sm text-gray-500">2-11 years</div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updatePassengers('children', false)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                            disabled={passengers.children <= 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{passengers.children}</span>
                                                        <button
                                                            onClick={() => updatePassengers('children', true)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Infants */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium text-gray-900">Infants</div>
                                                        <div className="text-sm text-gray-500">Under 2 years</div>
                                                    </div>
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => updatePassengers('infants', false)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                            disabled={passengers.infants <= 0}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center font-medium">{passengers.infants}</span>
                                                        <button
                                                            onClick={() => updatePassengers('infants', true)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Class Selection */}
                                                <div className="border-t pt-4">
                                                    <div className="font-medium text-gray-900 mb-3">Class</div>
                                                    <div className="space-y-2">
                                                        {['Economy', 'Business', 'First'].map((classType) => (
                                                            <label key={classType} className="flex items-center space-x-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name="seatClass"
                                                                    value={classType}
                                                                    checked={seatClass === classType}
                                                                    onChange={(e) => setSeatClass(e.target.value)}
                                                                    className="text-orange focus:ring-orange"
                                                                />
                                                                <span className="text-sm text-gray-700">{classType}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Travel Type */}
                                <div className="flex-1 min-w-[120px]">
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-[70px] flex flex-col justify-center">
                                        <label className="text-xs font-medium text-gray-600 mb-1">Travel Type</label>
                                        <div className="font-bold text-gray-900 text-lg">{tripType === 'single' ? 'One Way' : 'Return'}</div>
                                        <div className="text-xs text-gray-500">{seatClass}</div>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <div className="flex-shrink-0">
                                    <button 
                                        onClick={handleSearch}
                                        disabled={isSearching}
                                        className="bg-orange text-white px-4 md:px-8 py-4 md:py-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed h-[60px] md:h-[70px] whitespace-nowrap text-sm md:text-base"
                                    >
                                        {isSearching ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Searching...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <span>Search Flights</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Multi-City Form */}
                        {tripType === 'multi' && (
                            <div className="space-y-2">
                                {/* Multi-city rows */}
                                {multiCitySegments.map((segment, index) => {
                                    const filteredFromAirports = getFilteredAirportsForSegment(segment.fromQuery);
                                    const filteredToAirports = getFilteredAirportsForSegment(segment.toQuery);
                                    const minDate = index > 0 ? multiCitySegments[index - 1].date || undefined : undefined;
                                    
                                    return (
                                        <div key={`segment-${index}`} className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap items-stretch md:items-end gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            {/* From */}
                                            <div className="relative flex-1 min-w-[200px]" ref={el => { multiCityRefs.current[index] = el; }}>
                                                <div 
                                                    className="cursor-pointer bg-white rounded-lg  border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center"
                                                    onClick={() => toggleMultiCityDropdown(index, 'from')}
                                                >
                                                    <label className="text-xs font-medium text-gray-600 mb-1">From</label>
                                                    <div className="font-bold text-gray-900 text-base lg:text-lg truncate">
                                                        {segment.selectedFromAirport.city 
                                                            ? `${segment.selectedFromAirport.city} (${segment.selectedFromAirport.iata})`
                                                            : segment.from || 'Origin'
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">{segment.selectedFromAirport.name || 'Airport'}</div>
                                                </div>
                                                
                                                {/* From Dropdown */}
                                                {segment.showFromDropdown && (
                                                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                                                        <div className="p-3">
                                                            <input
                                                                type="text"
                                                                value={segment.fromQuery}
                                                                onChange={(e) => updateMultiCitySegment(index, 'fromQuery', e.target.value)}
                                                                placeholder="Search airports..."
                                                                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto">
                                                            {filteredFromAirports.map((airport: any) => (
                                                                <div
                                                                    key={airport.iata}
                                                                    className="p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                                                    onClick={() => handleMultiCityFromAirportSelect(index, airport)}
                                                                >
                                                                    <div className="font-medium text-gray-900">{airport.city}</div>
                                                                    <div className="text-sm text-gray-500">{airport.name} ({airport.iata})</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* To */}
                                            <div className="relative flex-1 min-w-[200px]">
                                                <div 
                                                    className="cursor-pointer bg-white rounded-lg border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center"
                                                    onClick={() => toggleMultiCityDropdown(index, 'to')}
                                                >
                                                    <label className="text-xs font-medium text-gray-600 mb-1">To</label>
                                                    <div className="font-bold text-gray-900 text-base lg:text-lg truncate">
                                                        {segment.selectedToAirport.city 
                                                            ? `${segment.selectedToAirport.city} (${segment.selectedToAirport.iata})`
                                                            : segment.to || 'Destination'
                                                        }
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">{segment.selectedToAirport.name || 'Airport'}</div>
                                                </div>
                                                
                                                {/* To Dropdown */}
                                                {segment.showToDropdown && (
                                                    <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1">
                                                        <div className="p-3">
                                                            <input
                                                                type="text"
                                                                value={segment.toQuery}
                                                                onChange={(e) => updateMultiCitySegment(index, 'toQuery', e.target.value)}
                                                                placeholder="Search airports..."
                                                                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto">
                                                            {filteredToAirports.map((airport: any) => (
                                                                <div
                                                                    key={airport.iata}
                                                                    className="p-3 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                                                    onClick={() => handleMultiCityToAirportSelect(index, airport)}
                                                                >
                                                                    <div className="font-medium text-gray-900">{airport.city}</div>
                                                                    <div className="text-sm text-gray-500">{airport.name} ({airport.iata})</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Travel Date */}
                                            <div className="relative flex-1 min-w-[150px]">
                                                <div 
                                                    className="cursor-pointer bg-white rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center"
                                                    onClick={() => toggleMultiCityDropdown(index, 'date')}
                                                >
                                                    <label className="text-xs font-medium text-gray-600 mb-1">Travel Date</label>
                                                    <div className="font-bold text-gray-900 text-base lg:text-lg">{segment.date ? formatDateDisplay(segment.date) : '--'}</div>
                                                    <div className="text-xs text-gray-500">{segment.date ? getDayName(segment.date) : 'Day'}</div>
                                                </div>
                                                
                                                {/* Date Picker */}
                                                {segment.showDatePicker && (
                                                    <DatePickerDropdown
                                                        selectedDate={segment.date}
                                                        onDateSelect={(date) => handleMultiCityDateSelect(index, date)}
                                                        minDate={minDate}
                                                        onClose={() => updateMultiCitySegment(index, 'showDatePicker', false)}
                                                    />
                                                )}
                                            </div>

                                            {/* Delete Button */}
                                            {multiCitySegments.length > 2 && (
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => removeMultiCitySegment(index)}
                                                        className="w-12 h-[70px] rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors flex items-center justify-center"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                
                                {/* Multi-city footer */}
                                <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap  md:items-center justify-between gap-4 pt-4">
                                    {/* Seats & Classes */}
                                    <div className="relative flex-1 min-w-[200px]" ref={passengerDropdownRef}>
                                        <div 
                                            className="cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange transition-colors h-[70px] flex flex-col justify-center" 
                                            onClick={() => setShowPassengerPanel(!showPassengerPanel)}
                                        >
                                            <label className="text-xs font-medium text-gray-600 mb-1">Seats & Classes</label>
                                            <div className="font-bold text-gray-900 text-lg">{getPassengerText()}</div>
                                            <div className="text-xs text-gray-500">{seatClass}</div>
                                        </div>
                                        
                                        {/* Passenger Panel (reuse same logic) */}
                                        {showPassengerPanel && (
                                            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 w-80">
                                                <div className="space-y-4">
                                                    {/* Adults */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">Adults</div>
                                                            <div className="text-sm text-gray-500">12+ years</div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => updatePassengers('adults', false)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                                disabled={passengers.adults <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center font-medium">{passengers.adults}</span>
                                                            <button
                                                                onClick={() => updatePassengers('adults', true)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Children */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">Children</div>
                                                            <div className="text-sm text-gray-500">2-11 years</div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => updatePassengers('children', false)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                                disabled={passengers.children <= 0}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center font-medium">{passengers.children}</span>
                                                            <button
                                                                onClick={() => updatePassengers('children', true)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Infants */}
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-gray-900">Infants</div>
                                                            <div className="text-sm text-gray-500">Under 2 years</div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <button
                                                                onClick={() => updatePassengers('infants', false)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange disabled:opacity-50"
                                                                disabled={passengers.infants <= 0}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center font-medium">{passengers.infants}</span>
                                                            <button
                                                                onClick={() => updatePassengers('infants', true)}
                                                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Class Selection */}
                                                    <div className="border-t pt-4">
                                                        <div className="font-medium text-gray-900 mb-3">Class</div>
                                                        <div className="space-y-2">
                                                            {['Economy', 'Business', 'First'].map((classType) => (
                                                                <label key={classType} className="flex items-center space-x-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name="seatClass"
                                                                        value={classType}
                                                                        checked={seatClass === classType}
                                                                        onChange={(e) => setSeatClass(e.target.value)}
                                                                        className="text-orange focus:ring-orange"
                                                                    />
                                                                    <span className="text-sm text-gray-700">{classType}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Button */}
                                    <div className="flex-shrink-0">
                                        <button 
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                            className="bg-orange text-white px-16 py-6 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed h-[60px] whitespace-nowrap"
                                        >
                                            {isSearching ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Searching...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <span>Search Flights</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Add More Cities Button */}
                                    <div className="flex-shrink-0">
                                        {multiCitySegments.length < 4 && (
                                            <button
                                                onClick={addMultiCitySegment}
                                                className="bg-gray-100 text-gray-700 px-6 py-6 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 h-[60px] whitespace-nowrap border border-gray-300"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>Add More Cities</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>


                    {/* Main Content Area */}
                    <div className="max-w-screen-2xl mx-auto flex gap-6">
                        {/* Mobile Filter Button - Only show when we have search results or are searching */}
                        {(hasSearched || isSearching) && (
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="lg:hidden fixed bottom-4 right-4 z-50 bg-orange text-white p-3 rounded-full shadow-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                                </svg>
                            </button>
                        )}

                        {/* Filters Sidebar - Only show when we have search results or are searching */}
                        {(hasSearched || isSearching) && (
                            <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block fixed lg:static inset-0 lg:inset-auto z-40 lg:z-0 bg-black bg-opacity-50 lg:bg-transparent`}>
                                <div className={`${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 w-80 lg:w-1/4 min-w-[300px] bg-white lg:bg-transparent h-full lg:h-auto overflow-y-auto p-4 lg:p-0`}>
                                {/* Mobile close button */}
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Only show filters when we have search results or are searching */}
                                {(hasSearched || isSearching) && (
                                    <div className="space-y-6">
                                        {/* Filter Header */}
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                                            {(selectedStops.length > 0 || selectedClasses.length > 0 || selectedAirlines.length > 0 || selectedRefundable.length > 0) && (
                                                <button
                                                    onClick={handleClearAllFilters}
                                                    className="text-orange hover:text-orange-600 text-sm font-medium"
                                                >
                                                    Clear All
                                                </button>
                                            )}
                                        </div>

                                    {/* Price Range Filter - Only show when there are search results */}
                                    {searchResults.length > 0 && (
                                        <div className="bg-white rounded-lg p-4 border shadow-sm">
                                            <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm font-medium text-gray-700">
                                                    <span>${minPrice}</span>
                                                    <span>${maxPrice}</span>
                                                </div>
                                                <div className="relative">
                                                    <div 
                                                        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
                                                        onMouseMove={handleMouseMove}
                                                        onMouseUp={handleMouseUp}
                                                        onMouseLeave={handleMouseUp}
                                                    >
                                                        {/* Track between thumbs */}
                                                        <div 
                                                            className="absolute h-full bg-orange rounded-full"
                                                            style={{
                                                                left: `${leftThumb}%`,
                                                                width: `${rightThumb - leftThumb}%`
                                                            }}
                                                        ></div>
                                                        
                                                        {/* Left thumb */}
                                                        <div 
                                                            className="absolute w-5 h-5 bg-white border-2 border-orange rounded-full shadow-md cursor-pointer transform -translate-y-1.5 -translate-x-2.5 hover:scale-110 transition-transform"
                                                            style={{ left: `${leftThumb}%` }}
                                                            onMouseDown={handleMouseDownLeft}
                                                        ></div>
                                                        
                                                        {/* Right thumb */}
                                                        <div 
                                                            className="absolute w-5 h-5 bg-white border-2 border-orange rounded-full shadow-md cursor-pointer transform -translate-y-1.5 -translate-x-2.5 hover:scale-110 transition-transform"
                                                            style={{ left: `${rightThumb}%` }}
                                                            onMouseDown={handleMouseDownRight}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-xs text-gray-500">
                                                    <span>Min: ${priceRange.min}</span>
                                                    <span>Max: ${priceRange.max}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Dynamic Filter Sections */}
                                    {isSearching ? (
                                        // Show filter skeletons while searching
                                        <>
                                            {Array.from({ length: 4 }).map((_, index) => (
                                                <div key={`filter-skeleton-${index}`} className="bg-white rounded-lg p-4 border shadow-sm animate-pulse">
                                                    <div className="h-5 bg-gray-200 rounded w-24 mb-3"></div>
                                                    <div className="space-y-2">
                                                        {Array.from({ length: 3 }).map((_, optIndex) => (
                                                            <div key={optIndex} className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                                                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                                </div>
                                                                <div className="h-3 bg-gray-200 rounded w-8"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        // Show actual filters when data is loaded
                                        <>
                                            {stopOptions.length > 0 && (
                                                <FilterSection
                                                    title="Stops"
                                                    options={stopOptions}
                                                    selectedValues={selectedStops}
                                                    onFilterChange={(value, isChecked) => handleFilterChange('stops', value, isChecked)}
                                                />
                                            )}

                                            {classOptions.length > 0 && (
                                                <FilterSection
                                                    title="Flight Class"
                                                    options={classOptions}
                                                    selectedValues={selectedClasses}
                                                    onFilterChange={(value, isChecked) => handleFilterChange('class', value, isChecked)}
                                                />
                                            )}

                                            {airlineOptions.length > 0 && (
                                                <FilterSection
                                                    title="Airlines"
                                                    options={airlineOptions}
                                                    selectedValues={selectedAirlines}
                                                    onFilterChange={(value, isChecked) => handleFilterChange('airlines', value, isChecked)}
                                                />
                                            )}

                                            {refundableOptions.length > 0 && (
                                                <FilterSection
                                                    title="Refundable"
                                                    options={refundableOptions}
                                                    selectedValues={selectedRefundable}
                                                    onFilterChange={(value, isChecked) => handleFilterChange('refundable', value, isChecked)}
                                                />
                                            )}
                                        </>
                                    )}
                                    </div>
                                )}
                            </div>
                        </div>
                        )}

                        {/* Flight Results */}
                        <div className="flex-1">
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isSearching 
                                        ? 'Searching flights...' 
                                        : searchResults.length > 0 
                                            ? `${searchResults.length} flights found` 
                                            : hasSearched 
                                                ? 'No flights found'
                                                : 'Ready to search flights'
                                    }
                                </h2>
                                {searchResults.length > 0 && !isSearching && (
                                    <div className="text-sm text-gray-600">
                                        {selectedFromAirport.city} → {selectedToAirport.city}
                                    </div>
                                )}
                            </div>

                            {isSearching ? (
                                // Show skeleton cards while searching
                                <div className="space-y-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <div key={`skeleton-${index}`} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                                                {/* Airline Info Skeleton */}
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                                    <div className="space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                                                    </div>
                                                </div>

                                                {/* Flight Details Skeleton */}
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 lg:px-8">
                                                    <div className="text-center space-y-2">
                                                        <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                                                        <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
                                                    </div>
                                                    <div className="text-center space-y-2">
                                                        <div className="h-6 bg-gray-200 rounded w-16 mx-auto"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                                                    </div>
                                                </div>

                                                {/* Price and Button Skeleton */}
                                                <div className="text-right space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                                                        <div className="h-6 bg-gray-200 rounded w-20 ml-auto"></div>
                                                    </div>
                                                    <div className="h-10 bg-gray-200 rounded w-24 ml-auto"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : displayedResults.length > 0 ? (
                                <div className="space-y-4">
                                    {displayedResults.map((flight) => (
                                        <FlightCard
                                            key={flight.id}
                                            flight={flight}
                                            onBookNow={handleBookNow}
                                        />
                                    ))}
                                    
                                    {/* Load More Button */}
                                    {hasMoreResults && (
                                        <div className="flex justify-center pt-6 pb-20">
                                            <button
                                                onClick={loadMoreResults}
                                                className="bg-orange text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
                                            >
                                                <span>Load More Flights</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                    
                                    {/* Results summary */}
                                    <div className="text-center text-sm text-gray-500 pt-4">
                                        Showing {displayedResults.length} of {filteredResults.length} flights
                                    </div>
                                </div>
                            ) : filteredResults.length === 0 && searchResults.length > 0 ? (
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No flights match your filters</h3>
                                    <p className="text-gray-600 mb-4">
                                        Try adjusting your search criteria or removing some filters.
                                    </p>
                                    <button 
                                        onClick={handleClearAllFilters}
                                        className="bg-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg p-8 text-center">
                                    <div className="text-gray-400 mb-4">
                                        {hasSearched ? (
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        ) : (
                                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        )}
                                    </div>
                                    {hasSearched ? (
                                        <>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No flights found</h3>
                                            <p className="text-gray-600 mb-4">
                                                Please try a new search with different criteria.
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Start your flight search</h3>
                                            <p className="text-gray-600 mb-4">
                                                Fill in your travel details above and click search to find the best flight deals.
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Search;
