'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AccountSettingsForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchAPI('/auth/me');
        if (data && data.data && data.data.user) {
          setName(data.data.user.name || '');
          setEmail(data.data.user.email || '');
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = { name, email };
      if (password) {
        payload.password = password;
      }

      await fetchAPI('/auth/update-me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      toast.success('Account settings updated successfully!');
      setPassword(''); // Clear password field after successful update
    } catch (error: any) {
      toast.error(error.message || 'Failed to update account settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Card className="shadow-sm border-gray-100">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-medium text-navy">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="border-b border-gray-100 pb-4">
        <CardTitle className="text-lg font-medium text-navy">Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@borderlessafro.com"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password to change (leave blank to keep current)"
                minLength={8}
              />
            </div>
            
            <div className="sm:col-span-2 flex justify-end mt-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-navy hover:bg-navy/90 text-white"
              >
                {isLoading ? 'Saving...' : 'Save Account Settings'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
