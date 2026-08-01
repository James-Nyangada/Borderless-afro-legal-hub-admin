'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Folder, 
  Image as ImageIcon, 
  MessageSquare, 
  Users, 
  File, 
  Settings,
  BarChart,
  LogOut,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'Categories', href: '/admin/categories', icon: Folder },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { name: 'Subscribers', href: '/admin/subscribers', icon: Users },
  { name: 'Pages', href: '/admin/pages', icon: File },
  // { name: 'Team', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [reportedCount, setReportedCount] = useState(0);

  useEffect(() => {
    // Fetch reported comments count
    const fetchReportedCount = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/comments/admin/reported-count`);
        if (res.ok) {
          const data = await res.json();
          setReportedCount(data.data.count);
        }
      } catch (error) {
        console.error('Failed to fetch reported comments count', error);
      }
    };
    
    fetchReportedCount();
    // Poll every 30 seconds
    const interval = setInterval(fetchReportedCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin_authenticated');
    window.location.href = '/admin/login';
  };

  return (
    <Sidebar className="border-r border-gray-200 dark:border-navy-2">
      <SidebarHeader className="border-b border-gray-200 dark:border-navy-2 px-6 h-16 flex items-center justify-center bg-navy text-white">
        <Link href="/admin" className="flex items-center gap-2 w-full">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white text-navy">
            <Zap className="h-5 w-5 fill-current text-gold" />
          </div>
          <span className="text-xl font-bold text-white">Admin UI</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-navy text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} className={clsx(
                      "group transition-colors h-10 hover:bg-navy-2 hover:text-white", 
                      isActive ? "bg-navy-2 text-white" : "text-gray-300"
                    )}>
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <item.icon className={clsx("h-5 w-5 mr-3 transition-colors", isActive ? "text-gold" : "text-gray-400 group-hover:text-gold")} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    {item.name === 'Comments' && reportedCount > 0 && (
                      <SidebarMenuBadge className="bg-red-500 text-white rounded-full px-2 py-0.5">{reportedCount}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-navy text-white border-t border-navy-2 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="group hover:bg-navy-2 hover:text-white text-gray-300 h-10 transition-colors">
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gold transition-colors" />
              <span className="font-medium text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
