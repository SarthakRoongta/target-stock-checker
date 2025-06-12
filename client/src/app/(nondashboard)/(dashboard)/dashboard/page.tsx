'use client';

import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

export default function DashboardPage() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}</h1>
          <p className="text-lg mb-4">You're now in your dashboard.</p>
          <button
            onClick={signOut}
            className="bg-[#CC0000] text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Sign out
          </button>
        </div>
      )}
    </Authenticator>
  );
}
