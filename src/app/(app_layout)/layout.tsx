import { Header } from '@/components/ui/header'
import { MobileNavigation } from '@/components/ui/mobile-navigation'
import React, { ReactNode } from 'react'

const AppLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='min-h-screen flex flex-col'>
        <Header/>
        {children}
        <MobileNavigation/>
    </div>
  )
}

export default AppLayout