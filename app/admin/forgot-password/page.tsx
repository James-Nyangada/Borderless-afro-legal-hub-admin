'use client';

import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';
import { useState } from 'react';
import { fetchAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetchAPI('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      toast.success('Password reset link sent to your email!');
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-navy text-white shadow-lg">
            <Image src="/logo.jpg" alt="Logo" width={64} height={64} className="rounded-full mx-auto mb-6 object-cover" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-navy">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-navy/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          {submitted ? (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Check your email</h3>
                <p className="mt-2 text-sm text-gray-500">
                  We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>.
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/admin/login"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 rounded-lg focus:ring-navy focus:border-navy p-2.5 border"
                    placeholder="admin@borderlessafro.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-colors group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                  {!loading && <ArrowRight className="ml-2 -mr-1 h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" aria-hidden="true" />}
                </button>
              </div>
              
              <div className="mt-6 flex items-center justify-center">
                <Link href="/admin/login" className="flex items-center text-sm font-medium text-navy hover:text-gold transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
