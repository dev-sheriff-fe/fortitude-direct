import { Header } from '@/components/ui/header'
import { MobileNavigation } from '@/components/ui/mobile-navigation'
import React, { ReactNode, Suspense } from 'react'
import AppLayoutFortitude from '../../../fortitude-app/layout'
import AppLayoutH2P from '../../../h2p-app/layout'
import Providers from '@/app/Provider'

const AppLayout = ({children}: {children: ReactNode}) => {

  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude'){
    return (
        <AppLayoutFortitude>{children}</AppLayoutFortitude>
    );
  }
  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p'){
    return (
        <AppLayoutH2P>{children}</AppLayoutH2P>
    );
  }

  if (process.env?.NEXT_PUBLIC_STORE_FRONT === 'theme1'){
    return (
        <AppLayoutH2P>{children}</AppLayoutH2P>
    );
  }
}

export default AppLayout