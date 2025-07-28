'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthWrapper({ children, requireAuth = true }: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [retryCount, setRetryCount] = useState(0);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isLoaded && requireAuth && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, requireAuth, router]);

  // Show error after timeout if still not loaded (likely configuration issue)
  useEffect(() => {
    if (!isLoaded) {
      const timer = setTimeout(() => {
        setShowError(true);
      }, 10000); // Show error after 10 seconds

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  // Show loading while authentication state is being determined
  if (!isLoaded && !showError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  }

  // Show error if authentication fails to load
  if (!isLoaded && showError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">
            Unable to load authentication. This might be due to missing Clerk configuration or network issues.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-yellow-800 mb-2">Possible solutions:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Check that Clerk environment variables are set in .env.local</li>
              <li>• Ensure your internet connection is working</li>
              <li>• Verify Clerk dashboard configuration</li>
              <li>• Try refreshing the page or restarting the dev server</li>
            </ul>
          </div>

          <button
            onClick={() => {
              setRetryCount(prev => prev + 1);
              setShowError(false);
              window.location.reload();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry ({retryCount > 0 ? `Attempt ${retryCount + 1}` : 'First try'})
          </button>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not signed in, show loading
  // (they will be redirected to sign-in)
  if (requireAuth && !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
