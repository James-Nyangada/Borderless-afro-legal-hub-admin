'use client';

import { Search, Download, UserPlus, MoreVertical, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/subscribers');
      setSubscribers(res.data.subscribers || []);
    } catch (err: any) {
      setError('Failed to load subscribers');
      toast.error('Failed to load subscribers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to unsubscribe this user?')) return;
    
    try {
      await fetchAPI('/subscribers/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success('User unsubscribed successfully');
      loadSubscribers();
    } catch (err: any) {
      toast.error('Failed to unsubscribe: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Newsletter Subscribers</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all users subscribed to the newsletter. Total: {subscribers.length}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-3">
          <Button variant="outline" className="text-navy shadow-sm border-gray-200">
            <Download className="-ml-1 mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
            Export CSV
          </Button>
          <Button className="bg-navy hover:bg-navy/90 text-white shadow-sm">
            <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Subscriber
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:px-6 border-b border-gray-100 gap-4">
          <div className="relative flex-1 max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              name="search"
              id="search"
              className="pl-9"
              placeholder="Search by email..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="All Status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-12 px-6">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy" />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">Loading subscribers...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-red-500">{error}</TableCell></TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-8 text-center text-gray-500">No subscribers found.</TableCell></TableRow>
              ) : subscribers.map((subscriber) => (
                <TableRow key={subscriber._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-6">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy" />
                  </TableCell>
                  <TableCell className="font-medium text-navy">
                    {subscriber.email}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {subscriber.source}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                      className={
                        subscriber.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 
                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    >
                      {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(subscriber.email)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-transparent">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Unsubscribe {subscriber.email}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(subscriber.email)}>
                            Unsubscribe
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
