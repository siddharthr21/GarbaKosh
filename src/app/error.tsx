'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GarbhSarthi Application Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border/80 shadow-xl rounded-3xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Something went unexpectedly
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your pregnancy data and notes are safe in your device storage. We encountered a temporary display issue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 transition-all cursor-pointer tap-bounce"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.href = '/';
            }}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted/80 text-foreground text-xs font-bold hover:bg-muted transition-all cursor-pointer tap-bounce"
          >
            <Home className="w-4 h-4" />
            <span>Reload Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}
