import { Save } from 'lucide-react';
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



        {/* Account Settings */}
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-medium text-navy">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Admin Name"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="admin@borderlessafro.com"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter new password to change"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
