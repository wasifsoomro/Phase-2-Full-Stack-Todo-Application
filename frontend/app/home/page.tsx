import DashboardContent from '@/components/dashboard/home-content';

// Server component - doesn't need to check authentication since that's handled client-side
export default function HomePage() {
  return <DashboardContent />;
}