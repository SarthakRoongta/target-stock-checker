
import Link from "next/link"
import React from 'react'
import Image from 'next/image';
import { Button } from './ui/button';

const NAVBAR_HEIGHT = 52;
const Navbar = () => {
    return (
      <div
        className="fixed top-0 left-0 w-full z-50 shadow-xl bg-primary-100 text-[#CC0000]"
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
                    TARGET STOCK-BOT
                </div>
            </div>
          </Link>
          <p className="text-primary-700 hidden md:block">
            Get your items!
          </p>
          <div className="flex items-center gap-5">
            <Link href="/signin">
                <Button variant="outline"
                className="text-black boarder-black bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >Sign In</Button>
            </Link>
            <Link href="/signup">
                <Button variant="secondary"
                className="bg-[#CC0000] hover:bg-white hover:text-primary-700 rounded-lg"
                >Sign Up</Button>
            </Link>
          </div>
        </div>
        
      </div>
    );
  };
  

export default Navbar;