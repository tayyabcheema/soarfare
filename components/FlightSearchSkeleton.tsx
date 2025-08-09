import React from 'react';

const FlightSearchSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Search Form Skeleton */}
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Message */}
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto"></div>
        <p className="text-gray-600 mt-4 text-lg">Searching for the best flights...</p>
        <p className="text-gray-500 text-sm">This may take a few moments</p>
      </div>

      {/* Flight Cards Skeleton */}
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Airline Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>

            {/* Flight Details */}
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

            {/* Price and Button */}
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
  );
};

export default FlightSearchSkeleton;
