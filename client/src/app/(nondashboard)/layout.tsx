'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const NAVBAR_HEIGHT = 52;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Authenticator.Provider>
          <div className="h-full w-full">
            <Navbar />
            <main
              className="h-full flex w-full flex-col"
              style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
            >
              {children}
            </main>
          </div>
        </Authenticator.Provider>
      </body>
    </html>
  );
};

export default Layout;
