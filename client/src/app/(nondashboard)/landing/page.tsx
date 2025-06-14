'use client';

import Link from 'next/link';
import React from 'react';

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to Target Stock-Bot</h1>
      <p className="text-lg text-center max-w-xl mb-6">
        Automatically track and get notified when products are back in stock at Target.&nbsp;
        Sign up now to get started!
      </p>
      <div className="flex gap-4">
        <Link href="/auth/signup">
          <button className="bg-[#CC0000] text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Get Started
          </button>
        </Link>
        <Link href="/learn-more">
          <button className="border border-[#CC0000] text-[#CC0000] px-6 py-2 rounded-lg hover:bg-[#CC0000] hover:text-white">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
