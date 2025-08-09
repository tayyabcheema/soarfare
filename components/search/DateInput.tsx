import React, { useState } from 'react';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  error?: string;
}

const formatDateDisplay = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long' });
};
const getDayName = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: 'long' });
};

const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, minDate, error }) => {
  const [showPicker, setShowPicker] = useState(false);
  const today = new Date();
  const min = minDate ? new Date(minDate) : today;

  return (
    <div className="space-y-1 relative">
      <label className="text-sm font-semibold text-[#1A2B49]">{label}</label>
      <div
        className="border border-gray-200 rounded-xl p-4 cursor-pointer bg-[#F8F8F8] hover:border-[#FD7300] transition-colors focus-within:border-[#FD7300]"
        tabIndex={0}
        onClick={() => setShowPicker(true)}
      >
        <div className="font-semibold text-xl text-[#1A2B49]">{formatDateDisplay(value)}</div>
        <div className="text-sm text-[#1A2B49] opacity-70">{getDayName(value)}</div>
      </div>
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-80 relative" onClick={e => e.stopPropagation()}>
            <input
              type="date"
              value={value}
              min={min.toISOString().split('T')[0]}
              onChange={e => { onChange(e.target.value); setShowPicker(false); }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FD7300] focus:border-transparent"
              autoFocus
            />
            <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl" onClick={() => setShowPicker(false)} aria-label="Close">✖</button>
          </div>
        </div>
      )}
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default DateInput;
