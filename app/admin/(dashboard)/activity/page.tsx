'use client';

import { Activity, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ActivityItem {
  id: string;
  type: string;
  text: string;
  time: string;
  createdAt: string;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);

  useEffect(() => {
    loadActivities(page);
  }, [page]);

  const loadActivities = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/dashboard/activities?page=${currentPage}&limit=20`);
      setActivities(res.data.activities || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalActivities(res.data.total || 0);
    } catch (err: unknown) {
      setError('Failed to load activities');
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error('Failed to load activities: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'comment':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'subscriber':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-200';
      case 'submission':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Activity Log</h1>
          <p className="mt-2 text-sm text-gray-700">
            A detailed list of all system activities. Total: {totalActivities}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Button variant="outline" className="text-navy shadow-sm border-gray-200" onClick={() => loadActivities(page)}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-12 px-6">
                  <Activity className="h-4 w-4 text-gray-500" />
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Time Ago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">Loading activities...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-red-500">{error}</TableCell></TableRow>
              ) : activities.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-gray-500">No activities found.</TableCell></TableRow>
              ) : activities.map((activity) => (
                <TableRow key={activity.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-6">
                    <div className="h-2 w-2 rounded-full bg-navy" />
                  </TableCell>
                  <TableCell className="font-medium text-navy">
                    {activity.text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getTypeColor(activity.type)}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <span className="sr-only">Previous</span>
                    &lt;
                  </Button>
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    &gt;
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
