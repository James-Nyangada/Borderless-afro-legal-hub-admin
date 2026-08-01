'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { ShieldAlert } from 'lucide-react';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_authenticated');
    if (!token) {
      setIsAuthorized(false);
      router.replace('/admin/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Loading state while checking authentication
  if (isAuthorized === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-navy">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy border-t-gold"></div>
          <span className="text-sm font-medium text-gray-600">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  // If not authorized, return loading / redirecting screen to prevent flash
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 text-navy">
        <div className="flex flex-col items-center gap-3">
          <ShieldAlert className="h-8 w-8 text-gold" />
          <span className="text-sm font-medium text-gray-600">Unauthorized. Redirecting to Login...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden bg-gray-50 w-full relative">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
