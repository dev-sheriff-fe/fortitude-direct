'use client'
import Loader from '@/components/ui/loader'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import HomePageH2P from '../../../h2p-app/page'
import HomeFortitude from '../../../fortitude-app/page'

const Home = dynamic(() => import('./page-content'), {
  ssr: false,
  loading: () => <Loader text='Loading home page...' />
})

const HomePage = () => {
  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'h2p'){
    return <HomePageH2P/>
  }

  if (process?.env?.NEXT_PUBLIC_STORE_FRONT === 'fortitude'){
    return <HomeFortitude/>
  }

}

export default HomePage