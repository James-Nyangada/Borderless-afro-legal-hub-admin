'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, XCircle, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Comment {
  _id: string;
  name: string;
  email: string;
  text: string;
  post: {
    _id: string;
    title: string;
  };
  createdAt: string;
  status: 'approved' | 'hidden';
  reports: number;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Status');
  const [search, setSearch] = useState('');

  const fetchComments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/comments/admin`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'hidden') => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/comments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        // Optimistic update
        setComments(comments.map(c => c._id === id ? { ...c, status, reports: status === 'approved' ? 0 : c.reports } : c));
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/comments/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setComments(comments.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Error deleting comment', error);
    }
  };

  const filteredComments = comments.filter(c => {
    if (filter === 'Reported' && c.reports === 0) return false;
    if (filter === 'Approved' && c.status !== 'approved') return false;
    if (filter === 'Hidden' && c.status !== 'hidden') return false;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      return c.name.toLowerCase().includes(lowerSearch) || 
             c.email.toLowerCase().includes(lowerSearch) || 
             c.text.toLowerCase().includes(lowerSearch);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Comments Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Review, moderate, and reply to comments left on your blog posts.
          </p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-4 sm:px-6 border-b border-gray-100 gap-4">
          <div className="relative flex-1 max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              className="pl-9"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading comments...</div>
        ) : filteredComments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No comments found.</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-100">
            {filteredComments.map((comment) => (
              <li key={comment._id} className={`p-6 transition-colors ${comment.reports > 0 && comment.status === 'approved' ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}`}>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-navy">{comment.name}</span>
                        <a href={`mailto:${comment.email}`} className="text-sm text-gray-500 hover:text-gold transition-colors">
                          ({comment.email})
                        </a>
                        {comment.reports > 0 && comment.status === 'approved' && (
                          <Badge variant="destructive" className="font-normal px-2 py-0.5 text-xs flex gap-1 items-center bg-red-100 text-red-800 hover:bg-red-100">
                            <AlertTriangle className="h-3 w-3" />
                            {comment.reports} Reports
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-3 bg-white p-3 rounded-lg border ${comment.status === 'hidden' ? 'text-gray-400 italic border-dashed' : 'text-gray-800 border-gray-100'}`}>
                      {comment.text}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">In response to:</span>
                      <span className="text-navy font-medium truncate max-w-md">
                        {comment.post?.title || 'Unknown Post'}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:w-48 sm:border-l sm:border-gray-100 sm:pl-6">
                    <div className="mb-2">
                      <Badge 
                        variant={comment.status === 'approved' ? 'default' : 'secondary'}
                        className={
                          comment.status === 'approved' ? 'bg-green-100 text-green-800 hover:bg-green-200 font-normal border-none' : 
                          'bg-gray-100 text-gray-700 hover:bg-gray-200 font-normal border-none'
                        }
                      >
                        {comment.status.charAt(0).toUpperCase() + comment.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {comment.status === 'hidden' ? (
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(comment._id, 'approved')}
                          title="Approve / Show" 
                          className="h-8 w-8 text-gray-400 hover:text-green-600 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUpdateStatus(comment._id, 'hidden')}
                          title="Hide / Reject" 
                          className="h-8 w-8 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50"
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(comment._id)}
                        title="Delete" 
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
