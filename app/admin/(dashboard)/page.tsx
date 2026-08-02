'use client';

import { FileText, Users, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardHome() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await fetchAPI('/dashboard');
        setDashboardData(data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'Total Published Posts', stat: dashboardData?.stats.totalPublishedPosts || '0', icon: FileText, highlight: false },
    { name: 'Total Draft Posts', stat: dashboardData?.stats.totalDraftPosts || '0', icon: FileText, highlight: false },
    { name: 'Total Subscribers', stat: dashboardData?.stats.totalSubscribers || '0', icon: Users, highlight: false },
    { name: 'Contact Form Submissions', stat: dashboardData?.stats.contactFormSubmissions || '0', icon: Mail, highlight: true },
  ];

  const recentActivity = dashboardData?.recentActivity || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-navy">Dashboard Overview</h1>
        <div className="flex gap-3">
          <Button asChild className="bg-navy hover:bg-navy/90 text-white shadow-sm">
            <Link href="/admin/posts/new">New Post</Link>
          </Button>
          <Button asChild variant="outline" className="shadow-sm border-gray-200 text-navy hover:bg-gray-50 hover:text-navy">
            <Link href="/admin/contact">View Messages</Link>
          </Button>
          <Button asChild variant="outline" className="shadow-sm border-gray-200 text-navy hover:bg-gray-50 hover:text-navy">
            <Link href="/admin/subscribers">View Subscribers</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.name} className={item.highlight ? 'border-gold ring-1 ring-gold/50 shadow-md' : 'shadow-sm'}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">{item.name}</CardTitle>
              <div className={`rounded-md p-2 ${item.highlight ? 'bg-gold' : 'bg-navy/5'}`}>
                <item.icon className={`h-4 w-4 ${item.highlight ? 'text-white' : 'text-navy'}`} aria-hidden="true" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-2"></div>
              ) : (
                <div className="text-2xl font-bold text-navy mt-1">{item.stat}</div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                <a href="#" className="font-medium text-navy hover:text-gold transition-colors">
                  View all stats
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg text-navy">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul role="list" className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {isLoading ? (
                <li className="px-6 py-5">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </li>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity: any) => (
                  <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-5 text-sm text-gray-500 text-center">No recent activity</li>
              )}
            </ul>
          </CardContent>
          <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 rounded-b-xl">
            <a href="#" className="text-sm font-medium text-navy hover:text-gold transition-colors flex items-center gap-1">
              View all activity <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </Card>

        {/* Traffic Snapshot */}
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg text-navy">Traffic Snapshot (This Week)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Visits</p>
                <p className="text-3xl font-bold tracking-tight text-navy">12,450</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12% vs last week
              </Badge>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 mb-4">Top Articles</p>
              <ul className="space-y-4">
                <li className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">Breaking Into Product Design...</span>
                  <span className="text-sm font-semibold text-navy">4,230 views</span>
                </li>
                <li className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">The Future of AI in Legal Tech</span>
                  <span className="text-sm font-semibold text-navy">3,100 views</span>
                </li>
                <li className="flex items-center justify-between group cursor-pointer">
                  <span className="text-sm text-gray-600 group-hover:text-navy transition-colors">Navigating Cross-Border M&A...</span>
                  <span className="text-sm font-semibold text-navy">2,850 views</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
