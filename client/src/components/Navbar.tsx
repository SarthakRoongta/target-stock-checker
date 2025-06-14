'use client';

import Link from 'next/link';
import React from 'react';
import { Button } from './ui/button';

const NAVBAR_HEIGHT = 52;

export default function Navbar() {
  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl bg-primary-100 text-[#CC0000]"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex items-center justify-between h-full px-6 md:px-8">
        <Link href="/" className="cursor-pointer hover:!text-primary-300">
          <div className="group text-xl font-bold leading-none">
            TARGET STOCK-BOT
          </div>
        </Link>
        <p className="text-primary-700 hidden md:block">Get your items!</p>
        <div className="flex items-center gap-5">
          <Link href="/auth/signin" passHref>
            <Button
              variant="outline"
              className="text-black border-black bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button
              variant="secondary"
              className="bg-[#CC0000] hover:bg-white hover:text-primary-700 rounded-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
