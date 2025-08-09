import React from 'react';
import LocationDropdown from './LocationDropdown';
import DateInput from './DateInput';

interface MultiCityRowProps {
  from: any;
  to: any;
  date: string;
  onFromChange: (airport: any) => void;
  onToChange: (airport: any) => void;
  onDateChange: (date: string) => void;
  onRemove: () => void;
  error?: string;
}

const MultiCityRow: React.FC<MultiCityRowProps> = ({ from, to, date, onFromChange, onToChange, onDateChange, onRemove, error }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-4 animate-fade-in">
      <LocationDropdown label="From" value={from} onChange={onFromChange} ariaLabel="From Airport" />
      <LocationDropdown label="To" value={to} onChange={onToChange} ariaLabel="To Airport" />
      <DateInput label="Date" value={date} onChange={onDateChange} />
      <div className="flex items-center gap-2">
        <button
          className="ml-2 text-red-500 hover:text-red-700 text-xl font-bold transition-colors duration-300"
          onClick={onRemove}
          aria-label="Remove segment"
        >✖</button>
      </div>
      {error && <div className="col-span-5 text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default MultiCityRow;
