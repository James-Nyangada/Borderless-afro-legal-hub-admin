'use client';

import { Search, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
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

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const [res, viewsRes, catRes] = await Promise.all([
        fetchAPI('/posts'),
        fetch('/api/views').then(r => r.json()).catch(() => ({ views: {} })),
        fetchAPI('/categories').catch(() => ({ data: { categories: [] } }))
      ]);
      const postsWithViews = res.data.posts.map((post: any) => ({
        ...post,
        viewCount: viewsRes.views[post.slug] || 0
      }));
      setPosts(postsWithViews);
      setCategories(catRes.data?.categories || []);
    } catch (err: any) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await fetchAPI(`/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p._id !== id));
    } catch (err: any) {
      toast.error('Failed to delete post: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Posts</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all blog posts including their title, category, status, and views.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button asChild className="bg-navy hover:bg-navy/90 text-white shadow-sm">
            <Link href="/admin/posts/new">
              <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Post
            </Link>
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
              placeholder="Search posts..."
            />
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="All Categories">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat._id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="All Status">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
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
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">Loading posts...</TableCell></TableRow>
              ) : error ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-red-500">{error}</TableCell></TableRow>
              ) : posts.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="py-8 text-center text-gray-500">No posts found.</TableCell></TableRow>
              ) : posts.map((post) => (
                <TableRow key={post._id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="px-6">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy" />
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {post.categories && post.categories.length > 0 ? post.categories[0].name : 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}
                      className={
                        post.status === 'published' ? 'bg-green-500 hover:bg-green-600' : 
                        post.status === 'draft' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 
                        'bg-blue-100 text-blue-700 hover:bg-blue-200 border-none'
                      }
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{post.author || 'Unknown'}</TableCell>
                  <TableCell className="text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-gray-500">{post.viewCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-navy hover:text-gold hover:bg-transparent">
                        <Link href={`/admin/posts/edit/${post._id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit {post.title}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(post._id)} className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-transparent">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {post.title}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-transparent">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More options for {post.title}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/edit/${post._id}`}>Edit Post</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(post._id)}>
                            Delete
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
        <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 rounded-b-xl">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">42</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-navy px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">1</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">3</a>
                <a href="#" className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
