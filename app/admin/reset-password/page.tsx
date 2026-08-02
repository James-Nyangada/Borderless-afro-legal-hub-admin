'use client';

import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing password reset token.');
      router.push('/admin/login');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      await fetchAPI(`/auth/reset-password/${token}`, {
        method: 'PATCH',
        body: JSON.stringify({ password }),
      });
      
      toast.success('Password successfully reset!');
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password. The token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckCircle2 className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Password Reset Successful</h3>
          <p className="mt-2 text-sm text-gray-500">
            Your password has been reset. You will be redirected to the login page shortly.
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/admin/login"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors"
          >
            Go to login now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-navy focus:border-navy p-2.5 border"
            placeholder="Min 8 characters"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-navy focus:border-navy p-2.5 border"
            placeholder="Must match new password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Resetting password...' : 'Reset Password'}
          {!loading && <ArrowRight className="ml-2 -mr-1 h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen bg-gray-50 flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-navy text-white shadow-lg">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-full mx-auto mb-6 object-cover" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-navy">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-navy/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <Suspense fallback={<div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy"></div></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
