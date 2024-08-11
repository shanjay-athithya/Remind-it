'use client';

import { SessionProvider } from 'next-auth/react';
import { MyProvider } from '../components/MyProvider'; // Adjust the path as needed
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <MyProvider>
            {children}
          </MyProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
