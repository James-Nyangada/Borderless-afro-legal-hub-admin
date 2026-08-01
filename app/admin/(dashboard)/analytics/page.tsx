import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { getDashboardAnalytics } from '@/lib/posthog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default async function AnalyticsPage() {
  const analyticsData = await getDashboardAnalytics();

  const stats = [
    { name: 'Total Page Views', stat: analyticsData.pageviews.toLocaleString(), icon: Eye, change: 'N/A', changeType: 'increase' },
    { name: 'Unique Visitors', stat: analyticsData.visitors.toLocaleString(), icon: Users, change: 'N/A', changeType: 'increase' },
    { name: 'Avg. Session Duration', stat: analyticsData.avgSessionDuration, icon: TrendingUp, change: 'N/A', changeType: 'decrease' },
    { name: 'Bounce Rate', stat: `${analyticsData.bounceRate}%`, icon: BarChart3, change: 'N/A', changeType: 'decrease' },
  ];

  const colors = ['bg-navy', 'bg-gold', 'bg-blue-500', 'bg-purple-500', 'bg-green-500'];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Analytics Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of website traffic, top performing content, and subscriber growth. (Last 30 Days)
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[140px] bg-white font-medium">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild className="bg-navy hover:bg-navy/90 text-white shadow-sm">
            <a
              href="https://us.posthog.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              PostHog Analytics <ExternalLink className="ml-2 h-4 w-4 text-gold" />
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((item) => (
          <Card key={item.name} className="shadow-sm border-gray-100 overflow-hidden relative">
            <CardContent className="p-6">
              <dt>
                <div className="absolute rounded-md bg-navy/5 p-3">
                  <item.icon className="h-6 w-6 text-navy" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-1">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              </dd>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Top Posts */}
        <Card className="shadow-sm border-gray-100 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy">Top Performing Pages</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="pl-6 uppercase text-xs tracking-wider">Page Path</TableHead>
                  <TableHead className="px-6 text-right uppercase text-xs tracking-wider">Views</TableHead>
                  <TableHead className="pr-6 text-right uppercase text-xs tracking-wider">Engagement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData.topPosts.length > 0 ? (
                  analyticsData.topPosts.map((post: any, index: number) => (
                    <TableRow key={index} className="hover:bg-gray-50/50">
                      <TableCell className="pl-6 font-medium text-navy truncate max-w-[200px]">{post.title}</TableCell>
                      <TableCell className="px-6 text-gray-500 text-right">{post.views.toLocaleString()}</TableCell>
                      <TableCell className="pr-6 text-gray-500 text-right">{post.engagement}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="py-8 text-center text-sm text-gray-500">No page view data available yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Traffic Sources */}
        <Card className="shadow-sm border-gray-100 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base font-semibold text-navy">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {analyticsData.trafficSources.length > 0 ? (
                analyticsData.trafficSources.map((source: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{source.source}</span>
                      <span className="text-navy font-semibold">{source.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${colors[index % colors.length]} h-2 rounded-full`} style={{ width: `${source.percentage}%` }}></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">No traffic source data available yet.</div>
              )}
            </div>
            <Card className="mt-8 bg-gray-50 shadow-none border-gray-100">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Users className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">Audience Insights</h4>
                  <p className="text-xs text-gray-500 mt-1">Data is fetched directly from your PostHog analytics for the last 30 days.</p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
