import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FlightSearchResponse, FareItinerary } from '../lib/api';
import airports from '../airports.js';

// Processed flight interface for easier handling
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
}

const Search = () => {
    const router = useRouter();
    
    // API flight results
    const [apiFlightResults, setApiFlightResults] = useState<FlightSearchResponse | null>(null);
    const [apiFlights, setApiFlights] = useState<ProcessedFlight[]>([]);
    const [isLoadingFromAPI, setIsLoadingFromAPI] = useState(true);
    
    // Price filter ranges (will be calculated from API results)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    
    // Filter states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [leftThumb, setLeftThumb] = useState(0);
    const [rightThumb, setRightThumb] = useState(100);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    // Search form states
    const [tripType, setTripType] = useState<'round' | 'single' | 'multi'>('single');
    const [from, setFrom] = useState('New York');
    const [to, setTo] = useState('France');
    const [fromQuery, setFromQuery] = useState('');
    const [toQuery, setToQuery] = useState('');
    const [selectedFromAirport, setSelectedFromAirport] = useState({
        name: 'John F. Kennedy International',
        city: 'New York',
        iata: 'JFK',
        country: 'United States'
    });
    const [selectedToAirport, setSelectedToAirport] = useState({
        name: 'Paris Orly Airport',
        city: 'France',
        iata: 'ORY',
        country: 'France'
    });
    const [travelDate, setTravelDate] = useState('2024-07-20');
    const [returnDate, setReturnDate] = useState('2024-07-25');
    const [seatClass, setSeatClass] = useState('Economy');
    const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });

    // UI states
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);
    const [showTravelDatePicker, setShowTravelDatePicker] = useState(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
    const [showPassengerPanel, setShowPassengerPanel] = useState(false);
    const [showTravelTypeDropdown, setShowTravelTypeDropdown] = useState(false);

    // Multi-city segments
    const [multiCitySegments, setMultiCitySegments] = useState([
        { from: '', to: '', date: '', fromQuery: '', toQuery: '' },
        { from: '', to: '', date: '', fromQuery: '', toQuery: '' }
    ]);

    // Filter states
    const [selectedStops, setSelectedStops] = useState<string[]>(['Non-stop']);
    const [selectedClasses, setSelectedClasses] = useState<string[]>(['Economy']);
    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [selectedRefundable, setSelectedRefundable] = useState<string[]>([]);

    // All flights data (base data that doesn't change) - converted to ProcessedFlight format
    const [allFlights] = useState<ProcessedFlight[]>([
        {
            id: 'static-1',
            airline: 'Qatar Airways',
            airlineCode: 'QR',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: 'Non-stop',
            duration: '8h 30m',
            points: 300,
            price: 850,
            class: 'Economy',
            refundable: 'Yes',
            fareSourceCode: 'static-fare-1',
            departureTime: '2024-07-20T10:00:00',
            arrivalTime: '2024-07-20T18:30:00',
            flightNumber: 'QR101',
            stops: 0
        },
        {
            id: 'static-2',
            airline: 'Qatar Airways',
            airlineCode: 'QR',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: 'Non-stop',
            duration: '8h 30m',
            points: 300,
            price: 920,
            class: 'Business',
            refundable: 'No',
            fareSourceCode: 'static-fare-2',
            departureTime: '2024-07-20T14:00:00',
            arrivalTime: '2024-07-20T22:30:00',
            flightNumber: 'QR102',
            stops: 0
        },
        {
            id: 'static-3',
            airline: 'Fly Emirates',
            airlineCode: 'EK',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: '1 stop',
            duration: '10h 15m',
            points: 280,
            price: 780,
            class: 'Economy',
            refundable: 'As per rules',
            fareSourceCode: 'static-fare-3',
            departureTime: '2024-07-20T16:00:00',
            arrivalTime: '2024-07-21T02:15:00',
            flightNumber: 'EK201',
            stops: 1
        },
        {
            id: 'static-4',
            airline: 'Nova Air',
            airlineCode: 'VQ',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: '2 stop',
            duration: '12h 45m',
            points: 250,
            price: 695,
            class: 'Economy',
            refundable: 'Yes',
            fareSourceCode: 'static-fare-4',
            departureTime: '2024-07-20T08:00:00',
            arrivalTime: '2024-07-20T20:45:00',
            flightNumber: 'VQ301',
            stops: 2
        },
        {
            id: 'static-5',
            airline: 'Air Asia',
            airlineCode: 'AK',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: '1 stop',
            duration: '11h 20m',
            points: 270,
            price: 825,
            class: 'Business',
            refundable: 'No',
            fareSourceCode: 'static-fare-5',
            departureTime: '2024-07-20T12:00:00',
            arrivalTime: '2024-07-20T23:20:00',
            flightNumber: 'AK401',
            stops: 1
        },
        {
            id: 'static-6',
            airline: 'Singapore Airlines',
            airlineCode: 'SQ',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: 'Non-stop',
            duration: '8h 45m',
            points: 320,
            price: 950,
            class: 'Business',
            refundable: 'Yes',
            fareSourceCode: 'static-fare-6',
            departureTime: '2024-07-20T18:00:00',
            arrivalTime: '2024-07-21T02:45:00',
            flightNumber: 'SQ501',
            stops: 0
        },
        {
            id: 'static-7',
            airline: 'Qatar Airways',
            airlineCode: 'QR',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: '3 stop',
            duration: '15h 30m',
            points: 200,
            price: 550,
            class: 'Economy',
            refundable: 'As per rules',
            fareSourceCode: 'static-fare-7',
            departureTime: '2024-07-20T06:00:00',
            arrivalTime: '2024-07-20T21:30:00',
            flightNumber: 'QR601',
            stops: 3
        },
        {
            id: 'static-8',
            airline: 'Fly Emirates',
            airlineCode: 'EK',
            logo: '/api/placeholder/40/40',
            from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
            to: { city: 'London', code: 'LCY', name: 'London City Airport' },
            flightType: 'Non-stop',
            duration: '8h 20m',
            points: 310,
            price: 1200,
            class: 'Business',
            refundable: 'Yes',
            fareSourceCode: 'static-fare-8',
            departureTime: '2024-07-20T20:00:00',
            arrivalTime: '2024-07-21T04:20:00',
            flightNumber: 'EK701',
            stops: 0
        }
    ]);

    // Search results (filtered data)
    const [searchResults, setSearchResults] = useState<ProcessedFlight[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Process API flight results
    const processApiFlights = (apiResponse: FlightSearchResponse): ProcessedFlight[] => {
        if (!apiResponse.data?.flights?.AirSearchResponse?.AirSearchResult?.FareItineraries) {
            return [];
        }

        const { FareItineraries } = apiResponse.data.flights.AirSearchResponse.AirSearchResult;
        const { airlines, airports: airportData } = apiResponse.data;

        return FareItineraries.map((fareItinerary, index) => {
            const { FareItinerary } = fareItinerary;
            const segment = FareItinerary.OriginDestinationOptions[0]?.FlightSegment;
            
            if (!segment) return null;

            const price = parseFloat(FareItinerary.AirItineraryFareInfo.TotalFare.Amount);
            const departureAirport = airportData[segment.DepartureAirportLocationCode];
            const arrivalAirport = airportData[segment.ArrivalAirportLocationCode];
            const airline = airlines[segment.MarketingAirlineCode];

            // Calculate duration
            const depTime = new Date(segment.DepartureDateTime);
            const arrTime = new Date(segment.ArrivalDateTime);
            const durationMs = arrTime.getTime() - depTime.getTime();
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
            const duration = `${hours}h ${minutes}m`;

            // Determine flight type based on stops
            const stops = segment.StopQuantity || 0;
            let flightType = 'Non-stop';
            if (stops === 1) flightType = '1 stop';
            else if (stops === 2) flightType = '2 stop';
            else if (stops > 2) flightType = `${stops} stop`;

            // Calculate points (example: 10% of price)
            const points = Math.floor(price * 0.1);

            return {
                id: `flight-${index}`,
                airline: airline || segment.MarketingAirlineCode,
                airlineCode: segment.MarketingAirlineCode,
                logo: '/api/placeholder/40/40',
                from: {
                    city: departureAirport?.city || segment.DepartureAirportLocationCode,
                    code: segment.DepartureAirportLocationCode,
                    name: departureAirport?.name || segment.DepartureAirportLocationCode
                },
                to: {
                    city: arrivalAirport?.city || segment.ArrivalAirportLocationCode,
                    code: segment.ArrivalAirportLocationCode,
                    name: arrivalAirport?.name || segment.ArrivalAirportLocationCode
                },
                flightType,
                duration,
                points,
                price,
                class: segment.CabinClassText,
                refundable: 'As per rules', // Default value, could be enhanced
                fareSourceCode: FareItinerary.AirItineraryFareInfo.FareSourceCode,
                departureTime: segment.DepartureDateTime,
                arrivalTime: segment.ArrivalDateTime,
                flightNumber: segment.FlightNumber,
                stops
            };
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

    // Load flight results from session storage
    useEffect(() => {
        const results = sessionStorage.getItem('flight_search_results');
        const params = sessionStorage.getItem('flight_search_params');
        
        if (results) {
            try {
                const apiResponse: FlightSearchResponse = JSON.parse(results);
                setApiFlightResults(apiResponse);
                
                const processedFlights = processApiFlights(apiResponse);
                setApiFlights(processedFlights);
                setSearchResults(processedFlights);
                updateFilterOptions(processedFlights);
                
                // Store fareSourceCode for each flight in localStorage for booking
                processedFlights.forEach(flight => {
                    localStorage.setItem(`fareSourceCode_${flight.id}`, flight.fareSourceCode);
                });
                
            } catch (error) {
                console.error('Error parsing flight results:', error);
                // Fallback to static data
                setSearchResults(allFlights);
            }
        } else {
            // No API results, use static data
            setSearchResults(allFlights);
        }
        
        setIsLoadingFromAPI(false);
    }, []);

    // Search results (filtered data) - removing the old interface definition
    // const [searchResults, setSearchResults] = useState<Flight[]>([]);

    // Refs for dropdown handling
    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);
    const passengerDropdownRef = useRef<HTMLDivElement>(null);
    const travelTypeDropdownRef = useRef<HTMLDivElement>(null);

    // Helper functions
    const formatDateDisplay = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        return `${day} ${month}`;
    };

    const getDayName = (dateString: string) => {
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

    // Handle passenger updates
    const updatePassengers = (type: 'adults' | 'children' | 'infants', increment: boolean) => {
        setPassengers(prev => {
            const newCount = increment ? prev[type] + 1 : Math.max(0, prev[type] - 1);
            if (type === 'adults' && newCount < 1) return prev; // At least 1 adult required
            return { ...prev, [type]: newCount };
        });
    };

    // Handle trip type change
    const handleTripTypeChange = (type: 'round' | 'single' | 'multi') => {
        setTripType(type);
        setShowTravelTypeDropdown(false);
        
        if (type === 'multi') {
            setMultiCitySegments([
                { from: '', to: '', date: '', fromQuery: '', toQuery: '' },
                { from: '', to: '', date: '', fromQuery: '', toQuery: '' }
            ]);
        }
    };

    // Add multi-city segment
    const addMultiCitySegment = () => {
        setMultiCitySegments([...multiCitySegments, { from: '', to: '', date: '', fromQuery: '', toQuery: '' }]);
    };

    // Remove multi-city segment
    const removeMultiCitySegment = (index: number) => {
        if (multiCitySegments.length > 2) {
            setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
        }
    };

    // Handle search
    const handleSearch = () => {
        // Apply filters and show results
        applyFilters();
        console.log('Search submitted with:', {
            tripType,
            from: selectedFromAirport,
            to: selectedToAirport,
            travelDate,
            returnDate,
            passengers,
            seatClass,
            multiCitySegments: tripType === 'multi' ? multiCitySegments : null
        });
    };

    // Filter options
    const stopOptions = [
        { label: '1 stop', count: 20 },
        { label: '2 stop', count: 15 },
        { label: '3 stop', count: 30 },
        { label: 'Non-stop', count: 22 }
    ];

    const classOptions = [
        { label: 'Economy', count: 20 },
        { label: 'Business', count: 26 }
    ];

    const airlineOptions = [
        { label: 'Qatar Airways', count: 17 },
        { label: 'Fly Emirates', count: 14 },
        { label: 'Nova Air', count: 62 },
        { label: 'Air Asia', count: 8 },
        { label: 'Singapore Airlines', count: 12 }
    ];

    const refundableOptions = [
        { label: 'Yes', count: 17 },
        { label: 'No', count: 14 },
        { label: 'As per rules', count: 62 }
    ];

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
        // Use API flights if available, otherwise use static flights
        const flightsToFilter = apiFlights.length > 0 ? apiFlights : allFlights;
        
        let filtered = flightsToFilter.filter(flight => {
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

        setSearchResults(filtered);
    };

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

    // Apply price filter
    const handleApplyPriceFilter = () => {
        applyFilters();
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

    // Load more handler
    const handleLoadMore = () => {
        setIsLoading(true);
        setTimeout(() => {
            const newResults: ProcessedFlight[] = Array.from({ length: 3 }, (_, index) => ({
                id: `load-more-${searchResults.length + index + 1}`,
                airline: 'Qatar Airways',
                airlineCode: 'QR',
                logo: '/api/placeholder/40/40',
                from: { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
                to: { city: 'London', code: 'LCY', name: 'London City Airport' },
                flightType: 'Non-stop',
                duration: '8h 30m',
                points: 300,
                price: Math.floor(Math.random() * 500) + 600,
                class: 'Economy',
                refundable: 'Yes',
                fareSourceCode: `load-more-fare-${searchResults.length + index + 1}`,
                departureTime: '2024-07-20T10:00:00',
                arrivalTime: '2024-07-20T18:30:00',
                flightNumber: `QR${101 + index}`,
                stops: 0
            }));
            setSearchResults([...searchResults, ...newResults]);
            setIsLoading(false);
        }, 1000);
    };

    // Handle book now click
    const handleBookNow = (flight: ProcessedFlight) => {
        // Store the fare source code for booking
        localStorage.setItem('selected_fare_source_code', flight.fareSourceCode);
        localStorage.setItem('selected_flight_details', JSON.stringify(flight));
        
        // Navigate to booking page or show booking modal
        console.log('Booking flight with fareSourceCode:', flight.fareSourceCode);
        // You can add navigation logic here
        // router.push('/booking');
    };

    // Auto-apply filters when any filter changes
    useEffect(() => {
        applyFilters();
    }, [selectedStops, selectedClasses, selectedAirlines, selectedRefundable, minPrice, maxPrice]);

    // Initialize with all flights on component mount (only if no API results)
    useEffect(() => {
        if (!isLoadingFromAPI && apiFlights.length === 0) {
            setSearchResults(allFlights);
            updateFilterOptions(allFlights);
        }
    }, [isLoadingFromAPI, apiFlights, allFlights]);

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
            if (travelTypeDropdownRef.current && !travelTypeDropdownRef.current.contains(event.target as Node)) {
                setShowTravelTypeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    {/* Search Bar Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 max-w-screen-2xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
                            {/* From */}
                            <div className="space-y-1 relative" ref={fromDropdownRef}>
                                <label className="text-sm font-medium text-gray-700">From</label>
                                <div 
                                    className="cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors" 
                                    onClick={() => {
                                        setShowFromDropdown(!showFromDropdown);
                                        setFromQuery(selectedFromAirport.city);
                                    }}
                                >
                                    <div className="font-bold text-gray-900">{selectedFromAirport.city}</div>
                                    <div className="text-sm text-gray-500 truncate">{selectedFromAirport.name}</div>
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
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        const tempFrom = selectedFromAirport;
                                        const tempFromCity = from;
                                        setSelectedFromAirport(selectedToAirport);
                                        setFrom(to);
                                        setSelectedToAirport(tempFrom);
                                        setTo(tempFromCity);
                                    }}
                                    className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-orange hover:text-orange transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                    </svg>
                                </button>
                            </div>

                            {/* To */}
                            <div className="space-y-1 relative" ref={toDropdownRef}>
                                <label className="text-sm font-medium text-gray-700">To</label>
                                <div 
                                    className="cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors" 
                                    onClick={() => {
                                        setShowToDropdown(!showToDropdown);
                                        setToQuery(selectedToAirport.city);
                                    }}
                                >
                                    <div className="font-bold text-gray-900">{selectedToAirport.city}</div>
                                    <div className="text-sm text-gray-500 truncate">{selectedToAirport.name}</div>
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
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Travel Date</label>
                                <div 
                                    className="cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors" 
                                    onClick={() => setShowTravelDatePicker(!showTravelDatePicker)}
                                >
                                    <div className="font-bold text-gray-900">{formatDateDisplay(travelDate)}</div>
                                    <div className="text-sm text-gray-500">{getDayName(travelDate)}</div>
                                </div>
                                {showTravelDatePicker && (
                                    <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3">
                                        <input
                                            type="date"
                                            value={travelDate}
                                            onChange={(e) => {
                                                setTravelDate(e.target.value);
                                                setShowTravelDatePicker(false);
                                            }}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Return Date */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Return Date</label>
                                <div 
                                    className={`cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors ${tripType === 'single' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => tripType !== 'single' && setShowReturnDatePicker(!showReturnDatePicker)}
                                >
                                    <div className="font-bold text-gray-900">
                                        {tripType === 'single' ? '--' : formatDateDisplay(returnDate)}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {tripType === 'single' ? '--' : getDayName(returnDate)}
                                    </div>
                                </div>
                                {showReturnDatePicker && tripType !== 'single' && (
                                    <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-3">
                                        <input
                                            type="date"
                                            value={returnDate}
                                            onChange={(e) => {
                                                setReturnDate(e.target.value);
                                                setShowReturnDatePicker(false);
                                            }}
                                            min={travelDate}
                                            className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Seats & Classes */}
                            <div className="space-y-1 relative" ref={passengerDropdownRef}>
                                <label className="text-sm font-medium text-gray-700">Seats & Classes</label>
                                <div 
                                    className="cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors" 
                                    onClick={() => setShowPassengerPanel(!showPassengerPanel)}
                                >
                                    <div className="font-bold text-gray-900">{getPassengerText()}</div>
                                    <div className="text-sm text-gray-500">{seatClass}</div>
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
                                                            <span className="text-gray-700">{classType}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Travel Type & Search Button */}
                            <div className="space-y-1 relative" ref={travelTypeDropdownRef}>
                                <label className="text-sm font-medium text-gray-700">Travel Type</label>
                                <div className="flex items-center justify-between">
                                    <div 
                                        className="cursor-pointer p-2 border border-gray-200 rounded hover:border-orange transition-colors flex-1 mr-4" 
                                        onClick={() => setShowTravelTypeDropdown(!showTravelTypeDropdown)}
                                    >
                                        <div className="font-bold text-gray-900">
                                            {tripType === 'single' ? 'One Way' : tripType === 'round' ? 'Round Trip' : 'Multi City'}
                                        </div>
                                        <div className="text-sm text-gray-500">{seatClass}</div>
                                    </div>
                                    <button 
                                        onClick={handleSearch}
                                        className="bg-orange text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span>Search Flights</span>
                                    </button>
                                </div>
                                
                                {/* Travel Type Dropdown */}
                                {showTravelTypeDropdown && (
                                    <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-48">
                                        {[
                                            { value: 'single', label: 'One Way' },
                                            { value: 'round', label: 'Round Trip' },
                                            { value: 'multi', label: 'Multi City' }
                                        ].map((option) => (
                                            <div
                                                key={option.value}
                                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                onClick={() => handleTripTypeChange(option.value as 'round' | 'single' | 'multi')}
                                            >
                                                <div className="font-medium text-gray-900">{option.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Multi-City Segments */}
                        {tripType === 'multi' && (
                            <div className="mt-6 space-y-4">
                                {multiCitySegments.map((segment, index) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">From</label>
                                            <input
                                                type="text"
                                                value={segment.from}
                                                onChange={(e) => {
                                                    const newSegments = [...multiCitySegments];
                                                    newSegments[index].from = e.target.value;
                                                    setMultiCitySegments(newSegments);
                                                }}
                                                placeholder="City or airport"
                                                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">To</label>
                                            <input
                                                type="text"
                                                value={segment.to}
                                                onChange={(e) => {
                                                    const newSegments = [...multiCitySegments];
                                                    newSegments[index].to = e.target.value;
                                                    setMultiCitySegments(newSegments);
                                                }}
                                                placeholder="City or airport"
                                                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                value={segment.date}
                                                onChange={(e) => {
                                                    const newSegments = [...multiCitySegments];
                                                    newSegments[index].date = e.target.value;
                                                    setMultiCitySegments(newSegments);
                                                }}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-orange"
                                            />
                                        </div>
                                        <div className="flex items-end space-x-2">
                                            {multiCitySegments.length > 2 && (
                                                <button
                                                    onClick={() => removeMultiCitySegment(index)}
                                                    className="p-2 text-red-500 hover:text-red-700 border border-red-200 rounded hover:border-red-300"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addMultiCitySegment}
                                    className="flex items-center space-x-2 text-orange hover:text-orange-600 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Add another flight</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div className="max-w-screen-2xl mx-auto flex gap-6">
                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="lg:hidden fixed bottom-4 right-4 z-50 bg-orange text-white p-3 rounded-full shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                            </svg>
                        </button>

                        {/* Filters Sidebar */}
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

                                <div className="space-y-6">
                                    {/* Clear Filters Button */}
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                        <button
                                            onClick={handleClearAllFilters}
                                            className="text-sm text-orange hover:text-orange-600 font-medium"
                                        >
                                            Clear All
                                        </button>
                                    </div>

                                    {/* Filter by Price */}
                                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-gray-900">Filter by price</h3>
                                        <div 
                                            className="mb-6 px-3"
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            onMouseLeave={handleMouseUp}
                                        >
                                            <div className="relative h-2 bg-gray-200 rounded-full mb-6">
                                                <div 
                                                    className="absolute h-2 bg-orange rounded-full" 
                                                    style={{ left: `${leftThumb}%`, right: `${100 - rightThumb}%` }}
                                                />
                                                <div 
                                                    className="absolute -top-6 text-xs font-medium text-gray-700" 
                                                    style={{ left: `calc(${leftThumb}% - 12px)` }}
                                                >
                                                    ${minPrice}
                                                </div>
                                                <div 
                                                    className="absolute -top-6 text-xs font-medium text-gray-700" 
                                                    style={{ left: `calc(${rightThumb}% - 22px)` }}
                                                >
                                                    ${maxPrice}
                                                </div>
                                                <div 
                                                    className="absolute h-4 w-4 bg-white rounded-full -top-1 -ml-2 cursor-pointer shadow-md border-2 border-orange"
                                                    style={{ left: `${leftThumb}%` }}
                                                    onMouseDown={handleMouseDownLeft}
                                                />
                                                <div 
                                                    className="absolute h-4 w-4 bg-white rounded-full -top-1 -ml-2 cursor-pointer shadow-md border-2 border-orange"
                                                    style={{ left: `${rightThumb}%` }}
                                                    onMouseDown={handleMouseDownRight}
                                                />
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleApplyPriceFilter}
                                            className="text-orange border border-orange rounded px-4 py-1 hover:bg-orange hover:text-white transition-colors text-sm font-medium"
                                        >
                                            Apply
                                        </button>
                                    </div>

                                    {/* Number of Stops */}
                                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-gray-900">Number of stops</h3>
                                        <div className="space-y-3">
                                            {stopOptions.map((option) => (
                                                <div key={option.label} className="flex items-center justify-between">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedStops.includes(option.label)}
                                                            onChange={(e) => handleFilterChange('stops', option.label, e.target.checked)}
                                                            className="rounded border-gray-300 text-orange focus:ring-orange"
                                                        />
                                                        <span className="text-gray-700">{option.label}</span>
                                                    </label>
                                                    <span className="text-sm text-gray-500">{option.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Flight Class */}
                                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-gray-900">Flight class</h3>
                                        <div className="space-y-3">
                                            {classOptions.map((option) => (
                                                <div key={option.label} className="flex items-center justify-between">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedClasses.includes(option.label)}
                                                            onChange={(e) => handleFilterChange('class', option.label, e.target.checked)}
                                                            className="rounded border-gray-300 text-orange focus:ring-orange"
                                                        />
                                                        <span className="text-gray-700">{option.label}</span>
                                                    </label>
                                                    <span className="text-sm text-gray-500">{option.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Airlines */}
                                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-gray-900">Airlines</h3>
                                        <div className="space-y-3">
                                            {airlineOptions.map((option) => (
                                                <div key={option.label} className="flex items-center justify-between">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAirlines.includes(option.label)}
                                                            onChange={(e) => handleFilterChange('airlines', option.label, e.target.checked)}
                                                            className="rounded border-gray-300 text-orange focus:ring-orange"
                                                        />
                                                        <span className="text-gray-700">{option.label}</span>
                                                    </label>
                                                    <span className="text-sm text-gray-500">{option.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Refundable */}
                                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                                        <h3 className="font-semibold mb-4 text-gray-900">Refundable</h3>
                                        <div className="space-y-3">
                                            {refundableOptions.map((option) => (
                                                <div key={option.label} className="flex items-center justify-between">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRefundable.includes(option.label)}
                                                            onChange={(e) => handleFilterChange('refundable', option.label, e.target.checked)}
                                                            className="rounded border-gray-300 text-orange focus:ring-orange"
                                                        />
                                                        <span className="text-gray-700">{option.label}</span>
                                                    </label>
                                                    <span className="text-sm text-gray-500">{option.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Results Section */}
                        <div className="flex-1 lg:w-3/4">
                            {/* Results Count */}
                            <div className="mb-4">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold">{searchResults.length}</span> flight{searchResults.length !== 1 ? 's' : ''} 
                                    {(selectedStops.length > 0 || selectedClasses.length > 0 || selectedAirlines.length > 0 || selectedRefundable.length > 0 || minPrice > 0 || maxPrice < 100000) && 
                                        <span> matching your filters</span>
                                    }
                                </p>
                            </div>

                            <div className="space-y-4">
                                {searchResults.map((flight) => (
                                    <div key={flight.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            {/* Left: Airline Info */}
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{flight.airline}</div>
                                                    <div className="text-sm text-gray-500">Show more ▼</div>
                                                </div>
                                            </div>

                                            {/* Center: Route Info */}
                                            <div className="flex items-center space-x-6">
                                                {/* From */}
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900">{flight.from.city}</div>
                                                    <div className="text-sm text-gray-500">{flight.from.code} • {flight.from.name}</div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="flex flex-col items-center">
                                                    <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{flight.flightType}</div>
                                                    <div className="text-xs text-gray-500">{flight.duration}</div>
                                                </div>

                                                {/* To */}
                                                <div className="text-center">
                                                    <div className="font-bold text-gray-900">{flight.to.city}</div>
                                                    <div className="text-sm text-gray-500">{flight.to.code} • {flight.to.name}</div>
                                                </div>
                                            </div>

                                            {/* Right: Price & Book Button */}
                                            <div className="text-right">
                                                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg mb-3">
                                                    <div className="font-bold">{flight.points} Points</div>
                                                </div>
                                                <button 
                                                    onClick={() => handleBookNow(flight)}
                                                    className="bg-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                                >
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Load More Button */}
                                <div className="flex justify-center mt-8">
                                    <button
                                        onClick={handleLoadMore}
                                        disabled={isLoading}
                                        className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-300 border-t-orange rounded-full animate-spin"></div>
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-4 h-4 border-2 border-dotted border-gray-400 rounded-full"></div>
                                                <span>Load more...</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Search;