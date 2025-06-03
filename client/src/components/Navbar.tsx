
import Link from "next/link"
import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';

const NAVBAR_HEIGHT = 52;
const Navbar = () => {
    return (
      <div
        className="fixed top-0 left-0 w-full z-50 shadow-xl bg-primary-700 text-white"
        style={{ height: `${NAVBAR_HEIGHT}px` }}
      >
        {/* Flexbox ensures vertical centering */}
        <div className="flex items-center justify-between h-full px-6 md:px-8">
          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-3">
                <div className="group text-xl font-bold leading-none hover:!text-primary-300">
                    TARGET&nbsp;
                    <span className="text-secondary-500 font-light group-hover:!text-primary-300">
                        STOCK-BOT
                    </span>
                </div>
            </div>
          </Link>
          <p className="text-primary-200 hidden md:block">
            Discover your perfect rental apartment with our advanced search
          </p>
          <div className="flex items-center gap-5">
            <Link href="/signin">
                <Button variant="outline"
                className="text-white boarder-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >Sign In</Button>
            </Link>
            <Link href="/signup">
                <Button variant="secondary"
                className="bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                >Sign Up</Button>
            </Link>
          </div>
        </div>
        
      </div>
    );
  };
  

export default Navbar;