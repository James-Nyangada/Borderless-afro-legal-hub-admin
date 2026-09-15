'use client';

import { ArrowLeft, Save, UploadCloud, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { fetchAPI, API_URL } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [featuredImages, setFeaturedImages] = useState<string[]>([]);

  const isInitialRender = useRef(true);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchAPI('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
    loadPost();
  }, [id]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const loadPost = async () => {
    try {
      const res = await fetchAPI(`/posts/${id}`);
      const post = res.data.post;
      setTitle(post.title || '');
      
      const unescapeHTML = (str: string) => {
        if (!str) return '';
        return str
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&#x2F;/g, '/');
      };
      setContent(unescapeHTML(post.content || ''));
      setExcerpt(post.excerpt || '');
      setStatus(post.status || 'draft');
      setAuthor(post.author || 'Admin');
      if (post.publishDate) {
        const date = new Date(post.publishDate);
        setPublishDate(date.toISOString().slice(0, 16));
      }
      if (post.categories) {
        setSelectedCategories(post.categories.map((c: any) => typeof c === 'string' ? c : c._id));
      }
      if (post.tags) {
        setTags(Array.isArray(post.tags) ? post.tags.join(', ') : post.tags);
      }
      if (post.featuredImages) {
        setFeaturedImages(post.featuredImages);
      }
    } catch (err: any) {
      toast.error('Failed to load post: ' + err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (!title && !content) return;

    typingTimeoutRef.current = setTimeout(async () => {
      const payload = {
        title: title || 'Untitled Draft',
        content: content || '...',
        excerpt,
        status, 
        publishDate: publishDate || null,
        author: author || 'Admin',
        featuredImages,
        categories: selectedCategories,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      try {
        await fetchAPI(`/posts/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        toast.success('Draft saved automatically', { position: 'bottom-right' });
      } catch (err) {
        toast.error('Auto-save failed', { position: 'bottom-right' });
      }
    }, 2000);
    
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [title, content, excerpt, status, publishDate, author, selectedCategories, tags, featuredImages, id]);

  const handleSave = async () => {
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }
    
    setLoading(true);
    try {
      await fetchAPI(`/posts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status,
          publishDate: publishDate || null,
          author: author || 'Admin',
          featuredImages,
          categories: selectedCategories,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      toast.success('Post updated successfully!');
      router.push('/admin/posts');
    } catch (err: any) {
      toast.error('Failed to update post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newUrls: string[] = [];
    const toastId = toast.loading('Uploading images...');
    
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/media`, {
          method: 'POST',
          body: formData,
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (!res.ok) throw new Error('Failed to upload image');
        const data = await res.json();
        newUrls.push(data.data.media.url);
      }
      
      setFeaturedImages(prev => [...prev, ...newUrls]);
      toast.success('Images uploaded successfully', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Error uploading images', { id: toastId });
    }
  };

  if (fetching) {
    return <div className="text-center py-12">Loading post...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-navy">Edit Post</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-navy border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy-2 transition-colors shadow-sm disabled:opacity-70"
          >
            <Save className="h-4 w-4 text-gold" />
            {loading ? 'Saving...' : 'Update Post'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy sm:text-lg sm:leading-6"
                  placeholder="e.g., Understanding Intellectual Property in Africa"
                />
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt / Summary</label>
                <p className="text-xs text-gray-500 mb-2">A short summary used on blog listing cards.</p>
                <textarea
                  id="excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-1 block w-full rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy sm:text-sm sm:leading-6"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content <span className="text-xs text-gray-500 font-normal ml-1">(Skip a line to create a new paragraph and leave a space)</span></label>
                <RichTextEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl p-6">
            <h3 className="text-base font-semibold text-navy mb-4 border-b border-gray-100 pb-2">Publishing</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-1">Publish Date & Time</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="datetime-local"
                      id="publish_date"
                      value={publishDate}
                      onChange={(e) => setPublishDate(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl p-6">
            <h3 className="text-base font-semibold text-navy mb-4 border-b border-gray-100 pb-2">Category</h3>
            <div className="space-y-4">
              <div>
                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">No categories found.</p>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat._id} className="flex items-center">
                        <input
                          id={`cat-${cat._id}`}
                          type="checkbox"
                          checked={selectedCategories.includes(cat._id)}
                          onChange={() => toggleCategory(cat._id)}
                          className="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                        />
                        <label htmlFor={`cat-${cat._id}`} className="ml-2 text-sm text-gray-700">
                          {cat.name}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-navy sm:text-sm sm:leading-6"
                  placeholder="e.g. patent, ip, tech"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl p-6">
            <h3 className="text-base font-semibold text-navy mb-4 border-b border-gray-100 pb-2">Featured Images</h3>
            <label className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <span className="relative rounded-md font-semibold text-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-navy focus-within:ring-offset-2 hover:text-navy-2">
                    Upload images
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    multiple
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                  />
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
              </div>
            </label>

            {featuredImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {featuredImages.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-md overflow-hidden ring-1 ring-gray-200">
                    <img src={url} alt={`Featured ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setFeaturedImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
