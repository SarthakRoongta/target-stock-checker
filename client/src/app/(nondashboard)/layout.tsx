import Navbar from '@/components/Navbar'
import React from 'react'
const NAVBAR_HEIGHT=52;
const Layout = ({children}: {children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
        <Navbar />
        <main className={`h-full flex w-full flex-col`}
        style = {{ paddingTop: `${NAVBAR_HEIGHT}px`}}>
            {children}
        </main>
    </div>
  )
}

export default Layout