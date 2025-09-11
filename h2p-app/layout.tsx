import { Header } from '@/components/ui/header'
import { MobileNavigation } from '@/components/ui/mobile-navigation'
import React, { ReactNode, Suspense } from 'react'
import Providers from '@/app/Provider'

const AppLayoutH2P = ({children}: {children: ReactNode}) => {

  return (
    <div className='min-h-screen flex flex-col'>
      <Providers>
        <Suspense>
          <Header/>
        </Suspense>
        {children}
        <Suspense>
          <MobileNavigation/>
        </Suspense>
      </Providers>
    </div>
  )
}

export default AppLayoutH2P