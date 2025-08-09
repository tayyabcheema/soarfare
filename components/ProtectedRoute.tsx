import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { PageLoader } from './ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  redirectIfAuthenticated?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
  requireAuth = true,
  redirectIfAuthenticated = false
}) => {
  const { isAuthenticated, isLoading, setRedirectPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to load

    // Handle redirectIfAuthenticated first (for login/register pages)
    if (redirectIfAuthenticated && isAuthenticated) {
      router.push('/dashboard');
      return;
    }

    // Handle requireAuth (for protected pages)
    if (requireAuth && !redirectIfAuthenticated && !isAuthenticated) {
      setRedirectPath(router.asPath);
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, isLoading, router, redirectTo, requireAuth, redirectIfAuthenticated, setRedirectPath]);

  // Show loader while checking auth state
  if (isLoading) {
    return <PageLoader message="Checking authentication..." showOverlay={true} />;
  }

  // For pages that redirect authenticated users (login/register)
  if (redirectIfAuthenticated) {
    if (isAuthenticated) {
      return <PageLoader message="Redirecting to dashboard..." showOverlay={true} />;
    }
    // Not authenticated, show the page (login/register)
    return <>{children}</>;
  }

  // For pages that require authentication (dashboard)
  if (requireAuth && !isAuthenticated) {
    return <PageLoader message="Redirecting to login..." showOverlay={true} />;
  }

  return <>{children}</>;
};

// Higher-order component for protecting pages
export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    requireAuth?: boolean;
    redirectTo?: string;
    redirectIfAuthenticated?: boolean;
  } = {}
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    return (
      <ProtectedRoute
        requireAuth={options.requireAuth}
        redirectTo={options.redirectTo}
        redirectIfAuthenticated={options.redirectIfAuthenticated}
      >
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };

  WithAuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithAuthComponent;
};

export default ProtectedRoute;
