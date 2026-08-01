'use client';

import Link from 'next/link';
import Image from "next/image";
import { Zap, ShieldCheck, Lock, ArrowRight, FileText, Users, Mail, Settings, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('admin_authenticated');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-navy font-sans flex flex-col justify-between selection:bg-cream selection:text-navy">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-xl object-cover shadow-md" />
            <div>
              <span className="text-xl font-bold text-navy block leading-tight">Borderless Afro</span>
              <span className="text-xs uppercase tracking-widest text-gold font-semibold block">Legal Hub • Admin Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-navy-2 transition-all hover:shadow-lg"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream/40 via-white to-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-navy/5 px-4 py-1.5 text-xs font-semibold text-navy ring-1 ring-inset ring-navy/10 mb-6">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Authorized Admin Management Portal
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-navy sm:text-5xl lg:text-6xl leading-tight">
                Control & Management Hub for <span className="text-gold">Borderless Afro Legal</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
                Manage blog articles, legal consultations, newsletter subscribers, comments, team permissions, and core site settings from a unified secure workspace.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={isAuthenticated ? "/admin" : "/admin/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-navy px-8 py-4 text-base font-semibold text-white shadow-xl hover:bg-navy-2 transition-all hover:-translate-y-0.5 group"
                >
                  <Lock className="h-5 w-5 text-gold group-hover:scale-110 transition-transform" />
                  {isAuthenticated ? "Open Dashboard" : "Log in to Admin Dashboard"}
                  <ChevronRight className="h-5 w-5 text-gold group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> System Operational
                </span>
                <span>•</span>
                <span>Role-Based Access Control</span>
                <span>•</span>
                <span>256-Bit Encrypted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">Admin Portal Capabilities</h2>
              <p className="mt-2 text-sm text-gray-500">Everything required to maintain and publish legal insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4">
                  <FileText className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Content Publishing</h3>
                <p className="text-sm text-gray-600">Full rich-text editor with scheduled posts, tags, categories, and SEO controls.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4">
                  <Mail className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Legal Consultations</h3>
                <p className="text-sm text-gray-600">Inbox management for contact forms, client inquiries, and media requests.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Subscribers & Team</h3>
                <p className="text-sm text-gray-600">Newsletter audience tracking, CSV exports, and granular team roles.</p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-navy/5 flex items-center justify-center text-navy mb-4">
                  <Settings className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-navy mb-2">Global Settings</h3>
                <p className="text-sm text-gray-600">Configure site branding, static pages, FAQ items, and media uploads.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-8 border-t border-navy-2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Borderless Afro Legal Hub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-gold transition-colors">Admin Login</Link>
            <span>•</span>
            <span className="text-gray-500">Internal Use Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
