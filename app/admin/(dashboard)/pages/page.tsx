'use client';

import { Edit, Save, Plus, Trash2, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function PagesManagementPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/pages');
      setPages(res.data.pages);
      if (res.data.pages.length > 0) {
        handleSelectPage(res.data.pages[0]);
      }
    } catch (err: any) {
      toast.error('Failed to load pages: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (page: any) => {
    setSelectedPage(page);
    setFormData(page.content || {});
  };

  const handleSave = async () => {
    if (!selectedPage) return;
    try {
      setSaving(true);
      await fetchAPI(`/pages/${selectedPage.identifier}`, {
        method: 'PUT',
        body: JSON.stringify({ content: formData }),
      });
      toast.success('Page updated successfully');
      fetchPages(); // Refresh the list to get updated dates
    } catch (err: any) {
      toast.error('Failed to save page: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Dynamic Array Handlers
  const addArrayItem = (key: string, defaultItem: any) => {
    const currentArray = Array.isArray(formData[key]) ? formData[key] : [];
    setFormData({ ...formData, [key]: [...currentArray, defaultItem] });
  };

  const removeArrayItem = (key: string, index: number) => {
    const currentArray = [...(formData[key] || [])];
    currentArray.splice(index, 1);
    setFormData({ ...formData, [key]: currentArray });
  };

  const updateArrayItem = (key: string, index: number, field: string, value: string) => {
    const currentArray = [...(formData[key] || [])];
    currentArray[index] = { ...currentArray[index], [field]: value };
    setFormData({ ...formData, [key]: currentArray });
  };

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  // Renderers for different pages
  const renderAboutEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Hero Title (Mission Statement)</Label>
        <textarea
          rows={2}
          value={formData.heroTitle || ''}
          onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="space-y-2">
        <Label>Hero Subtitle</Label>
        <textarea
          rows={3}
          value={formData.heroSubtitle || ''}
          onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-navy">Our Values</h3>
          <Button 
            variant="ghost"
            onClick={() => addArrayItem('values', { title: '', description: '' })}
            className="text-navy hover:text-gold hover:bg-transparent px-2 h-8"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Value
          </Button>
        </div>
        <div className="space-y-4">
          {(formData.values || []).map((val: any, index: number) => (
            <Card key={index} className="relative group shadow-sm bg-gray-50/50">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('values', index)}
                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-gray-500">Value Title</Label>
                  <Input
                    type="text"
                    value={val.title || ''}
                    onChange={(e) => updateArrayItem('values', index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-gray-500">Description</Label>
                  <textarea
                    rows={2}
                    value={val.description || ''}
                    onChange={(e) => updateArrayItem('values', index, 'description', e.target.value)}
                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {!(formData.values?.length) && <p className="text-sm text-gray-500 text-center py-4">No values added yet.</p>}
        </div>
      </div>
    </div>
  );

  const renderServicesEditor = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-navy">Services List</h3>
        <Button 
          variant="ghost"
          onClick={() => addArrayItem('services', { title: '', description: '' })}
          className="text-navy hover:text-gold hover:bg-transparent px-2 h-8"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Service
        </Button>
      </div>
      <div className="space-y-4">
        {(formData.services || []).map((service: any, index: number) => (
          <Card key={index} className="relative group shadow-sm bg-gray-50/50">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => removeArrayItem('services', index)}
              className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6 space-y-3">
              <div className="space-y-1">
                <Label className="text-xs uppercase text-gray-500">Service Title</Label>
                <Input
                  type="text"
                  value={service.title || ''}
                  onChange={(e) => updateArrayItem('services', index, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-gray-500">Description</Label>
                <textarea
                  rows={2}
                  value={service.description || ''}
                  onChange={(e) => updateArrayItem('services', index, 'description', e.target.value)}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {!(formData.services?.length) && <p className="text-sm text-gray-500 text-center py-4">No services added yet.</p>}
      </div>
    </div>
  );

  const renderFaqEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Page Subtitle/Intro</Label>
        <textarea
          rows={2}
          value={formData.subtitle || ''}
          onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-navy">FAQ Items (Repeatable Blocks)</h3>
          <Button 
            variant="ghost"
            onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
            className="text-navy hover:text-gold hover:bg-transparent px-2 h-8"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Question
          </Button>
        </div>
        <div className="space-y-4">
          {(formData.faqs || []).map((faq: any, index: number) => (
            <Card key={index} className="relative group shadow-sm bg-gray-50/50">
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => removeArrayItem('faqs', index)}
                className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <CardContent className="pt-6 space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-gray-500">Question</Label>
                  <Input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => updateArrayItem('faqs', index, 'question', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase text-gray-500">Answer</Label>
                  <textarea
                    rows={3}
                    value={faq.answer || ''}
                    onChange={(e) => updateArrayItem('faqs', index, 'answer', e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          {!(formData.faqs?.length) && <p className="text-sm text-gray-500 text-center py-4">No FAQs added yet.</p>}
        </div>
      </div>
    </div>
  );

  const renderPrivacyPolicyEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Privacy Policy Text</Label>
        <RichTextEditor 
          value={formData.text || ''} 
          onChange={(val) => setFormData({ ...formData, text: val })} 
        />
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            type="text"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-medium text-navy">Social Links</h3>
          <Button 
            variant="ghost"
            onClick={() => addArrayItem('socialLinks', { platform: '', url: '' })}
            className="text-navy hover:text-gold hover:bg-transparent px-2 h-8"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Link
          </Button>
        </div>
        <div className="space-y-4">
          {(formData.socialLinks || []).map((link: any, index: number) => (
            <Card key={index} className="bg-gray-50/50 shadow-sm">
              <CardContent className="pt-6 flex gap-4 items-start relative group">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs uppercase text-gray-500">Platform Name (e.g. WhatsApp)</Label>
                  <Input
                    type="text"
                    value={link.platform || ''}
                    onChange={(e) => updateArrayItem('socialLinks', index, 'platform', e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs uppercase text-gray-500">URL</Label>
                  <Input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => updateArrayItem('socialLinks', index, 'url', e.target.value)}
                  />
                </div>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={() => removeArrayItem('socialLinks', index)}
                  className="mt-6 h-8 w-8 text-gray-400 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {!(formData.socialLinks?.length) && <p className="text-sm text-gray-500 text-center py-4">No social links added yet.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Pages Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Edit content for static pages like About, Services, FAQ, Privacy Policy, and Contact.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white shadow-sm ring-1 ring-gray-100 sm:rounded-xl overflow-hidden sticky top-24">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-navy">All Pages</h3>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-2 top-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 py-1 rounded-md border-gray-200 text-sm w-32 focus:ring-navy focus:border-navy"
                />
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-6 w-6 text-navy animate-spin" />
              </div>
            ) : (
              <ul role="list" className="divide-y divide-gray-100">
                {filteredPages.map((page) => (
                  <li 
                    key={page._id} 
                    onClick={() => handleSelectPage(page)}
                    className={`p-4 transition-colors cursor-pointer ${selectedPage?._id === page._id ? 'bg-navy/5 border-l-4 border-navy' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${selectedPage?._id === page._id ? 'text-navy' : 'text-gray-900'}`}>{page.title}</p>
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Published
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-xs text-gray-500">/{page.identifier}</p>
                      <p className="text-xs text-gray-400">Edited {new Date(page.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedPage && !loading ? (
            <Card className="p-12 text-center shadow-sm">
              <p className="text-gray-500">Select a page from the list to edit its content.</p>
            </Card>
          ) : selectedPage && (
            <Card className="shadow-sm border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-xl">
                <div>
                  <h2 className="text-lg font-semibold text-navy">Editing: {selectedPage.title}</h2>
                  <span className="text-sm text-gray-500">/{selectedPage.identifier}</span>
                </div>
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-navy text-white hover:bg-navy/90"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin text-gold" /> : <Save className="h-4 w-4 text-gold" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              <div className="p-6 space-y-8">
                {selectedPage.identifier === 'about' && renderAboutEditor()}
                {selectedPage.identifier === 'services' && renderServicesEditor()}
                {selectedPage.identifier === 'faq' && renderFaqEditor()}
                {selectedPage.identifier === 'privacy-policy' && renderPrivacyPolicyEditor()}
                {selectedPage.identifier === 'contact' && renderContactEditor()}
                
                {/* Fallback for unknown identifiers */}
                {['about', 'services', 'faq', 'privacy-policy', 'contact'].indexOf(selectedPage.identifier) === -1 && (
                  <p className="text-gray-500 italic">No custom editor found for this page type. Data can only be modified via database.</p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
