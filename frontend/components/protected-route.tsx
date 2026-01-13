'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setCheckedAuth(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // If still loading auth status, show loading state
  if (isLoading || !checkedAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Checking authentication status"
      >
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated after check, show redirecting message
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        role="status"
        aria-label="Redirecting to login"
      >
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}