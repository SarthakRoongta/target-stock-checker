'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import AmplifyProvider from '@/components/AmplifyProvider';

const NAVBAR_HEIGHT = 52;

export default function NondashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AmplifyProvider>
      <div className="h-full w-full">
        <Navbar />
        <main
          className="h-full flex w-full flex-col"
          style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        >
          {children}
        </main>
      </div>
    </AmplifyProvider>
  );
}
