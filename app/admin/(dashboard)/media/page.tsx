'use client';

import { useState } from 'react';
import { UploadCloud, Search, Trash2, Link as LinkIcon, Image as ImageIcon, Video, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function MediaLibraryPage() {
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('');

  const handleAddYoutubeLink = () => {
    if (youtubeLink.trim()) {
      const newMedia = {
        id: Date.now(),
        name: youtubeLink,
        type: 'youtube',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        usedIn: 'Unused',
      };
      setMediaFiles([newMedia, ...mediaFiles]);
      setYoutubeLink('');
      setShowYoutubeInput(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Media Library</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all uploaded images, audio, videos, and links.
          </p>
        </div>
      </div>

      {/* Upload Zone & Actions */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 border-2 border-dashed border-gray-300 hover:border-navy transition-colors cursor-pointer group shadow-sm bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[160px] p-6">
            <div className="text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 group-hover:text-navy transition-colors" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center items-center">
                <span className="font-semibold text-navy hover:text-navy/80 focus-within:outline-none">
                  Upload media
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-500 mt-2">MP4, MP3, PNG, JPG, SVG, WEBP up to 50MB</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 flex flex-col justify-center items-center text-center h-full min-h-[160px]">
            <Video className="h-10 w-10 text-red-600 mb-4" />
            <h3 className="text-sm font-semibold text-navy mb-2">Add YouTube Link</h3>
            {!showYoutubeInput ? (
              <Button
                onClick={() => setShowYoutubeInput(true)}
                className="mt-2 bg-navy text-white hover:bg-navy/90"
              >
                Add Link
              </Button>
            ) : (
              <div className="w-full mt-2 flex flex-col gap-2">
                <Input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="Paste YouTube URL..."
                />
                <div className="flex gap-2 w-full justify-center">
                  <Button
                    onClick={handleAddYoutubeLink}
                    size="sm"
                    className="bg-navy hover:bg-navy/90"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowYoutubeInput(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="relative flex-1 max-w-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <Input
                type="text"
                name="search"
                id="search"
                className="pl-9"
                placeholder="Search media..."
              />
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="All Dates">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Dates">All Dates</SelectItem>
                  <SelectItem value="October 2026">October 2026</SelectItem>
                  <SelectItem value="September 2026">September 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Media Grid or Empty State */}
          {mediaFiles.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No media found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by uploading photos, videos, audio, or adding YouTube links.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
                    <div className="flex items-center justify-center h-40 bg-gray-200 group-hover:opacity-75 transition-opacity">
                      {file.type === 'youtube' ? (
                        <Video className="h-10 w-10 text-red-500" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      )}
                    </div>
                    {/* Actions overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy/40 gap-2">
                      <Button variant="secondary" size="icon" className="h-8 w-8 text-navy hover:text-gold shadow-sm transition-colors rounded-full" title="Copy Link">
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8 shadow-sm transition-colors rounded-full" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.name}</p>
                  <div className="pointer-events-none flex flex-col text-xs text-gray-500">
                    {file.size && file.dimensions && (
                      <span>{file.size} • {file.dimensions}</span>
                    )}
                    <span className="mt-0.5">{file.date}</span>
                    <span className={`mt-0.5 font-medium ${file.usedIn === 'Unused' ? 'text-red-500' : 'text-green-600'}`}>
                      {file.usedIn}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
