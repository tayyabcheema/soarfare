import React, { useState } from 'react';

interface PassengersDropdownProps {
  value: { adults: number; children: number; infants: number; classType: string };
  onChange: (val: { adults: number; children: number; infants: number; classType: string }) => void;
  error?: string;
}

const PassengersDropdown: React.FC<PassengersDropdownProps> = ({ value, onChange, error }) => {
  const [open, setOpen] = useState(false);

  const update = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newValue = { ...value, [type]: Math.max(0, value[type] + delta) };
    if (type === 'adults' && newValue.adults < 1) return;
    onChange(newValue);
  };

  return (
    <div className="border border-gray-300 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#1A2B49]">Passengers</h3>
        <button
          onClick={() => setOpen(!open)}
          className="text-[#FD7300] focus:outline-none"
          aria-label="Toggle passenger details"
        >
          {open ? '−' : '+'}
        </button>
      </div>
      {open && (
        <div className="mt-4">
          {[
            { type: 'adults', label: 'Adults (12+)', min: 1 },
            { type: 'children', label: 'Children (2-11)', min: 0 },
            { type: 'infants', label: 'Infants (<2)', min: 0 }
          ].map(({ type, label, min }) => (
            <div key={type} className="flex items-center justify-between py-2">
              <span className="font-medium text-[#1A2B49]">{label}</span>
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full bg-[#FD7300] text-white flex items-center justify-center transition disabled:opacity-50"
                  onClick={() => update(type as 'adults' | 'children' | 'infants', -1)}
                  disabled={value[type as 'adults' | 'children' | 'infants'] <= min}
                  aria-label={`Decrease ${label}`}
                >−</button>
                <span className="w-8 text-center font-semibold text-xl">{value[type as 'adults' | 'children' | 'infants']}</span>
                <button
                  className="w-8 h-8 rounded-full bg-[#FD7300] text-white flex items-center justify-center transition"
                  onClick={() => update(type as 'adults' | 'children' | 'infants', 1)}
                  aria-label={`Increase ${label}`}
                >+</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#1A2B49] mb-2">Class</label>
            <select
              value={value.classType}
              onChange={e => onChange({ ...value, classType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FD7300] focus:border-transparent"
            >
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
              <option value="Premium Economy">Premium Economy</option>
            </select>
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default PassengersDropdown;
