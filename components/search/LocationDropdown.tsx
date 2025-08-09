import React, { useState, useRef, useEffect } from 'react';
import airports from '../../airports.js';

interface Airport {
  name: string;
  city: string;
  iata: string;
  country: string;
}

interface LocationDropdownProps {
  label: string;
  value: Airport | null;
  onChange: (airport: Airport) => void;
  placeholder?: string;
  ariaLabel?: string;
  error?: string;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ label, value, onChange, placeholder = '', ariaLabel, error }) => {
  const [query, setQuery] = useState(value ? value.city : '');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAirports = query
    ? airports.filter((airport: Airport) =>
        airport.name.toLowerCase().includes(query.toLowerCase()) ||
        airport.iata.toLowerCase().includes(query.toLowerCase()) ||
        airport.city.toLowerCase().includes(query.toLowerCase()) ||
        airport.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : airports.slice(0, 10);

  return (
    <div className="space-y-1 relative" ref={ref}>
      <label className="text-sm font-semibold text-[#1A2B49]">{label}</label>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        placeholder={placeholder}
        className={`border border-gray-200 rounded-xl p-4 bg-[#F8F8F8] font-semibold text-xl text-[#1A2B49] focus:border-[#FD7300] focus:ring-2 focus:ring-[#FD7300] w-full ${error ? 'border-red-400' : ''}`}
        aria-label={ariaLabel || label}
        autoComplete="off"
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm z-50">
          <div className="max-h-60 overflow-y-auto">
            {filteredAirports.map((airport) => (
              <div
                key={airport.iata}
                onClick={() => { onChange(airport); setOpen(false); setQuery(airport.city); }}
                className="flex items-center p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                tabIndex={0}
                aria-label={`${airport.name} (${airport.iata})`}
              >
                <div className="flex-1">
                  <div className="font-medium text-[#1A2B49]">{airport.name} ({airport.iata})</div>
                  <div className="text-sm text-[#1A2B49] opacity-70">{airport.city}, {airport.country}</div>
                </div>
              </div>
            ))}
            {filteredAirports.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No airports found.</div>
            )}
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default LocationDropdown;
