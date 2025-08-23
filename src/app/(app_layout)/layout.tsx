import { Header } from '@/components/ui/header'
import { MobileNavigation } from '@/components/ui/mobile-navigation'
import React, { ReactNode, Suspense } from 'react'

const AppLayout = ({children}: {children: ReactNode}) => {
  return (
    <div className='min-h-screen flex flex-col'>
        <Suspense>
          <Header/>
        </Suspense>
        {children}
        <Suspense>
          <MobileNavigation/>
        </Suspense>
    </div>
  )
}

export default AppLayout