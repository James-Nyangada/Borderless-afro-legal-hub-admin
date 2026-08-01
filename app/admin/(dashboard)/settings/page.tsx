import { Save, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-navy">Site Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage global site configuration, SEO defaults, and contact information.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0">
          <Button className="bg-navy hover:bg-navy/90 text-white shadow-sm w-full sm:w-auto">
            <Save className="-ml-1 mr-2 h-4 w-4 text-gold" aria-hidden="true" />
            Save All Settings
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-medium text-navy">General</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  type="text"
                  name="site-name"
                  id="site-name"
                  defaultValue="Borderless Afro Legal Hub"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  type="text"
                  name="tagline"
                  id="tagline"
                  defaultValue="Navigating legal complexities across Africa."
                />
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-navy rounded-lg flex items-center justify-center text-gold font-bold text-xl">
                    B
                  </div>
                  <Button variant="outline">
                    Change
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-navy rounded-sm flex items-center justify-center text-gold font-bold text-xs">
                    B
                  </div>
                  <Button variant="outline">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        {/* SEO Defaults */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-medium text-navy">SEO Defaults</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="default-desc">Default Meta Description</Label>
                <textarea
                  id="default-desc"
                  rows={3}
                  defaultValue="Borderless Afro Legal Hub provides insights, updates, and consultations on cross-border legal matters, tech, and IP across Africa."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
                <p className="mt-2 text-xs text-gray-500">This will be used when a specific page or post doesn't have a custom description.</p>
              </div>

              <div className="space-y-2">
                <Label>Default Social Share Image</Label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-300 hover:border-navy px-6 py-10 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className="text-center">
                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400 group-hover:text-navy transition-colors" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center items-center">
                      <span className="font-semibold text-navy hover:text-navy/80 focus-within:outline-none">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-500 mt-2">1200x630 PNG or JPG recommended</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
