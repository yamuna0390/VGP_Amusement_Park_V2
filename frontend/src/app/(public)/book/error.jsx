'use client';

import { useEffect } from 'react';

export default function BookError({ error, reset }) {
  useEffect(() => {
    console.error('Booking module error:', error);
  }, [error]);

  return (
    <div className="flex flex-col justify-center items-center h-64 p-4 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error?.message || 'An unexpected error occurred in the booking module.'}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Try again
      </button>
    </div>
  );
}
