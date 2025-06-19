'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Authenticator>
  {({ user, signOut }) => {
    const handleSignOut = async () => {
      if (signOut) {
        await signOut();
        router.push('/');
      }
    };

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
          Loading...
        </div>
      );
    }

    return (
      <div className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.username}</h1>
          <button
            onClick={handleSignOut}
            className="bg-[#CC0000] text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sign out
          </button>
        </div>

        {children}
      </div>
    );
  }}
</Authenticator>

  );
}
