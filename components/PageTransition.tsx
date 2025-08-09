import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PageLoader } from './ui/LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setIsVisible(false);
    };

    const handleComplete = () => {
      setIsLoading(false);
      setTimeout(() => setIsVisible(true), 50); // Small delay for smooth transition
    };

    // Set initial visibility
    setIsVisible(true);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  if (isLoading) {
    return <PageLoader message="Loading page..." showOverlay={true} />;
  }

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
