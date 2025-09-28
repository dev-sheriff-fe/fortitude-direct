import { Suspense } from 'react'
import HomePageH2P from '../../../h2p-app/page'
import HomePageFortitiude from '../../../fortitude-app/homepage'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p' ? 'Help2pay | home' : 'Fortitude | home'
}

const HomePage = () => {
  
  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p') {
    return <Suspense><HomePageH2P /></Suspense>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude') {
    return <Suspense><HomePageFortitiude /></Suspense>
  }

}

export default HomePage