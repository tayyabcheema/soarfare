import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-orange-500',
  white: 'text-white',
  gray: 'text-gray-500'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      <svg 
        className="animate-spin w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay: React.FC<{ isVisible: boolean; message?: string }> = ({ 
  isVisible, 
  message = 'Loading...' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-700 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Modern rotating circle loader component
export const ModernLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'lg' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`${sizeMap[size]} relative`}>
      {/* Main rotating circle */}
      <div 
        className={`${sizeMap[size]} rounded-full border-4 border-transparent animate-spin`}
        style={{
          background: 'conic-gradient(from 0deg, #FD7300, #F27709, #FD7300, transparent)',
          animationDuration: '1s',
          animationTimingFunction: 'linear'
        }}>
      </div>
      
      {/* Inner circle to create ring effect */}
      <div className={`absolute inset-3 rounded-full bg-white`}></div>
    </div>
  );
};

// Page loading component with blur overlay
export const PageLoader: React.FC<{ message?: string; showOverlay?: boolean }> = ({ 
  message = 'Loading...', 
  showOverlay = false 
}) => {
  if (showOverlay) {
    return (
      <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 animate-fade-in">
          <div className="text-center">
            <ModernLoader size="lg" />
            <div className="mt-6">
              <p className="text-gray-600 font-medium">{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <ModernLoader size="lg" />
        <div className="mt-8">
          <p className="text-white font-medium text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Button loading state
export const ButtonLoader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <LoadingSpinner size={size} color="white" className="mr-2" />
);

export default LoadingSpinner;
