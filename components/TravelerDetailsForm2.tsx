import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface TravelerDetailsFormProps {
  onBack: () => void;
  onSubmit: (formData: TravelerFormData) => void;
}

interface TravelerDetails {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  issuingCountry: string;
  passportExpiry: string;
}

interface TravelerFormData {
  contactDetails: {
    email: string;
    phoneCode: string;
    phoneNumber: string;
  };
  travelers: {
    adults: TravelerDetails[];
    children: TravelerDetails[];
    infants: TravelerDetails[];
  };
}

const emptyTravelerDetails: TravelerDetails = {
  title: 'Mr',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  nationality: '',
  passportNumber: '',
  issuingCountry: '',
  passportExpiry: '',
};

const TravelerDetailsForm: React.FC<TravelerDetailsFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState<TravelerFormData>({
    contactDetails: {
      email: '',
      phoneCode: '',
      phoneNumber: '',
    },
    travelers: {
      adults: [{ ...emptyTravelerDetails }],
      children: [],
      infants: [],
    }
  });

  const handleContactDetailsChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value,
      },
    }));
  };

  const handleTravelerDetailsChange = (
    type: 'adults' | 'children' | 'infants',
    index: number,
    field: keyof TravelerDetails,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: prev.travelers[type].map((traveler, i) => 
          i === index ? { ...traveler, [field]: value } : traveler
        ),
      },
    }));
  };

  const addTraveler = (type: 'adults' | 'children' | 'infants') => {
    setFormData(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: [...prev.travelers[type], { ...emptyTravelerDetails }],
      },
    }));
  };

  const removeTraveler = (type: 'adults' | 'children' | 'infants', index: number) => {
    setFormData(prev => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: prev.travelers[type].filter((_, i) => i !== index),
      },
    }));
  };

  const renderTravelerForm = (
    type: 'adults' | 'children' | 'infants',
    index: number,
    traveler: TravelerDetails,
    title: string
  ) => (
    <div key={`${type}-${index}`} className="mb-8 p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title} {index + 1}</h2>
        {index > 0 && (
          <button
            type="button"
            onClick={() => removeTraveler(type, index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <select
            value={traveler.title}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'title', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="Mr">Mr</option>
            <option value="Mrs">Mrs</option>
            <option value="Ms">Ms</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">First Name</label>
          <input
            type="text"
            value={traveler.firstName}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'firstName', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Last Name</label>
          <input
            type="text"
            value={traveler.lastName}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'lastName', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Date of Birth</label>
          <input
            type="date"
            value={traveler.dateOfBirth}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'dateOfBirth', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Nationality</label>
          <select
            value={traveler.nationality}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'nationality', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            {/* Add more countries */}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Passport Number</label>
          <input
            type="text"
            value={traveler.passportNumber}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'passportNumber', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Issuing Country</label>
          <select
            value={traveler.issuingCountry}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'issuingCountry', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            {/* Add more countries */}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Passport Expiry</label>
          <input
            type="date"
            value={traveler.passportExpiry}
            onChange={(e) => handleTravelerDetailsChange(type, index, 'passportExpiry', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Add Travelers Details</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Contact Details Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Contact Details:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={formData.contactDetails.email}
                onChange={(e) => handleContactDetailsChange('email', e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/3">
                <label className="block text-sm mb-1">Code</label>
                <select
                  value={formData.contactDetails.phoneCode}
                  onChange={(e) => handleContactDetailsChange('phoneCode', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+91">+91</option>
                  {/* Add more country codes */}
                </select>
              </div>
              <div className="w-2/3">
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactDetails.phoneNumber}
                  onChange={(e) => handleContactDetailsChange('phoneNumber', e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Adult Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Adults</h2>
            <button
              type="button"
              onClick={() => addTraveler('adults')}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Adult
            </button>
          </div>
          {formData.travelers.adults.map((traveler, index) => 
            renderTravelerForm('adults', index, traveler, 'Adult')
          )}
        </div>

        {/* Children Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Children (2-11 years)</h2>
            <button
              type="button"
              onClick={() => addTraveler('children')}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Child
            </button>
          </div>
          {formData.travelers.children.map((traveler, index) => 
            renderTravelerForm('children', index, traveler, 'Child')
          )}
        </div>

        {/* Infants Details Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Infants (under 2 years)</h2>
            <button
              type="button"
              onClick={() => addTraveler('infants')}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Infant
            </button>
          </div>
          {formData.travelers.infants.map((traveler, index) => 
            renderTravelerForm('infants', index, traveler, 'Infant')
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelerDetailsForm;
