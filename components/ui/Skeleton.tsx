import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = false,
  animation = 'pulse'
}) => {
  const animationClass = animation === 'pulse' ? 'animate-pulse' : 'animate-wave';
  const roundedClass = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <div 
      className={`bg-gray-200 ${width} ${height} ${roundedClass} ${animationClass} ${className}`}
    />
  );
};

// Card Skeleton Component
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
    <div className="animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton width="w-12" height="h-12" rounded />
        <div className="flex-1">
          <Skeleton width="w-3/4" height="h-4" className="mb-2" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton height="h-3" />
        <Skeleton height="h-3" width="w-5/6" />
        <Skeleton height="h-3" width="w-4/6" />
      </div>
    </div>
  </div>
);

// Table Skeleton Component
export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    {/* Header */}
    <div className="bg-gray-50 px-6 py-4 border-b">
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} width="flex-1" height="h-4" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} width="flex-1" height="h-4" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Dashboard Overview Skeleton
export const SkeletonDashboard: React.FC = () => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <Skeleton width="w-8" height="h-8" rounded />
              <Skeleton width="w-16" height="h-6" />
            </div>
            <Skeleton width="w-full" height="h-8" className="mb-2" />
            <Skeleton width="w-3/4" height="h-4" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Chart/Content Areas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard className="h-64" />
      <SkeletonCard className="h-64" />
    </div>
  </div>
);

// Flight Search Results Skeleton
export const SkeletonFlightResults: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Skeleton width="w-12" height="h-12" rounded />
              <div>
                <Skeleton width="w-24" height="h-5" className="mb-1" />
                <Skeleton width="w-16" height="h-4" />
              </div>
            </div>
            <div className="text-right">
              <Skeleton width="w-20" height="h-6" className="mb-1" />
              <Skeleton width="w-16" height="h-4" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <Skeleton width="w-16" height="h-5" className="mb-1" />
                <Skeleton width="w-12" height="h-4" />
              </div>
              <Skeleton width="w-8" height="h-8" />
              <div>
                <Skeleton width="w-16" height="h-5" className="mb-1" />
                <Skeleton width="w-12" height="h-4" />
              </div>
            </div>
            <Skeleton width="w-24" height="h-10" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Blog List Skeleton
export const SkeletonBlogList: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="animate-pulse">
          <Skeleton width="w-full" height="h-48" />
          <div className="p-6">
            <Skeleton width="w-3/4" height="h-6" className="mb-3" />
            <div className="space-y-2 mb-4">
              <Skeleton height="h-4" />
              <Skeleton height="h-4" width="w-5/6" />
              <Skeleton height="h-4" width="w-4/6" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton width="w-20" height="h-4" />
              <Skeleton width="w-16" height="h-4" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Page Layout Skeleton
export const SkeletonPageLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm border-b">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton width="w-32" height="h-8" />
          <div className="flex items-center space-x-4">
            <Skeleton width="w-8" height="h-8" rounded />
            <Skeleton width="w-24" height="h-8" />
          </div>
        </div>
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {children || (
        <div className="space-y-6">
          <Skeleton width="w-64" height="h-8" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
    </div>
  </div>
);

export default Skeleton;
