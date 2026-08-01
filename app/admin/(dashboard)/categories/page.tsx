"use client";

import { useState, useEffect } from 'react';
import { Edit, Trash2, X } from 'lucide-react';
import { fetchAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const COLORS = ['bg-navy', 'bg-gold', 'bg-blue-500', 'bg-green-500', 'bg-purple-500'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('bg-navy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetchAPI('/categories');
      setCategories(res.data.categories);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    try {
      setIsSubmitting(true);
      if (editingId) {
        await fetchAPI(`/categories/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({ name, description, color })
        });
      } else {
        await fetchAPI('/categories', {
          method: 'POST',
          body: JSON.stringify({ name, description, color })
        });
      }
      
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setColor(category.color || 'bg-navy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      await fetchAPI(`/categories/${id}`, {
        method: 'DELETE'
      });
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setColor('bg-navy');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy">Categories</h1>
        <p className="mt-2 text-sm text-gray-700">
          Manage the categories used to organize your blog posts.
        </p>
      </div>

      {/* Add/Edit Category Form */}
      <Card className="shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4 mb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-medium text-navy">
            {editingId ? 'Edit Category' : 'Add New Category'}
          </CardTitle>
          {editingId && (
            <Button
              variant="ghost"
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600 flex items-center h-8 px-2"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel Edit
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    required
                    placeholder="e.g. Design"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Color Tag</Label>
                  <div className="flex gap-3 pt-1">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`h-8 w-8 rounded-full ${c} transition-all ${color === c ? 'ring-2 ring-offset-2 ring-navy scale-110 shadow-md' : 'border border-gray-200 hover:scale-105'}`}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Brief description of the category..."
                ></textarea>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-navy hover:bg-navy/90 text-white"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Update Category' : 'Save Category'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl overflow-hidden max-h-[400px]">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No category added yet.</div>
        ) : (
          <div className="overflow-y-auto max-h-[400px]">
            <Table>
              <TableHeader className="bg-gray-50/50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="pl-4 sm:pl-8">Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="text-right pr-4 sm:pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: any) => (
                  <TableRow key={category._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="pl-4 sm:pl-8 font-medium">
                      <div className="flex items-center">
                        <span className={`h-3 w-3 rounded-full ${category.color || 'bg-gray-300'} mr-3`} aria-hidden="true"></span>
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-xs truncate">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal text-xs bg-gray-100 text-gray-800">
                        {category.postsCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-4 sm:pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 text-navy hover:text-gold hover:bg-transparent"
                          title="Edit Category"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit {category.name}</span>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category._id, category.name)}
                          className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-transparent"
                          title="Delete Category"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete {category.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
