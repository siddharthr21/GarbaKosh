'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('GarbhSarthi Global Root Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-3xl p-6 text-center space-y-4 shadow-lg">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-2xl font-bold">
            🌸
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            GarbhSarthi Sanctuary Refresh
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            A temporary rendering glitch occurred. Click reload to refresh the maternal sanctuary.
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Refresh App
          </button>
        </div>
      </body>
    </html>
  );
}
