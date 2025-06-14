'use client';

import './globals.css';        
import AmplifyConfig from './AmplifyConfig';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* runs once on every page before anything else so incase dashboard is gone to first.*/}
        <AmplifyConfig />
        {children}
      </body>
    </html>
  );
}
