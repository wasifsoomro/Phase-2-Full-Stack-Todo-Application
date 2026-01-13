'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardContent from '@/components/dashboard/home-content';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If authenticated, redirect to tasks page
    if (!isLoading && isAuthenticated) {
      router.replace('/tasks');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, we should have redirected, but if for some reason we're still here
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show public home content for unauthenticated users
  return <DashboardContent />;
}