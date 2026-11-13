'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border/80 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Compass className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The maternal sanctuary page you are looking for does not exist or has moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all tap-bounce"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
