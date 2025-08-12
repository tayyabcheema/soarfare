import React from 'react';

interface PointsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCard: () => void;
  onInputNewCard: () => void;
  currentPoints: number;
  requiredPoints: number;
  pointsNeeded: number;
  purchaseAmount: number;
}

const PointsPurchaseModal: React.FC<PointsPurchaseModalProps> = ({
  isOpen,
  onClose,
  onUseCard,
  onInputNewCard,
  currentPoints,
  requiredPoints,
  pointsNeeded,
  purchaseAmount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-md w-full p-6 overflow-hidden">
          {/* Logo */}
          <div className="bg-[#4A90E2] -mx-6 -mt-6 p-6 mb-6">
            <div className="flex justify-center">
              <img src="/logo.png" alt="SoarFare" className="h-8" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="text-[#2A2B3C] mb-6">
              <p>You currently have <span className="font-bold">{currentPoints}</span> points in your account and further need <span className="font-bold">{pointsNeeded}</span> points to book this trip, you can purchase those points for <span className="font-bold">${purchaseAmount}</span>.</p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Click the "Instant Purchase" button to proceed with transaction.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={onUseCard}
                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Use Card On File
              </button>
              
              <button
                onClick={onInputNewCard}
                className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Input New Card
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 px-4 bg-gray-500 rounded-xl text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsPurchaseModal;
