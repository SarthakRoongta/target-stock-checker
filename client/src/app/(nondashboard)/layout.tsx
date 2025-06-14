'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
const NAVBAR_HEIGHT = 52

export default function NondashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="h-full w-full">
        <Navbar />
        <main
          className="h-full flex w-full flex-col"
          style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
        >
          {children}
        </main>
      </div>
  )
}
