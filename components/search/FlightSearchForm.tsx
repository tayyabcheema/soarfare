import React, { useState } from 'react';
import LocationDropdown from './LocationDropdown';
import DateInput from './DateInput';
import PassengersDropdown from './PassengersDropdown';
import MultiCityRow from './MultiCityRow';

interface Airport {
  name: string;
  city: string;
  iata: string;
  country: string;
}

const defaultAirportFrom: Airport = {
  name: 'John F. Kennedy International',
  city: 'New York',
  iata: 'JFK',
  country: 'United States'
};
const defaultAirportTo: Airport = {
  name: 'Paris Orly Airport',
  city: 'France',
  iata: 'ORY',
  country: 'France'
};

const todayStr = new Date().toISOString().split('T')[0];

const FlightSearchForm: React.FC<{ onSearch?: (data: any) => void }> = ({ onSearch = () => {} }) => {
  const [tripType, setTripType] = useState<'oneway' | 'return' | 'multi'>('oneway');
  const [from, setFrom] = useState<Airport>(defaultAirportFrom);
  const [to, setTo] = useState<Airport>(defaultAirportTo);
  const [travelDate, setTravelDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0, classType: 'Economy' });
  const [multiCity, setMultiCity] = useState<Array<{ from: Airport|null; to: Airport|null; date: string }>>([
    { from: null, to: null, date: todayStr },
    { from: null, to: null, date: todayStr }
  ]);
  const [error, setError] = useState<string>('');

  // Validation
  const validate = () => {
    if (tripType !== 'multi' && from && to && from.iata === to.iata) {
      setError('Origin and destination cannot be the same');
      return false;
    }
    if (tripType === 'return' && returnDate && travelDate > returnDate) {
      setError('Return date must be after travel date');
      return false;
    }
    setError('');
    return true;
  };

  // Multi-city handlers
  const addSegment = () => {
    if (multiCity.length < 4) {
      setMultiCity([...multiCity, { from: null, to: null, date: todayStr }]);
    }
  };
  const removeSegment = (idx: number) => {
    setMultiCity(multiCity.filter((_, i) => i !== idx));
  };
  const updateSegment = (idx: number, field: 'from'|'to'|'date', value: any) => {
    setMultiCity(multiCity.map((seg, i) => i === idx ? { ...seg, [field]: value } : seg));
  };

  // Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (tripType === 'multi') {
      onSearch({ tripType, multiCity, passengers });
    } else {
      onSearch({ tripType, from, to, travelDate, returnDate, passengers });
    }
  };

  return (
    <form className="bg-white rounded-xl shadow-sm p-4 lg:p-6 max-w-screen-2xl mx-auto w-full" onSubmit={handleSubmit}>
      {/* Travel Type Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'oneway', label: 'One Way' },
          { key: 'return', label: 'Return' },
          { key: 'multi', label: 'Multi-City' }
        ].map(tab => (
          <button
            key={tab.key}
            type="button"
            className={`px-6 py-2 rounded-xl font-semibold text-base transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FD7300] ${tripType === tab.key ? 'bg-[#FD7300] text-white' : 'bg-[#F8F8F8] text-[#1A2B49] hover:bg-orange-100'}`}
            onClick={() => { setTripType(tab.key as any); setError(''); if(tab.key !== 'multi') setMultiCity([{ from: null, to: null, date: todayStr }, { from: null, to: null, date: todayStr }]); if(tab.key !== 'return') setReturnDate(''); }}
            aria-label={tab.label}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Form Fields */}
      {tripType !== 'multi' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <LocationDropdown label="From" value={from} onChange={setFrom} ariaLabel="From Airport" />
          <LocationDropdown label="To" value={to} onChange={setTo} ariaLabel="To Airport" />
          <DateInput label="Travel Date" value={travelDate} onChange={setTravelDate} error={error && error.includes('date') ? error : ''} />
          {tripType === 'return' && (
            <DateInput label="Return Date" value={returnDate} onChange={setReturnDate} minDate={travelDate} error={error && error.includes('Return') ? error : ''} />
          )}
          <div className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
            <PassengersDropdown value={passengers} onChange={setPassengers} />
          </div>
        </div>
      ) : (
        <div>
          {multiCity.map((seg, idx) => (
            <MultiCityRow
              key={idx}
              from={seg.from}
              to={seg.to}
              date={seg.date}
              onFromChange={val => updateSegment(idx, 'from', val)}
              onToChange={val => updateSegment(idx, 'to', val)}
              onDateChange={val => updateSegment(idx, 'date', val)}
              onRemove={() => removeSegment(idx)}
            />
          ))}
          {multiCity.length < 4 && (
            <button
              type="button"
              className="mt-2 px-4 py-2 rounded-xl bg-[#F8F8F8] text-[#FD7300] font-semibold transition-colors duration-300 hover:bg-orange-100"
              onClick={addSegment}
              aria-label="Add another route"
            >+ Add More</button>
          )}
          <div className="mt-4">
            <PassengersDropdown value={passengers} onChange={setPassengers} />
          </div>
        </div>
      )}
      {/* Error Message */}
      {error && <div className="text-xs text-red-500 mt-2">{error}</div>}
      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="bg-[#FD7300] hover:bg-[#E56600] text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2 text-lg shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search Flights
        </button>
      </div>
    </form>
  );
};

export default FlightSearchForm;
